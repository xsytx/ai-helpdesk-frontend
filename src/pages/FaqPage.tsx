import { FaqPanel } from "@/features/chat/components/FaqPanel";

export function FaqPage() {
  return (
    <div className="mx-auto max-w-lg">
      <FaqPanel compact={false} />
    </div>
  );
}
