# Project Progress

## 2026-11-10 — Isolasi State Global Search di Sidebar
- Change:
  - Memisahkan state pencarian global di sidebar (`globalQuery`) dari pencarian lokal tiap tab periode (`query`).
  - Mencegah bug hilangnya state pencarian atau ketidakkonsistenan antar tab periode saat menggunakan global search di sidebar.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `61d5c39`.

## 2026-11-10 — Perbaikan Target Period Query pada Quick-Jump Dropdown
- Change:
  - Memperbaiki bug race condition state `setQuery` saat berpindah periode via dropdown quick-jump. Sekarang state `periods` pada `item.periodId` langsung di-set `query: item.name` sebelum `activePeriodId` diubah.
  - Tabel utama sekarang langsung beralih ke periode yang tepat dan memfilter ikan yang dipilih secara akurat.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `5f772d2`.

## 2026-11-10 — Auto-Reset Pencarian Saat Kosong & Hapus Tombol Reset
- Change:
  - Global search otomatis mereset dan menutup status pencarian lintas periode saat kotak pencarian dikosongkan (`val.trim() === ''`).
  - Menghapus tombol "Reset" manual di bawah input pencarian sidebar sehingga antarmuka lebih bersih.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `94dd4d3`.

## 2026-11-10 — Perbaikan Filter Tabel Saat Quick-Jump Dipilih
- Change:
  - Saat item ikan pada dropdown pencarian global diklik, `query` diset ke `item.name` (bukan dikosongkan).
  - Tabel utama otomatis beralih ke periode asal ikan tersebut dan memfilter baris sesuai nama ikan yang dipilih sehingga user langsung melihat data ikan tersebut.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `56de962`.

## 2026-11-10 — Perbaikan Mobile Touch Race Condition pada Quick-Jump Dropdown
- Change:
  - Mengubah event handler dari `onClick` ke `onMouseDown` dengan `e.preventDefault()` pada item dropdown pencarian di sidebar.
  - Mencegah input search kehilangan fokus (blur) duluan saat disentuh di perangkat mobile, sehingga perpindahan periode (`activePeriodId`) dan penutupan sidebar (`setSidebarOpen(false)`) tereksekusi dengan sempurna.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `330ce22`.

## 2026-11-10 — Global Search Quick-Jump Dropdown di Sidebar
- Change:
  - Menambahkan dropdown autocomplete interaktif pada search bar sidebar.
  - Saat user mengetik nama ikan atau owner, muncul daftar rekomendasi ikan dari seluruh periode beserta thumbnail, owner, dan badge nama periode.
  - Ketika salah satu item diklik, aplikasi otomatis berpindah ke periode asal ikan tersebut (`activePeriodId`) dan menampilkan data terkait.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `d956540`.

## 2026-11-10 — Global Search di Sidebar
- Change:
  - Menambahkan input pencarian global di sidebar (tepat di bawah menu Rekap Ikan).
  - Mengaktifkan pencarian lintas seluruh periode saat user mengetik di sidebar search.
  - Menampilkan badge nama periode pada setiap baris hasil pencarian global serta otomatis berpindah ke periode asal saat ikan diedit atau dipratinjau.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `aef064e`.

## 2026-11-10 — Indikator jumlah data di kartu Data & Backup
- Change:
  - Menambahkan informasi "Jumlah Periode" dan "Total Record Ikan" secara real-time pada kartu Setting > Data & Backup.
  - Membantu user mengetahui volume data yang tersimpan sebelum melakukan eksekusi backup atau impor.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `c1019c1`.

## 2026-11-10 — Validasi data impor lebih ketat
- Change:
  - Menambahkan fungsi `validateBackup()` yang memvalidasi 3 level: root structure, setiap period, dan setiap fish record.
  - Root: cek `periods` ada, bertipe array, tidak kosong.
  - Period: cek field wajib `id`, `name`, `owner`, `certificate`, `query` (string), `sort` (harus 'name'|'owner'|'total'), `records` (array).
  - Record: cek `id` (number), `name`, `owner`, `image`, `tc` (string), `rupiah`, `feePercent`, `shipping` (number), `yen`/`rate` (number atau null), `certificate` (boolean).
  - Pesan error spesifik menunjuk ke periode/record mana yang bermasalah dan field apa yang salah.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `597880f`.

## 2026-11-10 — Konfirmasi dialog sebelum impor backup data
- Change:
  - Menambahkan dialog konfirmasi sebelum data backup ditimpa ke aplikasi. Sebelumnya, impor langsung menimpa data tanpa konfirmasi.
  - Flow baru: pilih file → parse & validasi → tampilkan dialog konfirmasi (menampilkan jumlah periode dan nama periode dari backup) → user klik "Timpa Data" atau "Batal".
  - Backup sekarang hanya berisi data rekap ikan (periods + activePeriodId). Profil (username, title, avatar) dihapus dari export dan import karena itu setting personal, bukan data kerja.
  - Menambahkan state `pendingImport` untuk menyimpan data sementara sebelum dikonfirmasi.
  - Fungsi `confirmImportBackup` menerapkan data hanya setelah user konfirmasi.
  - Dialog menggunakan pattern `confirm-dialog` yang sama dengan dialog hapus, icon Database, tombol destructive "Timpa Data".
  - `pendingImport` ditambahkan ke `hasActiveModal` untuk lock background scroll.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), committed & pushed `58dfb40`.

## 2026-11-10 — Fix patah-patah scroll tab periode
- Change:
  - Menghapus `behavior: 'smooth'` dari `container.scrollBy()` di wheel event handler tab periode.
  - Penyebab: setiap wheel event memicu animasi smooth baru yang saling tumpuk, menyebabkan scroll tersendat.
- Files: `src/App.tsx`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0).

## 2026-11-09 — Force Animation & Overflow Override on Workspace & Preferences Labels on Refresh
- Change:
  - Menambahkan modifier `!important` pada properti `animation`, `overflow`, dan `height` untuk `.workspace-label` dan `.settings-label` di `src/Sidebar.css`. Ini memastikan aturan layout dasar `.nav-label` (seperti `overflow: hidden` dan pembatasan tinggi) tidak menimpa animasi `sectionFadeIn` saat halaman dimuat atau direfresh.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Apply `sectionFadeIn` Animation to Workspace & Preferences Labels in Sidebar
- Change:
  - Mengubah animasi pada label `.workspace-label` dan `.settings-label` di `src/Sidebar.css` menggunakan keyframe `sectionFadeIn` (`0.45s cubic-bezier(.22,1,.36,1)` dengan transisi *fade*, *translateY*, dan *blur*), persis seperti animasi judul dan sub-teks halaman utama (*Kelola data ikan, harga, dan dokumen pemilik*).
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Ensure Consistent Font Size for Workspace & Preferences Labels in Collapsed Sidebar
- Change:
  - Menambahkan `font-size: 9px !important` pada state sidebar collapsed untuk `.workspace-label` dan `.settings-label` di `src/Sidebar.css` guna memastikan ukuran font tetap konsisten dan tidak berubah-ubah saat sidebar ditutup maupun dibuka.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Fix Text Overflow on Workspace & Preferences Labels When Sidebar is Collapsed
- Change:
  - Menambahkan aturan `.app .sidebar.sidebar-collapsed .workspace-label` dan `.settings-label` dengan `overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;` agar saat sidebar ditutup (*collapsed*), teks label terpotong rapi di dalam batas lebar sidebar dan tidak meluber keluar.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Restore Divider Lines on Workspace & Preferences Labels with Entrance Animation
- Change:
  - Mengembalikan pseudo-element `::before` pada `.workspace-label` dan `.settings-label` dengan animasi `lineSlideIn` (`scaleX(0)` ke `scaleX(1)`) sehingga garis pembatas kembali muncul dengan animasi masuk yang mulus dan dramatis.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Enhance Sidebar Entrance Animations to be More Prominent & Visible
- Change:
  - Membuat animasi masuk (*entrance animations*) di sidebar jauh lebih menonjol, jelas, dan dramatis dengan keyframe kustom `sidebarItemFadeIn` (pergeseran horizontal `-35px`, efek blur awal, durasi `0.5s`) serta keyframe garis `lineSlideIn` (`scaleX(0)` ke `scaleX(1)`) dengan jeda waktu (*staggered delays*) terstruktur untuk setiap komponen sidebar.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Fix Text & Line Animation for Workspace & Preferences Labels in Sidebar
- Change:
  - Menambahkan `display: block` dan `overflow: visible` pada `.workspace-label` dan `.settings-label` di `src/Sidebar.css` agar properti `transform` pada animasi `fadeSlideLeft` dapat diterapkan dengan sempurna pada elemen teks (*span*), sehingga teks "WORKSPACE" dan "PREFERENCES" beserta garis pemisah animasinya kini tampil dengan animasi masuk bertahap yang mulus.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Enable Block Display for Workspace & Preferences Labels to Ensure Text Animation Works
- Change:
  - Menambahkan `display: block` pada `.workspace-label` dan `.settings-label` di `src/Sidebar.css` agar properti `transform` pada animasi `fadeSlideLeft` dapat berfungsi secara optimal pada elemen teks (*span*), sehingga teks "WORKSPACE" dan "PREFERENCES" kini bergerak masuk dengan mulus.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Add Entrance Animation to Divider Lines of Workspace & Preferences Labels
- Change:
  - Memisahkan garis pembatas border atas pada `.workspace-label` dan `.settings-label` menjadi pseudo-element `::before` dengan animasi `slideIndicator`, sehingga garis pemisah maupun teks label muncul dengan animasi masuk bertahap yang selaras di sidebar.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Comprehensive Staggered Animations for All Sidebar Components
- Change:
  - Menerapkan animasi masuk bertahap (*staggered entrance animations*) `fadeSlideLeft` secara menyeluruh pada **semua** komponen yang ada di dalam sidebar secara berurutan: `.sidebar-header`, `.workspace-label`, `.sidebar-nav` (menu utama), `.settings-label`, `.sidebar-nav` (menu setting), `.mobile-theme-toggle-wrap` (toggle mode di mobile), dan `.sidebar-bottom` (kartu profil).
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Restore Sidebar Entrance Staggered Animations on Page Load / Refresh
- Change:
  - Menghapus aturan `animation: none !important` pada elemen sidebar di `src/Sidebar.css` dan mengaktifkan kembali animasi masuk bertahap (`fadeSlideLeft` dengan *staggered delays*) untuk logo/brand sidebar, label workspace, navigasi menu, label setting, dan kartu profil di bawah.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Restore Theme Toggle in Mobile Sidebar While Keeping It Hidden on PC
- Change:
  - Mengembalikan visibilitas toggle mode di sidebar khusus untuk mobile view (`@media(max-width:700px)`), sementara di tampilan web PC tetap tersembunyi (`display: none` secara default).
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Make Period Tab Wheel-to-Scroll Smooth and Fluid
- Change:
  - Memperhalus animasi pergeseran *wheel-to-scroll* pada tab periode dengan menggunakan `container.scrollBy({ left: e.deltaY * 0.75, behavior: 'smooth' })`, memberikan efek transisi gulir yang lembut dan responsif.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Replace Drag-to-Scroll with Wheel-to-Scroll on Period Tabs (PC)
