# Project Progress

## 2026-10-27 — Samakan ukuran menu aksi dengan tab
- Change: Menu aksi memakai lebar tab pemicu; tiap opsi memakai tinggi tab, termasuk di layar kecil.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengukur tab 120.86×37.24 px dan tiap opsi 118.86×37.23 px (lebar opsi dikurangi border menu 2 px). `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.22 kB (>500 kB).

## 2026-10-27 — Tutup menu periode dengan klik luar atau Escape
- Change: Menu tiga titik tutup otomatis saat pointer di luar menu, saat menekan `Escape`, atau setelah memilih aksi.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: Browser memastikan klik luar dan `Escape` menutup menu, aksi ganti nama menutup menu sekaligus membuka dialog. `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Sembunyikan scrollbar pada strip tab
- Change: Sembunyikan scrollbar horizontal/vertikal di bar tab agar tidak tampak seperti scrollbar di samping kontrol mode; area tab tetap bisa digeser bila tab melampaui lebar.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan scrollbar strip bernilai `none` dan setelah berpindah tab halaman tidak overflow (`1249/1249`). `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Tambah animasi interaksi tab
- Change: Tab memberi respons hover yang halus, efek tekan saat diklik, dan transisi singkat saat tab aktif berganti. Menghormati preferensi `prefers-reduced-motion` yang sudah ada.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi animasi `period-tab-select` pada pergantian tab dan tidak ada outline biru setelah klik; `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Tambah data contoh untuk Periode 2027
- Change: Tab baru bernama tepat `Periode 2027` dibuat dengan tiga contoh record koi, harga JPY/kurs/IDR, owner, biaya, sertifikat, dan term. Tab lain tetap mengikuti aturan data kosong; data `Periode 2026` tidak berubah.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: Browser memastikan tab baru menampilkan 3 ikan contoh, owner dan data `Periode 2026` tetap ada setelah berpindah tab. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memperingatkan chunk 611.73 kB (>500 kB).

## 2026-10-27 — Rapikan tab periode dan bagikan daftar owner
- Change: Perhalus tab aktif/nonaktif bergaya browser. Pindahkan menu aksi ke floating menu berposisi tetap agar tidak terpotong area scroll atau mendorong konten; posisinya dibatasi viewport. Daftar nama owner sekarang global dan tersedia di semua tab; data ikan tetap terpisah. Nama owner baru masuk ke daftar bersama setelah record tersimpan.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan menu tab tampil tanpa mengubah scroll halaman, termasuk mobile 375×812; nama owner baru yang dibuat di satu tab tersedia pada filter tab lain dan pada tab awal. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memperingatkan chunk 610.82 kB (>500 kB).

## 2026-10-27 — Tambah tab periode pada workspace Rekap Ikan
- Change: Tambahkan tab bergaya browser di samping breadcrumb; tab `Periode 2026` mewarisi data awal. Tambah tab kosong melalui dialog, ganti nama, tolak nama duplikat tanpa membedakan kapitalisasi, dan hapus dengan konfirmasi; tab terakhir tidak bisa dihapus. Data, owner, status sertifikat, pencarian, dan pengurutan disimpan terpisah per tab di memori; reload mengembalikan state awal aplikasi.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan data awal 6 record muncul di `Periode 2026`, tab baru kosong/aktif, nama duplikat ditolak, rename berjalan, penghapusan meminta konfirmasi dan mengembalikan tab sebelumnya. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memperingatkan chunk 610.39 kB (>500 kB).

## 2026-10-27 — Hapus kartu bantuan dan ubah label Setting
- Change: Hapus kartu “Need a hand?” dari sidebar; ubah label navigasi dan judul halaman menjadi `Setting`.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: Browser memastikan kartu bantuan tidak ada, profil sidebar tetap tampil, label dan judul menunjukkan `Setting`, breadcrumb `Workspace/Setting`. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memperingatkan chunk 605.49 kB (>500 kB).


## 2026-10-27 — Tambah halaman prototipe Settings
- Change: Sidebar membuka halaman Settings dengan kartu Data & Backup, Akun & Akses, dan Mode Tampilan. Aksi backup/akun menampilkan toast penanda prototipe dan tidak menjalankan fungsi nyata; Light/Dark memakai kontrol tema yang sudah ada.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan navigasi Settings, ketiga kartu, toast backup prototipe, penggantian tema Dark tersimpan di `localStorage`, dan kembali ke dashboard. Layout mobile 390×844 tidak overflow horizontal. `npm run build` dan `npm run lint` lulus; build memperingatkan chunk 605.81 kB (>500 kB).


## 2026-10-27 — Perjelas label tombol PDF
- Change: Tombol export menampilkan ikon dokumen diikuti teks `Export PDF`.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: Browser memastikan ikon muncul, label tepat `Export PDF`, dan tombol tampil 118.8×38 px. `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build memperingatkan chunk 602.76 kB (>500 kB).


## 2026-10-27 — Pertahankan ukuran minimum preview gambar
- Change: Terapkan lebar minimum 320 px (dibatasi 90vw) pada gambar kecil, pertahankan rasio aspek, dan tetap batasi gambar ke 90vw/960 px serta 75vh agar preview besar tetap muat.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser memeriksa gambar landscape kecil 100×50 menjadi area 320×160, portrait kecil 50×100 tetap memenuhi viewport mobile 390×844, dan landscape besar 4000×2250 dibatasi area 833×469 pada desktop 1264×625. `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build memperingatkan chunk 602.73 kB (>500 kB).


## 2026-10-27 — Sesuaikan kotak preview dengan rasio gambar
- Change: Preview kini mengikuti rasio asli gambar, dibatasi `max-width: min(90vw, 960px)` dan `max-height: 75vh`; kotak tidak memanjang ke area kosong. `object-fit: contain` menjaga gambar utuh.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser memeriksa gambar landscape uji 1600×900: preview 833×469 px pada desktop viewport 1264×625, dan 351×197 px pada mobile 390×844; rasio dipertahankan dan dialog muat dalam viewport. `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build memperingatkan chunk 602.73 kB (>500 kB).


## 2026-10-27 — Besarkan gambar pada dialog preview
- Change: Lebarkan dialog preview sampai 1000 px (dibatasi viewport), tetapkan area gambar selebar dialog dan tinggi responsif sampai 72vh; `object-fit: contain` tetap menjaga gambar landscape/portrait utuh tanpa crop.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser membuka preview pada viewport 1264×625; dialog terukur 1000 px, gambar 964×450, `object-fit: contain`. `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build memperingatkan chunk 602.73 kB (>500 kB).


