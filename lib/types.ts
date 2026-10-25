export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "Akademik" | "Kegiatan Siswa" | "Prestasi" | "Pengumuman" | "Keagamaan";
  author: string;
  date: string;
  coverImage: string;
  isPublished: boolean;
  views?: number;
  tags?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: "Kegiatan Belajar" | "Ekstrakurikuler" | "PHBI & Keagamaan" | "Prestasi" | "Fasilitas";
  imageUrl: string;
  date: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  category: "pimpinan" | "pai" | "umum" | "staf";
  nip?: string;
  subject?: string;
  education?: string;
  photo: string;
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  description: string;
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  npsn: string;
  nsm: string;
  accreditation: string;
  foundationName: string;
  headmasterName: string;
  headmasterSpeech: string;
  headmasterPhoto: string;
  logoUrl?: string;
  heroImage?: string;
  profileImage?: string;
  specialProgramLabel?: string;
  specialProgramTitle?: string;
  heroPhotoCaption?: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  // Konfigurasi PPDB
  isPpdbActive: boolean;
  ppdbAcademicYear: string;
  ppdbClosedMessage?: string;
  ppdbWave1Title?: string;
  ppdbWave1Date?: string;
  ppdbWave1Desc?: string;
  ppdbWave2Title?: string;
  ppdbWave2Date?: string;
  ppdbWave2Desc?: string;
  ppdbRequirements?: string[];
  ppdbContactName?: string;
  ppdbContactPhone?: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export interface PpdbRegistration {
  id: string;
  registrationNo: string;
  fullName: string;
  nisn: string;
  nik?: string;
  gender: "L" | "P";
  birthPlace: string;
  birthDate: string;
  previousSchool: string;
  parentName: string;
  parentPhone: string;
  address: string;
  programChoice: "Reguler" | "Tahfidz" | "Sains & Riset";
  status: "pending" | "verified" | "accepted" | "rejected";
  createdAt: string;
  notes?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  passwordHash: string;
  createdAt: string;
}
