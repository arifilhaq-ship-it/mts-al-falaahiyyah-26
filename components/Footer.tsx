"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { defaultSettings } from "@/lib/data-defaults";
import { SchoolSettings } from "@/lib/types";
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck } from "./Icons";

interface FooterProps {
  initialSettings?: SchoolSettings;
}

export default function Footer({ initialSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
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

  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Kolom 1: Profil & Identitas Madrasah */}
          <div className="space-y-4">
            <Logo light size="md" />
            <p className="text-emerald-200/90 text-sm leading-relaxed pt-2">
              {settings.description || "Lembaga pendidikan Islam tingkat menengah pertama di Cikoneng Kulon, Kecamatan Ganeas, Kabupaten Sumedang yang berkomitmen mencetak generasi Qur'ani, unggul dalam sains, dan berakhlakul karimah."}
            </p>
            <div className="pt-2">
              <span className="inline-block bg-emerald-900/80 border border-emerald-700/60 text-amber-300 text-xs px-3 py-1 rounded-full font-semibold">
                Kemenag RI • {settings.regency || "Kab. Sumedang"}
              </span>
            </div>
          </div>

          {/* Kolom 2: Tautan Pintas */}
          <div>
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-4 pb-2 border-b border-emerald-800">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/profil" className="text-emerald-200 hover:text-amber-300 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Profil &amp; Sejarah Madrasah</span>
                </Link>
              </li>
              <li>
                <Link href="/visi-misi" className="text-emerald-200 hover:text-amber-300 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Visi, Misi &amp; Karakter</span>
                </Link>
              </li>
              <li>
                <Link href="/guru-staff" className="text-emerald-200 hover:text-amber-300 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Guru &amp; Tenaga Kependidikan</span>
                </Link>
              </li>
              <li>
                <Link href="/akademik" className="text-emerald-200 hover:text-amber-300 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kurikulum &amp; Ekstrakurikuler</span>
                </Link>
              </li>
              <li>
                <Link href="/ppdb" className="text-emerald-200 hover:text-amber-300 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-amber-300">Pendaftaran Santri Baru (PPDB)</span>
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-emerald-200 hover:text-amber-300 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kabar &amp; Berita Madrasah</span>
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="text-emerald-200 hover:text-amber-300 transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dokumentasi Kegiatan</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Alamat Kantor Terhubung Dinamis */}
          <div>
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-4 pb-2 border-b border-emerald-800">
              Alamat &amp; Kontak
            </h3>
            <ul className="space-y-3.5 text-sm text-emerald-200">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-300 transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-300 transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Jam Operasional Pelayanan:</p>
                  <p className="text-xs text-emerald-300">Senin - Sabtu: 07.30 - 14.30 WIB</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Layanan & Informasi */}
          <div>
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-4 pb-2 border-b border-emerald-800">
              Portal Terkait
            </h3>
            <p className="text-xs text-emerald-300 mb-3 leading-relaxed">
              Tautan resmi kementerian dan sistem informasi madrasah:
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="https://kemenag.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-emerald-900/60 hover:bg-emerald-800/80 p-2.5 rounded-lg border border-emerald-800 transition-colors text-emerald-100"
              >
                Kementerian Agama Republik Indonesia
              </a>
              <a
                href="https://emis.kemenag.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-emerald-900/60 hover:bg-emerald-800/80 p-2.5 rounded-lg border border-emerald-800 transition-colors text-emerald-100"
              >
                EMIS 4.0 Madrasah Kemenag
              </a>
              <a
                href="https://jabar.kemenag.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-emerald-900/60 hover:bg-emerald-800/80 p-2.5 rounded-lg border border-emerald-800 transition-colors text-emerald-100"
              >
                Kanwil Kemenag Provinsi Jawa Barat
              </a>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-900">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk Dashboard Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Baris Hak Cipta & Catatan */}
        <div className="pt-8 mt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-300/80 gap-3">
          <p>
            &copy; {currentYear} {settings.schoolName}. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span>Website Resmi Madrasah</span>
            <span>•</span>
            <Link href="/kontak" className="hover:text-amber-300">Hubungi Kami</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
