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
import { Loader2, RefreshCw, Trash2, Eye } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Order {
  _id: string;
  orderId?: string;
  customerName: string;
  phone: string;
  productId: { _id: string; name: string } | string;
  variant: { name: string; price: number };
  qty: number;
  total: number;
  status: string;
  createdAt: string;
  paymentUrl?: string;
  userId?: { username: string; email: string };
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/orders`, { cache: "no-store" });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Gagal memuat data");
      }

      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat pesanan");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      setDeleting(id);
      const res = await fetch(`${BASE_URL}/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus pesanan");

      toast.success("Pesanan berhasil dihapus");
      await fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus pesanan");
    } finally {
      setDeleting(null);
    }
  };

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
          <Button onClick={fetchOrders} variant="secondary">Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Daftar Pesanan</h2>
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={refreshing}>
            {refreshing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />} Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-6">Tidak ada pesanan.</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const statusColor =
                    order.status === "completed" ? "default" :
                    order.status === "pending" ? "secondary" : "outline";

                  const invId = order.orderId || `INV-${order._id.slice(-6).toUpperCase()}`;

                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{invId}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell><Badge variant={statusColor}>{order.status}</Badge></TableCell>
                      <TableCell className="space-x-2">
                        <Button size="icon" variant="outline" onClick={() => { setSelectedOrder(order); setIsDetailOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" disabled={deleting === order._id}>
                              {deleting === order._id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Pesanan?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Pesanan <b>{invId}</b> milik <b>{order.customerName}</b> akan dihapus permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteOrder(order._id)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
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

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2 text-sm">
              <p><b>ID:</b> {selectedOrder.orderId || selectedOrder._id}</p>
              <p><b>Customer:</b> {selectedOrder.customerName}</p>
              <p><b>Phone:</b> {selectedOrder.phone}</p>
              <p><b>Product:</b> {typeof selectedOrder.productId === "object" ? selectedOrder.productId.name : selectedOrder.productId}</p>
              <p><b>Variant:</b> {selectedOrder.variant?.name}</p>
              <p><b>Qty:</b> {selectedOrder.qty}</p>
              <p><b>Price:</b> Rp {selectedOrder.variant?.price.toLocaleString("id-ID")}</p>
              <p><b>Total:</b> Rp {selectedOrder.total?.toLocaleString("id-ID")}</p>
              <p><b>Status:</b> {selectedOrder.status}</p>
              <p><b>Dibuat:</b> {new Date(selectedOrder.createdAt).toLocaleString("id-ID")}</p>
              <p><b>User:</b> {selectedOrder.userId ? `${selectedOrder.userId.username} (${selectedOrder.userId.email})` : "-"}</p>
              <p>
                <b>Payment URL:</b>{" "}
                {selectedOrder.paymentUrl ? (
                  <a href={selectedOrder.paymentUrl} target="_blank" className="text-blue-600 underline">Bayar</a>
                ) : "-"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
