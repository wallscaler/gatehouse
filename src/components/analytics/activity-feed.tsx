import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  description: string;
  timestamp: string;
  type: "signup" | "payment" | "api_key" | "subscription" | "usage" | "settings";
}

const typeColors: Record<ActivityItem["type"], string> = {
  signup: "bg-fern",
  payment: "bg-copper",
  api_key: "bg-forest",
  subscription: "bg-lichen",
  usage: "bg-deep-moss",
  settings: "bg-muted-foreground",
};

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="space-y-1">
      <div className="max-h-[420px] overflow-y-auto pr-1">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-mist"
            >
              <div
                className={cn(
                  "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                  typeColors[item.type]
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{item.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
