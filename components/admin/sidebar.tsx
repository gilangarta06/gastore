"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  PackagePlus,
  Package,
  BarChart3,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  {
    title: "Products",
    icon: Package,
    items: [
      { title: "Add Product", url: "/admin/products/add", icon: PackagePlus },
      { title: "List Products", url: "/admin/products", icon: Package },
    ],
  },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const initial: Record<string, boolean> = {};
    sidebarItems.forEach((item) => {
      if (item.items) {
        initial[item.title] = item.items.some(
          (subItem) => pathname === subItem.url
        );
      }
    });
    setOpenMenus(initial);
  }, [pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (!isMounted) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-base font-semibold">
              Admin Panel
            </SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-semibold">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = pathname === item.url;

                if (item.items) {
                  const isOpen = openMenus[item.title] || false;

                  return (
                    <SidebarMenuItem key={item.title} suppressHydrationWarning>
                      <Collapsible
                        open={isOpen}
                        onOpenChange={() => toggleMenu(item.title)}
                      >
                        <CollapsibleTrigger asChild suppressHydrationWarning>
                          <SidebarMenuButton
                            className="text-[15px] py-2"
                            suppressHydrationWarning
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronRight
                              className="ml-auto transition-transform duration-200"
                              style={{
                                transform: isOpen
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                              }}
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent suppressHydrationWarning>
                          <SidebarMenuSub className="ml-6">
                            {item.items.map((subItem) => {
                              const isSubActive = pathname === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                    className="text-sm py-1.5"
                                  >
                                    <Link href={subItem.url}>
                                      <subItem.icon className="h-3.5 w-3.5" />
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="text-[15px] py-2"
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Dark Mode Toggle */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem suppressHydrationWarning>
            <DropdownMenu>
              <DropdownMenuTrigger asChild suppressHydrationWarning>
                <SidebarMenuButton
                  className="text-[15px] py-2"
                  suppressHydrationWarning
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Theme</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
