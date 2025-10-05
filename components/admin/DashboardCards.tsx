"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardCards() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resOrders = await fetch("/api/orders");
        const dataOrders = await resOrders.json();

        const resProducts = await fetch("/api/products");
        const dataProducts = await resProducts.json();

        setOrders(dataOrders);
        setProducts(dataProducts);
      } catch (error) {
        console.error("Error fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  // ✅ Hitung order hari ini
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) =>
    new Date(o.createdAt).toISOString().startsWith(today)
  );

  // ✅ Hitung pendapatan masuk (hanya order sukses/paid)
  const revenue = orders
    .filter((o) => o.status === "paid")
    .reduce((acc, cur) => acc + cur.total, 0);

  // ✅ Hitung order dibatalkan
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  // ✅ Produk dengan stok mau habis
  const lowStock = products.filter((p) =>
    p.variants.some((v: any) => v.quantity < 10)
  ).length;

  // ✅ Top Produk berdasarkan order count
  const productCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const name = o.productId?.name || "Unknown";
    productCounts[name] = (productCounts[name] || 0) + o.qty;
  });
  const topProducts = Object.entries(productCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // ✅ Pie kategori produk
  const categoryData = products.reduce((acc: any[], p: any) => {
    const cat = acc.find((c) => c.name === p.category);
    if (cat) {
      cat.value += 1;
    } else {
      acc.push({ name: p.category, value: 1 });
    }
    return acc;
  }, []);

  const colors = ["#137fec", "#137fec80", "#137fec33", "#82ca9d", "#ffc658"];
  categoryData.forEach((c, i) => (c.color = colors[i % colors.length]));

  // ✅ Cards
  const cards = [
    { title: "Order Hari Ini", value: todayOrders.length, subtitle: "orders" },
    {
      title: "Pendapatan Masuk",
      value: `Rp ${revenue.toLocaleString("id-ID")}`,
      subtitle: "paid orders",
      color: "success",
    },
    { title: "Order Dibatalkan", value: cancelled, subtitle: "orders" },
    {
      title: "Produk Diantar",
      value: orders.filter((o) => o.status === "shipped").length,
      subtitle: "orders",
    },
    { title: "Permintaan Bantuan", value: 0, subtitle: "requests" }, // bisa dihubungkan API lain
    {
      title: "Stok Akan Habis (<10)",
      value: lowStock,
      subtitle: "products",
      color: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="p-6 rounded-lg shadow-sm">
            <CardContent>
              <p className="text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
              <p
                className={`text-sm font-semibold ${
                  card.color === "success"
                    ? "text-green-500"
                    : card.color === "danger"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Penjualan */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Order per Hari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={todayOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="createdAt" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#137fec" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top Produk */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Produk Teratas (Top 5)</CardTitle>
          </CardHeader>
          <CardContent className="h-40 flex items-end gap-4">
            {topProducts.map((item) => (
              <div
                key={item.name}
                className="flex-1 flex flex-col justify-end items-center gap-1"
              >
                <div
                  className={`w-full rounded-md bg-primary`}
                  style={{ height: `${(item.value / topProducts[0].value) * 100}%` }}
                />
                <p className="text-xs">{item.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pie Chart Kategori */}
        <Card className="lg:col-span-2 flex items-center gap-6 p-6">
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  innerRadius={30}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{categoryData[0]?.value}</span>
              <span className="text-xs">{categoryData[0]?.name}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-2">Kategori Penjualan</p>
            <div className="space-y-2 text-sm">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
