export interface CreateIssueProps {
  assigned_to?: number | null;
  blocked_note?: string;
  description?: string;
  is_blocked?: boolean;
  is_closed?: boolean;
  milestone?: number | null;
  project: number;
  status?: number;
  severity?: number;
  priority?: number;
  type?: number;
  subject: string;
  tags?: string[];
  watchers?: number[];
}

export interface EditIssueProps extends CreateIssueProps {
  id: number;
  version?: number;
  due_date?: string | null;
  description?: string;
}

export interface IssueProps {
  id?: number;
  ref?: number;
  project?: number;
  subject?: string;
  description?: string;
  status?: number;
  is_closed?: boolean;
  milestone?: null | number;
  severity?: number;
  priority?: number;
  type?: number;
  created_date?: string;
  modified_date?: string;
  finished_date?: null | string;
  is_blocked?: boolean;
  blocked_note?: string;
  tags?: Array<[string, null | string]>;
  assigned_to?: null | number;
  due_date?: null | string;
  due_date_reason?: string;
  due_date_status?: string;
  status_extra_info?: {
    name: string;
    color: string;
    is_closed: boolean;
  };
  assigned_to_extra_info?: null | {
    username: string;
    full_name_display: string;
    photo: string;
    big_photo: string;
    gravatar_id: string;
    is_active: boolean;
    id: number;
  };
  owner?: number;
  owner_extra_info?: {
    username: string;
    full_name_display: string;
    photo: string;
    big_photo: string;
    gravatar_id: string;
    is_active: boolean;
    id: number;
  };
  is_watcher?: boolean;
  total_watchers?: number;
  is_voter?: boolean;
  total_voters?: number;
  project_extra_info?: {
    name: string;
    slug: string;
    logo_small_url: null | string;
    id: number;
  };
  watchers?: number[];
  attachments?: never[];
  external_reference?: null | string;
  version?: number;
}
