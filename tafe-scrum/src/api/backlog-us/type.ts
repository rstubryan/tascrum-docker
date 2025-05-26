export interface CreateUserStoryProps {
  project: number;
  subject: string;
  assigned_to?: number | null;
  backlog_order?: number;
  blocked_note?: string;
  client_requirement?: boolean;
  description?: string;
  is_blocked?: boolean;
  is_closed?: boolean;
  kanban_order?: number;
  milestone?: number | null;
  points?: Record<string, number>;
  sprint_order?: number;
  status?: number;
  tags?: string[];
  team_requirement?: boolean;
  watchers?: number[];
}

export interface EditUserStoryProps extends CreateUserStoryProps {
  id?: number;
  version?: number;
  due_date?: string | null;
  description?: string;
  assigned_to?: number | null;
  assigned_users?: number[];
}

export interface UserStoryProps {
  id?: number;
  ref?: number;
  project?: number;
  subject?: string;
  description?: null | string;
  status?: number;
  is_closed?: boolean;
  milestone?: null | number;
  milestone_slug?: null | string;
  milestone_name?: null | string;
  points?: Record<string, number>;
  backlog_order?: number;
  sprint_order?: number;
  kanban_order?: number;
  created_date?: string;
  modified_date?: string;
  finish_date?: null | string;
  client_requirement?: boolean;
  team_requirement?: boolean;
  version?: number;
  watchers?: number[];
  is_blocked?: boolean;
  blocked_note?: string;
  tags?: Array<[string, null | string]>;
  assigned_to?: null | number;
  assigned_users?: number[];
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
  total_comments?: number;
  total_attachments?: number;
  total_points?: null | number;
  epics?: Array<{
    color: string | null;
    id: number | null;
    ref: number | null;
    subject: string | null;
    project: {
      id: number | null;
      name: string | null;
      slug: string | null;
    };
  }>;
  epic_order?: null | number;
  tasks?: never[];
  attachments?: never[];
  external_reference?: null | string;
  tribe_gig?: null | number;
  comment?: string;
  origin_issue?: null | number;
  origin_task?: null | number;
  generated_from_issue?: null | number;
  generated_from_task?: null | number;
  from_task_ref?: null | string;
}
