/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NewsItem, Teacher, GalleryItem, PPDBRegistration, AcademicAgenda, DownloadFile, Book, MessageFeedback, Student, Alumni, ActivityLog } from '../types';
import { 
  initialNews, 
  initialTeachers, 
  initialGallery, 
  initialPpdb, 
  initialAgendas, 
  initialDownloads, 
  initialBooks,
  initialFeedbacks,
  initialStudents,
  initialAlumni,
  initialActivityLogs
} from '../data/defaultData';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import * as authService from '../services/authService';
import * as ppdbService from '../services/ppdbService';

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
  signInWithGoogle: () => Promise<void>;
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

  // 1. Listen to real-time changes in Firestore with fallback to template arrays if database is empty or offline
  useEffect(() => {
    const unsubNews = onSnapshot(collection(db, 'news'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NewsItem));
        list.sort((a, b) => b.date.localeCompare(a.date));
        setNews(list);
      } else {
        setNews(initialNews);
      }
    }, (error) => {
      console.warn("Firestore news fetch failed, displaying template fallback.", error);
    });

    const unsubTeachers = onSnapshot(collection(db, 'teachers'), (snapshot) => {
      if (!snapshot.empty) {
        setTeachers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Teacher)));
      } else {
        setTeachers(initialTeachers);
      }
    }, (error) => {
      console.warn("Firestore teachers fetch failed.", error);
    });

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      if (!snapshot.empty) {
        setGallery(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)));
      } else {
        setGallery(initialGallery);
      }
    }, (error) => {
      console.warn("Firestore gallery fetch failed.", error);
    });

    // PPDB data is now fetched from the backend API instead of Firestore
    // Removed Firestore onSnapshot for ppdb collection
    const unsubPpdb = () => {}; // placeholder for cleanup consistency

    const unsubAgendas = onSnapshot(collection(db, 'agendas'), (snapshot) => {
      if (!snapshot.empty) {
        setAgendas(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AcademicAgenda)));
      } else {
        setAgendas(initialAgendas);
      }
    }, (error) => {
      console.warn("Firestore agendas fetch failed.", error);
    });

    const unsubDownloads = onSnapshot(collection(db, 'downloads'), (snapshot) => {
      if (!snapshot.empty) {
        setDownloads(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DownloadFile)));
      } else {
        setDownloads(initialDownloads);
      }
    }, (error) => {
      console.warn("Firestore downloads fetch failed.", error);
    });

    const unsubFeedbacks = onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
      if (!snapshot.empty) {
        setFeedbacks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MessageFeedback)));
      } else {
        setFeedbacks(initialFeedbacks);
      }
    }, (error) => {
      console.warn("Firestore feedbacks fetch failed.", error);
    });

    const unsubBooks = onSnapshot(collection(db, 'books'), (snapshot) => {
      if (!snapshot.empty) {
        setBooks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Book)));
      } else {
        setBooks(initialBooks);
      }
    }, (error) => {
      console.warn("Firestore books fetch failed.", error);
    });

    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      if (!snapshot.empty) {
        setStudents(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Student)));
      } else {
        setStudents(initialStudents);
      }
    }, (error) => {
      console.warn("Firestore students fetch failed.", error);
    });

    const unsubAlumni = onSnapshot(collection(db, 'alumni'), (snapshot) => {
      if (!snapshot.empty) {
        setAlumni(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Alumni)));
      } else {
        setAlumni(initialAlumni);
      }
    }, (error) => {
      console.warn("Firestore alumni fetch failed.", error);
    });

    const unsubLogs = onSnapshot(collection(db, 'activityLogs'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
        list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setActivityLogs(list);
      } else {
        setActivityLogs(initialActivityLogs);
      }
    }, (error) => {
      console.warn("Firestore activityLogs fetch failed.", error);
    });

    return () => {
      unsubNews();
      unsubTeachers();
      unsubGallery();
      unsubPpdb();
      unsubAgendas();
      unsubDownloads();
      unsubFeedbacks();
      unsubBooks();
      unsubStudents();
      unsubAlumni();
      unsubLogs();
    };
  }, []);

  // 2. Auth Status Listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'khairuzzikriii@gmail.com') {
          setIsAdminLoggedIn(true);
          localStorage.setItem('man_lhokseumawe_admin_auth', 'true');
        }
      }
    });
    return unsubAuth;
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

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign in failed:", error);
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
    signOut(auth).catch((err) => console.warn("Firebase Sign out failed", err));
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
    const logId = `log-${Date.now()}`;
    const newLogObj: ActivityLog = {
      id: logId,
      operatorName,
      operatorRole: role,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setDoc(doc(db, 'activityLogs', logId), newLogObj)
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `activityLogs/${logId}`));
  };

  const addBook = (item: Omit<Book, 'id'>) => {
    const id = `book-${Date.now()}`;
    const newItem = { id, ...item };
    setDoc(doc(db, 'books', id), newItem)
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Tambah E-Pustaka', `Buku: ${item.title}, ISBN: ${item.isbn}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `books/${id}`));
  };

  const deleteBook = (id: string) => {
    deleteDoc(doc(db, 'books', id))
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Hapus E-Pustaka', `ID Buku: ${id}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `books/${id}`));
  };

  const addStudent = (item: Omit<Student, 'id'>) => {
    const id = `stu-${Date.now()}`;
    const newItem = { id, ...item };
    setDoc(doc(db, 'students', id), newItem)
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Tambah Data Siswa', `Nama: ${item.name}, NISN: ${item.nisn}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `students/${id}`));
  };

  const deleteStudent = (id: string) => {
    deleteDoc(doc(db, 'students', id))
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Hapus Data Siswa', `ID Siswa: ${id}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `students/${id}`));
  };

  const addAlumni = (item: Omit<Alumni, 'id'>) => {
    const id = `alum-${Date.now()}`;
    const newItem = { id, ...item };
    setDoc(doc(db, 'alumni', id), newItem)
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Tambah Data Alumni', `Nama: ${item.name}, Angkatan: ${item.graduationYear}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `alumni/${id}`));
  };

  const deleteAlumni = (id: string) => {
    deleteDoc(doc(db, 'alumni', id))
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Hapus Data Alumni', `ID Alumni: ${id}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `alumni/${id}`));
  };

  const updateBook = (id: string, item: Partial<Book>) => {
    updateDoc(doc(db, 'books', id), item)
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Edit E-Pustaka', `ID Buku: ${id}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `books/${id}`));
  };

  const updateStudent = (id: string, item: Partial<Student>) => {
    updateDoc(doc(db, 'students', id), item)
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Edit Data Siswa', `ID Siswa: ${id}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `students/${id}`));
  };

  const updateAlumni = (id: string, item: Partial<Alumni>) => {
    updateDoc(doc(db, 'alumni', id), item)
      .then(() => {
        if (adminRole) {
          const operator = adminRole === 'Admin Utama' ? 'Drs. H. Sofyan, M.Pd' : adminRole === 'Staf Humas' ? 'Humas MAN Lhokseumawe' : 'Ketua OSIM';
          addActivityLog(operator, adminRole, 'Edit Data Alumni', `ID Alumni: ${id}`);
        }
      })
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `alumni/${id}`));
  };

  // CRUD Actions using Firestore backend (Writes standard entities with strict error checks)
  const addNews = (item: Omit<NewsItem, 'id' | 'views'>) => {
    const newsId = `news-${Date.now()}`;
    const newItem = {
      ...item,
      views: 0
    };
    setDoc(doc(db, 'news', newsId), newItem)
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `news/${newsId}`));
  };

  const deleteNews = (id: string) => {
    deleteDoc(doc(db, 'news', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `news/${id}`));
  };

  const updateNews = (id: string, item: Partial<NewsItem>) => {
    updateDoc(doc(db, 'news', id), item)
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `news/${id}`));
  };

  const addTeacher = (item: Omit<Teacher, 'id'>) => {
    const id = `t-${Date.now()}`;
    setDoc(doc(db, 'teachers', id), item)
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `teachers/${id}`));
  };

  const deleteTeacher = (id: string) => {
    deleteDoc(doc(db, 'teachers', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `teachers/${id}`));
  };

  const updateTeacher = (id: string, item: Partial<Teacher>) => {
    updateDoc(doc(db, 'teachers', id), item)
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `teachers/${id}`));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const id = `g-${Date.now()}`;
    setDoc(doc(db, 'gallery', id), item)
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `gallery/${id}`));
  };

  const deleteGalleryItem = (id: string) => {
    deleteDoc(doc(db, 'gallery', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`));
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
    const id = `ag-${Date.now()}`;
    setDoc(doc(db, 'agendas', id), item)
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `agendas/${id}`));
  };

  const deleteAgenda = (id: string) => {
    deleteDoc(doc(db, 'agendas', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `agendas/${id}`));
  };

  const addDownloadFile = (item: Omit<DownloadFile, 'id' | 'downloadsCount'>) => {
    const id = `f-${Date.now()}`;
    const newItem = {
      ...item,
      downloadsCount: 0
    };
    setDoc(doc(db, 'downloads', id), newItem)
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `downloads/${id}`));
  };

  const deleteDownloadFile = (id: string) => {
    deleteDoc(doc(db, 'downloads', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `downloads/${id}`));
  };

  const updateDownloadFile = (id: string, item: Partial<DownloadFile>) => {
    updateDoc(doc(db, 'downloads', id), item)
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `downloads/${id}`));
  };

  const updateAgenda = (id: string, item: Partial<AcademicAgenda>) => {
    updateDoc(doc(db, 'agendas', id), item)
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `agendas/${id}`));
  };

  const incrementDownload = (id: string) => {
    updateDoc(doc(db, 'downloads', id), {
      downloadsCount: increment(1)
    }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `downloads/${id}`));
  };

  const submitFeedback = (item: Omit<MessageFeedback, 'id' | 'createdAt' | 'read'>) => {
    const id = `fb-${Date.now()}`;
    const newFb = {
      ...item,
      createdAt: new Date().toISOString(),
      read: false
    };
    setDoc(doc(db, 'feedbacks', id), newFb)
      .catch(err => handleFirestoreError(err, OperationType.CREATE, `feedbacks/${id}`));
  };

  const markFeedbackRead = (id: string) => {
    updateDoc(doc(db, 'feedbacks', id), { read: true })
      .catch(err => handleFirestoreError(err, OperationType.UPDATE, `feedbacks/${id}`));
  };

  const deleteFeedback = (id: string) => {
    deleteDoc(doc(db, 'feedbacks', id))
      .catch(err => handleFirestoreError(err, OperationType.DELETE, `feedbacks/${id}`));
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
      signInWithGoogle,
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
