"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconLayoutDashboard,
  IconMessage,
  IconSettings,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: IconLayoutDashboard, href: "/client" },
  { label: "Onboarding", icon: IconHome, href: "/client/onboarding/connect" },
  { label: "Settings", icon: IconSettings, href: "/client/settings" },
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[200px] shrink-0 flex-col border-r border-white/10 bg-brand-dark text-white md:flex">
      <div className="px-4 py-5">
        <Link href="/client" className="text-lg font-semibold tracking-tight">
          ClientFlow
        </Link>
        <p className="mt-1 text-xs text-white/60">Client portal</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2 pb-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/client" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-nav px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-white/12 text-white" : "text-white/80 hover:bg-white/8"
              )}
            >
              <Icon size={20} stroke={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 flex items-center gap-2 rounded-card bg-white/5 p-3 text-xs text-white/80">
        <IconMessage size={18} />
        Chat & milestones live in each workspace.
      </div>
    </aside>
  );
}
