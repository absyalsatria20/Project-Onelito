# PRD — Rekap Pembelian Ikan Jepang

> Status implementasi: prototipe UI lokal React + Vite + TypeScript. PRD ini memisahkan perilaku yang sudah ada dari target integrasi online. Jangan anggap autentikasi, Supabase, Cloudinary, persistensi server, atau deployment sudah tersedia.
>
> Sudah ada di UI lokal: dashboard responsif, Light/Dark mode, pencarian/filter, CRUD lokal selama sesi, kalkulasi harga, tabel finansial, ringkasan, PDF/print, preview foto, T&C ringkas dengan Detail. Export Excel/CSV bukan bagian dari UI saat ini.

## Catatan status

Bagian berlabel perilaku lokal menjelaskan implementasi yang sudah ada. Bagian persyaratan MVP di bawah menjelaskan target produk, bukan bukti fitur sudah terimplementasi. Semua integrasi, persistensi lintas sesi, autentikasi, penyimpanan cloud, dan deployment tetap berstatus belum dikerjakan sampai diverifikasi di repository.

## 1. Ringkasan

Project ini membantu admin mencatat data ikan, menghitung harga otomatis, mengelompokkan pembelian berdasarkan owner, dan mencetak tampilan terpilih ke PDF. Dokumen ini mencakup prototipe lokal saat ini serta kebutuhan target produk; status implementasi dijelaskan terpisah.

Target utama: input cepat, perhitungan akurat, data mudah difilter, dan dokumen owner-specific siap dibagikan.

Aplikasi terutama digunakan melalui handphone saat input dan pengecekan data. Desktop dan laptop tetap didukung dengan layout dashboard penuh tanpa mengurangi estetika, keterbacaan, atau kelengkapan fitur.

Patokan viewport utama:

- Mobile utama: iPhone 11 portrait, `390 × 844 CSS px`.
- Mobile minimum: `360 × 800 CSS px`.
- Mobile landscape: iPhone 11, `844 × 390 CSS px`.
- Desktop: `1440 × 900 CSS px`.
- Laptop: `1366 × 768 CSS px`.

Ukuran tersebut adalah CSS viewport browser, bukan resolusi fisik layar.
## 2. Tujuan

- Mempercepat input data ikan.
- Mengurangi salah hitung harga Yen ke Rupiah.
- Menghitung dealer fee, shipping cost, dan total otomatis.
- Menampilkan grand total pembelian per owner.
- Mencetak/menyimpan tampilan terfilter sebagai PDF; PDF menjadi format export yang dipertahankan saat ini.
- Menyimpan gambar dan status sertifikat setiap ikan.

## 3. Pengguna

### Admin

Admin dapat:

- Menambah data ikan.
- Mengunggah gambar ikan.
- Mengubah dan menghapus data ikan.
- Melihat daftar ikan dalam tabel.
- Memfilter data berdasarkan owner.
- Melihat total per ikan dan grand total owner.
- Mencetak tampilan data terfilter ke PDF/print.

MVP belum membutuhkan role pengguna berbeda.

## 4. Ruang Lingkup MVP

### 4.1 Data ikan

Setiap record ikan memiliki field berikut:

| Field | Tipe | Wajib | Perilaku |
|---|---|---:|---|
| Gambar | Upload image | Tidak | JPG/JPEG/PNG, maksimal 10 MB saat upload; dikompresi sebelum dikirim ke Cloudinary; gambar ditampilkan utuh dan dapat dibuka dalam modal detail |
| Nama ikan | Text | Ya | Contoh: `Ginrin Kohaku Torazo Nisai Female 52cm` |
| Owner | Text/select | Ya | Nama owner; dapat dipakai untuk filter dan export |
| Harga Yen | Numeric currency | Tidak | Opsional; kosong jika ikan tidak memakai harga Yen |
| Kurs | Numeric | Kondisional | Kurs per ikan; wajib jika Harga Yen diisi dan harga Rupiah ingin dihitung dari konversi |
| Harga Rupiah | Numeric currency | Kondisional | Otomatis dari `Harga Yen × Kurs`; boleh diisi manual jika Harga Yen atau Kurs kosong |
| Dealer fee (%) | Percentage | Tidak | Persentase fee dari Harga Rupiah |
| Dealer fee (Rp) | Numeric currency | Otomatis | `Harga Rupiah × Dealer fee (%)` |
| Shipping cost | Numeric currency | Tidak | Default `Rp0` jika kosong |
| Total | Numeric currency | Otomatis | `Harga Rupiah + Dealer fee + Shipping cost` |
| Term & condition | Long text | Tidak | Input manual per ikan |
| Sertifikat | Checkbox | Ya | `Belum ada` saat unchecked, `Ada` saat checked |

