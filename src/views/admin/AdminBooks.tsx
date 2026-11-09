import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Book, BookStatus } from '../../types';
import { Search, Plus, Edit2, Trash2, BookOpen, Layers, MapPin, AlertTriangle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

interface AdminBooksProps {
  onOpenAddBook: () => void;
  onOpenEditBook: (book: Book) => void;
}

export const AdminBooks: React.FC<AdminBooksProps> = ({
  onOpenAddBook,
  onOpenEditBook,
}) => {
  const { books, deleteBook, updateBook } = useApp();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const filteredBooks = books.filter((b) => {
    if (classFilter !== 'ALL' && b.classLevel !== classFilter) return false;
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.code.includes(q) ||
        b.subject.toLowerCase().includes(q) ||
        b.shelfLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete.code);
      setBookToDelete(null);
    }
  };

  const handleToggleStatus = (book: Book) => {
    const nextStatus: BookStatus =
      book.status === 'TERSEDIA' ? 'TIDAK TERSEDIA' : 'TERSEDIA';
    updateBook(book.code, { status: nextStatus });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Data Buku Pelajaran
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola katalog buku paket sekolah dan nomor barcode
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddBook}
          className="h-10 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Buku Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors duration-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode buku (000123) atau judul buku..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-600 transition-colors"
          >
            <option value="ALL">Semua Kelas</option>
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-600 transition-colors"
          >
            <option value="ALL">Semua Status</option>
            <option value="TERSEDIA">Tersedia</option>
            <option value="DIPINJAM">Dipinjam</option>
            <option value="TIDAK TERSEDIA">Tidak Tersedia</option>
            <option value="RUSAK">Rusak</option>
            <option value="HILANG">Hilang</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Buku tidak ditemukan</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Silakan tambah buku pelajaran baru ke katalog perpustakaan.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Kode & Judul Buku</th>
                  <th className="px-4 py-3">Tingkat Kelas</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBooks.map((book) => (
                  <tr key={book.code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900">
                          {book.code}
                        </span>
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {book.title}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]">
                        Kelas {book.classLevel}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                          book.status === 'TERSEDIA'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                            : book.status === 'DIPINJAM'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                            : book.status === 'RUSAK'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenEditBook(book)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Edit Buku"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookToDelete(book)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Buku"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        title="Hapus Buku dari Katalog"
        subtitle="Konfirmasi penghapusan data buku"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 dark:text-rose-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus buku <strong>"{bookToDelete?.title}"</strong> (Kode: {bookToDelete?.code})? Tindakan ini tidak dapat dibatalkan.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setBookToDelete(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Ya, Hapus Buku
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
