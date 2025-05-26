import { Typography } from "@/components/atoms/typography/typography";

export default function HeadContent({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <Typography size={"h2"}>{title}</Typography>
      <Typography size={"sm"} className="text-muted-foreground">
        {description}
      </Typography>
    </div>
  );
}
