import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { Search, Plus, Edit2, KeyRound, ShieldAlert, CheckCircle, User, Bookmark } from 'lucide-react';

interface AdminStudentsProps {
  onOpenAddStudent: () => void;
  onOpenEditStudent: (student: Student) => void;
}

export const AdminStudents: React.FC<AdminStudentsProps> = ({
  onOpenAddStudent,
  onOpenEditStudent,
}) => {
  const { students, updateStudent, resetStudentPassword, borrowingRecords } = useApp();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const filtered = students.filter((std) => {
    if (classFilter !== 'ALL' && !std.class.startsWith(classFilter)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        std.name.toLowerCase().includes(q) ||
        std.nisn.includes(q) ||
        std.class.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleActive = (student: Student) => {
    updateStudent(student.nisn, { isActive: !student.isActive });
  };

  const handleResetPassword = (student: Student) => {
    const newPass = resetStudentPassword(student.nisn);
    setResetFeedback(`Kata sandi untuk ${student.name} berhasil direset menjadi: "${newPass}"`);
    setTimeout(() => setResetFeedback(null), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Data Anggota Siswa
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola data akun siswa peminjam, kelas, NISN, dan hak akses
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddStudent}
          className="h-10 px-4 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {resetFeedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{resetFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setResetFeedback(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors duration-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama siswa, NISN, atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-600 transition-colors"
          >
            <option value="ALL">Semua Tingkat</option>
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Siswa tidak ditemukan</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Silakan sesuaikan filter atau tambahkan siswa baru.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Nama Siswa</th>
                  <th className="px-4 py-3">NISN</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Buku Sedang Dipinjam</th>
                  <th className="px-4 py-3">Status Akun</th>
                  <th className="px-5 py-3 text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((student) => {
                  const studentBorrowings = borrowingRecords.filter(
                    (r) => r.studentNisn === student.nisn && r.status === 'SEDANG_DIPINJAM'
                  );
                  const activeCount = studentBorrowings.reduce(
                    (acc, r) => acc + r.books.filter((b) => !b.returned).length,
                    0
                  );

                  return (
                    <tr key={student.nisn} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {student.name}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">
                              Terdaftar sejak: {student.joinedDate}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {student.nisn}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                          <Bookmark className="w-3 h-3 text-slate-400" />
                          <span>{student.class}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            activeCount > 0 ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {activeCount} buku aktif
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(student)}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            student.isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                          }`}
                          title="Klik untuk ubah status aktif"
                        >
                          {student.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleResetPassword(student)}
                            className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            title="Reset Kata Sandi"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Reset Sandi</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenEditStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Edit Siswa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
