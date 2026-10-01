import { useLocale } from "@/i18n/LocaleContext";
import type { ThreadSort } from "@/entities/forum";
import type { ReactNode } from "react";

export function ThreadSortToggle({
  sort,
  onSortChange,
}: {
  sort: ThreadSort;
  onSortChange: (sort: ThreadSort) => void;
}) {
  const { t } = useLocale();
  return (
    <div className="flex rounded-lg bg-background-2 p-0.5 text-xs font-semibold">
      <SortButton active={sort === "top"} onClick={() => onSortChange("top")}>
        {t("top")}
      </SortButton>
      <SortButton active={sort === "newest"} onClick={() => onSortChange("newest")}>
        {t("newest")}
      </SortButton>
    </div>
  );
}

function SortButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-md bg-white px-3 py-1.5 text-primary shadow-sm"
          : "rounded-md px-3 py-1.5 text-label hover:text-primary"
      }
    >
      {children}
    </button>
  );
}
