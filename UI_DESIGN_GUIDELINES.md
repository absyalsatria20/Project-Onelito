# Pedoman Konsistensi UI — Project-Onelito

Dokumen ini menetapkan aturan desain dan animasi untuk UI prototipe Project-Onelito. Pertahankan tampilan saat ini sebagai baseline; pedoman ini bukan izin untuk redesign atau perubahan massal. Terapkan saat membuat atau mengubah komponen UI, dan ubah pedoman hanya bila ada keputusan desain baru yang disetujui.

## 1. Arah visual

- Pertahankan karakter dashboard fintech yang bersih, tenang, modern, dan berorientasi data.
- Gunakan layout desktop sidebar/header yang sudah ada. Jaga hierarki informasi, ruang kosong, dan alignment antarkomponen.
- Jangan mengganti pola navigasi, susunan tabel, atau interaksi yang ada tanpa permintaan eksplisit.
- Hindari ornamen dekoratif berlebihan, efek acak, emoji sebagai ikon, dan perubahan visual yang tidak membantu pemahaman atau tindakan.

## 2. Warna dan tema

- Gunakan token tema yang sudah ada (`--page`, `--panel`, `--panel-soft`, `--text`, `--muted`, `--line`, `--blue`, `--blue-hover`, `--green`, `--red`) alih-alih menetapkan warna baru untuk komponen.
- Pertahankan pasangan Light/Dark: setiap komponen baru harus terbaca dan konsisten di kedua tema.
- Biru menandai aksi utama, fokus, atau status aktif; hijau untuk keberhasilan; merah untuk error dan tindakan destruktif. Jangan menyampaikan status hanya dengan warna.
- Jaga kontras teks dan indikator interaktif. Fokus keyboard harus tetap terlihat.

## 3. Tipografi, bentuk, dan jarak

- Ikuti font aplikasi (`DM Sans` untuk UI; heading mengikuti style yang sudah ada) dan skala ukuran di sekitar komponen sejenis.
- Pertahankan hierarki: heading jelas, label ringkas, isi mudah dibaca, angka finansial mudah dipindai.
- Gunakan radius, border, bayangan, tinggi kontrol, dan jarak yang mengikuti komponen tetangga; jangan menambah nilai visual baru tanpa alasan.
- Pertahankan format mata uang dan angka yang digunakan aplikasi.
- Pada layar kecil, utamakan keterbacaan dan target sentuh yang nyaman. Jangan membuat label penting terpotong tanpa cara melihat isi penuh.

## 4. Bahasa gerak / motion

- Animasi harus menjelaskan perubahan keadaan atau hubungan antarbagian, bukan sekadar hiasan.
- Gunakan gerak halus, terarah, dan singkat dengan easing yang melambat saat berhenti. Hindari gerak kasar, blinking, bounce berlebihan, atau jeda yang menghambat interaksi.
- Gunakan pola konsisten per jenis interaksi: hover/press untuk kontrol, fade untuk pergantian teks, transisi lembut untuk konten, dan masuk/keluar yang seimbang untuk modal/toast.
- Gunakan transform dan opacity untuk gerak masuk/keluar bila memungkinkan. Animasi yang memang harus mengikuti ukuran konten (misalnya breadcrumb) boleh mengubah ukuran, tetapi ukur dari konten aktual dan jaga transisinya stabil.
- Breadcrumb: `Workspace/` tetap diam; label section fade dan mengembang/menyusut halus seperti volume bar saat section berubah; satu garis bawah bergerak halus dan panjangnya mengikuti lebar breadcrumb aktual. Jangan membuat garis kedua.
- Interaksi harus tetap responsif selama animasi. Perubahan cepat harus menuju state terbaru tanpa glitch atau animasi lama yang tertinggal.
- Hormati `prefers-reduced-motion`; hilangkan atau sederhanakan gerak non-esensial tanpa menghilangkan informasi atau status.

