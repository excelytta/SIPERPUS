import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BorrowingRecord } from '../../types';
import { Search, Undo2, CheckCircle2, AlertTriangle, User, Calendar, BookOpen } from 'lucide-react';

interface AdminReturnsProps {
  onOpenReturnModal: (record: BorrowingRecord) => void;
}

export const AdminReturns: React.FC<AdminReturnsProps> = ({ onOpenReturnModal }) => {
  const { borrowingRecords } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'AKTIF' | 'SELESAI' | 'SEMUA'>('AKTIF');

  const filtered = borrowingRecords.filter((rec) => {
    // We only care about records that were approved or active or completed
    if (rec.status === 'MENUNGGU_VERIFIKASI' || rec.status === 'DITOLAK') return false;

    if (filter === 'AKTIF' && rec.status !== 'SEDANG_DIPINJAM') return false;
    if (filter === 'SELESAI' && rec.status !== 'SELESAI') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchStudent =
        rec.studentName.toLowerCase().includes(q) ||
        rec.studentNisn.includes(q) ||
        rec.studentClass.toLowerCase().includes(q);
      const matchBook = rec.books.some(
        (b) => b.title.toLowerCase().includes(q) || b.bookCode.includes(q)
      );
      return matchStudent || matchBook;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Pengembalian Buku Fisik
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Proses penerimaan buku fisik dari siswa, cek kondisi, dan perbarui data pinjaman
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors duration-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama siswa, NISN, atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('AKTIF')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'AKTIF'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Aktif / Belum Kembali
          </button>
          <button
            type="button"
            onClick={() => setFilter('SELESAI')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'SELESAI'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Selesai
          </button>
          <button
            type="button"
            onClick={() => setFilter('SEMUA')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'SEMUA'
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Undo2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Tidak ada transaksi pengembalian
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tidak ada data peminjaman yang cocok dengan kriteria filter saat ini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => {
            const returnedCount = record.books.filter((b) => b.returned).length;
            const totalCount = record.books.length;
            const isCompleted = record.status === 'SELESAI';

            const borrowDate = record.approvedDate || record.requestDate;
            const formattedBorrowDate = new Date(borrowDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={record.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {record.studentName}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                          {record.studentNisn}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {record.studentClass}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Books summary & Checklist preview */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 pl-10 space-y-1">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      Progres:{' '}
                      <span className="font-bold text-blue-700 dark:text-blue-400 font-mono">
                        {returnedCount} dari {totalCount} buku dikembalikan
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {record.books.map((b) => (
                        <span
                          key={b.bookCode}
                          className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 border ${
                            b.returned
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60 line-through opacity-75'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium border-amber-200/80 dark:border-amber-800/60'
                          }`}
                        >
                          {b.returned ? '✓ ' : '• '}
                          {b.title} ({b.bookCode})
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2 pt-1">
                      <span>Dipinjam: {formattedBorrowDate}</span>
                      {record.dueDate && (
                        <span>
                          · Batas:{' '}
                          {new Date(record.dueDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Return Button */}
                <div className="self-end sm:self-center shrink-0">
                  {!isCompleted ? (
                    <button
                      type="button"
                      onClick={() => onOpenReturnModal(record)}
                      className="h-10 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Undo2 className="w-4 h-4" />
                      <span>Verifikasi Pengembalian</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Semua Buku Dikembalikan</span>
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
