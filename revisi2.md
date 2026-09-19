# Revisi 2 — Optimasi Library & Fungsi Website

## Tujuan
Lakukan optimasi website dengan menghapus **library, dependency, import, script, CSS, dan fungsi yang benar-benar tidak digunakan**, sehingga ukuran website lebih ringan dan performanya lebih baik.

**PRINSIP UTAMA: jangan menghapus sesuatu hanya karena terlihat tidak dipakai. Pastikan terlebih dahulu melalui pemeriksaan seluruh source code, konfigurasi, route, component, event, dan dependency.**

## Aturan Wajib

### 1. Audit library/dependency terlebih dahulu
Sebelum melakukan perubahan:

- Periksa `package.json`, `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` jika ada.
- Periksa seluruh folder source, misalnya:
  - `src/`
  - `app/`
  - `pages/`
  - `components/`
  - `lib/`
  - `utils/`
  - `hooks/`
  - `services/`
  - `public/`
  - konfigurasi build/framework.
- Cari semua `import`, `require`, dynamic import, plugin, loader, alias, dan pemanggilan package.
- Periksa library yang digunakan secara tidak langsung melalui konfigurasi atau plugin.
- Periksa dependency yang hanya digunakan pada script build, test, lint, atau deployment. **Jangan menghapusnya jika masih dibutuhkan oleh proses tersebut.**
- Bedakan dependency runtime dan development dependency.

### 2. Jangan menghapus library yang masih digunakan
Sebuah library hanya boleh dihapus jika sudah dipastikan:

- Tidak ada import/pemanggilan langsung.
- Tidak digunakan secara dynamic import.
- Tidak dibutuhkan oleh konfigurasi framework/build.
- Tidak dibutuhkan oleh plugin/library lain yang masih digunakan.
- Tidak digunakan oleh script `npm`, `yarn`, atau `pnpm`.
- Tidak dibutuhkan saat production build/runtime.
- Tidak digunakan oleh halaman, route, component, modal, form, API, autentikasi, database, animasi, chart, editor, atau fitur lain yang masih aktif.

**Jika masih ada keraguan, jangan hapus. Pertahankan library tersebut.**

### 3. Audit fungsi/code yang tidak terpakai
Cari dan identifikasi:

- function yang tidak pernah dipanggil;
- component yang tidak pernah dirender;
- hook yang tidak pernah digunakan;
- utility/helper yang tidak memiliki caller;
- state/variable yang tidak digunakan;
- event handler yang tidak pernah terhubung;
- route/endpoint yang sudah tidak digunakan;
- import yang tidak digunakan;
- constant/configuration yang tidak digunakan;
- kode duplikat atau dead code.

Hapus hanya kode yang benar-benar terbukti tidak digunakan.

### 4. Jangan menghapus fungsi krusial
**WAJIB dipertahankan** semua fungsi yang masih digunakan atau berpotensi menjadi bagian penting dari alur website, termasuk tetapi tidak terbatas pada:

- login/logout dan autentikasi;
- authorization/role/permission;
- API request;
- database;
- CRUD;
- form dan validasi;
- navigasi dan routing;
- pencarian/filter/sort;
- upload/download file;
- dashboard;
- state management;
- localStorage/sessionStorage/cookie;
- pembayaran jika ada;
- notifikasi;
- modal/dialog penting;
- responsive/mobile behavior;
- integrasi pihak ketiga;
- analytics jika memang digunakan;
- SEO/metadata;
- error handling;
- loading state;
- security-related code.

Jangan menghapus fungsi hanya karena tidak terlihat pada halaman utama.

## Prosedur Aman

### Tahap 1 — Audit

1. Library/dependency yang digunakan.
2. Library/dependency yang tampaknya tidak digunakan.
3. Fungsi/component/module yang digunakan.
4. Fungsi/component/module yang tampaknya tidak digunakan.
5. Dependency yang memiliki penggunaan tidak langsung atau tidak jelas.

### Tahap 2 — Verifikasi
Untuk setiap kandidat yang akan dihapus:

