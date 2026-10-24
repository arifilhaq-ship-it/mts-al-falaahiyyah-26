"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import {
  FileText,
  ImageIcon,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  ShieldCheck,
  Award,
  GraduationCap,
} from "@/components/Icons";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: Award },
  { name: "Kelola Berita", href: "/admin/berita", icon: FileText },
  { name: "Kelola Galeri", href: "/admin/galeri", icon: ImageIcon },
  { name: "Kelola Guru & GTK", href: "/admin/guru", icon: GraduationCap },
  { name: "Kelola PPDB", href: "/admin/ppdb", icon: Users },
  { name: "Pengaturan Madrasah", href: "/admin/pengaturan", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Jangan tampilkan sidebar pada halaman login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Bar Admin */}
      <header className="bg-emerald-950 text-white sticky top-0 z-40 border-b border-emerald-900 shadow-md">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Logo light size="sm" />
            <span className="hidden sm:inline-block bg-emerald-800 text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Panel Admin
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-emerald-200 hover:text-white font-semibold hidden sm:inline-flex items-center gap-1"
            >
              <span>Lihat Website</span>
              <span className="text-[10px]">&rarr;</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-red-800/80 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar Desktop & Mobile */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } pt-16 lg:pt-0 flex flex-col justify-between`}
        >
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Menu Navigasi
            </div>

            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "bg-emerald-800 text-white shadow-sm font-bold"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            <p className="font-bold text-slate-800">MTs Al Falaahiyyah</p>
            <p className="text-[11px]">Cikoneng Kulon, Ganeas, Sumedang</p>
            <div className="mt-2 text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Sesi Terautentikasi Aman</span>
            </div>
          </div>
        </aside>

        {/* Backdrop untuk mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Konten Halaman Admin */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
