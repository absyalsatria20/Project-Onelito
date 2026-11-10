# Panduan Penggunaan & Dokumentasi Fitur (User Guide)
- Project: Project-Onelito 2 (Fish Finance Dashboard)
- Tanggal Update: 10 November 2026

## 1. Ikhtisar Aplikasi
Dashboard manajemen rekapitulasi pembelian ikan hias Jepang dengan fitur kalkulasi finansial otomatis (Yen to IDR, Dealer Fee, Shipping Cost, Total), manajemen owner, export PDF langsung, dan pencarian global lintas periode.

## 2. Fitur Utama & Panduan Penggunaan
### A. Pencarian Global & Navigasi Cepat (Sidebar)
- **Kolom Search Global**: Terletak di sidebar (di bawah label `WORKSPACE` dan di atas menu `Rekap Ikan`).
- **Pencarian Lintas Periode**: Ketik nama ikan atau nama owner, maka dropdown rekomendasi akan muncul secara instan.
- **Navigasi Keyboard**: 
  - Gunakan tombol `ArrowDown` / `ArrowUp` untuk menyoroti item di dropdown tanpa melebihi batas atas/bawah.
  - Tekan `Enter` untuk langsung memilih ikan tersebut (aplikasi otomatis berpindah ke periode dan menampilkan data ikan terkait, dengan filter owner diset ke 'All Owners').
  - Tekan `Escape` untuk menutup dropdown.
- **Tombol Clear (X)**: Klik tombol lingkaran `X` di sebelah kanan input untuk mereset pencarian secara instan.

### B. Manajemen Rekap Ikan & Periode
- **Periode Tab**: Beralih antar periode rekapitulasi pembelian.
- **Filter & Owner**: Filter berdasarkan owner atau status sertifikat.
- **Grand Total Flexible**: Kalkulasi grand total otomatis menyesuaikan dengan data aktif saat itu.

### C. Data & Backup Pengaturan
- **Validasi Ketat Backup**: Format file backup JSON divalidasi secara ketat (struktur root, periode, dan field record ikan) untuk mencegah data rusak.
- **Konfirmasi Import**: Dialog konfirmasi dengan ringkasan jumlah periode dan data ikan sebelum menimpa data yang ada.
- **Pengecualian Profil**: Data profil pengguna dikecualikan dari file backup agar fokus murni pada data finansial dan rekap ikan.

### D. Ekspor PDF
- Menggunakan `jsPDF` + `jspdf-autotable` untuk menghasilkan dokumen PDF rekapitulasi yang rapi beserta gambar proporisonal dan ketentuan T&C lengkap.
