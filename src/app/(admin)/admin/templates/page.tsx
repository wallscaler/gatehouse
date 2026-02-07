"use client";

import { useState } from "react";
import {
  Plus,
  Edit3,
  X,
  Monitor,
  Check,
  FileCode,
  Tag,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  ports: string;
  gpuRequired: boolean;
  minGpuMemory: number;
  active: boolean;
}

const initialTemplates: Template[] = [
  { id: "tpl-001", name: "PyTorch 2.2", description: "Pre-configured PyTorch environment with CUDA 12.1, cuDNN 8, and common ML libraries.", category: "ML Framework", image: "pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime", ports: "8888, 6006", gpuRequired: true, minGpuMemory: 8, active: true },
  { id: "tpl-002", name: "TensorFlow 2.15", description: "TensorFlow with GPU support, Keras, and TensorBoard pre-installed.", category: "ML Framework", image: "tensorflow/tensorflow:2.15.0-gpu-jupyter", ports: "8888, 6006", gpuRequired: true, minGpuMemory: 8, active: true },
  { id: "tpl-003", name: "Ubuntu 22.04", description: "Clean Ubuntu 22.04 LTS with build essentials, Python 3.11, and SSH access.", category: "Base OS", image: "ubuntu:22.04-polaris", ports: "22, 8080", gpuRequired: false, minGpuMemory: 0, active: true },
  { id: "tpl-004", name: "Jupyter Lab", description: "JupyterLab with Python, R, and Julia kernels. Includes common data science packages.", category: "Development", image: "jupyter/datascience-notebook:latest", ports: "8888", gpuRequired: false, minGpuMemory: 0, active: true },
  { id: "tpl-005", name: "VS Code Server", description: "Code-server (VS Code in the browser) with common extensions for Python, JS, and Go.", category: "Development", image: "codercom/code-server:latest", ports: "8080", gpuRequired: false, minGpuMemory: 0, active: true },
  { id: "tpl-006", name: "ComfyUI", description: "ComfyUI node-based stable diffusion interface with model manager and custom nodes.", category: "AI Art", image: "polaris/comfyui:latest", ports: "8188", gpuRequired: true, minGpuMemory: 12, active: true },
  { id: "tpl-007", name: "Stable Diffusion WebUI", description: "Automatic1111 Stable Diffusion WebUI with SDXL support and common extensions.", category: "AI Art", image: "polaris/sd-webui:latest", ports: "7860", gpuRequired: true, minGpuMemory: 12, active: true },
  { id: "tpl-008", name: "CUDA Development", description: "NVIDIA CUDA 12.1 development toolkit with nvcc, nsight tools, and profiling utilities.", category: "Development", image: "nvidia/cuda:12.1.0-devel-ubuntu22.04", ports: "22, 8080", gpuRequired: true, minGpuMemory: 4, active: false },
];

interface EditState {
  id: string | null;
  name: string;
  description: string;
  category: string;
  image: string;
  ports: string;
  gpuRequired: boolean;
  minGpuMemory: number;
  active: boolean;
}

const emptyEdit: EditState = {
  id: null,
  name: "",
  description: "",
  category: "",
  image: "",
  ports: "",
  gpuRequired: false,
  minGpuMemory: 0,
  active: true,
};

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  function handleEdit(tpl: Template) {
    setEditing({
      id: tpl.id,
      name: tpl.name,
      description: tpl.description,
      category: tpl.category,
      image: tpl.image,
      ports: tpl.ports,
      gpuRequired: tpl.gpuRequired,
      minGpuMemory: tpl.minGpuMemory,
      active: tpl.active,
    });
    setShowAdd(false);
  }

  function handleSaveEdit() {
    if (!editing) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editing.id
          ? {
              ...t,
              name: editing.name,
              description: editing.description,
              category: editing.category,
              image: editing.image,
              ports: editing.ports,
              gpuRequired: editing.gpuRequired,
              minGpuMemory: editing.minGpuMemory,
              active: editing.active,
            }
          : t
      )
    );
    setEditing(null);
  }

  function handleAdd() {
    setShowAdd(true);
    setEditing({
      ...emptyEdit,
      id: `tpl-${Date.now()}`,
    });
  }

  function handleSaveNew() {
    if (!editing) return;
    setTemplates((prev) => [
      ...prev,
      {
        id: editing.id || `tpl-${Date.now()}`,
        name: editing.name,
        description: editing.description,
        category: editing.category,
        image: editing.image,
        ports: editing.ports,
        gpuRequired: editing.gpuRequired,
        minGpuMemory: editing.minGpuMemory,
        active: editing.active,
      },
    ]);
    setEditing(null);
    setShowAdd(false);
  }

  function toggleActive(id: string) {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  }

  const categories = Array.from(new Set(templates.map((t) => t.category)));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-moss">Template Management</h1>
          <p className="mt-1 text-muted-foreground">
            {templates.length} templates, {templates.filter((t) => t.active).length} active.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Template
        </Button>
      </div>

      {/* Edit / Add Form Card */}
      {editing && (
        <Card className="border-forest/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {showAdd ? "Add New Template" : `Editing: ${editing.name}`}
              </CardTitle>
              <button
                onClick={() => {
                  setEditing(null);
                  setShowAdd(false);
                }}
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Name
                </label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Category
                </label>
                <input
                  type="text"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="h-20 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Docker Image
                </label>
                <input
                  type="text"
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Ports
                </label>
                <input
                  type="text"
                  value={editing.ports}
                  onChange={(e) => setEditing({ ...editing, ports: e.target.value })}
                  placeholder="8888, 6006"
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Min GPU Memory (GB)
                </label>
                <input
                  type="number"
                  value={editing.minGpuMemory}
                  onChange={(e) => setEditing({ ...editing, minGpuMemory: Number(e.target.value) })}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={editing.gpuRequired}
                    onChange={(e) => setEditing({ ...editing, gpuRequired: e.target.checked })}
                    className="rounded border-border"
                  />
                  GPU Required
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    className="rounded border-border"
                  />
                  Active
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-2 border-t border-border pt-4">
            <Button
              size="sm"
              onClick={showAdd ? handleSaveNew : handleSaveEdit}
              className="gap-1"
            >
              <Check className="h-4 w-4" />
              {showAdd ? "Create Template" : "Save Changes"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditing(null);
                setShowAdd(false);
              }}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Template Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((tpl) => (
          <Card
            key={tpl.id}
            className={cn(
              "transition-colors",
              !tpl.active && "opacity-60"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-mist p-2">
                    <FileCode className="h-4 w-4 text-forest" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{tpl.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant="default">{tpl.category}</Badge>
                      {tpl.gpuRequired && (
                        <Badge variant="warning">
                          <Monitor className="mr-0.5 h-2.5 w-2.5" />
                          GPU
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(tpl.id)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    tpl.active ? "bg-fern" : "bg-mist"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      tpl.active ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {tpl.description}
              </p>
              <div className="space-y-1.5">
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {tpl.image}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  Ports: {tpl.ports}
                </div>
                {tpl.gpuRequired && (
                  <p className="text-[11px] text-muted-foreground">
                    Min VRAM: {tpl.minGpuMemory} GB
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEdit(tpl)}
                className="gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
