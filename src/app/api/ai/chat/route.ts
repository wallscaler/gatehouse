import { NextResponse } from "next/server";
import {
  generateText,
  generateTextStream,
  getAvailableModels,
  InferenceError,
} from "@/lib/ai/inference";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  model?: string;
  messages?: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

// ---------------------------------------------------------------------------
// POST /api/ai/chat — Gatehouse Inference chat completions
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body: ChatRequestBody = await request.json();

    const { model, messages, max_tokens, temperature, top_p, stream } = body;

    // --- Validation ---

    if (!model || typeof model !== "string") {
      return NextResponse.json(
        { error: { message: "model is required and must be a string", code: "invalid_request" } },
        { status: 400 }
      );
    }

    const availableModelIds = getAvailableModels().map((m) => m.id);
    if (!availableModelIds.includes(model)) {
      return NextResponse.json(
        {
          error: {
            message: `Unknown model "${model}". Available models: ${availableModelIds.join(", ")}`,
            code: "invalid_model",
          },
        },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: { message: "messages array is required and must not be empty", code: "invalid_request" } },
        { status: 400 }
      );
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return NextResponse.json(
          { error: { message: "Each message must have a role and content", code: "invalid_request" } },
          { status: 400 }
        );
      }
      if (!["system", "user", "assistant"].includes(msg.role)) {
        return NextResponse.json(
          { error: { message: `Invalid message role "${msg.role}"`, code: "invalid_request" } },
          { status: 400 }
        );
      }
    }

    if (max_tokens !== undefined && (typeof max_tokens !== "number" || max_tokens < 1 || max_tokens > 32768)) {
      return NextResponse.json(
        { error: { message: "max_tokens must be between 1 and 32768", code: "invalid_request" } },
        { status: 400 }
      );
    }

    if (temperature !== undefined && (typeof temperature !== "number" || temperature < 0 || temperature > 2)) {
      return NextResponse.json(
        { error: { message: "temperature must be between 0 and 2", code: "invalid_request" } },
        { status: 400 }
      );
    }

    if (top_p !== undefined && (typeof top_p !== "number" || top_p < 0 || top_p > 1)) {
      return NextResponse.json(
        { error: { message: "top_p must be between 0 and 1", code: "invalid_request" } },
        { status: 400 }
      );
    }

    // Extract user message (last user message) and optional system prompt
    const systemMsg = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1];

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: { message: "At least one user message is required", code: "invalid_request" } },
        { status: 400 }
      );
    }

    // --- Streaming response ---

    if (stream) {
      const readableStream = await generateTextStream({
        model,
        prompt: lastUserMessage.content,
        systemPrompt: systemMsg?.content,
        maxTokens: max_tokens ?? 1024,
        temperature: temperature ?? 0.7,
        topP: top_p ?? 0.9,
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    // --- Non-streaming response ---

    const result = await generateText({
      model,
      prompt: lastUserMessage.content,
      systemPrompt: systemMsg?.content,
      maxTokens: max_tokens ?? 1024,
      temperature: temperature ?? 0.7,
      topP: top_p ?? 0.9,
    });

    return NextResponse.json({
      id: result.id,
      object: "gatehouse.completion",
      created: Math.floor(Date.now() / 1000),
      model: result.model,
      choices: [
        {
          message: {
            role: "assistant",
            content: result.text,
          },
          finish_reason: result.finishReason,
        },
      ],
      usage: {
        prompt_tokens: result.usage.promptTokens,
        completion_tokens: result.usage.completionTokens,
        total_tokens: result.usage.totalTokens,
      },
      latency_ms: result.latencyMs,
    });
  } catch (error) {
    if (error instanceof InferenceError) {
      const status =
        error.code === "rate_limit"
          ? 429
          : error.code === "auth_error"
            ? 401
            : error.code === "invalid_model"
              ? 400
              : error.code === "configuration_error"
                ? 503
                : 500;

      return NextResponse.json(
        { error: { message: error.message, code: error.code } },
        { status }
      );
    }

    console.error("Gatehouse Inference error:", error);
    return NextResponse.json(
      { error: { message: "Internal inference error", code: "internal_error" } },
      { status: 500 }
    );
  }
}
