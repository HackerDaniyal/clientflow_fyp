export type ProfileRole = "freelancer" | "client" | "admin";

export type Profile = {
  id: string;
  role: ProfileRole;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  company_name: string | null;
};

export type ProjectRequestStatus = "pending" | "accepted" | "rejected" | "archived";

export type Workspace = {
  id: string;
  name: string;
  status: string;
  pipeline_stage: string;
  progress_percent: number;
  client_id: string | null;
  freelancer_id: string | null;
  access_token: string | null;
};

export type MessageRow = {
  id: string;
  workspace_id: string;
  sender_id: string | null;
  content: string;
  type: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  workspace_id: string | null;
  created_at: string;
};

export type DocumentType = "proposal" | "invoice" | "contract";
