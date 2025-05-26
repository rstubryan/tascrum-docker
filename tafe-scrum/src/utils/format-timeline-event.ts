import { TimelineEventProps } from "@/api/timeline/type";

export function formatEvent(feed: TimelineEventProps): string {
  switch (feed.event_type) {
    case "projects.project.create":
      return `<strong>${feed.data.user?.name}</strong> created project <strong>${feed.data.project?.name}</strong>`;

    case "epics.epic.create":
      return `<strong>${feed.data.user?.name}</strong> created epic <strong>${feed.data.epic?.subject || ""}</strong>`;

    case "userstories.userstory.create":
      return `<strong>${feed.data.user?.name}</strong> created user story <strong>${feed.data.userstory?.subject || ""}</strong>`;

    case "tasks.task.create":
      const taskData = feed.data as unknown as {
        task?: {
          subject?: string;
          userstory?: {
            subject?: string;
          };
        };
      };

      if (taskData.task?.userstory) {
        return `<strong>${feed.data.user?.name}</strong> created task <strong>${taskData.task.subject || ""}</strong> in user story <strong>${taskData.task.userstory.subject || ""}</strong>`;
      }
      return `<strong>${feed.data.user?.name}</strong> created task <strong>${taskData.task?.subject || ""}</strong>`;

    case "issues.issue.create":
      const issueData = feed.data as unknown as {
        issue?: {
          subject?: string;
          ref?: number;
        };
      };

      return `<strong>${feed.data.user?.name}</strong> created issue <strong>${issueData.issue?.subject || ""}</strong>`;

    case "milestones.milestone.create":
      const milestoneData = feed.data as unknown as {
        milestone?: {
          name?: string;
          slug?: string;
        };
      };

      return `<strong>${feed.data.user?.name}</strong> created sprint <strong>${milestoneData.milestone?.name || ""}</strong>`;

    case "projects.project.change":
      if (feed.data.values_diff) {
        const changes = Object.entries(feed.data.values_diff)
          .map(([key, value]) => {
            if (Array.isArray(value) && value.length === 2) {
              if (key === "is_epics_activated") {
                return `${value[1] ? "enabled" : "disabled"} epics module`;
              }
              if (key === "is_backlog_activated") {
                return `${value[1] ? "enabled" : "disabled"} backlog module`;
              }
              if (key === "is_kanban_activated") {
                return `${value[1] ? "enabled" : "disabled"} kanban module`;
              }
              if (key === "is_wiki_activated") {
                return `${value[1] ? "enabled" : "disabled"} wiki module`;
              }
              if (key === "is_issues_activated") {
                return `${value[1] ? "enabled" : "disabled"} issues module`;
              }
              if (key === "description") {
                return "updated project description";
              }
              return `updated ${key.replace(/_/g, " ")}`;
            }
            return null;
          })
          .filter(Boolean)
          .join(", ");

        if (changes) {
          return `<strong>${feed.data.user?.name}</strong> ${changes} in project <strong>${feed.data.project?.name}</strong>`;
        }
      }
      return `<strong>${feed.data.user?.name}</strong> updated project <strong>${feed.data.project?.name}</strong>`;

    default:
      return `<strong>${feed.data.user?.name}</strong> performed action on <strong>${feed.data.project?.name || ""}</strong>`;
  }
}

export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
}