### 4.2 Tabel utama

Tabel menampilkan kolom dalam urutan saat ini:

1. Fish (thumbnail dan nama).
2. Harga (JPY).
3. Kurs.
4. Harga (IDR).
5. Dealer Fee (persentase dan nominal dalam satu grup; persen tetap berasosiasi dengan nominal fee).
6. Shipping Cost.
7. Total.
8. Sertifikat.
9. Term & Condition (cuplikan singkat dan tombol Detail; dialog menampilkan seluruh isi).
10. Edit (aksi edit dan hapus).

Owner ditampilkan pada filter dan ringkasan; tidak menjadi kolom tabel saat ini.

T&C awal pada data contoh:

- `Free azukari 1 season until September 2027`
- `Breeder guarantee 100%`
- `Free entry fish & handling fish AJKS 2027`.

Tabel harus mendukung:

- Pencarian nama ikan dan owner.
- Filter owner.
- Filter status sertifikat.
- Sorting minimal berdasarkan owner, nama ikan, dan total.
- Tampilan tetap terbaca pada layar kecil; horizontal scroll hanya boleh dipakai di container tabel lebar, bukan pada halaman utama.
- Layout mobile menjadi prioritas: form satu kolom, kontrol filter dapat wrap, navigasi berubah menjadi header/menu, dan aksi utama mudah dijangkau ibu jari.
- Target tap minimal `44 × 44px`; body text minimal `16px`; input dan tombol minimal tinggi `44px`.
- Desktop dan laptop memakai sidebar serta tabel medium-density tanpa mengecilkan teks untuk memaksa semua kolom masuk.

### 4.3 Grand total owner

Saat owner dipilih atau difilter, sistem menampilkan ringkasan:

- Nama owner.
- Jumlah ikan.
- Total Harga Rupiah.
- Total dealer fee.
- Total shipping cost.
- Grand total.

Rumus:

`Grand Total Owner = jumlah Total semua ikan milik owner tersebut`

Jika tidak ada owner dipilih, sistem dapat menampilkan grand total seluruh data.

### 4.4 Cetak/PDF — perilaku lokal saat ini

- Tombol PDF meminta satu owner dipilih; kondisi All Owners menampilkan pesan dan tidak membuka print.
- Setelah owner dipilih, aplikasi memanggil dialog cetak browser (`window.print()`); pengguna memilih printer atau Save as PDF.
- Data yang ditampilkan mengikuti owner terpilih.
- Print stylesheet menyembunyikan thumbnail dan aksi edit/hapus; jangan menyatakan PDF berisi gambar.
- Excel/CSV tidak tersedia dan tidak menjadi target aktif.

Penyempurnaan PDF (layout, judul, tanggal, ringkasan, T&C lengkap, gambar bila diminta) belum dianggap selesai sampai diuji hasil print nyata. Tanggal dan tata letak output masih perlu dikonfirmasi.

## 5. Aturan Perhitungan

### 5.1 Harga Rupiah

Jika Harga Yen dan Kurs diisi:

`Harga Rupiah = Harga Yen × Kurs`

Jika Harga Yen atau Kurs kosong, admin boleh mengisi Harga Rupiah secara manual.

Harga Rupiah harus tetap disimpan sebagai angka integer Rupiah. Sistem menyimpan sumber harga untuk membedakan:

- `yen_conversion`: hasil Harga Yen × Kurs.
- `manual_rupiah`: input manual karena data Yen atau Kurs tidak tersedia.

Contoh konversi:

- Harga Yen: `¥3.800.000`
- Kurs: `115`
- Harga Rupiah: `Rp437.000.000`

Contoh ikan tanpa harga Yen:

- Harga Yen: kosong.
- Kurs: kosong.
- Harga Rupiah: diisi manual admin.

### 5.2 Dealer fee

`Dealer Fee Nominal = Harga Rupiah × Dealer Fee Persen / 100`

Contoh:

- Harga Rupiah: `Rp437.000.000`
- Dealer fee: `5%`
- Dealer fee nominal: `Rp21.850.000`

### 5.3 Total

`Total = Harga Rupiah + Dealer Fee Nominal + Shipping Cost`

