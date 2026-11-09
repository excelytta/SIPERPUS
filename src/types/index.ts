export type UserRole = 'SISWA' | 'ADMIN';

export type BookStatus = 'TERSEDIA' | 'DIPINJAM' | 'TIDAK TERSEDIA' | 'RUSAK' | 'HILANG';

export interface Book {
  code: string; // Numeric, e.g. "000123"
  title: string;
  subject: string; // e.g. "Matematika", "Fisika"
  classLevel: string; // e.g. "X", "XI", "XII"
  publisher: string;
  curriculum: string; // e.g. "Kurikulum Merdeka"
  year: number;
  status: BookStatus;
  shelfLocation: string; // e.g. "Rak A-02"
  totalCopies: number;
  availableCopies: number;
}

export interface Student {
  id: string;
  nisn: string; // Unique identifier used for login
  name: string;
  class: string;
  password?: string;
  isActive: boolean;
  joinedDate: string;
}

export interface AdminUser {
  id: string;
  nip: string; // NIP or Admin ID
  name: string;
  role: 'ADMIN';
  email: string;
  phone: string;
}

export type BorrowStatus = 
  | 'MENUNGGU_VERIFIKASI' 
  | 'DISETUJUI' 
  | 'DITOLAK' 
  | 'SEDANG_DIPINJAM' 
  | 'SELESAI';

export interface BorrowedBookItem {
  bookCode: string;
  title: string;
  subject: string;
  classLevel: string;
  returned: boolean;
  returnedDate?: string;
  returnCondition?: 'BAIK' | 'RUSAK' | 'HILANG';
}

export interface BorrowingRecord {
  id: string;
  studentNisn: string;
  studentName: string;
  studentClass: string;
  books: BorrowedBookItem[];
  status: BorrowStatus;
  requestDate: string; // ISO date string
  approvedDate?: string;
  dueDate?: string;
  completedDate?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';

export interface NotificationItem {
  id: string;
  recipientRole: 'SISWA' | 'ADMIN';
  recipientNisn?: string; // empty means all or role-based
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  referenceId?: string;
}

export type HistoryType = 'PEMINJAMAN' | 'PENGEMBALIAN' | 'PENOLAKAN';

export interface HistoryRecord {
  id: string;
  date: string;
  type: HistoryType;
  studentNisn: string;
  studentName: string;
  studentClass: string;
  bookCount: number;
  bookTitles: string[];
  status: string;
  notes?: string;
}
