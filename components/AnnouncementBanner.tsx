"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight, X } from "./Icons";

interface AnnouncementBannerProps {
  text?: string;
  linkText?: string;
  linkHref?: string;
}

export default function AnnouncementBanner({
  text = "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2025/2026 Resmi Dibuka! Kuota Terbatas.",
  linkText = "Daftar Sekarang",
  linkHref = "/ppdb",
}: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !text) return null;

  return (
    <aside aria-label="Pengumuman Penting" className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-inner relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1 justify-center sm:justify-start">
          <span className="bg-slate-950 text-amber-400 p-1 rounded-full shrink-0">
            <Bell className="w-3.5 h-3.5" />
          </span>
          <span className="truncate">{text}</span>
          {linkHref && (
            <Link
              href={linkHref}
              className="inline-flex items-center gap-1 font-black underline hover:text-white transition-colors shrink-0 ml-1"
            >
              <span>{linkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-slate-900 hover:text-black p-1 hover:bg-amber-400/50 rounded-lg transition-colors shrink-0"
          aria-label="Tutup Pengumuman"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
