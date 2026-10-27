# Next Steps — Project-Onelito

Dokumen ini menjadi panduan sesi berikutnya untuk melanjutkan dashboard yang sudah ada. Project saat ini adalah prototipe UI lokal React + Vite + TypeScript; integrasi online belum dikerjakan.

## Aturan mulai sesi berikutnya

1. Baca `.hermes.md`.
2. Baca `PROGRESS.md`.
3. Baca `PRD.md`.
4. Baca `DESIGN.md`.
5. Cek isi folder project dan status file.
6. Cek apakah project sudah memiliki stack atau file aplikasi.
7. Jelaskan kondisi project dan rencana tahap pertama.
8. Tunggu persetujuan user sebelum mengubah kode atau membuat database.

Jangan langsung coding hanya karena sesi baru dimulai.

## Status sekarang

- Fase 1 — prototipe UI lokal: dashboard React + Vite + TypeScript sudah ada dan terus disempurnakan.
- Data/CRUD masih lokal selama sesi; backend dan persistensi server belum terhubung.
- Tidak ada bukti login/Auth, Supabase, Cloudinary, atau deployment aktif di aplikasi ini.
- Kolom tabel saat ini: Fish, Harga (JPY), Kurs, Harga (IDR), Dealer Fee, Shipping Cost, Total, Sertifikat, Term & Condition, Edit.
- T&C punya cuplikan di tabel dan dialog Detail. Data contoh memuat tiga ketentuan dari PRD.
- Export yang tersedia hanya tombol PDF yang memanggil print browser setelah owner dipilih; print stylesheet menyembunyikan gambar.

## Target MVP

Selesaikan UI lokal terlebih dahulu, review perilaku tabel/form/print, lalu rencanakan integrasi online setelah persetujuan pengguna.

Alur target setelah integrasi disetujui:

`Login → lihat tabel → tambah ikan → hitung harga → simpan online → filter owner → lihat grand total → cetak/Save as PDF`.

## Ruang lingkup MVP

- Web online setelah integrasi selesai.
- Login satu akun akses penuh.
- Database PostgreSQL melalui Supabase.
- File gambar melalui Cloudinary; metadata/referensi di Supabase.
- Form tambah dan edit ikan.
- Tabel data ikan.
- Hapus data dengan konfirmasi.
- Pencarian dan filter owner.
- Filter status sertifikat.
- Grand total.
- PDF adalah satu-satunya aksi export saat ini; jangan tambahkan Excel/CSV tanpa permintaan eksplisit.
- T&C ditampilkan ringkas di tabel, lalu Detail membuka teks lengkap.
- Light/Dark mode.
- Tidak ada fitur backup cloud otomatis dalam MVP.

## Field ikan

- Gambar: satu gambar, JPG/JPEG/PNG, maksimal 10 MB sebelum kompresi, upload + preview utuh + modal detail.
- Nama ikan: wajib.
- Owner: text bebas, wajib.
- Harga Yen: opsional.
- Kurs: disimpan per ikan, opsional jika tidak memakai Yen.
- Harga Rupiah: otomatis jika Harga Yen dan Kurs tersedia; manual jika salah satu kosong.
- Dealer fee persen: manual, boleh kosong.
- Dealer fee nominal: otomatis.
- Shipping cost: per ikan, kosong berarti Rp0.
- Total: Harga Rupiah + dealer fee + shipping cost.
- Term & condition: text per ikan.
- Sertifikat: checkbox.

## Aturan harga

```text
Jika Harga Yen dan Kurs tersedia:
    Harga Rupiah = Harga Yen × Kurs

Jika Harga Yen atau Kurs kosong:
    Admin mengisi Harga Rupiah manual

Dealer Fee = Harga Rupiah × Persentase / 100

Total = Harga Rupiah + Dealer Fee + Shipping Cost
```

Simpan nilai uang sebagai angka, bukan string berformat. Simpan sumber Harga Rupiah:

- `yen_conversion`
- `manual_rupiah`

## Arah desain

- Modern finance dashboard.
- Light + Dark mode, bisa diganti.
- Charcoal/hitam untuk struktur.
- Biru untuk interaksi utama.
- Merah untuk danger, error, urgent, atau aksi penting.
- Sidebar desktop.
- Mobile-first responsive layout; mobile is primary usage context.
- Mobile header responsive; sidebar remains for desktop/laptop.
- Tabel medium density on desktop, card or contained-scroll treatment on mobile.
- Primary mobile target: iPhone 11 at `390 × 844 CSS px`.
- Minimum mobile target: `360 × 800 CSS px`.
- Landscape target: `844 × 390 CSS px`.
- Laptop target: `1366 × 768 CSS px`.
- Desktop target: `1440 × 900 CSS px`.
- No page-level horizontal scroll; minimum `44 × 44px` touch targets; body text minimum `16px`.
- Radius medium: 6px, 10px, 14px.
- Font Inter.
- Motion halus 150–250ms.
- Tidak memakai gradient berlebihan, neon, glassmorphism, atau emoji sebagai icon.

