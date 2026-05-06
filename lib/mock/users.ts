export interface User {
  id: string;
  role: 'freelancer' | 'client' | 'admin';
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  avatar_url?: string;
  bio?: string;
  portfolio_url?: string;
  referral_code?: string;
  plan?: 'free' | 'pro' | 'agency';
}

export const mockUsers: User[] = [
  {
    id: '1',
    role: 'freelancer',
    full_name: 'Alex Johnson',
    email: 'alex@designstudio.com',
    phone: '+1 555-0101',
    company_name: 'Johnson Design Studio',
    bio: 'Full-stack designer & developer specializing in brand identity and web applications',
    portfolio_url: 'https://alexjohnson.design',
    referral_code: 'ALEX2024',
    plan: 'pro',
  },
  {
    id: '2',
    role: 'client',
    full_name: 'Sarah Miller',
    email: 'sarah@techcorp.com',
    phone: '+1 555-0102',
    company_name: 'TechCorp Inc.',
  },
  {
    id: '3',
    role: 'client',
    full_name: 'Michael Chen',
    email: 'michael@startupxyz.com',
    phone: '+1 555-0103',
    company_name: 'StartupXYZ',
  },
  {
    id: '4',
    role: 'client',
    full_name: 'Emily Rodriguez',
    email: 'emily@fashionbrand.com',
    phone: '+1 555-0104',
    company_name: 'Fashion Brand Co.',
  },
  {
    id: '5',
    role: 'client',
    full_name: 'David Park',
    email: 'david@restaurant.com',
    phone: '+1 555-0105',
    company_name: 'Park Restaurants',
  },
  {
    id: '6',
    role: 'client',
    full_name: 'Lisa Thompson',
    email: 'lisa@fitnesshub.com',
    phone: '+1 555-0106',
    company_name: 'Fitness Hub',
  },
  {
    id: 'admin1',
    role: 'admin',
    full_name: 'Platform Admin',
    email: 'admin@clientflow.com',
  },
];

export const getCurrentUser = (): User => mockUsers[0]; // Default to freelancer
