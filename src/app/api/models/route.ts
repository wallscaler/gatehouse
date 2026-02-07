import { NextResponse } from "next/server";

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
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MODELS: AIModel[] = [
  {
    id: "llama-3.2-3b",
    name: "Llama 3.2 3B",
    creator: "Meta",
    category: "Text Generation",
    params: "3B",
    license: "Apache 2.0",
    description:
      "Compact yet powerful language model optimized for efficient text generation with strong multilingual support.",
    popular: true,
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    creator: "Meta",
    category: "Text Generation",
    params: "8B",
    license: "Llama",
    description:
      "Versatile 8B parameter model with excellent reasoning and instruction-following capabilities.",
    popular: false,
  },
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
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    creator: "Mistral AI",
    category: "Text Generation",
    params: "46.7B (MoE)",
    license: "Apache 2.0",
    description:
      "Mixture-of-experts architecture delivering GPT-3.5 level performance with efficient sparse inference.",
    popular: false,
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

    let results = [...MODELS];

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
