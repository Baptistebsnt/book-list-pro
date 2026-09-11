import { Tabs } from "expo-router"
import { Home, Plus } from "lucide-react-native"
import { HapticTab } from "@/components/haptic-tab"
import { useTheme } from "@/hooks/use-theme"

const TabLayout = () => {
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
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "Ajouter",
          tabBarIcon: ({ color, size }) => <Plus color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}

export default TabLayout
