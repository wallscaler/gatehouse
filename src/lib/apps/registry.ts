// ─── App Registry ─────────────────────────────────────────────
// Complete data model and helpers for the Apps marketplace.

// ─── Types ───────────────────────────────────────────────────

export type AppCategory = "ai_ml" | "development" | "desktop" | "games" | "tools";
export type AccessType = "web" | "api" | "vnc" | "terminal" | "game";

export interface AppParameter {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "boolean";
  required: boolean;
  default: string | number | boolean;
  options?: { value: string; label: string }[];
  description: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: AppCategory;
  icon: string;
  color: string;
  image: string;
  defaultPort: number;
  estimatedDeployTime: string;
  accessType: AccessType;
  gpuRequired: boolean;
  minGpuMemory?: string;
  features: string[];
  parameters: AppParameter[];
  tags: string[];
  popular?: boolean;
}

// ─── Category Metadata ───────────────────────────────────────

export const APP_CATEGORIES: {
  value: AppCategory | "all";
  label: string;
  icon: string;
}[] = [
  { value: "all", label: "All", icon: "grid" },
  { value: "ai_ml", label: "AI & ML", icon: "brain" },
  { value: "development", label: "Development", icon: "code" },
  { value: "desktop", label: "Desktop", icon: "monitor" },
  { value: "games", label: "Games", icon: "gamepad" },
];

// ─── App Registry ────────────────────────────────────────────

