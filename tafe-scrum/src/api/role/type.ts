export interface RoleProps {
  computable: boolean;
  id: number;
  members_count: number;
  name: string;
  order: number;
  permissions: string[];
  project: number;
  slug: string;
}