- Change:
  - Mengganti interaksi *drag-to-scroll* pada container `.period-tabs` dengan *wheel-to-scroll*: pengguna PC cukup memutar roda mouse (`scroll wheel`) di atas barisan tab periode untuk menggeser tab secara horizontal dengan mulus.
- Files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Fix PC Sidebar Theme Toggle Visibility & Robust Period Tab Scrolling
- Change:
  - Memperbaiki visibilitas toggle mode di sidebar: menyembunyikan `.mobile-theme-toggle-wrap` secara default di PC (`display: none`) dan hanya menampilkannya saat mode mobile (`@media(max-width:700px)`).
  - Menyempurnakan fitur auto-scroll tab aktif ke kiri (menggunakan `requestAnimationFrame` dan penyesuaian posisi `offsetLeft`) serta drag-to-scroll pada tab periode di PC menggunakan koordinat `e.clientX`.
- Files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Auto-scroll Active Period Tab to Left + Drag-to-Scroll Period Tabs on PC
- Change:
  - Menambahkan `periodTabsContainerRef` pada container `.period-tabs` dan `useEffect` auto-scroll: saat tab periode diklik, container otomatis scroll horizontal sehingga tab aktif bergeser ke posisi paling kiri (berlaku mobile & PC).
  - Menambahkan `useEffect` drag-to-scroll pada `.period-tabs` di PC: user bisa klik-tahan lalu geser mouse horizontal untuk melihat tab yang overflow. Cursor berubah menjadi `grab`/`grabbing` sebagai indikator visual.
- Files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0).

## 2026-11-09 — Make Mobile Workspace Topbar Positioned Fixed (`position: fixed`)
- Change:
  - Mengubah posisi `.workspace-topbar` pada mobile view (`max-width: 700px`) dari `position: sticky` menjadi `position: fixed` (`top: 0; left: 0; right: 0; z-index: 50`) dan menambahkan `padding-top: 54px` pada `.workspace-main`. Ini memastikan topbar benar-benar membeku (*frozen*) di atas layar dan tidak pernah melompat atau berubah posisi saat membuka modal popup maupun sidebar di perangkat mobile.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Refine Mobile Scroll Lock to Prevent Sticky Topbar Reset
- Change:
  - Menyederhanakan penanganan scroll lock modal/sidebar di mobile kembali menggunakan `overflow: hidden` disertai `window.scrollTo(0, scrollY)` saat aktif dan cleanup untuk memastikan posisi scroll dan topbar tetap stabil di tempatnya.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Fix Mobile Scroll Jump / Reset When Opening Modals or Sidebar
- Change:
  - Mengubah implementasi penguncian scroll background di mobile (`useEffect`) dari sekadar `overflow: hidden` menjadi teknik `position: fixed` dengan `top: -scrollY` yang mengunci posisi gulir persis di tempat saat modal atau sidebar dibuka, serta memulihkan posisi scroll secara presisi saat ditutup. Ini mencegah topbar melompat/kembali ke posisi semula di perangkat mobile.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Implement Comprehensive Mobile View Animations (Stagger, Touch Feedback, Sidebar Entrance)
- Change:
  - Menambahkan animasi *staggered entrance* untuk halaman inventaris dan panel filter di mobile view.
  - Menambahkan animasi *stagger* urutan kemunculan item di dalam sidebar drawer saat dibuka.
  - Menambahkan efek tekan sentuh aktif (`:active` press scale `0.98`) pada tombol, tab, dan kartu di mobile view.
  - Mendukung `prefers-reduced-motion` untuk aksesibilitas gerak.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Hide Topbar Theme Toggle Correctly on Mobile View (.scene-toggle class)
- Change:
  - Memperbaiki selector CSS pada mobile view (`max-width: 700px`) menjadi `.workspace-topbar .scene-toggle { display: none !important; }` agar toggle di topbar mobile benar-benar tersembunyi (sebelumnya salah menargetkan `.theme-toggle`).
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Increase Mobile Theme Toggle Margin to 13px for Ideal Spacing
- Change:
  - Meningkatkan margin atas `.mobile-theme-toggle-wrap` pada mobile view menjadi `13px` agar jarak dengan menu Setting lebih pas dan proporsional.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Adjust Mobile Theme Toggle Margin to Prevent Overlap with Setting Menu
- Change:
  - Mengubah margin atas `.mobile-theme-toggle-wrap` pada mobile view dari `-3px` menjadi `8px` agar ada jarak yang pas dan tidak bertabrakan dengan menu Setting.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Swap Mobile Theme Toggle Order (Text Left, Toggle Right)
- Change:
  - Mengubah posisi teks "Ubah Tampilan" ke sebelah kiri dan tombol toggle ke sebelah kanan pada sidebar mobile view, dengan layout `justify-content: space-between` dan tetap mepet di bawah menu Setting.
- Files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Raise Mobile Theme Toggle Position Even Higher Under Setting Menu
- Change:
  - Mengubah margin atas `.mobile-theme-toggle-wrap` pada mobile view menjadi `-3px` agar posisinya semakin naik dan benar-benar mepet tepat di bawah menu Setting.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Adjust Mobile Theme Toggle Position in Sidebar Closer to Setting Menu
- Change:
  - Mengurangi margin atas `.mobile-theme-toggle-wrap` pada mobile view menjadi `4px` agar posisi toggle dan teks "Ubah Tampilan" naik hampir mepet tepat di bawah menu Setting.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Refine Mobile Theme Toggle Layout in Sidebar (Borderless, Left Toggle / Right Label)
- Change:
  - Mengubah tampilan toggle mode di sidebar khusus mobile view menjadi tanpa kotak (border/background dihapus), dengan posisi toggle di kiri dan teks "Ubah Tampilan" di sebelah kanannya, tepat di bawah menu Setting.
- Files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Move Theme Toggle to Sidebar Exclusively for Mobile View
- Change:
  - Memindahkan `ThemeToggle` dari topbar ke dalam sidebar khusus pada mobile view (`max-width: 700px`), sedangkan tampilan PC tetap tidak berubah.
- Files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Restore "Tambah Ikan" Text with Stacked Icon/Text Layout on Mobile View
- Change:
  - Pada tampilan mobile (`max-width: 600px`), tombol tambah ikan (`.heading-actions .primary-btn`) diubah dari kotak ikon saja menjadi tombol dengan ikon plus di atas dan teks "Tambah ikan" di bawahnya (stacked layout), memberikan ruang teks yang leluasa tanpa mengubah tampilan PC.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Fix Period Tabs Indicator Position in Mobile View (CSS Specificity Order)
- Change:
  - Memindahkan override aturan `@media(max-width: 700px)` untuk `.period-tabs-indicator` (`bottom: 2px !important`) ke bagian paling akhir file `src/App.css` agar aturan prioritas CSS tidak tertimpa oleh definisi global. Kini garis indikator biru berada di dalam kotak tab periode secara presisi.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Prevent Mobile Touch Background Scrolling When Sidebar or Modals Are Open
- Change:
  - Menambahkan listener `touchmove` dengan `{ passive: false }` pada efek penguncian dokumen saat sidebar atau popup modal aktif. Sentuhan/geseran di luar elemen sidebar atau dialog modal kini diblokir via `e.preventDefault()`, sehingga halaman utama benar-benar terisolasi dan tidak bisa digulir di perangkat mobile (iOS/Android).
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.
- Change:
  - Pada tampilan mobile (`max-width: 700px`), properti `html` diatur ke `overflow-y: auto` dan `body`, `#root` menggunakan `min-height: auto`. Dengan demikian, scrollbar vertikal hanya akan muncul jika konten/tabel memang melebihi tinggi layar; jika konten sedikit dan muat di layar, tidak ada scrollbar atau scrolling yang muncul.
