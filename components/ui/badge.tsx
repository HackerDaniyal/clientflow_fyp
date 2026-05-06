import * as React from "react"

import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "success" | "warning" | "error" | "draft" | "accepted"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-700",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    draft: "badge-draft",
    accepted: "badge-accepted",
  }

  return (
    <div
      ref={ref}
      className={cn("badge", variantClasses[variant], className)}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
