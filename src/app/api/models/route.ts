import { NextResponse } from "next/server";
import { getAvailableModels } from "@/lib/ai/inference";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AIModel {
  id: string;
  name: string;
  creator: string;
  category: string;
  params: string;
  license: string;
  description: string;
  popular: boolean;
  gatehouseOptimized: boolean;
}

// ---------------------------------------------------------------------------
// Gatehouse Optimized models (backed by real inference)
// ---------------------------------------------------------------------------

function getGatehouseOptimizedModels(): AIModel[] {
  const inferenceModels = getAvailableModels();
  return inferenceModels.map((m) => ({
    id: m.id,
    name: m.name,
    creator: "Gatehouse AI",
    category: "Text Generation",
    params: getParamCount(m.id),
    license: "Gatehouse Inference",
    description: m.description,
    popular: m.id === "llama-3.3-70b" || m.id === "llama-3.1-8b",
    gatehouseOptimized: true,
  }));
}

function getParamCount(modelId: string): string {
  const counts: Record<string, string> = {
    "llama-3.3-70b": "70B",
    "llama-3.1-8b": "8B",
    "mixtral-8x7b": "46.7B (MoE)",
    "gemma2-9b": "9B",
  };
  return counts[modelId] ?? "N/A";
}

// ---------------------------------------------------------------------------
// Self-hosted / community models
// ---------------------------------------------------------------------------

const COMMUNITY_MODELS: AIModel[] = [
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
    gatehouseOptimized: false,
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
    gatehouseOptimized: false,
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
    gatehouseOptimized: false,
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
    gatehouseOptimized: false,
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
    gatehouseOptimized: false,
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
    gatehouseOptimized: false,
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
    gatehouseOptimized: false,
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
    gatehouseOptimized: false,
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
    gatehouseOptimized: false,
  },
];

// ---------------------------------------------------------------------------
// GET /api/models
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Gatehouse Optimized models come first
    const allModels = [...getGatehouseOptimizedModels(), ...COMMUNITY_MODELS];

    let results = [...allModels];

    if (category && category !== "All") {
      results = results.filter(
        (m) => m.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.creator.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
