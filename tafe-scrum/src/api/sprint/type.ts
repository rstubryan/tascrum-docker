export interface CreateSprintProps {
  name?: string;
  project?: number;
  estimated_start?: string;
  estimated_finish?: string;
  closed?: boolean;
  disponibility?: number;
  order?: number;
}

export interface EditSprintProps extends CreateSprintProps {
  id?: number;
  version?: number;
}

export interface SprintProps {
  id?: number;
  name?: string;
  slug?: string;
  project?: number;
  owner?: number;
  estimated_start?: string;
  estimated_finish?: string;
  created_date?: string;
  modified_date?: string;
  closed?: boolean;
  disponibility?: number;
  order?: number;
  user_stories?: never[];
  total_points?: number | null;
  closed_points?: number | null;
  version?: number;
  project_extra_info?: {
    name?: string;
    slug?: string;
    logo_small_url?: string | null;
    id?: number;
  };
}
