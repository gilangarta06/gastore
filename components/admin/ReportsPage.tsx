"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// ======================
// Types
// ======================
interface Summary {
  title: string;
  value: string;
  change: string;
}

interface ChartData {
  name: string;
  sales: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: string;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<Summary[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    try {
      const [summaryRes, chartRes, ordersRes] = await Promise.all([
        fetch("/api/orders/summary"),
        fetch("/api/orders/chart"),
        fetch("/api/orders"),
      ]);

      const summaryRaw = await summaryRes.json();
      const chartData = await chartRes.json();
      const ordersData = await ordersRes.json();

      // 🔹 transform object → array agar bisa di-map
      const summaryData: Summary[] = [
        {
          title: "Total Penjualan",
          value: `Rp ${summaryRaw.totalSales?.toLocaleString("id-ID") || 0}`,
          change: "+12%", // sementara statis, bisa dihitung dari API juga
        },
        {
          title: "Rata-rata Order",
          value: `Rp ${summaryRaw.averageOrder?.toLocaleString("id-ID") || 0}`,
          change: "+5%",
        },
        {
          title: "Pelanggan Baru",
          value: `${summaryRaw.newCustomers || 0}`,
          change: "+20%",
        },
      ];

      setSummary(summaryData);
      setChartData(chartData);
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔹 Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summary.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className={`text-sm font-medium ${item.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                {item.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔹 Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Penjualan Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#1173d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Orders Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="text-left py-2 px-3">Order ID</th>
                  <th className="text-left py-2 px-3">Customer</th>
                  <th className="text-left py-2 px-3">Tanggal</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="py-2 px-3 font-medium">{order._id}</td>
                    <td className="py-2 px-3">{order.customer}</td>
                    <td className="py-2 px-3">{order.date}</td>
                    <td className="py-2 px-3">{order.status}</td>
                    <td className="py-2 px-3">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
