import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BookOpen, Trash2, Plus, Send, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMoreBooks: () => void;
  onViewMyBooks: () => void;
}

export const BasketModal: React.FC<BasketModalProps> = ({
  isOpen,
  onClose,
  onAddMoreBooks,
  onViewMyBooks,
}) => {
  const { basket, removeFromBasket, clearBasket, submitBorrowRequest } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    submitted: boolean;
    message?: string;
  }>({ submitted: false });

  if (!isOpen) return null;

  const handleConfirmSubmit = () => {
    const res = submitBorrowRequest();
    if (res.success) {
      setSubmissionResult({ submitted: true, message: res.message });
      setShowConfirm(false);
    }
  };

  const handleCloseAll = () => {
    setShowConfirm(false);
    setSubmissionResult({ submitted: false });
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showConfirm}
        onClose={handleCloseAll}
        title="Daftar Rencana Peminjaman"
        subtitle="Buku pelajaran yang akan diajukan ke petugas perpustakaan"
        maxWidth="md"
      >
        {submissionResult.submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Pengajuan Peminjaman Berhasil Dikirim
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                Status saat ini: <strong className="text-amber-700 dark:text-amber-400 font-semibold">Menunggu verifikasi admin</strong>.
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-300 mt-3 text-left">
                <strong>Catatan Penting:</strong> Mengajukan peminjaman tidak langsung berarti buku resmi dipinjam. Silakan temui petugas perpustakaan untuk verifikasi fisik buku.
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full sm:flex-1 h-10 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Selesai
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCloseAll();
                  onViewMyBooks();
                }}
                className="w-full sm:flex-1 h-10 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-colors"
              >
                Lihat di Buku Saya
              </button>
            </div>
          </div>
        ) : basket.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Belum ada buku dalam daftar
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
              Ketik kode buku atau pilih dari katalog untuk menambahkan.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddMoreBooks();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Buku</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[45vh] overflow-y-auto pr-1">
              {basket.map((item) => (
                <div key={item.code} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-mono text-slate-700 dark:text-slate-300">Kode {item.code}</span>
                        <span>·</span>
                        <span>{item.subject}</span>
                        <span>·</span>
                        <span>Kelas {item.classLevel}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromBasket(item.code)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Hapus dari daftar"
                    aria-label={`Hapus ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom Summary & Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Buku yang Diajukan:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{basket.length} buku</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAddMoreBooks();
                  }}
                  className="h-10 px-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Lagi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="flex-1 h-10 px-4 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Peminjaman</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog before submitting */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Konfirmasi Pengajuan"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Ajukan peminjaman <strong className="text-slate-900 dark:text-white font-bold">{basket.length} buku</strong> ke perpustakaan sekolah?
          </p>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
            Setelah dikirim, status akan menjadi <strong>Menunggu Verifikasi Admin</strong>. Anda dapat mengambil buku fisik di perpustakaan.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="h-9 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              Ya, Kirim
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
