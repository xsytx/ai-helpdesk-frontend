import { useLocale } from "@/i18n/LocaleContext";
import { AskAnythingSection } from "@/features/chat/components/AskAnythingSection";
import { ForumPreview } from "@/features/forum/components/ForumPreview";
import { FaqPanel } from "@/features/chat/components/FaqPanel";

export function HomePage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <AskAnythingSection />
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(260px,320px)]">
        <ForumPreview />
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="sr-only">
            {t("faq")}
          </h2>
          <FaqPanel compact={false} />
        </section>
      </div>
    </div>
  );
}
