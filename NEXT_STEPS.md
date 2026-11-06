# Next Steps — Project-Onelito

Dokumen ini menjadi acuan sesi berikutnya. Aplikasi sekarang adalah prototipe UI lokal; rencana online di bawah belum terimplementasi.

## Aturan mulai sesi berikutnya

1. Pastikan root `C:\Users\user\Documents\Project-Onelito 2`.
2. Baca `.hermes.md`, `SESSION_MEMORY.md`, `PROGRESS.md`, `PRD.md`, `DESIGN.md`, dan `UI_DESIGN_GUIDELINES.md`.
3. Periksa Git status dan source aktual sebelum membuat klaim.
4. Jelaskan temuan dan scope sebelum perubahan kode/schema/integrasi/deployment; tunggu persetujuan eksplisit.
5. Jangan commit/push tanpa instruksi. Jangan mengubah/stage/menghapus PDF `rekap-ikan-2026-10-24.pdf`.
6. Catat setiap perubahan di `PROGRESS.md` dengan deskripsi, file, dan verifikasi nyata.

## Status implementasi terverifikasi

- Fase UI lokal aktif dan berjalan: React + Vite + TypeScript, dashboard responsif, desktop sidebar dan mobile drawer, Light/Dark.
- Bagian utama: `Rekap Ikan` dan `Setting`. Setting memiliki konten/prototype actions; jangan menggambarkannya sebagai backup atau layanan akun nyata.
- Fish CRUD dan data periode in-memory; reload mengembalikan state awal. Tema disimpan di `localStorage`.
- Tabel memiliki kolom Fish, Harga (JPY), Kurs, Harga (IDR), Dealer Fee, Shipping Cost, Total, Sertifikat, Term & Condition, Edit. T&C preview dan dialog Detail.
- Owner dropdown + `+ Owner Baru`; duplikat nama baru ditolak case-insensitive. Nama owner muncul di bawah ikan pada `All Owners`.
- Form input/edit punya scrollbar theme-aware dan body scroll lock; delete memakai confirmation modal. Toast centered, pesan baru mengganti timer/exit sebelumnya.
- PDF langsung-unduh via jsPDF + jspdf-autotable, satu owner wajib, gambar proporsional dan T&C lengkap. PDF satu-satunya export; jangan kembalikan Excel/CSV.
- Tidak ada backend/Auth/database/Supabase/Cloudinary/server persistence/deployment yang terhubung kecuali kelak diverifikasi.

## Design dan motion

- `UI_DESIGN_GUIDELINES.md` adalah aturan utama untuk style, komponen, animasi, reduced-motion, aksesibilitas, dan checklist. Baca sebelum UI work; perbarui setelah keputusan desain baru disetujui.
- Pertahankan style dashboard yang bersih, tenang, modern, data-focused, token warna, Light/Dark, dan responsive contained table scroll.
- Pola motion saat ini terdokumentasi untuk Rekap Ikan/tabel, Setting, buttons, period tabs/menu, modals/preview/Detail, toast, dan breadcrumb. Terapkan pola serupa untuk komponen sejenis.
- Breadcrumb: `Workspace/` diam; label section fade/mengembang halus; satu garis underline mengikuti lebar teks aktual. Hindari garis ganda dan selector CSS yang saling menimpa.
- Animasi tidak boleh menghalangi interaksi; hormati `prefers-reduced-motion`; hindari blinking, endless pulse, dan bounce berlebihan.

## Roadmap — belum dimulai tanpa persetujuan

### Tahap berikutnya: review prototipe lokal

- Tinjau UI, validasi form, aksesibilitas/focus, ukuran viewport target, dan hasil PDF aktual bila diminta.
- Pastikan hasil unduhan PDF benar-benar dicek jika generator berubah.
- Persistence lintas reload belum tersedia; jangan klaim data tersimpan permanen.

### Integrasi online (belum disetujui/dimulai)

- Review kebutuhan persistence dan rencanakan schema bersama pengguna terlebih dahulu.
- Auth satu akun, Supabase PostgreSQL, Cloudinary, hosting/deployment hanya rencana sampai pengguna menyetujui scope, akses, keamanan, dan environment.
- Tidak ada backup cloud otomatis dalam MVP.
- Setelah persetujuan terpisah: rencanakan local/test integration dan migrasi; verifikasi CRUD, upload, permission, network/error states sebelum deployment.

## Keputusan produk yang dipertahankan

- Rumus: Harga Rupiah = Harga Yen × Kurs bila keduanya terisi; jika salah satu kosong, Harga Rupiah boleh manual. Dealer Fee = Harga Rupiah × persen / 100. Total = Harga Rupiah + Dealer Fee + Shipping Cost; shipping kosong = Rp0. Nilai uang numerik, jangan membulatkan fee tanpa keputusan baru.
- Gambar yang direncanakan: JPG/JPEG/PNG sampai 10 MB sebelum kompresi, utuh tanpa crop, thumbnail tabel dan modal detail. Cloudinary belum terhubung.
- PDF tetap satu-satunya export aktif. Excel/CSV, backup otomatis, stock sheet, OCR, notifikasi, pembayaran, analitik kompleks, bulk import, audit log lengkap, dan role multi-user ditunda kecuali ada permintaan baru.

## Verifikasi

- Jalankan `npm run build`, `npm run lint`, `git diff --check` untuk perubahan kode/UI.
- `npm run lint` sekarang TypeScript check (`tsc -b --pretty`). Vite mungkin memberi warning chunk >500 kB; build dapat tetap sukses.
- Klaim perilaku browser hanya setelah browser benar-benar diperiksa.
