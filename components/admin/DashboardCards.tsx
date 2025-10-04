export default function DashboardCards() {
  const data = [
    { title: "Total Orders", value: "124" },
    { title: "Revenue", value: "$12,400" },
    { title: "Users", value: "89" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((item) => (
        <div
          key={item.title}
          className="rounded-lg bg-white dark:bg-gray-900 shadow p-4"
        >
          <h2 className="text-sm text-gray-500">{item.title}</h2>
          <p className="text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
