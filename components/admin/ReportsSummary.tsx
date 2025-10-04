import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const summary = [
  { title: "Total Penjualan", value: "Rp 25.450.000", change: "+12%" },
  { title: "Rata-rata Order", value: "Rp 125.000", change: "+5%" },
  { title: "Pelanggan Baru", value: "150", change: "+20%" },
];

export default function ReportsSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {summary.map((item) => (
        <Card key={item.title}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-green-600 text-sm font-medium">{item.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
