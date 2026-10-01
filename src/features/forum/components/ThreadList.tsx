import type { Thread } from "@/entities/forum";
import { useLocale } from "@/i18n/LocaleContext";
import { ThreadCard } from "./ThreadCard";

export function ThreadList({ threads }: { threads: Thread[] }) {
  const { t } = useLocale();
  if (threads.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-label">{t("noThreadsYet")}</p>
    );
  }
  return (
    <ul className="divide-y divide-border/40">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </ul>
  );
}
