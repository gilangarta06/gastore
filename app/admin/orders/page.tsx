"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Order {
  _id: string;
  orderId?: string; // ✅ Tambahkan orderId custom (INV-xxx)
  customerName: string;
  phone: string;
  productId: { _id: string; name: string } | string;
  variant: { name: string; price: number };
  qty: number;
  status: string;
  createdAt: string;
  paymentUrl?: string;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data");
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Gagal memuat pesanan");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Delete order
  const deleteOrder = async (id: string) => {
    try {
      setDeleting(id);
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus pesanan");
      toast.success("Pesanan berhasil dihapus");
      await fetchOrders();
    } catch (err) {
      console.error("Delete order error:", err);
      toast.error("Gagal menghapus pesanan");
    } finally {
      setDeleting(null);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Memuat pesanan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        {error}
        <div className="mt-3">
          <Button onClick={fetchOrders} variant="secondary">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md shadow-sm">
      {/* Header actions */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Daftar Pesanan</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center text-gray-500 py-6"
                >
                  Tidak ada pesanan.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const price = order.variant?.price || 0;
                const total = price * order.qty;
                const statusColor =
                  order.status === "completed"
                    ? "default"
                    : order.status === "pending"
                    ? "secondary"
                    : "outline";

                // ✅ Format custom INV ID
                const invId = order.orderId || `INV-${order._id.slice(-6).toUpperCase()}`;

                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{invId}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phone}</TableCell>
                    <TableCell>
                      {typeof order.productId === "object"
                        ? order.productId.name
                        : order.productId}
                    </TableCell>
                    <TableCell>{order.variant?.name || "-"}</TableCell>
                    <TableCell className="text-center">{order.qty}</TableCell>
                    <TableCell>Rp {price.toLocaleString("id-ID")}</TableCell>
                    <TableCell>Rp {total.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {order.paymentUrl ? (
                        <a
                          href={order.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Bayar
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={deleting === order._id}
                          >
                            {deleting === order._id ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Pesanan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Pesanan <b>{invId}</b> milik{" "}
                              <b>{order.customerName}</b> akan dihapus permanen.
                              Tindakan ini tidak bisa dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteOrder(order._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
