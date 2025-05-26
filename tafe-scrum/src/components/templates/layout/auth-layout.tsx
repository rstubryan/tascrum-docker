import { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export default function AuthLayout({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
        <p className="mt-6 text-center">
          {footerText}{" "}
          <Link href={footerLinkHref} className="font-semibold text-primary">
            {footerLinkText}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
