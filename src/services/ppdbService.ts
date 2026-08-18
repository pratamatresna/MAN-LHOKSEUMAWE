import api, { API_BASE_URL } from './api';
import { PPDBRegistration } from '../types';

interface SubmitResponse {
  message: string;
  regNumber: string;
  registration: any;
}

/**
 * Submit PPDB registration with file uploads (multipart/form-data)
 */
export const submitRegistration = async (
  formData: {
    fullName: string;
    nisn: string;
    email: string;
    phone: string;
    schoolOrigin: string;
    birthDate: string;
    birthPlace: string;
    gender: 'L' | 'P';
    religion: string;
    address: string;
    guardianName: string;
    guardianPhone: string;
    raporScore: number;
  },
  files: {
    rapor: File | null;
    kk: File | null;
    ijazah: File | null;
    pasFoto?: File | null;
    kartuKeluarga?: File | null;
    aktaKelahiran?: File | null;
    suratKeterangan?: File | null;
  }
): Promise<{ regNumber: string }> => {
  const multipartData = new FormData();

  // Append text fields
  Object.entries(formData).forEach(([key, value]) => {
    multipartData.append(key, String(value));
  });

  // Append file fields
  if (files.rapor) multipartData.append('rapor', files.rapor);
  if (files.kk) multipartData.append('kartuKeluarga', files.kk);
  if (files.ijazah) multipartData.append('ijazah', files.ijazah);
  if (files.pasFoto) multipartData.append('pasFoto', files.pasFoto);
  if (files.aktaKelahiran) multipartData.append('aktaKelahiran', files.aktaKelahiran);
  if (files.suratKeterangan) multipartData.append('suratKeterangan', files.suratKeterangan);

  const response = await api.post<SubmitResponse>('/ppdb/register', multipartData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return { regNumber: response.data.regNumber };
};

/**
 * Get all PPDB registrations (protected — Admin only)
 */
export const getRegistrations = async (): Promise<PPDBRegistration[]> => {
  const response = await api.get('/ppdb/registrations');
  
  // Map backend response to frontend PPDBRegistration type
  return response.data.map((reg: any) => ({
    id: reg._id || reg.id,
    regNumber: reg.regNumber,
    fullName: reg.fullName,
    nisn: reg.nisn,
    email: reg.email,
    phone: reg.phone,
    schoolOrigin: reg.schoolOrigin,
    birthDate: reg.birthDate,
    birthPlace: reg.birthPlace,
    gender: reg.gender,
    religion: reg.religion,
    address: reg.address,
    guardianName: reg.guardianName,
    guardianPhone: reg.guardianPhone,
    raporScore: reg.raporScore,
    status: reg.status,
    createdAt: reg.createdAt,
    submittedFiles: reg.submittedFiles || {
      rapor: !!reg.rapor,
      kk: !!reg.kartuKeluarga,
      ijazah: !!reg.ijazah,
    },
  }));
};

/**
 * Check registration status by regNumber or NISN (public)
 */
export const checkStatus = async (
  query: string
): Promise<PPDBRegistration | null> => {
  try {
    const response = await api.get(`/ppdb/registrations/${encodeURIComponent(query)}`);
    const reg = response.data;
    
    if (!reg) return null;

    return {
      id: reg._id || reg.id,
      regNumber: reg.regNumber,
      fullName: reg.fullName,
      nisn: reg.nisn,
      email: reg.email,
      phone: reg.phone,
      schoolOrigin: reg.schoolOrigin,
      birthDate: reg.birthDate,
      birthPlace: reg.birthPlace,
      gender: reg.gender,
      religion: reg.religion,
      address: reg.address,
      guardianName: reg.guardianName,
      guardianPhone: reg.guardianPhone,
      raporScore: reg.raporScore,
      status: reg.status,
      createdAt: reg.createdAt,
      submittedFiles: reg.submittedFiles || {
        rapor: !!reg.rapor,
        kk: !!reg.kartuKeluarga,
        ijazah: !!reg.ijazah,
      },
    };
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Update registration status (protected — Admin only)
 */
export const updateStatus = async (
  id: string,
  status: 'Verified' | 'Rejected'
): Promise<void> => {
  await api.patch(`/ppdb/registrations/${id}/status`, { status });
};

/**
 * Delete registration (protected — Admin only)
 */
export const deleteRegistration = async (id: string): Promise<void> => {
  await api.delete(`/ppdb/registrations/${id}`);
};

export default {
  submitRegistration,
  getRegistrations,
  checkStatus,
  updateStatus,
  deleteRegistration,
};
