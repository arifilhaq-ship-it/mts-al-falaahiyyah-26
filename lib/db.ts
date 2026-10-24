import fs from "fs";
import path from "path";
import { NewsItem, GalleryItem, Teacher, SchoolSettings, PpdbRegistration } from "./types";
import { defaultSettings, defaultNews, defaultGallery, defaultTeachers, defaultPpdbList } from "./data-defaults";
import { verifyPassword, hashPassword } from "./auth";

interface DatabaseSchema {
  settings: SchoolSettings;
  news: NewsItem[];
  gallery: GalleryItem[];
  teachers: Teacher[];
  ppdb: PpdbRegistration[];
  admin: {
    username: string;
    passwordHash: string; // PBKDF2 hash or env fallback
  };
}

// In-memory cache fallback (berguna jika di-deploy di Vercel/serverless read-only filesystem)
let inMemoryDb: DatabaseSchema | null = null;

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Inisialisasi database data
function initDatabase(): DatabaseSchema {
  const initialAdminPassword = process.env.ADMIN_PASSWORD || "AdminAlFalaahiyyah2025!";
  const initialAdminUsername = process.env.ADMIN_USERNAME || "admin";

  return {
    settings: defaultSettings,
    news: defaultNews,
    gallery: defaultGallery,
    teachers: defaultTeachers,
    ppdb: defaultPpdbList,
    admin: {
      username: initialAdminUsername,
      passwordHash: initialAdminPassword, // Will match via auth.ts verifyPassword
    },
  };
}

// Membaca database secara aman
export function getDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, "utf-8");
      inMemoryDb = JSON.parse(fileData);
      return inMemoryDb!;
    }
  } catch (err) {
    console.warn("Gagal membaca db.json lokal, beralih ke in-memory cache:", err);
  }

  if (inMemoryDb) {
    return inMemoryDb;
  }

  // Jika file belum ada, buat baru
  inMemoryDb = initDatabase();
  saveDb(inMemoryDb);
  return inMemoryDb;
}

// Menyimpan database ke file
export function saveDb(data: DatabaseSchema): boolean {
  inMemoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Tidak dapat menulis ke filesystem (mode serverless terdeteksi), perubahan disimpan di memory cache:", err);
    return false;
  }
}

// --- CRUD PENGATURAN SEKOLAH ---
export function getSchoolSettings(): SchoolSettings {
  const db = getDb();
  return db.settings;
}

export function updateSchoolSettings(updates: Partial<SchoolSettings>): SchoolSettings {
  const db = getDb();
  db.settings = { ...db.settings, ...updates };
  saveDb(db);
  return db.settings;
}

// --- CRUD BERITA & ARTIKEL ---
export function getNewsList(includeDrafts = false): NewsItem[] {
  const db = getDb();
  let items = db.news;
  if (!includeDrafts) {
    items = items.filter((n) => n.isPublished);
  }
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const db = getDb();
  const item = db.news.find((n) => n.slug === slug);
  return item || null;
}

export function getNewsById(id: string): NewsItem | null {
  const db = getDb();
  const item = db.news.find((n) => n.id === id);
  return item || null;
}

export function createNews(newsData: Omit<NewsItem, "id">): NewsItem {
  const db = getDb();
  const id = `news-${Date.now()}`;
  const newItem: NewsItem = {
    ...newsData,
    id,
    views: 0,
  };
  db.news.unshift(newItem);
  saveDb(db);
  return newItem;
}

export function updateNews(id: string, updates: Partial<NewsItem>): NewsItem | null {
  const db = getDb();
  const index = db.news.findIndex((n) => n.id === id);
  if (index === -1) return null;

  db.news[index] = { ...db.news[index], ...updates };
  saveDb(db);
  return db.news[index];
}

export function deleteNews(id: string): boolean {
  const db = getDb();
  const index = db.news.findIndex((n) => n.id === id);
  if (index === -1) return false;

  db.news.splice(index, 1);
  saveDb(db);
  return true;
}

// --- CRUD GALERI ---
export function getGalleryList(): GalleryItem[] {
  const db = getDb();
  return [...db.gallery].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function createGallery(item: Omit<GalleryItem, "id">): GalleryItem {
  const db = getDb();
  const newItem: GalleryItem = {
    ...item,
    id: `gal-${Date.now()}`,
  };
  db.gallery.unshift(newItem);
  saveDb(db);
  return newItem;
}

export function deleteGallery(id: string): boolean {
  const db = getDb();
  const index = db.gallery.findIndex((g) => g.id === id);
  if (index === -1) return false;

  db.gallery.splice(index, 1);
  saveDb(db);
  return true;
}

// --- GURU & TENAGA KEPENDIDIKAN ---
export function getTeachersList(): Teacher[] {
  const db = getDb();
  return db.teachers;
}

export function getTeacherById(id: string): Teacher | null {
  const db = getDb();
  const item = db.teachers.find((t) => t.id === id);
  return item || null;
}

export function createTeacher(teacherData: Omit<Teacher, "id">): Teacher {
  const db = getDb();
  const id = `t-${Date.now()}`;
  const newTeacher: Teacher = {
    ...teacherData,
    id,
  };
  db.teachers.push(newTeacher);
  saveDb(db);
  return newTeacher;
}

export function updateTeacher(id: string, updates: Partial<Teacher>): Teacher | null {
  const db = getDb();
  const index = db.teachers.findIndex((t) => t.id === id);
  if (index === -1) return null;

  db.teachers[index] = { ...db.teachers[index], ...updates };
  saveDb(db);
  return db.teachers[index];
}

export function deleteTeacher(id: string): boolean {
  const db = getDb();
  const index = db.teachers.findIndex((t) => t.id === id);
  if (index === -1) return false;

  db.teachers.splice(index, 1);
  saveDb(db);
  return true;
}

// --- PPDB PENDAFTARAN ---
export function getPpdbList(): PpdbRegistration[] {
  const db = getDb();
  return [...db.ppdb].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createPpdbRegistration(data: Omit<PpdbRegistration, "id" | "registrationNo" | "createdAt" | "status">): PpdbRegistration {
  const db = getDb();
  const count = db.ppdb.length + 1;
  const year = new Date().getFullYear();
  const registrationNo = `PPDB-${year}-${String(count).padStart(3, "0")}`;

  const newRegistration: PpdbRegistration = {
    ...data,
    id: `ppdb-${Date.now()}`,
    registrationNo,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.ppdb.unshift(newRegistration);
  saveDb(db);
  return newRegistration;
}

export function updatePpdbStatus(id: string, status: PpdbRegistration["status"], notes?: string): PpdbRegistration | null {
  const db = getDb();
  const index = db.ppdb.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.ppdb[index].status = status;
  if (notes !== undefined) {
    db.ppdb[index].notes = notes;
  }
  saveDb(db);
  return db.ppdb[index];
}

// --- AUTENTIKASI ADMIN ---
export async function validateAdminUser(username: string, passwordAttempt: string): Promise<boolean> {
  const db = getDb();
  const expectedUser = process.env.ADMIN_USERNAME || db.admin.username || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || db.admin.passwordHash || "AdminAlFalaahiyyah2025!";

  if (username !== expectedUser) {
    return false;
  }

  // Verifikasi password aman
  return await verifyPassword(passwordAttempt, expectedPass);
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  const db = getDb();
  const hashedPassword = await hashPassword(newPassword);
  db.admin.passwordHash = hashedPassword;
  saveDb(db);
}
