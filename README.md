# Website Resmi MTs Al Falaahiyyah Cikoneng Kulon Ganeas Sumedang

Website resmi **Madrasah Tsanawiyah (MTs) Al Falaahiyyah**, berlokasi di **Cikoneng Kulon, Desa Cikoneng, Kecamatan Ganeas, Kabupaten Sumedang, Jawa Barat**. Dibangun menggunakan **Next.js (App Router)** dan **Tailwind CSS** dengan arsitektur modern, elegan, profesional, responsif penuh di HP dan komputer, serta mencerminkan identitas madrasah Islam.

---

## 🌟 Fitur Utama Website

### 1. Halaman Publik
- **Beranda (`/`)**:
  - Banner pengumuman dinamis di bagian atas (dapat diaktifkan/dinonaktifkan oleh admin).
  - Navbar responsif dengan logo madrasah, navigasi cepat, dan tombol CTA PPDB Online.
  - Hero Section dengan foto kegiatan madrasah, identitas Cikoneng Kulon Ganeas Sumedang, motto madrasah, dan quick counter statistics.
  - Sambutan Kepala Madrasah beserta foto pimpinan dan kutipan visi kepemimpinan.
  - Program Unggulan (Tahfidzul Qur'an, Pendalaman Kitab Kuning, Madrasah Sains & Riset, Bilingual Arab-Inggris, Pembiasaan Shalat).
  - Berita & Agenda Terkini (3 artikel terbaru dengan thumbnail dan badge kategori).
  - Galeri Kegiatan Santri sekilas dengan modal lightbox interaktif.
  - Peta Google Maps wilayah Cikoneng Ganeas Sumedang dan tombol langsung WhatsApp panitia.
  - Footer komprehensif berisi legalitas Kemenag, jam operasional, navigasi cepat, dan hak cipta.
- **Profil (`/profil`)**: Sejarah madrasah di Cikoneng Kulon, sarana prasarana, fasilitas penunjang, dan identitas kelembagaan.
- **Visi Misi (`/visi-misi`)**: Rumusan visi madrasah, misi strategis, serta 7 pilar karakter santri Al Falaahiyyah.
- **Guru dan Tenaga Kependidikan (`/guru-staff`)**: Direktori dewan asatidz dan staf TU dengan filter tab (Pimpinan, Guru PAI, Guru Mapel Umum, Staf TU).
- **Akademik (`/akademik`)**: Struktur kurikulum PAI Kemenag, kurikulum nasional, kalender akademik, dan ragam ekstrakurikuler (Pramuka, Hadroh, Silat, PMR, dll.).
- **Berita & Pengumuman (`/berita`)**: Katalog berita dengan fitur pencarian teks, filter kategori, dan detail artikel dinamis (`/berita/[slug]`).
- **Galeri Foto (`/galeri`)**: Dokumentasi kegiatan santri dengan filter kategori dan modal perbesaran gambar (lightbox).
- **PPDB Online (`/ppdb`)**: Informasi alur pendaftaran 5 langkah, jadwal gelombang, syarat berkas, dan **Formulir Pendaftaran Online Interaktif** yang otomatis menerbitkan Nomor Registrasi (contoh: `PPDB-2025-001`) dan tombol konfirmasi otomatis via WhatsApp.
- **Kontak (`/kontak`)**: Informasi alamat lengkap Cikoneng Kulon Ganeas Sumedang, kontak telepon, form kirim pesan, dan peta interaktif.

### 2. Panel Admin Madrasah (`/admin`)
- **Autentikasi Aman (Bukan Login Palsu)**:
  - Menggunakan algoritma kriptografi **PBKDF2 SHA-256** dengan salt acak dan **JWT HMAC-SHA256**.
  - Sesi dilindungi via cookie **HttpOnly, SameSite=Lax** dan diverifikasi di Edge melalui Next.js **Middleware (`middleware.ts`)**.
- **Dashboard Overview (`/admin`)**: Statistik jumlah berita, galeri, dewan guru & staf, pendaftar PPDB terbaru, dan status PPDB.
- **Kelola Guru & GTK (`/admin/guru`)**: Tambah data guru baru, edit profil pendidik, perbarui foto profil resmi (baik via upload file lokal maupun link URL), atur mata pelajaran, NIP, serta pendidikan terakhir.
- **Kelola Berita (`/admin/berita`)**: Tambah artikel baru, edit berita, hapus, kelola kategori, dan atur status Terbit/Draft.
- **Kelola Galeri (`/admin/galeri`)**: Tambah foto kegiatan baru beserta judul, kategori, dan deskripsi, serta hapus foto.
- **Kelola PPDB (`/admin/ppdb`)**: Pusat kontrol PPDB lengkap terbagi dalam 2 tab:
  1. *Data Pendaftar*: Melihat tabel pendaftar online, memfilter status (Pending, Verified, Accepted, Rejected), unduh/ekspor berkas ke CSV/Excel, dan tombol chat WhatsApp langsung ke orang tua calon santri.
  2. *Pengaturan & Jadwal PPDB*: Mengatur status Buka/Tutup pendaftaran online, Tahun Pelajaran (misal 2025/2026), jadwal Gelombang 1 & 2 (tanggal, judul, keuntungan), daftar syarat berkas pendaftaran, pesan saat pendaftaran ditutup, serta nomor WhatsApp khusus panitia PPDB.
- **Pengaturan Informasi Madrasah (`/admin/pengaturan`)**: Mengubah nama kepala madrasah, sambutan, nomor kontak, teks pengumuman berjalan, status buka/tutup PPDB, serta pengisian NPSN dan NSM resmi madrasah.

---

## 🔐 Kredensial Login Admin Default

Untuk masuk ke panel admin:
- **URL Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Nama Pengguna (Username)**: `admin`
- **Kata Sandi (Password)**: `AdminAlFalaahiyyah2025!`

> [!IMPORTANT]
> Di lingkungan produksi, ganti kata sandi ini melalui menu **Pengaturan** di dashboard admin atau dengan mengubah variabel `ADMIN_PASSWORD` dan `JWT_SECRET` pada file `.env.local`.

---

## 📁 Struktur Folder Proyek

```text
mts-al-falaahiyyah/
├── app/
│   ├── (public)/                 # Route Group untuk Halaman Publik Website
│   │   ├── layout.tsx            # Layout Publik (Navbar, Banner, Footer)
│   │   ├── page.tsx              # Beranda Utama
│   │   ├── profil/page.tsx       # Halaman Profil & Sejarah
│   │   ├── visi-misi/page.tsx    # Halaman Visi Misi & Karakter
│   │   ├── guru-staff/page.tsx   # Halaman GTK
│   │   ├── akademik/page.tsx     # Halaman Kurikulum & Ekstrakurikuler
│   │   ├── berita/
│   │   │   ├── page.tsx          # Katalog Berita & Pencarian
│   │   │   └── [slug]/page.tsx   # Detail Artikel Berita Dinamis
│   │   ├── galeri/page.tsx       # Halaman Galeri Foto
│   │   ├── ppdb/page.tsx         # Halaman PPDB & Form Online
│   │   └── kontak/page.tsx       # Halaman Kontak & Peta
│   ├── admin/                    # Panel Administrasi Madrasah
│   │   ├── layout.tsx            # Layout Dashboard Admin (Sidebar, Topbar)
│   │   ├── login/page.tsx        # Halaman Login Admin
│   │   ├── page.tsx              # Ringkasan Dashboard Admin
│   │   ├── berita/page.tsx       # CRUD Berita
│   │   ├── galeri/page.tsx       # CRUD Galeri Foto
│   │   ├── ppdb/page.tsx         # Manajemen Pendaftar PPDB Online
│   │   └── pengaturan/page.tsx   # Manajemen Profil & Kontak Sekolah
│   ├── api/                      # Backend API Endpoints (Next.js App Router)
│   │   ├── auth/login/route.ts   # Autentikasi Login (HttpOnly Cookie JWT)
│   │   ├── auth/logout/route.ts  # Logout Admin
│   │   ├── auth/me/route.ts      # Verifikasi Sesi
│   │   ├── news/route.ts         # GET & POST Berita
│   │   ├── news/[id]/route.ts    # PUT & DELETE Berita
│   │   ├── gallery/route.ts      # GET & POST Galeri
│   │   ├── gallery/[id]/route.ts # DELETE Galeri
│   │   ├── settings/route.ts     # GET & PUT Pengaturan Madrasah
│   │   └── ppdb/route.ts         # POST Pendaftaran & GET Data PPDB
│   ├── globals.css               # Styling Tailwind CSS & Animasi
│   └── layout.tsx                # Root Layout & Metadata HTML
├── components/                   # Komponen Reusable
│   ├── Navbar.tsx                # Navigasi Utama & Mobile Drawer
│   ├── Footer.tsx                # Footer Madrasah
│   ├── Logo.tsx                  # Emblem Logo Islami MTs Al Falaahiyyah
│   ├── Icons.tsx                 # Ikon SVG Ringan & Bebas Bug
│   ├── HeroBanner.tsx            # Hero Section Beranda
│   ├── HeadmasterGreeting.tsx    # Sambutan Kepala Madrasah
│   ├── ProgramsSection.tsx       # Kartu Program Unggulan
│   ├── RecentNewsSection.tsx     # Kartu Berita Terkini
│   ├── GallerySection.tsx        # Galeri Sekilas & Lightbox
│   ├── MapSection.tsx            # Peta Lokasi Ganeas & Hotline
│   ├── SectionHeading.tsx        # Judul Seksi Standar Elegan
│   └── AnnouncementBanner.tsx    # Banner Pengumuman Berjalan
├── lib/                          # Modul Keamanan & Basis Data
│   ├── auth.ts                   # Kriptografi PBKDF2 & JWT Signing
│   ├── db.ts                     # Engine CRUD Database & Persistence
│   ├── data-defaults.ts          # Data Awal MTs Al Falaahiyyah
│   └── types.ts                  # TypeScript Types & Interfaces
├── middleware.ts                 # Edge Route Protection untuk /admin/*
├── tailwind.config.ts            # Konfigurasi Tema Madrasah Emerald & Gold
├── tsconfig.json                 # Konfigurasi TypeScript
├── DATABASE_GUIDE.md             # Panduan Arsitektur Database & SQL
└── README.md                     # Dokumentasi Proyek
```

---

## 🚀 Panduan Menjalankan di Komputer Lokal

Ikuti langkah mudah berikut di terminal (Command Prompt, PowerShell, atau Git Bash):

### 1. Masuk ke Folder Proyek
```bash
cd C:\Users\user\.gemini\antigravity\scratch\mts-al-falaahiyyah
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```

### 4. Buka di Browser
- **Halaman Website Utama**: [http://localhost:3000](http://localhost:3000)
- **Panel Admin Madrasah**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🌐 Panduan Deploy ke Layanan Hosting

### A. Deploy ke Vercel (Rekomendasi & Gratis)
1. Unggah folder proyek ke repositori **GitHub** atau **GitLab** Anda:
   ```bash
   git init
   git add .
   git commit -m "Inisialisasi Website Resmi MTs Al Falaahiyyah"
   git branch -M main
   git remote add origin https://github.com/username/mts-al-falaahiyyah.git
   git push -u origin main
   ```
2. Kunjungi **[vercel.com](https://vercel.com)** dan pilih **"Add New Project"**.
3. Hubungkan repositori GitHub Anda.
4. Masukkan **Environment Variables**:
   - `JWT_SECRET`: Buat string acak unik dan panjang (misal: `kuncirahasia_falaahiyyah_sumedang_2025_xyz`).
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: Buat kata sandi kuat yang aman.
5. Klik **Deploy**. Website akan langsung online dengan domain resmi (contoh: `mts-al-falaahiyyah.vercel.app`) dan dapat dipasangi custom domain madrasah (`mtsalfalaahiyyah.sch.id`).

### B. Deploy ke VPS / Server Mandiri (Ubuntu/Debian dengan Node.js & Nginx)
1. Build proyek untuk mode produksi:
   ```bash
   npm run build
   ```
2. Jalankan aplikasi menggunakan PM2:
   ```bash
   pm2 start npm --name "mts-alfalaahiyyah" -- start
   pm2 save
   ```
3. Arahkan reverse proxy Nginx ke port `3000` dengan sertifikat SSL Let's Encrypt gratis.

---

## 📋 Catatan Transparansi Data Resmi Sekolah
Sesuai instruksi untuk **tidak mengarang data resmi sekolah yang belum tersedia**, bagian nomor perizinan (**NPSN** dan **NSM**) serta nama definitif kepala madrasah telah diberi penanda jelas `(Isi via Menu Pengaturan Admin)`. Pihak tata usaha MTs Al Falaahiyyah dapat langsung melengkapi data tersebut kapan saja melalui panel admin pada menu **Pengaturan Madrasah**.