## 2026-10-27 — Tunjukkan bahwa thumbnail gambar bisa diklik
- Change: Thumbnail memakai cursor `zoom-in`, transisi hover halus dengan outline/shadow ringan, focus-visible keyboard, dan tooltip “Klik untuk melihat gambar”.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memeriksa 3 thumbnail, tooltip, accessible label, cursor `zoom-in`, dan transisi CSS. `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build memberi peringatan chunk 602.73 kB (>500 kB).


## 2026-10-27 — Sinkronkan dokumen pedoman dengan implementasi
- Change: Selaraskan status fitur lokal, aturan Owner, modal/scroll/toast, PDF langsung-unduh, serta pemisahan perilaku aktif dari rencana integrasi masa depan pada `.hermes.md`, `DESIGN.md`, `PRD.md`, `NEXT_STEPS.md`, dan `SESSION_MEMORY.md`.
- Changed files: `.hermes.md`, `DESIGN.md`, `PRD.md`, `NEXT_STEPS.md`, `SESSION_MEMORY.md`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build menampilkan peringatan chunk JavaScript 602.69 kB (>500 kB); build tetap sukses. Pencarian dokumentasi tidak lagi menemukan klaim aktif bahwa PDF memakai `window.print()` atau Owner berupa free text. PDF referensi tak terlacak tidak diubah.


## 2026-10-27 — Perbaiki posisi dan timer popup toast
- Change: Toast memakai animasi terpisah yang mempertahankan posisi tengah selama transisi; timer lama dibatalkan saat pesan baru muncul dan dibersihkan saat komponen dilepas.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan center toast sama dengan center viewport ketika animasi aktif; pesan baru bertahan selama 2,6 detik penuh. `npm run build`, `npm run lint`, dan `git diff --check` lulus.


## 2026-10-27 — Pusatkan konten modal konfirmasi hapus
- Change: Ikon, teks, dan tombol modal konfirmasi hapus kini rata tengah.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus.


## 2026-10-27 — Tambahkan modal konfirmasi hapus data ikan
- Change: Tombol hapus membuka modal konfirmasi yang menampilkan nama ikan; Batal/backdrop/Escape membatalkan, tombol Hapus menghapus data.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi Batal mempertahankan jumlah baris, Hapus menghapus baris terpilih dan menampilkan notifikasi. `npm run build`, `npm run lint`, dan `git diff --check` lulus.


## 2026-10-27 — Perbarui deskripsi modal input/edit
- Change: “Lengkapi informasi untuk mencatat koleksi ikan.” diganti menjadi “Lengkapi informasi untuk mencatat data ikan.”
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus.


## 2026-10-27 — Ganti eyebrow modal menjadi DATA IKAN
- Change: Teks “DATA INVENTARIS” pada modal input/edit diganti menjadi “DATA IKAN”.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus.


## 2026-10-27 — Ganti label Harga Dasar pada rincian harga
- Change: Teks “Nilai Dasar” di ringkasan rincian harga modal diganti menjadi “Harga Dasar”.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus.


## 2026-10-27 — Ringkas label status sertifikat pada modal
- Change: Hapus teks “(Asli / Breeder)” dari label status sertifikat; fungsi toggle sertifikat tetap.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Tautan Owner Baru di header field
- Change: Opsi Owner Baru dipindah keluar dropdown menjadi tautan biru rata kanan di samping label Owner; klik menampilkan input owner baru dan tautan berubah menjadi “Pilih owner lama”.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan dropdown hanya memuat owner tersimpan dan tautan membuka input owner baru. `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Dropdown owner pada modal input/edit
- Change: Owner dipilih dari daftar, dengan validasi nama baru agar tidak duplikat case-insensitive; mode edit memilih owner data tersebut.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan dropdown, penolakan duplikat case-insensitive, dan owner edit terpilih otomatis. `npm run build`, `npm run lint`, dan `git diff --check` lulus.


