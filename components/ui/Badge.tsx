import { cn } from "@/lib/utils";

type BadgeProps = {
  status: "success" | "warning" | "danger" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
};

const styles: Record<BadgeProps["status"], string> = {
  success: "bg-brand-surface text-[#0d5c35]",
  warning: "bg-[#fff0cc] text-[#7a4f00]",
  danger: "bg-[#fde8e6] text-[#b02a1e]",
  info: "bg-[#dbeeff] text-info",
  neutral: "bg-neutral-100 text-neutral-600",
};

const dots: Record<BadgeProps["status"], string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-neutral-400",
};

export function Badge({ status, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[status])} />
      {children}
    </span>
  );
}
