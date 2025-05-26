"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskProps } from "@/api/task/type";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Default statuses similar to SlugTaskStatusForm
export const DEFAULT_STATUSES = [
  { name: "New", color: "#70728F", is_closed: false },
  { name: "In progress", color: "#E47C40", is_closed: false },
  { name: "Ready for test", color: "#E4CE40", is_closed: false },
  { name: "Closed", color: "#A8E440", is_closed: true },
  { name: "Needs Info", color: "#5178D3", is_closed: false },
];

interface StatusFilterOption {
  value: number | string;
  label: string;
  color: string;
}

interface TaskStatusFilterProps {
  tasks: TaskProps[];
  selectedStatus: string | null;
  onStatusFilterChange: (statusValue: string | null) => void;
  className?: string;
}

export default function TaskStatusFilter({
  tasks,
  selectedStatus,
  onStatusFilterChange,
  className = "w-[200px]",
}: TaskStatusFilterProps) {
  // Calculate status options with proper values based on the existing tasks
  const statusOptions = useMemo(() => {
    const statusMap = new Map<number, StatusFilterOption>();

    // Add "All" option
    const allOption: StatusFilterOption = {
      value: "all",
      label: "All Statuses",
      color: "#6E6E6E",
    };

    // First pass: collect all existing statuses from tasks
    if (tasks?.length > 0) {
      tasks.forEach((task) => {
        if (task.status !== undefined && task.status_extra_info) {
          statusMap.set(task.status, {
            value: task.status,
            label: task.status_extra_info.name || "Unknown",
            color: task.status_extra_info.color || "#ccc",
          });
        }
      });
    }

    // If no statuses found, use default values
    if (statusMap.size === 0) {
      DEFAULT_STATUSES.forEach((status, index) => {
        const statusValue = 1000 + index;
        statusMap.set(statusValue, {
          value: statusValue,
          label: status.name,
          color: status.color,
        });
      });
    }

    // Convert map to array and sort
    const sortedOptions = Array.from(statusMap.values()).sort((a, b) => {
      if (typeof a.value === "string" || typeof b.value === "string") {
        return String(a.label).localeCompare(String(b.label));
      }
      return Number(a.value) - Number(b.value);
    });

    // Add the "All" option at the beginning
    return [allOption, ...sortedOptions];
  }, [tasks]);

  const handleClearFilter = () => {
    onStatusFilterChange(null);
  };

  return (
    <div className="flex gap-2 items-center">
      <Select
        value={selectedStatus || "all"}
        onValueChange={(value) =>
          onStatusFilterChange(value === "all" ? null : value)
        }
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((statusOption) => (
            <SelectItem
              key={String(statusOption.value)}
              value={String(statusOption.value)}
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

      {selectedStatus && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearFilter}
          className="h-9 w-9"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
