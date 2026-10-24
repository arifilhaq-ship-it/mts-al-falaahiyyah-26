import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { getSchoolSettings } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSchoolSettings();

  return (
    <div className="flex flex-col min-h-screen">
      {settings.isAnnouncementActive && (
        <AnnouncementBanner text={settings.announcementText} />
      )}
      <Navbar initialSettings={settings} />
      <main className="flex-1">{children}</main>
      <Footer initialSettings={settings} />
    </div>
  );
}
