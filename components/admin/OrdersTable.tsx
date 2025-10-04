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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Order = {
  _id: string;
  customerName: string;
  phone: string;
  productId: { name: string }; // karena pakai populate
  variant: { name: string; price: number };
  qty: number;
  status: "pending" | "cancelled" | "in-process" | "completed";
};

export default function OrdersTable() {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders dari API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrderList(data);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orderList.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const statusVariants: Record<Order["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
    "in-process": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  async function updateStatus(orderId: string, newStatus: Order["status"]) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      const updated = await res.json();

      setOrderList((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
      setSelectedOrder(updated);
    } catch (err) {
      console.error("Update status error:", err);
    }
  }

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="w-full space-y-6">
      {/* Tabs */}
      <Tabs
        value={filter}
        onValueChange={(val) => setFilter(val)}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-process">In Process</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.phone}
                  </div>
                </TableCell>
                <TableCell>
                  {order.productId?.name}{" "}
                  <span className="text-sm text-muted-foreground">
                    ({order.variant?.name})
                  </span>
                </TableCell>
                <TableCell>{order.qty}</TableCell>
                <TableCell>
                  Rp {(order.variant?.price * order.qty).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={statusVariants[order.status]}>
                    {order.status === "in-process"
                      ? "In Process"
                      : order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="link"
                    className="text-primary"
                    onClick={() => setSelectedOrder(order)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Popup */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Informasi lengkap pemesanan customer
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Product:</strong> {selectedOrder.productId?.name} (
                {selectedOrder.variant?.name})
              </p>
              <p>
                <strong>Qty:</strong> {selectedOrder.qty}
              </p>
              <p>
                <strong>Total:</strong> Rp{" "}
                {(selectedOrder.variant?.price * selectedOrder.qty).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge className={statusVariants[selectedOrder.status]}>
                  {selectedOrder.status}
                </Badge>
              </p>

              {/* Tombol Update Status */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() =>
                    updateStatus(selectedOrder._id, "in-process")
                  }
                >
                  Set In Process
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    updateStatus(selectedOrder._id, "completed")
                  }
                  variant="success"
                >
                  Set Completed
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    updateStatus(selectedOrder._id, "cancelled")
                  }
                  variant="destructive"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
