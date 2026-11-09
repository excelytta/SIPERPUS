import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  Undo2,
  BookOpen,
  Users,
  Bell,
  LogOut,
  GraduationCap,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminUser } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';

export type AdminTab =
  | 'dashboard'
  | 'peminjaman'
  | 'pengembalian'
  | 'data-buku'
  | 'data-siswa'
  | 'notifikasi';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onOpenSystemSettings?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenSystemSettings,
}) => {
  const { currentUser, borrowingRecords, notifications, logout } = useApp();
  const admin = currentUser as AdminUser;

  const pendingBorrowCount = borrowingRecords.filter((r) => r.status === 'MENUNGGU_VERIFIKASI').length;
  const unreadNotifCount = notifications.filter((n) => n.recipientRole === 'ADMIN' && !n.isRead).length;

  const menuItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'peminjaman' as AdminTab,
      label: 'Peminjaman Masuk',
      icon: FileCheck2,
      badge: pendingBorrowCount,
      badgeColor: 'bg-amber-600',
    },
    { id: 'pengembalian' as AdminTab, label: 'Pengembalian', icon: Undo2 },
    { id: 'data-buku' as AdminTab, label: 'Data Buku', icon: BookOpen },
    { id: 'data-siswa' as AdminTab, label: 'Data Siswa', icon: Users },
    {
      id: 'notifikasi' as AdminTab,
      label: 'Notifikasi',
      icon: Bell,
      badge: unreadNotifCount,
      badgeColor: 'bg-blue-600',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">SIPERPUS</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
              Panel Staf Perpustakaan
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Utama
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                    isActive ? 'bg-white/20' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}

        {onOpenSystemSettings && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenSystemSettings}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Pengaturan Sistem</span>
            </button>
          </div>
        )}

        <div className="pt-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Tema Tampilan</span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-slate-800">
        <div className="p-3 bg-slate-800/60 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {admin?.name || 'Petugas Perpustakaan'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                NIP: {admin?.nip || '6'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors shrink-0"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
