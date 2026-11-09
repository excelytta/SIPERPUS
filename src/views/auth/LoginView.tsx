import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!identifier.trim()) {
      setErrorMessage('Masukkan NISN.');
      return;
    }

    if (!password) {
      setErrorMessage('Masukkan kata sandi.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Unified login automatically detects student or admin/petugas
      const res = login(identifier.trim(), password);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Kredensial login tidak sesuai.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative transition-colors duration-200">
      {/* Top Bar Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6 max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-700/20">
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SIPERPUS</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-snug">
          Sistem Informasi Peminjaman Perpustakaan SMA Negeri 3
        </p>
      </div>

      {/* Main Single Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 transition-colors duration-200">
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Masuk ke Sistem Perpustakaan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gunakan NISN (Siswa) atau NIP / ID Pengguna (Petugas)
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nomor Induk (NISN / NIP)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Masukkan NISN Siswa atau NIP Petugas"
                className="w-full h-11 pl-10 pr-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 font-mono transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Masukkan kata sandi"
                className="w-full h-11 pl-10 pr-10 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-700/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Memverifikasi kredensial...</span>
            ) : (
              <>
                <span>Masuk ke Sistem Perpustakaan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span>Sistem Informasi Perpustakaan Resmi Terintegrasi SMA Negeri 3</span>
      </div>
    </div>
  );
};
