import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all ${
        isDark
          ? 'text-amber-300 hover:text-amber-200 hover:bg-slate-800/80 bg-slate-800/50 border border-slate-700/80'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white/60 border border-slate-200/90'
      } shadow-xs active:scale-95 ${className}`}
      title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
    >
      <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform rotate-0 scale-100" />
        )}
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-medium">
          {isDark ? 'Mode Terang' : 'Mode Gelap'}
        </span>
      )}
    </button>
  );
};
