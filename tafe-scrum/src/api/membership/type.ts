export interface MembershipProps {
  project: number;
  project_name?: string;
  project_slug?: string;
  role: number;
  role_name?: string;
  color?: string;
  created_at?: string;
  email?: string;
  full_name?: string;
  gravatar_id?: string;
  id?: number;
  invitation_extra_text?: string | null;
  invited_by?: number | null;
  is_admin?: boolean;
  is_owner?: boolean;
  is_user_active?: boolean;
  photo?: string | null;
  user?: number;
  user_email?: string;
  user_order?: number;
}

export interface CreateMembershipProps extends MembershipProps {
  username?: string;
}

export type EditMembershipProps = MembershipProps;