## 5. Pola animasi per komponen

Bagian ini mencatat pola yang sudah dipakai UI. Saat membuat komponen sejenis, gunakan pola yang sama; jangan menambah variasi baru tanpa alasan dan persetujuan desain.

### Rekap Ikan dan tabel

- Saat membuka atau berpindah periode, seluruh area konten periode masuk bersama: fade, gerak vertikal ringan, scale sangat halus, blur tipis; arah gerak vertikal, easing lembut, durasi sekitar 420 ms. Jangan menghidupkan ulang animasi tabel saja bila keseluruhan konten periode yang berubah.
- Saat konten Rekap Ikan pertama kali tampil, animasikan per kelompok: heading/deskripsi, tombol `Tambah ikan`, kontrol toolbar/filter secara stagger pendek, lalu tabel dan ringkasan/footer. Hirarki jelas; stagger jangan membuat pengguna menunggu.
- Tabel harus tetap mudah dibaca selama gerak, berada dalam scroll container responsif, dan tidak menggeser seluruh halaman karena animasi.
- Angka, harga, dan data tidak boleh tertutup atau tertunda oleh dekorasi animasi.

### Halaman Setting

- Heading, deskripsi, dan badge masuk dengan fade/geser ringan; badge dapat menyusul dengan delay pendek.
- Kartu Setting muncul berurutan dengan fade, gerak vertikal ringan, scale kecil, dan blur tipis. Pola stagger kartu sekitar 90 ms seperti implementasi saat ini; jangan menambah jeda panjang untuk banyak kartu.
- Isi kartu tidak perlu dianimasikan satu per satu kecuali ada perubahan interaksi yang memang perlu dijelaskan.
- Kontrol Mode Tampilan menggunakan switch ilustratif landscape siang/malam, state aktif jelas dengan label `Light mode`/`Dark mode` di Setting. Toggle ringkas di topbar memakai visual/state yang sama tanpa label tambahan. Transisi lembut, focus-visible, dan reduced-motion.

### Tombol dan kontrol

- Tombol mengikuti state yang konsisten: hover dapat mengangkat 1–2 px atau memberi perubahan border/latar/bayangan ringan; active menekan kembali atau scale kecil; focus-visible jelas; disabled tidak bergerak dan tetap tampak nonaktif.
- Tombol aksi utama mempertahankan warna dan bobot visual utama. Tombol sekunder lebih tenang. Tombol hapus memakai warna danger dan tidak meniru gaya aksi utama.
- Tombol Export PDF memakai hover border biru, gerak naik, bayangan halus, dan gerak ikon seperti perilaku yang sudah ada. Terapkan pola itu hanya pada kontrol sejenis bila relevan.
- Tombol X modal: hover border/latar biru dan naik tipis, ikon berputar seperempat putaran; saat ditekan scale kecil. Jangan membuat gerak ikon mengganggu atau mengubah posisi tombol.
- Jangan memakai blink, pulse tanpa henti, atau animasi yang bergantung pada hover saja untuk menyampaikan fungsi.

### Navigasi, breadcrumb, tab, dan menu

- Prefix `Workspace/` tetap di tempat. Label section fade dan mengembang dari kiri dengan overshoot sangat ringan; satu garis bawah mengikuti lebar breadcrumb aktual dan bergerak horizontal dengan easing lembut. Tidak boleh ada garis kedua.
- Tab periode: state aktif/nonaktif jelas; hover/press memakai gerak kecil dan transisi warna/border. Hindari animasi yang mendorong layout atau mengubah lebar tab secara tiba-tiba.
- Menu titik tiga muncul sebagai floating menu, tidak mendorong konten dan tidak terpotong scroll container. Tutup saat klik luar, `Escape`, atau aksi dipilih. Transisi ringan; tidak perlu stagger dekoratif.
- Perubahan section, tab, atau menu harus mengikuti perubahan state aktual dan tetap aman saat dipicu berulang cepat.

