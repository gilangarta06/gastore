"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sun, Moon, Receipt, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  // Load theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme) {
        setDarkMode(savedTheme === "dark");
      } else {
        setDarkMode(prefersDark);
      }
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (darkMode !== null) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

  // Skeleton ketika theme belum loaded
  if (darkMode === null) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white text-black border-b border-gray-200">
        <h2 className="text-xl font-bold">GA Store</h2>
      </header>
    );
  }

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 
      bg-white text-black border-b border-gray-200
      dark:bg-black dark:text-white dark:border-gray-800"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold">GA Store</h2>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md px-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-10 bg-gray-100 border border-gray-300 text-black placeholder:text-gray-500 
            dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleDarkMode}
          className="text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Dialog Popup */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
            >
              <Receipt className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-center text-gray-900 dark:text-white">
                Cek Transaksi
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
                Masukkan ID transaksi Anda untuk melihat status.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-4">
              <Input
                placeholder="Masukkan ID Transaksi"
                className="bg-gray-100 border border-gray-300 text-black placeholder:text-gray-500 
                dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-400"
              />
              <Button className="w-full">Cek Transaksi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
