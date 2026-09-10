/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import * as ppdbService from '../services/ppdbService';
import * as dataService from '../services/dataService';
import {
  NewsItem, Teacher, GalleryItem, PPDBRegistration, AcademicAgenda,
  DownloadFile, Book, MessageFeedback, Student, Alumni, ActivityLog
} from '../types';
import {
  initialNews, initialTeachers, initialGallery, initialPpdb,
  initialAgendas, initialDownloads, initialBooks, initialFeedbacks,
  initialStudents, initialAlumni, initialActivityLogs
} from '../data/defaultData';

interface SchoolContextType {
  news: NewsItem[];
  teachers: Teacher[];
  gallery: GalleryItem[];
  ppdbList: PPDBRegistration[];
  agendas: AcademicAgenda[];
  downloads: DownloadFile[];
  books: Book[];
  feedbacks: MessageFeedback[];
  students: Student[];
  alumni: Alumni[];
  activityLogs: ActivityLog[];
  
  // Auth state
  isAdminLoggedIn: boolean;
  adminRole: 'Admin Utama' | 'Staf Humas' | 'OSIM' | null;
  studentAuth: { name: string; nisn: string } | null;

  // Actions
  addNews: (item: Omit<NewsItem, 'id' | 'views'>) => void;
  deleteNews: (id: string) => void;
  updateNews: (id: string, item: Partial<NewsItem>) => void;
  addTeacher: (item: Omit<Teacher, 'id'>) => void;
  deleteTeacher: (id: string) => void;
  updateTeacher: (id: string, item: Partial<Teacher>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  submitPpdb: (form: Omit<PPDBRegistration, 'id' | 'regNumber' | 'status' | 'createdAt' | 'submittedFiles'>, files: { rapor: File | null; kk: File | null; ijazah: File | null }) => Promise<string>;
  updatePpdbStatus: (id: string, status: 'Verified' | 'Rejected') => Promise<void>;
  deletePpdb: (id: string) => Promise<void>;
  fetchPpdbList: () => Promise<void>;
  addAgenda: (item: Omit<AcademicAgenda, 'id'>) => void;
  deleteAgenda: (id: string) => void;
  updateAgenda: (id: string, item: Partial<AcademicAgenda>) => void;
  addDownloadFile: (item: Omit<DownloadFile, 'id' | 'downloadsCount'>) => void;
  deleteDownloadFile: (id: string) => void;
  updateDownloadFile: (id: string, item: Partial<DownloadFile>) => void;
  incrementDownload: (id: string) => void;
  submitFeedback: (item: Omit<MessageFeedback, 'id' | 'createdAt' | 'read'>) => void;
  markFeedbackRead: (id: string) => void;
  deleteFeedback: (id: string) => void;
  
  addBook: (item: Omit<Book, 'id'>) => void;
  deleteBook: (id: string) => void;
  updateBook: (id: string, item: Partial<Book>) => void;
  addStudent: (item: Omit<Student, 'id'>) => void;
  deleteStudent: (id: string) => void;
  updateStudent: (id: string, item: Partial<Student>) => void;
  addAlumni: (item: Omit<Alumni, 'id'>) => void;
  deleteAlumni: (id: string) => void;
  updateAlumni: (id: string, item: Partial<Alumni>) => void;
  addActivityLog: (operatorName: string, role: 'Admin Utama' | 'Staf Humas' | 'OSIM', action: string, details: string) => void;
  
  // Auth handlers
  loginAdmin: (password: string, role?: 'Admin Utama' | 'Staf Humas' | 'OSIM') => Promise<boolean>;
    logoutAdmin: () => void;
  loginStudent: (name: string, nisn: string) => boolean;
  logoutStudent: () => void;

  // Theme support
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [ppdbList, setPpdbList] = useState<PPDBRegistration[]>(initialPpdb);
  const [agendas, setAgendas] = useState<AcademicAgenda[]>(initialAgendas);
  const [downloads, setDownloads] = useState<DownloadFile[]>(initialDownloads);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [feedbacks, setFeedbacks] = useState<MessageFeedback[]>(initialFeedbacks);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [alumni, setAlumni] = useState<Alumni[]>(initialAlumni);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('man_lhokseumawe_theme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('man_lhokseumawe_theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('man_lhokseumawe_admin_auth') === 'true';
  });

