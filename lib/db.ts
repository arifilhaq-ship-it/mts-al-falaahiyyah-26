import fs from "fs";
import path from "path";
import { NewsItem, GalleryItem, Teacher, SchoolSettings, PpdbRegistration } from "./types";
import { defaultSettings, defaultNews, defaultGallery, defaultTeachers, defaultPpdbList } from "./data-defaults";
import { verifyPassword, hashPassword } from "./auth";

export interface DatabaseSchema {
  settings: SchoolSettings;
  news: NewsItem[];
  gallery: GalleryItem[];
  teachers: Teacher[];
  ppdb: PpdbRegistration[];
  admin: {
    username: string;
    passwordHash: string;
  };
}

const globalForDb = globalThis as unknown as {
  __mtsDbCache?: DatabaseSchema;
  __mtsDbLastFetch?: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "arifilhaq-ship-it/mts-al-falaahiyyah-26";
const GITHUB_DB_BRANCH = process.env.GITHUB_DB_BRANCH || "db-data";

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const KV_KEY = "mts_al_falaahiyyah_db_v1";

export function isPermanentStorageConfigured(): {
  active: boolean;
  provider: "github" | "kv" | "local-file" | "memory-only";
} {
  if (KV_URL && KV_TOKEN) return { active: true, provider: "kv" };
  if (GITHUB_TOKEN) return { active: true, provider: "github" };
  if (!process.env.VERCEL) return { active: true, provider: "local-file" };
  return { active: false, provider: "memory-only" };
}

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
      passwordHash: initialAdminPassword,
    },
  };
}

function readLocalFileDb(): DatabaseSchema | null {
  try {
    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(fileData) as DatabaseSchema;
    }
  } catch (err) {
    console.warn("Gagal membaca db.json lokal:", err);
  }
  return null;
}

// --- CLOUD STORAGE 1: UPSTASH REDIS / VERCEL KV ---
async function readFromKv(): Promise<DatabaseSchema | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return null;
    return typeof json.result === "string" ? JSON.parse(json.result) : json.result;
  } catch (err) {
    console.warn("Gagal membaca dari KV:", err);
    return null;
  }
}

async function writeToKv(data: DatabaseSchema): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const res = await fetch(`${KV_URL}/set/${KV_KEY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.stringify(data)),
      cache: "no-store",
    });
    return res.ok;
  } catch (err) {
    console.warn("Gagal menyimpan ke KV:", err);
    return false;
  }
}

// --- CLOUD STORAGE 2: GITHUB REPOSITORY API (GRATIS & PERMANEN) ---
async function readFromGitHub(): Promise<DatabaseSchema | null> {
  if (!GITHUB_TOKEN) return null;
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/db.json?ref=${GITHUB_DB_BRANCH}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "MTs-Al-Falaahiyyah-CMS",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const text = await res.text();
      return JSON.parse(text) as DatabaseSchema;
    }

    // Jika branch db-data belum ada, coba baca dari branch main
    if (res.status === 404) {
      const fallbackUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/db.json?ref=main`;
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "MTs-Al-Falaahiyyah-CMS",
        },
        cache: "no-store",
      });
      if (fallbackRes.ok) {
        const text = await fallbackRes.text();
        return JSON.parse(text) as DatabaseSchema;
      }
    }
  } catch (err) {
    console.warn("Gagal membaca database dari GitHub API:", err);
  }
  return null;
}

