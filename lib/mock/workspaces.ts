export interface Workspace {
  id: string;
  request_id: string;
  freelancer_id: string;
  client_id: string;
  client_name: string;
  name: string;
  status: 'active' | 'on_hold' | 'completed' | 'archived';
  progress: number;
  project_type: string;
  created_at: string;
}

export const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    request_id: '1',
    freelancer_id: '1',
    client_id: '2',
    client_name: 'Sarah Miller',
    name: 'TechCorp Website Redesign',
    status: 'active',
    progress: 65,
    project_type: 'Website',
    created_at: '2024-01-20',
  },
  {
    id: '2',
    request_id: '2',
    freelancer_id: '1',
    client_id: '3',
    client_name: 'Michael Chen',
    name: 'StartupXYZ Mobile App',
    status: 'active',
    progress: 40,
    project_type: 'App',
    created_at: '2024-02-25',
  },
  {
    id: '3',
    request_id: '3',
    freelancer_id: '1',
    client_id: '5',
    client_name: 'David Park',
    name: 'Restaurant Branding Package',
    status: 'completed',
    progress: 100,
    project_type: 'Design',
    created_at: '2023-11-10',
  },
  {
    id: '4',
    request_id: '4',
    freelancer_id: '1',
    client_id: '6',
    client_name: 'Lisa Thompson',
    name: 'Fitness Hub Platform',
    status: 'active',
    progress: 80,
    project_type: 'Web App',
    created_at: '2024-02-01',
  },
  {
    id: '5',
    request_id: '5',
    freelancer_id: '1',
    client_id: '8',
    client_name: 'Amanda Foster',
    name: 'Consulting Website',
    status: 'active',
    progress: 25,
    project_type: 'Website',
    created_at: '2024-02-10',
  },
  {
    id: '6',
    request_id: '6',
    freelancer_id: '1',
    client_id: '9',
    client_name: 'Robert Chang',
    name: 'Real Estate Portal',
    status: 'active',
    progress: 55,
    project_type: 'Web App',
    created_at: '2024-03-05',
  },
];

export const getWorkspaceById = (id: string) => mockWorkspaces.find(w => w.id === id);
