import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, BorrowingRecord } from '../../types';
import { BookOpen, Calendar, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type BookTab = 'SEDANG_DIPINJAM' | 'PERLU_DIKEMBALIKAN' | 'SELESAI';

export const StudentMyBooks: React.FC = () => {
  const { currentUser, borrowingRecords } = useApp();
  const student = currentUser as Student;
  const [activeTab, setActiveTab] = useState<BookTab>('SEDANG_DIPINJAM');

  const studentRecords = borrowingRecords.filter((r) => r.studentNisn === student?.nisn);

  const today = new Date();

  // Extract all books with their parent record metadata
  const allBooksWithMeta = studentRecords.flatMap((record) =>
    record.books.map((b) => {
      let isDueSoon = false;
      let isOverdue = false;
      let daysRemaining = null;

      if (record.dueDate && !b.returned) {
        const due = new Date(record.dueDate);
        const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        daysRemaining = diffDays;
        if (diffDays < 0) {
          isOverdue = true;
        } else if (diffDays <= 3) {
          isDueSoon = true;
        }
      }

      return {
        ...b,
        recordId: record.id,
        recordStatus: record.status,
        requestDate: record.requestDate,
        approvedDate: record.approvedDate,
        dueDate: record.dueDate,
        isDueSoon,
        isOverdue,
        daysRemaining,
      };
    })
  );

  // Filter based on active tab
  const activeBooks = allBooksWithMeta.filter(
    (b) => !b.returned && (b.recordStatus === 'SEDANG_DIPINJAM' || b.recordStatus === 'MENUNGGU_VERIFIKASI')
  );

  const dueSoonBooks = allBooksWithMeta.filter(
    (b) => !b.returned && b.recordStatus === 'SEDANG_DIPINJAM' && (b.isDueSoon || b.isOverdue)
  );

  const completedBooks = allBooksWithMeta.filter((b) => b.returned || b.recordStatus === 'SELESAI');

  const displayedBooks =
    activeTab === 'SEDANG_DIPINJAM'
      ? activeBooks
      : activeTab === 'PERLU_DIKEMBALIKAN'
      ? dueSoonBooks
      : completedBooks;

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Title & Physical Return Info Notice */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Buku Saya</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Daftar seluruh buku pelajaran sekolah yang Anda pinjam
        </p>
      </div>

      {/* Educational Notice on Physical Return Requirement */}
      <div className="p-3 bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold">Prosedur Pengembalian:</strong> Pengembalian buku dilakukan secara fisik dengan menyerahkan buku ke petugas di meja sirkulasi perpustakaan. Petugas perpustakaan yang berwenang mencatat status pengembalian.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('SEDANG_DIPINJAM')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'SEDANG_DIPINJAM'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Sedang Dipinjam ({activeBooks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PERLU_DIKEMBALIKAN')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'PERLU_DIKEMBALIKAN'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Perlu Dikembalikan ({dueSoonBooks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('SELESAI')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'SELESAI'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Selesai ({completedBooks.length})
        </button>
      </div>

      {/* Books List */}
      {displayedBooks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {activeTab === 'SEDANG_DIPINJAM'
              ? 'Tidak ada buku yang sedang dipinjam'
              : activeTab === 'PERLU_DIKEMBALIKAN'
              ? 'Tidak ada buku yang mendekati batas tempo'
              : 'Belum ada riwayat pengembalian buku'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'SEDANG_DIPINJAM'
              ? 'Ketik kode buku atau pilih dari katalog untuk mulai meminjam buku pelajaran.'
              : 'Seluruh buku masih dalam rentang waktu peminjaman yang aman.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedBooks.map((item, idx) => {
            const borrowDateStr = item.approvedDate || item.requestDate;
            const formattedBorrowDate = borrowDateStr
              ? new Date(borrowDateStr).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : '-';

            const formattedDueDate = item.dueDate
              ? new Date(item.dueDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Menunggu verifikasi';

            return (
              <div
                key={`${item.recordId}-${item.bookCode}-${idx}`}
                className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.bookCode}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                        {item.title}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Mata Pelajaran: {item.subject} · Kelas {item.classLevel}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 border ${
                      item.returned
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : item.isOverdue
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                        : item.isDueSoon
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                        : item.recordStatus === 'MENUNGGU_VERIFIKASI'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                    }`}
                  >
                    {item.returned
                      ? 'Dikembalikan'
                      : item.isOverdue
                      ? 'Terlambat'
                      : item.isDueSoon
                      ? 'Mendekati Tempo'
                      : item.recordStatus === 'MENUNGGU_VERIFIKASI'
                      ? 'Menunggu'
                      : 'Sedang Dipinjam'}
                  </span>
                </div>

                {/* Dates Information */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Dipinjam</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{formattedBorrowDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Batas Pengembalian</span>
                      <span
                        className={`font-medium ${
                          item.isOverdue
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : item.isDueSoon
                            ? 'text-amber-700 dark:text-amber-400 font-semibold'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {formattedDueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overdue / Due Soon notice banner */}
                {item.isOverdue && !item.returned && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 rounded-lg text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2 border border-rose-200/80 dark:border-rose-800/60">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Masa peminjaman telah lewat. Mohon kembalikan buku ke perpustakaan segera.</span>
                  </div>
                )}
                {item.isDueSoon && !item.isOverdue && !item.returned && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2 border border-amber-200/80 dark:border-amber-800/60">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Batas waktu peminjaman tersisa {item.daysRemaining} hari lagi.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
