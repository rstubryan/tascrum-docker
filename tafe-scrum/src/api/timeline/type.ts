export interface TimelineEventProps {
  id: number;
  content_type: number;
  object_id: number;
  namespace: string;
  event_type: string;
  project: number;
  data_content_type: number;
  created: string;
  data: {
    user?: {
      id: number;
      name: string;
      photo?: string;
      gravatar_id: string;
      username: string;
      is_profile_visible?: boolean;
    };
    project?: {
      id: number;
      name: string;
      slug: string;
      description?: string;
    };
    comment?: string;
    comment_html?: string;
    values_diff?: {
      subject?: [string, string];
      [key: string]: [unknown, unknown] | undefined;
    };
    userstory?: {
      ref: number;
      subject: string;
      id?: number;
    };
    relateduserstory?: {
      subject: string;
    };
    epic?: {
      id?: number;
      subject?: string;
      title?: string;
    };
    milestone?: {
      name: string;
    };
    role?: {
      name: string;
    };
  };
}
