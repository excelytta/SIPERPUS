import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginView } from './views/auth/LoginView';
import { AppHeader } from './components/common/AppHeader';
import { ThemeToggle } from './components/common/ThemeToggle';

// Student components & views
import { StudentBottomNav, StudentTab } from './components/student/StudentBottomNav';
import { StudentHome } from './views/student/StudentHome';
import { StudentMyBooks } from './views/student/StudentMyBooks';
import { StudentHistory } from './views/student/StudentHistory';
import { StudentNotifications } from './views/student/StudentNotifications';
import { StudentProfile } from './views/student/StudentProfile';
import { ManualCodeModal } from './components/student/ManualCodeModal';
import { BookVerificationModal } from './components/student/BookVerificationModal';
import { BasketModal } from './components/student/BasketModal';

// Admin components & views
import { AdminSidebar, AdminTab } from './components/admin/AdminSidebar';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminBorrowings } from './views/admin/AdminBorrowings';
import { AdminReturns } from './views/admin/AdminReturns';
import { AdminBooks } from './views/admin/AdminBooks';
import { AdminStudents } from './views/admin/AdminStudents';
import { AdminNotifications } from './views/admin/AdminNotifications';
import { ReturnProcessModal } from './components/admin/ReturnProcessModal';
import { RejectReasonModal } from './components/admin/RejectReasonModal';
import { ApproveBorrowModal } from './components/admin/ApproveBorrowModal';
import { BookFormModal } from './components/admin/BookFormModal';
import { StudentFormModal } from './components/admin/StudentFormModal';
import { SystemSettingsModal } from './components/admin/SystemSettingsModal';

