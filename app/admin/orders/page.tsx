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
import { Loader2, RefreshCw, Trash2, Eye, Copy, CheckCheck } from "lucide-react";
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
  midtransOrderId?: string;
  customerName: string;
  phone: string;
  productId: { _id: string; name: string } | string;
  variant: { name: string; price: number };
  account?: { username: string; password: string }; // ✅ Tambahkan account
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

  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  // ✅ Fungsi copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} berhasil disalin`);
    setTimeout(() => setCopiedField(null), 2000);
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

                  const displayOrderId = order.midtransOrderId || `INV-${order._id.slice(-6).toUpperCase()}`;

                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{displayOrderId}</TableCell>
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
                                Pesanan <b>{displayOrderId}</b> milik <b>{order.customerName}</b> akan dihapus permanen.
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

      {/* Detail Modal with Account Info */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Order ID:</span>
                <span>{selectedOrder.midtransOrderId || `INV-${selectedOrder._id.slice(-6).toUpperCase()}`}</span>

                <span className="font-medium">Customer:</span>
                <span>{selectedOrder.customerName}</span>

                <span className="font-medium">Phone:</span>
                <span>{selectedOrder.phone}</span>

                <span className="font-medium">Product:</span>
                <span>
                  {selectedOrder.productId && typeof selectedOrder.productId === "object"
                  ? selectedOrder.productId.name
                  : selectedOrder.productId || "Unknown Product"}
                </span>

                <span className="font-medium">Variant:</span>
                <span>{selectedOrder.variant?.name}</span>

                <span className="font-medium">Qty:</span>
                <span>{selectedOrder.qty}</span>

                <span className="font-medium">Price:</span>
                <span>Rp {selectedOrder.variant?.price.toLocaleString("id-ID")}</span>

                <span className="font-medium">Total:</span>
                <span className="font-semibold text-green-600">Rp {selectedOrder.total?.toLocaleString("id-ID")}</span>

                <span className="font-medium">Status:</span>
                <Badge variant={selectedOrder.status === "completed" ? "default" : "secondary"}>
                  {selectedOrder.status}
                </Badge>

                <span className="font-medium">Dibuat:</span>
                <span>{new Date(selectedOrder.createdAt).toLocaleString("id-ID")}</span>

                <span className="font-medium">User:</span>
                <span>{selectedOrder.userId ? `${selectedOrder.userId.username}` : "-"}</span>
              </div>

              {/* ✅ Account Section */}
              {selectedOrder.account && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    🔐 Account Information
                  </h4>
                  
                  <div className="space-y-2">
                    {/* Username */}
                    <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-gray-900 rounded">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
                        <p className="font-mono font-medium">{selectedOrder.account.username}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedOrder.account!.username, "Username")}
                      >
                        {copiedField === "Username" ? (
                          <CheckCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Password */}
                    <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-gray-900 rounded">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Password</p>
                        <p className="font-mono font-medium">{selectedOrder.account.password}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(selectedOrder.account!.password, "Password")}
                      >
                        {copiedField === "Password" ? (
                          <CheckCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment URL */}
              <div className="pt-3 border-t">
                <span className="font-medium">Payment URL: </span>
                {selectedOrder.paymentUrl ? (
                  <a href={selectedOrder.paymentUrl} target="_blank" className="text-blue-600 underline">
                    Bayar Sekarang
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}