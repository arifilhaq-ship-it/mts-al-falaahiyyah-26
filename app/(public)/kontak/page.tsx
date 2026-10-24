"use client";

import React, { useState, useEffect } from "react";
import SectionHeading from "@/components/SectionHeading";
import { defaultSettings } from "@/lib/data-defaults";
import { SchoolSettings } from "@/lib/types";
import { MapPin, Phone, Mail, Clock, WhatsApp, CheckCircle, ArrowRight } from "@/components/Icons";

export default function KontakPage() {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // Sinkronisasi informasi kontak secara dinamis dari database/API
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(json.data);
        }
      } catch (err) {
        // Fallback defaultSettings
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const cleanWaNumber = (settings.whatsapp || settings.phone || "6282123456789").replace(/[^0-9]/g, "");

  return (
    <div className="bg-white">
      {/* Header Halaman */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-emerald-800/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 inline-block mb-3">
            Hubungi Kami
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Kontak &amp; Informasi
          </h1>
          <p className="text-emerald-200 mt-3 text-base sm:text-lg max-w-2xl mx-auto">
            Silaturahmi dan konsultasi pendidikan {settings.schoolName}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Kolom Kiri: Kartu Alamat & Kontak Terhubung Dinamis */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Sekretariat Madrasah
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {settings.schoolName}
              </h2>
              <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                Keluarga besar madrasah senantiasa terbuka menerima kunjungan silaturahmi para orang tua, calon santri, dan masyarakat.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 space-y-5 text-sm text-slate-700">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Alamat Madrasah</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Telepon / WhatsApp</h4>
                  <p className="text-slate-600 mt-0.5">
                    <a href={`tel:${settings.phone}`} className="hover:text-emerald-800">
                      {settings.phone}
                    </a>
                    {settings.whatsapp && settings.whatsapp !== settings.phone && (
                      <span className="block text-xs text-slate-500">
                        WA: +{settings.whatsapp}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Resmi</h4>
                  <p className="text-slate-600 mt-0.5">
                    <a href={`mailto:${settings.email}`} className="hover:text-emerald-800">
                      {settings.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Jam Layanan Kantor</h4>
                  <p className="text-slate-600 mt-0.5">Senin - Sabtu: 07.30 - 14.30 WIB</p>
                  <p className="text-xs text-amber-600 font-semibold mt-0.5">Ahad &amp; Libur Nasional: Tutup</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call */}
            <a
              href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                `Assalamu'alaikum Admin ${settings.schoolName}, saya ingin bertanya mengenai informasi madrasah.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors"
            >
              <WhatsApp className="w-5 h-5" />
              <span>Buka Percakapan WhatsApp Langsung</span>
            </a>
          </div>

          {/* Kolom Kanan: Form Kirim Pesan */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Kirim Pertanyaan atau Pesan
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Tuliskan pertanyaan Anda seputar pendaftaran, kurikulum, atau jadwal kunjungan ke madrasah.
              </p>

              {sent ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950">Pesan Anda Berhasil Diterima!</h4>
                  <p className="text-slate-600 text-sm">
                    Terima kasih atas perhatian Anda. Tim administrasi {settings.schoolName} akan segera menindaklanjuti pesan Anda.
                  </p>
                  <a
                    href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                      `Assalamu'alaikum, saya ${formState.name} (${formState.phone}): ${formState.message}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 underline pt-2"
                  >
                    Kirim juga pesan ini via WhatsApp langsung &rarr;
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nama Lengkap Anda *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bpk. Ahmad Subagja"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nomor WhatsApp / Telepon *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Perihal Pesan
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Informasi PPDB / Program Tahfidz"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Isi Pesan *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tuliskan pesan atau pertanyaan Anda..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <span>Kirim Pesan Sekarang</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Peta Google Maps Embed Otomatis Sesuai Alamat */}
        <div className="mt-14 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="w-full h-96 bg-slate-100">
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
        </div>
      </div>
    </div>
  );
}
