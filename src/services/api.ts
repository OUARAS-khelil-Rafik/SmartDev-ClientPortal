// Real API service - Uses MongoDB backend instead of localStorage
import { User, Booking } from '../types';

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:3001/api';

// Store token in localStorage (session-only, no data storage)
const TOKEN_KEY = 'auth_token';

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);

const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:3001/api';
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

const normalizeUser = (user: any): User => {
  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const role = user?.role === 'admin' ? 'admin' : 'client';

  return {
    id: user?._id || user?.id || '',
    name: user?.name || fullName || user?.email || 'User',
    email: user?.email || '',
    role,
    avatar: user?.avatar || undefined,
    company: user?.company || undefined,
  };
};

const mapStatusToUi = (status: string): Booking['status'] => {
  if (status === 'completed') return 'finished';
  if (status === 'in-progress') return 'confirmed';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'confirmed') return 'confirmed';
  return 'pending';
};

const mapUiTopicToService = (topics: string[] | undefined): string => {
  const topic = (topics?.[0] || '').toLowerCase();
  if (topic.includes('web') || topic === 'web') return 'Web Development';
  if (topic.includes('mobile') || topic.includes('app') || topic === 'mob') return 'Mobile App';
  if (topic.includes('ai') || topic === 'ai') return 'AI Solution';
  if (topic.includes('cloud') || topic === 'cloud') return 'Cloud Services';
  return 'Consultation';
};

const toUiBooking = (booking: any): Booking => {
  const id = booking?._id || booking?.id || '';
  const userId = booking?.userId?._id || booking?.userId || '';
  const userName = booking?.userId?.firstName
    ? `${booking.userId.firstName} ${booking.userId.lastName || ''}`.trim()
    : booking?.userName || '';
  const userEmail = booking?.userId?.email || booking?.userEmail || '';

  const preferred = booking?.preferredStartDate ? new Date(booking.preferredStartDate) : null;
  const date = preferred ? preferred.toISOString().slice(0, 10) : '';
  const time = preferred ? preferred.toTimeString().slice(0, 5) : '09:00';

  return {
    id,
    userId,
    userName,
    userEmail,
    date,
    time,
    status: mapStatusToUi(booking?.status),
    meetLink: booking?.meetLink || undefined,
    topic: booking?.serviceName ? [booking.serviceName] : [],
    description: booking?.description || '',
    projectId: booking?.projectId || undefined,
  };
};

const buildPreferredStartDate = (date?: string, time?: string) => {
  if (!date) return new Date().toISOString();
  if (time) return new Date(`${date}T${time}:00`).toISOString();
  return new Date(date).toISOString();
};

