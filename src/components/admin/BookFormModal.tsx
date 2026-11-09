import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Book, BookStatus } from '../../types';

interface BookFormModalProps {
  isOpen: boolean;
  bookToEdit: Book | null;
  onClose: () => void;
  onSave: (book: Book) => void;
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  bookToEdit,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [classLevel, setClassLevel] = useState('XII');
  const [status, setStatus] = useState<BookStatus>('TERSEDIA');
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookToEdit) {
      setCode(bookToEdit.code);
      setTitle(bookToEdit.title);
      setClassLevel(bookToEdit.classLevel);
      setStatus(bookToEdit.status);
      setError('');
    } else {
      setCode('');
      setTitle('');
      setClassLevel('XII');
      setStatus('TERSEDIA');
      setError('');
    }
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Kode buku wajib diisi.');
      return;
    }
    if (!/^\d+$/.test(code.trim())) {
      setError('Kode buku harus berupa angka.');
      return;
    }
    if (!title.trim()) {
      setError('Judul buku wajib diisi.');
      return;
    }

    onSave({
      code: code.trim(),
      title: title.trim(),
      subject: bookToEdit?.subject || 'Buku Pelajaran',
      classLevel,
      publisher: bookToEdit?.publisher || 'Pusat Perbukuan Kemendikbudristek',
      curriculum: bookToEdit?.curriculum || 'Kurikulum Merdeka',
      year: bookToEdit?.year || 2024,
      status,
      shelfLocation: bookToEdit?.shelfLocation || '-',
      totalCopies: bookToEdit?.totalCopies || 10,
      availableCopies: status === 'TERSEDIA' ? (bookToEdit?.availableCopies || 10) : 0,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bookToEdit ? 'Edit Data Buku Pelajaran' : 'Tambah Buku Pelajaran Baru'}
      subtitle="Buku paket kurikulum sekolah dan referensi pembelajaran"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs rounded-lg border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kode Buku (Angka) *
            </label>
            <input
              type="text"
              required
              disabled={!!bookToEdit}
              placeholder="Contoh: 000135"
              value={code}
              onChange={(e) => {
                if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                  setCode(e.target.value);
                }
              }}
              className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 dark:disabled:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tingkat Kelas
            </label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full h-9 px-3 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Judul Buku Pelajaran *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Biologi untuk SMA/MA Kelas XII"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Status Buku
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookStatus)}
            className="w-full h-9 px-3 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="TERSEDIA">Tersedia</option>
            <option value="DIPINJAM">Dipinjam</option>
            <option value="TIDAK TERSEDIA">Tidak Tersedia</option>
            <option value="RUSAK">Rusak</option>
            <option value="HILANG">Hilang</option>
          </select>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="h-9 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            Simpan Buku
          </button>
        </div>
      </form>
    </Modal>
  );
};