- Files: `src/index.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Remove Forced Minimum Height for Mobile View to Prevent Unnecessary Scrolling
- Change:
  - Mengubah `.workspace-layout` pada mobile view (`max-width: 700px`) dari `min-height: calc(100vh - 78px)` menjadi `min-height: auto`. Halaman kini hanya akan memanjang dan memunculkan scroll vertikal jika isi konten/tabel memang melebihi tinggi layar.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Set Period Tabs Indicator Bottom to 34px in Mobile View
- Change:
  - Menyesuaikan posisi garis indikator biru pada tab periode (`.period-tabs-indicator`) di mobile view menjadi `bottom: 34px !important`.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Adjust Period Tabs Indicator Position Slightly Down in Mobile View
- Change:
  - Menyesuaikan posisi garis indikator biru pada tab periode (`.period-tabs-indicator`) di mobile view menjadi `bottom: 36px !important` agar turun sedikit secara proporsional.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Position Period Tabs Indicator Above the Tab Box in Mobile View
- Change:
  - Mengembalikan posisi garis indikator biru pada tab periode (`.period-tabs-indicator`) ke atas kotak tab periode (`bottom: 38px !important`) sesuai permintaan.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Place Period Tabs Indicator Inside the Tab Box in Mobile View
- Change:
  - Pada tampilan mobile (`max-width: 700px`), posisi garis indikator biru pada tab periode (`.period-tabs-indicator`) disetel ke `bottom: 1px` sehingga posisinya berada di dalam kotak tab periode.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Adjust Period Tabs Indicator Position in Mobile View
- Change:
  - Pada tampilan mobile (`max-width: 700px`), posisi garis indikator biru pada tab periode (`.period-tabs-indicator`) diturunkan sedikit (`bottom: 33px`) agar pas dan selaras.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Increase Add Button Margin Top on Mobile View
- Change:
  - Pada tampilan mobile (`max-width: 700px`), margin atas tombol "+ Tambah Ikan" (`.heading-actions`) ditingkatkan lagi (`margin-top: 18px`) agar posisinya turun lebih dekat ke area tabel.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Push Add Button Down in Mobile View
- Change:
  - Pada tampilan mobile (`max-width: 700px`), margin atas tombol "+ Tambah Ikan" (`.heading-actions`) ditingkatkan (`margin-top: 12px`) agar posisinya turun lebih ke bawah mendekati area tabel.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Left-Align Mobile Header Title and Subtitle
- Change:
  - Pada tampilan mobile (`max-width: 700px`), kontainer judul dan subtitle header (`.heading-copy`, `h1`, `p`) diatur secara eksplisit menjadi rata kiri (`text-align: left`).
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Refine Mobile Header: Prevent Subtitle Truncation and Shift Add Button to Right Near Table
- Change:
  - Pada tampilan mobile (`max-width: 700px`), properti `white-space: nowrap` dan ellipsis pada subtitle (`.heading-copy p`) dihapus agar teks lengkap terbaca tanpa terpotong `...`. Posisi tombol "+ Tambah Ikan" (`.heading-actions`) dipindah ke sisi kanan (`justify-content: flex-end`) dan diturunkan sedikit (`margin-top: 6px`) agar posisinya merapat ke tabel. Tampilan PC tetap utuh dan stabil.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Refine Mobile Header & Add Button Layout
- Change:
  - Pada tampilan mobile (`max-width: 700px`), deskripsi "Kelola data ikan, harga, dan dokumen pemilik" diatur menjadi 1 baris (`white-space: nowrap`), tombol "+ Tambah Ikan" disesuaikan ukurannya agar proporsional seperti versi PC (tidak memenuhi layar) dan diletakkan lebih ke bawah dekat dengan tabel dengan jarak rapat. Tampilan PC tetap utuh dan stabil.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Fix Mobile Header Layout (Title on Top, Full-Width Add Button with Side-by-Side Icon & Text Below)
- Change:
  - Pada tampilan mobile (`max-width: 700px`), header halaman (`.page-heading`) diatur secara vertikal di mana judul & deskripsi ("Rekap Pembelian Ikan Jepang") berada di atas, dan tombol "+ Tambah Ikan" berada di bawahnya dengan lebar penuh (`width: 100%`) serta ikon plus di samping teks (horizontal inline, bukan ditumpuk). Tampilan PC tetap utuh dan fix seperti semula.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Reorder Grand Total Box Above Owner Summary on Mobile View
- Change:
  - Pada tampilan mobile (`max-width: 700px`), posisi footer dibalik menggunakan `flex-direction: column-reverse` sehingga kotak grand total berada di atas dan teks rangkuman owner berada di bawahnya (tampilan PC tetap tidak berubah).
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Center-align Owner Summary on Mobile View Only
- Change:
  - Mengembalikan tampilan PC ke kondisi semula tanpa perubahan (tetap fix seperti sebelumnya).
  - Mengatur teks rangkuman owner dan jumlah data agar rata tengah secara khusus pada tampilan mobile (`max-width: 700px`).
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.
- Change:
  - Mengatur teks rangkuman owner dan jumlah data (`.owner-summary` / "Owner: ... · Menampilkan ... data") menjadi rata tengah (`text-align: center`, `justify-content: center`) di bagian footer tabel rekap ikan.
- Files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Konsistensi Styling Tombol Close (X) pada Sidebar Mobile
- Change:
  - Memperbarui gaya tombol tutup (`.sidebar-close`) di sidebar mobile agar memiliki ukuran 38x38px, latar belakang panel, border linier, radius sudut 8px, serta efek hover biru yang konsisten dengan tombol aksi panel lainnya.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Disable Sidebar Brand Button & Styling on Mobile View
- Change:
  - Pada tampilan mobile (`max-width: 700px`), area logo/brand di bagian atas sidebar diubah menjadi header statis (non-interaktif): menghilangkan border, background, shadow, pointer-events, dan hover effect karena fungsi *collapse* tidak diperlukan di mobile.
  - Tampilan PC tetap berfungsi normal sebagai tombol *collapse*.
- Files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Edge Swipe Gesture untuk Sidebar Mobile & Clean Topbar
- Change:
  - Menghapus tombol hamburger (`mobile-nav-toggle`) dari topbar mobile agar tampilan topbar menjadi bersih dan tidak penuh.
  - Menambahkan dukungan **edge swipe gesture** (`touchstart` / `touchend` di layar `<= 700px`):
    - Geser dari tepi kiri layar (`< 35px`) ke kanan (`> 60px`) untuk membuka sidebar.
    - Geser ke kiri saat sidebar terbuka untuk menutup sidebar.
  - Tampilan PC tetap utuh dan tidak terpengaruh.
- Files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Optimalisasi Responsive Mobile pada Halaman Setting
- Change:
  - Menambahkan aturan CSS responsif (`.settings-actions-grid` dan `.account-actions-grid`) dengan breakpoint `max-width: 500px`.
  - Pada layar kecil (ponsel), tombol aksi ekspor/impor dan tombol-tombol manajemen akun otomatis menyusun diri menjadi 1 kolom penuh agar tidak berjejalan atau terpotong.
- Files: `src/App.tsx`, `src/App.css`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0).

## 2026-11-09 — Compress Gambar Ikan via Canvas agar Ikut Backup JSON
- Change:
  - Modifikasi `fileChange` di `FishForm`: gambar yang di-upload user sekarang di-resize maks 320px dan di-compress ke JPEG quality 0.8 via Canvas sebelum disimpan ke state.
  - Hasil berupa base64 string yang otomatis tersimpan di `FishRecord.image`, sehingga ikut ter-backup dan ter-restore lewat fitur Ekspor/Impor JSON.
- Files: `src/App.tsx`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0).

## 2026-11-09 — Hapus Fitur Reset Data & Tambah Entrance Animation Halaman Setting
- Change:
  - Menghapus tombol **Reset ke Data Default** beserta handler-nya dari kartu Data & Backup untuk mencegah risiko kehilangan data.
  - Menambahkan **entrance animation** halus di halaman Setting:
    - Heading fade-in dari bawah (0.35s).
    - Kartu-kartu muncul berurutan (*staggered*) dengan delay 70ms antar kartu (fade-in + translateY 12px, durasi 0.4s).
  - Animasi menggunakan `cubic-bezier(.22,1,.36,1)` dan otomatis nonaktif pada `prefers-reduced-motion`.
- Files: `src/App.tsx`, `src/App.css`
- Verification: `npm run lint` & `npm run build` sukses (exit code 0), `git diff --check` bersih.

## 2026-11-09 — Mengubah Bagian "Data & Backup" Menjadi Fitur Siap Produksi (Production-Ready)
- Change:
  - Mengubah kartu **Data & Backup** di menu Setting menjadi fungsional penuh layaknya aplikasi produksi nyata:
    - **Ekspor JSON**: Mengunduh seluruh data workspace (periods, records, kredensial profil) dalam format file `.json` dengan penanda waktu.
    - **Impor Data**: Memulihkan data workspace secara instan dari file JSON backup yang diunggah.
    - **Reset ke Data Default**: Mengembalikan workspace ke kondisi awal dengan konfirmasi keamanan.
    - **Indikator Sistem**: Informasi penyimpanan lokal (LocalStorage), status backup terakhir, dan indikator enkripsi Secure 256-bit.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Memperjelas Tampilan Badge Ikon Kamera pada Avatar Profil
- Change:
  - Mengubah latar belakang badge ikon kamera di pojok kanan bawah avatar profil menjadi biru terang (`#2563EB`) dengan ikon putih bersih (`#FFFFFF`), ukuran sedikit lebih besar (20px), serta tambahan *drop shadow* dan border panel agar terlihat sangat kontras dan jelas pada tema terang maupun gelap.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Menambahkan Transisi Keluar (`closeWithAnimation`) pada Modal Akun & Akses
- Change:
  - Mengintegrasikan fungsi transisi keluar (`closeWithAnimation`) pada semua modal Akun & Akses (Username, Password, Title, Avatar) saat ditutup, dibatalkan, maupun disimpan. Ini menyamakan animasi transisi *fade-out / slide-out* agar konsisten dengan modal-modal lain di aplikasi.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Mengoptimalkan Kompresi & Resizing Gambar Avatar untuk Menghilangkan Lag Saat Save Modal
- Change:
  - Menambahkan proses kompresi & resizing gambar avatar (maks. 160px JPEG kualitas 0.85 via Canvas) saat diunggah. Ini mencegah pembengkakan ukuran string base64 yang sebelumnya menyebabkan jeda (freeze) pada main-thread saat menyimpan, sehingga modal ganti avatar kini langsung tertutup secara instan dan responsif.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Memperbarui Teks Deskripsi Kartu "Akun & Akses" di Setting
- Change:
  - Mengubah teks sub-heading pada kartu **Akun & Akses** dari *"Profil pengguna, kredensial, dan hak akses."* menjadi *"Ubah profil username, password, title, dan avatar."*
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Memperbaiki Prioritas CSS Hover (`!important`) pada Tombol Aksi "Akun & Akses"
- Change:
  - Menambahkan modifier `!important` pada properti warna teks dan border saat `:hover` pada `.settings-action.secondary` untuk memastikan animasi hover teks & border biru langsung aktif tanpa terhalang gaya inline.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Menambahkan Animasi Hover (Teks & Border Berubah Biru) pada Tombol Aksi "Akun & Akses"
- Change:
  - Menambahkan efek hover halus pada tombol aksi di menu Setting ("Akun & Akses"): saat kursor menyentuh tombol, teks dan border berubah menjadi warna biru (`var(--blue)`), dengan efek elevasi ringan (`transform: translateY(-1px)`) dan shadow lembut.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Memberikan Warna Kustom & Badge Berlatar Belakang pada Ikon Aksi "Akun & Akses"
- Change:
  - Menambahkan warna tematik kustom untuk setiap ikon aksi di menu Setting ("Akun & Akses"):
    - **Ubah Username**: Ikon Biru (`#3B82F6`) dengan badge latar belakang transparan.
    - **Ubah Password**: Ikon Amber/Oranye (`#F59E0B`) dengan badge latar belakang transparan.
    - **Ubah Title**: Ikon Ungu (`#8B5CF6`) dengan badge latar belakang transparan.
    - **Ubah Avatar**: Ikon Hijau Emerald (`#10B981`) dengan badge latar belakang transparan.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Menambahkan Ikon Panah Kanan (`ChevronRight`) pada Tombol Aksi "Akun & Akses"
- Change:
  - Menambahkan ikon panah kanan (`ChevronRight`) di sisi kanan setiap tombol aksi (Ubah Username, Ubah Password, Ubah Title, Ubah Avatar) untuk memberikan kesan navigasi yang interaktif.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Redesign Tampilan Menu Setting "Akun & Akses" Menjadi Lebih Elegan & Modern
- Change:
  - Mendesain ulang kartu **Akun & Akses** dengan banner profil gradien, badge Admin, dan avatar 50px dengan indikator kamera interaktif.
  - Mengganti tombol aksi biasa dengan tombol berikon tematik (`User`, `Key`, `Shield`, `Camera`) dalam grid 2 kolom yang rapi dan responsif.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Menambahkan Fitur Ganti Avatar di Menu Setting (Akun & Akses)
- Change:
  - Menambahkan menu dan tombol **Ubah Avatar** di kartu **Akun & Akses** pada menu **Setting**.
  - Menambahkan dialog modal upload foto avatar (mendukung JPG/PNG hingga 10MB) beserta opsi reset/hapus avatar.
  - Menyimpan avatar di `localStorage` (`fish-avatar`) dan merender avatar kustom di sidebar, kartu profil setting, serta dialog profil admin.
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Refactor Menu Setting Akun & Akses (Profil Card & Modal Ubah Username, Password, Title)
- Change:
  - Menambahkan profil card di menu Setting (Akun & Akses) yang menampilkan avatar, username, dan title aktif.
  - Menambahkan tombol aksi terpisah: **Ubah Username**, **Ubah Password**, dan **Ubah Title**.
  - Menambahkan dialog modal interaktif untuk masing-masing aksi perubahan data akun & title.
  - Menyimpan title akun di `localStorage` (`fish-title`).
- Verification:
  - `npm run lint` & `npm run build` sukses (exit code 0).
  - Git diff check bersih.

