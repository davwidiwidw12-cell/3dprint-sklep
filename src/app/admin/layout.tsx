import { getServerSession } from "next-auth";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { PushNotificationManager } from "@/components/admin/PushNotificationManager";
import { AdminOrderMonitor } from "@/components/admin/AdminOrderMonitor";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getServerSession();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminOrderMonitor />
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/admin">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/admin" className="text-sm font-medium hover:text-gray-900 text-gray-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-sm font-medium hover:text-gray-900 text-gray-600 transition-colors">
              Produkty
            </Link>
            <Link href="/admin/orders" className="text-sm font-medium hover:text-gray-900 text-gray-600 transition-colors">
              Zamówienia
            </Link>
            <Link href="/admin/settings" className="text-sm font-medium hover:text-gray-900 text-gray-600 transition-colors">
              Ustawienia
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-gray-900 text-gray-600 transition-colors" target="_blank">
              Zobacz Sklep
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <PushNotificationManager />
          <div className="flex flex-col items-end">
             <span className="text-sm font-semibold text-gray-900">Admin</span>
             <span className="text-xs text-gray-500">Zalogowany</span>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
