"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ShoppingCart, Users, Settings, PackagePlus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  {
    name: "Products",
    icon: Package,
    children: [
      { name: "Add Product", href: "/admin/products/add", icon: PackagePlus },
      { name: "List Products", href: "/admin/products", icon: Package },
    ],
  },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 border-r bg-background flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold">Admin</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.name} className="space-y-1">
                <div className="px-2 py-2 text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </div>
                <div className="pl-6 space-y-1">
                  {item.children.map((child) => {
                    const isActive = pathname === child.href;
                    return (
                      <Button
                        key={child.name}
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-2",
                          isActive && "font-medium"
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
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-2", isActive && "font-medium")}
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
