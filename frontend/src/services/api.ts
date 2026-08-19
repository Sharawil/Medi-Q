import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API base URL - configurable via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await api.request<T>(config);
  return response.data;
};

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string; phone?: string }) =>
    apiRequest<{ message: string; token: string; user: any }>({
      method: 'POST',
      url: '/auth/register',
      data,
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ message: string; token: string; user: any }>({
      method: 'POST',
      url: '/auth/login',
      data,
    }),

  getProfile: () =>
    apiRequest<any>({
      method: 'GET',
      url: '/auth/profile',
    }),

  updateProfile: (data: { name?: string; phone?: string; specialization?: string; department?: string }) =>
    apiRequest<{ message: string; user: any }>({
      method: 'PUT',
      url: '/auth/profile',
      data,
    }),

  logout: () =>
    apiRequest<{ message: string }>({
      method: 'POST',
      url: '/auth/logout',
    }),
};

// Patient API
export const patientApi = {
  createProfile: (data: any) =>
    apiRequest<{ message: string; patient: any }>({
      method: 'POST',
      url: '/patients',
      data,
    }),

  getProfile: () =>
    apiRequest<any>({
      method: 'GET',
      url: '/patients/me',
    }),

  updateProfile: (data: any) =>
    apiRequest<{ message: string; patient: any }>({
      method: 'PUT',
      url: '/patients/me',
      data,
    }),

  getVisitHistory: () =>
    apiRequest<{ visits: any[] }>({
      method: 'GET',
      url: '/patients/me/history',
    }),

  getAllPatients: () =>
    apiRequest<any[]>({
      method: 'GET',
      url: '/patients',
    }),
};

// Symptom API
export const symptomApi = {
  submitSymptoms: (data: { patientData: any; bodyPart: string; symptomAnswers: any; tokenNumber: string }) =>
    apiRequest<{ message: string; symptom: any; queueToken: any }>({
      method: 'POST',
      url: '/symptoms',
      data,
    }),

  getPatientSymptoms: () =>
    apiRequest<any[]>({
      method: 'GET',
      url: '/symptoms/me',
    }),

  getSymptomById: (id: string) =>
    apiRequest<any>({
      method: 'GET',
      url: `/symptoms/${id}`,
    }),

  updateSymptom: (id: string, data: { doctorNotes?: string; isReviewedByDoctor?: boolean }) =>
    apiRequest<{ message: string; symptom: any }>({
      method: 'PUT',
      url: `/symptoms/${id}`,
      data,
    }),

  getAllSymptoms: () =>
    apiRequest<any[]>({
      method: 'GET',
      url: '/symptoms',
    }),
};

// Queue API
export const queueApi = {
  getQueueTokens: () =>
    apiRequest<any[]>({
      method: 'GET',
      url: '/queue',
    }),

  getQueueTokenById: (id: string) =>
    apiRequest<any>({
      method: 'GET',
      url: `/queue/${id}`,
    }),

  updateQueueTokenStatus: (id: string, data: { status: string; notes?: string }) =>
    apiRequest<{ message: string; queueToken: any }>({
      method: 'PUT',
      url: `/queue/${id}`,
      data,
    }),

  getQueueStats: () =>
    apiRequest<any>({
      method: 'GET',
      url: '/queue/stats',
    }),
};

// Dashboard API
export const dashboardApi = {
  getDoctorDashboard: () =>
    apiRequest<{ patients: any[]; stats: any }>({
      method: 'GET',
      url: '/dashboard/doctor',
    }),

  getReceptionDashboard: () =>
    apiRequest<{ patients: any[]; stats: any; priorityBreakdown: any; averageWaitTime: number; totalCompletedToday: number }>({
      method: 'GET',
      url: '/dashboard/reception',
    }),
};

// Health check
export const healthApi = {
  check: () =>
    apiRequest<{ status: string; timestamp: string }>({
      method: 'GET',
      url: '/health',
    }),
};

// Reports API
export const reportsApi = {
  getDailyReport: () =>
    apiRequest<any>({
      method: 'GET',
      url: '/reports/daily',
    }),

  getWeeklyReport: () =>
    apiRequest<any>({
      method: 'GET',
      url: '/reports/weekly',
    }),

  getMonthlyReport: () =>
    apiRequest<any>({
      method: 'GET',
      url: '/reports/monthly',
    }),

  getDemographicsReport: () =>
    apiRequest<any>({
      method: 'GET',
      url: '/reports/demographics',
    }),

  getPerformanceMetrics: () =>
    apiRequest<any>({
      method: 'GET',
      url: '/reports/performance',
    }),
};

export default api;