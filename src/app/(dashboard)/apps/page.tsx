"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Sparkles, LayoutGrid } from "lucide-react";
import {
  APP_REGISTRY,
  APP_CATEGORIES,
  getFeaturedApps,
  searchApps,
  getAppsByCategory,
  getCategoryCount,
} from "@/lib/apps/registry";
import type { App, AppCategory } from "@/lib/apps/registry";
import { AppCard } from "@/components/apps/app-card";
import { FeaturedAppCard } from "@/components/apps/featured-app-card";

export default function AppsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<AppCategory | "all">("all");

  const featured = getFeaturedApps();

  const filteredApps = useMemo(() => {
    let apps = searchQuery.trim()
      ? searchApps(searchQuery)
      : getAppsByCategory(activeCategory);

    // If searching, also filter by category if not "all"
    if (searchQuery.trim() && activeCategory !== "all") {
      apps = apps.filter((app) => app.category === activeCategory);
    }

    return apps;
  }, [searchQuery, activeCategory]);

  function handleAppClick(app: App) {
    router.push(`/apps/${app.id}`);
  }

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Apps</h1>
            <Badge variant="default" className="text-sm px-3 py-1">
              {APP_REGISTRY.length}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            Deploy pre-configured applications to your compute resources.
          </p>
        </div>
      </div>

      {/* Featured section -- hidden while searching */}
      {!isSearching && activeCategory === "all" && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-copper" />
            <h2 className="text-sm font-semibold text-foreground">Featured</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {featured.map((app) => (
              <FeaturedAppCard key={app.id} app={app} onClick={handleAppClick} />
            ))}
          </div>
        </div>
      )}

      {/* Search + Category tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search apps, categories, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-forest/50"
              />
            </div>

            {/* Category tabs */}
            <div className="flex rounded-lg border border-border bg-background p-0.5">
              {APP_CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat.value);
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      activeCategory === cat.value
                        ? "bg-forest text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-xs",
                        activeCategory === cat.value
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
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredApps.length} of {APP_REGISTRY.length} apps
      </div>

      {/* App grid */}
      {filteredApps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <LayoutGrid className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No apps found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or selecting a different category.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} onClick={handleAppClick} />
          ))}
        </div>
      )}
    </div>
  );
}
