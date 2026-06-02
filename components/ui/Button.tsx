import { cn } from "@/lib/utils";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand-dark text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-40",
  secondary:
    "bg-transparent text-brand-dark border border-brand-dark hover:bg-brand-faint",
  ghost:
    "bg-transparent text-neutral-600 border border-neutral-200 hover:bg-neutral-100",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3.5 py-1.5 text-xs rounded-pill",
  md: "px-5 py-2.5 text-sm rounded-btn",
  lg: "px-7 py-3 text-[15px] rounded-nav",
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  children,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <span className="animate-spin">⟳</span> : children}
    </button>
  );
}
