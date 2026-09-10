import api from './api';

const createService = <T>(endpoint: string) => ({
  getAll: async (): Promise<T[]> => {
    const res = await api.get(endpoint);
    return res.data.map((item: any) => ({ ...item, id: item._id }));
  },
  getById: async (id: string): Promise<T> => {
    const res = await api.get(`${endpoint}/${id}`);
    return { ...res.data, id: res.data._id };
  },
  create: async (data: Omit<T, 'id'>): Promise<T> => {
    const res = await api.post(endpoint, data);
    return { ...res.data, id: res.data._id };
  },
  update: async (id: string, data: Partial<T>): Promise<T> => {
    const res = await api.put(`${endpoint}/${id}`, data);
    return { ...res.data, id: res.data._id };
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`${endpoint}/${id}`);
  }
});

import { 
  NewsItem, Teacher, GalleryItem, AcademicAgenda, 
  DownloadFile, Book, Student, Alumni, ActivityLog, MessageFeedback 
} from '../types';

export const newsService = createService<NewsItem>('/news');
export const teacherService = createService<Teacher>('/teachers');
export const galleryService = createService<GalleryItem>('/gallery');
export const agendaService = createService<AcademicAgenda>('/agendas');
export const downloadService = createService<DownloadFile>('/downloads');
export const bookService = createService<Book>('/books');
export const studentService = createService<Student>('/students');
export const alumniService = createService<Alumni>('/alumni');
export const logService = createService<ActivityLog>('/activity-logs');
export const feedbackService = createService<MessageFeedback>('/feedbacks');