## 2026-10-27 — Kunci scroll halaman saat modal input/edit terbuka
- Change: Body scroll dikunci saat form modal terbuka dan dipulihkan saat modal ditutup; konten modal tetap dapat di-scroll.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: Browser memastikan body overflow hidden, form modal tetap scrollable, scroll halaman tidak bergerak, dan overflow dipulihkan setelah modal ditutup. `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Sesuaikan scrollbar modal dengan tema
- Change: Scrollbar modal input/edit memakai warna track dan thumb sesuai Light/Dark mode; dibatasi pada `.form-dialog`.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus; computed style browser diverifikasi di kedua tema.

## 2026-10-27 — Tampilkan owner di bawah nama ikan saat All Owners
- Change: Saat filter All Owners, nama owner muncul kecil di bawah nama ikan; tersembunyi saat satu owner dipilih.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus; browser memverifikasi 6 label owner pada All Owners dan 0 label saat Budi Santoso dipilih.

## 2026-10-27 — Tetapkan posisi persentase Dealer Fee di tabel
- Change: Badge persentase dan nominal Dealer Fee memakai slot grid tetap; badge persen ditempatkan dekat nominal dan tidak bergeser saat panjang nominal berbeda.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus; browser mengukur posisi badge tetap sama untuk nominal Rp 21.850.000, Rp 555.000, dan Rp 31.625.000.


## 2026-10-27 — Tebalkan garis pemisah grand total PDF
- Change: Ketebalan garis di atas baris GRAND TOTAL dinaikkan dari 0.25 pt menjadi 0.45 pt.
- Changed files: `src/exportPdf.ts`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus.

## 2026-10-27 — Tambahkan garis pemisah grand total PDF
- Change: Garis atas grand total digambar setelah sel footer selesai, supaya terlihat utuh sepanjang tabel dan tidak tertutup warna latar sel.
- Changed files: `src/exportPdf.ts`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus; PDF hasil export menunjukkan garis horizontal penuh dari x=28.35 hingga 813.54 pt.

## 2026-10-27 — Perbesar batas foto PDF menjadi 20×20 mm
- Change: Memperbesar batas maksimum foto PDF menjadi 20×20 mm; gambar tetap proporsional, tidak crop/stretch, dan tanpa latar tambahan. Layout tabel dan data tidak berubah.
- Changed files: `src/exportPdf.ts`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus; PDF uji menunjukkan portrait 10×20 mm dan landscape 20×10 mm.

## 2026-10-27 — Hapus latar biru foto di PDF
- Change: Menghapus kotak latar biru di belakang foto PDF. Foto tetap proporsional, tidak terpotong/diregangkan, dan terpusat di sel.
- Changed files: `src/exportPdf.ts`; `PROGRESS.md`.
- Verification: Build/lint lulus; ekspor uji portrait/landscape menghasilkan 2 gambar dan tidak lagi menggambar bidang biru di belakang thumbnail.

## 2026-10-27 — Sesuaikan latar thumbnail dengan rasio gambar PDF
- Change: Latar biru di belakang thumbnail kini mengikuti ukuran gambar yang sudah di-fit, bukan ukuran kotak portrait tetap; orientasi landscape tidak lagi punya bidang biru portrait di belakangnya.
- Changed files: `src/exportPdf.ts`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus; hasil PDF portrait/landscape dirender dan bbox latar landscape diperiksa, bentuknya landscape.

## 2026-10-27 — Pertahankan rasio foto pada export PDF
- Change: Foto ikan di-fit secara proporsional ke dalam kotak gambar PDF; portrait dan landscape tidak dipotong atau diregangkan, dan tetap rata tengah.
- Changed files: `src/exportPdf.ts`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus; ekspor uji dengan gambar 20×40 dan 40×20 menghasilkan bbox rasio 0,5 dan 2, tanpa distorsi.

## 2026-10-27 — Ratakan header Kurs dan Total PDF ke tengah
- Change: Header Kurs dan Total di PDF diratakan ke tengah; alignment isi kolom tidak berubah.
- Changed files: `src/exportPdf.ts`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus; PDF baru diekspor dan text bbox kedua header diperiksa.

## 2026-10-27 — Ratakan header nominal PDF ke kanan
- Change: Header Harga (JPY), Harga (IDR), Dealer Fee, Shipping Cost, dan Total di PDF kini rata kanan mengikuti alignment kolom nominal.
- Changed files: `src/exportPdf.ts`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus; PDF hasil ekspor diperiksa lewat text bbox dan ujung teks tiap header nominal sejajar dengan sisi kanan kolom.

## 2026-10-27 — Tambahkan prefix mata uang pada field Rupiah
- Change: Menambahkan prefix `Rp` di depan field Harga Rupiah dan Shipping Cost di modal tambah/edit, setara dengan prefix `¥` pada Harga Yen.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: Browser memverifikasi tiga prefix field (`¥`, `Rp`, `Rp`) muncul pada modal input dan edit; build/lint lulus.

## 2026-10-27 — Tambahkan pemisah ribuan pada nominal modal ikan
- Change: Field Harga Yen, Harga Rupiah, dan Shipping Cost pada modal tambah/edit kini menampilkan pemisah ribuan Indonesia saat input; nilai perhitungan dan penyimpanan tetap numerik. Kurs dan persentase tidak diformat sebagai nominal.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus; browser memverifikasi input `3800000` tampil `3.800.000`, `18500000` tampil `18.500.000`, ongkir `500000` tampil `500.000`, dan konversi Yen 3.800.000 × 115 tampil Rp 437.000.000.

## 2026-10-27 — Pulihkan layout modal input/edit data ikan
- Change: Menambahkan styling untuk class baru `calc-preview`, `cert-toggle`, dan `dialog-actions` agar bagian Rincian Harga dan Dokumen & Ketentuan kembali menggunakan grid, toggle sertifikat, kalkulasi, serta footer aksi sesuai desain modal sebelumnya.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: Build/lint dan uji modal tambah/edit dijalankan; kedua dialog menampilkan tiga bagian form, kalkulasi grid, toggle sertifikat, serta tombol aksi sticky.

## 2026-10-27 — Samakan layout export PDF dengan contoh PDF
- Change: Mengganti render HTML ke PDF menjadi gambar PDF vektor/tabel dengan jsPDF AutoTable; ukur halaman A4 landscape, posisi judul/meta, margin, lebar kolom, ukuran font, warna sampel, tinggi baris dan grand-total dari `rekap-ikan-2026-10-24.pdf`. Menyertakan gambar koi referensi lokal agar gambar tidak bergantung pada URL eksternal yang gagal. Memperbarui foto dan T&C data contoh Sanke sesuai contoh; data, tanggal, dan total tetap dinamis berdasarkan record owner terpilih. Menghapus template HTML ekspor lama serta dependency langsung `html2canvas`.
- Changed files: `package.json`; `package-lock.json`; `src/App.tsx`; `src/exportPdf.ts`; `public/koi-reference.jpeg`; `PROGRESS.md`.
- Verification: `npm run build` sukses; `npm run lint` sukses; ekspor diuji lewat tombol PDF pada aplikasi; hasil PDF satu halaman A4 landscape, memiliki 3 gambar thumbnail, T&C, serta total yang terbaca; hasil dirender dan diperiksa. Build memberi peringatan ukuran chunk >500 kB, tanpa gagal.

## 2026-10-27 — Ubah Export PDF Menjadi Direct Download via jsPDF & html2canvas
- Change: Menginstal `jspdf` dan `html2canvas`, serta memperbarui tombol PDF agar langsung mendownload file `.pdf` dengan format laporan persis seperti referensi (header perusahaan, rekapitulasi data ikan, foto thumbnail, rincian biaya lengkap, dan baris grand total).
- Changed files: `package.json`, `package-lock.json`, `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build` sukses (`tsc -b && vite build` passed tanpa error).


## 2026-10-27 — Ubah Export PDF Menjadi Direct Download via jsPDF & html2canvas
- Change: Menginstal `jspdf` dan `html2canvas`, serta memperbarui tombol PDF agar langsung mendownload file `.pdf` dengan format laporan persis seperti referensi (header perusahaan, rekapitulasi data ikan, foto thumbnail, rincian biaya lengkap, dan baris grand total).
- Changed files: `package.json`, `package-lock.json`, `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build` sukses (`tsc -b && vite build` passed tanpa error).

## 2026-10-27 — Setup Git Repository & GitHub Backup
- Change: Menginisialisasi repositori Git lokal dengan `.gitignore` (mengecualikan `node_modules` dan `dist`), membuat commit pertama, dan menghubungkan serta melakukan push ke repositori GitHub `https://github.com/absyalsatria20/Project-Onelito`.
- Changed files: `.gitignore`; `PROGRESS.md`.
- Verification: `git push -u origin main` berhasil (`main -> main`).

