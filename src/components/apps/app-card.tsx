"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Clock, Star, Zap } from "lucide-react";
import type { App } from "@/lib/apps/registry";
import { getCategoryLabel } from "@/lib/apps/registry";

interface AppCardProps {
  app: App;
  onClick: (app: App) => void;
}

export function AppCard({ app, onClick }: AppCardProps) {
  return (
    <Card
      className="group h-full cursor-pointer transition-colors hover:border-forest/40"
      onClick={() => onClick(app)}
    >
      <CardContent className="flex h-full flex-col p-5">
        {/* Header: icon + name + badges */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl text-2xl",
                app.color
              )}
            >
              {app.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-fern transition-colors">
                  {app.name}
                </h3>
                {app.popular && (
                  <Star className="h-3.5 w-3.5 fill-copper text-copper" />
                )}
              </div>
              <Badge variant="default" className="mt-0.5 text-[10px]">
                {getCategoryLabel(app.category)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {app.description}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {app.gpuRequired && (
            <span className="inline-flex items-center gap-1 rounded-md bg-fern/10 px-1.5 py-0.5 text-[10px] font-medium text-fern">
              <Zap className="h-2.5 w-2.5" />
              GPU
            </span>
          )}
          {app.minGpuMemory && (
            <span className="rounded-md bg-mist px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {app.minGpuMemory}+
            </span>
          )}
          {app.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-mist px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Features (first 3) */}
        <div className="mb-4 flex-1 space-y-1">
          {app.features.slice(0, 3).map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Check className="h-3 w-3 flex-shrink-0 text-fern" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

        {/* Footer: deploy time + button */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{app.estimatedDeployTime}</span>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick(app);
            }}
          >
            Deploy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
