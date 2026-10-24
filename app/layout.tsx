import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MTs Al Falaahiyyah - Cikoneng Kulon, Ganeas, Sumedang",
    template: "%s | MTs Al Falaahiyyah Cikoneng Kulon",
  },
  description:
    "Website resmi Madrasah Tsanawiyah (MTs) Al Falaahiyyah, Cikoneng Kulon, Kecamatan Ganeas, Kabupaten Sumedang. Membentuk generasi Qur'ani, berakhlakul karimah, dan unggul dalam prestasi.",
  keywords: [
    "MTs Al Falaahiyyah",
    "Madrasah Tsanawiyah Al Falaahiyyah",
    "Cikoneng Kulon",
    "Ganeas",
    "Sumedang",
    "PPDB MTs Al Falaahiyyah",
    "Madrasah Sumedang",
    "Tahfidz Qur'an Sumedang",
    "Sekolah Islam Ganeas",
  ],
  authors: [{ name: "MTs Al Falaahiyyah" }],
  creator: "MTs Al Falaahiyyah Cikoneng Kulon",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-800 bg-white">
        {children}
      </body>
    </html>
  );
}