## 2026-10-27 — Tambah Data Contoh Tabel
- Change: Menambahkan 4 data contoh ikan tambahan (Showa Sanshoku, Tancho Kohaku, Doitsu Ogon, Kujaku) dengan variasi owner (Budi Santoso, Sugiarto, Hendra Wijaya), harga JPY/IDR, sertifikat, dan T&C ke `src/App.tsx`.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` dan `npm run lint` lulus tanpa error.

## 2026-10-24 — Session handoff

- Change: Added `SESSION_MEMORY.md` with project identity, current implementation status, decisions, constraints, verification notes, and session-start workflow.
- Changed files: `SESSION_MEMORY.md`; `PROGRESS.md`.
- Verification: `SESSION_MEMORY.md` write verified; markdown file has no configured linter.


## Kondisi proyek terkini — 2026-10-24

- Status: prototipe UI lokal React + Vite + TypeScript; backend/persistensi server, Auth, Supabase, Cloudinary, dan deployment belum terhubung.
- Dashboard: Light/Dark mode, sidebar desktop (Rekap Ikan dan Settings), top bar kanan, drawer mobile, judul Rekap Pembelian Ikan Jepang.
- Fitur UI lokal: form tambah/edit/hapus, pencarian/filter, kalkulasi, data contoh, ringkasan owner dan grand total, thumbnail/preview foto.
- Tabel: Fish, Harga (JPY), Kurs, Harga (IDR), Dealer Fee, Shipping Cost, Total, Sertifikat, Term & Condition, Edit.
- T&C: cuplikan satu baris + tombol Detail; dialog tampilkan isi lengkap. Data contoh memakai tiga ketentuan yang diberikan pengguna.
- Dealer Fee: persen dan nominal berkelompok rapat di sisi kanan kolom dengan gap 4px; lebar grup mengikuti isi nominal.
- Print: tombol PDF meminta owner lalu membuka browser print. Print stylesheet menyembunyikan thumbnail dan aksi; verifikasi hasil PDF masih perlu dilakukan.
- Export Excel/CSV: tidak tersedia; jangan tambahkan tanpa permintaan eksplisit.

## 2026-10-24 — Sinkronisasi panduan proyek

- Change: Selaraskan panduan root, desain, PRD, next steps, dan progress dengan folder aktif, UI/fitur yang benar-benar ada, T&C, print/PDF, serta tahapan integrasi yang belum dikerjakan.
- Changed files: `.hermes.md`; `DESIGN.md`; `NEXT_STEPS.md`; `PRD.md`; `PROGRESS.md`.
- Verification: Dokumen diperiksa silang untuk status UI lokal, kolom tabel, T&C, owner-only browser print, dan fitur integrasi yang belum tersedia; `npm run build` dan `npm run lint` lulus.


## 2026-10-24

- Change: Dealer Fee percentage and amount now sit together at right edge of their cell with a fixed 4px gap, rather than occupying a full-width split layout.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Kept Dealer Fee percent and amount in fixed tracks, aligned group to the right of its column, and preserved close 4px association gap.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Grouped Dealer Fee percent and amount together at right side of Dealer Fee cell, using a 4px gap so percentage clearly belongs to that fee.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Tightened Dealer Fee percentage-to-amount gap to 4px and sized badge/amount tracks to avoid implying percentage belongs to adjacent rupiah column.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Dealer Fee cell now uses fixed two-column layout: fixed-width percentage badge and right-aligned fee amount, preventing digit-count changes from shifting the amount.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Fixed Dealer Fee percentage badge width at 42px and centered its value, so percentage digits cannot shift the amount position.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Restored previous widths for other table columns while retaining Edit at 5% and table width at 1550px; adjusted T&C to 15% to keep column shares balanced.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Shifted Edit column farther right by increasing its share to 5%, narrowing fish column, and widening table to keep column spacing clear.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Enlarged T&C preview text and refined inline Detail button spacing, hover lift, press feedback, and focus styling; retained truncation to protect Edit column.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Placed the Detail button inline beside the T&C preview; widened the T&C column, added spacing and button styling, and kept a minimum width for the Edit column.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Term & Condition table cell now shows a short preview with a Detail button; Detail opens a dialog showing full terms and fish name.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Widened Term & Condition column, enabled readable multiline content, and reserved space for Edit actions; populated both sample records with the three supplied terms.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Added Shipping Cost column after Dealer Fee and Term & Condition column after Certificate; populated from existing record fields, with empty terms shown as a dash.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Aligned Koi House brand block vertically with right-side top bar by reducing desktop sidebar top padding.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Added 28px breathing room before WORKSPACE label in sidebar, below brand block.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Removed “Koi House Farm” workspace card and removed Overview, Owners, and Reports navigation items; kept Rekap Ikan and Settings.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Changed top-bar tab label to “Workspace/Rekap Ikan”.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Kept sidebar anchored from top of viewport; moved active-tab/theme bar to right-side content area only, spanning from sidebar edge to viewport edge.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Added full-width top bar spanning sidebar through content, showing active tab and theme toggle; kept add-fish button above filters.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Reverted header card and restored “Tambah ikan” beside title/theme controls above filters; PDF remains in filter toolbar.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.


## 2026-10-24

- Change: Reverted full-width header layout; restored title and theme toggle to card above inventory content. Kept “Tambah ikan” beside PDF export.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.


## 2026-10-24

- Change: Expanded top header to full viewport width above sidebar and content; kept title, subtitle, and theme toggle in header. Adjusted mobile header and drawer placement below it.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Moved page title/subtitle and theme toggle into a card-style top header; moved “Tambah ikan” beside PDF export in filter toolbar; removed duplicate sidebar theme control.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Removed Excel/CSV export control and handler; kept PDF/print export as sole export option. Removed obsolete Excel icon and styling.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed; source search found no Excel export references.

## 2026-10-24

- Change: Renamed page heading above inventory table to “Rekap Pembelian Ikan Jepang”.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Removed date line; renamed page heading and selected sidebar item from “Fish Inventory” to “Rekap Ikan”.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed. `git status` unavailable because folder is not a Git repository.

## 2026-10-24

- Change: Rebalanced table column widths, giving certificate and edit/action columns more room to prevent crowding.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Enlarged owner and displayed-record summary text to 14px on desktop and mobile.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Enlarged filter search, dropdown, and export text to 14px.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Enlarged fish names in inventory rows to 14px while retaining two-line clamping.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Enlarged inventory table header labels and set light-theme header text to black; retained readable contrast in dark theme.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Restored compact 4px filter-to-table gap after oversized spacing disrupted layout.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Increased spacing below filter controls so gap to table matches footer spacing.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Tightened spacing between filter controls and table to match spacing below table; preserved responsive horizontal margins.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Tightened spacing below table and aligned owner/count and grand-total footer to table margins for proportional placement.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed (TypeScript + Vite production build); `npm run lint` passed (`tsc -b --pretty`).

## 2026-10-24

- Change: Removed divider between toolbar and table; moved owner/count and grand-total summary outside the table card, beneath it.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed (TypeScript + Vite production build); `npm run lint` passed (`tsc -b --pretty`).

## 2026-10-24

- Change: Removed the large outer inventory card; extended filter panel boundary around filter controls and inset table, with spacing down to the table footer.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed (TypeScript + Vite production build); `npm run lint` passed (`tsc -b --pretty`).

## 2026-10-24

- Change: Repaired inventory-card JSX nesting and restored a single outer border around filter/table panels; inset table panel to align with toolbar controls.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed (TypeScript + Vite production build); `npm run lint` passed (`tsc -b --pretty`).

## 2026-10-24

- Change: Split toolbar filters/exports and fish table into separate bordered cards with visible spacing, matching reference screen structure. Table and footer now sit together in their own card.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed. Browser DOM confirmed separate filter/table cards, each with its own 1px border and 11px radius, 14px vertical gap, and two table rows.

## 2026-10-24

- Change: Added a new responsive left sidebar that complements the reference dashboard: Koi House identity/workspace switcher, Overview/Fish Inventory/Owners/Reports navigation, record-count badge, persistent theme control, settings, help, and admin profile. Sidebar collapses into an overlay drawer on mobile; inventory view and filters remain intact.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed (`tsc -b --pretty`). Browser checks confirmed desktop sidebar width 246px with content fitting viewport (document width 1249px at 1264px viewport), mobile document width 390px at 390px viewport, drawer opens/closes with scrim, selected Fish Inventory state remains visible, and theme choice persists in localStorage. Visual check confirmed mobile overlay and navigation layout.

## 2026-10-24

- Change: Redesigned the inventory screen to match provided Light/Dark references: compact date/title header, owner/status filters, Excel/PDF controls, two reference rows, compact financial table and owner grand-total footer. Preserved local CRUD, calculations, image preview, and theme switch.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed. Browser rendered two Budi Santoso records and confirmed grand total `Rp 478.655.000`; owner filter, theme, and 390px responsive layout checked.

## 2026-10-24

- Change: Built a responsive local Fish Finance UI prototype from the project PRD/DESIGN: desktop sidebar and mobile menu, light/dark theme, summary cards, searchable/filterable/sortable fish table, owner totals, add/edit/delete flows, local image preview and validation, live price calculations, CSV download, and print view. No database, auth, Cloudinary, or deployment integration.
- Changed files: `package.json`; `package-lock.json`; `index.html`; `tsconfig.json`; `tsconfig.app.json`; `tsconfig.node.json`; `vite.config.ts`; `src/main.tsx`; `src/App.tsx`; `src/App.css`; `src/index.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed (`tsc -b --pretty`). Browser check at `390 × 844` confirmed document/body width 390px and table-contained overflow; dashboard rendered 5 records; owner filter showed 2 Budi Santoso records and owner grand total `Rp 611.837.500`; test form calculated `¥1.000 × 115 = Rp 115.000`, 5% fee `Rp 5.750`, total `Rp 120.750`, then saved a record and recalculated grand total to `Rp 1.486.503.250`. Theme and persistent theme preference also exercised.

