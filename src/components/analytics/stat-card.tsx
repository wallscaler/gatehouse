import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change: number;
}

export function StatCard({ icon: Icon, value, label, change }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-mist p-2.5">
            <Icon className="h-5 w-5 text-forest" />
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-fern/15 text-fern"
                : "bg-red-500/15 text-red-400"
            )}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
