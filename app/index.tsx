// app/index.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "./global.css"; // ensures NativeWind styling works globally

/**
 * Home Screen
 * - Acts as the entry point for the app.
 * - Simple, clean, and consistent design with the rest of the UI.
 */
export default function Home() {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#0f172a", "#1d4ed8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View
        style={[
          styles.container,
          { paddingTop: top + 24, paddingBottom: bottom + 32 },
        ]}
      >
        <View className="bg-white/95 rounded-3xl p-8 shadow-2xl">
          <View className="items-center mb-6">
            <View className="h-16 w-16 rounded-2xl bg-blue-100 items-center justify-center mb-4">
              <Text className="text-3xl">🚀</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 text-center">
              Expo Feature Showcase
            </Text>
            <Text className="text-base text-gray-600 mt-2 text-center leading-5">
              Explore WebView interactions, rich notifications, and immersive HLS playback—all in one polished experience.
            </Text>
          </View>

          <View className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 mb-6">
            <Text className="text-sm uppercase tracking-wide text-blue-600 font-semibold">
              What's inside
            </Text>
            <Text className="text-gray-700 mt-1">
              Seamless navigation, custom video controls, and smart alerts tailored for native and Expo Go testing.
            </Text>
          </View>

          <Link href="/webview" asChild>
            <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/30 active:opacity-80">
              <Text className="text-white font-semibold text-lg text-center">
                Enter the experience →
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
});