## 2026-10-24

- Change: Restored documented stable fish-thumbnail behavior before fish-name/image hover animation: fixed 38×38px thumbnails, `object-fit: contain`, no image zoom-on-hover.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Fixed UI sizing and responsiveness issues: standardized SVG icon dimensions, restored 16px base text, corrected subtitle font-size, constrained responsive search/filter controls, and contained wide-table horizontal scrolling.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-24

- Change: Rebuilt dashboard UI from scratch following PRD and DESIGN, with responsive navigation, theme switch, summary cards, search/filters, fish table, local add/edit/delete form, calculations, image preview, and owner print/export controls.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed.

## 2026-10-23

- Change: Rebuilt `src/App.tsx` from scratch following PRD and design guidelines.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` passed.

## 2026-10-23

- Change: Removed four summary cards above fish records; localized table headers and improved contrast.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-23

- Change: Added dark-mode contrast for table headers, owner names, and internal table scrollbar.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-23

- Change: Changed fish table to single-owner view and added selected-owner grand total.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-23

- Change: Right-aligned numeric headers and standardized currency symbol spacing.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-22

- Change: Added project-level rules and planning documents for fish inventory/finance dashboard.
- Changed files: `.hermes.md`; `PRD.md`; `DESIGN.md`; `NEXT_STEPS.md`; `PROGRESS.md`.
- Verification: Confirmed planning files describe requirements, visual tokens, UI-first phases, and approval gates.

## 2026-10-24

- Change: Continued project in `C:\Users\user\Documents\Project-Onelito 2` per user authorization.
- Changed files: `PROGRESS.md`.
- Verification: Confirmed active working directory is `/c/Users/user/Documents/Project-Onelito 2`.

## 2026-10-22

- Change: Set `C:\Users\user\Documents\Project-Onelito` as main project directory and established project change tracking.
- Changed files: `.hermes.md`; `PROGRESS.md`.
- Verification: Confirmed project root and progress tracking setup.
## 2026-10-24

- Change: Added a new responsive left sidebar that complements the reference dashboard: Koi House identity/workspace switcher, Overview/Fish Inventory/Owners/Reports navigation, record-count badge, persistent theme control, settings, help, and admin profile. Sidebar collapses into an overlay drawer on mobile; inventory view and filters remain intact.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed (`tsc -b --pretty`). Browser checks confirmed desktop sidebar width 246px with content fitting viewport (document width 1249px at 1264px viewport), mobile document width 390px at 390px viewport, drawer opens/closes with scrim, selected Fish Inventory state remains visible, and theme choice persists in localStorage. Visual check confirmed mobile overlay and navigation layout.

## 2026-10-24

- Change: Redesigned the inventory screen to match provided Light/Dark references: compact date/title header, owner/status filters, Excel/PDF controls, two reference rows, compact financial table and owner grand-total footer. Preserved local CRUD, calculations, image preview, and theme switch.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed. Browser rendered two Budi Santoso records and confirmed grand total `Rp 478.655.000`; owner filter, theme, and 390px responsive layout checked.

## 2026-10-24

- Change: Built a responsive local Fish Finance UI prototype from the project PRD/DESIGN: desktop sidebar and mobile menu, light/dark theme, summary cards, searchable/filterable/sortable fish table, owner totals, add/edit/delete flows, local image preview and validation, live price calculations, CSV download, and print view. No database, auth, Cloudinary, or deployment integration.
- Changed files: `package.json`; `package-lock.json`; `index.html`; `tsconfig.json`; `tsconfig.app.json`; `tsconfig.node.json`; `vite.config.ts`; `src/main.tsx`; `src/App.tsx`; `src/App.css`; `src/index.css`; `PROGRESS.md`.
- Verification: `npm run build` passed (Vite production bundle generated); `npm run lint` passed (`tsc -b --pretty`). Browser check at `390 × 844` confirmed document/body width 390px and table-contained overflow; dashboard rendered 5 records; owner filter showed 2 Budi Santoso records and owner grand total `Rp 611.837.500`; test form calculated `¥1.000 × 115 = Rp 115.000`, 5% fee `Rp 5.750`, total `Rp 120.750`, then saved a record and recalculated grand total to `Rp 1.486.503.250`. Theme and persistent theme preference also exercised.

## 2026-10-24

- Change: Restored documented stable fish-thumbnail behavior before fish-name/image hover animation: 38×38px fixed thumbnail, `object-fit: contain`, and no image zoom-on-hover.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` completed successfully; build reports existing large-chunk warning.

