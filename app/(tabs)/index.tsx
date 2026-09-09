import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  const [count, setCount] = useState(0);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="gap-6 p-6">
        <View className="gap-1">
          <Text variant="h1" className="text-left">
            NativeWind check
          </Text>
          <Text variant="muted">
            If this looks styled, NativeWind + react-native-reusables are wired up.
          </Text>
        </View>

        {/* Plain NativeWind: utility classes on a RN View */}
        <View className="rounded-xl border border-border bg-card p-4 gap-2">
          <Text variant="large">Utility classes</Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="h-10 w-10 rounded-lg bg-primary" />
            <View className="h-10 w-10 rounded-lg bg-secondary" />
            <View className="h-10 w-10 rounded-lg bg-destructive" />
            <View className="h-10 w-10 rounded-lg bg-muted" />
            <View className="h-10 w-10 rounded-full border-2 border-border" />
          </View>
        </View>

        {/* react-native-reusables Text variants */}
        <View className="rounded-xl border border-border bg-card p-4 gap-2">
          <Text variant="large">{"<Text> variants"}</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="p">A paragraph of body text with relaxed leading.</Text>
          <Text variant="blockquote">A blockquote, indented with a left border.</Text>
          <Text variant="code">const answer = 42;</Text>
          <Text variant="lead">A lead sentence.</Text>
          <Text variant="muted">Muted footnote text.</Text>
        </View>

        {/* react-native-reusables Button variants + interaction */}
        <View className="rounded-xl border border-border bg-card p-4 gap-3">
          <Text variant="large">{"<Button> variants"}</Text>
          <Button onPress={() => setCount((c) => c + 1)}>
            <Text>Pressed {count} times</Text>
          </Button>
          <Button variant="secondary" onPress={() => setCount(0)}>
            <Text>Reset</Text>
          </Button>
          <Button variant="outline" onPress={toggleColorScheme}>
            <Text>Toggle theme (now: {colorScheme})</Text>
          </Button>
          <Button variant="destructive">
            <Text>Destructive</Text>
          </Button>
          <Button variant="ghost">
            <Text>Ghost</Text>
          </Button>
          <Button variant="link">
            <Text>Link</Text>
          </Button>
          <Button disabled>
            <Text>Disabled</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
