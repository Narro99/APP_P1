import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiClientClass {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // Replace with your actual API URL
    this.baseUrl = 'https://wdmsjtwehmvyhinnjohp.supabase.co/';
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      this.token = await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error initializing token:', error);
    }
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers();
    
    headers.set('Content-Type', 'application/json');
    
    if (options.headers) {
      const existingHeaders = new Headers(options.headers);
      existingHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    }

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token refresh
    if (response.status === 401 && this.token) {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            this.setToken(data.accessToken);
            await AsyncStorage.setItem('accessToken', data.accessToken);
            await AsyncStorage.setItem('refreshToken', data.refreshToken);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));

            // Retry original request
            headers.set('Authorization', `Bearer ${this.token}`);
            response = await fetch(url, {
              ...options,
              headers,
            });
          } else {
            // Refresh failed, clear tokens
            this.clearToken();
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
            throw new Error('Session expired. Please log in again.');
          }
        } catch (error) {
          this.clearToken();
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
          throw new Error('Session expired. Please log in again.');
        }
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.setToken(response.accessToken);
    return response;
  }

  async register(email: string, password: string, companyName: string, industry?: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, companyName, industry }),
    });
    
    this.setToken(response.accessToken);
    return response;
  }

  // Employee methods
  async getMyProfile() {
    return this.request('/employees/me');
  }

  async updateMyProfile(profileData: any) {
    return this.request('/employees/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getMyAttendance(date?: string) {
    const params = date ? `?date=${date}` : '';
    return this.request(`/employees/attendance${params}`);
  }

  async checkInOut(action: 'check_in' | 'check_out') {
    return this.request('/employees/attendance', {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  async getMyLeaves() {
    return this.request('/employees/leaves');
  }

  async createMyLeave(leaveData: any) {
    return this.request('/employees/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async getMyStats() {
    return this.request('/employees/stats');
  }

  // Dashboard methods (for admin users)
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getEmployees() {
    return this.request('/employees');
  }

  async getAttendance(date?: string) {
    const params = date ? `?date=${date}` : '';
    return this.request(`/attendance${params}`);
  }

  async getLeaves() {
    return this.request('/leaves');
  }

  async approveLeave(leaveId: number, action: 'approve' | 'reject', comments?: string) {
    return this.request(`/leaves/${leaveId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ action, comments }),
    });
  }
}

export const ApiClient = new ApiClientClass();