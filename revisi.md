# revisi.md

# INSTRUKSI REVISI WEBSITE MADRASAH

Dokumen ini berisi daftar revisi yang harus diterapkan oleh AI/developer pada website madrasah. Terapkan seluruh perubahan di bawah ini tanpa mengubah desain, fungsi, atau konten lain yang tidak disebutkan.

## 1. Halaman Beranda — Prestasi Nasional

Pada kartu/komponen **Prestasi Nasional** di halaman **Beranda**:

- Tetap tampilkan jumlah prestasi nasional dengan format angka seperti saat ini.
- **Hapus tulisan/keterangan "Medali 3 Tahun Terakhir".**
- Prestasi nasional **tidak dibatasi hanya 3 tahun terakhir**.
- Label/judul harus menggambarkan **Prestasi Nasional secara keseluruhan / tanpa batas tahun**.
- Jangan mengubah gaya visual utama kartu, ukuran, ikon, atau tata letak kecuali diperlukan agar hasil tetap rapi.
- Pastikan tidak ada teks "Medali 3 Tahun Terakhir" yang masih muncul di komponen tersebut.

## 2. Semua Halaman — Warna Background

Pada **semua halaman website**:

- Ubah warna background utama halaman menjadi:
  `rgb(238, 252, 245)`
- Gunakan warna tersebut secara konsisten pada area background utama.
- Jangan menghilangkan perubahan warna/menu hover yang sudah ada.
- **Pertahankan efek perubahan warna menu ketika kursor/mouse diarahkan (hover).**
- Pastikan warna hover menu tetap terlihat jelas dan memiliki kontras yang baik terhadap background baru.
- Terapkan perubahan secara global agar semua halaman memiliki tampilan yang konsisten.

## 3. Sambutan Kepala Madrasah

Pada bagian **Sambutan Kepala Madrasah**:

- Konten sambutan kepala madrasah harus ditampilkan **dalam bentuk video**.
- Sediakan area/video player yang proporsional dan responsif.
- Video harus bisa diputar dari halaman website.
- Pertahankan judul/label **"Sambutan Kepala Madrasah"**.
- Jangan mengubah bagian lain pada halaman yang tidak berkaitan dengan sambutan.

## 4. Data Guru & Staf

Pada halaman/bagian **Data Guru & Staf**:

- Ketika foto/profil guru atau tenaga kependidikan **diklik**, tampilkan **pop-up/modal portfolio**.
- Modal menampilkan informasi portfolio guru/staf secara rapi.
- Modal minimal mendukung informasi seperti:
  - Foto/profil
  - Nama
  - Jabatan
  - Informasi singkat/portfolio
  - Data relevan lain yang memang tersedia di database
- Modal harus dapat ditutup dengan tombol close dan/atau klik area di luar modal.
- Tampilan harus responsif di desktop dan mobile.
- Jangan membuat halaman berpindah hanya untuk melihat portfolio apabila informasi bisa ditampilkan melalui pop-up.
- Gunakan data guru/staf yang sudah ada; **jangan membuat data fiktif**.

## 5. Akreditasi & Prestasi

Pada bagian **Akreditasi & Prestasi**:

- Tambahkan **riwayat akreditasi tahun-tahun sebelumnya**.
- Data harus disusun secara kronologis agar mudah dibaca.
- Pertahankan informasi akreditasi terbaru yang sudah ada.
- Riwayat dapat ditampilkan dalam bentuk timeline, tabel, atau daftar, selama tetap rapi dan konsisten dengan desain website.
- Jangan menghapus data akreditasi yang sudah tersedia.
- Gunakan data yang memang tersedia pada sistem/database; **jangan membuat angka, tahun, atau nilai akreditasi fiktif**.

## 6. Beranda — Agenda/Kegiatan Madrasah

Tambahkan komponen **Agenda/Kegiatan Madrasah** pada halaman **Beranda**.

Fungsi yang diharapkan:

- Menampilkan daftar agenda/kegiatan terbaru madrasah.
- Setiap agenda minimal dapat menampilkan:
  - Nama/judul kegiatan
  - Tanggal
  - Lokasi (jika tersedia)
  - Deskripsi singkat (jika tersedia)
- Tampilkan beberapa agenda terbaru di beranda.
- Sediakan mekanisme untuk melihat detail/agenda lainnya apabila data lebih banyak.
- Data harus mengambil dari sumber data yang sudah digunakan website.
- Jangan membuat agenda fiktif.
- Desain harus menyatu dengan layout beranda yang sudah ada.

## 7. Ketentuan Umum Implementasi

Prioritas utama adalah **mempertahankan website yang sudah berjalan** dan hanya melakukan perubahan yang diminta.

Jangan:

- Menghapus fitur yang tidak diminta.
- Mengubah struktur menu utama tanpa kebutuhan.
- Mengganti warna hover menu secara tidak sengaja.
- Mengganti data asli dengan data dummy.
- Mengubah identitas/branding website.
- Mengubah komponen yang tidak terkait dengan daftar revisi.

Pastikan:

- Semua perubahan responsif untuk desktop, tablet, dan mobile.
- Tidak ada layout yang pecah setelah perubahan.
- Tidak ada error JavaScript/TypeScript/console yang muncul akibat implementasi revisi.
- Komponen baru mengikuti style, typography, spacing, border radius, dan pola UI yang sudah digunakan website.
- Revisi diterapkan secara konsisten pada seluruh halaman yang relevan.

## 8. Checklist Verifikasi

Setelah revisi selesai, lakukan pengecekan berikut:

- [ ] "Medali 3 Tahun Terakhir" sudah dihapus dari kartu Prestasi Nasional.
- [ ] Prestasi Nasional tidak lagi dibatasi pada label 3 tahun terakhir.
- [ ] Background global menggunakan `rgb(238, 252, 245)`.
- [ ] Efek hover/perubahan warna menu tetap berfungsi.
- [ ] Sambutan Kepala Madrasah tampil sebagai video.
- [ ] Klik profil guru/staf membuka pop-up portfolio.
- [ ] Pop-up portfolio dapat ditutup dan responsif.
- [ ] Riwayat akreditasi tahun-tahun sebelumnya sudah ditambahkan.
- [ ] Agenda/Kegiatan Madrasah sudah muncul di Beranda.
- [ ] Tidak ada data fiktif yang menggantikan data asli.
- [ ] Tidak ada fitur lama yang rusak.
- [ ] Tampilan desktop dan mobile tetap rapi.
- [ ] Tidak ada error di console.

## HASIL YANG DIHARAPKAN

Website tetap memiliki identitas dan struktur desain yang sama, tetapi seluruh revisi di atas sudah aktif, berfungsi, responsif, dan menggunakan data asli yang tersedia.
