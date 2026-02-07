"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Search,
  Star,
  Rocket,
  Box,
  Activity,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  Eye,
  Mic,
  Code,
  Type,
  Image,
  Zap,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ModelCategory =
  | "Text Generation"
  | "Image Generation"
  | "Embeddings"
  | "Vision"
  | "Audio"
  | "Code";

interface AIModel {
  id: string;
  name: string;
  creator: string;
  category: ModelCategory;
  params: string;
  license: string;
  description: string;
  popular: boolean;
  polarisOptimized: boolean;
}

// ---------------------------------------------------------------------------
// Model data — Polaris Optimized models first, then community
// ---------------------------------------------------------------------------

const MOCK_MODELS: AIModel[] = [
  // Polaris Optimized (real inference backing)
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    creator: "Polaris AI",
    category: "Text Generation",
    params: "70B",
    license: "Polaris Inference",
    description:
      "Flagship text model with excellent reasoning and instruction-following across diverse tasks.",
    popular: true,
    polarisOptimized: true,
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    creator: "Polaris AI",
    category: "Text Generation",
    params: "8B",
    license: "Polaris Inference",
    description:
      "Fast, lightweight model optimized for low-latency responses with strong general capabilities.",
    popular: true,
    polarisOptimized: true,
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    creator: "Polaris AI",
    category: "Text Generation",
    params: "46.7B (MoE)",
    license: "Polaris Inference",
    description:
      "Mixture-of-experts architecture delivering strong reasoning and analytical performance.",
    popular: false,
    polarisOptimized: true,
  },
  {
    id: "gemma2-9b",
    name: "Gemma 2 9B",
    creator: "Polaris AI",
    category: "Text Generation",
    params: "9B",
    license: "Polaris Inference",
    description:
      "Efficient instruction-tuned model with strong performance for its size class.",
    popular: false,
    polarisOptimized: true,
  },
  // Community / self-hosted models
  {
    id: "mistral-7b-v0.3",
    name: "Mistral 7B v0.3",
    creator: "Mistral AI",
    category: "Text Generation",
    params: "7B",
    license: "Apache 2.0",
    description:
      "High-performance 7B model with sliding window attention, excelling at coding and reasoning tasks.",
    popular: true,
    polarisOptimized: false,
  },
  {
    id: "deepseek-coder-v2",
    name: "DeepSeek Coder V2",
    creator: "DeepSeek",
    category: "Code",
    params: "16B",
    license: "MIT",
    description:
      "Specialized code generation model supporting 338+ programming languages with fill-in-the-middle capability.",
    popular: false,
    polarisOptimized: false,
  },
  {
    id: "qwen-2.5-7b",
    name: "Qwen 2.5 7B",
    creator: "Alibaba",
    category: "Text Generation",
    params: "7B",
    license: "Apache 2.0",
    description:
      "Strong general-purpose model with excellent performance on benchmarks and multilingual understanding.",
    popular: false,
    polarisOptimized: false,
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    creator: "Stability AI",
    category: "Image Generation",
    params: "6.6B",
    license: "CreativeML",
    description:
      "Industry-leading image generation model producing photorealistic and artistic images from text prompts.",
    popular: true,
    polarisOptimized: false,
  },
  {
    id: "flux-1-schnell",
    name: "FLUX.1-schnell",
    creator: "Black Forest Labs",
    category: "Image Generation",
    params: "12B",
    license: "Apache 2.0",
    description:
      "Ultra-fast image generation model delivering high-quality outputs with significantly reduced inference time.",
    popular: false,
    polarisOptimized: false,
  },
  {
    id: "whisper-large-v3",
    name: "Whisper Large V3",
    creator: "OpenAI",
    category: "Audio",
    params: "1.5B",
    license: "MIT",
    description:
      "State-of-the-art speech recognition model supporting 100+ languages with robust transcription accuracy.",
    popular: false,
    polarisOptimized: false,
  },
  {
    id: "bge-m3",
    name: "BGE-M3",
    creator: "BAAI",
    category: "Embeddings",
    params: "568M",
    license: "MIT",
    description:
      "Multilingual embedding model supporting 100+ languages, ideal for semantic search and RAG pipelines.",
    popular: false,
    polarisOptimized: false,
  },
  {
    id: "llava-1.6",
    name: "LLaVA 1.6",
    creator: "LLaVA Team",
    category: "Vision",
    params: "13B",
    license: "Apache 2.0",
    description:
      "Multimodal vision-language model capable of understanding images and answering questions about visual content.",
    popular: false,
    polarisOptimized: false,
  },
  {
    id: "codellama-34b",
    name: "CodeLlama 34B",
    creator: "Meta",
    category: "Code",
    params: "34B",
    license: "Llama",
    description:
      "Large-scale code-specialized model excelling at code completion, generation, and understanding across languages.",
    popular: false,
    polarisOptimized: false,
  },
];

