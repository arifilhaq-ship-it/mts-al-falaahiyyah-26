"use client";

import React, { useState } from "react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { GalleryItem } from "@/lib/types";
import { Eye, X, Calendar, ArrowRight } from "./Icons";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const displayItems = gallery.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Dokumentasi"
          title="Galeri Aktivitas Santri"
          subtitle="Potret suasana belajar, kegiatan keagamaan, dan prestasi santri MTs Al Falaahiyyah."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">
                  {item.category}
                </span>
                <h4 className="font-bold text-base leading-snug drop-shadow">{item.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>

              {/* View Icon Badge */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/galeri"
            className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-6 py-3 rounded-xl border border-emerald-200 transition-colors shadow-sm"
          >
            <span>Buka Semua Galeri Kegiatan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Modal Lightbox Popup */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-slate-900">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  {selectedPhoto.category}
                </span>
                <span>•</span>
                <span>{selectedPhoto.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedPhoto.title}</h3>
              {selectedPhoto.description && (
                <p className="text-slate-600 text-sm leading-relaxed">{selectedPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