## 2026-11-09 — Menambahkan Fitur Ubah Username & Password di Menu Setting (Akun & Akses)
- Change:
  - Memperbarui `SettingsPanel` di `src/App.tsx` dengan menambahkan form input untuk mengubah username dan password akun (default `adelia` / `adelia`), serta menyimpan perubahan ke `localStorage` dan menampilkan notifikasi toast.
- Verification: `npm run lint` & `npm run build` sukses (exit code 0); perubahan telah di-commit & di-push ke GitHub.

## 2026-11-09 — Mengubah `overflow-y: hidden` pada `.table-wrap`
- Change:
  - Memperbarui `src/App.css` pada `.table-wrap` dengan menetapkan `overflow-x: auto; overflow-y: hidden;` agar tidak ada scrollbar vertical di dalam tabel, sementara tabel tetap fleksibel memanjang ke bawah dan scroll horizontal tetap aktif untuk layar sempit.
- Verification: `npm run lint` & `npm run build` sukses (exit code 0); perubahan telah di-commit & di-push ke GitHub.

## 2026-11-09 — Menghapus Scroll Vertikal Tabel & Membuat Tabel Memanjang ke Bawah
- Change:
  - Memperbarui `.table-wrap` di `src/App.css` dari `overflow: auto` menjadi `overflow-x: auto; overflow-y: visible;` agar scroll vertical di dalam tabel hilang dan tabel secara otomatis memanjang ke bawah mengikuti jumlah data.
- Verification: `npm run lint` & `npm run build` sukses (exit code 0); perubahan telah di-commit & di-push ke GitHub.

## 2026-11-09 — Menghapus Scrollbar Vertikal dari Sidebar
- Change:
  - Memperbarui `src/Sidebar.css` dengan mengubah properti `overflow-y: auto` dan `scrollbar-width: thin` menjadi `overflow: visible` pada `.app .sidebar` sehingga scrollbar vertikal di sidebar hilang sepenuhnya.
- Verification: `npm run lint` & `npm run build` sukses (exit code 0); perubahan telah di-commit & di-push ke GitHub.
- Change:
  - Menghapus path bulan sabit / crescent dari background `toggle-night-bg.svg` agar latar belakang darkmode benar-benar bersih dan hanya tombol geser (`.knob-moon`) yang menjadi representasi bulan.
- Verification: `npm run lint` & `npm run build` sukses (exit code 0).
- Change:
  - Membersihkan lingkaran bulan dari background `toggle-night-bg.svg` agar tidak terjadi duplikasi/dobelan dengan tombol geser (`.knob-moon`).
  - Menambahkan efek *glow* (`box-shadow`) yang elegan pada bola bulan (`.knob-moon`).
- Verification: `npm run lint` & `npm run build` sukses (exit code 0).
- Change:
  - Menyalin ulang `Group 1.svg` dan `Group 2.svg` dari folder referensi asli ke `public/toggle-day-bg.svg` dan `public/toggle-night-bg.svg` dengan hanya mengecualikan elemen bola matahari/bulan (sehingga seluruh awan kecil dan awan bawah tampil sempurna di light mode).
- Verification: `npm run lint` & `npm run build` sukses (exit code 0).
- Change:
  - Mengembalikan seluruh elemen awan pada `toggle-day-bg.svg`.
  - Menambahkan efek glow dan gradien khas pada bola matahari (`.knob-sun`).
  - Menambahkan detail elemen kawah bulan persis seperti file SVG asli pada bola bulan (`.knob-moon`).
- Verification: `npm run lint` & `npm run build` sukses (exit code 0).
- Change:
  - Memperbarui `src/ThemeToggle.css` menggunakan layout persetase responsif (`width: 27.73%`, `height: 80%`, `left: 3.46%`, dan `left: 68.81%` saat aktif) agar bola matahari/bulan proporsional, berada di dalam track toggle tanpa keluar batas, dan menyesuaikan ukuran wadah dengan sempurna di topbar maupun login form.
- Changed files: `src/ThemeToggle.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-09 — Menyempurnakan Transisi Theme Toggle Menjadi Sliding Sun/Moon & Cross-Fade Background
- Change:
  - Memperbarui komponen `ThemeToggle` (`src/ThemeToggle.tsx` dan `src/ThemeToggle.css`) serta memisahkan aset background (`public/toggle-day-bg.svg` & `public/toggle-night-bg.svg`) untuk menghasilkan transisi yang sesuai keinginan: bola matahari/bulan bergeser secara halus (`translateX(245px)` dengan `cubic-bezier(0.22, 1, 0.36, 1)`), matahari/bulan ber-cross-fade dan berotasi halus, serta latar belakang ber-cross-fade secara lembut (fade effect).
- Changed files: `src/ThemeToggle.tsx`, `src/ThemeToggle.css`, `public/toggle-day-bg.svg`, `public/toggle-night-bg.svg`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-09 — Mengganti Toggle Dark/Light Mode dengan Ilustrasi Day/Night (Clip-Path Reveal)
- Change:
  - Membuat komponen `ThemeToggle` baru (`src/ThemeToggle.tsx` + `src/ThemeToggle.css`) yang menampilkan ilustrasi SVG siang (matahari, awan, latar biru) dan malam (bulan, bintang, latar gelap) dengan animasi transisi clip-path circle reveal.
  - Mengganti tombol icon Moon/Sun di topbar (workspace header) dan login form dengan komponen ThemeToggle baru. Topbar pakai size 80px, login form 100px.
  - Menyalin file SVG referensi (`Group 1.svg` dan `Group 2.svg`) ke `public/toggle-day.svg` dan `public/toggle-night.svg`.
  - Menambahkan CSS selector `.workspace-topbar .scene-toggle` untuk layout margin-left auto.
  - Moon tetap diimport karena masih dipakai di Settings panel.
- Changed files: `src/ThemeToggle.tsx`, `src/ThemeToggle.css`, `src/App.tsx`, `src/App.css`, `public/toggle-day.svg`, `public/toggle-night.svg`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-09 — Mengganti Tanggal Cetak PDF dengan Nama Tab Aktif
- Change:
  - Mengubah fungsi ekspor PDF (`src/exportPdf.ts` dan `src/App.tsx`) untuk menggantikan teks "Tanggal Cetak: [tanggal]" pada header subtitle dokumen PDF dengan nama tab periode aktif yang sedang dibuka (contoh: "Periode 2026").
- Changed files: `src/exportPdf.ts`, `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Membuat Kotak Brand/Toggle Sidebar Penuh Warna Biru Saat Hover (Collapsed)
- Change:
  - Menambahkan aturan hover khusus pada `.app .sidebar.sidebar-collapsed .sidebar-brand:hover` di `src/Sidebar.css` agar ketika sidebar ditutup dan tombol brand di-hover, seluruh kotak brand berubah menjadi solid biru (`var(--blue)`) dengan ikon putih bersih.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menyamakan Animasi Toggle Sidebar dengan Tombol X (`.sidebar-close`)
- Change:
  - Memperbarui style ikon toggle sidebar (`.app .brand-toggle-icon`) di `src/Sidebar.css` mengikuti perilaku animasi tombol X (`.sidebar-close`): saat di-hover latar belakang berubah menjadi biru (`var(--blue)`), ikon berubah menjadi putih bersih (`#fff`), efek scale halus, dan *glow shadow* yang dinamis.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Mengubah Warna Corak Ikan Koi Menjadi Merah
- Change:
  - Memperbarui warna oranye (`#EF713A`, `#F4A261`, dll) pada SVG ikan koi di `src/App.tsx` menjadi warna merah cerah (`#DC2626`, `#F87171`, `#991B1B`).
- Changed files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menerapkan Animasi SVG Ikan Koi Hidup (Ekor Wagging & Gelembung)
- Change:
  - Mengganti ikon statis Lucide `Fish` pada tombol menu Rekap Ikan dengan struktur SVG kustom animasi ikan koi (menggunakan animasi ekor bergetar/wagging, gerakan renang naik-turun halus, serta gelembung air yang naik ke atas) sesuai referensi kode.
- Changed files: `src/App.tsx`, `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Mengganti Animasi Ikan dengan `fishGlideCrisp` (Clean Horizontal Glide)
- Change:
  - Mengganti animasi multi-transform yang memicu blur sub-pixel menjadi animasi geser horizontal murni (`translateX(0px)` ke `translateX(4px)`) dengan `ease-in-out` di `src/Sidebar.css` agar ikon ikan tetap tajam, crisp, dan tidak patah-patah (60 FPS bersih).
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Mengoptimalkan Animasi Renang Ikan Menjadi Multi-Waypoint (Organic & 60 FPS)
- Change:
  - Memperbarui `@keyframes fishSwimNatural` di `src/Sidebar.css` dengan 6 titik koordinat transisi multi-arah (variasi X, Y, rotasi, dan skala) dan `cubic-bezier` yang mulus, serta menambahkan `will-change: transform` dan `translateZ(0)` untuk akselerasi GPU murni (60 FPS tanpa patah-patah).
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menyempurnakan Animasi Renang Ikan (`fishSwim`) Menjadi Lebih Natural dan Halus
- Change:
  - Memperbarui `@keyframes fishSwim` di `src/Sidebar.css` dengan variasi sumbu `X`, `Y`, rotasi mikro, dan skala kecil (`scale`), serta memperlambat durasi animasi menjadi `4s` (dan `1.8s` saat di-hover) agar gerakan renang ikan tampak jauh lebih natural, organik, dan hidup.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menambahkan Efek Renang Lembut (`fishSwim`) pada Ikon Ikan Rekap Ikan
- Change:
  - Menambahkan keyframes `@keyframes fishSwim` dan aturan `.app .sidebar-link .lucide-fish` di `src/Sidebar.css` untuk memberikan efek animasi renang lembut (bergeser dan berotasi mikro) secara kontinyu, serta bergerak lebih aktif saat di-hover sehingga ikon ikan tampak hidup.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Membuat Tombol Toggle Sidebar Lebih Standout ("Heboh" & Menarik)
- Change:
  - Memperbarui style `.app .sidebar-brand` di `src/Sidebar.css` dengan latar panel lembut, border, shadow/glow halus, efek angkat (`translateY(-2px)`), serta transisi perbesaran ikon/logo saat di-hover agar tombol buka/tutup sidebar terlihat standout dan interaktif.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menambahkan Garis Pemisah (Divider) di Atas Tulisan WORKSPACE
- Change:
  - Menambahkan kelas `workspace-label` pada elemen label WORKSPACE di `src/App.tsx` serta mendefinisikan style dengan `border-top: 1px solid var(--line); padding-top: 15px;` di `src/Sidebar.css` agar terdapat garis pemisah rapi di atas tulisan WORKSPACE.
- Changed files: `src/App.tsx`, `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menurunkan Sedikit Posisi Tulisan WORKSPACE dan Menu Rekap Ikan
- Change:
  - Meningkatkan margin atas pada `.app .nav-label` di `src/Sidebar.css` dari `28px` menjadi `35px` sehingga label WORKSPACE dan menu Rekap Ikan di bawahnya bergeser sedikit ke bawah.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menggeser Posisi Tombol Toggle Sidebar Sedikit ke Atas
