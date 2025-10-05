"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Order {
  _id: string;
  customerName: string;
  email?: string;
  phone: string;
  productId?: string;
  variantName?: string;
  price?: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        🚫 Belum ada order masuk.
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <Table>
      <TableCaption>Daftar semua pesanan dari customer.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Produk</TableHead>
          <TableHead>Variant</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tanggal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-xs text-muted-foreground">{order.phone}</p>
              </div>
            </TableCell>
            <TableCell>{order.productId || "-"}</TableCell>
            <TableCell>{order.variantName || "-"}</TableCell>
            <TableCell>
              {order.price
                ? `Rp ${order.price.toLocaleString()}`
                : "-"}
            </TableCell>
            <TableCell>
              <Badge className={statusColor(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleString("id-ID", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
