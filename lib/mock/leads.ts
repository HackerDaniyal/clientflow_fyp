export interface Lead {
  id: string;
  freelancer_id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'lead' | 'contacted' | 'proposal_sent' | 'negotiating' | 'won' | 'lost';
  notes: string;
  source: string;
  follow_up_date: string;
  position: number;
}

export const mockLeads: Lead[] = [
  // Lead column
  { id: '1', freelancer_id: '1', name: 'Jennifer Adams', email: 'jennifer@techstart.com', company: 'TechStart Inc.', phone: '+1 555-0201', status: 'lead', notes: 'Interested in e-commerce website', source: 'Referral', follow_up_date: '2024-03-20', position: 1 },
  { id: '2', freelancer_id: '1', name: 'Mark Thompson', email: 'mark@consulting.com', company: 'Thompson Consulting', phone: '+1 555-0202', status: 'lead', notes: 'Needs brand identity redesign', source: 'LinkedIn', follow_up_date: '2024-03-22', position: 2 },
  
  // Contacted column
  { id: '3', freelancer_id: '1', name: 'Rachel Green', email: 'rachel@fashion.com', company: 'Green Fashion', phone: '+1 555-0203', status: 'contacted', notes: 'Follow up next week', source: 'Website', follow_up_date: '2024-03-18', position: 1 },
  { id: '4', freelancer_id: '1', name: 'Tom Harris', email: 'tom@startup.com', company: 'Harris Startup', phone: '+1 555-0204', status: 'contacted', notes: 'Scheduled call for Thursday', source: 'Cold Email', follow_up_date: '2024-03-19', position: 2 },
  
  // Proposal Sent column
  { id: '5', freelancer_id: '1', name: 'Nina Patel', email: 'nina@ecommerce.com', company: 'Patel E-commerce', phone: '+1 555-0205', status: 'proposal_sent', notes: 'Sent $8,500 proposal', source: 'Referral', follow_up_date: '2024-03-25', position: 1 },
  { id: '6', freelancer_id: '1', name: 'Chris Martin', email: 'chris@agency.com', company: 'Martin Agency', phone: '+1 555-0206', status: 'proposal_sent', notes: 'Waiting for feedback', source: 'Networking', follow_up_date: '2024-03-23', position: 2 },
  
  // Negotiating column
  { id: '7', freelancer_id: '1', name: 'Sophia Lee', email: 'sophia@design.com', company: 'Lee Design Studio', phone: '+1 555-0207', status: 'negotiating', notes: 'Negotiating project scope and pricing', source: 'Referral', follow_up_date: '2024-03-21', position: 1 },
  
  // Won column
  { id: '8', freelancer_id: '1', name: 'Daniel Kim', email: 'daniel@tech.com', company: 'Kim Technologies', phone: '+1 555-0208', status: 'won', notes: 'Project starting next month', source: 'Website', follow_up_date: '2024-04-01', position: 1 },
  
  // Lost column
  { id: '9', freelancer_id: '1', name: 'Emma Wilson', email: 'emma@retail.com', company: 'Wilson Retail', phone: '+1 555-0209', status: 'lost', notes: 'Went with another freelancer', source: 'LinkedIn', follow_up_date: '2024-03-15', position: 1 },
  { id: '10', freelancer_id: '1', name: 'Ryan Clark', email: 'ryan@finance.com', company: 'Clark Finance', phone: '+1 555-0210', status: 'lost', notes: 'Budget constraints', source: 'Cold Email', follow_up_date: '2024-03-10', position: 2 },
];

export const getLeadsByStatus = (status: Lead['status']) => mockLeads.filter(l => l.status === status);
