export interface UserProps {
  id?: number;
  username?: string;
  full_name?: string;
  full_name_display?: string;
  color?: string;
  accepted_terms?: boolean;
  auth_token?: string;
  big_photo?: string | null;
  bio?: string;
  date_joined?: string;
  email?: string;
  gravatar_id?: string;
  is_active?: boolean;
  lang?: string;
  max_memberships_private_projects?: number | null;
  max_memberships_public_projects?: number | null;
  max_private_projects?: number | null;
  max_public_projects?: number | null;
  photo?: string | null;
  read_new_terms?: boolean;
  refresh?: string;
  roles?: string[];
  theme?: string;
  timezone?: string;
  total_private_projects?: number;
  total_public_projects?: number;
  uuid?: string;
  verified_email?: boolean;
  [key: string]: unknown;
}

export interface EditUserProfileProps {
  id?: number;
  username?: string;
  email?: string;
  full_name?: string;
  bio?: string;
  lang?: string;
  theme?: string;
  timezone?: string;
}

export interface ChangePasswordProps {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface DeleteUserAccountProps {
  id: string;
}
