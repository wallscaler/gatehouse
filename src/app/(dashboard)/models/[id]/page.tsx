"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Copy,
  Check,
  Cpu,
  Globe,
  Scale,
  DollarSign,
  Zap,
  ChevronRight,
  Star,
  FileText,
  BarChart3,
  Terminal,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ModelDetail {
  id: string;
  name: string;
  creator: string;
  category: string;
  params: string;
  license: string;
  description: string;
  popular: boolean;
  architecture: string;
  trainingData: string;
  useCases: string[];
  benchmarks: { gpu: string; tokensPerSec: number }[];
}

interface GPUOption {
  name: string;
  pricePerHour: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const GPU_OPTIONS: GPUOption[] = [
  { name: "RTX 3090", pricePerHour: 0.85 },
  { name: "RTX 4090", pricePerHour: 1.5 },
  { name: "A100", pricePerHour: 2.8 },
  { name: "H100", pricePerHour: 4.5 },
];

const REGIONS = ["Lagos", "Nairobi", "Cape Town"];

const MODELS: Record<string, ModelDetail> = {
  "llama-3.2-3b": {
    id: "llama-3.2-3b",
    name: "Llama 3.2 3B",
    creator: "Meta",
    category: "Text Generation",
    params: "3B",
    license: "Apache 2.0",
    description:
      "Llama 3.2 3B is a compact yet powerful language model from Meta, optimized for efficient text generation with strong multilingual support. It delivers impressive reasoning and instruction-following at a fraction of the compute cost of larger models.",
    popular: true,
    architecture: "Transformer (decoder-only), RoPE, GQA",
    trainingData:
      "Trained on a diverse mix of publicly available web data, code repositories, and curated datasets totaling over 9T tokens.",
    useCases: [
      "Chatbots and conversational AI",
      "Content generation and summarization",
      "Code assistance and generation",
      "Multilingual text processing",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 45 },
      { gpu: "RTX 4090", tokensPerSec: 78 },
      { gpu: "A100", tokensPerSec: 120 },
      { gpu: "H100", tokensPerSec: 185 },
    ],
  },
  "llama-3.1-8b": {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    creator: "Meta",
    category: "Text Generation",
    params: "8B",
    license: "Llama",
    description:
      "Versatile 8B parameter model with excellent reasoning and instruction-following capabilities. Great balance of performance and efficiency for production deployments.",
    popular: false,
    architecture: "Transformer (decoder-only), RoPE, GQA, 128K context",
    trainingData:
      "Pre-trained on over 15T tokens of multilingual data, including web, code, and academic sources.",
    useCases: [
      "Long-context document analysis",
      "Tool use and function calling",
      "Multilingual content generation",
      "RAG pipelines",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 28 },
      { gpu: "RTX 4090", tokensPerSec: 52 },
      { gpu: "A100", tokensPerSec: 85 },
      { gpu: "H100", tokensPerSec: 135 },
    ],
  },
  "mistral-7b-v0.3": {
    id: "mistral-7b-v0.3",
    name: "Mistral 7B v0.3",
    creator: "Mistral AI",
    category: "Text Generation",
    params: "7B",
    license: "Apache 2.0",
    description:
      "High-performance 7B model with sliding window attention, excelling at coding and reasoning tasks. One of the most efficient models in its class.",
    popular: true,
    architecture: "Transformer (decoder-only), SWA, GQA, 32K context",
    trainingData:
      "Trained on a curated dataset of web text, code, and mathematical data.",
    useCases: [
      "Code generation and review",
      "Mathematical reasoning",
      "General text generation",
      "Fine-tuning base model",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 32 },
      { gpu: "RTX 4090", tokensPerSec: 58 },
      { gpu: "A100", tokensPerSec: 95 },
      { gpu: "H100", tokensPerSec: 148 },
    ],
  },
  "mixtral-8x7b": {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    creator: "Mistral AI",
    category: "Text Generation",
    params: "46.7B (MoE)",
    license: "Apache 2.0",
    description:
      "Mixture-of-experts architecture with 8 expert networks of 7B parameters each. Only 2 experts are active per token, delivering exceptional quality with efficient inference.",
    popular: false,
    architecture: "Sparse MoE Transformer, 8 experts, top-2 routing, 32K context",
    trainingData:
      "Trained on a large-scale multilingual corpus including web data, code, and specialized domains.",
    useCases: [
      "Complex reasoning tasks",
      "Multilingual content generation",
      "High-quality chat applications",
      "Enterprise AI assistants",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 12 },
      { gpu: "RTX 4090", tokensPerSec: 22 },
      { gpu: "A100", tokensPerSec: 45 },
      { gpu: "H100", tokensPerSec: 78 },
    ],
  },
  "deepseek-coder-v2": {
    id: "deepseek-coder-v2",
    name: "DeepSeek Coder V2",
    creator: "DeepSeek",
    category: "Code",
    params: "16B",
    license: "MIT",
    description:
      "Specialized code generation model supporting 338+ programming languages with fill-in-the-middle capability. Excels at code completion, bug fixing, and repository-level understanding.",
    popular: false,
    architecture: "Transformer (decoder-only), MoE, 128K context",
    trainingData:
      "Trained on 6T tokens of code and natural language, covering 338 programming languages and technical documentation.",
    useCases: [
      "Code completion and generation",
      "Bug detection and fixing",
      "Code explanation and review",
      "Repository-level understanding",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 20 },
      { gpu: "RTX 4090", tokensPerSec: 38 },
      { gpu: "A100", tokensPerSec: 65 },
      { gpu: "H100", tokensPerSec: 105 },
    ],
  },
  "qwen-2.5-7b": {
    id: "qwen-2.5-7b",
    name: "Qwen 2.5 7B",
    creator: "Alibaba",
    category: "Text Generation",
    params: "7B",
    license: "Apache 2.0",
    description:
      "Strong general-purpose model with excellent performance across benchmarks. Supports 29+ languages with strong coding and mathematical reasoning abilities.",
    popular: false,
    architecture: "Transformer (decoder-only), RoPE, GQA, 128K context",
    trainingData:
      "Pre-trained on 18T tokens across multiple languages and domains including code, math, and science.",
    useCases: [
      "Multilingual applications",
      "Mathematical problem solving",
      "Structured data extraction",
      "General AI assistants",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 30 },
      { gpu: "RTX 4090", tokensPerSec: 55 },
      { gpu: "A100", tokensPerSec: 90 },
      { gpu: "H100", tokensPerSec: 142 },
    ],
  },
  "stable-diffusion-xl": {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    creator: "Stability AI",
    category: "Image Generation",
    params: "6.6B",
    license: "CreativeML",
    description:
      "Industry-leading image generation model producing photorealistic and artistic images from text prompts. Features a two-stage pipeline with a base model and refiner for exceptional quality.",
    popular: true,
    architecture: "Latent Diffusion Model, U-Net, CLIP text encoders, VAE",
    trainingData:
      "Trained on a curated subset of LAION-5B with aesthetic filtering and safety annotations.",
    useCases: [
      "Photorealistic image generation",
      "Artistic and creative content",
      "Product design and prototyping",
      "Marketing and advertising visuals",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 2 },
      { gpu: "RTX 4090", tokensPerSec: 4 },
      { gpu: "A100", tokensPerSec: 6 },
      { gpu: "H100", tokensPerSec: 10 },
    ],
  },
  "flux-1-schnell": {
    id: "flux-1-schnell",
    name: "FLUX.1-schnell",
    creator: "Black Forest Labs",
    category: "Image Generation",
    params: "12B",
    license: "Apache 2.0",
    description:
      "Ultra-fast image generation model delivering high-quality outputs with significantly reduced inference time. Optimized for real-time applications.",
    popular: false,
    architecture: "Flow-based Diffusion Transformer, rectified flow",
    trainingData:
      "Trained on a large-scale dataset of high-quality images with advanced filtering.",
    useCases: [
      "Real-time image generation",
      "Interactive design tools",
      "Batch content creation",
      "Low-latency applications",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 4 },
      { gpu: "RTX 4090", tokensPerSec: 8 },
      { gpu: "A100", tokensPerSec: 12 },
      { gpu: "H100", tokensPerSec: 18 },
    ],
  },
  "whisper-large-v3": {
    id: "whisper-large-v3",
    name: "Whisper Large V3",
    creator: "OpenAI",
    category: "Audio",
    params: "1.5B",
    license: "MIT",
    description:
      "State-of-the-art automatic speech recognition model supporting 100+ languages with robust transcription accuracy. Handles diverse accents, background noise, and technical vocabulary.",
    popular: false,
    architecture: "Encoder-Decoder Transformer, log-mel spectrogram input",
    trainingData:
      "Trained on 5M hours of diverse audio data spanning 100+ languages and dialects.",
    useCases: [
      "Speech-to-text transcription",
      "Meeting and call summarization",
      "Subtitle generation",
      "Voice command interfaces",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 35 },
      { gpu: "RTX 4090", tokensPerSec: 60 },
      { gpu: "A100", tokensPerSec: 95 },
      { gpu: "H100", tokensPerSec: 150 },
    ],
  },
  "bge-m3": {
    id: "bge-m3",
    name: "BGE-M3",
    creator: "BAAI",
    category: "Embeddings",
    params: "568M",
    license: "MIT",
    description:
      "Multilingual embedding model supporting 100+ languages, ideal for semantic search, RAG pipelines, and document retrieval with multi-granularity representations.",
    popular: false,
    architecture: "Bi-encoder Transformer, multi-vector, sparse + dense",
    trainingData:
      "Trained on diverse multilingual paired data for semantic similarity and retrieval tasks.",
    useCases: [
      "Semantic search engines",
      "RAG pipeline embeddings",
      "Document clustering and deduplication",
      "Cross-lingual information retrieval",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 120 },
      { gpu: "RTX 4090", tokensPerSec: 200 },
      { gpu: "A100", tokensPerSec: 320 },
      { gpu: "H100", tokensPerSec: 480 },
    ],
  },
  "llava-1.6": {
    id: "llava-1.6",
    name: "LLaVA 1.6",
    creator: "LLaVA Team",
    category: "Vision",
    params: "13B",
    license: "Apache 2.0",
    description:
      "Multimodal vision-language model capable of understanding images and answering questions about visual content. Combines a powerful vision encoder with an LLM backbone.",
    popular: false,
    architecture: "CLIP ViT-L/14 + Vicuna-13B, linear projection",
    trainingData:
      "Trained on 1.2M image-text instruction pairs and 600K visual QA samples.",
    useCases: [
      "Image captioning and description",
      "Visual question answering",
      "Document and chart understanding",
      "Content moderation",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 15 },
      { gpu: "RTX 4090", tokensPerSec: 28 },
      { gpu: "A100", tokensPerSec: 48 },
      { gpu: "H100", tokensPerSec: 75 },
    ],
  },
  "codellama-34b": {
    id: "codellama-34b",
    name: "CodeLlama 34B",
    creator: "Meta",
    category: "Code",
    params: "34B",
    license: "Llama",
    description:
      "Large-scale code-specialized model excelling at code completion, generation, and understanding across languages. Built on Llama 2 with additional code-focused training.",
    popular: false,
    architecture: "Transformer (decoder-only), RoPE, GQA, 16K context",
    trainingData:
      "Fine-tuned on 500B tokens of code data across multiple programming languages, built on Llama 2 base.",
    useCases: [
      "Large codebase understanding",
      "Complex code generation",
      "Code refactoring and optimization",
      "Technical documentation generation",
    ],
    benchmarks: [
      { gpu: "RTX 3090", tokensPerSec: 8 },
      { gpu: "RTX 4090", tokensPerSec: 16 },
      { gpu: "A100", tokensPerSec: 32 },
      { gpu: "H100", tokensPerSec: 55 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ModelDetailPage() {
  const params = useParams();
  const modelId = params.id as string;
  const model = MODELS[modelId];

  const [selectedGpu, setSelectedGpu] = useState(1); // RTX 4090
  const [minReplicas, setMinReplicas] = useState(1);
  const [maxReplicas, setMaxReplicas] = useState(1);
  const [scaleToZero, setScaleToZero] = useState(false);
  const [region, setRegion] = useState("Lagos");
  const [codeTab, setCodeTab] = useState<"curl" | "python">("curl");
  const [copiedCode, setCopiedCode] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const gpu = GPU_OPTIONS[selectedGpu];
  const estimatedMonthly = scaleToZero
    ? gpu.pricePerHour * 8 * 30 * maxReplicas
    : gpu.pricePerHour * 24 * 30 * minReplicas;

  function handleCopyCode() {
    const code =
      codeTab === "curl" ? curlExample(modelId) : pythonExample(modelId);
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  function handleDeploy() {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      window.location.href = "/models/endpoints";
    }, 1500);
  }

  if (!model) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/models"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Model Hub
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              Model not found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              The model &quot;{modelId}&quot; could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back link */}
      <Link
        href="/models"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Model Hub
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Model header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {model.name}
                </h1>
                {model.popular && (
                  <div className="flex items-center gap-1 text-xs font-medium text-copper">
                    <Star className="h-3.5 w-3.5 fill-copper" />
                    Popular
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                by {model.creator}
              </p>
              <p className="mt-4 leading-relaxed text-foreground/90">
                {model.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="success">{model.category}</Badge>
                <Badge variant="default">{model.params} parameters</Badge>
                <Badge variant="default">{model.license}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Model card info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-forest" />
                Model Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Architecture
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {model.architecture}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Parameters
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {model.params}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  License
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {model.license}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Training Data
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {model.trainingData}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Use Cases
                </h4>
                <ul className="mt-1 space-y-1">
                  {model.useCases.map((uc) => (
                    <li
                      key={uc}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <ChevronRight className="h-3 w-3 text-forest" />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* API example */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-forest" />
                API Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 rounded-lg border border-border bg-background p-0.5">
                  {(["curl", "python"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCodeTab(tab)}
                      className={cn(
                        "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                        codeTab === tab
                          ? "bg-forest text-white"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab === "curl" ? "cURL" : "Python"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:bg-mist hover:text-foreground transition-colors"
                >
                  {copiedCode ? (
                    <Check className="h-3.5 w-3.5 text-fern" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copiedCode ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-background border border-border p-4 font-mono text-xs leading-relaxed text-foreground/90">
                {codeTab === "curl"
                  ? curlExample(modelId)
                  : pythonExample(modelId)}
              </pre>
            </CardContent>
          </Card>

          {/* Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-forest" />
                Performance Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {model.benchmarks.map((b) => {
                  const maxTok = Math.max(
                    ...model.benchmarks.map((x) => x.tokensPerSec)
                  );
                  const pct = (b.tokensPerSec / maxTok) * 100;
                  return (
                    <div key={b.gpu} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{b.gpu}</span>
                        <span className="font-medium text-foreground">
                          {model.category === "Image Generation"
                            ? `${b.tokensPerSec} img/s`
                            : `${b.tokensPerSec} tok/s`}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
                        <div
                          className="h-full rounded-full bg-forest transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Benchmarks measured with batch size 1, FP16 precision. Actual
                performance may vary depending on input length and configuration.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right column — sticky deploy sidebar */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-fern" />
                Deploy as Endpoint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* GPU selector */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  GPU
                </label>
                <div className="mt-2 space-y-2">
                  {GPU_OPTIONS.map((g, i) => (
                    <button
                      key={g.name}
                      onClick={() => setSelectedGpu(i)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors",
                        selectedGpu === i
                          ? "border-forest bg-forest/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-forest/40"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4" />
                        <span>{g.name}</span>
                      </div>
                      <span className="font-medium">
                        ${g.pricePerHour.toFixed(2)}/hr
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Replicas */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Replicas
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Min</span>
                    <select
                      value={minReplicas}
                      onChange={(e) =>
                        setMinReplicas(Number(e.target.value))
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                    >
                      {[0, 1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Max</span>
                    <select
                      value={maxReplicas}
                      onChange={(e) =>
                        setMaxReplicas(Number(e.target.value))
                      }
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                    >
                      {[1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Scale to zero toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Scale to zero
                </label>
                <button
                  onClick={() => {
                    setScaleToZero(!scaleToZero);
                    if (!scaleToZero) setMinReplicas(0);
                    else setMinReplicas(1);
                  }}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    scaleToZero ? "bg-forest" : "bg-mist"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      scaleToZero ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </button>
              </div>

              {/* Region */}
              <div>
                <label className="text-sm font-medium text-foreground">
                  Region
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                        region === r
                          ? "border-forest bg-forest/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-forest/40"
                      )}
                    >
                      <Globe className="h-3 w-3" />
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost estimate */}
              <div className="rounded-lg border border-border bg-mist p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated cost
                  </span>
                  <DollarSign className="h-4 w-4 text-copper" />
                </div>
                <p className="mt-1 text-xl font-bold text-foreground">
                  ${estimatedMonthly.toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    /month
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {gpu.name} x {scaleToZero ? maxReplicas : minReplicas} replica
                  {(scaleToZero ? maxReplicas : minReplicas) !== 1 ? "s" : ""}{" "}
                  {scaleToZero ? "(~8hr/day avg)" : "(24/7)"}
                </p>
              </div>

              {scaleToZero && (
                <p className="text-xs text-muted-foreground">
                  Scale to zero means you only pay when the endpoint receives
                  requests
                </p>
              )}

              {/* Deploy button */}
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleDeploy}
                disabled={deploying}
              >
                {deploying ? (
                  <>
                    <Scale className="h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Deploy Endpoint
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Code examples
// ---------------------------------------------------------------------------

function curlExample(modelId: string): string {
  return `curl -X POST https://api.polariscloud.ai/v1/models/${modelId}/generate \\
  -H "Authorization: Bearer gh_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Hello, how are you?",
    "max_tokens": 100,
    "temperature": 0.7
  }'`;
}

function pythonExample(modelId: string): string {
  return `import requests

response = requests.post(
    "https://api.polariscloud.ai/v1/models/${modelId}/generate",
    headers={
        "Authorization": "Bearer gh_live_...",
        "Content-Type": "application/json",
    },
    json={
        "prompt": "Hello, how are you?",
        "max_tokens": 100,
        "temperature": 0.7,
    },
)

result = response.json()
print(result["generated_text"])`;
}
