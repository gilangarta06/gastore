"use client";

import React, { useEffect, useState, Fragment } from "react";
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
import {
  Loader2,
  RefreshCw,
  Trash2,
  Eye,
  Copy,
  CheckCheck,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Order {
  _id: string;
  midtransOrderId?: string;
  customerName: string;
  phone: string;
  productId: { _id: string; name: string } | string;
  variant: { name: string; price: number };
  account?: { username: string; password: string };
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
      if (!res.ok) throw new Error("Gagal memuat data");
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
      const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus pesanan");
      toast.success("Pesanan berhasil dihapus");
      await fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus pesanan");
    } finally {
      setDeleting(null);
    }
  };

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
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Memuat pesanan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4 py-6">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={fetchOrders}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold tracking-tight">
            Daftar Pesanan
          </h2>
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

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-6"
                  >
                    Tidak ada pesanan.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const statusVariant =
                    order.status === "completed"
                      ? "default"
                      : order.status === "pending"
                      ? "secondary"
                      : "outline";

                  const orderId =
                    order.midtransOrderId ||
                    `INV-${order._id.slice(-6).toUpperCase()}`;

                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{orderId}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                              <AlertDialogTitle>
                                Hapus Pesanan?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Pesanan{" "}
                                <b>{orderId}</b> milik{" "}
                                <b>{order.customerName}</b> akan dihapus
                                permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteOrder(order._id)}
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

      {/* Dialog Detail */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3 text-sm mt-2">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Order ID", selectedOrder.midtransOrderId || `INV-${selectedOrder._id.slice(-6).toUpperCase()}`],
                  ["Customer", selectedOrder.customerName],
                  ["Phone", selectedOrder.phone],
                  [
                    "Product",
                    typeof selectedOrder.productId === "object"
                      ? selectedOrder.productId?.name || "Unknown Product"
                      : selectedOrder.productId || "Unknown Product",
                  ],
                  ["Variant", selectedOrder.variant?.name],
                  ["Qty", selectedOrder.qty],
                  ["Price", `Rp ${selectedOrder.variant?.price.toLocaleString("id-ID")}`],
                  ["Total", `Rp ${selectedOrder.total?.toLocaleString("id-ID")}`],
                  ["Status", selectedOrder.status],
                  [
                    "Dibuat",
                    new Date(selectedOrder.createdAt).toLocaleString("id-ID"),
                  ],
                  [
                    "User",
                    selectedOrder.userId?.username || "-",
                  ],
                ].map(([label, value]) => (
                  <Fragment key={label}>
                    <span className="font-medium">{label}:</span>
                    <span
                      className={
                        label === "Total"
                          ? "font-semibold text-green-600"
                          : "text-muted-foreground"
                      }
                    >
                      {value}
                    </span>
                  </Fragment>
                ))}
              </div>

              {selectedOrder.account && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">
                    🔐 Account Information
                  </h4>

                  {["username", "password"].map((field) => (
                    <div
                      key={field}
                      className="flex items-center justify-between bg-background border rounded p-2 mb-2"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground capitalize">
                          {field}
                        </p>
                        <p className="font-mono font-medium">
                          {selectedOrder.account?.[field as "username" | "password"]}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(
                            selectedOrder.account?.[field as "username" | "password"]!,
                            field
                          )
                        }
                      >
                        {copiedField === field ? (
                          <CheckCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {selectedOrder.paymentUrl && (
                <div className="pt-3 border-t">
                  <span className="font-medium">Payment URL: </span>
                  <a
                    href={selectedOrder.paymentUrl}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Bayar Sekarang
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
