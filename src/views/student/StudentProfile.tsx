import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Student } from '../../types';
import { User, ShieldCheck, Lock, Bell, LogOut, CheckCircle2, Sun, Moon } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const student = currentUser as Student;
  const isDark = theme === 'dark';

  const [notifSound, setNotifSound] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
    }, 1800);
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Profil Siswa</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Informasi data keanggotaan perpustakaan sekolah
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white font-bold text-xl flex items-center justify-center shadow-xs">
            {student?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{student?.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">NISN: {student?.nisn}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md border border-blue-100 dark:border-blue-900/50">
              Kelas {student?.class}
            </span>
          </div>
        </div>

        {/* School Admin Managed Data Notice */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Data identitas siswa (Nama, NISN, dan Kelas) disinkronisasi resmi dari data pokok sekolah dan dikelola oleh Administrator Perpustakaan. Siswa tidak dapat mengubah data ini secara mandiri.
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Pengaturan Akun & Tampilan
        </h3>

        <div className="space-y-3">
          {/* Light / Dark Mode Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Tema Tampilan</div>
                <div className="text-[11px] text-slate-400">
                  {isDark ? 'Mode Gelap (Dark Mode) aktif' : 'Mode Terang (Light Mode) aktif'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                isDark ? 'bg-blue-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle Mode Tampilan"
              title="Ganti Mode Gelap / Terang"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notification Preference */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Notifikasi Peringatan</div>
                <div className="text-[11px] text-slate-400">
                  Pemberitahuan batas tempo dan status buku
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotifSound(!notifSound)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                notifSound ? 'bg-blue-700' : 'bg-slate-300'
              }`}
              aria-label="Toggle Notifikasi"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notifSound ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Change Password */}
          <div className="py-2">
            {!showPasswordChange ? (
              <button
                type="button"
                onClick={() => setShowPasswordChange(true)}
                className="w-full flex items-center justify-between text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Ubah Kata Sandi</div>
                    <div className="text-[11px] text-slate-400">
                      Perbarui kata sandi akun perpustakaan
                    </div>
                  </div>
                </div>
                <span className="text-blue-700 dark:text-blue-400 font-semibold">Ubah</span>
              </button>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-1">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Ubah Kata Sandi</div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                    Kata Sandi Saat Ini
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Masukkan sandi saat ini"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Minimal 6 karakter"
                  />
                </div>

                {passwordSuccess && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Kata sandi berhasil diperbarui!</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
                  >
                    Simpan Kata Sandi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="w-full h-10 flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/60 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};