## 2026-10-24

- Change: Fixed UI sizing and responsiveness issues: standardized SVG icon dimensions (search icon rendered at browser-default size), restored intended 16px base text, corrected invalid subtitle font-size, constrained responsive search/filter controls, and gave wide table horizontal scrolling within its container.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` completed successfully; build reports existing large-chunk warning.

## 2026-10-24

- Change: Completely redesigned and rebuilt the UI from scratch (`src/App.tsx`, `src/App.css`) adhering strictly to PRD and DESIGN specifications (modern fintech dashboard aesthetic, desktop sidebar & mobile responsive header, metric summary cards, search & owner/certificate filters, medium-density table with uncropped thumbnails, add/edit/delete modal forms with live calculations, full image preview modal, and PDF/Excel/Print export).
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully (`tsc -b && vite build`).


## 2026-10-23

- Change: Rebuilt `src/App.tsx` completely clean from scratch following PRD and design guidelines, resolving stale build / cache issues.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` completed successfully (`tsc -b && vite build`).


## 2026-10-23

- Change: Removed four summary cards above fish records; localized table headers `HARGA`, `KURS`, and `SERTIFIKAT`; darkened table headers and owner names for readability.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Added dark-mode table contrast tokens. Header text, owner names, and internal horizontal scrollbar now switch to light-on-dark colors in dark mode while retaining dark-on-light colors in light mode.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Changed fish table to single-owner view. Owner selector now chooses one owner, OWNER column was removed, and footer shows selected owner Grand Total including dealer fee and shipping.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Right-aligned numeric table headers `HARGA (JPY)`, `KURS`, `HARGA (IDR)`, `DEALER FEE`, and `TOTAL` to match numeric cells.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Set spaces after currency symbols and enforced `Grand Total` placement at right of the table footer.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Applied repeated finance dashboard styling refinements for fee badges, edit/delete controls, stable table column widths, and mobile responsiveness.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` passed.

## 2026-10-22

- Change: Added initial product and design planning documents for the fish inventory/finance dashboard.
- Changed files: `PRD.md`; `DESIGN.md`; `NEXT_STEPS.md`; `PROGRESS.md`.
- Verification: Confirmed requirements, visual tokens, UI-first phases, and approval gates documented.

## 2026-10-22

- Change: Added project-level change-tracking instructions.
- Changed files: `.hermes.md`; `PROGRESS.md`.
- Verification: Confirmed change log requires date, description, changed files, and verification.

## 2026-10-22

- Change: Set `C:\Users\user\Documents\Project-Onelito` as main project directory and added Hermes project rules for persistent change tracking.
- Changed files: `.hermes.md`, `PROGRESS.md`.
- Verification: Confirmed current working directory is `/c/Users/user/Documents/Project-Onelito`; confirmed project root contains no existing tracked files before initialization.

## 2026-10-22

- Change: Installed and adapted UI/UX Pro Max as Hermes user-local skill for reusable UI design guidance.
- Changed files: `C:\Users\user\AppData\Local\hermes\skills\ui-ux-pro-max\SKILL.md`; `C:\Users\user\AppData\Local\hermes\skills\ui-ux-pro-max\` skill data/scripts; `PROGRESS.md`.
- Verification: Cloned upstream commit `623a9a9037d006ea727f8213f084d02a6b6f11b5`; copied 73 skill files; Python compilation passed for `search.py`, `core.py`, and `design_system.py`; design-system search returned JSON; UX search returned 3 verified results.

## 2026-10-22

- Change: Added Ponytail minimum-solution rules as Project-Onelito-only instructions; no global installation.
- Changed files: `.hermes.md`; `PROGRESS.md`.
- Verification: Confirmed rules cover reuse, root-cause fixes, minimal diffs, required safety/accessibility/test safeguards, project-only scope, and disable phrases `stop ponytail` / `normal mode`; confirmed no Ponytail files copied to global Hermes skills.

## 2026-10-22

- Change: Created initial product requirements document for admin fish-entry workflow, automatic pricing, owner totals, and owner-specific export.
- Changed files: `PRD.md`; `PROGRESS.md`.
- Verification: Confirmed `PRD.md` contains field definitions, formulas, validation, workflows, owner grand total, PDF/Excel/print scope, acceptance criteria, out-of-scope items, and unresolved business decisions.

## 2026-10-22

- Change: Updated PRD with optional Yen pricing, manual Rupiah fallback, per-fish course, one-image export, single full-access account, online storage, and configurable cloud backup schedule.
- Changed files: `PRD.md`; `PROGRESS.md`.
- Verification: Confirmed PRD documents automatic conversion when Yen and course exist, manual Rupiah when either is missing, backup options daily/weekly/monthly/disabled, backup coverage for database and images, and stock sheet deferred.

## 2026-10-22

- Change: Created project visual design specification for modern finance dashboard UI with Light/Dark themes, charcoal/red/blue palette, medium density, and responsive sidebar layout.
- Changed files: `DESIGN.md`; `PROGRESS.md`.
- Verification: `designmd lint DESIGN.md` passed with 0 errors; final lint reported token summary and no blocking contrast or reference errors.

## 2026-10-22

- Change: Created next-session implementation guide covering startup checks, MVP scope, business rules, design direction, architecture recommendation, phased implementation, backup settings, deferred stock sheet, approval gates, and resume prompt.
- Changed files: `NEXT_STEPS.md`; `PROGRESS.md`.
- Verification: Confirmed `NEXT_STEPS.md` includes explicit read-before-action steps, no-code-before-approval rule, complete field/formula requirements, phased build order, verification checklist, and session resume prompt.

## 2026-10-24

- Change: Updated project root to `C:\Users\user\Documents\Project-Onelito 2` per user authorization; project files and `PROGRESS.md` are now maintained here.
- Changed files: `PROGRESS.md`.
- Verification: Confirmed active working directory is `/c/Users/user/Documents/Project-Onelito 2` and saved updates in this folder.
## 2026-10-24

- Change: Built a responsive local Fish Finance UI prototype from the project PRD/DESIGN: desktop sidebar and mobile menu, light/dark theme, summary cards, searchable/filterable/sortable fish table, owner totals, add/edit/delete flows, local image preview and validation, live price calculations, CSV download, and print view. No database, auth, Cloudinary, or deployment integration.
- Changed files: `package.json`; `package-lock.json`; `index.html`; `tsconfig.json`; `tsconfig.app.json`; `tsconfig.node.json`; `vite.config.ts`; `src/main.tsx`; `src/App.tsx`; `src/App.css`; `src/index.css`; `PROGRESS.md`.
- Verification: `npm run build` passed (Vite production bundle generated); `npm run lint` passed (`tsc -b --pretty`). Browser check at `390 × 844` confirmed document/body width 390px and table-contained overflow; dashboard rendered 5 records; owner filter showed 2 Budi Santoso records and owner grand total `Rp 611.837.500`; test form calculated `¥1.000 × 115 = Rp 115.000`, 5% fee `Rp 5.750`, total `Rp 120.750`, then saved a record and recalculated grand total to `Rp 1.486.503.250`. Theme and persistent theme preference also exercised.

## 2026-10-24

- Change: Restored documented stable fish-thumbnail behavior before fish-name/image hover animation: 38×38px fixed thumbnail, `object-fit: contain`, and no image zoom-on-hover.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` completed successfully; build reports existing large-chunk warning.

