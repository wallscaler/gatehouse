"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Star, Zap } from "lucide-react";
import type { App } from "@/lib/apps/registry";
import { getCategoryLabel } from "@/lib/apps/registry";

interface FeaturedAppCardProps {
  app: App;
  onClick: (app: App) => void;
}

// Map category to gradient accent for featured cards
function getGradient(app: App): string {
  switch (app.category) {
    case "ai_ml":
      return "from-purple-500/10 via-transparent to-transparent";
    case "development":
      return "from-blue-500/10 via-transparent to-transparent";
    case "desktop":
      return "from-amber-500/10 via-transparent to-transparent";
    case "games":
      return "from-green-500/10 via-transparent to-transparent";
    default:
      return "from-forest/10 via-transparent to-transparent";
  }
}

export function FeaturedAppCard({ app, onClick }: FeaturedAppCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-colors hover:border-forest/40"
      onClick={() => onClick(app)}
    >
      <CardContent
        className={cn(
          "relative p-6 bg-gradient-to-br",
          getGradient(app)
        )}
      >
        {/* Popular badge */}
        <div className="absolute right-4 top-4">
          <Badge variant="warning" className="gap-1">
            <Star className="h-3 w-3 fill-copper text-copper" />
            Popular
          </Badge>
        </div>

        {/* Icon + Title */}
        <div className="mb-4 flex items-center gap-4">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl text-3xl",
              app.color
            )}
          >
            {app.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-fern transition-colors">
              {app.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-[10px]">
                {getCategoryLabel(app.category)}
              </Badge>
              {app.gpuRequired && (
                <span className="inline-flex items-center gap-1 text-xs text-fern">
                  <Zap className="h-3 w-3" />
                  GPU Required
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          {app.description}
        </p>

        {/* Features */}
        <div className="mb-5 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {app.features.slice(0, 4).map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Check className="h-3 w-3 flex-shrink-0 text-fern" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

        {/* Tags + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {app.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-mist px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <Button
            size="sm"
            className="gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onClick(app);
            }}
          >
            Deploy
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
