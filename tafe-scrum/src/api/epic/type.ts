export interface CreateEpicProps {
  assigned_to?: number | null;
  blocked_note?: string;
  client_requirement?: boolean;
  color?: string;
  description?: string;
  epics_order?: number;
  is_blocked?: boolean;
  project: number;
  status?: number;
  subject?: string;
  tags?: string[];
  team_requirement?: boolean;
  watchers?: number[];
}

export interface EditEpicProps extends CreateEpicProps {
  id?: number;
  version?: number;
}

export interface EpicProps {
  tags?: never[];
  attachments?: never[];
  project?: number;
  project_extra_info?: {
    name: string;
    slug: string;
    logo_small_url: null | string;
    id: number;
  };
  status?: number;
  status_extra_info?: {
    name: string;
    color: string;
    is_closed: boolean;
  };
  assigned_to?: null | number;
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
  id?: number;
  ref?: number;
  created_date?: string;
  modified_date?: string;
  subject?: string;
  color?: string;
  epics_order?: number;
  client_requirement?: boolean;
  team_requirement?: boolean;
  version?: number;
  watchers?: never[];
  is_blocked?: boolean;
  blocked_note?: string;
  is_closed?: boolean;
  user_stories_counts?: {
    total: number;
    progress: null | number;
  };
  comment?: string;
  blocked_note_html?: string;
  description?: string;
  description_html?: string;
}
