import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, User, Bell, LogOut, Settings } from 'lucide-react';
import { Student } from '../../types';
import { ThemeToggle } from './ThemeToggle';

interface AppHeaderProps {
  onOpenNotifications?: () => void;
  onOpenBasket?: () => void;
  onOpenSystemSettings?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenNotifications,
  onOpenBasket,
  onOpenSystemSettings,
}) => {
  const { currentUser, currentRole, logout, basket, notifications } = useApp();

  const unreadCount = notifications.filter((n) => {
    if (n.isRead) return false;
    if (currentRole === 'ADMIN') return n.recipientRole === 'ADMIN';
    const student = currentUser as Student;
    return n.recipientRole === 'SISWA' && (!n.recipientNisn || n.recipientNisn === student?.nisn);
  }).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                SIPERPUS
              </span>
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {currentRole === 'ADMIN' ? 'Petugas Perpustakaan' : 'Siswa'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block leading-none mt-1">
              Sistem Informasi Peminjaman Perpustakaan Sekolah
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* Student Basket Trigger (if student and has items) */}
          {currentRole === 'SISWA' && basket.length > 0 && onOpenBasket && (
            <button
              type="button"
              onClick={onOpenBasket}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>{basket.length} Buku</span>
              <span className="text-[11px] opacity-90 hidden sm:inline">Daftar Pinjam</span>
            </button>
          )}

          {/* Admin System Settings button */}
          {currentRole === 'ADMIN' && onOpenSystemSettings && (
            <button
              type="button"
              onClick={onOpenSystemSettings}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Pengaturan Perpustakaan"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Pengaturan</span>
            </button>
          )}

          {/* Notification Bell */}
          {onOpenNotifications && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Pusat Notifikasi"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-[10px] text-white font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Active User Badge & Logout */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                {currentUser?.name?.charAt(0) || <User className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden lg:block text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[140px]">
                  {currentUser?.name || 'Pengguna'}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400">
                  {currentRole === 'ADMIN' ? 'Petugas' : (currentUser as Student)?.class || 'Siswa'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              title="Keluar dari akun"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
