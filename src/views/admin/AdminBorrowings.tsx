import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BorrowingRecord, BorrowStatus } from '../../types';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Calendar,
  User,
  Filter,
} from 'lucide-react';

interface AdminBorrowingsProps {
  onOpenApprove: (record: BorrowingRecord) => void;
  onOpenReject: (record: BorrowingRecord) => void;
}

export const AdminBorrowings: React.FC<AdminBorrowingsProps> = ({
  onOpenApprove,
  onOpenReject,
}) => {
  const { borrowingRecords, books } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('MENUNGGU_VERIFIKASI');
  const [selectedRecord, setSelectedRecord] = useState<BorrowingRecord | null>(null);

  const filtered = borrowingRecords.filter((rec) => {
    // Status filter
    if (statusFilter !== 'ALL' && rec.status !== statusFilter) return false;

    // Search query
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
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Peminjaman Masuk
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verifikasi berkas pengajuan peminjaman buku pelajaran oleh siswa
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors duration-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari siswa, NISN, kelas, atau judul buku..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('MENUNGGU_VERIFIKASI')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'MENUNGGU_VERIFIKASI'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Menunggu Verifikasi
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('SEDANG_DIPINJAM')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'SEDANG_DIPINJAM'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Aktif Dipinjam
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* Main Content: Table or Empty */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Tidak ada data peminjaman
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tidak ditemukan catatan peminjaman yang cocok dengan filter pencarian.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Siswa & Kelas</th>
                  <th className="px-4 py-3">Buku yang Diajukan</th>
                  <th className="px-4 py-3">Waktu Pengajuan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((record) => {
                  const reqDate = new Date(record.requestDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {record.studentName}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] font-mono mt-0.5">
                          NISN: {record.studentNisn} · {record.studentClass}
                        </div>
                      </td>

                      <td className="px-4 py-4 max-w-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {record.books.length} Buku Pelajaran
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate mt-0.5">
                          {record.books.map((b) => b.title).join(', ')}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {reqDate}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                            record.status === 'MENUNGGU_VERIFIKASI'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                              : record.status === 'SEDANG_DIPINJAM'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                              : record.status === 'SELESAI'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                          }`}
                        >
                          {record.status === 'MENUNGGU_VERIFIKASI'
                            ? 'Menunggu Verifikasi'
                            : record.status === 'SEDANG_DIPINJAM'
                            ? 'Sedang Dipinjam'
                            : record.status === 'SELESAI'
                            ? 'Selesai'
                            : 'Ditolak'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {record.status === 'MENUNGGU_VERIFIKASI' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenReject(record)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition-colors cursor-pointer"
                            >
                              Tolak
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenApprove(record)}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-xs transition-colors cursor-pointer"
                            >
                              Setujui
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                          >
                            Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Record Detail Modal */}
      {selectedRecord && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  Detail Berkas Peminjaman
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedRecord.studentName} ({selectedRecord.studentClass})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">NISN: {selectedRecord.studentNisn}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 rounded cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Daftar Buku yang Dipinjam ({selectedRecord.books.length} buku):
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {selectedRecord.books.map((b) => (
                  <div key={b.bookCode} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{b.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Kode: {b.bookCode} · {b.subject} {b.classLevel}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        b.returned
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {b.returned ? 'Sudah Kembali' : 'Sedang Dipinjam'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedRecord.rejectionReason && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
                <strong>Alasan Penolakan:</strong> {selectedRecord.rejectionReason}
              </div>
            )}

            {selectedRecord.adminNotes && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                <strong>Catatan Admin:</strong> {selectedRecord.adminNotes}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
              {selectedRecord.status === 'MENUNGGU_VERIFIKASI' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const rec = selectedRecord;
                      setSelectedRecord(null);
                      onOpenReject(rec);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl cursor-pointer"
                  >
                    Tolak
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const rec = selectedRecord;
                      setSelectedRecord(null);
                      onOpenApprove(rec);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs cursor-pointer"
                  >
                    Setujui Peminjaman
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
