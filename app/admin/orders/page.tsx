"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrdersTable from "@/components/admin/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders</h2>

        {/* Button + Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ New Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Order</DialogTitle>
              <DialogDescription>
                Isi data pemesanan di bawah, lalu klik simpan.
              </DialogDescription>
            </DialogHeader>

            {/* Form Input */}
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nama Customer</Label>
                <Input id="customerName" placeholder="Masukkan nama customer" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor HP</Label>
                <Input id="phone" placeholder="08xxxxxxxxxx" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Produk</Label>
                <Input id="product" placeholder="Nama produk" />
              </div>

              <div className="space-y-2">
                <Label>Variant</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qty">Jumlah</Label>
                <Input id="qty" type="number" placeholder="1" />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel Orders */}
      <OrdersTable />
    </div>
  );
}