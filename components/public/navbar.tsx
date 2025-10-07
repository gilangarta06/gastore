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
import { Sun, Moon, Search, ReceiptText } from "lucide-react";
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
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold text-[#0956C8] dark:text-[#5EA8FF] hover:opacity-80 transition-opacity"
      >
        GA Store
      </Link>

      {/* Search (Desktop) */}
      <div className="hidden md:flex flex-1 justify-center px-4 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            className="pl-10 rounded-xl bg-muted/50 border-border focus-visible:ring-2 focus-visible:ring-[#0956C8]/40"
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
          className="md:hidden hover:bg-muted"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          className="hover:bg-muted"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-[#5EA8FF]" />
          ) : (
            <Moon className="h-5 w-5 text-[#0956C8]" />
          )}
        </Button>

        {/* Cek Transaksi */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setTransactionOpen(true)}
          className="hover:bg-[#0956C8]/10 flex items-center gap-1"
        >
          <span className="hidden md:block font-medium text-[#0956C8] dark:text-[#5EA8FF]">
            Cek Transaksi
          </span>
          <ReceiptText className="h-5 w-5 md:hidden text-[#0956C8] dark:text-[#5EA8FF]" />
        </Button>
      </div>

      {/* Search Dialog (Mobile) */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border shadow-xl rounded-2xl">
          <DialogHeader className="text-center space-y-1">
            <DialogTitle className="text-lg font-semibold text-[#0956C8] dark:text-[#5EA8FF]">
              Cari Produk
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Ketik nama produk untuk mulai mencari.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <Input
            placeholder="Cari produk..."
            className="rounded-xl focus:ring-2 focus:ring-[#0956C8]/40"
            autoFocus
          />

          <div className="mt-5 flex justify-center">
            <Button className="rounded-xl w-full sm:w-auto bg-[#0956C8] hover:bg-[#0747A5] text-white">
              Cari
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cek Transaksi Dialog */}
      <Dialog open={transactionOpen} onOpenChange={setTransactionOpen}>
        <DialogContent className="sm:max-w-sm bg-background/95 backdrop-blur-xl border-border shadow-xl rounded-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold text-[#0956C8] dark:text-[#5EA8FF]">
              Cek Transaksi
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Masukkan ID transaksi untuk melihat status pesanan Anda.
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <Input
            placeholder="Masukkan ID Transaksi"
            className="rounded-xl focus:ring-2 focus:ring-[#0956C8]/40"
          />

          <Button className="rounded-xl w-full mt-5 bg-[#0956C8] hover:bg-[#0747A5] text-white">
            Cek Sekarang
          </Button>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}