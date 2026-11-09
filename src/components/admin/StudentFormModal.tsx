import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Student } from '../../types';

interface StudentFormModalProps {
  isOpen: boolean;
  studentToEdit: Student | null;
  onClose: () => void;
  onSave: (studentData: any) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  studentToEdit,
  onClose,
  onSave,
}) => {
  const [nisn, setNisn] = useState('');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('XII DKV 1');
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setNisn(studentToEdit.nisn);
      setName(studentToEdit.name);
      setStudentClass(studentToEdit.class);
      setIsActive(studentToEdit.isActive);
      setPassword(studentToEdit.password || 'password123');
      setError('');
    } else {
      setNisn('');
      setName('');
      setStudentClass('XII DKV 1');
      setIsActive(true);
      setPassword('password123');
      setError('');
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisn.trim()) {
      setError('NISN siswa wajib diisi.');
      return;
    }
    if (!name.trim()) {
      setError('Nama lengkap siswa wajib diisi.');
      return;
    }

    onSave({
      nisn: nisn.trim(),
      name: name.trim(),
      class: studentClass.trim(),
      isActive,
      password: password.trim() || 'password123',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={studentToEdit ? 'Edit Data Siswa' : 'Tambah Anggota Siswa Baru'}
      subtitle="Data identitas siswa yang terdaftar di perpustakaan"
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
              NISN (Nomor Induk) *
            </label>
            <input
              type="text"
              required
              disabled={!!studentToEdit}
              placeholder="Contoh: 0051234567"
              value={nisn}
              onChange={(e) => {
                if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                  setNisn(e.target.value);
                }
              }}
              className="w-full h-9 px-3 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-slate-100 dark:disabled:bg-slate-800/50 dark:disabled:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kelas *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: XII DKV 2"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nama Lengkap Siswa *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Muhammad Excel Pratama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Kata Sandi Akun
          </label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600"
            placeholder="Default: password123"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is-active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
          />
          <label htmlFor="is-active" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Akun Siswa Aktif (dapat mengajukan peminjaman buku)
          </label>
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
            Simpan Siswa
          </button>
        </div>
      </form>
    </Modal>
  );
};
