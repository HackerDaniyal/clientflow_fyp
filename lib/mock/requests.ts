export interface ClientRequest {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  freelancer_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'info_requested';
  project_name: string;
  project_type: string;
  description: string;
  budget_range: string;
  deadline: string;
  created_at: string;
}

export const mockRequests: ClientRequest[] = [
  {
    id: '1',
    client_id: '4',
    client_name: 'Emily Rodriguez',
    client_email: 'emily@fashionbrand.com',
    freelancer_id: '1',
    status: 'pending',
    project_name: 'Fashion Brand Website',
    project_type: 'Website',
    description: 'Need a modern e-commerce website for our fashion brand. We want to showcase our collections and allow online purchases.',
    budget_range: '$5,000 - $8,000',
    deadline: '2024-05-01',
    created_at: '2024-03-15',
  },
  {
    id: '2',
    client_id: '7',
    client_name: 'James Wilson',
    client_email: 'james@ecommerce.com',
    freelancer_id: '1',
    status: 'pending',
    project_name: 'E-commerce Platform Upgrade',
    project_type: 'Web App',
    description: 'Looking to upgrade our existing e-commerce platform with better UX, mobile responsiveness, and payment integration.',
    budget_range: '$10,000 - $15,000',
    deadline: '2024-06-15',
    created_at: '2024-03-14',
  },
  {
    id: '3',
    client_id: '8',
    client_name: 'Amanda Foster',
    client_email: 'amanda@consulting.com',
    freelancer_id: '1',
    status: 'accepted',
    project_name: 'Consulting Website',
    project_type: 'Website',
    description: 'Professional website for our consulting firm with portfolio, testimonials, and contact forms.',
    budget_range: '$6,000 - $7,000',
    deadline: '2024-04-30',
    created_at: '2024-02-05',
  },
  {
    id: '4',
    client_id: '9',
    client_name: 'Robert Chang',
    client_email: 'robert@realestate.com',
    freelancer_id: '1',
    status: 'accepted',
    project_name: 'Real Estate Portal',
    project_type: 'Web App',
    description: 'Full-featured real estate portal with property listings, search filters, agent dashboards, and map integration.',
    budget_range: '$12,000 - $18,000',
    deadline: '2024-07-01',
    created_at: '2024-02-28',
  },
  {
    id: '5',
    client_id: '6',
    client_name: 'Lisa Thompson',
    client_email: 'lisa@fitnesshub.com',
    freelancer_id: '1',
    status: 'accepted',
    project_name: 'Fitness Hub Platform',
    project_type: 'Web App',
    description: 'Subscription-based fitness platform with class booking, video streaming, and progress tracking.',
    budget_range: '$15,000 - $20,000',
    deadline: '2024-05-15',
    created_at: '2024-01-25',
  },
];

export const getRequestsByStatus = (status: ClientRequest['status']) => mockRequests.filter(r => r.status === status);