## 2026-10-24

- Change: Fixed UI sizing and responsiveness issues: standardized SVG icon dimensions (search icon rendered at browser-default size), restored intended 16px base text, corrected invalid subtitle font-size, constrained responsive search/filter controls, and gave wide table horizontal scrolling within its container.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` and `npm run lint` completed successfully; build reports existing large-chunk warning.

## 2026-10-24

- Change: Completely redesigned and rebuilt the UI from scratch (`src/App.tsx`, `src/App.css`) adhering strictly to PRD and DESIGN specifications (modern fintech dashboard aesthetic, desktop sidebar & mobile responsive header, metric summary cards, search & owner/certificate filters, medium-density table with uncropped thumbnails, add/edit/delete modal forms with live calculations, full image preview modal, and PDF/Excel/Print export).
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully (`tsc -b && vite build`).


## 2026-10-23

- Change: Set fixed square thumbnail dimensions (`38x38px`, `flex: 0 0 38px`) with `object-fit: contain` for table fish items, ensuring images remain uncropped while maintaining consistent alignment so adjacent text does not shift.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Updated table thumbnail styling (`.thumb` and `.thumb img` in `src/App.css`) from rigid square dimensions (`38x38px`) to flexible proportional width (`height: 38px`, `width: auto`, `object-fit: contain`) so table fish thumbnails display fully without any cropping regardless of image aspect ratio.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Fixed inline style on form modal upload preview (`src/App.tsx`) from forced `100% width/height` to `width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '160px'`, ensuring uploaded images display fully without cropping in both create and edit modes.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Removed `overflow: hidden` and strict grid height constraints from `.upload-box`, `.upload-preview`, and `.large-image` modal preview containers, switching to flexbox with auto width/height and `object-fit: contain` to completely prevent image cropping.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Fixed image upload preview styling in the form modal. Increased `.upload-preview` height and ensured `object-fit: contain` so uploaded images display fully without cropping in both create and edit modes.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Implemented full edit functionality for table rows. Clicking the edit button on any fish item opens the form modal pre-filled with existing data, changes the modal title/actions to "Edit ikan" and "Simpan perubahan", and updates the item state correctly upon saving.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Redesigned the "Total terhitung" calculation summary box with a modern fintech aesthetic (left accent border, subtle background gradient, professional box shadow, and compact proportional 26px typography).
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Adjusted the font size of the "Total terhitung" total amount text to 26px bold for a balanced, proportional appearance.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Cleaned up duplicate conflicting CSS rules and explicitly set `.calculation.full strong` font size to 36px bold with high specificity so the "Total terhitung" amount displays prominently and large as requested.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Increased the font size of the "Total terhitung" total amount text to 48px bold for prominent readability.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Further enlarged the "Total terhitung" calculation summary box (font size increased to 36px bold, thicker border, larger padding) to prominently fill available modal space.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Enlarged the "Total terhitung" calculation summary box inside the form modal (increased padding, font size, and typography weight) to better utilize available space.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Configured dark mode scrollbars for modals (`.form-modal`, `.image-modal`) to match dark theme aesthetics, and removed text/icons in the upload box when an image is selected so only the full image preview is displayed.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-23

- Change: Added currency prefixes (`¥` for Harga JPY, `Rp` for Harga manual IDR and Biaya pengiriman) to input form fields using `.input-with-prefix` layout, keeping Kurs without currency prefix.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build` completed successfully without errors (`tsc -b && vite build`).

## 2026-10-22

- Change: Set `C:\Users\user\Documents\Project-Onelito` as main project directory and added Hermes project rules for persistent change tracking.
- Changed files: `.hermes.md`, `PROGRESS.md`.
- Verification: Confirmed current working directory is `/c/Users/user/Documents/Project-Onelito`; confirmed project root contains no existing tracked files before initialization.

## 2026-10-22

