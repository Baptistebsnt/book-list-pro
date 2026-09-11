import { Tabs } from "expo-router"
import { Home, Plus } from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { HapticTab } from "@/components/haptic-tab"
import { useTheme } from "@/hooks/use-theme"

const TabLayout = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.foreground,
        tabBarInactiveTintColor: theme.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: t("tabs.add"),
          tabBarIcon: ({ color, size }) => <Plus color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}

export default TabLayout
