import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Hash,
  BookOpen,
  Clock,
  AlertCircle,
  ChevronRight,
  Bookmark,
  Calendar,
} from 'lucide-react';
import { StudentTab } from '../../components/student/StudentBottomNav';

interface StudentHomeProps {
  onOpenManualCode: () => void;
  onNavigateTab: (tab: StudentTab) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onOpenManualCode,
  onNavigateTab,
}) => {
  const { currentUser, borrowingRecords } = useApp();
  const student = currentUser as Student;

  // Filter records belonging to this student
  const studentRecords = borrowingRecords.filter((r) => r.studentNisn === student?.nisn);

  // Active borrowings (approved and currently borrowed)
  const activeRecords = studentRecords.filter(
    (r) => r.status === 'SEDANG_DIPINJAM' || r.status === 'DISETUJUI'
  );
  const activeBooksCount = activeRecords.reduce((acc, r) => {
    return acc + r.books.filter((b) => !b.returned).length;
  }, 0);

  // Overdue borrowings: past dueDate and still active
  const overdueRecords = studentRecords.filter((r) => {
    if (r.status !== 'SEDANG_DIPINJAM' || !r.dueDate) return false;
    return new Date(r.dueDate).getTime() < Date.now();
  });
  const overdueBooksCount = overdueRecords.reduce((acc, r) => {
    return acc + r.books.filter((b) => !b.returned).length;
  }, 0);

  // Pending borrowings awaiting admin approval
  const pendingRecords = studentRecords.filter((r) => r.status === 'MENUNGGU_VERIFIKASI');

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Student Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white font-bold text-lg flex items-center justify-center shadow-sm">
            {student?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Halo, {student?.name || 'Siswa'}!
            </h1>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{student?.class}</span>
              <span>·</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">NISN: {student?.nisn}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('buku-saya')}
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-3 py-2 rounded-xl border border-blue-100 dark:border-blue-900 transition-colors"
        >
          <span>Buku Saya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-xs font-medium">Buku Dipinjam</span>
            <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {activeBooksCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Maksimal 3 buku</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-xs font-medium">Jatuh Tempo</span>
            <AlertCircle className={`w-4 h-4 ${overdueBooksCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${overdueBooksCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
            {overdueBooksCount}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
            {overdueBooksCount > 0 ? 'Segera kembalikan' : 'Tidak ada denda/telat'}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-1">
            <span className="text-xs font-medium">Pengajuan Baru</span>
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {pendingRecords.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Menunggu verifikasi guru</span>
        </div>
      </div>

      {/* Pending status notification banner */}
      {pendingRecords.length > 0 && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 rounded-xl text-xs flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-900 dark:text-amber-300">Pengajuan Menunggu Verifikasi</span>
            <p className="text-amber-800 dark:text-amber-400/90 text-[11px] mt-0.5 leading-relaxed">
              Anda memiliki {pendingRecords.length} pengajuan peminjaman baru. Silakan temui petugas perpustakaan untuk pemeriksaan fisik buku.
            </p>
          </div>
        </div>
      )}

      {/* Primary Action Section: "Pinjam Buku Pelajaran" */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Pinjam Buku Pelajaran
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ketik nomor kode barcode buku pelajaran yang ingin Anda pinjam
          </p>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenManualCode}
            className="w-full group relative p-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-between shadow-md shadow-blue-700/15 transition-all active:scale-[0.98] text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0 group-hover:bg-white/25 transition-colors">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight">Masukkan Kode Buku</div>
                <div className="text-[11px] text-blue-100 mt-0.5">Ketik nomor barcode untuk meminjam buku</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-200" />
          </button>
        </div>
      </div>

      {/* Aktivitas Terbaru Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Aktivitas Terbaru</h2>
          <button
            type="button"
            onClick={() => onNavigateTab('riwayat')}
            className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Semua Riwayat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {studentRecords.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p>Belum ada riwayat aktivitas peminjaman buku.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {studentRecords.slice(0, 3).map((record) => (
              <div key={record.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {record.books.length} Buku Pelajaran
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    <span>{new Date(record.requestDate).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      record.status === 'SEDANG_DIPINJAM' || record.status === 'DISETUJUI'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                        : record.status === 'SELESAI'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : record.status === 'MENUNGGU_VERIFIKASI'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : record.status === 'DITOLAK'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {record.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
