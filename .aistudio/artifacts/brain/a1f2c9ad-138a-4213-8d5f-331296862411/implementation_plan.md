# Perbaikan Komprehensif Dark Mode (Navy Malam Gelap)

Menghilangkan seluruh bug kotak putih yang masih tersisa saat beralih ke Mode Gelap (*Dark Mode*) pada antarmuka Siswa maupun Petugas/Admin SIPERPUS, dengan menerapkan tema warna **Navy Malam Gelap (*Dark Navy*)** yang elegan, konsisten, dan berdaya baca tinggi.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Dikonfirmasi Pengguna**:
> - **Cakupan Perbaikan**: Menyeluruh di kedua sisi—antarmuka Siswa (Buku Saya, Riwayat, Notifikasi, Keranjang, Modal Verifikasi) dan panel Petugas Perpustakaan / Admin.
> - **Nuansa Warna Dark Mode**: **Navy malam gelap (*dark navy*)**, memadukan latar dasar gelap pekat dengan kartu bernuansa biru navy dalam (`slate-950` / `slate-900` / navy accents `border-slate-800`), kontras teks tinggi, serta aksen biru kobalt yang terintegrasi.

---

### 1. Overview & Core Concept

- **Tujuan**: Memastikan transisi Dark Mode 100% konsisten di seluruh halaman aplikasi SIPERPUS tanpa ada satu pun kotak, kartu, input, atau modal yang tertinggal dengan warna putih terang (`bg-white`).
- **Pengguna**: Siswa SMA Negeri 3 dan Petugas Perpustakaan yang menggunakan aplikasi dalam kondisi pencahayaan redup maupun preferensi visual pribadi.
- **Nilai Utama**: Kenyamanan visual maksimal, estetika modern bernuansa *dark navy*, serta konsistensi status peminjaman buku yang mudah dibaca.

---

### 2. User Experience & Visual Design

#### A. Palet Warna Dark Navy
- **Canvas / Body**: `dark:bg-slate-950` (dasar navy tergelap)
- **Kartu & Permukaan Utama**: `dark:bg-slate-900` dengan pembatas halus `dark:border-slate-800`
- **Permukaan Sekunder / Inner Wells / Inputs**: `dark:bg-slate-800/70` atau `dark:bg-slate-800`
- **Teks**: Putih bersih `dark:text-white` untuk judul, `dark:text-slate-300` untuk isi, dan `dark:text-slate-400` untuk teks keterangan
- **Badges Status Terstandar**:
  - *Tersedia / Selesai*: `dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60`
  - *Dipinjam / Aktif*: `dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60`
  - *Menunggu / Terlambat*: `dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60`
  - *Ditolak / Rusak*: `dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60`

#### B. Area Kritis yang Diperbaiki
```
┌─────────────────────────────────────────────────────────────┐
│                    SIPERPUS DARK NAVY                       │
├──────────────────────────────┬──────────────────────────────┤
│        MODUL SISWA           │      MODUL PETUGAS / ADMIN   │
├──────────────────────────────┼──────────────────────────────┤
│ • StudentMyBooks:            │ • AdminDashboard:            │
│   - Segmented filter tabs    │   - Metric summary cards     │
│   - Empty state box          │   - Pending & return tables  │
│   - Book items card & notes  │ • AdminBorrowings:           │
│ • StudentHistory:            │   - Search & filter toolbar  │
│   - History list cards       │   - Detail berkas modal      │
│   - Filter switcher          │ • AdminReturns:              │
│ • StudentNotifications:      │   - Checklist progress cards │
│   - Unread/read notif cards  │ • AdminStudents & Data Buku: │
│ • Modals (ManualCodeModal,   │   - Table rows & action menu │
│   BookVerification, Basket)  │ • All Admin Modals:          │
│   - Input fields & chips     │   - Approve, Return, Reject  │
│   - Bottom checkout sheet    │   - SystemSettings & Export  │
└──────────────────────────────┴──────────────────────────────┘
```

---

### 3. Key Product Decisions & Trade-Offs

- **Pemberian Kelas Dark Bertingkat (*Tiered Surface Elevation*)**:
  - *Pendekatan*: Elemen utama menggunakan `dark:bg-slate-900`, sedangkan elemen di dalamnya (seperti kotak kode buku atau kolom masukan) menggunakan `dark:bg-slate-800/80` agar hierarki kedalaman visual tetap jelas dan tidak datar.
  - *Alasan*: Menghindari efek "semua hitam pekat" yang menyulitkan mata membedakan batasan kartu.
- **Pembersihan Kelas Hardcoded `bg-white`**:
  - Semua `bg-white` diganti atau dilengkapi pendamping `dark:bg-slate-900` atau `dark:bg-slate-800`.
  - Semua `bg-slate-50` / `bg-slate-100` dilengkapi `dark:bg-slate-800/60` / `dark:bg-slate-800`.

---

### 4. Technical Architecture & Component Mapping

```
ThemeContext ('light' | 'dark' stored in localStorage)
  │
  ├── <html> class="dark" + style="color-scheme: dark"
  │
  ├── Header & Sidebar (AppHeader, AdminSidebar, ThemeToggle)
  │
  ├── Student Views:
  │     ├── StudentHome.tsx (Profile card, Quick action, Active borrowings)
  │     ├── StudentMyBooks.tsx (Segmented tabs, Active books card, Empty state)
  │     ├── StudentHistory.tsx (History cards, Return time badges)
  │     ├── StudentNotifications.tsx (Notification item cards)
  │     └── StudentProfile.tsx (Theme toggles, password inputs)
  │
  ├── Student Modals:
  │     ├── ManualCodeModal.tsx (Code textfield, quick suggestions)
  │     ├── BookVerificationModal.tsx (Book detail box, badge chips)
  │     └── BasketModal.tsx (Book item row, loan duration info)
  │
  └── Admin Views & Modals:
        ├── AdminDashboard.tsx & AdminBorrowings.tsx
        ├── AdminReturns.tsx & AdminStudents.tsx & AdminBooks.tsx
        ├── ApproveBorrowModal.tsx & ReturnProcessModal.tsx
        ├── RejectReasonModal.tsx & BookFormModal.tsx & StudentFormModal.tsx
        └── SystemSettingsModal.tsx
```

---

### 5. Verification Checklist

- [ ] Mengaudit seluruh `bg-white`, `bg-slate-50`, dan `bg-slate-100` di direktori `src/views/student/` dan `src/components/student/`.
- [ ] Mengaudit sisa kelas terang tanpa padanan `dark:` di modul admin dan modal dialog.
- [ ] Memastikan `npm run lint` dan `npm run build` sukses tanpa galat tipe TypeScript.
- [ ] Memastikan transisi toggle tema (Light $\leftrightarrow$ Dark) mulus dan tidak menimbulkan pergeseran tata letak (*layout shift*).