## Teknologi yang disetujui

- Frontend: React + Vite + TypeScript.
- UI: CSS/komponen yang sudah ada; tambah dependency hanya bila perlu.
- Auth: Supabase Auth pada fase online.
- Database: Supabase PostgreSQL.
- Database lokal: Supabase lokal untuk pengujian fase berikutnya.
- Gambar: Cloudinary Storage/CDN; Supabase hanya menyimpan metadata dan referensi asset.
- PDF: print stylesheet dulu; generator PDF bila diperlukan.
- Excel/CSV: tidak ada pada UI aktif; tidak dikerjakan tanpa permintaan baru.
- Hosting: pilih layanan yang sesuai penggunaan personal/komersial setelah deployment plan dipastikan.

Ketentuan gambar: JPG/JPEG/PNG sampai 10 MB sebelum kompresi, gambar utuh tanpa crop, thumbnail tabel, lazy loading, dan modal detail saat gambar diklik.

## Backup

Backup cloud otomatis dihapus dari MVP. Backup manual dapat dilakukan dari provider bila diperlukan, tetapi bukan fitur aplikasi.

## Yang ditunda

- Sheet stock.
- Multi-user dan role kompleks.
- Sinkronisasi kurs otomatis.
- OCR.
- Notifikasi.
- Pembayaran online.
- Dashboard analitik kompleks.
- Bulk import.
- Audit log lengkap.

## Urutan implementasi yang disarankan

### Fase 0 — Pemeriksaan

- Baca dokumen project.
- Cek stack existing.
- Tentukan apakah project kosong atau sudah memiliki aplikasi.
- Jelaskan temuan.

### Fase 1 — UI prototype — aktif, implementasi utama sudah tersedia

Sudah tersedia: React + Vite + TypeScript; dashboard responsif; sidebar desktop dan drawer mobile; Light/Dark mode; tabel dan data contoh; pencarian/filter; form tambah/edit; kalkulasi lokal; hapus; print/PDF via browser; preview foto; T&C ringkas dan Detail.

Perlu review/validasi: layout cetak/PDF, data persistence selama reload, validasi data dan gambar, aksesibilitas/focus, dan ukuran target desktop/mobile. Jangan klaim data tersimpan lintas reload tanpa uji.

Tidak ada database/Auth/Supabase/Cloudinary terhubung.

### Fase 2 — Review & persiapan integrasi (belum dimulai)

- Review UI lokal dan putuskan kebutuhan persistence.
- Tinjau kebutuhan skema bersama pengguna sebelum membuat database.
- Verifikasi kepemilikan/akses Supabase dan Cloudinary sebelum menyentuh layanan eksternal.

### Fase 3 — Integrasi lokal (belum dimulai)

- Setelah rencana dan perubahan disetujui, rancang schema Supabase lokal.
- Uji CRUD serta upload gambar di lingkungan lokal/test.
- Catat batas keamanan, env vars, dan migrasi.

### Fase 4 — Auth dan integrasi aplikasi (belum dimulai)

- Implementasi login satu akun jika disetujui.
- Sambungkan data dan gambar ke layanan terpilih.
- Verifikasi CRUD, filter, kalkulasi, dan error network.

### Fase 5 — Cetak/PDF (UI awal ada; verifikasi belum selesai)

- Tombol PDF saat ini memanggil browser print untuk owner terpilih.
- Uji output cetak: layout kolom, T&C lengkap, grand total, halaman terpotong, dan kebutuhan gambar.
- Jangan implementasikan Excel/CSV tanpa permintaan eksplisit.

### Fase 6 — Deployment dan verifikasi MVP (belum dimulai)

- Deployment hanya setelah rencana layanan dan perubahan disetujui.
- Uji Yen + kurs, harga manual, dealer fee pecahan, dan shipping kosong.
- Uji satu owner dengan beberapa ikan.
- Uji PDF, T&C, gambar, Light/Dark mode, login, dan akses lintas perangkat.
- Uji UI pada `390 × 844`, `360 × 800`, `844 × 390`, `1366 × 768`, dan `1440 × 900` CSS px.
- Pastikan tidak ada horizontal scroll tingkat halaman; scroll tabel hanya di container.
- Catat hasil tes dan perubahan di `PROGRESS.md`.

## Gate persetujuan

Sebelum setiap fase yang mengubah kode, database, atau deployment:

1. Jelaskan rencana.
2. Jelaskan file yang akan berubah.
3. Jelaskan risiko atau keputusan yang belum pasti.
4. Minta persetujuan user.
5. Baru eksekusi setelah disetujui.

## Prompt untuk sesi berikutnya

```text
Lanjutkan Project-Onelito. Baca NEXT_STEPS.md, .hermes.md, PROGRESS.md, PRD.md, dan DESIGN.md dulu. Cek kondisi project. Jelaskan temuan dan rencana Fase 0/Fase 1. Jangan coding atau mengubah database sebelum saya setujui.
```
