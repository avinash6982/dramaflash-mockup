import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

import { useBottomInset } from "@/hooks/useBottomInset";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

const TAB_BAR_HEIGHT = 64; // top padding, icon and label, without the bottom inset

type IconName = React.ComponentProps<typeof Ionicons>["name"];

// Only Home works in the mock-up; the other tabs show a placeholder
const tabs: { name: string; titleKey: "home" | "discover" | "romance" | "library" | "profile"; icon: IconName }[] = [
  { name: "index", titleKey: "home", icon: "home-outline" },
  { name: "discover", titleKey: "discover", icon: "compass-outline" },
  { name: "romance", titleKey: "romance", icon: "heart-outline" },
  { name: "library", titleKey: "library", icon: "bookmark-outline" },
  { name: "profile", titleKey: "profile", icon: "person-outline" },
];

export default function TabLayout() {
  const { t } = useTranslation();
  const bottomInset = useBottomInset();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: TAB_BAR_HEIGHT + bottomInset,
          paddingTop: 8,
          paddingBottom: bottomInset,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(`tabs.${tab.titleKey}`),
            tabBarIcon: ({ color, size }) => <Ionicons name={tab.icon} size={size} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
