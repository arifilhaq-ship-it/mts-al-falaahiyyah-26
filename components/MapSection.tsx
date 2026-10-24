"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import { defaultSettings } from "@/lib/data-defaults";
import { SchoolSettings } from "@/lib/types";
import { MapPin, Phone, Mail, Clock, WhatsApp } from "./Icons";

interface MapSectionProps {
  initialSettings?: SchoolSettings;
}

export default function MapSection({ initialSettings }: MapSectionProps) {
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

  const cleanWaNumber = (settings.whatsapp || settings.phone || "6282123456789").replace(/[^0-9]/g, "");

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Lokasi & Akses"
          title={`Kunjungi Kampus ${settings.schoolName}`}
          subtitle={`Berada di lingkungan asri dan religius di ${settings.village ? `Desa ${settings.village}, ` : ""}${settings.district ? `Kecamatan ${settings.district}, ` : ""}${settings.regency ? `Kabupaten ${settings.regency}` : ""}.`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Detail Informasi & Hotline Terhubung Dinamis */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200/80 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Informasi Kontak &amp; Pelayanan
              </h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Alamat Lengkap</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {settings.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Telepon &amp; WhatsApp</h4>
                    <p className="text-slate-600 mt-0.5">
                      <a href={`tel:${settings.phone}`} className="hover:text-emerald-800">
                        {settings.phone}
                      </a>
                      {settings.whatsapp && settings.whatsapp !== settings.phone && (
                        <span className="block text-xs text-slate-500">
                          Hotline WA: +{settings.whatsapp}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Surat Elektronik</h4>
                    <p className="text-slate-600 mt-0.5">
                      <a href={`mailto:${settings.email}`} className="hover:text-emerald-800">
                        {settings.email}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Jam Layanan Madrasah</h4>
                    <p className="text-slate-600 mt-0.5">Senin – Sabtu: 07.30 – 14.30 WIB</p>
                    <p className="text-xs text-amber-600 font-semibold mt-0.5">Ahad &amp; Hari Libur Nasional: Tutup</p>
                  </div>
                </div>
              </div>

              {/* Tombol Hubungi WhatsApp */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                    `Assalamu'alaikum Admin ${settings.schoolName}, saya ingin bertanya mengenai informasi madrasah.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200"
                >
                  <WhatsApp className="w-5 h-5" />
                  <span>Kirim Pesan WhatsApp Panitia</span>
                </a>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Peta Google Maps Embed Otomatis Berdasarkan Alamat */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-slate-200/80 p-2">
              <div className="relative w-full h-[400px] sm:h-[430px] rounded-xl overflow-hidden bg-slate-100">
                <iframe
                  title={`Peta Lokasi ${settings.schoolName}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    settings.address || "Cikoneng, Ganeas, Sumedang, Jawa Barat"
                  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="p-3 text-xs text-slate-500 text-center flex flex-wrap items-center justify-between gap-2">
                <span className="truncate max-w-sm">{settings.address}</span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    settings.address || "Cikoneng Ganeas Sumedang"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-800 hover:underline shrink-0"
                >
                  Buka di Aplikasi Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
