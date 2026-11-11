# Rencana Perbaikan & Pengembangan Proyek (Next Steps)

## 1. Keamanan Login (Secure Authentication)
- **Validasi Kredensial Real-time ke Supabase**: Memastikan proses masuk (*login*) memverifikasi *username* dan *password_hash* langsung ke tabel `profiles` di Supabase pada setiap percobaan login.
- **Manajemen Sesi Berbasis `sessionStorage` & Timestamp**: Mengalihkan penyimpanan status masuk dari `localStorage` (yang persisten permanen) ke `sessionStorage` (otomatis terhapus saat tab ditutup) disertai *timestamp* kedaluwarsa sesi (misal kedaluwarsa otomatis setelah 12 atau 24 jam).
- **Verifikasi Saat *Mount* (`useEffect`)**: Memeriksa keabsahan sesi aktif saat aplikasi pertama kali dimuat sehingga manipulasi penyimpanan browser via F12 dapat dicegah dan memaksa kembali ke halaman login jika sesi tidak valid.
