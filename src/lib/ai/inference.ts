// ---------------------------------------------------------------------------
// Polaris AI Inference Service
// ---------------------------------------------------------------------------
// Internal service that handles text generation via the Polaris Inference
// backend. All public-facing identifiers use Polaris branding.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InferenceResult {
  id: string;
  text: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  finishReason: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  contextWindow: number;
  category: string;
  tier: string;
}

interface GenerateTextParams {
  model: string;
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Model mapping — Polaris ID to upstream provider model ID
// ---------------------------------------------------------------------------

const MODEL_MAP: Record<
  string,
  { upstreamId: string; displayName: string; contextWindow: number; description: string; tier: string }
> = {
  "llama-3.3-70b": {
    upstreamId: "llama-3.3-70b-versatile",
    displayName: "Llama 3.3 70B",
    contextWindow: 128000,
    description: "Flagship text model with excellent reasoning and instruction-following across diverse tasks.",
    tier: "Premium Text",
  },
  "llama-3.1-8b": {
    upstreamId: "llama-3.1-8b-instant",
    displayName: "Llama 3.1 8B",
    contextWindow: 131072,
    description: "Fast, lightweight model optimized for low-latency responses with strong general capabilities.",
    tier: "Fast Text",
  },
  "mixtral-8x7b": {
    upstreamId: "mixtral-8x7b-32768",
    displayName: "Mixtral 8x7B",
    contextWindow: 32768,
    description: "Mixture-of-experts architecture delivering strong reasoning and analytical performance.",
    tier: "Reasoning",
  },
  "gemma2-9b": {
    upstreamId: "gemma2-9b-it",
    displayName: "Gemma 2 9B",
    contextWindow: 8192,
    description: "Efficient instruction-tuned model with strong performance for its size class.",
    tier: "Efficient Text",
  },
};

// Reverse map: upstream model ID -> Polaris model ID
const REVERSE_MODEL_MAP: Record<string, string> = {};
for (const [plId, info] of Object.entries(MODEL_MAP)) {
  REVERSE_MODEL_MAP[info.upstreamId] = plId;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const INFERENCE_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new InferenceError(
      "Polaris Inference API key is not configured. Set the GROQ_API_KEY environment variable.",
      "configuration_error"
    );
  }
  return key;
}

function resolveUpstreamModel(polarisModelId: string): string {
  const mapping = MODEL_MAP[polarisModelId];
  if (!mapping) {
    throw new InferenceError(
      `Unknown model "${polarisModelId}". Use getAvailableModels() to see supported models.`,
      "invalid_model"
    );
  }
  return mapping.upstreamId;
}

function toPolarisModelId(upstreamModelId: string): string {
  return REVERSE_MODEL_MAP[upstreamModelId] ?? upstreamModelId;
}

function generatePolarisId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `pl_gen_${id}`;
}

function buildMessages(prompt: string, systemPrompt?: string): ChatMessage[] {
  const messages: ChatMessage[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });
  return messages;
}

// ---------------------------------------------------------------------------
// Custom error class
// ---------------------------------------------------------------------------

export class InferenceError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "InferenceError";
    this.code = code;
  }
}

function sanitizeErrorMessage(rawMessage: string): string {
  // Strip any upstream provider references from error messages
  return rawMessage
    .replace(/groq/gi, "Polaris Inference")
    .replace(/api\.groq\.com/gi, "api.polariscloud.ai")
    .replace(/openai/gi, "Polaris");
}

// ---------------------------------------------------------------------------
// Non-streaming inference
// ---------------------------------------------------------------------------

export async function generateText(params: GenerateTextParams): Promise<InferenceResult> {
  const { model, prompt, systemPrompt, maxTokens = 1024, temperature = 0.7, topP = 0.9 } = params;

  const upstreamModel = resolveUpstreamModel(model);
  const messages = buildMessages(prompt, systemPrompt);

  const startTime = performance.now();

  const response = await fetch(INFERENCE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: upstreamModel,
      messages,
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      stream: false,
    }),
  });

  const latencyMs = Math.round(performance.now() - startTime);

  if (!response.ok) {
    let errorMessage = "Polaris Inference request failed";
    try {
      const errorBody = await response.json();
      if (errorBody?.error?.message) {
        errorMessage = sanitizeErrorMessage(errorBody.error.message);
      }
    } catch {
      // Could not parse error body
    }

    if (response.status === 429) {
      throw new InferenceError("Rate limit exceeded. Please try again in a moment.", "rate_limit");
    }
    if (response.status === 401) {
      throw new InferenceError("Polaris Inference authentication failed.", "auth_error");
    }

    throw new InferenceError(errorMessage, "inference_error");
  }

  const data = await response.json();

  const choice = data.choices?.[0];
  const usage = data.usage;

  return {
    id: generatePolarisId(),
    text: choice?.message?.content ?? "",
    model: toPolarisModelId(data.model),
    usage: {
      promptTokens: usage?.prompt_tokens ?? 0,
      completionTokens: usage?.completion_tokens ?? 0,
      totalTokens: usage?.total_tokens ?? 0,
    },
    latencyMs,
    finishReason: choice?.finish_reason ?? "unknown",
  };
}

