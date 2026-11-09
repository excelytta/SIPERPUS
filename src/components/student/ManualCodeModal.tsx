import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Hash, AlertCircle, ArrowRight } from 'lucide-react';
import { Book } from '../../types';
import { useApp } from '../../context/AppContext';

interface ManualCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: Book) => void;
}

export const ManualCodeModal: React.FC<ManualCodeModalProps> = ({
  isOpen,
  onClose,
  onSelectBook,
}) => {
  const { basket, findBookByCode } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Strictly numbers only
    if (val === '' || /^\d+$/.test(val)) {
      setCode(val);
      if (error) setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Empty validation
    if (!code.trim()) {
      setError('Masukkan kode buku terlebih dahulu.');
      return;
    }

    // 2. Format validation (digits only)
    if (!/^\d+$/.test(code.trim())) {
      setError('Kode buku hanya boleh berisi angka.');
      return;
    }

    const trimmedCode = code.trim();

    // Check if already in basket
    if (basket.some((b) => b.code === trimmedCode)) {
      setError('Buku dengan kode ini sudah ada di daftar peminjaman Anda.');
      return;
    }

    // 3. Lookup in catalog
    const result = findBookByCode(trimmedCode);

    if (!result.found) {
      setError('Kode buku tidak terdaftar di katalog perpustakaan sekolah.');
      return;
    }

    if (result.book && (result.book.status !== 'TERSEDIA' || result.book.availableCopies <= 0)) {
      setError(`Buku "${result.book.title}" sedang tidak tersedia (${result.book.status.toLowerCase()}).`);
      return;
    }

    if (result.book) {
      onSelectBook(result.book);
      setCode('');
      setError(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCode('');
        setError(null);
        onClose();
      }}
      title="Masukkan Kode Buku"
      subtitle="Ketikkan nomor barcode yang tertera pada label buku sekolah"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="book-code-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Nomor Barcode / Kode Buku (Angka)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Hash className="w-4 h-4" />
            </div>
            <input
              id="book-code-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              placeholder="Contoh: 000123"
              value={code}
              onChange={handleInputChange}
              className={`w-full h-12 pl-10 pr-4 text-base font-mono tracking-wider text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 border rounded-xl focus:outline-none transition-colors ${
                error
                  ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-950'
                  : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40'
              }`}
            />
          </div>

          {error && (
            <div className="flex items-start gap-1.5 mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-2">
            Periksa stiker barcode di bagian sampul depan atau belakang buku pelajaran.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="h-10 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <span>Verifikasi Buku</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </Modal>
  );
};
