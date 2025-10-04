"use client";

import { useState } from "react";
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
  id: number;
  customer: string;
  email: string;
  phone: string;
  product: string;
  variant: string;
  price: string;
  status: "waiting" | "cancelled" | "in-process" | "completed";
};

const orders: Order[] = [
  {
    id: 1,
    customer: "Sophia Clark",
    email: "sophia@email.com",
    phone: "+62 812-3456-7890",
    product: "T-Shirt",
    variant: "Medium",
    price: "$25.00",
    status: "waiting",
  },
  {
    id: 2,
    customer: "Ethan Miller",
    email: "ethan@email.com",
    phone: "+62 813-2222-1111",
    product: "Hoodie",
    variant: "Large",
    price: "$45.00",
    status: "cancelled",
  },
  {
    id: 3,
    customer: "Olivia Davis",
    email: "olivia@email.com",
    phone: "+62 822-9876-5432",
    product: "Sweatpants",
    variant: "Small",
    price: "$35.00",
    status: "in-process",
  },
  {
    id: 4,
    customer: "Liam Wilson",
    email: "liam@email.com",
    phone: "+62 899-4444-5555",
    product: "Jacket",
    variant: "X-Large",
    price: "$60.00",
    status: "completed",
  },
  {
    id: 5,
    customer: "Ava Martinez",
    email: "ava@email.com",
    phone: "+62 877-3333-6666",
    product: "Shorts",
    variant: "Medium",
    price: "$20.00",
    status: "completed",
  },
];

export default function OrdersTable() {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [orderList, setOrderList] = useState<Order[]>(orders);

  const filteredOrders = orderList.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const statusVariants: Record<Order["status"], string> = {
    waiting: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
    "in-process": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  function updateStatus(orderId: number, newStatus: Order["status"]) {
    setOrderList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setSelectedOrder((prev) =>
      prev ? { ...prev, status: newStatus } : prev
    );
  }

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
          <TabsTrigger value="waiting">Waiting</TabsTrigger>
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
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.customer}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.email}
                  </div>
                </TableCell>
                <TableCell>
                  {order.product}{" "}
                  <span className="text-sm text-muted-foreground">
                    ({order.variant})
                  </span>
                </TableCell>
                <TableCell>{order.price}</TableCell>
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
                <strong>Customer:</strong> {selectedOrder.customer}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Product:</strong> {selectedOrder.product} (
                {selectedOrder.variant})
              </p>
              <p>
                <strong>Price:</strong> {selectedOrder.price}
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
                    updateStatus(selectedOrder.id, "in-process")
                  }
                >
                  Set In Process
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    updateStatus(selectedOrder.id, "completed")
                  }
                  variant="success"
                >
                  Set Completed
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    updateStatus(selectedOrder.id, "cancelled")
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
