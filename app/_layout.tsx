// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  // ✅ Handle notification responses globally
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data, title } = response.notification.request.content;
      if (data && typeof data === "object" && data.target === "video") {
        router.push("/video");
        return;
      }

      if (title?.includes("Video") || title?.includes("Reminder")) {
        router.push("/video");
      }
    });

    return () => sub.remove();
  }, [router]);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-transparent" edges={[]}>
        <StatusBar style="light" />
        <View className="flex-1">
          <Stack
            screenOptions={{
              headerTransparent: true,
              headerShadowVisible: false,
              headerTitleAlign: "center",
              headerTintColor: "#e2e8f0",
              headerTitleStyle: { fontWeight: "700", fontSize: 18, color: "#e2e8f0" },
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="webview" options={{ title: "WebView" }} />
            <Stack.Screen name="video" options={{ title: "Video Player" }} />
          </Stack>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
