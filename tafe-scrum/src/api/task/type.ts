export interface CreateTaskProps {
  subject: string;
  description?: string;
  project?: number;
  user_story?: number;
  status?: number;
  is_closed?: boolean;
  assigned_to?: null | number;
  assigned_users?: number[];
  milestone?: null | number;
  is_blocked?: boolean;
  blocked_note?: string;
  tags?: Array<string>;
  watchers?: number[];
  due_date?: null | string;
  us_order?: number;
  taskboard_order?: number;
  is_iocaine?: boolean;
  version?: number;
}

export interface UpdateTaskProps extends CreateTaskProps {
  id?: number;
  version?: number;
}

export interface TaskProps {
  id?: number;
  ref?: number;
  user_story?: number;
  project?: number;
  subject?: string;
  description?: string;
  status?: number;
  is_closed?: boolean;
  milestone?: null | number;
  milestone_slug?: null | string;
  created_date?: string;
  modified_date?: string;
  finished_date?: null | string;
  is_blocked?: boolean;
  blocked_note?: string;
  is_iocaine?: boolean;
  tags?: never[];
  assigned_to?: null | number;
  due_date?: null | string;
  due_date_reason?: string;
  due_date_status?: string;
  us_order?: number;
  taskboard_order?: number;
  version?: number;
  watchers?: never[];
  status_extra_info?: {
    name?: string;
    color?: string;
    is_closed?: boolean;
  };
  assigned_to_extra_info?: {
    username?: string;
    full_name_display?: string;
    photo?: string;
    big_photo?: string;
    gravatar_id?: string;
    is_active?: boolean;
    id?: number;
  };
  owner?: number;
  owner_extra_info?: {
    username?: string;
    full_name_display?: string;
    photo?: string;
    big_photo?: string;
    gravatar_id?: string;
    is_active?: boolean;
    id?: number;
  };
  is_watcher?: boolean;
  total_watchers?: number;
  is_voter?: boolean;
  total_voters?: number;
  project_extra_info?: {
    name?: string;
    slug?: string;
    logo_small_url?: null | string;
    id?: number;
  };
  user_story_extra_info?: {
    id?: number;
    ref?: number;
    subject?: string;
    epics?: null | never;
  };
  total_comments?: number;
  attachments?: never[];
  external_reference?: null | string;
  comment?: string;
  blocked_note_html?: string;
  description_html?: string;
  generated_user_stories?: null | never;
  assigned_users?: number[];
}