class Api {
  // ==================== Auth ====================
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await apiCall('/auth/login', 'POST', { email, password });
    if (response.token) {
      setAuthToken(response.token);
    }
    return { token: response.token, user: normalizeUser(response.user) };
  }

  async signup(firstName: string, lastName: string, email: string, password: string, company?: string): Promise<User> {
    const response = await apiCall('/auth/register', 'POST', {
      firstName,
      lastName,
      email,
      password,
      company,
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    return normalizeUser(response.user);
  }

  async logout(): Promise<void> {
    clearAuthToken();
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiCall('/user/profile');
    return normalizeUser(response.user || response);
  }

  // ==================== Users (Admin) ====================
  async getAllUsers(roleFilter?: 'client' | 'admin'): Promise<User[]> {
    const role = roleFilter === 'admin' ? 'admin' : roleFilter === 'client' ? 'user' : undefined;
    const endpoint = role ? `/user/admin/all?role=${role}` : '/user/admin/all';
    const response = await apiCall(endpoint);
    return (response.users || []).map(normalizeUser);
  }

  async approveUser(userId: string): Promise<User[]> {
    await apiCall(`/user/admin/${userId}`, 'PUT', { isActive: true });
    return this.getAllUsers();
  }

  async rejectUser(userId: string): Promise<User[]> {
    await apiCall(`/user/admin/${userId}`, 'PUT', { isActive: false });
    return this.getAllUsers();
  }

  async deleteUser(userId: string): Promise<User[]> {
    await apiCall(`/user/admin/${userId}`, 'DELETE');
    return this.getAllUsers();
  }

  // ==================== Bookings ====================
  async createBooking(bookingData: any): Promise<Booking> {
    const payload = bookingData?.serviceName
      ? bookingData
      : {
          serviceName: mapUiTopicToService(bookingData?.topic),
          title: 'Booking request',
          description: bookingData?.description || 'Booking request',
          budget: 0,
          timeline: '1-2 weeks',
          preferredStartDate: buildPreferredStartDate(bookingData?.date, bookingData?.time),
          notes: bookingData?.projectId ? `projectId:${bookingData.projectId}` : undefined,
        };

    const response = await apiCall('/booking', 'POST', payload);
    return toUiBooking(response.booking);
  }

  async getBookings(userId?: string, role?: string): Promise<Booking[]> {
    const isAdmin = role === 'admin' || userId === 'admin';
    const endpoint = isAdmin ? '/booking/admin/all' : '/booking?limit=100';
    const response = await apiCall(endpoint);
    return (response.bookings || []).map(toUiBooking);
  }

  async confirmBooking(bookingId: string): Promise<Booking[]> {
    await apiCall(`/booking/admin/${bookingId}`, 'PUT', { status: 'confirmed' });
    return this.getBookings('admin', 'admin');
  }

  async rejectBooking(bookingId: string): Promise<Booking[]> {
    await apiCall(`/booking/admin/${bookingId}`, 'PUT', { status: 'cancelled' });
    return this.getBookings('admin', 'admin');
  }

  async cancelBooking(bookingId: string, actor?: { id: string; role: 'admin' | 'client' | 'developer' }): Promise<Booking[]> {
    if (actor?.role === 'admin') {
      await apiCall(`/booking/admin/${bookingId}`, 'PUT', { status: 'cancelled' });
      return this.getBookings('admin', 'admin');
    }
    await apiCall(`/booking/${bookingId}`, 'DELETE');
    return this.getBookings(actor?.id, actor?.role);
  }

  async finishBooking(bookingId: string, _actor?: { id: string; role: 'admin' | 'client' | 'developer' }): Promise<Booking[]> {
    await apiCall(`/booking/admin/${bookingId}`, 'PUT', { status: 'completed' });
    return this.getBookings('admin', 'admin');
  }

  async clearBookingHistory(
    userId?: string,
    actor?: { id: string; role: 'admin' | 'client' | 'developer' },
    options?: { includeFinished?: boolean }
  ): Promise<Booking[]> {
    const bookings = await this.getBookings(actor?.role === 'admin' ? 'admin' : userId, actor?.role);
    const deletable = bookings.filter((booking) => {
      if (booking.status === 'cancelled') return true;
      if (options?.includeFinished && booking.status === 'finished') return true;
      return false;
    });

    if (actor?.role === 'admin') {
      const filtered = userId ? deletable.filter((booking) => booking.userId === userId) : deletable;
      await Promise.all(filtered.map((booking) => apiCall(`/booking/admin/${booking.id}`, 'DELETE')));
      return this.getBookings('admin', 'admin');
    }

    await Promise.all(deletable.map((booking) => apiCall(`/booking/${booking.id}`, 'DELETE')));
    return this.getBookings(userId, actor?.role);
  }

  async getOccupiedSlots(): Promise<Array<{ date: string; time: string }>> {
    try {
      const bookings = await this.getBookings();
      return bookings
        .filter((booking) => booking.date && booking.time)
        .map((booking) => ({ date: booking.date, time: booking.time }));
    } catch {
      return [];
    }
  }

  // ==================== Notifications ====================
  async getNotifications(userId?: string, role?: string): Promise<any[]> {
    const endpoint = role === 'admin' ? '/notifications/admin/all' : '/notifications';
    const response = await apiCall(endpoint);
    return (response.notifications || []).map((n: any) => ({
      id: n._id || n.id,
      userId: n.userId?._id || n.userId,
      title: n.title,
      body: n.message,
      date: n.createdAt,
      read: n.isRead,
      type: n.type,
    }));
  }

  async markNotificationRead(notificationId: string, _userId?: string): Promise<void> {
    await apiCall(`/notifications/${notificationId}/read`, 'PUT');
  }

  async setNotificationRead(notificationId: string, isRead: boolean, _userId?: string): Promise<void> {
    if (!isRead) return;
    await this.markNotificationRead(notificationId);
  }

  async markAllNotificationsRead(_userId?: string): Promise<void> {
    await apiCall('/notifications/read-all', 'PUT');
  }

  async clearNotifications(userId?: string): Promise<void> {
    if (!userId) {
      const all = await this.getNotifications(undefined, 'admin');
      await Promise.all(all.map((n) => apiCall(`/notifications/admin/${n.id}`, 'DELETE')));
      return;
    }
    await apiCall('/notifications/delete-all', 'DELETE');
  }

  async deleteNotification(notificationId: string, userId?: string): Promise<void> {
    if (!userId) {
      await apiCall(`/notifications/admin/${notificationId}`, 'DELETE');
      return;
    }
    await apiCall(`/notifications/${notificationId}`, 'DELETE');
  }

  // ==================== Consultation ====================
  async createDemoBooking(data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    date: string;
    time: string;
    message: string;
  }): Promise<void> {
    const payload = {
      message: data.message,
      email: data.email,
      name: data.name,
      description: `Demo booking request - ${data.date} ${data.time} - ${data.company || ''} ${data.phone || ''}`.trim(),
      projectType: 'Other',
    };
    await apiCall('/consultation', 'POST', payload);
  }

  async createConsultation(data: any): Promise<any> {
    const response = await apiCall('/consultation', 'POST', data);
    return response.consultation;
  }

  // ==================== Project/Task placeholders ====================
  async getProjects(_userId?: string, _role?: string): Promise<any[]> {
    return [];
  }

  async createProject(_payload?: any, _actor?: any): Promise<any> {
    throw new Error('Projects are not available in the MongoDB backend yet.');
  }

  async renameProject(_projectId?: string, _name?: string, _actor?: any): Promise<void> {
    throw new Error('Projects are not available in the MongoDB backend yet.');
  }

  async deleteProject(_projectId?: string, _actor?: any): Promise<void> {
    throw new Error('Projects are not available in the MongoDB backend yet.');
  }

  async addTask(_projectId?: string, _title?: string): Promise<any[]> {
    throw new Error('Tasks are not available in the MongoDB backend yet.');
  }

  async toggleTaskCompletion(_projectId?: string, _taskId?: string): Promise<any[]> {
    throw new Error('Tasks are not available in the MongoDB backend yet.');
  }

  async reorderTasks(_projectId?: string, _fromIndex?: number, _toIndex?: number): Promise<any[]> {
    throw new Error('Tasks are not available in the MongoDB backend yet.');
  }

  async createDeveloper(_name?: string, _email?: string): Promise<void> {
    throw new Error('Developer accounts are not available in the MongoDB backend yet.');
  }

  async updateDeveloper(_developerId?: string, _updates?: { name?: string; email?: string }): Promise<any[]> {
    throw new Error('Developer accounts are not available in the MongoDB backend yet.');
  }

  async deleteDeveloper(_developerId?: string): Promise<any[]> {
    throw new Error('Developer accounts are not available in the MongoDB backend yet.');
  }

  async assignDeveloperToProject(_projectId?: string, _developerId?: string | null): Promise<any[]> {
    throw new Error('Project assignment is not available in the MongoDB backend yet.');
  }
}

export const api = new Api();