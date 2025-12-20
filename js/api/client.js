// API Client for Nastya Tutor Backend
// Base URL - should be configured based on environment
// Для production используйте абсолютный URL вашего бэкенда
// Для разработки можно использовать относительный путь или localhost
const getApiBaseUrl = () => {
  // Проверяем, есть ли переменная окружения (для сборки)
  if (typeof process !== 'undefined' && process.env && process.env.API_URL) {
    return process.env.API_URL;
  }
  
  // Проверяем глобальную переменную (можно установить в HTML)
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  
  // Если фронтенд и бэкенд на одном домене, используем относительный путь
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api'; // Относительный путь для production
  }
  
  // Для локальной разработки
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // Set tokens
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Clear tokens
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    // Add authorization header if token exists
    if (this.accessToken) {
      config.headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, config);
      let data = null;
      let responseText = '';
      
      try {
        responseText = await response.text();
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText);
        }
      } catch (parseError) {
        // Если не удалось распарсить JSON, но статус OK, возвращаем null
        if (response.ok) {
          data = null;
        } else {
          // Если статус не OK, пробуем извлечь сообщение об ошибке из текста
          throw new Error(responseText || `HTTP error! status: ${response.status}`);
        }
      }

      // Handle token expiration
      if (response.status === 401 && this.refreshToken) {
        try {
          const newTokens = await this.refreshAccessToken();
          // Retry original request with new token
          config.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
          const retryResponse = await fetch(url, config);
          const retryText = await retryResponse.text();
          if (retryText && retryText.trim()) {
            return JSON.parse(retryText);
          }
          return null;
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          this.clearTokens();
          if (window.location.pathname !== '/login.html') {
            window.location.href = '/login.html';
          }
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        const errorMessage = (data && typeof data === 'object' && data.message) 
          ? data.message 
          : `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken: this.refreshToken })
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.message || 'Failed to refresh token');
    }

    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  // Auth methods
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.accessToken && data.refreshToken) {
      this.setTokens(data.accessToken, data.refreshToken);
    }

    return data;
  }

  async register(email, password, name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });

    if (data.accessToken && data.refreshToken) {
      this.setTokens(data.accessToken, data.refreshToken);
    }

    return data;
  }

  async logout() {
    this.clearTokens();
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  // Student methods
  async getStudents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/students${queryParams ? `?${queryParams}` : ''}`);
  }

  async getStudent(id) {
    return await this.request(`/students/${id}`);
  }

  async createStudent(studentData) {
    return await this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  }

  async updateStudent(id, studentData) {
    return await this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  }

  async deleteStudent(id) {
    return await this.request(`/students/${id}`, {
      method: 'DELETE'
    });
  }

  async getStudentStatistics() {
    return await this.request('/students/statistics');
  }

  // Lesson methods
  async getLessons(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/lessons${queryParams ? `?${queryParams}` : ''}`);
  }

  async getLesson(id) {
    return await this.request(`/lessons/${id}`);
  }

  async createLesson(lessonData) {
    return await this.request('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData)
    });
  }

  async updateLesson(id, lessonData) {
    return await this.request(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData)
    });
  }

  async deleteLesson(id) {
    return await this.request(`/lessons/${id}`, {
      method: 'DELETE'
    });
  }

  async getSchedule(startDate, endDate) {
    return await this.request(`/lessons/schedule?startDate=${startDate}&endDate=${endDate}`);
  }

  async getUpcomingLessons(limit = 10) {
    return await this.request(`/lessons/upcoming?limit=${limit}`);
  }

  // Analytics methods
  async getAnalyticsOverview(dateRange = {}) {
    const queryParams = new URLSearchParams(dateRange).toString();
    return await this.request(`/analytics/overview${queryParams ? `?${queryParams}` : ''}`);
  }

  async getStudentProgress(studentId, dateRange = {}) {
    const queryParams = new URLSearchParams(dateRange).toString();
    return await this.request(`/analytics/students/${studentId}/progress${queryParams ? `?${queryParams}` : ''}`);
  }

  async getRevenueStatistics(dateRange = {}) {
    const queryParams = new URLSearchParams(dateRange).toString();
    return await this.request(`/analytics/revenue${queryParams ? `?${queryParams}` : ''}`);
  }

  async getAttendanceStatistics(dateRange = {}) {
    const queryParams = new URLSearchParams(dateRange).toString();
    return await this.request(`/analytics/attendance${queryParams ? `?${queryParams}` : ''}`);
  }

  async getGradeDistribution() {
    return await this.request('/analytics/grade-distribution');
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = apiClient;
} else {
  window.apiClient = apiClient;
}


