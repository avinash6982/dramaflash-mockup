import { useTranslation } from "react-i18next";

import { ComingSoon } from "@/components/ComingSoon";

export default function DiscoverScreen() {
  const { t } = useTranslation();
  return <ComingSoon title={t("tabs.discover")} />;
}
