"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { defaultSettings } from "@/lib/data-defaults";
import { SchoolSettings } from "@/lib/types";
import { Phone, Mail, MapPin, Menu, X, ArrowRight, ShieldCheck } from "./Icons";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Profil", href: "/profil" },
  { name: "Visi Misi", href: "/visi-misi" },
  { name: "GTK", href: "/guru-staff" },
  { name: "Akademik", href: "/akademik" },
  { name: "Berita", href: "/berita" },
  { name: "Galeri", href: "/galeri" },
  { name: "Kontak", href: "/kontak" },
];

interface NavbarProps {
  initialSettings?: SchoolSettings;
}

export default function Navbar({ initialSettings }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SchoolSettings>(initialSettings || defaultSettings);

  useEffect(() => {
    // Sinkronisasi data pengaturan terbaru secara dinamis
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(json.data);
        }
      } catch (err) {
        // Fallback
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup mobile drawer saat ganti halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const cleanWaNumber = (settings.whatsapp || settings.phone || "6282123456789").replace(/[^0-9]/g, "");

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top bar info */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-sm">{settings.address}</span>
            </span>
            <span className="text-emerald-700">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-200">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <a href={`mailto:${settings.email}`} className="hover:text-amber-300 transition-colors">
                {settings.email}
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${cleanWaNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Hotline: {settings.phone}</span>
            </a>
            <span className="text-emerald-700">|</span>
            <Link
              href="/admin/login"
              className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav
        className={`bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md py-2.5" : "shadow-sm py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo size={scrolled ? "sm" : "md"} />

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "text-emerald-900 bg-emerald-50 border-b-2 border-emerald-700 font-bold"
                        : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* CTA PPDB Button & Mobile Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/ppdb"
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span>PPDB Online</span>
                <span className="bg-amber-400 text-emerald-950 text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full">
                  {settings.isPpdbActive ? "Buka" : "Info"}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-100" />
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 focus:outline-none"
                aria-label="Buka Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                      active
                        ? "bg-emerald-700 text-white"
                        : "text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-200 mt-2">
                <Link
                  href="/ppdb"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-800 text-white py-3 px-4 rounded-xl font-bold text-center shadow-md"
                >
                  <span>Pendaftaran Santri Baru (PPDB)</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </Link>

                <div className="mt-4 pt-3 text-xs text-slate-600 space-y-1.5">
                  <p className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{settings.address}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{settings.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{settings.email}</span>
                  </p>
                  <Link
                    href="/admin/login"
                    className="flex items-center gap-1.5 text-emerald-800 font-semibold pt-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Masuk ke Panel Admin Madrasah</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
