export interface Client {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  company_name: string;
  phone: string;
  status: 'active' | 'onboarding' | 'completed' | 'paused';
  total_billed: number;
  project_count: number;
  workspace_id?: string;
  created_at: string;
}

export const mockClients: Client[] = [
  {
    id: '1',
    user_id: '2',
    full_name: 'Sarah Miller',
    email: 'sarah@techcorp.com',
    company_name: 'TechCorp Inc.',
    phone: '+1 555-0102',
    status: 'active',
    total_billed: 12500,
    project_count: 2,
    workspace_id: '1',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    user_id: '3',
    full_name: 'Michael Chen',
    email: 'michael@startupxyz.com',
    company_name: 'StartupXYZ',
    phone: '+1 555-0103',
    status: 'active',
    total_billed: 8500,
    project_count: 1,
    workspace_id: '2',
    created_at: '2024-02-20',
  },
  {
    id: '3',
    user_id: '4',
    full_name: 'Emily Rodriguez',
    email: 'emily@fashionbrand.com',
    company_name: 'Fashion Brand Co.',
    phone: '+1 555-0104',
    status: 'onboarding',
    total_billed: 0,
    project_count: 0,
    created_at: '2024-03-10',
  },
  {
    id: '4',
    user_id: '5',
    full_name: 'David Park',
    email: 'david@restaurant.com',
    company_name: 'Park Restaurants',
    phone: '+1 555-0105',
    status: 'completed',
    total_billed: 6000,
    project_count: 1,
    workspace_id: '3',
    created_at: '2023-11-05',
  },
  {
    id: '5',
    user_id: '6',
    full_name: 'Lisa Thompson',
    email: 'lisa@fitnesshub.com',
    company_name: 'Fitness Hub',
    phone: '+1 555-0106',
    status: 'active',
    total_billed: 15000,
    project_count: 3,
    workspace_id: '4',
    created_at: '2024-01-28',
  },
  {
    id: '6',
    user_id: '7',
    full_name: 'James Wilson',
    email: 'james@ecommerce.com',
    company_name: 'Wilson E-commerce',
    phone: '+1 555-0107',
    status: 'paused',
    total_billed: 4500,
    project_count: 1,
    created_at: '2023-12-15',
  },
  {
    id: '7',
    user_id: '8',
    full_name: 'Amanda Foster',
    email: 'amanda@consulting.com',
    company_name: 'Foster Consulting',
    phone: '+1 555-0108',
    status: 'active',
    total_billed: 9800,
    project_count: 2,
    workspace_id: '5',
    created_at: '2024-02-05',
  },
  {
    id: '8',
    user_id: '9',
    full_name: 'Robert Chang',
    email: 'robert@realestate.com',
    company_name: 'Chang Real Estate',
    phone: '+1 555-0109',
    status: 'active',
    total_billed: 11200,
    project_count: 1,
    workspace_id: '6',
    created_at: '2024-03-01',
  },
];
