// components/public/navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Search, ReceiptText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const isDark = (resolvedTheme ?? theme) === "dark";

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-card/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
    >
      {/* Logo with gradient */}
      <Link href="/" className="group flex items-center gap-2">
        <div className="relative">
          <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1 animate-pulse" size={12} />
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            GA Store
          </span>
        </div>
      </Link>

      {/* Search (Desktop) */}
      <div className="hidden md:flex flex-1 justify-center px-4 max-w-lg">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Cari produk..."
            className="pl-10 rounded-xl bg-muted/50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Mobile */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSearchOpen(true)}
          className="md:hidden hover:bg-primary/10 hover:text-primary"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          className="hover:bg-primary/10 hover:text-primary relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          {isDark ? (
            <Sun className="h-5 w-5 text-primary" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </Button>

        {/* Cek Transaksi */}
        <Button
          size="sm"
          onClick={() => setTransactionOpen(true)}
          className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
        >
          <ReceiptText className="h-4 w-4 mr-2" />
          <span className="hidden md:block font-medium">Cek Transaksi</span>
        </Button>
      </div>

      {/* Search Dialog (Mobile) */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md glass-card border-primary/20">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Cari Produk
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Ketik nama produk untuk mulai mencari.
            </DialogDescription>
          </DialogHeader>

          <Separator className="bg-border/50" />

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                className="pl-10 rounded-xl focus:ring-2 focus:ring-primary/40 border-border/50"
                autoFocus
              />
            </div>

            <Button className="rounded-xl w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-lg">
              Cari Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cek Transaksi Dialog */}
      <Dialog open={transactionOpen} onOpenChange={setTransactionOpen}>
        <DialogContent className="sm:max-w-sm glass-card border-primary/20">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Cek Transaksi
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Masukkan ID transaksi untuk melihat status pesanan Anda.
            </DialogDescription>
          </DialogHeader>

          <Separator className="bg-border/50" />

          <div className="space-y-4">
            <Input
              placeholder="Masukkan ID Transaksi"
              className="rounded-xl focus:ring-2 focus:ring-primary/40 border-border/50"
            />

            <Button className="rounded-xl w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-lg">
              Cek Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}