Shipping cost kosong dianggap `Rp0`.

### 5.4 Pembulatan

- Nilai uang disimpan sebagai angka integer Rupiah/Yen, bukan string berformat.
- Nilai sumber disimpan sebagai angka; nilai turunan dihitung ulang dari nilai sumber secara konsisten.
- Tampilan menggunakan pemisah ribuan.
- Dealer fee tidak dibulatkan; pertahankan pecahan Rupiah sesuai hasil kalkulasi.

## 6. Alur Utama

### 6.1 Tambah ikan

1. Admin membuka form tambah ikan.
2. Admin mengunggah gambar jika tersedia.
3. Admin mengisi nama ikan, owner, harga Yen, dan kurs.
4. Sistem menghitung Harga Rupiah.
5. Admin mengisi dealer fee persen dan shipping cost jika ada.
6. Sistem menghitung dealer fee nominal dan total secara real-time.
7. Admin mengisi term & condition dan status sertifikat.
8. Admin menyimpan data.
9. Sistem memvalidasi input lalu menampilkan record di tabel.

### 6.2 Edit ikan

1. Admin memilih aksi edit.
2. Sistem mengisi form dengan data existing.
3. Admin mengubah field.
4. Sistem menghitung ulang field otomatis.
5. Admin menyimpan perubahan.

### 6.3 Export owner

1. Admin memilih owner.
2. Sistem memfilter semua record owner tersebut.
3. Sistem menampilkan grand total owner.
4. Untuk implementasi lokal saat ini, admin memilih aksi PDF setelah memilih owner.
5. Browser membuka dialog print; implementasi PDF masih perlu diuji dari hasil cetak nyata.

## 7. Validasi

- Nama ikan tidak boleh kosong.
- Owner tidak boleh kosong.
- Harga Yen harus angka lebih besar atau sama dengan 0.
- Kurs harus angka lebih besar dari 0.
- Dealer fee persen harus antara 0 dan 100, kecuali aturan bisnis mengizinkan lebih dari 100.
- Shipping cost tidak boleh negatif.
- File gambar hanya menerima format yang disepakati, minimal JPG, JPEG, dan PNG.
- Ukuran file gambar memiliki batas maksimum.
- Term & condition boleh kosong.
- Sertifikat default unchecked.
- Hapus record harus meminta konfirmasi.

## 8. Format Tampilan

### Mata uang

- Yen: `¥3.800.000`
- Rupiah: `Rp437.000.000`
- Persentase: `5%`

Input angka boleh menerima angka mentah, lalu sistem menampilkan format mata uang saat blur atau setelah input valid.

### Status sertifikat

- Checkbox checked: `Ada`.
- Checkbox unchecked: `Belum ada`.

## 9. Kriteria Penerimaan MVP

1. Admin dapat menambah record dengan seluruh field utama.
2. Admin dapat upload dan melihat preview satu gambar ikan.
3. Harga Rupiah otomatis benar berdasarkan Harga Yen dan Kurs jika keduanya tersedia.
4. Admin dapat mengisi Harga Rupiah manual jika Harga Yen atau Kurs kosong.
5. Sistem menyimpan sumber Harga Rupiah sebagai konversi atau manual.
6. Dealer fee nominal otomatis benar berdasarkan persentase.
7. Total otomatis memasukkan Harga Rupiah, dealer fee, dan shipping cost.
8. Shipping cost kosong dihitung sebagai nol.
9. Admin dapat edit dan hapus record.
10. Admin dapat mencari dan memfilter berdasarkan owner.
11. Grand total berubah sesuai owner yang dipilih.
12. Export owner tidak mencampur data owner lain.
13. Print/PDF menampilkan total owner dengan benar; hasil akhir harus diuji di dialog print browser.
14. Data invalid ditolak dengan pesan error yang jelas.
15. Data uang tidak kehilangan nilai karena format tampilan.
16. Tabel tetap dapat digunakan pada ukuran layar yang ditargetkan.
17. Upload gambar JPG/JPEG/PNG sampai 10 MB diterima atau ditolak dengan pesan jelas.
18. Gambar tampil utuh tanpa crop dan dapat dibuka dalam modal detail.
19. Dealer fee mempertahankan pecahan hasil kalkulasi tanpa pembulatan.
20. Fase 1 dapat diuji tanpa database atau layanan cloud.
21. UI tidak menimbulkan horizontal scroll pada halaman utama pada viewport `390 × 844 CSS px` dan `360 × 800 CSS px`.
22. Semua kontrol utama pada mobile memiliki target tap minimal `44 × 44px` dan teks tetap terbaca tanpa zoom.
23. Form mobile tersusun satu kolom; tabel lebar memakai container scroll atau tampilan card yang tetap menampilkan data penting.
24. Layout desktop pada `1440 × 900 CSS px` dan laptop pada `1366 × 768 CSS px` tetap lengkap, proporsional, dan estetis.
25. UI diuji pada mobile portrait, mobile landscape, laptop, dan desktop sebelum fase database.

