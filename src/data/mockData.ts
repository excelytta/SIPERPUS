import { Book, Student, AdminUser, BorrowingRecord, NotificationItem, HistoryRecord } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    nisn: '66',
    name: 'Excel dan Afid (akun demo)',
    class: 'XII-5',
    password: '12345678*',
    isActive: true,
    joinedDate: '2026-07-15',
  },
];

export const INITIAL_ADMIN: AdminUser = {
  id: 'adm-1',
  nip: '6',
  name: 'Petugas Perpustakaan SMAN 3',
  role: 'ADMIN',
  email: 'admin.perpus@smagajo.sch.id',
  phone: '081234567890',
};

export const INITIAL_BOOKS: Book[] = [];

export const INITIAL_BORROWINGS: BorrowingRecord[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_HISTORY: HistoryRecord[] = [];