  const [adminRole, setAdminRole] = useState<'Admin Utama' | 'Staf Humas' | 'OSIM' | null>(() => {
    return localStorage.getItem('man_lhokseumawe_admin_role') as any || null;
  });

  const [studentAuth, setStudentAuth] = useState<{ name: string; nisn: string } | null>(() => {
    const saved = localStorage.getItem('man_lhokseumawe_student_auth');
    return saved ? JSON.parse(saved) : null;
  });


  // 1. Fetch all data from MongoDB on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          newsData, teachersData, galleryData, agendasData, 
          downloadsData, booksData, feedbacksData, studentsData, 
          alumniData, logsData
        ] = await Promise.all([
          dataService.newsService.getAll().catch(() => initialNews),
          dataService.teacherService.getAll().catch(() => initialTeachers),
          dataService.galleryService.getAll().catch(() => initialGallery),
          dataService.agendaService.getAll().catch(() => initialAgendas),
          dataService.downloadService.getAll().catch(() => initialDownloads),
          dataService.bookService.getAll().catch(() => initialBooks),
          dataService.feedbackService.getAll().catch(() => initialFeedbacks),
          dataService.studentService.getAll().catch(() => initialStudents),
          dataService.alumniService.getAll().catch(() => initialAlumni),
          dataService.logService.getAll().catch(() => initialActivityLogs)
        ]);
        
        newsData.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        logsData.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));

        setNews(newsData.length ? newsData : initialNews);
        setTeachers(teachersData.length ? teachersData : initialTeachers);
        setGallery(galleryData.length ? galleryData : initialGallery);
        setAgendas(agendasData.length ? agendasData : initialAgendas);
        setDownloads(downloadsData.length ? downloadsData : initialDownloads);
        setBooks(booksData.length ? booksData : initialBooks);
        setFeedbacks(feedbacksData.length ? feedbacksData : initialFeedbacks);
        setStudents(studentsData.length ? studentsData : initialStudents);
        setAlumni(alumniData.length ? alumniData : initialAlumni);
        setActivityLogs(logsData.length ? logsData : initialActivityLogs);
      } catch (error) {
        console.error("Failed to fetch data from MongoDB:", error);
      }
    };
    fetchData();
  }, []);


  // Auth Operations
  // Login via backend API (JWT)
  const loginAdmin = async (password: string, role?: 'Admin Utama' | 'Staf Humas' | 'OSIM'): Promise<boolean> => {
    const selectedRole = role || 'Admin Utama';
    try {
      await authService.login(selectedRole, password);
      setIsAdminLoggedIn(true);
      setAdminRole(selectedRole);

      // Log the login event
      const operator = selectedRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : selectedRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
      addActivityLog(operator, selectedRole, 'Admin Login', `Berhasil melakukan autentikasi sistem.`);

      // Fetch PPDB data after successful login
      fetchPpdbList();

      return true;
    } catch (error: any) {
      console.error('Login failed:', error?.response?.data?.message || error.message);
      return false;
    }
  };


  const logoutAdmin = () => {
    if (adminRole) {
      const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
      addActivityLog(operator, adminRole, 'Admin Logout', `Keluar dari sistem secara aman.`);
    }
    setIsAdminLoggedIn(false);
    setAdminRole(null);
    authService.logout(); // Clear JWT token
    localStorage.removeItem('man_lhokseumawe_admin_auth');
    localStorage.removeItem('man_lhokseumawe_admin_role');
      };

  const loginStudent = (name: string, nisn: string) => {
    if (name.trim() && nisn.length >= 5) {
      const authObj = { name, nisn };
      setStudentAuth(authObj);
      localStorage.setItem('man_lhokseumawe_student_auth', JSON.stringify(authObj));
      return true;
    }
    return false;
  };

  const logoutStudent = () => {
    setStudentAuth(null);
    localStorage.removeItem('man_lhokseumawe_student_auth');
  };

  const addActivityLog = (operatorName: string, role: 'Admin Utama' | 'Staf Humas' | 'OSIM', action: string, details: string) => {
    dataService.logService.create({ operatorName, operatorRole: role, action, details, timestamp: new Date().toISOString() } as any).then(data => setActivityLogs(prev => [data, ...prev])).catch(console.error);
  };

  const addBook = (item: Omit<Book, 'id'>) => {
    dataService.bookService.create({ ...item } as any).then(() => window.location.reload()).catch(console.error);
  };

  const deleteBook = (id: string) => {
    dataService.bookService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  const addStudent = (item: Omit<Student, 'id'>) => {
    dataService.studentService.create({ ...item } as any).then(() => window.location.reload()).catch(console.error);
  };

  const deleteStudent = (id: string) => {
    dataService.studentService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  const addAlumni = (item: Omit<Alumni, 'id'>) => {
    dataService.alumniService.create({ ...item } as any).then(() => window.location.reload()).catch(console.error);
  };

  const deleteAlumni = (id: string) => {
    dataService.alumniService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  const updateBook = (id: string, item: Partial<Book>) => {
    dataService.bookService.update(id, item).then(() => window.location.reload()).catch(console.error);
  };

  const updateStudent = (id: string, item: Partial<Student>) => {
    dataService.studentService.update(id, item).then(() => window.location.reload()).catch(console.error);
  };

  const updateAlumni = (id: string, item: Partial<Alumni>) => {
    dataService.alumniService.update(id, item).then(() => window.location.reload()).catch(console.error);
  };

  // CRUD Actions using Firestore backend (Writes standard entities with strict error checks)
  const addNews = (item: Omit<NewsItem, 'id' | 'views'>) => {
    dataService.newsService.create({ ...item, views: 0 } as any).then(() => window.location.reload()).catch(console.error);
  };

  const deleteNews = (id: string) => {
    dataService.newsService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  const updateNews = (id: string, item: Partial<NewsItem>) => {
    dataService.newsService.update(id, item).then(() => window.location.reload()).catch(console.error);
  };

  const addTeacher = (item: Omit<Teacher, 'id'>) => {
    dataService.teacherService.create({ ...item } as any).then(() => window.location.reload()).catch(console.error);
  };

  const deleteTeacher = (id: string) => {
    dataService.teacherService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  const updateTeacher = (id: string, item: Partial<Teacher>) => {
    dataService.teacherService.update(id, item).then(() => window.location.reload()).catch(console.error);
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    dataService.galleryService.create({ ...item } as any).then(() => window.location.reload()).catch(console.error);
  };

  const deleteGalleryItem = (id: string) => {
    dataService.galleryService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  // Fetch PPDB data from backend API
  const fetchPpdbList = useCallback(async () => {
    try {
      const data = await ppdbService.getRegistrations();
      setPpdbList(data);
    } catch (error: any) {
      console.warn('Failed to fetch PPDB from backend, using initial data.', error?.message);
      setPpdbList(initialPpdb);
    }
  }, []);

  // Load PPDB data on mount if admin is logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchPpdbList();
    }
  }, [isAdminLoggedIn, fetchPpdbList]);

  // Submit PPDB via backend API
  const submitPpdb = async (
    form: Omit<PPDBRegistration, 'id' | 'regNumber' | 'status' | 'createdAt' | 'submittedFiles'>,
    files: { rapor: File | null; kk: File | null; ijazah: File | null }
  ): Promise<string> => {
    try {
      const result = await ppdbService.submitRegistration(
        {
          fullName: form.fullName,
          nisn: form.nisn,
          email: form.email,
          phone: form.phone,
          schoolOrigin: form.schoolOrigin,
          birthDate: form.birthDate,
          birthPlace: form.birthPlace,
          gender: form.gender,
          religion: form.religion,
          address: form.address,
          guardianName: form.guardianName,
          guardianPhone: form.guardianPhone,
          raporScore: Number(form.raporScore),
        },
        files
      );

      // Refresh the PPDB list after successful submission
      if (isAdminLoggedIn) {
        fetchPpdbList();
      }

      return result.regNumber;
    } catch (error: any) {
      console.error('PPDB submission failed:', error?.response?.data?.message || error.message);
      throw error;
    }
  };

  // Update PPDB status via backend API
  const updatePpdbStatus = async (id: string, status: 'Verified' | 'Rejected'): Promise<void> => {
    try {
      await ppdbService.updateStatus(id, status);
      // Refresh list after status update
      fetchPpdbList();
    } catch (error: any) {
      console.error('Status update failed:', error?.response?.data?.message || error.message);
    }
  };

  // Delete PPDB registration via backend API
  const deletePpdb = async (id: string): Promise<void> => {
    try {
      await ppdbService.deleteRegistration(id);
      // Refresh list after deletion
      fetchPpdbList();
    } catch (error: any) {
      console.error('Delete failed:', error?.response?.data?.message || error.message);
    }
  };

  const addAgenda = (item: Omit<AcademicAgenda, 'id'>) => {
    dataService.agendaService.create({ ...item } as any).then(() => window.location.reload()).catch(console.error);
  };

  const deleteAgenda = (id: string) => {
    dataService.agendaService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  const addDownloadFile = (item: Omit<DownloadFile, 'id' | 'downloadsCount'>) => {
    dataService.downloadService.create({ ...item, downloadsCount: 0 } as any).then(() => window.location.reload()).catch(console.error);
  };

  const deleteDownloadFile = (id: string) => {
    dataService.downloadService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  const updateDownloadFile = (id: string, item: Partial<DownloadFile>) => {
    dataService.downloadService.update(id, item).then(() => window.location.reload()).catch(console.error);
  };

  const updateAgenda = (id: string, item: Partial<AcademicAgenda>) => {
    dataService.agendaService.update(id, item).then(() => window.location.reload()).catch(console.error);
  };

  const incrementDownload = (id: string) => {
    const file = downloads.find(d => d.id === id);
    if(file) dataService.downloadService.update(id, { downloadsCount: file.downloadsCount + 1 }).catch(console.error);
  };

  const submitFeedback = (item: Omit<MessageFeedback, 'id' | 'createdAt' | 'read'>) => {
    dataService.feedbackService.create({ ...item, createdAt: new Date().toISOString(), read: false } as any).then(() => window.location.reload()).catch(console.error);
  };

  const markFeedbackRead = (id: string) => {
    dataService.feedbackService.update(id, { read: true }).then(() => window.location.reload()).catch(console.error);
  };

  const deleteFeedback = (id: string) => {
    dataService.feedbackService.delete(id).then(() => window.location.reload()).catch(console.error);
  };

  return (
    <SchoolContext.Provider value={{
      news,
      teachers,
      gallery,
      ppdbList,
      agendas,
      downloads,
      books,
      feedbacks,
      students,
      alumni,
      activityLogs,
      isAdminLoggedIn,
      adminRole,
      studentAuth,
      addNews,
      deleteNews,
      updateNews,
      addTeacher,
      deleteTeacher,
      updateTeacher,
      addGalleryItem,
      deleteGalleryItem,
      submitPpdb,
      updatePpdbStatus,
      fetchPpdbList,
      deletePpdb,
      addAgenda,
      deleteAgenda,
      updateAgenda,
      addDownloadFile,
      deleteDownloadFile,
      updateDownloadFile,
      incrementDownload,
      submitFeedback,
      markFeedbackRead,
      deleteFeedback,
      addBook,
      deleteBook,
      updateBook,
      addStudent,
      deleteStudent,
      updateStudent,
      addAlumni,
      deleteAlumni,
      updateAlumni,
      addActivityLog,
      loginAdmin,
            logoutAdmin,
      loginStudent,
      logoutStudent,
      theme,
      toggleTheme
    }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}
