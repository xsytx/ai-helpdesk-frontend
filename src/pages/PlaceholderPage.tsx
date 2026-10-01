import { Card } from "@/shared/ui/Card";

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <h1 className="text-xl font-bold text-primary">{title}</h1>
        <p className="mt-2 text-sm text-label">{description}</p>
      </Card>
    </div>
  );
}
