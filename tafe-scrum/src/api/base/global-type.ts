import { z } from "zod";

export interface ResponseProps<T> {
  data?: T;
}

export interface FormFieldDefinition<T extends z.ZodType> {
  name: keyof z.infer<T>;
  label: string;
  type: string;
  required?: boolean;
  hidden?: boolean;
}

export interface ErrorResponse {
  code?: string;
  detail?: string;
  error?: string;
}