- Change: Installed and adapted UI/UX Pro Max as Hermes user-local skill for reusable UI design guidance.
- Changed files: `C:\Users\user\AppData\Local\hermes\skills\ui-ux-pro-max\SKILL.md`; `C:\Users\user\AppData\Local\hermes\skills\ui-ux-pro-max\` skill data/scripts; `PROGRESS.md`.
- Verification: Cloned upstream commit `623a9a9037d006ea727f8213f084d02a6b6f11b5`; copied 73 skill files; Python compilation passed for `search.py`, `core.py`, and `design_system.py`; design-system search returned JSON; UX search returned 3 verified results.

## 2026-10-22

- Change: Added Ponytail minimum-solution rules as Project-Onelito-only instructions; no global installation.
- Changed files: `.hermes.md`; `PROGRESS.md`.
- Verification: Confirmed rules cover reuse, root-cause fixes, minimal diffs, required safety/accessibility/test safeguards, project-only scope, and disable phrases `stop ponytail` / `normal mode`; confirmed no Ponytail files copied to global Hermes skills.

## 2026-10-22

- Change: Created initial product requirements document for admin fish-entry workflow, automatic pricing, owner totals, and owner-specific export.
- Changed files: `PRD.md`; `PROGRESS.md`.
- Verification: Confirmed `PRD.md` contains field definitions, formulas, validation, workflows, owner grand total, PDF/Excel/print scope, acceptance criteria, out-of-scope items, and unresolved business decisions.

## 2026-10-22

- Change: Updated PRD with optional Yen pricing, manual Rupiah fallback, per-fish course, one-image export, single full-access account, online storage, and configurable cloud backup schedule.
- Changed files: `PRD.md`; `PROGRESS.md`.
- Verification: Confirmed PRD documents automatic conversion when Yen and course exist, manual Rupiah when either is missing, backup options daily/weekly/monthly/disabled, backup coverage for database and images, and stock sheet deferred.

## 2026-10-22

- Change: Created project visual design specification for modern finance dashboard UI with Light/Dark themes, charcoal/red/blue palette, medium density, and responsive sidebar layout.
- Changed files: `DESIGN.md`; `PROGRESS.md`.
- Verification: `designmd lint DESIGN.md` passed with 0 errors; final lint reported token summary and no blocking contrast or reference errors.

## 2026-10-22

- Change: Created next-session implementation guide covering startup checks, MVP scope, business rules, design direction, architecture recommendation, phased implementation, backup settings, deferred stock sheet, approval gates, and resume prompt.
- Changed files: `NEXT_STEPS.md`; `PROGRESS.md`.
- Verification: Confirmed `NEXT_STEPS.md` includes explicit read-before-action steps, no-code-before-approval rule, complete field/formula requirements, phased build order, verification checklist, and session resume prompt.

## 2026-10-23

- Change: Started Fase 1 UI prototype for Fish Admin dashboard. Added responsive dashboard shell, Light/Dark theme toggle, summary cards, search/filter controls, dummy fish table, local pricing calculation, add-fish modal, local image validation/preview, whole-image detail modal, and dummy row actions. No database, Supabase, Cloudinary, authentication, or backup integration added.
- Changed files: `package.json`; `package-lock.json`; `src/App.tsx`; `src/App.css`; `src/index.css`; Vite scaffold files; `public/`; `README.md`.
- Verification: `npm run build` passed with Vite production bundle generated in `dist/`; `npm run lint` passed with exit code 0. Initial build caught `ChangeEvent` type-only import error; corrected import, then reran build successfully.

## 2026-10-23

- Change: Synchronized planning documents with approved architecture and UI decisions. Removed automatic cloud backup from MVP, changed image storage from Supabase Storage to Cloudinary, documented 10 MB JPG/JPEG/PNG upload, whole-image preview/modal, no dealer-fee rounding, source-value storage with derived-value recalculation, and local UI-first phase sequence.
- Changed files: `PRD.md`; `DESIGN.md`; `NEXT_STEPS.md`; `PROGRESS.md`.
- Verification: Searched all three planning documents for old backup/storage guidance and new Cloudinary/image/calculation terms; confirmed `NEXT_STEPS.md` remains useful as updated resume and phase guide, so it was retained.

## 2026-10-23

- Change: Added mobile-first product and responsive design requirements. Set primary test viewport to iPhone 11 portrait `390 × 844 CSS px`, with minimum mobile `360 × 800`, landscape `844 × 390`, laptop `1366 × 768`, and desktop `1440 × 900`. Added touch target, minimum text size, no page-level horizontal scroll, mobile form/filter/table rules, and cross-viewport acceptance criteria.
- Changed files: `PRD.md`; `DESIGN.md`; `NEXT_STEPS.md`; `PROGRESS.md`.
- Verification: Confirmed viewport targets, mobile-first rules, desktop preservation rules, and responsive test checklist appear in all relevant planning documents.

## 2026-10-23

- Change: Began approved UI refactor. Increased readable typography and touch target sizing, kept table content intact with internal horizontal scrolling, removed crop transformations from dummy image URLs, added whole-image upload preview with `object-fit: contain`, and added visible JPG/JPEG/PNG and 10 MB validation errors.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0. CSS build initially caught an escaped newline in inserted media-query CSS; corrected it, then reran build and lint successfully.

## 2026-10-23

- Change: Completed visible UI localization to Bahasa Indonesia. Translated navigation, dashboard summaries, filters, table labels, certificate statuses, empty state, image preview labels, form fields, pricing labels, upload guidance, accessibility labels, and image alt text.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: Audited `src/App.tsx` for remaining user-facing English UI strings; ran `npm run build` and `npm run lint` after localization.

## 2026-10-23

- Change: Moved exchange-rate display from beneath fish names into dedicated `KURS` table column and removed duplicate sublabel under fish names. Expanded table minimum width to preserve column readability.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Kept dealer fee amount and percentage inline with stable baseline alignment; changed certificate labels to `Ada`/`Tidak` across filters, table, preview, and form; enlarged fish names and certificate badges for readability.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Prevented long fish names from overlapping adjacent table content by constraining fish-cell width, enabling two-line wrapping, and applying ellipsis after two lines.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Applied approved hybrid UI language. Kept Indonesian for user actions, form guidance, search/helper text, statuses, confirmations, and context descriptions; changed dashboard structure, navigation, summary labels, table headers, filters, and export action to English.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0. Audited remaining visible Indonesian strings and confirmed they are limited to user-facing guidance, statuses, actions, and local context.

## 2026-10-23

- Change: Removed four summary cards above fish records; localized table headers `HARGA`, `KURS`, and `SERTIFIKAT`; darkened table headers and owner names for readability.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Added dark-mode table contrast tokens. Header text, owner names, and internal horizontal scrollbar now switch to light-on-dark colors in dark mode while retaining dark-on-light colors in light mode.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Changed fish table to single-owner view. Owner selector now chooses one owner, OWNER column was removed, and footer shows selected owner Grand Total including dealer fee and shipping.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Right-aligned numeric table headers `HARGA (JPY)`, `KURS`, `HARGA (IDR)`, `DEALER FEE`, and `TOTAL` to match numeric cells.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Added spaces after currency symbols for readable amounts: `Rp 1.000.000` and `¥ 1.000`.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Styled dealer fee percentage as a compact neutral badge placed before fee nominal, for example `5%` followed by `Rp 190.000`.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Replaced `Edit` and `Hapus` action text with icon-only buttons. Edit icon uses blue; delete icon keeps red. Added accessible labels and tooltips.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Tightened edit/delete icon spacing, increased icon size, changed `EDIT` header to uppercase, and right-aligned header/actions.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Fixed dealer fee percentage column width at 38px and kept fee nominal aligned in a stable second column.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Added subtle hover and press animation to edit/delete icon buttons. Edit hover uses blue-soft background; delete hover keeps red styling.
- Changed files: `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Removed unused pagination controls. Kept `Grand Total` as right-aligned footer content.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Styled `Grand Total` as a blue highlighted summary box with uppercase label, larger amount, dark-mode colors, and full-width mobile layout.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Changed `Grand Total` to compact inline presentation: uppercase label and bold nominal aligned right without summary box.
- Changed files: `src/App.tsx`; `src/App.css`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.

## 2026-10-23

- Change: Added fixed table column widths using `<colgroup>` and `table-layout: fixed` to maintain consistent column sizing across renders.
- Changed files: `src/App.tsx`; `PROGRESS.md`.
- Verification: `npm run build` passed; `npm run lint` passed with exit code 0.