// ---------------------------------------------------------------------------
// Streaming inference
// ---------------------------------------------------------------------------

export async function generateTextStream(params: GenerateTextParams): Promise<ReadableStream> {
  const { model, prompt, systemPrompt, maxTokens = 1024, temperature = 0.7, topP = 0.9 } = params;

  const upstreamModel = resolveUpstreamModel(model);
  const messages = buildMessages(prompt, systemPrompt);
  const polarisId = generatePolarisId();
  const polarisModel = model;

  const startTime = performance.now();

  const response = await fetch(INFERENCE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: upstreamModel,
      messages,
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      stream: true,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Polaris Inference request failed";
    try {
      const errorBody = await response.json();
      if (errorBody?.error?.message) {
        errorMessage = sanitizeErrorMessage(errorBody.error.message);
      }
    } catch {
      // Could not parse error body
    }

    if (response.status === 429) {
      throw new InferenceError("Rate limit exceeded. Please try again in a moment.", "rate_limit");
    }
    if (response.status === 401) {
      throw new InferenceError("Polaris Inference authentication failed.", "auth_error");
    }

    throw new InferenceError(errorMessage, "inference_error");
  }

  const upstreamBody = response.body;
  if (!upstreamBody) {
    throw new InferenceError("No response stream received from Polaris Inference.", "stream_error");
  }

  // Transform the upstream SSE stream to rebrand identifiers
  const reader = upstreamBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;

  return new ReadableStream({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Send a final metadata event with latency and usage
            const latencyMs = Math.round(performance.now() - startTime);
            const metaEvent = `data: ${JSON.stringify({
              id: polarisId,
              object: "polaris.completion.chunk",
              model: polarisModel,
              choices: [{ delta: {}, finish_reason: "stop", index: 0 }],
              usage: {
                prompt_tokens: totalPromptTokens,
                completion_tokens: totalCompletionTokens,
                total_tokens: totalPromptTokens + totalCompletionTokens,
              },
              latency_ms: latencyMs,
            })}\n\n`;
            controller.enqueue(encoder.encode(metaEvent));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const payload = trimmed.slice(6);
            if (payload === "[DONE]") {
              // We handle DONE in the `done` block above
              continue;
            }

            try {
              const chunk = JSON.parse(payload);

              // Track usage if provided in the chunk
              if (chunk.x_groq?.usage) {
                totalPromptTokens = chunk.x_groq.usage.prompt_tokens ?? totalPromptTokens;
                totalCompletionTokens = chunk.x_groq.usage.completion_tokens ?? totalCompletionTokens;
              }
              if (chunk.usage) {
                totalPromptTokens = chunk.usage.prompt_tokens ?? totalPromptTokens;
                totalCompletionTokens = chunk.usage.completion_tokens ?? totalCompletionTokens;
              }

              // Rebrand the chunk
              const rebranded = {
                id: polarisId,
                object: "polaris.completion.chunk",
                created: chunk.created,
                model: polarisModel,
                choices: chunk.choices?.map(
                  (c: { delta?: { content?: string; role?: string }; finish_reason?: string; index?: number }) => ({
                    delta: c.delta,
                    finish_reason: c.finish_reason,
                    index: c.index,
                  })
                ),
              };

              const sse = `data: ${JSON.stringify(rebranded)}\n\n`;
              controller.enqueue(encoder.encode(sse));
            } catch {
              // Skip malformed JSON chunks
            }
          }
        }
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

// ---------------------------------------------------------------------------
// List available models
// ---------------------------------------------------------------------------

export function getAvailableModels(): ModelInfo[] {
  return Object.entries(MODEL_MAP).map(([id, info]) => ({
    id,
    name: info.displayName,
    description: info.description,
    contextWindow: info.contextWindow,
    category: "Text Generation",
    tier: info.tier,
  }));
}
