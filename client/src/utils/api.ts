import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

// Game API calls
export const gameAPI = {
  getAll: () => api.get('/games'),
  getById: (id: string) => api.get(`/games/${id}`),
  getRooms: (gameId: string) => api.get(`/games/${gameId}/rooms`),
  createRoom: (gameId: string, maxPlayers: number) =>
    api.post(`/games/${gameId}/rooms`, { maxPlayers }),
  joinRoom: (roomId: string) => api.post(`/rooms/${roomId}/join`),
  leaveRoom: (roomId: string) => api.post(`/rooms/${roomId}/leave`),
}

// Leaderboard API calls
export const leaderboardAPI = {
  getGlobal: (filter?: 'all' | 'daily' | 'weekly', limit?: number) =>
    api.get('/leaderboard', { params: { filter, limit } }),
  getByGame: (gameId: string, filter?: 'all' | 'daily' | 'weekly', limit?: number) =>
    api.get(`/leaderboard/${gameId}`, { params: { filter, limit } }),
}

// User API calls
export const userAPI = {
  getProfile: (userId: string) => api.get(`/users/${userId}`),
  updateProfile: (data: any) => api.patch('/users/me', data),
  getStats: () => api.get('/users/me/stats'),
}

export default api
