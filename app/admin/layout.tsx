// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    console.log('🔍 Admin Layout - Checking auth for:', pathname);

    // Small delay to ensure localStorage is ready
    const timer = setTimeout(() => {
      const token = localStorage.getItem('adminToken');
      const admin = localStorage.getItem('adminData');

      console.log('Token exists:', !!token);
      console.log('Admin data exists:', !!admin);

      if (!token || !admin) {
        console.log('❌ No auth, redirecting to login');
        router.replace('/admin/login');
        return;
      }

      try {
        const parsedAdmin = JSON.parse(admin);
        console.log('✅ Authenticated as:', parsedAdmin.email);
        setAdminData(parsedAdmin);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error parsing admin data:', error);
        localStorage.clear();
        router.replace('/admin/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin/login');
  };

  // Show login page without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin layout
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="admin-theme"
    >
      <SidebarProvider>
        <div className="flex min-h-screen w-full" suppressHydrationWarning>
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div className="hidden md:block">
                    <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                  </div>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">
                        {adminData?.name || adminData?.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">
                          {adminData?.name || 'Admin'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {adminData?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              <div className="container mx-auto p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}