async function ensureGitHubBranchExists(): Promise<boolean> {
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MTs-Al-Falaahiyyah-CMS",
    "Content-Type": "application/json",
  };

  const checkRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/git/ref/heads/${GITHUB_DB_BRANCH}`,
    { headers, cache: "no-store" }
  );
  if (checkRes.ok) return true;

  // Buat branch db-data dari main agar penyimpanan tidak memicu rebuild Vercel
  const mainRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/git/ref/heads/main`,
    { headers, cache: "no-store" }
  );
  if (!mainRes.ok) return false;
  const mainData = await mainRes.json();
  const mainSha = mainData?.object?.sha;
  if (!mainSha) return false;

  const createRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/refs`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ref: `refs/heads/${GITHUB_DB_BRANCH}`,
      sha: mainSha,
    }),
    cache: "no-store",
  });

  return createRes.ok || createRes.status === 422;
}

async function writeToGitHub(data: DatabaseSchema): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;
  try {
    const headers = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "MTs-Al-Falaahiyyah-CMS",
      "Content-Type": "application/json",
    };

    await ensureGitHubBranchExists();

    // Ambil SHA file saat ini di branch db-data
    let fileSha: string | undefined;
    const metaRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/data/db.json?ref=${GITHUB_DB_BRANCH}`,
      { headers, cache: "no-store" }
    );
    if (metaRes.ok) {
      const meta = await metaRes.json();
      fileSha = meta.sha;
    }

    const contentBase64 = Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64");

    const putRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/data/db.json`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: "chore(db): update data permanen dari Portal Admin",
          content: contentBase64,
          ...(fileSha ? { sha: fileSha } : {}),
          branch: GITHUB_DB_BRANCH,
        }),
        cache: "no-store",
      }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      console.error("GitHub API PUT gagal:", putRes.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Gagal menulis ke GitHub API:", err);
    return false;
  }
}

// --- FUNGSI UTAMA BACA & SIMPAN DATABASE ---
export async function getDb(): Promise<DatabaseSchema> {
  const now = Date.now();

  // 1. Jika ada KV/Upstash Redis
  if (KV_URL && KV_TOKEN) {
    const kvData = await readFromKv();
    if (kvData) {
      globalForDb.__mtsDbCache = kvData;
      globalForDb.__mtsDbLastFetch = now;
      return kvData;
    }
  }

  // 2. Jika ada GITHUB_TOKEN (Database Permanen via GitHub)
  if (GITHUB_TOKEN) {
    // Gunakan cache memori singkat (2 detik) agar navigasi cepat
    if (
      globalForDb.__mtsDbCache &&
      globalForDb.__mtsDbLastFetch &&
      now - globalForDb.__mtsDbLastFetch < 2000
    ) {
      return globalForDb.__mtsDbCache;
    }
    const ghData = await readFromGitHub();
    if (ghData) {
      globalForDb.__mtsDbCache = ghData;
      globalForDb.__mtsDbLastFetch = now;
      return ghData;
    }
  }

  // 3. Jika berjalan di lokal (bukan Vercel), baca dari file lokal
  if (!process.env.VERCEL) {
    const localData = readLocalFileDb();
    if (localData) {
      globalForDb.__mtsDbCache = localData;
      return localData;
    }
  }

  // 4. Jika di Vercel tanpa GITHUB_TOKEN, utamakan memory cache dulu agar perubahan tidak hilang selama instance hidup
  if (globalForDb.__mtsDbCache) {
    return globalForDb.__mtsDbCache;
  }

  const localFallback = readLocalFileDb();
  if (localFallback) {
    globalForDb.__mtsDbCache = localFallback;
    return localFallback;
  }

  const initial = initDatabase();
  await saveDb(initial);
  return initial;
}

export async function saveDb(data: DatabaseSchema): Promise<boolean> {
  globalForDb.__mtsDbCache = data;
  globalForDb.__mtsDbLastFetch = Date.now();

  // 1. Simpan ke KV jika tersedia
  if (KV_URL && KV_TOKEN) {
    const ok = await writeToKv(data);
    if (ok) return true;
  }

  // 2. Simpan ke GitHub secara permanen jika GITHUB_TOKEN tersedia
  if (GITHUB_TOKEN) {
    const ok = await writeToGitHub(data);
    if (ok) return true;
  }

  // 3. Simpan ke file lokal jika di komputer lokal
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn(
      "Filesystem read-only (Vercel). Tambahkan GITHUB_TOKEN di Environment Variables Vercel untuk penyimpanan permanen."
    );
    return false;
  }
}

// --- CRUD PENGATURAN SEKOLAH ---
export async function getSchoolSettings(): Promise<SchoolSettings> {
  const db = await getDb();
  return db.settings;
}

export async function updateSchoolSettings(updates: Partial<SchoolSettings>): Promise<SchoolSettings> {
  const db = await getDb();
  db.settings = { ...db.settings, ...updates };
  await saveDb(db);
  return db.settings;
}

// --- CRUD BERITA & ARTIKEL ---
export async function getNewsList(includeDrafts = false): Promise<NewsItem[]> {
  const db = await getDb();
  let items = db.news;
  if (!includeDrafts) {
    items = items.filter((n) => n.isPublished);
  }
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const db = await getDb();
  const item = db.news.find((n) => n.slug === slug);
  return item || null;
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const db = await getDb();
  const item = db.news.find((n) => n.id === id);
  return item || null;
}

export async function createNews(newsData: Omit<NewsItem, "id">): Promise<NewsItem> {
  const db = await getDb();
  const id = `news-${Date.now()}`;
  const newItem: NewsItem = {
    ...newsData,
    id,
    views: 0,
  };
  db.news.unshift(newItem);
  await saveDb(db);
  return newItem;
}

export async function updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> {
  const db = await getDb();
  const index = db.news.findIndex((n) => n.id === id);
  if (index === -1) return null;

  db.news[index] = { ...db.news[index], ...updates };
  await saveDb(db);
  return db.news[index];
}

export async function deleteNews(id: string): Promise<boolean> {
  const db = await getDb();
  const index = db.news.findIndex((n) => n.id === id);
  if (index === -1) return false;

  db.news.splice(index, 1);
  await saveDb(db);
  return true;
}

// --- CRUD GALERI ---
export async function getGalleryList(): Promise<GalleryItem[]> {
  const db = await getDb();
  return [...db.gallery].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createGallery(item: Omit<GalleryItem, "id">): Promise<GalleryItem> {
  const db = await getDb();
  const newItem: GalleryItem = {
    ...item,
    id: `gal-${Date.now()}`,
  };
  db.gallery.unshift(newItem);
  await saveDb(db);
  return newItem;
}

export async function deleteGallery(id: string): Promise<boolean> {
  const db = await getDb();
  const index = db.gallery.findIndex((g) => g.id === id);
  if (index === -1) return false;

  db.gallery.splice(index, 1);
  await saveDb(db);
  return true;
}

// --- GURU & TENAGA KEPENDIDIKAN ---
export async function getTeachersList(): Promise<Teacher[]> {
  const db = await getDb();
  return db.teachers;
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
  const db = await getDb();
  const item = db.teachers.find((t) => t.id === id);
  return item || null;
}

export async function createTeacher(teacherData: Omit<Teacher, "id">): Promise<Teacher> {
  const db = await getDb();
  const id = `t-${Date.now()}`;
  const newTeacher: Teacher = {
    ...teacherData,
    id,
  };
  db.teachers.push(newTeacher);
  await saveDb(db);
  return newTeacher;
}

export async function updateTeacher(id: string, updates: Partial<Teacher>): Promise<Teacher | null> {
  const db = await getDb();
  const index = db.teachers.findIndex((t) => t.id === id);
  if (index === -1) return null;

  db.teachers[index] = { ...db.teachers[index], ...updates };
  await saveDb(db);
  return db.teachers[index];
}

export async function deleteTeacher(id: string): Promise<boolean> {
  const db = await getDb();
  const index = db.teachers.findIndex((t) => t.id === id);
  if (index === -1) return false;

  db.teachers.splice(index, 1);
  await saveDb(db);
  return true;
}

// --- PPDB PENDAFTARAN ---
export async function getPpdbList(): Promise<PpdbRegistration[]> {
  const db = await getDb();
  return [...db.ppdb].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createPpdbRegistration(
  data: Omit<PpdbRegistration, "id" | "registrationNo" | "createdAt" | "status">
): Promise<PpdbRegistration> {
  const db = await getDb();
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
  await saveDb(db);
  return newRegistration;
}

export async function updatePpdbStatus(
  id: string,
  status: PpdbRegistration["status"],
  notes?: string
): Promise<PpdbRegistration | null> {
  const db = await getDb();
  const index = db.ppdb.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.ppdb[index].status = status;
  if (notes !== undefined) {
    db.ppdb[index].notes = notes;
  }
  await saveDb(db);
  return db.ppdb[index];
}

// --- AUTENTIKASI ADMIN ---
export async function validateAdminUser(username: string, passwordAttempt: string): Promise<boolean> {
  const db = await getDb();
  const expectedUser = process.env.ADMIN_USERNAME || db.admin.username || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || db.admin.passwordHash || "AdminAlFalaahiyyah2025!";

  if (username !== expectedUser) {
    return false;
  }

  return await verifyPassword(passwordAttempt, expectedPass);
}

export async function updateAdminPassword(newPassword: string): Promise<void> {
  const db = await getDb();
  const hashedPassword = await hashPassword(newPassword);
  db.admin.passwordHash = hashedPassword;
  await saveDb(db);
}
