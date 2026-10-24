"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { ShieldCheck, User, ArrowRight, CheckCircle } from "@/components/Icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Nama pengguna atau kata sandi salah.");
      }

      // Berhasil login, arahkan ke dashboard admin
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal melakukan autentikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Islamic Pattern Accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="admin-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-pattern)" />
        </svg>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        <div className="inline-block mb-4">
          <Logo light size="lg" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Portal Administrasi Madrasah
        </h2>
        <p className="mt-1 text-sm text-emerald-200">
          Masuk untuk mengelola berita, galeri, PPDB, dan data madrasah
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-emerald-800/40">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-medium animate-fadeIn">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Pengguna (Username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Memeriksa Kredensial...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Masuk Panel Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Kotak Petunjuk Kredensial Default untuk Pengembang / Administrator Baru */}
          <div className="mt-6 pt-5 border-t border-slate-100 bg-emerald-50/70 p-4 rounded-xl text-xs text-slate-600 space-y-1">
            <p className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Kredensial Default Bawaan:</span>
            </p>
            <p className="text-slate-700">Username: <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-mono font-bold text-emerald-800">admin</code></p>
            <p className="text-slate-700">Password: <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-mono font-bold text-emerald-800">AdminAlFalaahiyyah2025!</code></p>
            <p className="text-[11px] text-slate-500 pt-1">
              *Dapat diubah di menu Pengaturan atau melalui file lingkungan <code className="font-mono">.env.local</code>.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-semibold text-emerald-200 hover:text-white transition-colors underline"
          >
            &larr; Kembali ke Website Utama MTs Al Falaahiyyah
          </a>
        </div>
      </div>
    </div>
  );
}
