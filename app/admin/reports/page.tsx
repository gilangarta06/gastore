import ReportsChart from "@/components/admin/ReportsChart";
import ReportsSummary from "@/components/admin/ReportsSummary";
import ReportsTable from "@/components/admin/ReportsTable";

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Laporan Penjualan</h2>
        <p className="text-muted-foreground">Analisis performa penjualan dan aktivitas pelanggan.</p>
      </div>

      <ReportsSummary />
      <ReportsChart />
      <ReportsTable />
    </div>
  );
}
