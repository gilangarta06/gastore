"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  PackagePlus,
  Package,
  ChevronDown,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  {
    name: "Products",
    icon: Package,
    children: [
      { name: "Add Product", href: "/admin/products/add", icon: PackagePlus },
      { name: "List Products", href: "/admin/products", icon: Package },
    ],
  },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <aside className="h-screen w-64 border-r bg-background flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold">Admin</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          // Menu dengan children
          if (item.children) {
            const isOpen = openMenu === item.name;
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    "flex items-center justify-between w-full px-2 py-2 rounded-md hover:bg-muted transition",
                    "text-sm font-semibold text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {isOpen && (
                  <div className="pl-6 space-y-1 animate-in fade-in-0 slide-in-from-top-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Button
                          key={child.name}
                          asChild
                          variant={isChildActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-2",
                            isChildActive && "font-medium"
                          )}
                        >
                          <Link href={child.href}>
                            <child.icon className="w-4 h-4" />
                            {child.name}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Menu biasa
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isActive && "font-medium"
              )}
            >
              <Link href={item.href}>
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
