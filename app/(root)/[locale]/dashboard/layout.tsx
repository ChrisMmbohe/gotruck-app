import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <DashboardNav />
      <main className="flex-1 p-8">
        <DashboardStats />
        {children}
      </main>
    </div>
  );
}