- Cari seluruh referensinya di project.
- Pastikan tidak ada dynamic import.
- Pastikan tidak dipanggil melalui string/configuration.
- Pastikan tidak dipakai oleh build tool/plugin.
- Pastikan tidak merupakan dependency transitif yang diperlukan.
- Pastikan tidak digunakan oleh script project.

Jika statusnya **tidak pasti**, jangan hapus.

### Tahap 3 — Hapus secara bertahap
Hapus hanya item yang sudah terverifikasi aman.

Jangan melakukan refactor besar sekaligus. Perubahan harus sekecil mungkin agar mudah dilacak jika terjadi masalah.

### Tahap 4 — Validasi setelah setiap kelompok perubahan
Setelah menghapus dependency/code:

- install dependency dari lockfile;
- jalankan lint jika tersedia;
- jalankan type-check jika tersedia;
- jalankan test jika tersedia;
- jalankan production build;
- jalankan website;
- cek console browser;
- cek network request;
- cek error runtime.

Jika build atau fitur penting mengalami error, **segera rollback perubahan terakhir** dan jangan memaksakan penghapusan.

## Prioritas Optimasi

Prioritaskan:

1. Dependency besar yang benar-benar tidak digunakan.
2. Library yang hanya tersisa dari fitur lama.
3. Import yang tidak digunakan.
4. Dead code yang jelas.
5. Duplicate utility/component.
6. Asset/script yang benar-benar tidak direferensikan.

Jangan mengorbankan stabilitas website hanya demi mengurangi sedikit ukuran bundle.

## Jangan Mengubah Perilaku Website

Hasil akhir harus mempertahankan perilaku dan fitur website yang saat ini masih digunakan.

**Optimasi bukan berarti mengurangi fitur.**

Jangan:
- menghapus fitur aktif;
- mengubah API tanpa alasan;
- mengubah struktur database;
- mengubah route aktif;
- mengganti library yang masih diperlukan;
- mengubah UI secara signifikan;
- menghapus fallback/error handling penting;
- menghapus kode hanya berdasarkan nama file atau asumsi.

## Verifikasi Akhir

Sebelum menyatakan selesai, pastikan:

- [ ] Tidak ada library aktif yang ikut terhapus.
- [ ] Tidak ada import penting yang hilang.
- [ ] Tidak ada function penting yang terhapus.
- [ ] Tidak ada route penting yang rusak.
- [ ] Tidak ada component penting yang rusak.
- [ ] Tidak ada error build.
- [ ] Tidak ada error runtime di console.
- [ ] Fitur utama tetap berjalan.
- [ ] Login/authentication tetap berjalan jika ada.
- [ ] API tetap berjalan jika ada.
- [ ] Form tetap berjalan jika ada.
- [ ] Navigasi tetap berjalan.
- [ ] Tampilan desktop dan mobile tetap berjalan.
- [ ] Production build berhasil.

## Output yang Diharapkan

Setelah audit dan optimasi, tampilkan ringkasan:

### Library yang dihapus
- `nama-library` — alasan: benar-benar tidak digunakan.
- ...

### Fungsi/code yang dihapus
- `nama-function` — alasan: tidak memiliki caller/reference.
- ...

### Library yang dipertahankan
Tuliskan library yang awalnya terlihat mencurigakan tetapi **tetap dipertahankan karena masih digunakan atau memiliki dependency tidak langsung yang diperlukan.**

### Validasi
Tuliskan hasil:
- lint:
- type-check:
- test:
- production build:
- runtime/browser check:

Jika suatu pemeriksaan tidak tersedia di project, tuliskan bahwa pemeriksaan tersebut tidak tersedia, jangan mengarang hasil.

## Prinsip Keselamatan

> **Lebih baik mempertahankan library/code yang belum pasti daripada menghapusnya dan menyebabkan website error.**

Lakukan optimasi secara konservatif, berdasarkan bukti penggunaan nyata dari source code dan konfigurasi project, bukan berdasarkan asumsi.
