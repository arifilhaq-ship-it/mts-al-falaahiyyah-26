# Panduan Arsitektur Database & Autentikasi MTs Al Falaahiyyah

Dokumen ini menjelaskan rancangan keamanan autentikasi dan skema database untuk website resmi **MTs Al Falaahiyyah Cikoneng Kulon, Kecamatan Ganeas, Kabupaten Sumedang**.

---

## 1. Arsitektur Autentikasi yang Aman (Bukan Login Palsu)

Aplikasi ini menggunakan sistem autentikasi standar industri tanpa pustaka dummy atau penyimpanan password teks biasa:

### A. Hashing Kata Sandi Kriptografis (PBKDF2)
- Diimplementasikan di `lib/auth.ts` menggunakan native **Web Crypto API (`crypto.subtle`)**.
- Menggunakan algoritma **PBKDF2** dengan digest **SHA-256**, **100.000 iterasi**, dan **salt acak 16-karakter** unik per hash.
- Format penyimpanan hash: `<salt>:<derived_key_hex>`.
- Mendukung verifikasi konstan waktu untuk mencegah serangan *timing attack*.

### B. Token Sesi JWT Berbasis HMAC-SHA256
- Sesi ditandatangani menggunakan algoritma kriptografi **HMAC-SHA256** dengan secret key dari environment variable `JWT_SECRET`.
- Token memiliki masa berlaku terbatas (default 24 jam) dan diverifikasi di setiap request yang dilindungi.

### C. Keamanan Cookie (HttpOnly & SameSite)
- Token sesi disimpan di cookie browser dengan flag:
  - `HttpOnly`: Mencegah pembacaan cookie oleh skrip JavaScript di browser (proteksi dari serangan XSS).
  - `SameSite=Lax`: Mencegah pengiriman cookie lintas domain jahat (proteksi dari serangan CSRF).
  - `Secure`: Otomatis aktif pada mode produksi (HTTPS).
  - `Path=/`: Berlaku untuk seluruh rute madrasah.

### D. Perlindungan Rute (Next.js Middleware)
- File `middleware.ts` memeriksa token sesi secara langsung di Edge runtime sebelum request halaman `/admin/*` dirender ke browser.
- Pengunjung yang belum terautentikasi otomatis dialihkan ke `/admin/login?from=...`.

---

## 2. Arsitektur Database Saat Ini (Local Out-of-the-Box)

Secara default, aplikasi menggunakan database file JSON terisolasi di `data/db.json` yang dikelola oleh `lib/db.ts`:
- **Keuntungan**:
  - Langsung dapat dijalankan di komputer lokal pengembang tanpa perlu menginstal PostgreSQL/MySQL/Docker terlebih dahulu.
  - Dilengkapi mekanisme *fallback* ke in-memory cache jika berjalan di lingkungan serverless read-only (seperti Vercel).
  - Menyimpan data pendaftar PPDB, berita, galeri, dan profil sekolah secara konsisten.

---

## 3. Skema Database Relasional untuk Produksi (PostgreSQL / Supabase / Neon / MySQL)

Jika madrasah ingin menghubungkan website ke database cloud relasional (seperti **Supabase**, **Neon.tech**, atau **PostgreSQL cPanel**), jalankan script SQL berikut:

```sql
-- 1. TABEL PENGATURAN INFORMASI MADRASAH
CREATE TABLE school_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    school_name VARCHAR(150) NOT NULL,
    tagline TEXT,
    description TEXT,
    address TEXT,
    village VARCHAR(100),
    district VARCHAR(100),
    regency VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    phone VARCHAR(30),
    whatsapp VARCHAR(30),
    email VARCHAR(100),
    website VARCHAR(100),
    npsn VARCHAR(30),
    nsm VARCHAR(30),
    accreditation VARCHAR(50),
    foundation_name VARCHAR(150),
    headmaster_name VARCHAR(150),
    headmaster_speech TEXT,
    headmaster_photo TEXT,
    announcement_text TEXT,
    is_announcement_active BOOLEAN DEFAULT TRUE,
    is_ppdb_active BOOLEAN DEFAULT TRUE,
    ppdb_academic_year VARCHAR(20) DEFAULT '2025/2026',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL BERITA & ARTIKEL
CREATE TABLE news (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL GALERI KEGIATAN
CREATE TABLE gallery (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL PENDAFTARAN PPDB ONLINE
CREATE TABLE ppdb_registrations (
    id VARCHAR(50) PRIMARY KEY,
    registration_no VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    nisn VARCHAR(20),
    nik VARCHAR(20),
    gender CHAR(1) CHECK (gender IN ('L', 'P')),
    birth_place VARCHAR(100),
    birth_date DATE,
    previous_school VARCHAR(150) NOT NULL,
    parent_name VARCHAR(150) NOT NULL,
    parent_phone VARCHAR(30) NOT NULL,
    address TEXT,
    program_choice VARCHAR(50) DEFAULT 'Reguler',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'accepted', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL PENGGUNA ADMINISTRATOR
CREATE TABLE admin_users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Cara Menghubungkan ke PostgreSQL / Supabase

1. Buat database baru di **[Supabase.com](https://supabase.com)** atau **Neon.tech**.
2. Salin *Connection String* URI dan tambahkan ke `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
   DATABASE_PROVIDER="postgres"
   ```
3. Jalankan script SQL di menu SQL Editor Supabase.
4. Di file `lib/db.ts`, ganti pemanggilan `saveDb` dan `getDb` dengan query client PostgreSQL (menggunakan library `pg` atau `@vercel/postgres`).
