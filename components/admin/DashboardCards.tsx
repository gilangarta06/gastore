"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { 
  Line, 
  LineChart, 
  Bar, 
  BarChart, 
  Pie, 
  PieChart, 
  CartesianGrid, 
  XAxis 
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { 
  TrendingUp as TrendingUpIcon, 
  DollarSign, 
  XCircle, 
  Truck, 
  HelpCircle, 
  AlertTriangle 
} from "lucide-react";

export default function DashboardCards() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    try {
      const [resChart, resTop, resCategories] = await Promise.all([
        fetch("/api/orders/chart"),
        fetch("/api/orders/top"),
        fetch("/api/orders/categories")
      ]);

      const chartData = await resChart.json();
      const topData = await resTop.json();
      const categoryData = await resCategories.json();

      const resOrders = await fetch("/api/orders");
      const dataOrders = await resOrders.json();

      const resProducts = await fetch("/api/products");
      const dataProducts = await resProducts.json();

      setOrders(dataOrders);
      setProducts(dataProducts);

      // HAPUS INI ❌
      // setCategoryChartData(categoryData);

      // Kalau masih ada ini juga hapus
      // setChartOrders(chartData);
      // setTopProductsData(topData);
    } catch (error) {
      console.error("Error fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  // ✅ Logic tetap sama - tidak diubah
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) =>
    new Date(o.createdAt).toISOString().startsWith(today)
  );

  const revenue = orders
    .filter((o) => o.status === "paid")
    .reduce((acc, cur) => acc + cur.total, 0);

  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  const lowStock = products.filter((p) =>
    p.variants.some((v: any) => v.quantity < 10)
  ).length;

  const productCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const name = o.productId?.name || "Unknown";
    productCounts[name] = (productCounts[name] || 0) + o.qty;
  });
  const topProducts = Object.entries(productCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const categoryData = products.reduce((acc: any[], p: any) => {
    const cat = acc.find((c) => c.name === p.category);
    if (cat) {
      cat.value += 1;
    } else {
      acc.push({ name: p.category, value: 1 });
    }
    return acc;
  }, []);

  // Config untuk charts
  const lineChartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const barChartConfig = {
    value: {
      label: "Qty",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const pieChartConfig = categoryData.reduce((config: any, cat: any, index: number) => {
    config[cat.name] = {
      label: cat.name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return config;
  }, {
    value: { label: "Products" },
  } as ChartConfig);

  // Update categoryData dengan fill color
  const categoryChartData = categoryData.map((cat: any, index: number) => ({
    ...cat,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  const cards = [
    { 
      title: "Order Hari Ini", 
      value: todayOrders.length, 
      subtitle: "orders",
      icon: TrendingUpIcon,
      trend: "+12%"
    },
    {
      title: "Pendapatan Masuk",
      value: `Rp ${revenue.toLocaleString("id-ID")}`,
      subtitle: "paid orders",
      icon: DollarSign,
      color: "success",
      trend: "+8%"
    },
    { 
      title: "Order Dibatalkan", 
      value: cancelled, 
      subtitle: "orders",
      icon: XCircle,
      color: "destructive"
    },
    {
      title: "Produk Diantar",
      value: orders.filter((o) => o.status === "shipped").length,
      subtitle: "orders",
      icon: Truck
    },
    { 
      title: "Permintaan Bantuan", 
      value: 0, 
      subtitle: "requests",
      icon: HelpCircle
    },
    {
      title: "Stok Akan Habis",
      value: lowStock,
      subtitle: "products",
      icon: AlertTriangle,
      color: "warning"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${
                    card.color === "success" 
                      ? "bg-green-100 dark:bg-green-900/20" 
                      : card.color === "destructive"
                      ? "bg-red-100 dark:bg-red-900/20"
                      : card.color === "warning"
                      ? "bg-yellow-100 dark:bg-yellow-900/20"
                      : "bg-primary/10"
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      card.color === "success"
                        ? "text-green-600 dark:text-green-400"
                        : card.color === "destructive"
                        ? "text-red-600 dark:text-red-400"
                        : card.color === "warning"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-primary"
                    }`} />
                  </div>
                  {card.trend && (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {card.trend}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {card.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trend Order per Hari */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Order per Hari</CardTitle>
          <CardDescription>
            Menampilkan total order hari ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayOrders.length > 0 ? (
            <ChartContainer config={lineChartConfig}>
              <LineChart
                accessibilityLayer
                data={todayOrders}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="createdAt"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="total"
                  type="natural"
                  stroke="var(--color-total)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-medium">Belum ada order hari ini</p>
                <p className="text-sm">Data akan muncul ketika ada order masuk</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Order hari ini: {todayOrders.length} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Menampilkan data order untuk hari ini
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Produk Teratas (Top 5) */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Produk Teratas (Top 5)</CardTitle>
            <CardDescription>
              Produk dengan penjualan tertinggi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <ChartContainer config={barChartConfig}>
                <BarChart accessibilityLayer data={topProducts}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 10)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="value" fill="var(--color-value)" radius={8} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-medium">Belum ada data produk</p>
                  <p className="text-sm">Data akan muncul ketika ada transaksi</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            {topProducts.length > 0 ? (
              <>
                <div className="flex gap-2 leading-none font-medium">
                  {topProducts[0]?.name} adalah produk terlaris <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                  Berdasarkan jumlah qty terjual
                </div>
              </>
            ) : (
              <div className="text-muted-foreground leading-none">
                Belum ada produk terjual
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Kategori Penjualan */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Kategori Penjualan</CardTitle>
            <CardDescription>Distribusi produk per kategori</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {categoryChartData.length > 0 ? (
              <ChartContainer
                config={pieChartConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <Pie data={categoryChartData} dataKey="value" nameKey="name" />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-medium">Belum ada kategori produk</p>
                  <p className="text-sm">Tambahkan produk untuk melihat distribusi kategori</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}