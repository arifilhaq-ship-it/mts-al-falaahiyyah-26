import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
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

export const GH_TOKEN_COOKIE = "mts_gh_token";

const globalForDb = globalThis as unknown as {
  __mtsDbCache?: DatabaseSchema;
  __mtsDbLastFetch?: number;
  __mtsGhToken?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const GITHUB_REPO = process.env.GITHUB_REPO || "arifilhaq-ship-it/mts-al-falaahiyyah-26";
const GITHUB_DB_BRANCH = process.env.GITHUB_DB_BRANCH || "db-data";

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const KV_KEY = "mts_al_falaahiyyah_db_v1";

export function getActiveGitHubToken(): string {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const cookieStore = cookies();
    const cookieToken = cookieStore.get(GH_TOKEN_COOKIE)?.value;
    if (cookieToken) {
      globalForDb.__mtsGhToken = cookieToken;
      return cookieToken;
    }
  } catch {
    // cookies() mungkin dipanggil di luar request context
  }
  return globalForDb.__mtsGhToken || "";
}

export function setActiveGitHubToken(token: string) {
  globalForDb.__mtsGhToken = token.trim();
}

export function isPermanentStorageConfigured(): {
  active: boolean;
  provider: "github" | "kv" | "local-file" | "memory-only";
} {
  if (KV_URL && KV_TOKEN) return { active: true, provider: "kv" };
  if (getActiveGitHubToken()) return { active: true, provider: "github" };
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

// --- CLOUD STORAGE 2: GITHUB CLOUD DATABASE (MENDUKUNG FILE BESAR > 1MB & REPO PUBLIK) ---
async function readFromGitHub(): Promise<DatabaseSchema | null> {
  const token = getActiveGitHubToken();
  const headers: Record<string, string> = {
    "User-Agent": "MTs-Al-Falaahiyyah-CMS",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // 1. Jika ada token, ambil commit terbaru di branch db-data lalu baca raw blob-nya agar selalu instan (tanpa cache CDN)
    if (token) {
      const refRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/git/ref/heads/${GITHUB_DB_BRANCH}`,
        {
          headers: { ...headers, Accept: "application/vnd.github.v3+json" },
          cache: "no-store",
        }
      );
      if (refRes.ok) {
        const refData = await refRes.json();
        const commitSha = refData?.object?.sha;
        if (commitSha) {
          const rawBySha = await fetch(
            `https://raw.githubusercontent.com/${GITHUB_REPO}/${commitSha}/data/db.json`,
            { headers, cache: "no-store" }
          );
          if (rawBySha.ok) {
            const text = await rawBySha.text();
            return JSON.parse(text) as DatabaseSchema;
          }
        }
      }
    }

    // 2. Baca langsung dari branch db-data publik (bahkan pengunjung publik tanpa token tetap mendapat data terbaru!)
    const publicRawRes = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_DB_BRANCH}/data/db.json?t=${Date.now()}`,
      { headers, cache: "no-store" }
    );
    if (publicRawRes.ok) {
      const text = await publicRawRes.text();
      return JSON.parse(text) as DatabaseSchema;
    }
  } catch (err) {
    console.warn("Gagal membaca database dari GitHub:", err);
  }
  return null;
}

export async function writeToGitHub(data: DatabaseSchema, customToken?: string): Promise<{ ok: boolean; error?: string }> {
  const token = customToken || getActiveGitHubToken();
  if (!token) {
    return { ok: false, error: "Token GitHub belum diisi." };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MTs-Al-Falaahiyyah-CMS",
    "Content-Type": "application/json",
  };

  try {
    // 1. Cek apakah branch db-data sudah ada; jika belum, buat dari main
    let baseCommitSha = "";
    const refRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/git/ref/heads/${GITHUB_DB_BRANCH}`,
      { headers, cache: "no-store" }
    );

    if (refRes.ok) {
      const refJson = await refRes.json();
      baseCommitSha = refJson?.object?.sha || "";
    } else {
      const mainRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/git/ref/heads/main`,
        { headers, cache: "no-store" }
      );
      if (!mainRes.ok) {
        const errText = await mainRes.text();
        return { ok: false, error: `Token tidak valid atau repo tidak ditemukan (${mainRes.status}): ${errText}` };
      }
      const mainJson = await mainRes.json();
      baseCommitSha = mainJson?.object?.sha || "";

      // Buat branch db-data
      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/refs`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ref: `refs/heads/${GITHUB_DB_BRANCH}`,
          sha: baseCommitSha,
        }),
        cache: "no-store",
      });
    }

    // 2. Buat Git Blob untuk data/db.json (Mendukung ukuran besar hingga >10MB)
    const jsonString = JSON.stringify(data, null, 2);
    const blobRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        content: jsonString,
        encoding: "utf-8",
      }),
      cache: "no-store",
    });

    if (!blobRes.ok) {
      const errText = await blobRes.text();
      return { ok: false, error: `Gagal membuat blob GitHub (${blobRes.status}): ${errText}` };
    }
    const blobJson = await blobRes.json();
    const blobSha = blobJson.sha;

    // 3. Buat Git Tree baru
    const treeRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/trees`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        base_tree: baseCommitSha,
        tree: [
          {
            path: "data/db.json",
            mode: "100644",
            type: "blob",
            sha: blobSha,
          },
        ],
      }),
      cache: "no-store",
    });

    if (!treeRes.ok) {
      const errText = await treeRes.text();
      return { ok: false, error: `Gagal membuat tree GitHub (${treeRes.status}): ${errText}` };
    }
    const treeJson = await treeRes.json();

    // 4. Buat Commit baru di branch db-data
    const commitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/git/commits`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: "chore(db): simpan perubahan permanen dari Portal Admin",
        tree: treeJson.sha,
        parents: [baseCommitSha],
      }),
      cache: "no-store",
    });

    if (!commitRes.ok) {
      const errText = await commitRes.text();
      return { ok: false, error: `Gagal membuat commit GitHub (${commitRes.status}): ${errText}` };
    }
    const commitJson = await commitRes.json();

    // 5. Update pointer branch db-data ke commit baru
    const updateRefRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/git/refs/heads/${GITHUB_DB_BRANCH}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          sha: commitJson.sha,
          force: true,
        }),
        cache: "no-store",
      }
    );

    if (!updateRefRes.ok) {
      const errText = await updateRefRes.text();
      return { ok: false, error: `Gagal mengupdate branch (${updateRefRes.status}): ${errText}` };
    }

    return { ok: true };
  } catch (err: any) {
    console.error("Gagal menulis ke GitHub API:", err);
    return { ok: false, error: err?.message || "Kesalahan jaringan ke GitHub." };
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

  // 2. Jika berjalan di Vercel (atau GITHUB_TOKEN aktif), baca dari branch db-data di GitHub
  if (process.env.VERCEL || getActiveGitHubToken()) {
    if (
      globalForDb.__mtsDbCache &&
      globalForDb.__mtsDbLastFetch &&
      now - globalForDb.__mtsDbLastFetch < 1500
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

  // 3. Jika berjalan di komputer lokal, baca dari file lokal data/db.json
  if (!process.env.VERCEL) {
    const localData = readLocalFileDb();
    if (localData) {
      globalForDb.__mtsDbCache = localData;
      return localData;
    }
  }

  // 4. Fallback ke memory cache atau file lokal bawaan
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

  // 2. Simpan ke GitHub secara permanen jika token tersedia
  const ghToken = getActiveGitHubToken();
  if (ghToken) {
    const res = await writeToGitHub(data, ghToken);
    if (res.ok) {
      // Jika di lokal, tulis juga ke file lokal agar sinkron
      if (!process.env.VERCEL) {
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
        } catch {}
      }
      return true;
    }
  }

  // 3. Simpan ke file lokal jika di komputer lokal
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Filesystem read-only (Vercel).");
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
export async function getAdminUsername(): Promise<string> {
  const db = await getDb();
  return db.admin?.username || process.env.ADMIN_USERNAME || "admin";
}

export async function validateAdminUser(username: string, passwordAttempt: string): Promise<boolean> {
  const db = await getDb();
  const expectedUser = db.admin?.username || process.env.ADMIN_USERNAME || "admin";
  const expectedPass = db.admin?.passwordHash || process.env.ADMIN_PASSWORD || "AdminAlFalaahiyyah2025!";

  if (username.trim() !== expectedUser.trim()) {
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

export async function updateAdminCredentials(
  newUsername: string,
  newPassword?: string
): Promise<void> {
  const db = await getDb();
  if (newUsername && newUsername.trim()) {
    db.admin.username = newUsername.trim();
  }
  if (newPassword && newPassword.trim()) {
    db.admin.passwordHash = await hashPassword(newPassword.trim());
  }
  await saveDb(db);
}
