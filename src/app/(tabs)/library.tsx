import { useTranslation } from "react-i18next";

import { ComingSoon } from "@/components/ComingSoon";

export default function LibraryScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t("tabs.library")} />;
}
