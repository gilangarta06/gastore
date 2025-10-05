"use client";

import React, { useEffect, useState } from "react";
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
  Filter,
  X,
  MoreVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface ProductOption {
  id: string;
  name: string;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Filter states
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [products, setProducts] = useState<ProductOption[]>([]);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/api/orders`, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data");
      const data = await res.json();
      setOrders(data);
      
      // Extract unique products dengan type-safe
      const productMap = new Map<string, ProductOption>();
      
      data.forEach((order: Order) => {
        if (typeof order.productId === "object" && order.productId?.name) {
          productMap.set(order.productId._id, {
            id: order.productId._id,
            name: order.productId.name
          });
        }
      });
      
      setProducts(Array.from(productMap.values()));
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

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Filter by product
    if (selectedProduct !== "all") {
      filtered = filtered.filter((order) => {
        if (typeof order.productId === "object") {
          return order.productId._id === selectedProduct;
        }
        return false;
      });
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  }, [orders, selectedProduct, selectedStatus]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const clearFilters = () => {
    setSelectedProduct("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters = selectedProduct !== "all" || selectedStatus !== "all";

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
        {/* Header with Filters */}
        <div className="p-4 border-b space-y-4">
          <div className="flex justify-between items-center">
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

          {/* Filter Section */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground mb-1.5 block">
                Filter Product
              </label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Product</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground mb-1.5 block">
                Filter Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Filter Info */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                Menampilkan {filteredOrders.length} dari {orders.length} pesanan
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-6"
                  >
                    {hasActiveFilters
                      ? "Tidak ada pesanan yang sesuai dengan filter"
                      : "Tidak ada pesanan."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const statusVariant =
                    order.status === "completed"
                      ? "default"
                      : order.status === "pending"
                      ? "secondary"
                      : "outline";

                  const orderId =
                    order.midtransOrderId ||
                    `INV-${order._id.slice(-6).toUpperCase()}`;
                  
                  // Shortened Order ID for table display
                  const shortOrderId = orderId.length > 15 
                    ? `${orderId.slice(0, 12)}...` 
                    : orderId;

                  const productName =
                    typeof order.productId === "object"
                      ? order.productId?.name || "Unknown Product"
                      : "Unknown Product";

                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium font-mono text-xs">
                        {shortOrderId}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.phone}
                      </TableCell>
                      <TableCell>{productName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.variant?.name}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        Rp {order.total?.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => {
                                if (confirm(`Hapus pesanan ${orderId}?`)) {
                                  deleteOrder(order._id);
                                }
                              }}
                              disabled={deleting === order._id}
                            >
                              {deleting === order._id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog Detail with ScrollArea */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[75vh] pr-4">
            {selectedOrder && (
              <div className="space-y-4">
                {/* Order Info Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Order ID</p>
                        <p className="font-medium">
                          {selectedOrder.midtransOrderId ||
                            `INV-${selectedOrder._id.slice(-6).toUpperCase()}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Status</p>
                        <Badge
                          variant={
                            selectedOrder.status === "completed"
                              ? "default"
                              : selectedOrder.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Customer</p>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Phone</p>
                        <p className="font-medium">{selectedOrder.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Product</p>
                        <p className="font-medium">
                          {typeof selectedOrder.productId === "object"
                            ? selectedOrder.productId?.name || "Unknown Product"
                            : "Unknown Product"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Variant</p>
                        <p className="font-medium">{selectedOrder.variant?.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Quantity</p>
                        <p className="font-medium">{selectedOrder.qty}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Price</p>
                        <p className="font-medium">
                          Rp {selectedOrder.variant?.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Total</p>
                        <p className="font-semibold text-green-600 text-lg">
                          Rp {selectedOrder.total?.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Tanggal</p>
                        <p className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleString("id-ID")}
                        </p>
                      </div>
                      {selectedOrder.userId && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground text-xs mb-1">User</p>
                          <p className="font-medium">{selectedOrder.userId.username}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Account Information */}
                {selectedOrder.account && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        🔐 Account Information
                      </h4>
                      <div className="space-y-2">
                        {["username", "password"].map((field) => (
                          <div
                            key={field}
                            className="flex items-center justify-between bg-background border rounded-lg p-3"
                          >
                            <div>
                              <p className="text-xs text-muted-foreground capitalize mb-1">
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
                    </CardContent>
                  </Card>
                )}

                {/* Payment URL */}
                {selectedOrder.paymentUrl && (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2">Payment URL</p>
                      <a
                        href={selectedOrder.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Bayar Sekarang →
                      </a>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}