- Change:
  - Mengurangi padding atas pada `.app .sidebar` di `src/Sidebar.css` dari `22px` menjadi `15px` sehingga tombol buka/tutup sidebar (logo & brand header) bergeser sedikit ke atas secara proporsional.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Memperbaiki Animasi Close Popover Saat Sidebar Terbuka (`fadeSlideOutUp`)
- Change:
  - Menambahkan keyframes `@keyframes fadeSlideOutUp` di `src/Sidebar.css` dan menerapkannya pada `.app .profile-popover-menu.closing` saat sidebar terbuka agar animasi penutupan popover mengalir halus ke atas dan tidak lagi ngebug/berkedip.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menambahkan Animasi Tutup (`fadeSlideOutLeft`) untuk Popover Profil Collapsed
- Change:
  - Menambahkan keyframes `@keyframes fadeSlideOutLeft` di `src/Sidebar.css` dan menerapkannya pada `.app .sidebar.sidebar-collapsed .profile-popover-menu.closing` agar animasi saat menutup popover saat sidebar ditutup bergerak halus ke kiri (`translateX(-12px)` dengan `opacity: 0`).
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Mengubah Posisi Popover Profil Collapsed Menjadi Fixed di Luar Sidebar Utama
- Change:
  - Mengubah posisi `.app .sidebar.sidebar-collapsed .profile-popover-menu` di `src/Sidebar.css` menjadi `position: fixed; left: 88px; bottom: 24px; z-index: 9999;` agar popover melayang keluar dari batasan sidebar dan masuk ke area dashboard utama tanpa terpotong.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Memperbaiki Overflow Sidebar Agar Popover Menu Profil Tampil Saat Collapsed
- Change:
  - Mengubah properti `overflow: hidden` pada `.app .sidebar` di `src/Sidebar.css` menjadi `overflow-y: auto; overflow-x: visible;` sehingga popover profil yang diposisikan di sebelah kanan sidebar saat collapsed (`left: calc(100% + 12px)`) tidak terpotong (terklip) dan dapat diklik dengan sempurna.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Memindahkan Posisi Popover Profil ke Samping Saat Sidebar Collapsed
- Change:
  - Menambahkan aturan CSS pada `.profile-popover-menu` di `src/Sidebar.css`. Saat sidebar terbuka, popover tampil di atas kartu profil; saat sidebar ditutup (collapsed), popover dipindahkan ke sebelah kanan luar sidebar (`left: calc(100% + 12px)`) dengan animasi geser yang rapi.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Menyamakan Jarak Garis dan Teks PREFERENCES Saat Sidebar Collapsed
- Change:
  - Memperbaiki aturan padding pada `.sidebar.sidebar-collapsed .settings-label` di `src/Sidebar.css` agar jarak padding-top (15px) dan garis pemisah konsisten saat sidebar ditutup maupun dibuka.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Memperbaiki Visibilitas Label PREFERENCES di Sidebar
- Change:
  - Memperbaiki properti tinggi dan padding pada kelas `.settings-label` di `src/Sidebar.css` yang sebelumnya terpotong/hilang karena batasan `height: 12px` saat sidebar dibuka.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Memperbaiki Teks PREFERENCES di Sidebar
- Change:
  - Mengembalikan teks label `PREFERENCES` di `src/App.tsx` yang sebelumnya terpotong menjadi `PREFER...`.
- Changed files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Penyempurnaan Tampilan Sidebar Saat Collapsed
- Change:
  - Mempertahankan ukuran font dan padding asli teks workspace (`nav-label`) saat sidebar ditutup (tidak mengecil).
  - Mengatur ulang `justify-content: center` dan `gap: 0` pada link navigasi (`sidebar-link`) saat sidebar ditutup agar ikon (seperti ikon ikan) berada tepat di tengah kotak button menu.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses (exit code 0).

## 2026-11-07 — Mengatasi Pergeseran Vertikal 3 Komponen Sidebar Saat Toggle
- Change:
  - Mengunci metrik vertikal (tinggi, padding, margin, font-size) pada tombol brand (`sidebar-brand`), label workspace (`nav-label`), dan link navigasi (`sidebar-link`) agar 100% identik antara kondisi expanded dan collapsed.
  - Menggunakan transisi opacity/width alih-alih `display: none` atau perubahan ukuran padding vertikal yang memicu pergeseran posisi naik-turun pada elemen saat sidebar dibuka atau ditutup.
- Changed files: `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, `git diff --check` sukses (exit code 0).

## 2026-11-07 — Membangun Ulang Sidebar Expand/Collapse
- Change:
  - Mengganti header toggle menjadi tombol aksesibel terpisah dari tombol tutup drawer mobile.
  - Membuat ulang geometri sidebar dengan tinggi tetap untuk header, label, dan item navigasi; state collapsed hanya mengubah lebar dan visibilitas label, bukan posisi vertikal.
  - Memindahkan style sidebar ke `src/Sidebar.css` dan memuat stylesheet setelah style lama agar aturan baru menang dengan jelas.
- Changed files: `src/App.tsx`, `src/App.css`, `src/Sidebar.css`, `PROGRESS.md`
- Verification: `npm run lint`, `npm run build`, dan `git diff --check` sukses. Pemeriksaan visual browser belum dilakukan.

## 2026-11-07 — Perbaikan Bug Layar Blank Saat Login dan Logout
- Change:
  - Memperbaiki alur render state autentikasi (`isLoggedIn`) dan state tema (`theme`) pada komponen `App` agar konsisten dan terhindar dari ketidakcocokan hook efek DOM atau *unmount/remount* yang tidak sinkron, sehingga transisi antara halaman login dan dashboard tidak menghasilkan layar blank.
- Changed files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run lint` dan `npm run build` sukses tanpa error (exit code 0).

## 2026-11-07 — Menjaga Posisi Top Logo Sidebar Tetap Absolut 100% Stabil
- Change:
  - Memastikan tidak ada pergeseran vertikal pada logo/brand sidebar saat di-collapse.
- Changed files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run lint` dan `npm run build` sukses tanpa error (exit code 0).

## 2026-11-06 — Memperbesar Ukuran Logo pada Halaman Login
- Change:
  - Memperbesar ukuran logo pada header halaman login dari 56x56px menjadi 88x88px dengan radius dan jarak margin yang proporsional.
- Changed files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Penambahan Tombol Toggle Show/Hide Password pada Form Login
- Change:
  - Menambahkan tombol interaktif ikon mata (`Eye` / `EyeOff`) di dalam field password pada halaman login untuk memudahkan pengguna melihat atau menyembunyikan password saat diketik.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Redesain Header Halaman Login
- Change:
  - Menghapus teks "Onelito KOI" dan mengubah teks "Masuk ke Workspace" menjadi judul utama (`<h1>`) berukuran besar (menyamai ukuran teks sebelumnya).
- Changed files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Pembaruan Teks Subtitle Halaman Login
- Change:
  - Mengubah teks subtitle pada kartu login dari "Silakan masuk ke sesi workspace admin." menjadi "Masuk ke Workspace".
- Changed files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Penghapusan Istilah Prototipe dan Penyempurnaan UI Produksi
- Change:
  - Menghapus seluruh referensi istilah "prototipe" pada halaman login, badge system, dan menu setting, menggantinya dengan terminologi standar aplikasi produksi/enterprise.
- Changed files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Implementasi Sesi Login Prototipe
- Change:
  - Menambahkan halaman login prototipe (`LoginForm`) dengan input username (default `adelia`) dan password, penyimpanan status sesi via `localStorage`, serta fungsionalitas tombol "Keluar" untuk mengakhiri sesi.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Proporsi Padding Modal Profil
- Change:
  - Menyesuaikan padding bawah modal profil menjadi 24px agar jarak dari tombol "Tutup" ke bawah kotak modal sama persis dengan jarak samping kanan (24px).
- Changed files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Penyesuaian Posisi Tombol Tutup Modal Profil
- Change:
  - Menyelaraskan posisi tombol "Tutup" pada modal profil ke sisi kanan agar sejajar dengan batas kanan header text dan elemen kontainer.
- Changed files: `src/App.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Penyempurnaan Tombol Tutup pada Modal Profil
- Change:
  - Menghapus tombol silang (X) di bagian header modal "Profile Information" dan mempertahankan satu tombol "Tutup" di bagian pojok kanan bawah (`dialog-actions`).
- Changed files: `src/App.tsx`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Pembaruan Judul Tab Browser & Favicon Logo
- Change:
  - Mengubah judul tab browser menjadi **"Dashboard Onelito"** dan menyetel favicon menggunakan file logo vertikal (`Logo Onelito Vertical-02.png`).
- Changed files: `index.html`, `public/logo-vertical.png`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Implementasi Custom Scrollbar Halus & Minimalis
- Change:
  - Mengganti `scrollbar-gutter: stable` dengan custom scrollbar tipis (`width: 6px`) pada elemen `html` untuk mencegah pergeseran layout (*layout shift*) saat refresh/load tanpa menyisakan *gutter* kosong yang kaku.
- Changed files: `src/index.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Penyempurnaan Modal Profil & Animasi Transisi Halaman Setting
- Change:
  - Menyederhanakan modal "Profile Information" dengan avatar besar di tengah atas serta username (`adelia`) dan title (`Workspace Administrator`) dalam format baris sejajar yang bersih dan proporsional.
  - Menyamakan animasi transisi halaman Setting dengan menu Rekap Ikan menggunakan `tabContentSwitch` untuk pengalaman visual yang konsisten dan mulus.
- Changed files: `src/App.tsx`, `src/App.css`, `src/animations.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Implementasi Dialog Modal "Profil Admin Sistem" & Auto-Close Popover
- Change:
  - Menambahkan dialog modal "Profil Admin Sistem" lengkap dengan informasi akun, peran akses (Full Access), status sesi aktif, serta animasi masuk (`modalSlideUp`) dan keluar (`modalSlideOut`).
  - Mengimplementasikan penutupan popover secara otomatis saat pengguna mengklik di luar area profil (*outside click* di manapun pada halaman).
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Redesign Admin Profile Card ke Gradasi Biru, Interaktif Popover & Animasi Kotak
- Change:
  - Mengubah card admin sistem di sidebar menjadi card modern berlatar belakang gradasi biru gelap ke terang (`linear-gradient(135deg, #1b3a6b 0%, #3478f6 100%)`).
  - Menghapus titik tiga (`···`) dan menjadikan seluruh kotak card dapat diklik untuk membuka menu popover profil ("Lihat Profil" & "Keluar / Logout").
  - Menambahkan animasi scale saat disentuh kursor (`hover`) dan animasi tekan (`active`) pada seluruh kotak card gradasi, bukan pada inisial avatar.
  - Menambahkan animasi keluar (*exit animation*, `menuDropOut`) yang mulus saat popover menu ditutup.
- Changed files: `src/App.tsx`, `src/App.css`, `src/animations.css`, `PROGRESS.md`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Perubahan Teks Dropdown & Lebar Presisi Tab Periode

