"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = (workspaceId: string, base: "freelancer" | "client") => {
  const prefix = `/${base}/workspaces/${workspaceId}`;
  const all = [
    { href: `${prefix}`, label: "Overview" },
    { href: `${prefix}/assets`, label: "Assets", freelancerOnly: true },
    { href: `${prefix}/documents`, label: "Documents" },
    { href: `${prefix}/milestones`, label: "Milestones" },
    { href: `${prefix}/todos`, label: "To-Do" },
    { href: `${prefix}/chat`, label: "Chat" },
    { href: `${prefix}/time`, label: "Time", freelancerOnly: true },
    { href: `${prefix}/team`, label: "Team", freelancerOnly: true },
    { href: `${prefix}/rate`, label: "Rate", clientOnly: true },
  ];
  return all.filter((l) => {
    if ("clientOnly" in l && l.clientOnly) return base === "client";
    if ("freelancerOnly" in l && l.freelancerOnly) return base === "freelancer";
    return true;
  });
};

export function WorkspaceNav({
  workspaceId,
  base,
}: {
  workspaceId: string;
  base: "freelancer" | "client";
}) {
  const pathname = usePathname();
  const items = links(workspaceId, base);

  return (
    <nav className="flex flex-wrap gap-2 border-b border-neutral-200 bg-white px-4 py-3 md:px-6">
      {items.map((item) => {
        const isOverview = item.href === prefix;
        const active = isOverview
          ? pathname === prefix || pathname === `${prefix}/`
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-pill px-3 py-1.5 text-sm font-medium",
              active
                ? "bg-brand-dark text-white"
                : "text-neutral-600 hover:bg-brand-faint"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
