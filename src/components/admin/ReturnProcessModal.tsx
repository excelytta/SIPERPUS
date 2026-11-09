import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { BorrowingRecord, BorrowedBookItem } from '../../types';
import { BookOpen, CheckSquare, Square, CheckCircle, AlertTriangle, User } from 'lucide-react';

interface ReturnProcessModalProps {
  isOpen: boolean;
  record: BorrowingRecord | null;
  onClose: () => void;
  onConfirmReturn: (recordId: string, returnedCodes: string[], notes?: string) => void;
}

export const ReturnProcessModal: React.FC<ReturnProcessModalProps> = ({
  isOpen,
  record,
  onClose,
  onConfirmReturn,
}) => {
  const [checkedCodes, setCheckedCodes] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (record) {
      // By default, pre-check books that were previously already returned
      // and let admin check the ones being physically handed in right now
      const alreadyReturned = record.books.filter((b) => b.returned).map((b) => b.bookCode);
      setCheckedCodes(alreadyReturned);
      setNotes('');
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const toggleBook = (code: string, isAlreadyReturned: boolean) => {
    // If it was already confirmed returned earlier, keep it checked
    if (isAlreadyReturned) return;

    setCheckedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSelectAll = () => {
    setCheckedCodes(record.books.map((b) => b.bookCode));
  };

  const newlyCheckedCount = checkedCodes.filter(
    (code) => !record.books.find((b) => b.bookCode === code)?.returned
  ).length;

  const totalReturnedCount = checkedCodes.length;
  const totalBooksCount = record.books.length;
  const isAllReturned = totalReturnedCount === totalBooksCount;
  const unreturnedCount = totalBooksCount - totalReturnedCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newlyCheckedCount === 0) {
      return;
    }
    // Only pass the newly returned codes
    const newlyReturned = checkedCodes.filter(
      (code) => !record.books.find((b) => b.bookCode === code)?.returned
    );
    onConfirmReturn(record.id, newlyReturned, notes);
    onClose();
  };

  const borrowDateStr = record.approvedDate || record.requestDate;
  const formattedBorrowDate = new Date(borrowDateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verifikasi Pengembalian Buku"
      subtitle="Periksa kondisi fisik buku yang diserahkan oleh siswa"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Summary Info */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{record.studentName}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                NISN {record.studentNisn} · Kelas {record.studentClass}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Tanggal Pinjam</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formattedBorrowDate}</span>
          </div>
        </div>

        {/* Books Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Daftar Buku Fisik:
            </label>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
            >
              Centang Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden">
            {record.books.map((book) => {
              const isChecked = checkedCodes.includes(book.bookCode);
              const wasAlreadyReturned = book.returned;

              return (
                <div
                  key={book.bookCode}
                  onClick={() => toggleBook(book.bookCode, wasAlreadyReturned)}
                  className={`p-3 flex items-center justify-between transition-colors ${
                    wasAlreadyReturned
                      ? 'bg-slate-50/80 dark:bg-slate-800/40 cursor-default opacity-80'
                      : 'hover:bg-blue-50/40 dark:hover:bg-slate-800/70 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-700 dark:text-blue-400">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 fill-blue-700 dark:fill-blue-500 text-white" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{book.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Kode: {book.bookCode} · {book.subject} {book.classLevel}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                      wasAlreadyReturned
                        ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        : isChecked
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                    }`}
                  >
                    {wasAlreadyReturned
                      ? 'Sudah Dikembalikan'
                      : isChecked
                      ? 'Siap Dikembalikan'
                      : 'Masih Dipinjam'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Return Calculation & Status Feedback */}
        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/50 rounded-xl border border-blue-100 dark:border-blue-900/60 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-900 dark:text-blue-200">Progres Pengembalian:</span>
            <span className="font-bold text-blue-950 dark:text-blue-100 font-mono">
              {totalReturnedCount} dari {totalBooksCount} buku dikembalikan
            </span>
          </div>

          {isAllReturned ? (
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1.5 pt-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Semua buku telah dikembalikan. Status peminjaman akan menjadi SELESAI.</span>
            </div>
          ) : (
            <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{unreturnedCount} buku masih belum dikembalikan. Peminjaman tetap aktif.</span>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Catatan Petugas (Opsional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Kondisi fisik buku lengkap, cover bersih"
            className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={newlyCheckedCount === 0}
            className={`h-10 px-5 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              newlyCheckedCount === 0
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed text-slate-500'
                : 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.98]'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Simpan Pengembalian</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
