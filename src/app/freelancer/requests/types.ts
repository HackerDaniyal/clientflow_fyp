export type ProjectFormData = {
  project_name?: string;
  project_type?: string;
  description?: string;
  budget_range?: string;
  timeline_start?: string;
  timeline_end?: string;
  business_name?: string;
  industry?: string;
  target_audience?: string;
  platforms?: string[];
  technology_preferences?: string;
  assets?: {
    logo?: { name: string; url: string };
    references?: { name: string; url: string }[];
    documents?: { name: string; url: string }[];
  };
};

export type ProjectRequestRow = {
  id: string;
  client_id: string;
  freelancer_id: string;
  status: string;
  form_data: ProjectFormData | null;
  submitted_at: string;
  responded_at: string | null;
  client: {
    full_name: string | null;
    email: string | null;
  } | null;
};