- Change: Mengubah teks tombol hapus pada dropdown tab periode dari "Hapus periode" menjadi "Hapus". Menyamakan lebar dan posisi dropdown menu persis dengan tab periode yang diklik (`rect.left` dan `rect.width`).
- Changed files: `src/App.tsx`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Perbaikan Layout Dropdown Menu Tab Periode (Absolute Position)

- Change: Memperbaiki tata letak dropdown menu tab periode (`period-tab-menu`):
  - Mengubah penempatan menu dari `position: fixed` dengan kalkulasi JS ke `position: absolute` di dalam kontainer `.period-tab` (`top: calc(100% + 4px); right: 0; width: 150px;`), serta memastikan `.period-tabs` memiliki `overflow-y: visible`.
  - Memastikan ukuran dan tinggi tombol di dalam menu dropdown tampil proporsional dan pas di bawah tab periode masing-masing.
- Changed files: `src/App.tsx`, `src/App.css`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Perbaikan Posisi Fixed Dropdown Menu Tab Periode

- Change: Memperbaiki posisi dropdown menu tab periode dengan mengembalikan rendering berbasis `position: fixed` dan kalkulasi bounding rect tombol titik tiga (`rect.left`, `rect.bottom + 6`), sehingga menu dropdown muncul tepat di bawah tombol tanpa terpotong `overflow: hidden` pada container tab.
- Changed files: `src/App.tsx`, `src/App.css`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Perbaikan Posisi & Ukuran Dropdown Menu Tab Periode

- Change: Memperbaiki kalkulasi posisi (`left`/`top`) dan lebar dropdown menu pada tab periode (`period-tab-menu`):
  - Mengganti basis referensi rect dari container tab ke tombol titik tiga (`period-tab-menu-trigger`), sehingga posisi menu dropdown tepat berada di bawah tombol aksi dan tidak bergeser.
  - Menetapkan lebar menu secara konsisten (160px) alih-alih menyamakan dengan lebar tab yang dinamis.
- Changed files: `src/App.tsx`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Perbaikan Toast Notification (Ukuran & Animasi Keluar)

- Change: Memperbaiki styling dan animasi toast notification di `src/animations.css`:
  - Mengubah max-width menjadi responsive (`min(90vw, 420px)`) dengan text-wrap (`word-break: break-word`) agar teks panjang seperti "PDF berhasil di-download" tidak terpotong atau terlalu melebar.
  - Menambahkan animasi exit (`toastSlideOut`) yang otomatis berjalan pada detik terakhir sebelum toast tertutup, dengan mempertahankan posisi center (`translateX(-50%)`).
- Changed files: `src/animations.css`
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).

## 2026-11-06 — Sistem Animasi Lengkap 30 Area

- Change: Menambahkan file `src/animations.css` berisi 30+ keyframes dan animation rules yang mencakup seluruh 30 area UI:
  - A. Page entrance: heading stagger, toolbar slide, table row stagger (12 rows), footer fade
  - B. Setting page: heading stagger, badge pop bounce, card stagger dengan blur
  - C. Breadcrumb fade-slide, period tabs enhanced (glow, elastic), tab menu drop-in, plus button rotate
  - D. Sidebar: brand float, nav indicator slide, link hover shift, profile card entrance, mobile enhanced
  - E. Modals: backdrop blur, form dialog slide-up + section stagger, confirm icon shake, image zoom, terms list stagger, period dialog
  - F. Buttons: primary lift+glow, secondary, PDF icon flip, row action scale, dialog close rotate, theme toggle rotate, search icon scale, settings buttons, cert toggle, upload box
  - G. Toast slide-in + progress bar, status dot pulse, empty state bounce, nav badge pop, grand total counter
  - H. Section transition fade+blur, table row hover highlight, settings card hover lift
- Changed files: `src/animations.css` (baru), `src/App.tsx` (import animations.css)
- Verification: `npm run build` sukses, `npm run lint` sukses (0 error)

## 2026-11-05 — Penyempurnaan Tampilan Tombol Brand Sidebar
- Change: Menghapus border dan latar mencolok pada tombol brand sidebar (`.sidebar-brand-btn`) sehingga menyatu bersih dengan background sidebar, serta menambahkan margin atas pada teks label `WORKSPACE` agar tidak bertumpuk/nabrak.
- Verification: `npm run build` dan `npm run lint` sukses tanpa error (exit code 0).
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` sukses tanpa error.

- Change: Membuat komponen `ThemeSwitchV2` (`theme-switch-v2.tsx`, `theme-switch-v2.css`) dengan pemisahan animasi yang presisi sesuai permintaan: background awan/bintang/langit menggunakan efek crossfade opacity, sementara knob bulat matahari dan bulan bergeser secara sliding horizontal. Mengintegrasikannya ke menu Setting (`src/App.tsx`).
- Changed files: `src/App.tsx`, `src/theme-switch-v2.tsx`, `src/theme-switch-v2.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` sukses tanpa error.

- Change: Ganti switch lama dengan artwork SVG terintegrasi: scene siang berawan dan matahari, scene malam dengan bulan, bintang, dan bukit berlapis. Terapkan visual serta rasio 154×54 konsisten di Setting dan topbar; tambah transisi silang yang reduced-motion aware.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan artwork SVG tampil pada dua lokasi dan mode Dark menampilkan scene malam. `npm run build`, `npm run lint`, `git diff --check`.

## 2026-11-02 — Samakan toggle mode di topbar dengan referensi
- Change: Ganti tombol ikon tema di pojok kanan atas dengan versi ringkas switch siang/malam yang sama seperti kartu Setting. Satu `ThemeSwitch` reusable menjaga state dan aksesibilitas konsisten.
- Changed files: `src/App.tsx`, `src/App.css`, `UI_DESIGN_GUIDELINES.md`, `PROGRESS.md`.
- Verification: Browser memastikan switch topbar berukuran ringkas, `aria-checked` berubah false ke true, dan tema aplikasi ikut berubah. `npm run build`, `npm run lint`, `git diff --check`.


## 2026-11-02 — Ubah kontrol Mode Tampilan mengikuti referensi
- Change: Ganti tombol Light/Dark menjadi switch ilustratif siang/malam dengan sun, awan, moon, bintang, state label, animasi tema, `role="switch"`, dan dukungan focus/reduced-motion. Topbar tetap berfungsi.
- Changed files: `src/App.tsx`, `src/App.css`, `UI_DESIGN_GUIDELINES.md`, `PROGRESS.md`.
- Verification: Browser memastikan switch mengubah label Light mode ke Dark mode dan `aria-checked` false ke true. `npm run build`, `npm run lint`, `git diff --check`.


## 2026-11-02 — Haluskan hover avatar akun
- Change: Kurangi gerak avatar dari 2px menjadi 1px, gunakan easing lembut 280ms untuk hover/warna/bayangan, dan kurangi scale saat ditekan. Hormati reduced motion.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, `git diff --check`.


## 2026-11-02 — Hover avatar akun saat sidebar ciut
- Change: Hapus indikator titik tiga. Avatar akun kini naik 2px dengan highlight saat hover, seperti tombol logo; active state menekan kembali. Label/tooltip akun tetap ada.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, `git diff --check`.


## 2026-11-02 — Perjelas ikon akun saat sidebar ciut
- Change: Saat sidebar ciut, tambahkan indikator elipsis pada avatar akun dan hover/focus outline. Tambahkan label aksesibel serta tooltip “Menu akun”.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan indikator elipsis tampil, sidebar ciut, dan tombol akun punya label/tooltip. `npm run build`, `npm run lint`, `git diff --check`.


## 2026-11-02 — Kecilkan teks petunjuk login
- Change: Atur teks “Masukkan username dan password untuk melanjutkan.” menjadi 12px dan satu baris di layar login.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan teks 12px, tinggi satu baris, dan tidak melampaui lebar area teks.


## 2026-11-02 — Perbaiki teks login dan tambah toggle password
- Change: Ganti keterangan login menjadi “Gunakan akun Onelito Koi Anda untuk masuk.” Tambahkan ikon mata untuk menampilkan/menyembunyikan password dengan label aksesibel.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, `git diff --check`, dan browser check perubahan tipe input serta label ikon mata.


## 2026-11-02 — Perbarui teks layar login
- Change: Ganti keterangan pratinjau/simulasi dengan instruksi username/password dan keterangan akses workspace. Judul menggunakan kapitalisasi “Masuk ke Workspace” sesuai koreksi lanjutan. Perilaku login tetap simulasi lokal di frontend.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check`.


## 2026-11-02 — Animasi transisi logout ke layar login
- Change: Tambahkan fade halus pada layar login dan fade-up/scale ringan pada kartu login saat layar dirender setelah logout. Respect `prefers-reduced-motion`.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser logout mengonfirmasi layar login muncul dengan animasi `demo-login-screen-in` dan `demo-login-card-in`.


