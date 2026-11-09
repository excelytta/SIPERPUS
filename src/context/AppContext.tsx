import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Student,
  AdminUser,
  Book,
  BorrowingRecord,
  NotificationItem,
  HistoryRecord,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_ADMIN,
  INITIAL_BOOKS,
  INITIAL_BORROWINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_HISTORY,
} from '../data/mockData';

interface AppContextType {
  currentUser: Student | AdminUser | null;
  currentRole: UserRole | null;
  students: Student[];
  books: Book[];
  borrowingRecords: BorrowingRecord[];
  basket: Book[];
  notifications: NotificationItem[];
  history: HistoryRecord[];
  adminConfig: AdminUser;
  
  // Auth methods
  login: (identifier: string, password?: string, asAdmin?: boolean) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: UserRole, targetNisn?: string) => void;
  
  // Student basket & borrowing methods
  findBookByCode: (code: string) => { found: boolean; book?: Book; error?: string };
  addToBasket: (book: Book) => { success: boolean; message: string };
  removeFromBasket: (bookCode: string) => void;
  clearBasket: () => void;
  submitBorrowRequest: () => { success: boolean; message: string; recordId?: string };
  
  // Admin borrowing & return methods
  approveBorrowRequest: (recordId: string, notes?: string) => void;
  rejectBorrowRequest: (recordId: string, reason: string) => void;
  processReturn: (recordId: string, returnedBookCodes: string[], conditionNotes?: string) => { allReturned: boolean };
  
  // Notification methods
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Admin catalog & student management methods
  addBook: (book: Book) => { success: boolean; message: string };
  updateBook: (code: string, updates: Partial<Book>) => void;
  deleteBook: (code: string) => void;
  addStudent: (student: Omit<Student, 'id' | 'joinedDate'>) => { success: boolean; message: string };
  updateStudent: (nisn: string, updates: Partial<Student>) => void;
  resetStudentPassword: (nisn: string) => string;
  updateAdminProfile: (updates: Partial<AdminUser> & { password?: string }) => void;
  
  // System & Data management
  clearAllData: (newAdmin?: { name: string; nip: string; password?: string }) => void;
  restoreInitialSetup: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'siperpus_current_user',
  CURRENT_ROLE: 'siperpus_current_role',
  STUDENTS: 'siperpus_students',
  BOOKS: 'siperpus_books',
  BORROWINGS: 'siperpus_borrowings',
  BASKET: 'siperpus_basket',
  NOTIFICATIONS: 'siperpus_notifications',
  HISTORY: 'siperpus_history',
  ADMIN_CONFIG: 'siperpus_admin_config',
  ADMIN_PASSWORD: 'siperpus_admin_password',
  IS_CLEAN_SLATE: 'siperpus_is_clean_slate',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCleanSlate, setIsCleanSlate] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_CLEAN_SLATE) === 'true';
  });

  const [adminConfig, setAdminConfig] = useState<AdminUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN;
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || 'admin123';
  });

  // Load from localStorage or defaults
  const [students, setStudents] = useState<Student[]>(() => {
    const isClean = localStorage.getItem(STORAGE_KEYS.IS_CLEAN_SLATE) === 'true';
    if (isClean) {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const isClean = localStorage.getItem(STORAGE_KEYS.IS_CLEAN_SLATE) === 'true';
    if (isClean) {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [borrowingRecords, setBorrowingRecords] = useState<BorrowingRecord[]>(() => {
    const isClean = localStorage.getItem(STORAGE_KEYS.IS_CLEAN_SLATE) === 'true';
    if (isClean) {
      const saved = localStorage.getItem(STORAGE_KEYS.BORROWINGS);
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.BORROWINGS);
    return saved ? JSON.parse(saved) : INITIAL_BORROWINGS;
  });

  const [basket, setBasket] = useState<Book[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BASKET);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const isClean = localStorage.getItem(STORAGE_KEYS.IS_CLEAN_SLATE) === 'true';
    if (isClean) {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    const isClean = localStorage.getItem(STORAGE_KEYS.IS_CLEAN_SLATE) === 'true';
    if (isClean) {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  // Default to null so website opens directly on the login screen
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    return saved ? (saved as UserRole) : null;
  });

  const [currentUser, setCurrentUser] = useState<Student | AdminUser | null>(() => {
    const savedUser = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Synchronize initial clean database with custom demo accounts (NISN 66 & NIP 6)
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    const DB_VERSION_KEY = 'siperpus_db_version';
    const CURRENT_DB_VERSION = 'v8_empty_books_catalog';

    if (localStorage.getItem(DB_VERSION_KEY) !== CURRENT_DB_VERSION) {
      setAdminConfig(INITIAL_ADMIN);
      setAdminPassword('admin123');
      setStudents(INITIAL_STUDENTS);
      setBooks(INITIAL_BOOKS);
      setBorrowingRecords([]);
      setNotifications([]);
      setHistory([]);
      setBasket([]);
      localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    }
  }, []);

  // Persist states
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(borrowingRecords));
  }, [borrowingRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BASKET, JSON.stringify(basket));
  }, [basket]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_CLEAN_SLATE, String(isCleanSlate));
  }, [isCleanSlate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_CONFIG, JSON.stringify(adminConfig));
  }, [adminConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    if (currentRole) {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, currentRole);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    }
  }, [currentRole]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  // Auth implementation (supports unified login: automatically detects admin or student)
  const login = (identifier: string, password = '', asAdmin?: boolean) => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      return { success: false, message: 'Harap isi NISN siswa atau NIP petugas.' };
    }

    const isAdminIdentifier =
      trimmed === '6' ||
      trimmed === adminConfig.nip ||
      trimmed.toLowerCase() === 'admin' ||
      trimmed.toLowerCase() === adminConfig.email.toLowerCase();

    // If asAdmin was explicitly passed, or if auto-detected as admin
    if (asAdmin === true || (asAdmin === undefined && isAdminIdentifier)) {
      if (!isAdminIdentifier) {
        return { success: false, message: 'NIP / ID Petugas tidak terdaftar di sistem.' };
      }

      if (password && password !== adminPassword && password !== 'admin123') {
        return { success: false, message: 'Kata sandi petugas tidak sesuai.' };
      }

      setCurrentRole('ADMIN');
      setCurrentUser(adminConfig);
      return { success: true };
    }

    // Otherwise check for student by NISN
    const student =
      students.find((s) => s.nisn === trimmed) ||
      (trimmed === '66'
        ? {
            id: 'std-1',
            nisn: '66',
            name: 'Excel dan Afid (akun demo)',
            class: 'XII-5',
            password: '12345678*',
            isActive: true,
            joinedDate: '2026-07-15',
          }
        : undefined);

    if (student) {
      if (!student.isActive) {
        return { success: false, message: 'Akun siswa dinonaktifkan oleh pihak sekolah.' };
      }
      if (password && student.password && password !== student.password) {
        return { success: false, message: 'Kata sandi siswa tidak sesuai.' };
      }

      setCurrentRole('SISWA');
      setCurrentUser(student);
      return { success: true };
    }

    // If neither matches
    return {
      success: false,
      message: 'Nomor identitas (NISN / NIP) tidak ditemukan di sistem.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ROLE);
    setBasket([]);
  };

  const switchRole = (role: UserRole, targetNisn?: string) => {
    if (role === 'ADMIN') {
      setCurrentRole('ADMIN');
      setCurrentUser(adminConfig);
    } else {
      setCurrentRole('SISWA');
      const target = targetNisn
        ? students.find((s) => s.nisn === targetNisn)
        : students.length > 0
        ? students[0]
        : null;
      setCurrentUser(target || null);
    }
  };

  // Find book by code (Numbers only validation handled in UI too)
  const findBookByCode = (code: string) => {
    const trimmed = code.trim();
    if (!/^\d+$/.test(trimmed)) {
      return { found: false, error: 'Kode buku hanya boleh berisi angka.' };
    }

    const book = books.find((b) => b.code === trimmed);
    if (!book) {
      return { found: false, error: 'Kode buku tidak ditemukan di katalog perpustakaan.' };
    }

    if (book.status !== 'TERSEDIA' || book.availableCopies <= 0) {
      return {
        found: true,
        book,
        error: `Buku "${book.title}" sedang tidak tersedia (${book.status.toLowerCase()}).`,
      };
    }

    return { found: true, book };
  };

  // Student basket
  const addToBasket = (book: Book) => {
    if (basket.some((item) => item.code === book.code)) {
      return { success: false, message: `Buku "${book.title}" sudah ada di daftar peminjaman.` };
    }
    // Also check if already currently borrowed by this student
    const student = currentUser as Student;
    if (student) {
      const hasActive = borrowingRecords.some(
        (rec) =>
          rec.studentNisn === student.nisn &&
          (rec.status === 'SEDANG_DIPINJAM' || rec.status === 'MENUNGGU_VERIFIKASI') &&
          rec.books.some((b) => b.bookCode === book.code && !b.returned)
      );
      if (hasActive) {
        return {
          success: false,
          message: `Buku "${book.title}" sedang dalam status dipinjam atau menunggu verifikasi untuk akun Anda.`,
        };
      }
    }

    setBasket((prev) => [...prev, book]);
    return { success: true, message: `Buku "${book.title}" berhasil ditambahkan ke daftar peminjaman.` };
  };

  const removeFromBasket = (bookCode: string) => {
    setBasket((prev) => prev.filter((b) => b.code !== bookCode));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const submitBorrowRequest = () => {
    if (basket.length === 0) {
      return { success: false, message: 'Daftar peminjaman masih kosong.' };
    }
    if (!currentUser || currentRole !== 'SISWA') {
      return { success: false, message: 'Hanya siswa yang dapat mengajukan peminjaman buku.' };
    }

    const student = currentUser as Student;
    const newRecordId = `brw-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const newRecord: BorrowingRecord = {
      id: newRecordId,
      studentNisn: student.nisn,
      studentName: student.name,
      studentClass: student.class,
      books: basket.map((b) => ({
        bookCode: b.code,
        title: b.title,
        subject: b.subject,
        classLevel: b.classLevel,
        returned: false,
      })),
      status: 'MENUNGGU_VERIFIKASI',
      requestDate: nowIso,
    };

    setBorrowingRecords((prev) => [newRecord, ...prev]);

    // Student notification
    const studentNotif: NotificationItem = {
      id: `notif-${Date.now()}-std`,
      recipientRole: 'SISWA',
      recipientNisn: student.nisn,
      title: 'Pengajuan Peminjaman Terkirim',
      message: `Pengajuan peminjaman untuk ${basket.length} buku berhasil dikirim. Menunggu verifikasi admin perpustakaan.`,
      type: 'INFO',
      timestamp: nowIso,
      isRead: false,
      referenceId: newRecordId,
    };

    // Admin notification
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}-adm`,
      recipientRole: 'ADMIN',
      title: 'Pengajuan Peminjaman Baru',
      message: `${student.name} (${student.class}) mengajukan peminjaman ${basket.length} buku pelajaran.`,
      type: 'INFO',
      timestamp: nowIso,
      isRead: false,
      referenceId: newRecordId,
    };

    setNotifications((prev) => [studentNotif, adminNotif, ...prev]);

    // Clear basket
    setBasket([]);

    return {
      success: true,
      message: 'Pengajuan peminjaman berhasil dikirim. Menunggu verifikasi admin.',
      recordId: newRecordId,
    };
  };

  // Admin approves request
  const approveBorrowRequest = (recordId: string, notes?: string) => {
    const record = borrowingRecords.find((r) => r.id === recordId);
    if (!record) return;

    const now = new Date();
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 6); // 1 semester (6 bulan) durasi peminjaman buku pelajaran

    const updatedRecords = borrowingRecords.map((r) => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'SEDANG_DIPINJAM' as const,
          approvedDate: now.toISOString(),
          dueDate: dueDate.toISOString(),
          adminNotes: notes || 'Disetujui oleh petugas perpustakaan untuk 1 semester.',
        };
      }
      return r;
    });

    setBorrowingRecords(updatedRecords);

    // Update book stock in catalog
    const bookCodes = record.books.map((b) => b.bookCode);
    setBooks((prev) =>
      prev.map((book) => {
        if (bookCodes.includes(book.code)) {
          const newAvailable = Math.max(0, book.availableCopies - 1);
          return {
            ...book,
            availableCopies: newAvailable,
            status: newAvailable === 0 ? 'DIPINJAM' : book.status,
          };
        }
        return book;
      })
    );

    // Notifications
    const studentNotif: NotificationItem = {
      id: `notif-${Date.now()}-apprv`,
      recipientRole: 'SISWA',
      recipientNisn: record.studentNisn,
      title: 'Peminjaman Telah Disetujui (1 Semester)',
      message: `Peminjaman ${record.books.length} buku pelajaran telah disetujui untuk 1 semester. Batas pengembalian adalah ${dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
      type: 'SUCCESS',
      timestamp: now.toISOString(),
      isRead: false,
      referenceId: record.id,
    };

    setNotifications((prev) => [studentNotif, ...prev]);

    // Add to history
    const historyItem: HistoryRecord = {
      id: `hist-${Date.now()}`,
      date: now.toISOString(),
      type: 'PEMINJAMAN',
      studentNisn: record.studentNisn,
      studentName: record.studentName,
      studentClass: record.studentClass,
      bookCount: record.books.length,
      bookTitles: record.books.map((b) => b.title),
      status: 'Sedang Dipinjam',
      notes: notes || 'Diverifikasi petugas perpustakaan.',
    };
    setHistory((prev) => [historyItem, ...prev]);
  };

  // Admin rejects request
  const rejectBorrowRequest = (recordId: string, reason: string) => {
    const record = borrowingRecords.find((r) => r.id === recordId);
    if (!record) return;

    const now = new Date().toISOString();

    const updated = borrowingRecords.map((r) => {
      if (r.id === recordId) {
        return {
          ...r,
          status: 'DITOLAK' as const,
          rejectionReason: reason,
        };
      }
      return r;
    });

    setBorrowingRecords(updated);

    // Notification to student
    const studentNotif: NotificationItem = {
      id: `notif-${Date.now()}-rej`,
      recipientRole: 'SISWA',
      recipientNisn: record.studentNisn,
      title: 'Peminjaman Ditolak',
      message: `Pengajuan peminjaman tidak disetujui. Alasan: ${reason}`,
      type: 'ALERT',
      timestamp: now,
      isRead: false,
      referenceId: record.id,
    };

    setNotifications((prev) => [studentNotif, ...prev]);

    // History record
    const historyItem: HistoryRecord = {
      id: `hist-${Date.now()}`,
      date: now,
      type: 'PENOLAKAN',
      studentNisn: record.studentNisn,
      studentName: record.studentName,
      studentClass: record.studentClass,
      bookCount: record.books.length,
      bookTitles: record.books.map((b) => b.title),
      status: 'Ditolak',
      notes: reason,
    };
    setHistory((prev) => [historyItem, ...prev]);
  };

  // Admin processes physical book return (supports partial returns!)
  const processReturn = (recordId: string, returnedBookCodes: string[], conditionNotes?: string) => {
    const record = borrowingRecords.find((r) => r.id === recordId);
    if (!record) return { allReturned: false };

    const now = new Date().toISOString();

    // Mark books as returned
    const updatedBooks = record.books.map((b) => {
      if (returnedBookCodes.includes(b.bookCode)) {
        return {
          ...b,
          returned: true,
          returnedDate: now,
          returnCondition: 'BAIK' as const,
        };
      }
      return b;
    });

    const allReturned = updatedBooks.every((b) => b.returned);
    const newlyReturnedCount = returnedBookCodes.length;

    const updatedRecords = borrowingRecords.map((r) => {
      if (r.id === recordId) {
        return {
          ...r,
          books: updatedBooks,
          status: allReturned ? ('SELESAI' as const) : ('SEDANG_DIPINJAM' as const),
          completedDate: allReturned ? now : undefined,
          adminNotes: conditionNotes || (allReturned ? 'Pengembalian lengkap dan selesai.' : `Pengembalian sebagian (${newlyReturnedCount} buku).`),
        };
      }
      return r;
    });

    setBorrowingRecords(updatedRecords);

    // Increase copies in book catalog
    setBooks((prev) =>
      prev.map((b) => {
        if (returnedBookCodes.includes(b.code)) {
          const newAvailable = Math.min(b.totalCopies, b.availableCopies + 1);
          return {
            ...b,
            availableCopies: newAvailable,
            status: 'TERSEDIA',
          };
        }
        return b;
      })
    );

    // Send student notification
    const studentNotif: NotificationItem = {
      id: `notif-${Date.now()}-ret`,
      recipientRole: 'SISWA',
      recipientNisn: record.studentNisn,
      title: allReturned ? 'Pengembalian Selesai' : 'Pengembalian Sebagian Dicatat',
      message: allReturned
        ? `Seluruh buku (${record.books.length} buku) telah berhasil dikembalikan ke perpustakaan. Peminjaman selesai.`
        : `${newlyReturnedCount} buku telah dikembalikan. Masih ada buku yang belum dikembalikan.`,
      type: allReturned ? 'SUCCESS' : 'WARNING',
      timestamp: now,
      isRead: false,
      referenceId: record.id,
    };

    setNotifications((prev) => [studentNotif, ...prev]);

    // Add to history
    const returnedTitles = record.books
      .filter((b) => returnedBookCodes.includes(b.bookCode))
      .map((b) => b.title);

    const historyItem: HistoryRecord = {
      id: `hist-${Date.now()}`,
      date: now,
      type: 'PENGEMBALIAN',
      studentNisn: record.studentNisn,
      studentName: record.studentName,
      studentClass: record.studentClass,
      bookCount: newlyReturnedCount,
      bookTitles: returnedTitles,
      status: allReturned ? 'Selesai' : 'Sebagian Selesai',
      notes: conditionNotes || (allReturned ? 'Semua buku kembali utuh.' : 'Sisa buku masih dipinjam.'),
    };
    setHistory((prev) => [historyItem, ...prev]);

    return { allReturned };
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Catalog management by admin
  const addBook = (bookData: Book) => {
    if (books.some((b) => b.code === bookData.code)) {
      return { success: false, message: `Kode buku ${bookData.code} sudah digunakan.` };
    }
    setBooks((prev) => [bookData, ...prev]);
    return { success: true, message: `Buku "${bookData.title}" berhasil ditambahkan.` };
  };

  const updateBook = (code: string, updates: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.code === code ? { ...b, ...updates } : b))
    );
  };

  const deleteBook = (code: string) => {
    setBooks((prev) => prev.filter((b) => b.code !== code));
  };

  // Student management by admin
  const addStudent = (studentData: Omit<Student, 'id' | 'joinedDate'>) => {
    if (students.some((s) => s.nisn === studentData.nisn)) {
      return { success: false, message: `NISN ${studentData.nisn} sudah terdaftar.` };
    }
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now().toString().slice(-6)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      password: studentData.password || 'password123',
    };
    setStudents((prev) => [newStudent, ...prev]);
    return { success: true, message: `Siswa "${studentData.name}" berhasil didaftarkan.` };
  };

  const updateStudent = (nisn: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.nisn === nisn ? { ...s, ...updates } : s))
    );
  };

  const resetStudentPassword = (nisn: string) => {
    const defaultPass = 'password123';
    updateStudent(nisn, { password: defaultPass });
    return defaultPass;
  };

  const updateAdminProfile = (updates: Partial<AdminUser> & { password?: string }) => {
    const { password, ...adminFields } = updates;
    setAdminConfig((prev) => ({ ...prev, ...adminFields }));
    if (password) {
      setAdminPassword(password);
    }
    if (currentRole === 'ADMIN') {
      setCurrentUser((prev) => (prev ? { ...prev, ...adminFields } : prev));
    }
  };

  const clearAllData = (newAdmin?: { name: string; nip: string; password?: string }) => {
    setIsCleanSlate(true);
    setBooks([]);
    setStudents([]);
    setBorrowingRecords([]);
    setNotifications([]);
    setHistory([]);
    setBasket([]);

    if (newAdmin) {
      const updatedAdmin: AdminUser = {
        id: 'admin-custom',
        nip: newAdmin.nip.trim() || 'admin',
        name: newAdmin.name.trim() || 'Petugas Perpustakaan',
        role: 'ADMIN',
        email: 'perpustakaan@sekolah.sch.id',
        phone: '',
      };
      setAdminConfig(updatedAdmin);
      if (newAdmin.password) {
        setAdminPassword(newAdmin.password);
      }
      setCurrentRole('ADMIN');
      setCurrentUser(updatedAdmin);
    } else {
      setCurrentRole('ADMIN');
      setCurrentUser(adminConfig);
    }
  };

  const restoreInitialSetup = () => {
    localStorage.clear();
    setIsCleanSlate(false);
    setAdminConfig(INITIAL_ADMIN);
    setAdminPassword('admin123');
    setStudents(INITIAL_STUDENTS);
    setBooks(INITIAL_BOOKS);
    setBorrowingRecords(INITIAL_BORROWINGS);
    setBasket([]);
    sessionStorage.clear();
    setNotifications(INITIAL_NOTIFICATIONS);
    setHistory(INITIAL_HISTORY);
    setCurrentRole(null);
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        students,
        books,
        borrowingRecords,
        basket,
        notifications,
        history,
        adminConfig,
        login,
        logout,
        switchRole,
        findBookByCode,
        addToBasket,
        removeFromBasket,
        clearBasket,
        submitBorrowRequest,
        approveBorrowRequest,
        rejectBorrowRequest,
        processReturn,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addBook,
        updateBook,
        deleteBook,
        addStudent,
        updateStudent,
        resetStudentPassword,
        updateAdminProfile,
        clearAllData,
        restoreInitialSetup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
