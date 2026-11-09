import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { AlertCircle, XCircle } from 'lucide-react';

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (reason: string) => void;
  studentName?: string;
  bookCount?: number;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirmReject,
  studentName,
  bookCount,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirmReject(reason.trim());
    setReason('');
    setError(false);
  };

  const commonReasons = [
    'Buku fisik sedang dipakai untuk evaluasi guru di kelas.',
    'Siswa masih memiliki tanggungan buku yang belum dikembalikan.',
    'Buku rusak dan sedang dalam proses perbaikan jilid.',
    'Pengajuan melebihi kuota batas maksimal peminjaman (3 buku).',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tolak Pengajuan Peminjaman"
      subtitle={`Berikan alasan penolakan untuk siswa ${studentName || ''}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Alasan Penolakan <span className="text-rose-600 dark:text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Tuliskan alasan penolakan secara jelas dan edukatif..."
            className={`w-full p-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border rounded-xl focus:outline-none transition-colors ${
              error
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-300 dark:border-slate-700 focus:border-blue-600'
            }`}
          />
          {error && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">Alasan penolakan wajib diisi.</p>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block mb-1.5">Template alasan umum:</span>
          <div className="space-y-1">
            {commonReasons.map((text, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReason(text)}
                className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
              >
                {text}
              </button>
            ))}
          </div>
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
            className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Kirim Penolakan</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
