"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLayoutDashboard, IconSettings, IconUsers } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", icon: IconLayoutDashboard, href: "/admin" },
  { label: "Users", icon: IconUsers, href: "/admin/users" },
  { label: "Workspaces", icon: IconUsers, href: "/admin/workspaces" },
  { label: "Settings", icon: IconSettings, href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[200px] shrink-0 flex-col border-r border-neutral-200 bg-neutral-900 text-white md:flex">
      <div className="px-4 py-5">
        <Link href="/admin" className="text-lg font-semibold">
          ClientFlow Admin
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-nav px-3 py-2 text-sm font-medium",
                active ? "bg-white/15" : "text-white/80 hover:bg-white/10"
              )}
            >
              <Icon size={20} stroke={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
