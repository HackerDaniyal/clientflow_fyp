import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-btn border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-brand/30 placeholder:text-neutral-400 focus:border-brand focus:ring-2",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[100px] w-full rounded-btn border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-brand/30 placeholder:text-neutral-400 focus:border-brand focus:ring-2",
        className
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-600",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
