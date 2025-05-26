export interface LoginRequestProps {
  type: string;
  username: string;
  password: string;
}

export interface RegisterRequestProps {
  type: string;
  username: string;
  password: string;
  email: string;
  full_name: string;
  accepted_terms: string;
}

export interface AuthResponseProps {
  accepted_terms: boolean;
  auth_token: string;
  big_photo: string | null;
  bio: string;
  color: string;
  date_joined: string;
  email: string;
  full_name: string;
  full_name_display: string;
  gravatar_id: string;
  id: number;
  is_active: boolean;
  lang: string;
  max_memberships_private_projects: number | null;
  max_memberships_public_projects: number | null;
  max_private_projects: number | null;
  max_public_projects: number | null;
  message: string;
  photo: string | null;
  read_new_terms: boolean;
  refresh: string;
  roles: string[];
  theme: string;
  timezone: string;
  total_private_projects: number;
  total_public_projects: number;
  username: string;
  uuid: string;
}

export type LoginProps = LoginRequestProps;
export type RegisterProps = RegisterRequestProps;
