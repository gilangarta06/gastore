import DashboardCards from "@/components/admin/DashboardCards";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Selamat datang di panel admin. Silakan pilih menu di sidebar.
      </p>
      <DashboardCards />
    </div>
  );
}
