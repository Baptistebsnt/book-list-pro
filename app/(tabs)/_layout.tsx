import { Tabs } from "expo-router"
import { Home, Plus } from "lucide-react-native"
import { HapticTab } from "@/components/haptic-tab"
import { Colors } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
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
