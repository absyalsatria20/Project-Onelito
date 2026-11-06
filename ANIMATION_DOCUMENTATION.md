# Dokumentasi Lengkap Sistem Animasi & Transisi — Project-Onelito

Dokumen ini mencakup seluruh spesifikasi, nama keyframe, durasi, *easing curves*, dan aturan implementasi animasi serta transisi yang aktif pada aplikasi **Project-Onelito**.

---

## 1. Kurva Easing & Durasi Standar
- **Fluid UI Easing**: `cubic-bezier(.22, 1, .36, 1)` (digunakan untuk mayoritas transisi masuk/keluar, tab, dan modal karena sangat halus dan responsif).
- **Bounce/Spring Easing**: `cubic-bezier(.34, 1.56, .64, 1)` (untuk elemen yang memerlukan sedikit efek kenyal/dinamis).
- **Durasi Standar**:
  - Mikro-interaksi (hover, klik, tombol): `0.16s – 0.2s`
  - Transisi Tab / Menu / Dialog kecil: `0.2s – 0.32s`
  - Transisi Konten Utama / Masuk Halaman: `0.35s – 0.42s`

---

## 2. Daftar Keyframe Utama (`animations.css`)

### A. Transisi Halaman & Section (`sectionFadeIn`, `tabContentSwitch`)
Digunakan saat beralih antar section (Rekap Ikan / Setting) atau saat berpindah tab periode.
```css
@keyframes sectionFadeIn {
  from { opacity: 0; transform: translateY(12px) scale(0.99); filter: blur(3px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes tabContentSwitch {
  from { opacity: 0; transform: translateY(8px) scale(0.995); filter: blur(2px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
```

### B. Dialog & Modal (`dialog-in`, `dialog-out`)
Animasi kemunculan dan penutupan seluruh dialog/modal (FishForm, TermsDetail, DeleteTarget, dll.).
```css
@keyframes dialog-in {
  from { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}

@keyframes dialog-out {
  from { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  to { opacity: 0; transform: translateY(16px) scale(0.95); filter: blur(4px); }
}
```

### C. Dropdown & Menu (`menuDropIn`)
Animasi kemunculan menu titik tiga periode.
```css
@keyframes menuDropIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

### D. Indikator Tab Periode (`slideIndicator`)
Animasi garis biru aktif yang bergeser secara mulus (*sliding*) mengikuti tab periode yang aktif.
```css
.period-tabs-indicator {
  transition: left 0.32s cubic-bezier(.22, 1, .36, 1), width 0.32s cubic-bezier(.22, 1, .36, 1);
}
```

### E. Logo Sidebar (`floatGentle`)
Animasi mengapung (*floating*) lembut pada logo custom di sidebar.
```css
@keyframes floatGentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
```

---

## 3. Interaksi Tombol & Kontrol

### A. Tombol Tutup (X) / Dialog Close & Sidebar Close
- **Tanpa Rotasi**.
- **Hover State**: Skala membesar (`scale(1.1)`), latar belakang berubah menjadi biru (`var(--blue)`), ikon X berubah menjadi putih bersih (`#fff`), dan memancarkan efek *glow shadow* (`box-shadow: 0 4px 12px rgba(52,120,246,.35)`).
- **Active State**: Mengecil sesaat (`scale(0.92)`).

### B. Tombol Tambah Periode (`.period-add`) & Tombol Umum
- **Hover State**: Membesar halus (`scale(1.12)`), latar belakang panel soft, teks berubah ke warna aksen biru.
- **Active State**: Mengecil (`scale(0.92)`).

### C. Tombol Tema (`.theme-toggle`)
- **Hover State**: Membesar (`scale(1.08)`), bayangan lembut, ikon di dalamnya berputar lembut (`rotate(25deg)`).

---

## 4. Navigasi & Breadcrumb
- **Container (`.current-tab`)**: Masuk dengan animasi `sectionFadeIn`. Saat di-hover, teks terangkat sedikit (`translateY(-1px)`) dan berubah warna menjadi biru (`var(--blue)`).
- **Garis Bawah Breadcrumb (`.current-tab:after`)**: Ketebalan `3px` dengan border-radius `2px`, mengikuti lebar breadcrumb aktual dengan transisi lebar halus (`transition: width 0.3s cubic-bezier(.22, 1, .36, 1)`).

---

## 5. Kompatibilitas & Aksesibilitas (`prefers-reduced-motion`)
Seluruh animasi menghormati preferensi sistem *reduced-motion*:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