### Modal, dialog, preview, dan Detail T&C

- Dialog masuk dengan fade dan scale/geser kecil; backdrop ikut muncul dengan lembut. Dialog tidak melompat jauh dari posisi pusat.
- Dialog yang punya animasi keluar harus menyelesaikan fade/geser singkat sebelum dilepas. Semua cara tutup yang tersedia (X, Batal, backdrop, `Escape` bila didukung, dan sukses submit) harus memakai exit state yang sama.
- Isi dan tombol dialog tetap interaktif selama animasi; animasi tidak boleh menahan konfirmasi atau menyebabkan aksi ganda.
- Modal konfirmasi hapus menjaga hierarki: ikon danger, pesan jelas, Batal sekunder, Hapus sebagai destructive action. Jangan membuat aksi berbahaya tampak seperti tombol utama biasa.
- Modal preview gambar mempertahankan gambar proporsional dan ruang yang cukup; tutup lewat X/backdrop/`Escape` tetap konsisten.
- Kunci scroll halaman saat modal sesuai perilaku yang sudah ada; pulihkan setelah modal tutup.

### Toast / notifikasi

- Toast masuk/keluar dengan fade dan pergeseran kecil, tetap di posisi tengah yang sudah ditetapkan.
- Saat notifikasi baru muncul, timer dan exit animation notifikasi lama harus dibatalkan; pesan baru menggantikan tanpa kedipan, posisi lompat, atau penghapusan terlambat.
- Toast tidak mengambil fokus, tidak menutupi kontrol penting, dan waktunya cukup untuk dibaca. Hormati reduced-motion.

### Reduced motion dan batas teknis animasi

- Terapkan `prefers-reduced-motion` pada seluruh pola di atas, bukan hanya animasi baru. Bila gerak dimatikan, tampilkan state akhir secara langsung dan tetap jelas.
- Untuk state transition, gunakan properti murah seperti `transform` dan `opacity` bila memungkinkan. Pengecualian ukuran yang disengaja: breadcrumb mengubah panjang garis untuk mengikuti teks; ukur lebar aktual dan pastikan transisi tidak dikalahkan selector CSS lama.
- Periksa selector global dan override sebelum menambah rule animasi: satu elemen pseudo-element tidak boleh punya deklarasi duplikat yang menimpa properti transisi.
- Animasi dapat diinterupsi; perubahan cepat harus berakhir pada state terbaru tanpa mengandalkan event akhir animasi untuk kebenaran data.

## 6. Komponen dan state

- Tombol: bedakan primary, secondary, dan destructive; pertahankan state hover, pressed, disabled, dan focus yang jelas.
- Input: label terlihat, border/focus selaras tema, feedback error dekat field terkait.
- Tabel: jaga keterbacaan kolom finansial, containment scroll responsif, dan aksi konsisten antarbaris.
- Modal: latar dan dialog punya hierarki jelas; sediakan cara tutup dan jaga fokus/scroll sesuai perilaku saat ini.
- Toast: tetap ringkas, mudah dibaca, tidak menghalangi tindakan utama, dan animasi keluar tidak memotong pesan baru.
- Ikon: gunakan Lucide yang sudah dipakai proyek; jaga ukuran dan bobot garis seragam. Tombol ikon saja perlu nama aksesibel.

## 7. Checklist sebelum menyelesaikan perubahan UI

- Bandingkan komponen baru dengan pola sejenis di Rekap Ikan, Setting, tombol, tab, modal, atau toast.
- Cek state normal, hover, active, focus-visible, disabled, masuk, keluar, dan perubahan state berulang sesuai relevansi.
- Cek Light/Dark, viewport kecil, scroll container, reduced-motion, serta tidak ada layout jump atau animasi yang menutupi konten.
- Jalankan `npm run build`, `npm run lint`, dan `git diff --check`; catat di `PROGRESS.md`.

