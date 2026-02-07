"use client";

import { cn } from "@/lib/utils";

interface BarChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
}

export function BarChart({ data, title }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  // Generate Y-axis tick values (5 ticks including 0)
  const tickCount = 4;
  const step = Math.ceil(maxValue / tickCount);
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => step * (tickCount - i));

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      )}
      <div className="flex gap-2">
        {/* Y-axis labels */}
        <div className="flex w-10 shrink-0 flex-col justify-between pb-7 text-right">
          {ticks.map((tick) => (
            <span key={tick} className="text-xs text-muted-foreground leading-none">
              {tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : tick}
            </span>
          ))}
        </div>

        {/* Bars area */}
        <div className="flex flex-1 items-end gap-2">
          {data.map((item) => {
            const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

            return (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                {/* Bar container */}
                <div className="relative flex h-48 w-full items-end justify-center">
                  <div
                    className={cn(
                      "w-full max-w-12 rounded-t-md bg-forest transition-all duration-200",
                      "hover:bg-evergreen"
                    )}
                    style={{ height: `${heightPercent}%` }}
                    title={`${item.label}: ${item.value.toLocaleString()}`}
                  />
                </div>
                {/* X-axis label */}
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
