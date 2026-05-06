export interface Task {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_name: string;
  due_date: string;
  position: number;
}

export const mockTasks: Task[] = [
  // Workspace 1 - TechCorp Website
  { id: '1', workspace_id: '1', title: 'Design homepage mockup', description: 'Create wireframes and high-fidelity mockups for homepage', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-02-01', position: 1 },
  { id: '2', workspace_id: '1', title: 'Develop responsive layout', description: 'Implement responsive grid system and components', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-02-15', position: 2 },
  { id: '3', workspace_id: '1', title: 'Integrate CMS', description: 'Set up headless CMS for content management', status: 'in_progress', priority: 'medium', assignee_name: 'Alex Johnson', due_date: '2024-03-01', position: 3 },
  { id: '4', workspace_id: '1', title: 'SEO optimization', description: 'Implement meta tags, structured data, and performance optimization', status: 'backlog', priority: 'medium', assignee_name: 'Alex Johnson', due_date: '2024-03-15', position: 4 },
  { id: '5', workspace_id: '1', title: 'Client review & feedback', description: 'Present completed work for client review', status: 'review', priority: 'high', assignee_name: 'Sarah Miller', due_date: '2024-03-10', position: 5 },
  
  // Workspace 2 - StartupXYZ App
  { id: '6', workspace_id: '2', title: 'User research & personas', description: 'Conduct user interviews and create persona documents', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-03-01', position: 1 },
  { id: '7', workspace_id: '2', title: 'App wireframes', description: 'Create low-fidelity wireframes for all screens', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-03-10', position: 2 },
  { id: '8', workspace_id: '2', title: 'UI design system', description: 'Design component library and style guide', status: 'in_progress', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-03-20', position: 3 },
  { id: '9', workspace_id: '2', title: 'Prototype development', description: 'Build interactive prototype in React Native', status: 'backlog', priority: 'medium', assignee_name: 'Alex Johnson', due_date: '2024-04-01', position: 4 },
  
  // Workspace 4 - Fitness Hub
  { id: '10', workspace_id: '4', title: 'Database schema design', description: 'Design and implement database structure', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-02-10', position: 1 },
  { id: '11', workspace_id: '4', title: 'User authentication', description: 'Implement JWT auth and role-based access', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-02-20', position: 2 },
  { id: '12', workspace_id: '4', title: 'Booking system', description: 'Build class booking and scheduling functionality', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-03-01', position: 3 },
  { id: '13', workspace_id: '4', title: 'Payment integration', description: 'Integrate Stripe for subscription payments', status: 'in_progress', priority: 'urgent', assignee_name: 'Alex Johnson', due_date: '2024-03-15', position: 4 },
  { id: '14', workspace_id: '4', title: 'Testing & QA', description: 'Comprehensive testing across devices', status: 'backlog', priority: 'medium', assignee_name: 'Alex Johnson', due_date: '2024-03-25', position: 5 },
  
  // Workspace 5 - Consulting Website
  { id: '15', workspace_id: '5', title: 'Brand strategy', description: 'Define brand voice, colors, and visual identity', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-02-20', position: 1 },
  { id: '16', workspace_id: '5', title: 'Website copywriting', description: 'Write compelling copy for all pages', status: 'in_progress', priority: 'medium', assignee_name: 'Amanda Foster', due_date: '2024-03-10', position: 2 },
  { id: '17', workspace_id: '5', title: 'Design homepage', description: 'Create modern, professional homepage design', status: 'backlog', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-03-20', position: 3 },
  
  // Workspace 6 - Real Estate Portal
  { id: '18', workspace_id: '6', title: 'Property listing features', description: 'Build property search and filtering system', status: 'done', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-03-10', position: 1 },
  { id: '19', workspace_id: '6', title: 'Agent dashboard', description: 'Create dashboard for real estate agents', status: 'in_progress', priority: 'high', assignee_name: 'Alex Johnson', due_date: '2024-03-25', position: 2 },
  { id: '20', workspace_id: '6', title: 'Map integration', description: 'Integrate Google Maps for property locations', status: 'backlog', priority: 'medium', assignee_name: 'Alex Johnson', due_date: '2024-04-05', position: 3 },
];

export const getTasksByWorkspace = (workspaceId: string) => mockTasks.filter(t => t.workspace_id === workspaceId);