import { Book, BorrowingRecord, Student } from './types';
import { Menu, X, ArrowRightLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    currentRole,
    approveBorrowRequest,
    rejectBorrowRequest,
    processReturn,
    addBook,
    updateBook,
    addStudent,
    updateStudent,
  } = useApp();

  // Student Navigation & Modals State
  const [studentTab, setStudentTab] = useState<StudentTab>('beranda');
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [selectedBookForVerification, setSelectedBookForVerification] = useState<Book | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  // Admin Navigation & Modals State
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [mobileAdminMenuOpen, setMobileAdminMenuOpen] = useState(false);
  const [recordForApprove, setRecordForApprove] = useState<BorrowingRecord | null>(null);
  const [recordForReturn, setRecordForReturn] = useState<BorrowingRecord | null>(null);
  const [recordForReject, setRecordForReject] = useState<BorrowingRecord | null>(null);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);

  // If not logged in, render login view
  if (!currentUser || !currentRole) {
    return <LoginView />;
  }

  // --- Handlers for Student Flow ---
  const handleSelectBook = (book: Book) => {
    setIsManualOpen(false);
    setSelectedBookForVerification(book);
    setIsVerificationOpen(true);
  };

  const handleOpenBasketFromVerification = () => {
    setIsVerificationOpen(false);
    setIsBasketOpen(true);
  };

  const handleAddAnotherBook = () => {
    setIsVerificationOpen(false);
    setIsManualOpen(true);
  };

  // --- Handlers for Admin Flow ---
  const handleConfirmApprove = (recordId: string, notes?: string) => {
    approveBorrowRequest(recordId, notes);
    setRecordForApprove(null);
  };

  const handleConfirmReject = (reason: string) => {
    if (recordForReject) {
      rejectBorrowRequest(recordForReject.id, reason);
      setRecordForReject(null);
    }
  };

  const handleConfirmReturn = (recordId: string, returnedCodes: string[], notes?: string) => {
    processReturn(recordId, returnedCodes, notes);
  };

  const handleSaveBook = (bookData: Book) => {
    if (bookToEdit) {
      updateBook(bookData.code, bookData);
    } else {
      addBook(bookData);
    }
    setBookToEdit(null);
  };

  const handleSaveStudent = (studentData: any) => {
    if (studentToEdit) {
      updateStudent(studentData.nisn, studentData);
    } else {
      addStudent(studentData);
    }
    setStudentToEdit(null);
  };

  // ==========================================
  // RENDER STUDENT VIEW
  // ==========================================
  if (currentRole === 'SISWA') {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        {/* Top Header */}
        <AppHeader
          onOpenNotifications={() => setStudentTab('notifikasi')}
          onOpenBasket={() => setIsBasketOpen(true)}
        />

        {/* Main Content Area - Mobile-First Centered Container */}
        <main className="flex-1 w-full max-w-xl mx-auto px-4 py-4 sm:py-6">
          {studentTab === 'beranda' && (
            <StudentHome
              onOpenManualCode={() => setIsManualOpen(true)}
              onNavigateTab={(tab) => setStudentTab(tab)}
            />
          )}

          {studentTab === 'buku-saya' && <StudentMyBooks />}

          {studentTab === 'riwayat' && <StudentHistory />}

          {studentTab === 'notifikasi' && <StudentNotifications />}

          {studentTab === 'profil' && <StudentProfile />}
        </main>

        {/* Mobile Bottom Navigation */}
        <StudentBottomNav
          activeTab={studentTab}
          onTabChange={(tab) => setStudentTab(tab)}
        />

        {/* Student Modals */}
        <ManualCodeModal
          isOpen={isManualOpen}
          onClose={() => setIsManualOpen(false)}
          onSelectBook={handleSelectBook}
        />

        <BookVerificationModal
          isOpen={isVerificationOpen}
          book={selectedBookForVerification}
          onClose={() => {
            setIsVerificationOpen(false);
            setSelectedBookForVerification(null);
          }}
          onOpenBasket={handleOpenBasketFromVerification}
          onAddAnother={handleAddAnotherBook}
        />

        <BasketModal
          isOpen={isBasketOpen}
          onClose={() => setIsBasketOpen(false)}
          onAddMoreBooks={() => setIsManualOpen(true)}
          onViewMyBooks={() => setStudentTab('buku-saya')}
        />
      </div>
    );
  }

  // ==========================================
  // RENDER ADMIN / TEACHER VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <AdminSidebar
          activeTab={adminTab}
          onTabChange={(tab) => setAdminTab(tab)}
          onOpenSystemSettings={() => setIsSystemSettingsOpen(true)}
        />
      </div>

      {/* Mobile Admin Header & Drawer */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileAdminMenuOpen(!mobileAdminMenuOpen)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileAdminMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-bold text-sm tracking-tight">SIPERPUS ADMIN</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-[11px] text-slate-400">Panel Perpustakaan</span>
          </div>
        </div>

        {mobileAdminMenuOpen && (
          <div className="bg-slate-900 border-t border-slate-800 p-2 space-y-1">
            <button
              type="button"
              onClick={() => {
                setAdminTab('dashboard');
                setMobileAdminMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                adminTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminTab('peminjaman');
                setMobileAdminMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                adminTab === 'peminjaman' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              Peminjaman Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminTab('pengembalian');
                setMobileAdminMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                adminTab === 'pengembalian' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              Pengembalian
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminTab('data-buku');
                setMobileAdminMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                adminTab === 'data-buku' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              Data Buku
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminTab('data-siswa');
                setMobileAdminMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                adminTab === 'data-siswa' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              Data Siswa
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminTab('notifikasi');
                setMobileAdminMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                adminTab === 'notifikasi' ? 'bg-blue-600 text-white' : 'text-slate-300'
              }`}
            >
              Notifikasi
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSystemSettingsOpen(true);
                setMobileAdminMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-white"
            >
              Pengaturan Sistem
            </button>
          </div>
        )}
      </div>

      {/* Main Admin Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader onOpenSystemSettings={() => setIsSystemSettingsOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {adminTab === 'dashboard' && (
            <AdminDashboard
              onNavigateTab={(tab) => setAdminTab(tab)}
              onOpenApprove={(rec) => setRecordForApprove(rec)}
              onOpenReject={(rec) => setRecordForReject(rec)}
              onOpenReturn={(rec) => setRecordForReturn(rec)}
            />
          )}

          {adminTab === 'peminjaman' && (
            <AdminBorrowings
              onOpenApprove={(rec) => setRecordForApprove(rec)}
              onOpenReject={(rec) => setRecordForReject(rec)}
            />
          )}

          {adminTab === 'pengembalian' && (
            <AdminReturns onOpenReturnModal={(rec) => setRecordForReturn(rec)} />
          )}

          {adminTab === 'data-buku' && (
            <AdminBooks
              onOpenAddBook={() => {
                setBookToEdit(null);
                setIsBookModalOpen(true);
              }}
              onOpenEditBook={(book) => {
                setBookToEdit(book);
                setIsBookModalOpen(true);
              }}
            />
          )}

          {adminTab === 'data-siswa' && (
            <AdminStudents
              onOpenAddStudent={() => {
                setStudentToEdit(null);
                setIsStudentModalOpen(true);
              }}
              onOpenEditStudent={(student) => {
                setStudentToEdit(student);
                setIsStudentModalOpen(true);
              }}
            />
          )}

          {adminTab === 'notifikasi' && <AdminNotifications />}
        </main>
      </div>

      {/* Admin Modals */}
      <ApproveBorrowModal
        isOpen={!!recordForApprove}
        record={recordForApprove}
        onClose={() => setRecordForApprove(null)}
        onConfirmApprove={handleConfirmApprove}
      />

      <ReturnProcessModal
        isOpen={!!recordForReturn}
        record={recordForReturn}
        onClose={() => setRecordForReturn(null)}
        onConfirmReturn={handleConfirmReturn}
      />

      <RejectReasonModal
        isOpen={!!recordForReject}
        studentName={recordForReject?.studentName}
        bookCount={recordForReject?.books.length}
        onClose={() => setRecordForReject(null)}
        onConfirmReject={handleConfirmReject}
      />

      <BookFormModal
        isOpen={isBookModalOpen}
        bookToEdit={bookToEdit}
        onClose={() => {
          setIsBookModalOpen(false);
          setBookToEdit(null);
        }}
        onSave={handleSaveBook}
      />

      <StudentFormModal
        isOpen={isStudentModalOpen}
        studentToEdit={studentToEdit}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
      />

      <SystemSettingsModal
        isOpen={isSystemSettingsOpen}
        onClose={() => setIsSystemSettingsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
