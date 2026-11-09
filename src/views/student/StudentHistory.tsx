import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { Clock, BookOpen, CheckCircle, XCircle, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const StudentHistory: React.FC = () => {
  const { currentUser, history } = useApp();
  const student = currentUser as Student;
  const [filter, setFilter] = useState<'SEMUA' | 'PEMINJAMAN' | 'PENGEMBALIAN'>('SEMUA');

  // Filter history for current student
  const studentHistory = history.filter((h) => h.studentNisn === student?.nisn);

  const filteredHistory = studentHistory.filter((item) => {
    if (filter === 'SEMUA') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Riwayat Aktivitas</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Catatan riwayat peminjaman dan pengembalian buku di perpustakaan
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
        <button
          type="button"
          onClick={() => setFilter('SEMUA')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'SEMUA'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Semua
        </button>
        <button
          type="button"
          onClick={() => setFilter('PEMINJAMAN')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'PEMINJAMAN'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Peminjaman
        </button>
        <button
          type="button"
          onClick={() => setFilter('PENGEMBALIAN')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'PENGEMBALIAN'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pengembalian
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Belum ada riwayat</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Riwayat transaksi peminjaman atau pengembalian akan tercatat di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const formattedDate = new Date(item.date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === 'PEMINJAMAN'
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                          : item.type === 'PENGEMBALIAN'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {item.type === 'PEMINJAMAN' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : item.type === 'PENGEMBALIAN' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.type === 'PEMINJAMAN'
                            ? 'Peminjaman Buku'
                            : item.type === 'PENGEMBALIAN'
                            ? 'Pengembalian Buku'
                            : 'Peminjaman Ditolak'}
                        </span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {item.bookCount} buku
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      item.type === 'PEMINJAMAN'
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                        : item.type === 'PENGEMBALIAN'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* List of titles */}
                <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-400 text-[10px] block uppercase font-semibold">
                    Daftar Buku
                  </span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {item.bookTitles.map((title, idx) => (
                      <li key={idx} className="truncate">
                        {title}
                      </li>
                    ))}
                  </ul>
                  {item.notes && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700">
                      <strong>Keterangan:</strong> {item.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
