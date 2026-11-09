import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BookOpen, CheckCircle, Plus, ArrowRight, Library, Layers, MapPin } from 'lucide-react';
import { Book } from '../../types';
import { useApp } from '../../context/AppContext';

interface BookVerificationModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onOpenBasket: () => void;
  onAddAnother: () => void;
}

export const BookVerificationModal: React.FC<BookVerificationModalProps> = ({
  isOpen,
  book,
  onClose,
  onOpenBasket,
  onAddAnother,
}) => {
  const { addToBasket } = useApp();
  const [isAdded, setIsAdded] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  if (!isOpen || !book) return null;

  const handleAdd = () => {
    const res = addToBasket(book);
    if (res.success) {
      setIsAdded(true);
      setFeedback(res.message);
    } else {
      setFeedback(res.message);
    }
  };

  const handleResetAndClose = () => {
    setIsAdded(false);
    setFeedback('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={isAdded ? 'Buku Berhasil Ditambahkan' : 'Verifikasi Data Buku'}
      subtitle={isAdded ? undefined : 'Periksa kesesuaian buku fisik dengan data perpustakaan'}
      maxWidth="md"
    >
      {!isAdded ? (
        <div className="space-y-4">
          {/* Book Information Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  KODE: {book.code}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {book.title}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-100/70 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/70 dark:border-slate-700/80">
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-semibold">Mata Pelajaran</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{book.subject}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-semibold">Kelas</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">Kelas {book.classLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-semibold">Kurikulum</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{book.curriculum}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-semibold">Lokasi Rak</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{book.shelfLocation}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-700/80 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Status Ketersediaan:</span>
              <span className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Tersedia ({book.availableCopies} eksemplar)
              </span>
            </div>
          </div>

          {feedback && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-800/80">
              {feedback}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="h-10 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambahkan Buku</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-2 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              Buku Berhasil Ditambahkan
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              "{book.title}" ({book.code}) telah ditambahkan ke daftar rencana peminjaman Anda.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAdded(false);
                setFeedback('');
                onAddAnother();
              }}
              className="w-full sm:flex-1 h-10 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Buku Lagi</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdded(false);
                setFeedback('');
                onOpenBasket();
              }}
              className="w-full sm:flex-1 h-10 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Lihat Daftar Peminjaman</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
