import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { Bell, CheckCheck, Clock, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export const StudentNotifications: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const student = currentUser as Student;

  const studentNotifs = notifications.filter(
    (n) => n.recipientRole === 'SISWA' && (!n.recipientNisn || n.recipientNisn === student?.nisn)
  );

  const unreadCount = studentNotifs.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Notifikasi</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pemberitahuan resmi dari perpustakaan sekolah
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-950/60 rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      {studentNotifs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Belum ada notifikasi</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pemberitahuan status peminjaman atau pengembalian akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {studentNotifs.map((item) => {
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
                    ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-200/90 dark:border-blue-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 opacity-90'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'SUCCESS'
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                        : item.type === 'ALERT'
                        ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                        : item.type === 'WARNING'
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                        : 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {item.type === 'SUCCESS' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : item.type === 'ALERT' ? (
                      <XCircle className="w-4 h-4" />
                    ) : item.type === 'WARNING' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 mt-2 block font-medium">
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
