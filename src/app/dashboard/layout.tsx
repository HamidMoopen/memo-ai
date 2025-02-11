import Link from "next/link";
import {
  Home,
  BookOpen,
  Mic,
  LogOut,
  ChartBarBig,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: Mic, label: "Record", href: "/topics" },
  { icon: BookOpen, label: "Chapters", href: "/dashboard/chapters" },
  { icon: ChartBarBig, label: "Insights", href: "/dashboard/insights" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Top Navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-8 py-4">
          <nav className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-[#3c4f76]"
            >
              Eterna
            </Link>
            <Link
              href="/"
              className="text-[#3c4f76] hover:text-[#2a3b5a] transition-colors"
            >
              Sign Out
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r">
          <nav className="p-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-[#383f51] rounded-2xl hover:bg-[#faf9f6] hover:text-[#3c4f76] transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 