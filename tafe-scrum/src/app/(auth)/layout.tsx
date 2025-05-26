import React from "react";
import QueryClientProviderWrapper from "@/components/templates/query-client/query-client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>;
}
