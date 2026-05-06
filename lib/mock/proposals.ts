export interface Proposal {
  id: string;
  workspace_id: string;
  client_name: string;
  title: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  total: number;
  created_at: string;
  sent_at?: string;
  expires_at?: string;
}

export const mockProposals: Proposal[] = [
  { id: '1', workspace_id: '1', client_name: 'Sarah Miller', title: 'TechCorp Website Redesign Proposal', status: 'accepted', total: 8500, created_at: '2024-01-22', sent_at: '2024-01-23', expires_at: '2024-02-23' },
  { id: '2', workspace_id: '2', client_name: 'Michael Chen', title: 'Mobile App Development Proposal', status: 'accepted', total: 12000, created_at: '2024-02-26', sent_at: '2024-02-27', expires_at: '2024-03-27' },
  { id: '3', workspace_id: '4', client_name: 'Lisa Thompson', title: 'Fitness Hub Platform Proposal', status: 'accepted', total: 15000, created_at: '2024-02-02', sent_at: '2024-02-03', expires_at: '2024-03-03' },
  { id: '4', workspace_id: '5', client_name: 'Amanda Foster', title: 'Consulting Website Proposal', status: 'sent', total: 6500, created_at: '2024-03-01', sent_at: '2024-03-02', expires_at: '2024-04-02' },
  { id: '5', workspace_id: '6', client_name: 'Robert Chang', title: 'Real Estate Portal Proposal', status: 'viewed', total: 11200, created_at: '2024-03-06', sent_at: '2024-03-07', expires_at: '2024-04-07' },
  { id: '6', workspace_id: '3', client_name: 'David Park', title: 'Restaurant Branding Proposal', status: 'accepted', total: 6000, created_at: '2023-11-12', sent_at: '2023-11-13', expires_at: '2023-12-13' },
];

export const getProposalsByWorkspace = (workspaceId: string) => mockProposals.filter(p => p.workspace_id === workspaceId);
