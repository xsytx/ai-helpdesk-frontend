import { cn } from "@/shared/lib/cn";
import { ChevronUp } from "lucide-react";

export function LikeButton({
  likes,
  active,
  disabled,
  onClick,
  label,
}: {
  likes: number;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-label hover:bg-background-2 hover:text-primary",
        disabled && "opacity-60",
      )}
      aria-pressed={active}
    >
      <ChevronUp className={cn("h-4 w-4", active && "fill-primary")} />
      {likes}
    </button>
  );
}
