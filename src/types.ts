
import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  avatar?: string;
  // Optional approval status for admin moderation
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Service {
  id: string; // Added ID for easier selection
  title: string;
  description: string;
  longDescription?: string; // For detailed view
  features?: string[]; // For detailed view
  icon: React.ReactNode;
}

export interface Project {
  id: string;
  name: string;
  clientId: string; // Link project to specific user
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  progress: number;
  deadline: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignee: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'finished';
  meetLink?: string; // Google Meet Link
  topic: string[]; // Changed to array for multi-select
  description: string;
  projectId?: string; // Optional link to existing project
}

export enum ViewState {
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  DASHBOARD = 'DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  BOOKING = 'BOOKING',
  AI_CONSULT = 'AI_CONSULT',
  ALL_COMPONENTS = 'ALL_COMPONENTS',
  ALL_NOTIFICATIONS = 'ALL_NOTIFICATIONS',
  LOGIN = 'LOGIN',
}
