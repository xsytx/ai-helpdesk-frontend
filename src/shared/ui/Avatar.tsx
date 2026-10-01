import { getInitials } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";

interface AvatarProps {
  name: string;
  className?: string;
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white",
        className,
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