## 2026-11-02 — Ganti label Peran menjadi Title di modal Profil
- Change: Ganti label profil saja menjadi `Title`; nilai title tetap memakai nilai peran yang sudah ditampilkan.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check`.


## 2026-11-02 — Animasi tutup modal Profil dan Akun & Akses
- Change: Tambahkan animasi keluar singkat pada modal Profil dan Akun & Akses saat ditutup lewat tombol X, klik backdrop, atau tombol Escape. Timer menjaga modal tetap terpasang saat animasi berjalan, dibatalkan saat dibuka ulang, dan dibersihkan saat unmount.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Animasi keluar menggunakan keyframe yang sudah ada di `src/App.css`, termasuk aturan reduced-motion yang tersedia.

## 2026-11-02 — Sederhanakan pengaturan akun dan tambah toggle password
- Change: Ubah kartu Akun & Akses menjadi pengelolaan satu akun demo: nama lengkap dan password dapat diubah, username ditampilkan tapi tidak diedit, opsi tambah akun dihilangkan. Akun simulasi `adelia` dibuat sebagai kredensial lokal sementara. Tambahkan tombol ikon mata untuk tampil/sembunyikan password.
- Scope: Data akun hanya di state halaman dan hilang saat reload; bukan autentikasi aman.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser memastikan kartu tidak menampilkan aksi tambah akun, form hanya memuat nama/password, dan tombol mata mengganti input `password` ke `text` serta label aksesibilitas.




## 2026-11-02 — Hapus kotak informasi Akun lokal demo
- Change: Hapus kotak informasi tambahan dari kartu Akun & Akses; ringkasan profil, total akun, dan tombol pengelolaan tetap ada.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus.


## 2026-11-02 — Lengkapi panel Akun & Akses
- Change: Tampilkan ringkasan profil aktif (nama, username, peran) dan jumlah akun; formulir tambah/edit kini mengelola nama lengkap, username unik, password, dan pilihan peran Administrator/Manager/Viewer. Daftar kelola akun menampilkan identitas/peran/status aktif; sidebar dan dialog Profil mengikuti profil aktif. Login username tidak peka kapital. Hapus tetap perlu konfirmasi dan akun aktif/terakhir terlindungi.
- Scope: Peran hanya label UI, belum mengatur izin. Kredensial dan akun hanya ada selama sesi; simulasi bukan autentikasi aman.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser memverifikasi tampilan ringkasan, form tambah/edit dengan pilihan peran, update identitas/peran pada daftar, konfirmasi hapus, serta penghapusan akun nonaktif. Kata sandi uji tidak dicatat.

## 2026-11-02 — Hilangkan pergeseran saat dialog Setting dibuka
- Change: Kunci scroll halaman memakai `useLayoutEffect` dan kompensasi lebar scrollbar dengan padding sementara, agar konten belakang dan dialog tidak bergeser ketika modal Akun & Akses dibuka.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser membuka Setting lalu Kelola akun; scrollbar 15px dikompensasi, dialog tetap terpusat, dan body overflow terkunci selama modal terbuka.

## 2026-11-02 — Kelola akun demo individual
- Change: Kelola akun membuka daftar semua akun dengan aksi edit dan hapus terpisah. Pengeditan memperbarui kredensial akun terpilih; penghapusan meminta konfirmasi dan akun aktif tidak dapat dihapus. Tambah akun tetap tersedia dari daftar.
- Scope: Akun tetap berada di state memori; reload mengembalikan akun default `admin` / `admin`. Bukan autentikasi aman.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser check belum dilakukan: sesi browser sebelumnya sudah `about:blank`.

## 2026-11-02 — Tambah beberapa akun demo dari Setting
- Change: Tampilkan daftar akun demo, tambah akun dengan username/password unik, tolak username duplikat tanpa membedakan kapital, dan terima semua akun pada login demo. Semua akun memakai role Administrator.
- Scope: Akun hanya berada di state memori; reload mengembalikan akun default `admin` / `admin`. Bukan autentikasi aman.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser membuat akun `staff`, melihat daftar dua akun, logout, lalu login sebagai `staff` berhasil.

## 2026-11-02 — Aktifkan pengelolaan akun demo di Setting
- Change: Tombol Kelola akun membuka form ubah username/password. Kredensial baru digunakan layar login, dapat ditampilkan sebagai username pada kartu Setting dan dialog Profil; perubahan bertahan selama sesi React terbuka.
- Scope: Tetap simulasi client-side; tanpa backend/auth aman, dan kembali default setelah reload.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser menyimpan kredensial sementara, menolak `admin`/`admin` setelah diganti, lalu menerima kredensial baru dan kembali ke dashboard.

## 2026-11-02 — Tambah animasi masuk/keluar dialog Profil
- Change: Dialog Profil dan backdrop kini fade/scale/geser ringan saat buka; saat tutup, exit singkat berlaku untuk tombol X, backdrop, dan Escape. Hormati `prefers-reduced-motion`.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser mengonfirmasi `profile-dialog-in`, `profile-backdrop-in`, serta `profile-dialog-out` pada penutupan.

## 2026-11-02 — Tambah animasi buka/tutup Profil
- Change: Dialog dan backdrop profil fade/scale halus saat masuk dan keluar; penutupan via X, backdrop, atau Escape menunggu transisi singkat. `prefers-reduced-motion` menonaktifkan gerak.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser mengonfirmasi `profile-dialog-in`, `profile-backdrop-in`, dan `profile-dialog-out`.

## 2026-11-02 — Aktifkan dialog menu Profil
- Change: Menu Profil kini membuka dialog identitas dengan avatar, Admin Sistem, username `admin`, dan peran Workspace admin. Dialog tutup melalui X, backdrop, atau Escape.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser mengonfirmasi isi dialog dan penutupan via Escape.

## 2026-11-02 — Tutup menu akun saat klik di luar
- Change: Menu profil otomatis tertutup saat pointer ditekan di luar card/menu; Escape juga menutup menu. Interaksi dalam menu tetap berfungsi.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser membuka menu lalu klik luar; menu tertutup dan `aria-expanded` kembali false.

## 2026-11-02 — Balik arah gradasi dan putihkan card/avatar akun
- Change: Card bergerak dari biru gelap di kiri ke biru terang di kanan; avatar berlatar putih, nama/subjudul putih. Terapkan arah konsisten pada tema gelap.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser mengonfirmasi gradient 110deg dari #214eae ke #3478f6, avatar putih, teks putih.

## 2026-11-02 — Lengkapi kredensial simulasi dan gradien card akun
- Change: Card Admin Sistem memakai gradien biru dan status sesi dihapus. Layar login demo meminta username/password; validasi menerima `admin` / `admin`.
- Scope: Kredensial dan sesi ditangani di frontend/memori saja; bukan auth sungguhan dan tidak melindungi data.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser memverifikasi gradien card, status dihapus, kredensial salah ditolak, dan `admin`/`admin` mengembalikan dashboard.

## 2026-11-02 — Jangkar footer sidebar dan cegah overlap di viewport pendek
- Change: Tempatkan Preferences, Setting, dan akun dalam footer normal-flow yang tetap; pendekkan viewport menampilkan scroll sidebar, bukan overlap/geser elemen.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Uji browser pada ukuran rekaman 360×302 memastikan footer non-absolute, overflow-y auto, dengan Preferences y=170, Setting y=208, akun y=269 dalam urutan normal tanpa overlap.


## 2026-11-02 — Pendekkan label Workspace dan Preferences pada rail
- Change: Pertahankan ukuran font normal dan potong label dengan ellipsis saat rail ciut; atur ulang flex-shrink pada grup nav, label, spacer, dan akun untuk mencegah area Preferences melompat.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser ukur posisi Preferences (y=441), Setting (y=479), spacer (290 px), dan akun (y=552) tetap sama sebelum/sesudah collapsed. Menu icons x=26 px.

## 2026-11-02 — Perhalus teks dan alignment sidebar collapsed
- Change: Jaga font Workspace/Preferences tetap normal dan gunakan ellipsis; atur avatar akun agar sejajar menu pada rail.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus; browser cek ukuran teks 9 px, overflow ellipsis, dan koordinat ikon/avatar.


## 2026-11-02 — Selaraskan ikon akun dengan ikon menu sidebar
- Change: Ratakan avatar akun dengan ikon Rekap Ikan dan Setting pada sidebar terbuka maupun collapsed.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser mengukur avatar pada x=26 px expanded dan x=25.5 px collapsed; ikon menu tetap x=26 px.


## 2026-11-02 — Pertahankan posisi menu Rekap saat sidebar ciut
- Change: Sisakan ruang label Workspace yang tersembunyi saat sidebar collapsed supaya posisi nav tidak naik.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser ukur tombol Rekap Ikan tetap y=108 px expanded dan collapsed.


## 2026-11-02 — Koreksi garis Workspace dan sejajarkan ikon rail
- Change: Pindahkan garis pembatas ke atas label Workspace; kunci ikon menu pada posisi horizontal sama saat sidebar expanded/collapsed.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser memastikan kedua ikon tetap x=26 px pada expanded/collapsed; border 1 px berada di atas label Workspace, termasuk mobile.


## 2026-11-02 — Haluskan transisi sidebar PC dan mobile
- Change: Gunakan animasi grid 280 ms untuk rail PC, slide drawer 280 ms di mobile, dan matikan gerakan saat `prefers-reduced-motion` aktif. Hapus inline sizing yang mencegah CSS rail mengecil.
- Changed files: `src/App.css`, `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser mengonfirmasi layout rail 72 px saat collapsed dengan reduced motion; stylesheet PC/mobile memakai transisi 280 ms. Pergerakan visual saat tab browser tidak aktif tidak dapat diverifikasi.

## 2026-11-02 — Samakan lebar area klik brand dan navigasi
- Change: Lebarkan area klik/hover brand hingga memenuhi lebar konten sidebar, sejajar dengan tombol `Rekap Ikan`; mobile tetap berbagi ruang dengan tombol X.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser mengukur lebar area brand dan tombol `Rekap Ikan` sama-sama 215 px; mobile menjaga area brand 206 px di samping tombol X.

## 2026-11-02 — Beri affordance klik pada brand sidebar
- Change: Tambah respons hover berupa highlight, bayangan lembut, dan kenaikan 1 px; active memberi efek tekan. Reduced-motion mematikan transisi.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser memastikan stylesheet memuat state hover/active/focus-visible dan aturan `prefers-reduced-motion`; simulasi pointer browser gagal timeout, jadi state visual pointer belum diuji langsung.

## 2026-11-02 — Jadikan brand sidebar sebagai kontrol toggle
- Change: Hilangkan chevron terpisah; klik logo/nama Onelito Koi untuk ciut/perluas sidebar di PC, dan tutup drawer di mobile. Perbaiki rail agar logo tetap utuh dan tampilkan tombol menu mobile di header.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser PC memastikan logo mengecilkan sidebar menjadi rail 72 px; browser mobile memastikan tombol menu membuka drawer dan klik brand menutupnya.

## 2026-11-02 — Warnai nama brand dan stabilkan toggle rail
- Change: Tampilkan `Koi` merah; ketika sidebar menjadi rail, posisikan tombol perluas sebagai kontrol bundar di sudut kanan-atas logo agar tidak bergeser turun.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, `git diff --check` lulus; verifikasi browser menunggu.

## 2026-11-02 — Perbarui identitas brand sidebar
- Change: Pindahkan toggle ciut/perluas ke dalam baris brand sidebar; gunakan logo Onelito yang diberikan dan ganti teks menjadi `Onelito Koi` / `FISH INVENTORY`.
- Changed files: `src/App.tsx`, `src/App.css`, `public/onelito-koi-logo.png`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser memastikan logo PNG termuat, nama brand tampil, toggle berada di dalam area brand pada mode penuh dan rail, rail 72 px; drawer mobile menampilkan tombol X tanpa toggle desktop.

## 2026-11-02 — Pindahkan kontrol sidebar ke header
- Change: Pindahkan toggle desktop dari area logo sidebar ke kiri header, sejajar dengan breadcrumb; gunakan ikon chevron untuk ciut/perluas dan ikon menu yang sama untuk membuka drawer mobile.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser memastikan kontrol header tetap di kiri breadcrumb, chevron berubah dan sidebar mengecil ke rail 72 px di PC; mobile menampilkan ikon menu dan membuka drawer overlay.

## 2026-11-02 — Sidebar responsif untuk desktop dan mobile
- Change: Tambahkan mode rail ikon yang dapat diperluas di desktop; pada mobile gunakan drawer overlay dengan tombol buka, tombol tutup, backdrop, dan navigasi yang menutup drawer.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Browser desktop memastikan rail 72 px dengan label disembunyikan; browser mobile memastikan tombol menu muncul, drawer terbuka dengan backdrop dan tombol tutup, lalu dapat ditutup melalui backdrop.

## 2026-11-02 — PDF menampilkan periode aktif
- Change: Ganti label tanggal cetak PDF dengan nama periode aktif; ekspor mengirim nama periode yang sedang dipilih.
- Changed files: `src/App.tsx`, `src/exportPdf.ts`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Ekspor aktual di browser berhasil untuk owner Budi Santoso; `pdftotext` memastikan PDF memuat `Periode 2026` dan tidak lagi memuat tanggal cetak.

