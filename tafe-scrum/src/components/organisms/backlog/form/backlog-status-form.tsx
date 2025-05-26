// src/components/organisms/backlog/form/backlog-status-form.tsx
"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserStoryProps } from "@/api/backlog-us/type";

// Define default statuses with their standard values for user stories
export const DEFAULT_US_STATUSES = [
  { name: "New", color: "#70728F", is_closed: false },
  { name: "Ready", color: "#40A8E4", is_closed: false },
  { name: "In progress", color: "#E47C40", is_closed: false },
  { name: "Ready for test", color: "#E4CE40", is_closed: false },
  { name: "Done", color: "#A8E440", is_closed: true },
  { name: "Archived", color: "#555555", is_closed: true },
];

interface StatusOption {
  value: number;
  label: string;
  color: string;
  is_closed: boolean;
}

interface BacklogStatusFormProps {
  userStories: UserStoryProps[];
  currentStatus?: number;
  onStatusChange: (newStatusValue: number) => void;
  className?: string;
}

export default function BacklogStatusForm({
  userStories,
  currentStatus,
  onStatusChange,
  className = "w-[130px]",
}: BacklogStatusFormProps) {
  // Calculate status options with proper values based on the existing user stories
  const statusOptions = useMemo(() => {
    const statusMap = new Map<number, StatusOption>();

    // First pass: collect all existing statuses from user stories
    if (userStories.length > 0) {
      userStories.forEach((story) => {
        if (story.status !== undefined && story.status_extra_info) {
          statusMap.set(story.status, {
            value: story.status,
            label: story.status_extra_info.name || "Unknown",
            color: story.status_extra_info.color || "#ccc",
            is_closed: story.status_extra_info.is_closed || false,
          });
        }
      });
    }

    // If we found statuses, use them to determine the full range
    if (statusMap.size > 0) {
      const referenceStatus = Array.from(statusMap.values())[0];
      const referenceValue = referenceStatus.value;
      const referenceIndex = DEFAULT_US_STATUSES.findIndex(
        (s) => s.name === referenceStatus.label,
      );

      if (referenceIndex !== -1) {
        // Calculate the base value from which we'll increment
        const baseValue = referenceValue - referenceIndex;

        // Fill in any missing statuses based on the default pattern
        DEFAULT_US_STATUSES.forEach((status, index) => {
          const statusValue = baseValue + index;
          if (!statusMap.has(statusValue)) {
            statusMap.set(statusValue, {
              value: statusValue,
              label: status.name,
              color: status.color,
              is_closed: status.is_closed,
            });
          }
        });
      }
    } else {
      // If no statuses found, use default values starting from 1000
      DEFAULT_US_STATUSES.forEach((status, index) => {
        const statusValue = 1000 + index;
        statusMap.set(statusValue, {
          value: statusValue,
          label: status.name,
          color: status.color,
          is_closed: status.is_closed,
        });
      });
    }

    return Array.from(statusMap.values()).sort((a, b) => a.value - b.value);
  }, [userStories]);

  return (
    <Select
      value={currentStatus?.toString()}
      onValueChange={(value) => onStatusChange(parseInt(value))}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((statusOption) => (
          <SelectItem
            key={statusOption.value}
            value={statusOption.value.toString()}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusOption.color }}
              />
              {statusOption.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