## 10. Penyimpanan Gambar

Data utama disimpan dalam database PostgreSQL. File gambar disimpan di Cloudinary, bukan di kolom database dan bukan di Supabase Storage.

Supabase menyimpan metadata dan referensi asset:

- `cloudinary_public_id`.
- `secure_url`.
- URL atau parameter thumbnail.
- Format, ukuran, lebar, dan tinggi gambar.

Ketentuan gambar:

- Format upload: JPG, JPEG, PNG.
- Batas upload awal: 10 MB.
- Gambar boleh berbentuk kotak, portrait, atau landscape.
- Gambar tidak boleh terpotong saat preview atau detail.
- Thumbnail tabel memakai ukuran kecil dan lazy loading.
- Klik thumbnail membuka modal detail dengan `object-fit: contain`.
- Kompresi client-side boleh dilakukan sebelum upload untuk menghemat storage dan bandwidth.
- API secret Cloudinary tidak boleh masuk frontend.

Cloudinary Free memiliki batas storage, bandwidth, dan transformation yang berbagi credit. Aplikasi harus memakai thumbnail untuk tabel dan memuat gambar detail hanya saat diminta.

## 11. Di Luar MVP

- Multi-user dan permission kompleks; MVP memakai satu akun akses penuh.
- Sinkronisasi kurs otomatis dari API eksternal.
- OCR dari foto atau sertifikat.
- Notifikasi WhatsApp/email.
- Inventory dan status penjualan ikan.
- Pembayaran online.
- Dashboard analitik kompleks.
- Bulk import CSV/Excel.
- Audit log lengkap.
- Sheet stock.

Fitur tersebut dapat ditambahkan setelah alur input, perhitungan, dan export stabil.

## 12. Keputusan yang Sudah Ditetapkan

1. Harga Yen opsional.
2. Kurs disimpan per ikan.
3. Jika Harga Yen dan Kurs tersedia, Harga Rupiah dihitung otomatis.
4. Jika Harga Yen atau Kurs kosong, Harga Rupiah boleh diisi manual.
5. Dealer fee dihitung dari Harga Rupiah dan persentase manual.
6. Dealer fee kosong dianggap `0%`.
7. Shipping cost berlaku per ikan dan kosong dianggap `Rp0`.
8. Term & condition berlaku per ikan.
9. Satu ikan memiliki satu gambar.
10. Print stylesheet lokal saat ini menyembunyikan thumbnail; penyertaan gambar pada dokumen PDF belum disepakati dan belum diimplementasikan.
11. Owner berupa text bebas.
12. Web diakses online dari berbagai perangkat.
13. Login diperlukan.
14. MVP memakai satu akun dengan akses penuh.
15. Data utama disimpan di database cloud dan gambar di cloud storage.
17. Backup cloud dihapus dari MVP karena batasan layanan gratis.
18. Gambar disimpan di Cloudinary; Supabase hanya menyimpan metadata dan referensi asset.
19. Upload gambar menerima JPG/JPEG/PNG sampai 10 MB sebelum kompresi.
20. Gambar ditampilkan utuh tanpa crop dan dapat dibuka dalam modal detail.
21. Nilai sumber disimpan; nilai turunan dihitung ulang tanpa pembulatan dealer fee.
22. Fase 1 fokus UI lokal; Fase 2 menguji Supabase lokal dan integrasi Cloudinary; Fase 3 deployment online.
23. Sheet stock ditunda sampai kebutuhan stock dirumuskan.
24. Project harus dapat dipakai untuk ikan Jepang maupun ikan Indonesia.

## 12. Rekomendasi Implementasi Awal

Bangun satu alur lengkap terlebih dahulu:

`Tambah ikan → hitung otomatis → simpan → filter owner → tampilkan grand total → export`

Jangan mulai dari dashboard kompleks. Validasi alur bisnis dan format dokumen dengan beberapa data nyata terlebih dahulu.
