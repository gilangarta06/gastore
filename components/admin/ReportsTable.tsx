import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const orders = [
  { id: "#12345", customer: "Sophia Clark", date: "2025-09-01", status: "Shipped", total: "Rp 150.000" },
  { id: "#12346", customer: "Ethan Bennett", date: "2025-09-02", status: "Delivered", total: "Rp 200.000" },
  { id: "#12347", customer: "Olivia Carter", date: "2025-09-03", status: "Processing", total: "Rp 100.000" },
];

export default function ReportsTable() {
  return (
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
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-2 px-3 font-medium">{order.id}</td>
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
  );
}
