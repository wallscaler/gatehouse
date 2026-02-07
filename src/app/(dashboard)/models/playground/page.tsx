"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Play,
  ChevronDown,
  Loader2,
  Clock,
  Hash,
  Code,
  MessageSquare,
  Image,
  Square,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EndpointOption {
  id: string;
  name: string;
  modelName: string;
  type: "text" | "image";
}

// ---------------------------------------------------------------------------
// Endpoint options — Gatehouse Inference backed models + mock image
// ---------------------------------------------------------------------------

const ENDPOINT_OPTIONS: EndpointOption[] = [
  { id: "llama-3.3-70b", name: "Llama 3.3 70B", modelName: "Premium Text", type: "text" },
  { id: "llama-3.1-8b", name: "Llama 3.1 8B", modelName: "Fast Text", type: "text" },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", modelName: "Reasoning", type: "text" },
  { id: "gemma2-9b", name: "Gemma 2 9B", modelName: "Efficient Text", type: "text" },
  { id: "sdxl-images", name: "SDXL", modelName: "Image Generation", type: "image" },
];

// ---------------------------------------------------------------------------
// JSON formatters — Gatehouse branded
// ---------------------------------------------------------------------------

function formatRequestJson(
  model: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number,
  temperature: number,
  topP: number,
  stream: boolean
): string {
  return JSON.stringify(
    {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      stream,
    },
    null,
    2
  );
}

