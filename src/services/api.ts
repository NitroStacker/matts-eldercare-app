import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.142:3001/api';

// Types
export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences?: {
    notifications: boolean;
    theme: string;
    language: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  category: 'medication' | 'appointment' | 'personal-care' | 'household' | 'other';
  createdAt: string;
  completedAt?: string;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  provider: string;
  location: string;
  type: 'doctor' | 'therapy' | 'social' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      await AsyncStorage.setItem('authToken', token);
      this.token = token;
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  private async removeToken() {
    try {
      await AsyncStorage.removeItem('authToken');
      this.token = null;
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async signup(userData: { name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    await this.saveToken(response.token);
    return response;
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    await this.saveToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.removeToken();
    }
  }

  async getProfile(): Promise<{ user: User }> {
    return this.makeRequest<{ user: User }>('/user/profile');
  }

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    return this.makeRequest<{ user: User }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Task methods
  async getTasks(): Promise<{ tasks: Task[] }> {
    return this.makeRequest<{ tasks: Task[] }>('/user/tasks');
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<{ task: Task }> {
    return this.makeRequest<{ task: Task }>('/user/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<{ task: Task }> {
    return this.makeRequest<{ task: Task }>(`/user/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.makeRequest<void>(`/user/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Appointment methods
  async getAppointments(): Promise<{ appointments: Appointment[] }> {
    return this.makeRequest<{ appointments: Appointment[] }>('/user/appointments');
  }

  async createAppointment(appointmentData: Omit<Appointment, 'id'>): Promise<{ appointment: Appointment }> {
    return this.makeRequest<{ appointment: Appointment }>('/user/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(appointmentId: string, updates: Partial<Appointment>): Promise<{ appointment: Appointment }> {
    return this.makeRequest<{ appointment: Appointment }>(`/user/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    return this.makeRequest<void>(`/user/appointments/${appointmentId}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>('/health');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();
export default apiService;
