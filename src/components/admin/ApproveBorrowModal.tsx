import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BorrowingRecord } from '../../types';
import { CheckCircle2, BookOpen, Calendar, User, Clock, ShieldCheck } from 'lucide-react';

interface ApproveBorrowModalProps {
  isOpen: boolean;
  record: BorrowingRecord | null;
  onClose: () => void;
  onConfirmApprove: (recordId: string, notes?: string) => void;
}

export const ApproveBorrowModal: React.FC<ApproveBorrowModalProps> = ({
  isOpen,
  record,
  onClose,
  onConfirmApprove,
}) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !record) return null;

  // Calculate 1 semester (6 months) due date
  const now = new Date();
  const dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + 6);

  const formattedDueDate = dueDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onConfirmApprove(record.id, adminNotes.trim() || undefined);
      setAdminNotes('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verifikasi & Setujui Peminjaman"
      subtitle="Periksa kesesuaian fisik buku sebelum menyetujui peminjaman"
      maxWidth="md"
    >
      <form onSubmit={handleApprove} className="space-y-4">
        {/* Student Information Box */}
        <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {record.studentName}
                </h4>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-300">
                  {record.studentClass}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                NISN: {record.studentNisn}
              </div>
            </div>
          </div>
        </div>

        {/* Books to be verified */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Daftar Buku Fisik ({record.books.length} Buku)
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verifikasi fisik buku</span>
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {record.books.map((book, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-start gap-3 text-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white leading-snug">
                    {book.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      Kode: {book.bookCode}
                    </span>
                    <span>·</span>
                    <span>{book.subject}</span>
                    <span>·</span>
                    <span>Kelas {book.classLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Due Date & Loan Terms */}
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
          <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block">Batas Pengembalian (1 Semester / 6 Bulan):</span>
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
              {formattedDueDate}
            </span>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Catatan Petugas (Opsional)
          </label>
          <input
            type="text"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Contoh: Kondisi buku baik, bersampul rapi"
            className="w-full h-10 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-5 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses...' : 'Setujui & Terbitkan Pinjaman'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
