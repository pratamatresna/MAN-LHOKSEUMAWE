# Spesifikasi Teknis Pembaruan Sistem: Migrasi ke MERN Stack

Dokumen ini merangkum struktur dan pedoman pembaruan (refactoring) website dari arsitektur saat ini menjadi **MERN Stack (MongoDB, Express.js, React.js, dan Node.js)**. Fokus utama adalah mengintegrasikan backend dan database secara optimal tanpa mengubah sedikit pun antarmuka (UI) dan warna desain yang sudah ada (sesuai referensi form Login dan Form PPDB).

---

## 1. Konfigurasi Environment (`.env`)

Simpan konfigurasi berikut di sisi backend dan frontend (sesuaikan prefix environment variable jika menggunakan Vite/CRA di React) untuk menjaga keamanan kredensial dan URL database.

```env
# ==========================================
# BACKEND .env CONFIGURATION
# ==========================================

# Port Server Express
PORT=5000

# Koneksi Database MongoDB (Cluster dev-man-lhoksemawe)
MONGODB_URI=mongodb+srv://pratamatresna08_db_user:VtQSsT41CZHOtL8C@dev-man-lhoksemawe.gbniyfo.mongodb.net/?appName=dev-man-lhoksemawe

# JWT Secret untuk Autentikasi
JWT_SECRET=rahasia_token_aman_123

# ==========================================
# KREDENSIAL ROLE AKSES (DEFAULT SEED)
# ==========================================
# Saat inisialisasi database atau hardcode login logic, gunakan sandi berikut:

ROLE_ADMIN_PASS=admin123
ROLE_HUMAS_PASS=adminman
ROLE_OSIM_PASS=osim12
```
*Catatan:* Role **User** tidak memerlukan sandi login khusus karena difokuskan pada akses publik untuk mengisi Formulir Mandiri PPDB Online.

---

## 2. Struktur Folder & Arsitektur (Bebas Jargon)

Sistem akan dipisah menjadi dua direktori utama: `backend/` dan `frontend/`. 
Pada bagian frontend, komponen dikelompokkan berdasarkan **fungsinya dari yang terkecil hingga membentuk halaman utuh** (mengadaptasi pola terstruktur tanpa menggunakan istilah biologi seperti atom/molekul).

### A. Struktur Frontend (React.js)
```text
frontend/
├── public/
├── src/
│   ├── assets/               # Gambar, ikon, dan file statis lainnya
│   ├── config/               # Setup environment variabel React
│   ├── ui-elements/          # Komponen UI paling dasar
│   │   ├── Button/           # Tombol aksi (Kirim Formulir, Log In)
│   │   ├── Input/            # Field teks (Sandi, Nama, NISN)
│   │   ├── Select/           # Dropdown pilihan peran atau kelamin
│   │   └── Label/            # Teks label input
│   │
│   ├── ui-blocks/            # Gabungan beberapa elemen dasar
│   │   ├── FormField/        # Input beserta Label dan pesan error di bawahnya
│   │   ├── InfoBox/          # Kotak "Petunjuk Sandi Peran"
│   │   └── FileUploadBox/    # Kotak garis putus-putus untuk unggah berkas
│   │
│   ├── ui-sections/          # Bagian besar yang memiliki fungsi dan logika mandiri
│   │   ├── LoginForm/        # Form utuh untuk login CMS Operator
│   │   └── PPDBForm/         # Form utuh pendaftaran (Biodata Siswa, Ortu, Berkas)
│   │
│   ├── layouts/              # Struktur tata letak halaman global
│   │   ├── AuthLayout/       # Layout dengan background abu-abu terang untuk login
│   │   └── PublicLayout/     # Layout untuk halaman pendaftaran siswa
│   │
│   ├── pages/                # Halaman utuh yang diakses via routing (React Router)
│   │   ├── LoginCMS.jsx      # Merender AuthLayout + LoginForm
│   │   └── FormPPDB.jsx      # Merender PublicLayout + PPDBForm
│   │
│   ├── services/             # Pemanggilan API (Axios / Fetch) ke Backend Node.js
│   │   ├── api.js
│   │   └── authService.js
│   │
│   ├── store/                # Manajemen state global (Zustand / Redux / Context)
│   ├── utils/                # Fungsi bantuan (validasi form, format tanggal)
│   ├── App.jsx               # Root komponen dan konfigurasi routing
│   └── index.css             # Styling global (Desain eksisting dipertahankan di sini)
```

### B. Struktur Backend (Node.js & Express.js)
```text
backend/
├── src/
│   ├── config/               # Koneksi ke MongoDB menggunakan Mongoose
│   │   └── db.js
│   ├── controllers/          # Logika bisnis dan pemrosesan request
│   │   ├── authController.js # Logika login Admin, Humas, OSIM
│   │   └── ppdbController.js # Logika simpan data siswa dan upload file
│   ├── middleware/           # Pengecekan JWT & penanganan error
│   │   ├── authMiddleware.js # Pengecekan role akses CMS
│   │   └── uploadMiddleware.js # Penanganan file upload (PDF/JPG maksimal 2MB)
│   ├── models/               # Skema Database (Mongoose)
│   │   ├── User.js           # Skema operator CMS
│   │   └── Registration.js   # Skema data PPDB Online
│   ├── routes/               # Jalur endpoint API
│   │   ├── authRoutes.js     # POST /api/auth/login
│   │   └── ppdbRoutes.js     # POST /api/ppdb/register
│   └── server.js             # Entry point Express App
├── .env                      # Environment Variables
└── package.json
```

---

## 3. Catatan Integrasi Lanjutan

1. **Konsistensi UI/UX:**
   Seluruh file di dalam `ui-elements`, `ui-blocks`, dan `ui-sections` harus menggunakan *class* atau *style* lama. Warna hijau tua (dark green), radius sudut (border-radius) yang membulat, dan layout kartu (card) pada halaman login seperti yang ada di referensi tidak akan disentuh ulang desainnya. Elemen navigasi sentuh tetap optimal untuk layar tablet.
2. **Penanganan Unggah Berkas:**
   Backend (via `uploadMiddleware.js`) harus mengonfigurasi `multer` untuk membatasi ukuran file maksimal 2MB dengan ekstensi PDF/JPG, selaras dengan ketentuan yang tertera di form simulasi.
3. **Database Collections:**
   Database di MongoDB Atlas (`dev-man-lhoksemawe`) minimal akan otomatis membuat dua collections berdasarkan Models: `users` (berisi data role Admin, Humas, OSIM) dan `registrations` (berisi data pendaftar baru).
