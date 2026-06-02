"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBriefcase,
  IconChartBar,
  IconFileInvoice,
  IconInbox,
  IconLayoutDashboard,
  IconSettings,
  IconShare,
  IconUsers,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: IconLayoutDashboard, href: "/freelancer" },
  { label: "Requests", icon: IconInbox, href: "/freelancer/requests" },
  { label: "Clients", icon: IconUsers, href: "/freelancer/clients" },
  { label: "Workspaces", icon: IconBriefcase, href: "/freelancer/workspaces" },
  { label: "Documents", icon: IconFileInvoice, href: "/freelancer/documents" },
  { label: "Analytics", icon: IconChartBar, href: "/freelancer/analytics" },
  { label: "Referral", icon: IconShare, href: "/freelancer/referral" },
  { label: "Settings", icon: IconSettings, href: "/freelancer/settings" },
];

export function FreelancerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[200px] shrink-0 flex-col border-r border-white/10 bg-brand-dark text-white md:flex">
      <div className="px-4 py-5">
        <Link href="/freelancer" className="text-lg font-semibold tracking-tight">
          ClientFlow
        </Link>
        <p className="mt-1 text-xs text-white/60">Freelancer</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2 pb-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/freelancer" && pathname.startsWith(item.href));
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
      <div className="m-3 rounded-card bg-white/5 p-3 text-xs text-white/80">
        <p className="font-medium text-white">Coinest DS</p>
        <p className="mt-1">Brand greens, DM Sans / Plus Jakarta.</p>
      </div>
    </aside>
  );
}
