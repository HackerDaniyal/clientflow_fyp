import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-neutral-200 bg-white shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  trend,
  trendUp,
}: {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card className="p-4">
      <p className="mb-1 text-xs text-neutral-600">{label}</p>
      <p className="text-[22px] font-medium text-neutral-900">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trendUp ? "text-success" : "text-danger"
          )}
        >
          {trendUp ? "↑ " : "↓ "}
          {trend}
        </p>
      )}
    </Card>
  );
}
