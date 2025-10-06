"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sun, Moon, Search, Receipt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);

  // pastikan theme hanya diakses di client
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-3
      bg-white text-black border-b border-gray-200 
      dark:bg-black dark:text-white dark:border-gray-800">

      <h2 className="text-xl font-bold">GA Store</h2>

      {/* Search Desktop */}
      <div className="hidden md:flex flex-1 justify-center px-4 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Cari produk..."
            className="pl-10 rounded-xl bg-gray-100 border border-gray-300 text-black placeholder:text-gray-500
            dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Mobile */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSearchOpen(true)}
          className="md:hidden text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme toggle */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Cek Transaksi */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setTransactionOpen(true)}
          className="text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 flex items-center gap-1"
        >
          <span className="hidden md:block font-medium">Cek Transaksi</span>
          <Receipt className="h-5 w-5 md:hidden" />
        </Button>
      </div>

      {/* Search Dialog Mobile */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md p-6 border border-border bg-background/80 backdrop-blur-xl shadow-xl rounded-2xl">
          <DialogHeader className="text-center space-y-1">
            <DialogTitle className="text-lg font-semibold">Cari Produk</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Ketik nama produk untuk mulai mencari.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <Input
            placeholder="Cari produk..."
            className="rounded-xl focus:ring-2 focus:ring-primary/40 w-full"
          />

          <div className="mt-5 flex justify-center">
            <Button className="rounded-xl w-full sm:w-auto">Cari</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cek Transaksi Dialog */}
      <Dialog open={transactionOpen} onOpenChange={setTransactionOpen}>
        <DialogContent className="sm:max-w-sm p-6 border border-border bg-background/80 backdrop-blur-xl shadow-xl rounded-2xl flex flex-col items-center text-center">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold tracking-tight">Cek Transaksi</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Masukkan ID transaksi untuk melihat status pesanan Anda.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4 w-full" />

          <Input
            placeholder="Masukkan ID Transaksi"
            className="rounded-xl focus:ring-2 focus:ring-primary/40 w-full"
          />

          <Button
            variant="default"
            className="rounded-xl w-full mt-5"
          >
            Cek Sekarang
          </Button>
        </DialogContent>
      </Dialog>
    </header>
  );
}
