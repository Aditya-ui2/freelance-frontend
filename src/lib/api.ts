import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
};

export const projectApi = {
  getAll: (params?: any) => api.get("/projects", { params }),
  create: (data: any) => api.post("/projects", data),
  getMyProjects: () => api.get("/projects/my-projects"),
  complete: (id: string) => api.patch(`/projects/${id}/complete`),
  rate: (id: string, rating: number) => api.post(`/projects/${id}/rate`, { rating }),
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getFreelancers: (params?: any) => api.get('/users/freelancers', { params }),
  viewProfile: (id: string) => api.patch(`/users/view/${id}`),
  updateAcademyProgress: (data: { title: string, progress: number, status: string }) => api.post('/users/profile/academy/update', data),
  claimAcademyBoost: () => api.post('/users/profile/academy/claim-boost')
};

export const challengeApi = {
  getAll: () => api.get("/challenges"),
  complete: (id: string) => api.post(`/challenges/${id}/complete`),
  verify: (id: string, code: string) => api.post(`/challenges/${id}/verify`, { code }),
};

export const portfolioApi = {
  addPoc: (poc: any) => api.post('/users/profile/pocs', poc),
  updatePoc: (id: string, data: any) => api.put(`/users/profile/pocs/${id}`, data),
  deletePoc: (id: string) => api.delete(`/users/profile/pocs/${id}`),
};

export const applicationApi = {
  apply: (data: any) => api.post("/applications", data),
  getMyApplications: () => api.get("/applications/my-applications"),
  getReceivedApplications: () => api.get("/applications/received"),
  getHiredApplications: () => api.get('/applications/hired'),
  withdrawApplication: (id: string) => api.delete(`/applications/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/applications/${id}/status`, { status }),
};

export const postApi = {
  getAll: () => api.get("/posts"),
  getStats: () => api.get("/posts/stats"),
  create: (data: any) => api.post("/posts", data),
  like: (id: string) => api.post(`/posts/${id}/like`),
  addComment: (id: string, content: string) => api.post(`/posts/${id}/comments`, { content }),
};

export const messageApi = {
  getConversations: () => api.get('/messages/conversations'),
  startConversation: (participantId: string) => api.post('/messages/conversations', { participantId }),
  getMessages: (conversationId: string) => api.get(`/messages/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, content: string) => api.post('/messages/messages', { conversationId, content })
};

export const analyticsApi = {
  getClientDashboard: () => api.get('/analytics/client-dashboard'),
  getFreelancerDashboard: () => api.get('/analytics/freelancer-dashboard')
};

export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  dismiss: (id: string) => api.delete(`/notifications/${id}`)
};

export default api;
