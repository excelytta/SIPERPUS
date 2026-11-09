import React from 'react';
import { Home, BookOpen, Clock, Bell, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

export type StudentTab = 'beranda' | 'buku-saya' | 'riwayat' | 'notifikasi' | 'profil';

interface StudentBottomNavProps {
  activeTab: StudentTab;
  onTabChange: (tab: StudentTab) => void;
}

export const StudentBottomNav: React.FC<StudentBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { notifications, currentUser } = useApp();
  const student = currentUser as Student;

  const unreadCount = notifications.filter(
    (n) => !n.isRead && n.recipientRole === 'SISWA' && (!n.recipientNisn || n.recipientNisn === student?.nisn)
  ).length;

  const navItems = [
    { id: 'beranda' as StudentTab, label: 'Beranda', icon: Home },
    { id: 'buku-saya' as StudentTab, label: 'Buku Saya', icon: BookOpen },
    { id: 'riwayat' as StudentTab, label: 'Riwayat', icon: Clock },
    { id: 'notifikasi' as StudentTab, label: 'Notifikasi', icon: Bell, badge: unreadCount },
    { id: 'profil' as StudentTab, label: 'Profil', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg transition-colors duration-200"
      aria-label="Navigasi Bawah Siswa"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center py-1 transition-colors relative cursor-pointer ${
                isActive ? 'text-blue-700 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-[10px] text-white font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight mt-1 leading-none">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-blue-700 dark:bg-blue-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
