import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminTab } from '../../components/admin/AdminSidebar';
import { BorrowingRecord } from '../../types';
import {
  FileText,
  Clock,
  Undo2,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowRight,
  User,
  Calendar,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenApprove: (record: BorrowingRecord) => void;
  onOpenReject: (record: BorrowingRecord) => void;
  onOpenReturn: (record: BorrowingRecord) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenApprove,
  onOpenReject,
  onOpenReturn,
}) => {
  const { borrowingRecords, books, students } = useApp();

  // Metrics
  const pendingRequests = borrowingRecords.filter((r) => r.status === 'MENUNGGU_VERIFIKASI');
  const activeBorrowings = borrowingRecords.filter((r) => r.status === 'SEDANG_DIPINJAM');

  const totalBooksBorrowed = activeBorrowings.reduce(
    (acc, r) => acc + r.books.filter((b) => !b.returned).length,
    0
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const loansToday = borrowingRecords.filter(
    (r) => r.approvedDate && r.approvedDate.startsWith(todayStr)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Dashboard Operasional Perpustakaan
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Pusat kendali sirkulasi peminjaman buku pelajaran dan referensi sekolah
        </p>
      </div>

      {/* 4 Core Summary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Peminjaman Hari Ini</span>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            {loansToday}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">transaksi disetujui</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-amber-700 dark:text-amber-400">
            {pendingRequests.length}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">pengajuan baru</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Buku Sedang Dipinjam</span>
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            {totalBooksBorrowed}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">eksemplar pada siswa</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Peminjaman Aktif</span>
            <Undo2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            {activeBorrowings.length}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">siswa memegang buku</p>
        </div>
      </div>

      {/* Section 1: "Perlu Diproses" (Pending Requests) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Perlu Diproses (Pengajuan Masuk)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pengajuan peminjaman dari siswa yang memerlukan verifikasi fisik
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('peminjaman')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Semua Pengajuan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Tidak ada pengajuan peminjaman yang menunggu verifikasi saat ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{req.studentName}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{req.studentNisn}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {req.studentClass}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">{req.books.length} Buku:</strong>{' '}
                      {req.books.map((b) => `${b.title} (${b.bookCode})`).join(', ')}
                    </div>

                    <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Diajukan:{' '}
                        {new Date(req.requestDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenReject(req)}
                    className="h-9 px-3.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100/80 dark:hover:bg-rose-900/60 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenApprove(req)}
                    className="h-9 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Setujui Peminjaman</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: "Pengembalian Aktif" */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Peminjaman Aktif (Siap Dikembalikan)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Siswa yang sedang meminjam buku dan dapat diproses saat pengembalian fisik
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('pengembalian')}
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Pengembalian</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeBorrowings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Tidak ada buku yang sedang dipinjam oleh siswa.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeBorrowings.slice(0, 5).map((rec) => {
              const unreturned = rec.books.filter((b) => !b.returned).length;
              return (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-850/60 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 font-bold text-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{rec.studentName}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {rec.studentClass}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Sisa {unreturned} buku aktif:{' '}
                        {rec.books
                          .filter((b) => !b.returned)
                          .map((b) => b.title)
                          .join(', ')}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenReturn(rec)}
                    className="h-9 px-4 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 rounded-xl transition-colors flex items-center gap-1.5 self-end sm:self-center cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Proses Pengembalian</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
