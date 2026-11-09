import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, FileText, Undo2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const AdminNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  const adminNotifs = notifications.filter((n) => n.recipientRole === 'ADMIN');
  const unreadCount = adminNotifs.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Notifikasi Staf Perpustakaan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pemberitahuan aktivitas sirkulasi dan pengingat operasional
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      {adminNotifs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Belum ada notifikasi</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengajuan peminjaman baru dan pengingat pengembalian akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {adminNotifs.map((item) => {
            const formattedTime = new Date(item.timestamp).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                onClick={() => !item.isRead && markNotificationAsRead(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  !item.isRead
                    ? 'bg-blue-50/40 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'WARNING'
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                        : item.type === 'ALERT'
                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400'
                        : item.type === 'SUCCESS'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                        : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400'
                    }`}
                  >
                    {item.type === 'WARNING' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : item.type === 'SUCCESS' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 block font-medium">
                      {formattedTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
