export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page heading skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-mist" />
        <div className="h-4 w-96 animate-pulse rounded-lg bg-mist" />
      </div>

      {/* Subscription status skeleton */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-pulse rounded bg-mist" />
          <div className="h-5 w-40 animate-pulse rounded-lg bg-mist" />
        </div>
        <div className="mt-4 h-4 w-72 animate-pulse rounded-lg bg-mist" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-pulse rounded bg-mist" />
              <div className="h-5 w-28 animate-pulse rounded-lg bg-mist" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full animate-pulse rounded-lg bg-mist" />
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-mist" />
            </div>
            <div className="mt-4 h-8 w-28 animate-pulse rounded-lg bg-mist" />
          </div>
        ))}
      </div>
    </div>
  );
}
