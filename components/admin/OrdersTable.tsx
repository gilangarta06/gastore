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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  FileText,
  ExternalLink,
  Search,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Order {
  _id: string;
  orderId: string;
  midtransOrderId?: string;
  customerName: string;
  email?: string;
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [products, setProducts] = useState<ProductOption[]>([]);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data");
      const data = await res.json();
      setOrders(data);

      // Extract unique products
      const productMap = new Map<string, ProductOption>();
      data.forEach((order: Order) => {
        if (typeof order.productId === "object" && order.productId?.name) {
          productMap.set(order.productId._id, {
            id: order.productId._id,
            name: order.productId.name,
          });
        }
      });
      setProducts(Array.from(productMap.values()));
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat pesanan");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      setDeleting(id);
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
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

  const getInvoiceUrl = (order: Order) => {
    return `${window.location.origin}/invoice/${order.orderId}`;
  };

  const copyInvoiceLink = (order: Order) => {
    const invoiceUrl = getInvoiceUrl(order);
    copyToClipboard(invoiceUrl, "Link Invoice");
  };

  const openInvoice = (order: Order) => {
    const invoiceUrl = getInvoiceUrl(order);
    window.open(invoiceUrl, "_blank");
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(query) ||
          order.customerName?.toLowerCase().includes(query) ||
          order.phone?.toLowerCase().includes(query)
      );
    }

    // Product filter
    if (selectedProduct !== "all") {
      filtered = filtered.filter((order) => {
        if (typeof order.productId === "object") {
          return order.productId._id === selectedProduct;
        }
        return false;
      });
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, selectedProduct, selectedStatus]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto refresh setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedProduct("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters =
    searchQuery.trim() || selectedProduct !== "all" || selectedStatus !== "all";

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "cancelled":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header & Filters */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold">Daftar Pesanan</h2>
                <p className="text-sm text-muted-foreground">
                  Total: {filteredOrders.length} dari {orders.length} pesanan
                </p>
              </div>
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

            {/* Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Order ID, nama, atau nomor HP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Product Filter */}
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Produk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Produk</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Filter aktif</span>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="space-y-3">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          {hasActiveFilters
                            ? "Tidak ada pesanan yang sesuai dengan filter"
                            : "Belum ada pesanan"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const productName =
                      typeof order.productId === "object"
                        ? order.productId?.name || "Unknown Product"
                        : "Unknown Product";

                    return (
                      <TableRow key={order._id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs font-medium">
                          {order.orderId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{productName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.variant?.name}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          Rp {order.total?.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
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
                              <DropdownMenuItem onClick={() => openInvoice(order)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Buka Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyInvoiceLink(order)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Link Invoice
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  if (
                                    confirm(`Hapus pesanan ${order.orderId}?`)
                                  ) {
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
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[75vh] pr-4">
            {selectedOrder && (
              <div className="space-y-4">
                {/* Invoice Link */}
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                            Invoice
                          </h4>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300 break-all">
                          {getInvoiceUrl(selectedOrder)}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyInvoiceLink(selectedOrder)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" onClick={() => openInvoice(selectedOrder)}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Buka
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Info */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Order ID</p>
                        <p className="font-mono font-medium">{selectedOrder.orderId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Status</p>
                        <Badge variant={getStatusVariant(selectedOrder.status)}>
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
                      {selectedOrder.email && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground text-xs mb-1">Email</p>
                          <p className="font-medium">{selectedOrder.email}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Product</p>
                        <p className="font-medium">
                          {typeof selectedOrder.productId === "object"
                            ? selectedOrder.productId?.name
                            : "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Variant</p>
                        <p className="font-medium">{selectedOrder.variant?.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Qty</p>
                        <p className="font-medium">{selectedOrder.qty}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Total</p>
                        <p className="font-semibold text-green-600 text-lg">
                          Rp {selectedOrder.total?.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground text-xs mb-1">Tanggal</p>
                        <p className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Info */}
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
                {selectedOrder.paymentUrl && selectedOrder.status === "pending" && (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-2">Payment URL</p>
                      <a
                        href={selectedOrder.paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium text-sm break-all"
                      >
                        {selectedOrder.paymentUrl}
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