const CATEGORIES = [
  "All",
  "Text Generation",
  "Image Generation",
  "Embeddings",
  "Vision",
  "Audio",
  "Code",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

function categoryBadgeClass(category: ModelCategory): string {
  switch (category) {
    case "Text Generation":
      return "bg-forest/15 text-forest";
    case "Image Generation":
      return "bg-copper/15 text-copper";
    case "Code":
      return "bg-fern/15 text-fern";
    case "Embeddings":
      return "bg-lichen/15 text-lichen";
    case "Vision":
      return "bg-copper/15 text-copper";
    case "Audio":
      return "bg-copper/15 text-copper";
  }
}

function categoryIcon(category: ModelCategory) {
  switch (category) {
    case "Text Generation":
      return <Type className="h-3.5 w-3.5" />;
    case "Image Generation":
      return <Image className="h-3.5 w-3.5" />;
    case "Code":
      return <Code className="h-3.5 w-3.5" />;
    case "Embeddings":
      return <Layers className="h-3.5 w-3.5" />;
    case "Vision":
      return <Eye className="h-3.5 w-3.5" />;
    case "Audio":
      return <Mic className="h-3.5 w-3.5" />;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ModelHubPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let items = [...MOCK_MODELS];

    if (categoryFilter !== "All") {
      items = items.filter((m) => m.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.creator.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }

    return items;
  }, [categoryFilter, searchQuery]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Model Hub</h1>
          <p className="mt-1 text-muted-foreground">
            Deploy and serve AI models as API endpoints
          </p>
        </div>
        <Link href="/models/endpoints">
          <Button className="gap-2">
            <Rocket className="h-4 w-4" />
            Deploy Model
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Available Models",
            value: String(MOCK_MODELS.length),
            icon: Box,
            iconClass: "text-forest",
          },
          {
            label: "Your Endpoints",
            value: "3",
            icon: Cpu,
            iconClass: "text-fern",
          },
          {
            label: "API Calls Today",
            value: "1,847",
            icon: Activity,
            iconClass: "text-copper",
          },
          {
            label: "Avg Latency",
            value: "142ms",
            icon: Clock,
            iconClass: "text-lichen",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <stat.icon className={cn("h-4 w-4", stat.iconClass)} />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-background p-1">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? MOCK_MODELS.length
                : MOCK_MODELS.filter((m) => m.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  categoryFilter === cat
                    ? "bg-forest text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs",
                    categoryFilter === cat
                      ? "bg-white/20 text-white"
                      : "bg-mist text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search models by name, creator, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {MOCK_MODELS.length} models
      </div>

      {/* Model grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">
              No models match your search
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or category filter.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => {
                setCategoryFilter("All");
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => (
            <Link key={model.id} href={`/models/${model.id}`}>
              <Card className={cn(
                "group h-full transition-colors hover:border-forest/40",
                model.polarisOptimized && "border-forest/20"
              )}>
                <CardContent className="flex h-full flex-col p-5">
                  {/* Top row: category + badges */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          categoryBadgeClass(model.category)
                        )}
                      >
                        {categoryIcon(model.category)}
                        {model.category}
                      </div>
                      {model.polarisOptimized && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-forest/15 px-2 py-0.5 text-xs font-semibold text-forest">
                          <Zap className="h-3 w-3" />
                          Polaris Optimized
                        </div>
                      )}
                    </div>
                    {model.popular && (
                      <div className="flex items-center gap-1 text-xs font-medium text-copper">
                        <Star className="h-3 w-3 fill-copper" />
                        Popular
                      </div>
                    )}
                  </div>

                  {/* Model name + creator */}
                  <h3 className="font-semibold text-foreground group-hover:text-fern transition-colors">
                    {model.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {model.creator}
                  </p>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {model.description}
                  </p>

                  {/* Bottom row: badges + deploy */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="default" className="text-xs">
                        {model.params}
                      </Badge>
                      <Badge
                        variant="default"
                        className="text-xs text-muted-foreground"
                      >
                        {model.license}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        if (model.polarisOptimized) {
                          window.location.href = "/models/playground";
                        } else {
                          window.location.href = `/models/${model.id}`;
                        }
                      }}
                    >
                      {model.polarisOptimized ? "Try Now" : "Deploy"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
