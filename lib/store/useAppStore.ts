import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'new_request' | 'message' | 'invoice_paid' | 'contract_signed' | 'task_due';
  title: string;
  body: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

interface AppState {
  sidebarCollapsed: boolean;
  currentUser: {
    id: string;
    role: 'freelancer' | 'client' | 'admin';
    name: string;
    email: string;
    avatar?: string;
  } | null;
  notifications: Notification[];
  aiSidebarOpen: boolean;
  
  toggleSidebar: () => void;
  setCurrentUser: (user: AppState['currentUser']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleAISidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  currentUser: null,
  notifications: [],
  aiSidebarOpen: false,
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    ),
  })),
  
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
  })),
  
  toggleAISidebar: () => set((state) => ({ aiSidebarOpen: !state.aiSidebarOpen })),
}));
