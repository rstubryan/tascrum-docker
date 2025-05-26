export interface CreateProjectProps {
  name?: string;
  slug?: string;
  description?: string;
  is_private?: boolean;
  is_looking_for_people?: boolean;
  looking_for_people_note?: string;
  is_featured?: boolean;
  is_backlog_activated?: boolean;
  is_kanban_activated?: boolean;
  is_wiki_activated?: boolean;
  is_issues_activated?: boolean;
  is_contact_activated?: boolean;
  is_epics_activated?: boolean;
  creation_template?: number;
}

export interface EditProjectProps extends CreateProjectProps {
  id?: number;
}

export interface ProjectMember {
  role: number;
  role_name: string;
  full_name: string;
  full_name_display: string;
  is_active: boolean;
  id: number;
  color: string;
  username: string;
  photo: string | null;
  gravatar_id: string;
}

export interface ProjectProps {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  created_date?: string;
  modified_date?: string;
  owner?: {
    username?: string;
    full_name_display?: string;
    photo?: string;
    big_photo?: string;
    gravatar_id?: string;
    is_active?: boolean;
    id?: number;
  };
  members?: ProjectMember[];
  total_milestones?: number | null;
  total_story_points?: number | null;
  is_contact_activated?: boolean;
  is_epics_activated?: boolean;
  is_backlog_activated?: boolean;
  is_kanban_activated?: boolean;
  is_wiki_activated?: boolean;
  is_issues_activated?: boolean;
  videoconferences?: never;
  videoconferences_extra_data?: never;
  creation_template?: number;
  is_private?: boolean;
  anon_permissions?: string[];
  public_permissions?: string[];
  is_featured?: boolean;
  is_looking_for_people?: boolean;
  looking_for_people_note?: string;
  blocked_code?: never;
  totals_updated_datetime?: string;
  total_fans?: number;
  total_fans_last_week?: number;
  total_fans_last_month?: number;
  total_fans_last_year?: number;
  total_activity?: number;
  total_activity_last_week?: number;
  total_activity_last_month?: number;
  total_activity_last_year?: number;
  tags?: never[];
  tags_colors?: { [key: string]: string };
  default_epic_status?: number;
  default_points?: number;
  default_us_status?: number;
  default_task_status?: number;
  default_priority?: number;
  default_severity?: number;
  default_issue_status?: number;
  default_issue_type?: number;
  default_swimlane?: never;
  my_permissions?: string[];
  i_am_owner?: boolean;
  i_am_admin?: boolean;
  i_am_member?: boolean;
  notify_level?: number;
  total_closed_milestones?: number;
  is_watcher?: boolean;
  total_watchers?: number;
  logo_small_url?: string | null;
  logo_big_url?: string | null;
  is_fan?: boolean;
  my_homepage?: boolean;
}