function formatResponseJson(
  id: string,
  model: string,
  text: string,
  finishReason: string,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number },
  latencyMs: number
): string {
  return JSON.stringify(
    {
      id,
      object: "gatehouse.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          message: { role: "assistant", content: text },
          finish_reason: finishReason,
        },
      ],
      usage,
      latency_ms: latencyMs,
    },
    null,
    2
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINT_OPTIONS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Text generation state
  const [prompt, setPrompt] = useState("");
  const [maxTokens, setMaxTokens] = useState(512);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);

  // Image generation state (mock)
  const [imagePrompt, setImagePrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imgWidth, setImgWidth] = useState(1024);
  const [imgHeight, setImgHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7.5);

  // Output state
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [imageGenerated, setImageGenerated] = useState(false);
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [promptTokenCount, setPromptTokenCount] = useState<number | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [jsonTab, setJsonTab] = useState<"request" | "response">("request");
  const [responseId, setResponseId] = useState<string | null>(null);
  const [finishReason, setFinishReason] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Abort controller for cancelling streams
  const abortRef = useRef<AbortController | null>(null);

  const isTextMode = selectedEndpoint.type === "text";

  // ---------------------------------------------------------------------------
  // Real streaming generation for text models
  // ---------------------------------------------------------------------------

  const handleTextGenerate = useCallback(async () => {
    setGenerating(true);
    setOutput("");
    setTokenCount(null);
    setPromptTokenCount(null);
    setLatency(null);
    setResponseId(null);
    setFinishReason(null);
    setErrorMessage(null);
    setJsonTab("response");

    const controller = new AbortController();
    abortRef.current = controller;

    const startTime = performance.now();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedEndpoint.id,
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature,
          top_p: topP,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.json();
        const msg = errorBody?.error?.message ?? "Request failed";
        setErrorMessage(msg);
        setGenerating(false);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let lastId = "";
      let lastFinishReason = "";
      let lastUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
      let lastLatencyMs = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const payload = trimmed.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const chunk = JSON.parse(payload);

            if (chunk.id) lastId = chunk.id;

            const delta = chunk.choices?.[0]?.delta;
            if (delta?.content) {
              fullText += delta.content;
              setOutput(fullText);
            }

            if (chunk.choices?.[0]?.finish_reason) {
              lastFinishReason = chunk.choices[0].finish_reason;
            }

            if (chunk.usage) {
              lastUsage = chunk.usage;
            }

            if (chunk.latency_ms) {
              lastLatencyMs = chunk.latency_ms;
            }
          } catch {
            // Skip malformed SSE chunks
          }
        }
      }

      // Use server-reported latency if available, otherwise measure client-side
      const clientLatency = Math.round(performance.now() - startTime);
      const reportedLatency = lastLatencyMs > 0 ? lastLatencyMs : clientLatency;

      setResponseId(lastId);
      setFinishReason(lastFinishReason || "stop");
      setLatency(reportedLatency);
      setTokenCount(lastUsage.completion_tokens || null);
      setPromptTokenCount(lastUsage.prompt_tokens || null);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // User cancelled
        setFinishReason("cancelled");
      } else {
        setErrorMessage(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      setGenerating(false);
      abortRef.current = null;
    }
  }, [prompt, maxTokens, temperature, topP, selectedEndpoint.id]);

  // ---------------------------------------------------------------------------
  // Mock generation for image endpoint
  // ---------------------------------------------------------------------------

  const handleImageGenerate = useCallback(() => {
    setGenerating(true);
    setOutput("");
    setImageGenerated(false);
    setLatency(null);
    setErrorMessage(null);

    const delay = 2000 + Math.random() * 1000;
    setTimeout(() => {
      setImageGenerated(true);
      setLatency(Math.round(delay));
      setGenerating(false);
    }, delay);
  }, []);

  const handleGenerate = useCallback(() => {
    if (isTextMode) {
      handleTextGenerate();
    } else {
      handleImageGenerate();
    }
  }, [isTextMode, handleTextGenerate, handleImageGenerate]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // ---------------------------------------------------------------------------
  // JSON panel content
  // ---------------------------------------------------------------------------

  const requestJsonContent = isTextMode
    ? formatRequestJson(
        selectedEndpoint.id,
        [{ role: "user", content: prompt || "Hello, how are you?" }],
        maxTokens,
        temperature,
        topP,
        true
      )
    : JSON.stringify(
        {
          prompt: imagePrompt || "A beautiful landscape",
          negative_prompt: negativePrompt || "",
          width: imgWidth,
          height: imgHeight,
          steps,
          guidance_scale: guidanceScale,
        },
        null,
        2
      );

  const responseJsonContent =
    isTextMode && (output || errorMessage)
      ? errorMessage
        ? JSON.stringify({ error: { message: errorMessage, code: "inference_error" } }, null, 2)
        : formatResponseJson(
            responseId ?? "gh_gen_...",
            selectedEndpoint.id,
            output,
            finishReason ?? "stop",
            {
              prompt_tokens: promptTokenCount ?? 0,
              completion_tokens: tokenCount ?? 0,
              total_tokens: (promptTokenCount ?? 0) + (tokenCount ?? 0),
            },
            latency ?? 0
          )
      : !isTextMode && imageGenerated
        ? JSON.stringify(
            {
              id: "gh_img_" + Math.random().toString(36).slice(2, 10),
              object: "gatehouse.image_generation",
              created: Math.floor(Date.now() / 1000),
              data: [
                {
                  url: "https://api.gatehouse.cloud/v1/images/img_abc123.png",
                  revised_prompt: imagePrompt,
                },
              ],
              latency_ms: latency,
            },
            null,
            2
          )
        : "// Generate a response to see output here";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back link */}
      <Link
        href="/models/endpoints"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Endpoints
      </Link>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Model Playground
        </h1>
        <p className="mt-1 text-muted-foreground">
          Test Gatehouse AI models interactively with real inference.
        </p>
      </div>

      {/* Endpoint selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">
              Endpoint
            </label>
            <div className="relative flex-1">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-mist transition-colors"
              >
                <div className="flex items-center gap-2">
                  {selectedEndpoint.type === "text" ? (
                    <MessageSquare className="h-4 w-4 text-forest" />
                  ) : (
                    <Image className="h-4 w-4 text-copper" />
                  )}
                  <span className="font-medium">{selectedEndpoint.name}</span>
                  <span className="text-muted-foreground">
                    ({selectedEndpoint.modelName})
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </button>
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-card p-1 shadow-lg">
                    {ENDPOINT_OPTIONS.map((ep) => (
                      <button
                        key={ep.id}
                        onClick={() => {
                          setSelectedEndpoint(ep);
                          setDropdownOpen(false);
                          setOutput("");
                          setImageGenerated(false);
                          setTokenCount(null);
                          setPromptTokenCount(null);
                          setLatency(null);
                          setResponseId(null);
                          setFinishReason(null);
                          setErrorMessage(null);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-mist",
                          selectedEndpoint.id === ep.id
                            ? "text-fern"
                            : "text-foreground"
                        )}
                      >
                        {ep.type === "text" ? (
                          <MessageSquare className="h-3.5 w-3.5" />
                        ) : (
                          <Image className="h-3.5 w-3.5" />
                        )}
                        <span className="font-medium">{ep.name}</span>
                        <span className="text-muted-foreground">
                          — {ep.modelName}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Input column */}
        <div className="space-y-4 lg:col-span-2">
          {isTextMode ? (
            /* Text generation input */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4 text-forest" />
                  Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt..."
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50 resize-none"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Max Tokens: {maxTokens}
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={2048}
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(Number(e.target.value))}
                        className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-mist accent-forest"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Temperature: {temperature.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={temperature}
                        onChange={(e) =>
                          setTemperature(Number(e.target.value))
                        }
                        className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-mist accent-forest"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Top P: {topP.toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={topP}
                        onChange={(e) => setTopP(Number(e.target.value))}
                        className="h-1.5 w-32 cursor-pointer appearance-none rounded-full bg-mist accent-forest"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {generating && (
                      <Button
                        variant="ghost"
                        onClick={handleStop}
                        className="gap-2"
                      >
                        <Square className="h-4 w-4" />
                        Stop
                      </Button>
                    )}
                    <Button
                      onClick={handleGenerate}
                      disabled={generating || !prompt.trim()}
                      className="gap-2"
                    >
                      {generating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Image generation input (mock) */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Image className="h-4 w-4 text-copper" />
                  Image Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Prompt
                  </label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Negative Prompt
                  </label>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="What to avoid in the image..."
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50 resize-none"
                  />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Width
                    </label>
                    <select
                      value={imgWidth}
                      onChange={(e) => setImgWidth(Number(e.target.value))}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                    >
                      {[512, 768, 1024, 1280].map((v) => (
                        <option key={v} value={v}>
                          {v}px
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Height
                    </label>
                    <select
                      value={imgHeight}
                      onChange={(e) => setImgHeight(Number(e.target.value))}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                    >
                      {[512, 768, 1024, 1280].map((v) => (
                        <option key={v} value={v}>
                          {v}px
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Steps: {steps}
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-mist accent-forest"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">
                      Guidance: {guidanceScale.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={0.5}
                      value={guidanceScale}
                      onChange={(e) =>
                        setGuidanceScale(Number(e.target.value))
                      }
                      className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-mist accent-forest"
                    />
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={generating || !imagePrompt.trim()}
                    className="gap-2"
                  >
                    {generating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Output */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Output</CardTitle>
                <div className="flex items-center gap-3">
                  {isTextMode && tokenCount !== null && (
                    <Badge variant="default" className="gap-1">
                      <Hash className="h-3 w-3" />
                      {tokenCount} tokens
                    </Badge>
                  )}
                  {latency !== null && (
                    <Badge variant="default" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {latency}ms
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {errorMessage ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              ) : generating && !output ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-forest" />
                    <p className="text-sm text-muted-foreground">
                      Generating...
                    </p>
                  </div>
                </div>
              ) : isTextMode && output ? (
                <div className="rounded-lg border border-border bg-background p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90">
                    {output}
                    {generating && (
                      <span className="inline-block w-2 h-4 ml-0.5 bg-forest/70 animate-pulse" />
                    )}
                  </pre>
                </div>
              ) : !isTextMode && imageGenerated ? (
                <div
                  className="flex items-center justify-center rounded-lg border border-border"
                  style={{
                    aspectRatio: `${imgWidth}/${imgHeight}`,
                    maxHeight: "400px",
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-forest/20 via-copper/10 to-fern/20">
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-muted-foreground/40" />
                      <p className="mt-3 text-sm text-muted-foreground">
                        Generated image would appear here
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/60">
                        {imgWidth} x {imgHeight}px
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Play className="mb-3 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    {isTextMode
                      ? "Enter a prompt and click Generate to test Gatehouse AI inference."
                      : "Describe an image and click Generate to test your endpoint."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: JSON request/response */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Code className="h-4 w-4 text-forest" />
                  Raw JSON
                </CardTitle>
                <div className="flex gap-1 rounded-lg border border-border bg-background p-0.5">
                  {(["request", "response"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setJsonTab(tab)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        jsonTab === tab
                          ? "bg-forest text-white"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab === "request" ? "Request" : "Response"}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[500px] overflow-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed text-foreground/80">
                {jsonTab === "request"
                  ? requestJsonContent
                  : responseJsonContent}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
