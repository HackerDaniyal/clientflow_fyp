export interface Message {
  id: string;
  workspace_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'voice';
  file_url?: string;
  is_internal: boolean;
  created_at: string;
}

export const mockMessages: Message[] = [
  // Workspace 1
  { id: '1', workspace_id: '1', sender_id: '1', sender_name: 'Alex Johnson', content: 'Hi Sarah! I\'ve completed the homepage mockup. Please review and let me know your thoughts.', message_type: 'text', is_internal: false, created_at: '2024-02-01 10:30' },
  { id: '2', workspace_id: '1', sender_id: '2', sender_name: 'Sarah Miller', content: 'Looks great! I love the clean design. Can we make the hero section more prominent?', message_type: 'text', is_internal: false, created_at: '2024-02-01 14:20' },
  { id: '3', workspace_id: '1', sender_id: '1', sender_name: 'Alex Johnson', content: 'Absolutely! I\'ll work on that and send you an updated version by tomorrow.', message_type: 'text', is_internal: false, created_at: '2024-02-01 15:45' },
  { id: '4', workspace_id: '1', sender_id: '2', sender_name: 'Sarah Miller', content: 'Perfect, thank you! Also attaching our brand guidelines for reference.', message_type: 'file', file_url: '/mock/brand-guidelines.pdf', is_internal: false, created_at: '2024-02-02 09:15' },
  
  // Workspace 2
  { id: '5', workspace_id: '2', sender_id: '3', sender_name: 'Michael Chen', content: 'The wireframes look solid. When can we start development?', message_type: 'text', is_internal: false, created_at: '2024-03-12 11:00' },
  { id: '6', workspace_id: '2', sender_id: '1', sender_name: 'Alex Johnson', content: 'I\'m planning to start next week. First, I need to finalize the UI design system.', message_type: 'text', is_internal: false, created_at: '2024-03-12 13:30' },
  { id: '7', workspace_id: '2', sender_id: '3', sender_name: 'Michael Chen', content: 'Sounds good! Keep me posted on progress.', message_type: 'text', is_internal: false, created_at: '2024-03-12 14:00' },
  
  // Workspace 4
  { id: '8', workspace_id: '4', sender_id: '1', sender_name: 'Alex Johnson', content: 'Payment integration is almost done. Just need to test a few edge cases.', message_type: 'text', is_internal: false, created_at: '2024-03-14 16:20' },
  { id: '9', workspace_id: '4', sender_id: '6', sender_name: 'Lisa Thompson', content: 'Excellent! Can\'t wait to launch this.', message_type: 'text', is_internal: false, created_at: '2024-03-14 17:00' },
];

export const getMessagesByWorkspace = (workspaceId: string) => mockMessages.filter(m => m.workspace_id === workspaceId);