export const APP_REGISTRY: App[] = [
  // ── AI / ML ──────────────────────────────────────────────
  {
    id: "ollama-chat",
    name: "Ollama Chat",
    description:
      "ChatGPT-like interface for open-source LLMs. Beautiful UI with Open WebUI, powered by Ollama.",
    longDescription:
      "Run powerful open-source language models locally on your GPU with a polished ChatGPT-style interface. Ollama Chat bundles the Ollama inference engine with Open WebUI, giving you a beautiful, feature-rich frontend for chatting with models like Llama 3.2, Mistral, Mixtral, and more. Enjoy full privacy, zero API costs, and complete control over your AI stack. Supports multi-model switching, conversation history, system prompts, and file uploads.",
    category: "ai_ml",
    icon: "\uD83E\uDD99",
    color: "bg-purple-500/15",
    image: "ghcr.io/open-webui/open-webui:ollama",
    defaultPort: 3000,
    estimatedDeployTime: "3-5 min",
    accessType: "web",
    gpuRequired: true,
    minGpuMemory: "8 GB",
    features: [
      "ChatGPT-style conversational UI",
      "10+ supported open-source models",
      "Conversation history & export",
      "System prompt customization",
      "Multi-model switching",
      "File upload & RAG support",
      "GPU-accelerated inference",
      "Full data privacy",
    ],
    parameters: [
      {
        name: "model",
        label: "Default Model",
        type: "select",
        required: true,
        default: "llama3.2",
        options: [
          { value: "llama3.2", label: "Llama 3.2 (8B)" },
          { value: "llama3.1", label: "Llama 3.1 (8B)" },
          { value: "mistral", label: "Mistral (7B)" },
          { value: "mixtral", label: "Mixtral (8x7B)" },
          { value: "codellama", label: "Code Llama (13B)" },
          { value: "deepseek-coder", label: "DeepSeek Coder (6.7B)" },
          { value: "phi3", label: "Phi-3 (3.8B)" },
          { value: "gemma2", label: "Gemma 2 (9B)" },
          { value: "qwen2.5", label: "Qwen 2.5 (7B)" },
        ],
        description: "The model to download and load on first start.",
      },
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 3000,
        description: "The port to expose the web UI on.",
      },
    ],
    tags: ["LLM", "GPU", "Chat", "AI", "Open Source"],
    popular: true,
  },
  {
    id: "jupyter-notebook",
    name: "Jupyter Notebook",
    description:
      "GPU-accelerated Jupyter notebook with TensorFlow and PyTorch pre-installed.",
    longDescription:
      "Launch a fully-configured Jupyter notebook environment with GPU acceleration out of the box. This image comes pre-loaded with PyTorch, TensorFlow, NumPy, Pandas, scikit-learn, Matplotlib, and the full scientific Python stack. Ideal for machine learning experiments, data analysis, and research. Includes JupyterLab interface, terminal access, and automatic CUDA configuration.",
    category: "ai_ml",
    icon: "\uD83D\uDCD3",
    color: "bg-orange-500/15",
    image: "jupyter/tensorflow-notebook:latest",
    defaultPort: 8888,
    estimatedDeployTime: "2-3 min",
    accessType: "web",
    gpuRequired: false,
    features: [
      "JupyterLab & Classic Notebook interfaces",
      "PyTorch & TensorFlow pre-installed",
      "Full scientific Python stack",
      "GPU acceleration with CUDA",
      "Terminal access",
      "Git integration",
      "Extension support",
      "Persistent storage",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 8888,
        description: "The port to expose Jupyter on.",
      },
    ],
    tags: ["Jupyter", "Python", "ML", "Data Science"],
    popular: true,
  },
  {
    id: "transformer-lab",
    name: "Transformer Lab",
    description:
      "Fine-tune LLMs with a visual interface. Train, evaluate, and deploy models from your browser.",
    longDescription:
      "Transformer Lab provides a complete visual environment for fine-tuning, evaluating, and deploying large language models. Upload your datasets, configure training hyperparameters through an intuitive UI, monitor training in real-time, and evaluate your models with built-in benchmarks. Supports LoRA, QLoRA, and full fine-tuning across popular model architectures. Export your trained models or serve them directly through an API endpoint.",
    category: "ai_ml",
    icon: "\uD83E\uDD16",
    color: "bg-blue-500/15",
    image: "transformerlab/transformerlab:latest",
    defaultPort: 8338,
    estimatedDeployTime: "3-5 min",
    accessType: "web",
    gpuRequired: true,
    minGpuMemory: "16 GB",
    features: [
      "Visual fine-tuning interface",
      "LoRA & QLoRA support",
      "Real-time training metrics",
      "Built-in evaluation benchmarks",
      "Dataset management",
      "Model export & serving",
      "Hyperparameter tuning",
      "Multi-GPU training",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 8338,
        description: "The port to expose the Transformer Lab UI on.",
      },
    ],
    tags: ["Fine-tuning", "LLM", "GPU", "Training"],
  },
  {
    id: "comfyui",
    name: "ComfyUI",
    description:
      "Node-based Stable Diffusion interface for image generation workflows.",
    longDescription:
      "ComfyUI is a powerful, modular Stable Diffusion interface that lets you build complex image generation workflows using a visual node-based editor. Create sophisticated pipelines combining text-to-image, image-to-image, inpainting, upscaling, and more. Pre-loaded with popular models and custom nodes. Perfect for artists, designers, and AI researchers who need fine-grained control over their generation pipelines.",
    category: "ai_ml",
    icon: "\uD83C\uDFA8",
    color: "bg-purple-500/15",
    image: "ghcr.io/ai-dock/comfyui:latest",
    defaultPort: 8188,
    estimatedDeployTime: "4-6 min",
    accessType: "web",
    gpuRequired: true,
    minGpuMemory: "12 GB",
    features: [
      "Node-based visual workflow editor",
      "Stable Diffusion XL support",
      "Custom node ecosystem",
      "Inpainting & outpainting",
      "ControlNet integration",
      "Batch generation",
      "Workflow sharing & import",
      "Real-time preview",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 8188,
        description: "The port to expose ComfyUI on.",
      },
    ],
    tags: ["Stable Diffusion", "GPU", "Image Gen", "AI Art"],
  },

  // ── Development ──────────────────────────────────────────
  {
    id: "dev-terminal",
    name: "Dev Terminal",
    description:
      "Web-based development terminal with full Linux environment, Python, Node.js, and dev tools.",
    longDescription:
      "Get instant access to a fully-configured Linux development environment through your browser. This lightweight terminal comes pre-loaded with Python 3.11, Node.js 20, Git, Docker CLI, and essential development tools. Perfect for quick prototyping, running scripts, managing servers, or when you need a clean environment without setting up a local dev stack. Powered by ttyd for a responsive, low-latency terminal experience.",
    category: "development",
    icon: "\uD83D\uDCBB",
    color: "bg-green-500/15",
    image: "wettyoss/wetty:latest",
    defaultPort: 7681,
    estimatedDeployTime: "1-2 min",
    accessType: "terminal",
    gpuRequired: false,
    features: [
      "Full Linux terminal in browser",
      "Python 3.11 & Node.js 20",
      "Git & Docker CLI",
      "Package managers (pip, npm, apt)",
      "Low-latency connection",
      "Clipboard support",
      "Customizable shell",
      "Persistent sessions",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 7681,
        description: "The port to expose the terminal on.",
      },
      {
        name: "container_name",
        label: "Container Name",
        type: "text",
        required: false,
        default: "dev-terminal",
        description: "Custom name for your terminal container.",
      },
    ],
    tags: ["Terminal", "Linux", "Dev Tools"],
  },
  {
    id: "vscode-server",
    name: "VS Code Server",
    description:
      "Full VS Code in your browser. Code anywhere with extensions and terminal access.",
    longDescription:
      "Run the full Visual Studio Code experience directly in your browser. This deployment gives you the complete VS Code editor with extension marketplace access, integrated terminal, Git support, debugging tools, and all the features you know from the desktop app. Install your favorite extensions, customize your theme, and code from any device. Perfect for remote development, pair programming, or coding on the go.",
    category: "development",
    icon: "\uD83D\uDCDD",
    color: "bg-blue-500/15",
    image: "codercom/code-server:latest",
    defaultPort: 8080,
    estimatedDeployTime: "1-2 min",
    accessType: "web",
    gpuRequired: false,
    features: [
      "Full VS Code in the browser",
      "Extension marketplace",
      "Integrated terminal",
      "Git integration",
      "Debugging tools",
      "Multi-language support",
      "Theme customization",
      "Collaborative editing",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 8080,
        description: "The port to expose VS Code on.",
      },
      {
        name: "password",
        label: "Password",
        type: "text",
        required: false,
        default: "",
        description: "Password to protect your VS Code instance. Leave empty for token auth.",
      },
    ],
    tags: ["IDE", "VS Code", "Editor"],
  },
  {
    id: "code-server",
    name: "Code Server",
    description:
      "Lightweight code editor with terminal. Perfect for quick edits and debugging.",
    longDescription:
      "A lightweight, fast code editor accessible through your browser. Code Server provides a streamlined editing experience with syntax highlighting, file management, integrated terminal, and essential editing features. Uses fewer resources than full VS Code Server, making it ideal for quick edits, configuration changes, log inspection, and debugging sessions on remote machines.",
    category: "development",
    icon: "\uD83D\uDD27",
    color: "bg-green-500/15",
    image: "linuxserver/code-server:latest",
    defaultPort: 8443,
    estimatedDeployTime: "1-2 min",
    accessType: "web",
    gpuRequired: false,
    features: [
      "Lightweight browser-based editor",
      "Syntax highlighting",
      "Integrated terminal",
      "File manager",
      "Low resource usage",
      "Quick startup",
      "Multi-tab editing",
      "Search & replace",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 8443,
        description: "The port to expose the editor on.",
      },
    ],
    tags: ["Editor", "Lightweight", "Terminal"],
  },

  // ── Desktop ──────────────────────────────────────────────
  {
    id: "cloud-computer",
    name: "Cloud Computer",
    description:
      "Blazing fast Ubuntu desktop in your browser. Powered by Kasm -- no installs, just click and go.",
    longDescription:
      "Get a full Ubuntu desktop environment running in your browser in under a minute. Powered by Kasm Workspaces, this cloud computer gives you a complete graphical desktop with a web browser, file manager, text editors, and terminal. Perfect for running GUI applications, web browsing in isolation, or when you need a full desktop environment without local setup. Supports clipboard sharing, file uploads, and screen resolution adjustment.",
    category: "desktop",
    icon: "\uD83D\uDDA5\uFE0F",
    color: "bg-amber-500/15",
    image: "kasmweb/ubuntu-jammy-desktop:1.15.0",
    defaultPort: 6901,
    estimatedDeployTime: "2-3 min",
    accessType: "vnc",
    gpuRequired: false,
    features: [
      "Full Ubuntu desktop in browser",
      "Web browser included",
      "File manager & text editors",
      "Clipboard sharing",
      "File upload/download",
      "Adjustable resolution",
      "Audio streaming",
      "Multi-monitor support",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 6901,
        description: "The port to expose the desktop on.",
      },
    ],
    tags: ["Desktop", "Ubuntu", "GUI", "VNC"],
    popular: true,
  },

  // ── Games ────────────────────────────────────────────────
  {
    id: "minecraft-server",
    name: "Minecraft Server",
    description:
      "Host your own Minecraft server. Supports Paper, Fabric, Forge, Spigot, and Vanilla.",
    longDescription:
      "Launch your own Minecraft server with support for all major server types including Paper, Fabric, Forge, Spigot, and Vanilla. Automatically downloads and configures the latest server version with optimized settings. Supports plugins and mods, whitelist management, and automatic world backups. Configurable memory allocation and server properties. Share the server address with friends and start playing immediately.",
    category: "games",
    icon: "\u26CF\uFE0F",
    color: "bg-green-500/15",
    image: "itzg/minecraft-server:latest",
    defaultPort: 25565,
    estimatedDeployTime: "2-4 min",
    accessType: "game",
    gpuRequired: false,
    features: [
      "Paper, Fabric, Forge, Spigot, Vanilla",
      "Automatic server setup",
      "Plugin & mod support",
      "Whitelist management",
      "Automatic world backups",
      "Configurable memory",
      "RCON remote management",
      "Auto-restart on crash",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 25565,
        description: "The port to expose the Minecraft server on.",
      },
      {
        name: "server_type",
        label: "Server Type",
        type: "select",
        required: true,
        default: "PAPER",
        options: [
          { value: "PAPER", label: "Paper (Recommended)" },
          { value: "VANILLA", label: "Vanilla" },
          { value: "FABRIC", label: "Fabric" },
          { value: "FORGE", label: "Forge" },
          { value: "SPIGOT", label: "Spigot" },
        ],
        description: "The Minecraft server implementation to use.",
      },
      {
        name: "memory",
        label: "Memory",
        type: "select",
        required: true,
        default: "4G",
        options: [
          { value: "2G", label: "2 GB" },
          { value: "4G", label: "4 GB" },
          { value: "8G", label: "8 GB" },
          { value: "16G", label: "16 GB" },
        ],
        description: "Amount of memory allocated to the server JVM.",
      },
    ],
    tags: ["Minecraft", "Multiplayer", "Survival"],
  },
  {
    id: "valheim-server",
    name: "Valheim Server",
    description:
      "Viking survival multiplayer server. Explore, build, and conquer with friends.",
    longDescription:
      "Host your own Valheim dedicated server and embark on a Viking adventure with friends. Explore a procedurally generated world, build magnificent structures, craft powerful weapons, and battle mythical creatures. The server automatically manages world saves, supports password protection, and can handle up to 10 concurrent players. Includes automatic updates and crash recovery.",
    category: "games",
    icon: "\u2694\uFE0F",
    color: "bg-orange-500/15",
    image: "lloesche/valheim-server:latest",
    defaultPort: 2456,
    estimatedDeployTime: "3-5 min",
    accessType: "game",
    gpuRequired: false,
    features: [
      "Dedicated multiplayer server",
      "Up to 10 concurrent players",
      "Automatic world saves",
      "Password protection",
      "Automatic updates",
      "Crash recovery",
      "Crossplay support",
      "Mod support",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 2456,
        description: "The port to expose the Valheim server on.",
      },
      {
        name: "server_name",
        label: "Server Name",
        type: "text",
        required: true,
        default: "My Valheim Server",
        description: "The name displayed in the server browser.",
      },
      {
        name: "server_password",
        label: "Server Password",
        type: "text",
        required: true,
        default: "",
        description: "Password required to join (min 5 characters).",
      },
    ],
    tags: ["Valheim", "Multiplayer", "Survival", "Viking"],
  },
  {
    id: "terraria-server",
    name: "Terraria Server",
    description:
      "2D sandbox adventure server. Dig, fight, explore, and build with friends.",
    longDescription:
      "Set up a Terraria multiplayer server and dive into the beloved 2D sandbox adventure with friends. Explore vast worlds, battle challenging bosses, collect rare loot, and build impressive structures together. Configure world size, difficulty, and game mode to match your playstyle. The server handles world generation, automatic saves, and player management.",
    category: "games",
    icon: "\uD83C\uDF33",
    color: "bg-green-500/15",
    image: "ryshe/terraria:latest",
    defaultPort: 7777,
    estimatedDeployTime: "2-3 min",
    accessType: "game",
    gpuRequired: false,
    features: [
      "Dedicated multiplayer server",
      "Customizable world generation",
      "Multiple difficulty modes",
      "Automatic world saves",
      "Player management",
      "Mod support via tModLoader",
      "Cross-platform play",
      "Up to 16 players",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 7777,
        description: "The port to expose the Terraria server on.",
      },
      {
        name: "world_name",
        label: "World Name",
        type: "text",
        required: true,
        default: "MyWorld",
        description: "Name of the world to create or load.",
      },
      {
        name: "world_size",
        label: "World Size",
        type: "select",
        required: true,
        default: "medium",
        options: [
          { value: "small", label: "Small (4200 x 1200)" },
          { value: "medium", label: "Medium (6400 x 1800)" },
          { value: "large", label: "Large (8400 x 2400)" },
        ],
        description: "The size of the generated world.",
      },
    ],
    tags: ["Terraria", "Multiplayer", "Sandbox", "2D"],
  },
  {
    id: "factorio-server",
    name: "Factorio Server",
    description:
      "Factory building multiplayer server. Automate, optimize, and expand your industrial empire.",
    longDescription:
      "Host your own Factorio dedicated server and build sprawling automated factories with friends. Design production lines, research technologies, defend against alien creatures, and launch a rocket to win. Factorio's multiplayer is seamless -- players can join and leave at any time. The server supports save management, auto-pause when empty, and configurable game settings for the ultimate factory-building experience.",
    category: "games",
    icon: "\uD83C\uDFED",
    color: "bg-orange-500/15",
    image: "factoriotools/factorio:stable",
    defaultPort: 34197,
    estimatedDeployTime: "2-3 min",
    accessType: "game",
    gpuRequired: false,
    features: [
      "Dedicated multiplayer server",
      "Seamless drop-in/drop-out play",
      "Automatic save management",
      "Auto-pause when empty",
      "Mod support",
      "Configurable game settings",
      "RCON remote management",
      "Headless optimized",
    ],
    parameters: [
      {
        name: "port",
        label: "Port",
        type: "number",
        required: false,
        default: 34197,
        description: "The port to expose the Factorio server on.",
      },
      {
        name: "server_name",
        label: "Server Name",
        type: "text",
        required: true,
        default: "My Factorio Server",
        description: "The name displayed in the server browser.",
      },
    ],
    tags: ["Factorio", "Multiplayer", "Automation", "Strategy"],
  },
];

// ─── Helpers ─────────────────────────────────────────────────

export function getAppById(id: string): App | undefined {
  return APP_REGISTRY.find((app) => app.id === id);
}

export function getAppsByCategory(category: string): App[] {
  if (category === "all") return APP_REGISTRY;
  return APP_REGISTRY.filter((app) => app.category === category);
}

export function searchApps(query: string): App[] {
  if (!query.trim()) return APP_REGISTRY;
  const q = query.toLowerCase();
  return APP_REGISTRY.filter(
    (app) =>
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      app.category.toLowerCase().includes(q)
  );
}

export function getFeaturedApps(): App[] {
  return APP_REGISTRY.filter((app) => app.popular);
}

export function getCategoryLabel(category: AppCategory): string {
  const found = APP_CATEGORIES.find((c) => c.value === category);
  return found?.label ?? category;
}

export function getCategoryCount(category: AppCategory | "all"): number {
  if (category === "all") return APP_REGISTRY.length;
  return APP_REGISTRY.filter((app) => app.category === category).length;
}
