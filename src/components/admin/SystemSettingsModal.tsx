import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  ShieldCheck,
  User,
  Key,
  Database,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface SystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemSettingsModal: React.FC<SystemSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    adminConfig,
    updateAdminProfile,
    books,
    students,
    borrowingRecords,
    clearAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'backup' | 'reset'>('profile');

  // Form state
  const [adminName, setAdminName] = useState(adminConfig.name);
  const [adminNip, setAdminNip] = useState(adminConfig.nip);
  const [adminEmail, setAdminEmail] = useState(adminConfig.email);
  const [adminPass, setAdminPass] = useState('');
  const [confirmResetText, setConfirmResetText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      name: adminName.trim(),
      nip: adminNip.trim(),
      email: adminEmail.trim(),
      password: adminPass.trim() || undefined,
    });
    setAdminPass('');
    setFeedback('Data profil dan keamanan petugas perpustakaan berhasil disimpan.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      appName: 'SIPERPUS',
      version: '1.0.0',
      books,
      students,
      borrowingRecords,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `siperpus_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setFeedback('Berkas cadangan data (backup) berhasil diunduh.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleResetConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmResetText !== 'HAPUS SEMUA DATA') {
      return;
    }

    clearAllData();
    setConfirmResetText('');
    setFeedback('Seluruh katalog buku dan anggota siswa telah dibersihkan.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Perpustakaan Sekolah"
      subtitle="Kelola konfigurasi akun petugas dan cadangan data sistem"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Profil Petugas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Cadangan Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reset')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reset'
                ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-xs'
                : 'text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300'
            }`}
          >
            Bersihkan Sistem
          </button>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* TAB 1: Profil Petugas */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Petugas / Kepala Perpustakaan
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Contoh: Dra. Hj. Nurhayati, M.Pd."
                className="w-full h-10 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NIP / ID Login Petugas
                </label>
                <input
                  type="text"
                  required
                  value={adminNip}
                  onChange={(e) => setAdminNip(e.target.value)}
                  placeholder="Contoh: 1985041201 atau admin"
                  className="w-full h-10 px-3 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Perpustakaan
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="perpustakaan@sekolah.sch.id"
                  className="w-full h-10 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kata Sandi Baru (Opsional)
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Kosongkan bila tidak ingin mengubah kata sandi"
                className="w-full h-10 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="h-10 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Cadangan Data */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/90 dark:border-slate-700 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Ekspor Salinan Data Perpustakaan (JSON)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Unduh seluruh daftar buku ({books.length} buku), data siswa ({students.length} siswa), dan riwayat peminjaman untuk diarsipkan.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportBackup}
                className="h-10 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Berkas Cadangan (.JSON)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Bersihkan Sistem */}
        {activeTab === 'reset' && (
          <form onSubmit={handleResetConfirm} className="space-y-3">
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Kosongkan Seluruh Data Buku & Siswa</span>
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                Tindakan ini akan menghapus seluruh katalog buku, akun siswa, dan data peminjaman yang tersimpan di sistem. Gunakan opsi ini jika ingin memulai pembukuan tahun ajaran baru dari nol.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ketik <span className="font-mono text-rose-600 dark:text-rose-400">HAPUS SEMUA DATA</span> untuk konfirmasi:
              </label>
              <input
                type="text"
                required
                value={confirmResetText}
                onChange={(e) => setConfirmResetText(e.target.value)}
                placeholder="HAPUS SEMUA DATA"
                className="w-full h-10 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-rose-300 dark:border-rose-700 rounded-xl focus:outline-none focus:border-rose-600 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={confirmResetText !== 'HAPUS SEMUA DATA'}
              className="h-10 px-4 bg-rose-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Bersihkan Seluruh Database</span>
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
