"use client";

import { useState, useCallback } from "react";
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
// Mock data
// ---------------------------------------------------------------------------

const ENDPOINT_OPTIONS: EndpointOption[] = [
  {
    id: "ep_abc123",
    name: "llama-3.2-3b-prod",
    modelName: "Llama 3.2 3B",
    type: "text",
  },
  {
    id: "ep_def456",
    name: "sdxl-images",
    modelName: "Stable Diffusion XL",
    type: "image",
  },
  {
    id: "ep_ghi789",
    name: "bge-embeddings",
    modelName: "BGE-M3",
    type: "text",
  },
];

const MOCK_TEXT_RESPONSE = `Thank you for asking! I'm doing great. As a large language model deployed on Gatehouse Cloud, I'm ready to assist you with a wide range of tasks including:

1. **Text generation** — creative writing, summaries, translations
2. **Code assistance** — debugging, code generation, explanations
3. **Analysis** — data interpretation, reasoning, problem solving
4. **Conversation** — natural dialogue on virtually any topic

How can I help you today?`;

const MOCK_REQUEST_JSON = (prompt: string, maxTokens: number, temperature: number, topP: number) =>
  JSON.stringify(
    {
      prompt,
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
    },
    null,
    2
  );

const MOCK_RESPONSE_JSON = (text: string, tokens: number, latency: number) =>
  JSON.stringify(
    {
      id: "gen_" + Math.random().toString(36).slice(2, 10),
      object: "text_completion",
      created: Math.floor(Date.now() / 1000),
      model: "llama-3.2-3b",
      choices: [
        {
          text,
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 12,
        completion_tokens: tokens,
        total_tokens: tokens + 12,
      },
      latency_ms: latency,
    },
    null,
    2
  );

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

  // Image generation state
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
  const [latency, setLatency] = useState<number | null>(null);
  const [jsonTab, setJsonTab] = useState<"request" | "response">("request");

  const isTextMode = selectedEndpoint.type === "text";

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    setOutput("");
    setImageGenerated(false);
    setTokenCount(null);
    setLatency(null);

    const delay = isTextMode
      ? 1200 + Math.random() * 800
      : 2000 + Math.random() * 1000;

    setTimeout(() => {
      if (isTextMode) {
        setOutput(MOCK_TEXT_RESPONSE);
        setTokenCount(87);
        setLatency(Math.round(delay));
      } else {
        setImageGenerated(true);
        setLatency(Math.round(delay));
      }
      setGenerating(false);
    }, delay);
  }, [isTextMode]);

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
          Test your deployed model endpoints interactively.
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
                          setLatency(null);
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
              </CardContent>
            </Card>
          ) : (
            /* Image generation input */
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
                {tokenCount !== null && latency !== null && (
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="gap-1">
                      <Hash className="h-3 w-3" />
                      {tokenCount} tokens
                    </Badge>
                    <Badge variant="default" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {latency}ms
                    </Badge>
                  </div>
                )}
                {!isTextMode && latency !== null && (
                  <Badge variant="default" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {latency}ms
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generating ? (
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
                      ? "Enter a prompt and click Generate to test your endpoint."
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
                  ? isTextMode
                    ? MOCK_REQUEST_JSON(
                        prompt || "Hello, how are you?",
                        maxTokens,
                        temperature,
                        topP
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
                      )
                  : output || imageGenerated
                    ? isTextMode
                      ? MOCK_RESPONSE_JSON(output, tokenCount ?? 0, latency ?? 0)
                      : JSON.stringify(
                          {
                            id:
                              "img_" +
                              Math.random().toString(36).slice(2, 10),
                            object: "image_generation",
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
                    : "// Generate a response to see output here"}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
