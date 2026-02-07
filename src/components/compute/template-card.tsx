"use client";

import { Monitor, Box, Code, Database, Globe, FlaskConical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  gpuRequired: boolean;
  minGpuMemory?: number;
  logoUrl?: string;
  onSelect?: (id: string) => void;
}

const categoryIcons: Record<string, typeof Box> = {
  ml: FlaskConical,
  "machine-learning": FlaskConical,
  ai: FlaskConical,
  web: Globe,
  database: Database,
  dev: Code,
  development: Code,
};

function getCategoryIcon(category: string) {
  const normalized = category.toLowerCase();
  return categoryIcons[normalized] || Box;
}

export function TemplateCard({
  id,
  name,
  description,
  category,
  image,
  gpuRequired,
  minGpuMemory,
  logoUrl,
  onSelect,
}: TemplateCardProps) {
  const CategoryIcon = getCategoryIcon(category);

  return (
    <Card className="flex flex-col transition-colors hover:border-forest/40">
      <CardContent className="flex flex-1 flex-col p-5">
        {/* Header: logo/icon + name */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mist">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${name} logo`}
                className="h-6 w-6 object-contain"
              />
            ) : (
              <CategoryIcon className="h-5 w-5 text-forest" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground">{name}</h3>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge>{category}</Badge>
          {gpuRequired && (
            <Badge className="bg-forest/15 text-forest">
              <Monitor className="mr-1 h-3 w-3" />
              GPU{minGpuMemory ? ` ${minGpuMemory}GB+` : ""}
            </Badge>
          )}
        </div>

        {/* Docker image */}
        <div className="mt-3 rounded-md bg-mist px-2.5 py-1.5">
          <code className="block truncate text-xs text-muted-foreground">
            {image}
          </code>
        </div>

        {/* Select button pushed to bottom */}
        <div className="mt-auto pt-4">
          <Button
            size="sm"
            className="w-full"
            onClick={() => onSelect?.(id)}
          >
            Select
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
