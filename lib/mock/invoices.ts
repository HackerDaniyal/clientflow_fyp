export interface Invoice {
  id: string;
  workspace_id: string;
  client_name: string;
  invoice_number: string;
  line_items: Array<{ description: string; quantity: number; unit_price: number }>;
  subtotal: number;
  discount: number;
  tax_rate: number;
  total: number;
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue';
  due_date: string;
  paid_at?: string;
  created_at: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    workspace_id: '1',
    client_name: 'Sarah Miller',
    invoice_number: 'INV-001',
    line_items: [
      { description: 'Homepage Design', quantity: 1, unit_price: 2500 },
      { description: 'Responsive Development', quantity: 1, unit_price: 4000 },
    ],
    subtotal: 6500,
    discount: 0,
    tax_rate: 0.1,
    total: 7150,
    status: 'paid',
    due_date: '2024-02-15',
    paid_at: '2024-02-14',
    created_at: '2024-02-01',
  },
  {
    id: '2',
    workspace_id: '2',
    client_name: 'Michael Chen',
    invoice_number: 'INV-002',
    line_items: [
      { description: 'User Research', quantity: 10, unit_price: 150 },
      { description: 'Wireframe Design', quantity: 1, unit_price: 3000 },
    ],
    subtotal: 4500,
    discount: 500,
    tax_rate: 0.1,
    total: 4400,
    status: 'paid',
    due_date: '2024-03-15',
    paid_at: '2024-03-10',
    created_at: '2024-03-01',
  },
  {
    id: '3',
    workspace_id: '4',
    client_name: 'Lisa Thompson',
    invoice_number: 'INV-003',
    line_items: [
      { description: 'Platform Development', quantity: 1, unit_price: 12000 },
      { description: 'Payment Integration', quantity: 1, unit_price: 3000 },
    ],
    subtotal: 15000,
    discount: 0,
    tax_rate: 0.1,
    total: 16500,
    status: 'partially_paid',
    due_date: '2024-03-30',
    created_at: '2024-03-01',
  },
  {
    id: '4',
    workspace_id: '3',
    client_name: 'David Park',
    invoice_number: 'INV-004',
    line_items: [
      { description: 'Logo Design', quantity: 1, unit_price: 1500 },
      { description: 'Brand Guidelines', quantity: 1, unit_price: 2500 },
      { description: 'Marketing Materials', quantity: 1, unit_price: 2000 },
    ],
    subtotal: 6000,
    discount: 0,
    tax_rate: 0.1,
    total: 6600,
    status: 'paid',
    due_date: '2023-12-15',
    paid_at: '2023-12-14',
    created_at: '2023-12-01',
  },
  {
    id: '5',
    workspace_id: '5',
    client_name: 'Amanda Foster',
    invoice_number: 'INV-005',
    line_items: [
      { description: 'Website Design & Development', quantity: 1, unit_price: 6500 },
    ],
    subtotal: 6500,
    discount: 0,
    tax_rate: 0.1,
    total: 7150,
    status: 'sent',
    due_date: '2024-04-15',
    created_at: '2024-03-15',
  },
  {
    id: '6',
    workspace_id: '6',
    client_name: 'Robert Chang',
    invoice_number: 'INV-006',
    line_items: [
      { description: 'Portal Development - Phase 1', quantity: 1, unit_price: 8000 },
    ],
    subtotal: 8000,
    discount: 1000,
    tax_rate: 0.1,
    total: 7700,
    status: 'overdue',
    due_date: '2024-03-10',
    created_at: '2024-02-20',
  },
];

export const getInvoicesByWorkspace = (workspaceId: string) => mockInvoices.filter(i => i.workspace_id === workspaceId);