## 2026-10-27 — Sinkronkan dokumen acuan proyek
- Change: Selaraskan ringkasan produk, perilaku terverifikasi, aturan kerja, status roadmap, design tokens/UI, dan pola animasi antar dokumen. Tetapkan `UI_DESIGN_GUIDELINES.md` sebagai acuan motion/style dan bedakan prototipe lokal dari integrasi masa depan.
- Changed files: `.hermes.md`, `SESSION_MEMORY.md`, `DESIGN.md`, `NEXT_STEPS.md`, `PROGRESS.md`.
- Verification: Tinjau dokumen yang diperbarui dan jalankan `git diff --check`; tidak ada kode aplikasi diubah.

## 2026-10-27 — Lengkapi pedoman animasi per komponen
- Change: Pedoman kini mencatat pola spesifik Rekap Ikan/tabel, Setting, tombol/Export PDF/tombol X, breadcrumb, tab/menu, modal/detail/preview, toast, reduced-motion, dan checklist implementasi komponen sejenis.
- Changed files: `UI_DESIGN_GUIDELINES.md`, `PROGRESS.md`.
- Verification: Dokumentasi diperiksa untuk cakupan pola per komponen; `git diff --check` lulus. Tidak ada perubahan kode UI.


## 2026-10-27 — Animasi label breadcrumb mengikuti volume bar
- Change: Label `Rekap Ikan`/`Setting` kini fade dan mengembang dari kiri dengan sedikit overshoot, seperti volume bar. Garis bawah tetap mengukur lebar breadcrumb aktual dan bertransisi halus; reduced-motion dihormati.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Animasi label breadcrumb Workspace
- Change: `Workspace/{activeSection}` kini fade, geser vertikal ringan, dan blur tipis saat bagian berubah; reduced-motion dihormati.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi label berubah dari `Workspace/Rekap Ikan` ke `Workspace/Setting`, animasi `workspace-label-enter` 0.36s aktif. Build, lint, `git diff --check` lulus.

## 2026-10-27 — Pisahkan animasi konten Rekap Ikan
- Change: Konten tiap periode kini animasi per bagian: teks heading, tombol Tambah ikan, kontrol toolbar bertahap, tabel, dan ringkasan/total memiliki transisi terpisah. Reduced-motion dihormati.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi `rekap-text-enter`, `rekap-button-enter`, `rekap-control-enter`, dan `rekap-table-enter` pada bagian masing-masing. `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Tambah transisi untuk teks halaman Setting
- Change: Heading Setting, deskripsi, dan badge PROTOTIPE ikut fade/geser saat masuk; jeda tipis untuk badge. Reduced-motion dihormati.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi animasi heading dan teks `settings-heading-item-enter`; build, lint, dan `git diff --check` lulus.

## 2026-10-27 — Animasi bertahap untuk kartu Setting
- Change: Kartu Setting masuk satu per satu dengan fade, geser vertikal, scale ringan, dan blur tipis; jeda 90 ms antar kartu. Reduced-motion dihormati.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi tiga kartu memakai `settings-card-enter`, durasi 460 ms, jeda 0/90/180 ms. `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Haluskan transisi vertikal pindah periode
- Change: Animasi seluruh konten periode diubah dari geser horizontal menjadi vertikal 18 px, scale ringan, fade dan blur tipis; durasi 420 ms dengan easing lebih lembut.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi `period-page-enter` 420 ms pada seluruh halaman periode. `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Perluas transisi pindah periode ke seluruh konten
- Change: Seluruh area konten periode (judul, filter, tabel, ringkasan, total) kini masuk dengan fade, geser horizontal, scale ringan, dan blur tipis selama 320 ms; reduced-motion dihormati.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi animasi `period-page-enter` 0.32s dan keberadaan judul, tabel, footer saat pindah periode. `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Tambah transisi konten saat pindah periode
- Change: Area tabel periode baru mendapat fade ringan dan pergeseran 4 px selama 200 ms setiap tab dipilih; `prefers-reduced-motion` dihormati.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi animasi `period-content-in` 0.2s saat beralih Periode 2027 dan Periode 2026. `npm run build`, `npm run lint`, dan `git diff --check` lulus.

## 2026-10-27 — Tambah animasi keluar toast popup
- Change: Toast notifikasi kini menjalankan animasi fade/geser keluar sebelum dihapus; notifikasi baru membatalkan timer keluar sebelumnya. Hormati `prefers-reduced-motion`.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus; chunk awal tetap di bawah 500 kB.

## 2026-10-27 — Lazy-load PDF export
- Change: Modul `exportPdf` dimuat dinamis hanya saat pengguna mengekspor PDF; ukuran chunk awal turun dari 612.93 kB ke 159.77 kB. Chunk PDF menjadi 426.10 kB dan tidak lagi memicu batas 500 kB.
- Changed files: `src/App.tsx`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build memisahkan chunk PDF; belum diverifikasi unduhan PDF aktual di browser.

## 2026-10-27 — Tambah animasi modal pratinjau gambar
- Change: Modal gambar mendapat animasi masuk/keluar dan tombol X mendapat hover biru, gerak/putar, efek tekan, serta fokus keyboard. Keluar lewat X, backdrop, atau Escape.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi `dialog-in`, `form-dialog-out`, serta transisi tombol X 0.16s. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.93 kB (>500 kB).


## 2026-10-27 — Tambah animasi tombol pada dialog ganti nama tab
- Change: `Batal` dan `Simpan nama` pada dialog tab mendapat hover/press transitions dan fokus keyboard; Batal hover biru, Simpan mendapat bayangan.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi transisi 0.16s dan aturan active/focus untuk kedua tombol. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memperingatkan chunk 612.81 kB (>500 kB).


## 2026-10-27 — Tambah animasi tombol modal hapus
- Change: Tombol `Batal` mendapat hover biru/angkat; tombol `Hapus` mendapat hover merah/angkat; keduanya mendapat transisi, efek tekan, dan fokus keyboard yang terlihat.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi transition 0.16s, efek active scale, dan focus-visible pada kedua tombol. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.81 kB (>500 kB).


## 2026-10-27 — Tambah animasi tombol Batal dan Simpan modal input/edit
- Change: Tombol Batal punya hover border biru/angkat; tombol Simpan punya hover bayangan dan keduanya punya efek tekan serta indikator fokus keyboard.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi transition 0.16s, hover, active, dan focus-visible untuk tombol modal. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.81 kB (>500 kB).


## 2026-10-27 — Tambah animasi modal Detail T&C
- Change: Modal Detail T&C memakai animasi masuk, animasi keluar melalui X/klik backdrop/Escape, serta animasi tombol X (hover biru, angkat, putar ikon, tekan, fokus keyboard).
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi `dialog-in`, `form-dialog-out`, `form-backdrop-out`, dan transisi tombol X 0.16s. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.81 kB (>500 kB).


## 2026-10-27 — Tambah animasi penutupan modal konfirmasi
- Change: Modal konfirmasi hapus ikan dan periode memudar/bergeser saat ditutup lewat Batal, klik backdrop, Escape (untuk ikan), maupun setelah konfirmasi hapus.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan modal konfirmasi ikan dan periode menjalankan `form-dialog-out`. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memperingatkan chunk 612.68 kB (>500 kB).


## 2026-10-27 — Tambah animasi penutupan modal tambah tab
- Change: Modal tambah/ganti nama tab memudar dan bergeser sedikit saat ditutup melalui X, Batal, klik backdrop, atau setelah penyimpanan berhasil.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi kelas penutupan menjalankan `form-dialog-out` dan `form-backdrop-out`. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.48 kB (>500 kB).


## 2026-10-27 — Samakan animasi tombol X di modal tambah periode
- Change: Tombol X modal tambah/ganti nama periode memakai animasi tombol X modal input/edit: border biru dan naik saat hover, ikon berputar, efek tekan scale, serta fokus keyboard terlihat.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan aturan hover/tekan dan transisi 0.16s berlaku. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memperingatkan chunk 612.36 kB (>500 kB).

## 2026-10-27 — Tambah animasi tombol X modal input/edit
- Change: Tombol X modal input/edit mendapat hover border biru, efek angkat, putar ikon, dan efek tekan.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi transisi 0.16s, hover border biru/angkat, efek tekan scale 0.95, dan focus-visible. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.36 kB (>500 kB).


## 2026-10-27 — Tambah animasi penutupan modal input/edit
- Change: Modal input/edit memudar dan bergerak halus saat ditutup lewat tombol, klik backdrop, atau setelah simpan; animasi menghormati `prefers-reduced-motion` yang sudah ada.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan kelas closing memicu `form-dialog-out` dan `form-backdrop-out`, lalu modal dilepas. `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build memberi peringatan chunk 612.36 kB (>500 kB).


## 2026-10-27 — Terapkan animasi hover pada tombol Export PDF
- Change: Tombol `Export PDF` kini menampilkan border biru saat hover, bersama animasi angkat dan gerak ikon; border biru hover yang keliru pada opsi menu tab dihapus.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: `npm run build`, `npm run lint`, dan `git diff --check` lulus. Build memberi peringatan chunk 612.23 kB (>500 kB).


## 2026-10-27 — Tambah border biru saat hover opsi menu tab
- Change: Opsi menu tab menampilkan border biru saat pointer hover, senada dengan hover tombol Detail; dimensi dan animasi tekan dipertahankan.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser mengonfirmasi hover rule memakai border `var(--blue)`, efek naik 1 px, dan tinggi opsi tetap 37.23 px. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.23 kB (>500 kB).

## 2026-10-27 — Samakan animasi opsi menu dengan tombol Detail
- Change: Opsi menu tab memakai animasi hover dan tekan yang sama seperti tombol Detail: naik 1 px saat hover, scale saat ditekan, transisi warna/bayangan singkat. Ukuran opsi tetap mengikuti tab.
- Changed files: `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan transisi `transform`/`box-shadow` berdurasi 0.16s dan tinggi opsi tetap 37.23 px. `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memperingatkan chunk 612.23 kB (>500 kB).

## 2026-10-27 — Samakan ukuran menu aksi dengan tab
- Change: Menu aksi memakai lebar tab pemicu; tiap opsi memakai tinggi tab, termasuk di layar kecil.
- Changed files: `src/App.tsx`, `src/App.css`, `PROGRESS.md`.
- Verification: Browser memastikan lebar menu dan opsi sama dengan tab (120.86 px) serta tinggi tiap opsi sama dengan tab (37.23 px). `npm run build`, `npm run lint`, dan `git diff --check` lulus; build memberi peringatan chunk 612.22 kB (>500 kB).

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
## [2026-11-05] - Dark Mode Toggle Figma Implementation
- **Description**: Replaced standard theme toggle with a seamless sliding panoramic toggle using Figma SVG designs. Implemented side-by-side SVG sliding logic for a smooth transition between sun (light) and moon (dark).
- **Files**: src/App.tsx, src/App.css
- **Verification**: npm run build, npm run lint, browser manual test (dev server port 5173).
