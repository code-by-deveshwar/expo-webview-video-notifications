// app/webview.tsx
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Link } from "expo-router";
import { useState } from "react";
import { scheduleNotification } from "@utils/notifications";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WebViewScreen() {
  const [loading, setLoading] = useState(true);
  const [hasNotified, setHasNotified] = useState(false);
  const { top, bottom } = useSafeAreaInsets();

  const handleButton1 = () =>
    scheduleNotification("👋 Hello!", "First notification triggered!", 3);

  const handleButton2 = () =>
    scheduleNotification("⏰ Reminder", "Don’t forget to check the video!", 5, {
      target: "video",
    });

  const handleLoadEnd = async () => {
    setLoading(false);
    // ✅ Send a one-time notification when WebView finishes loading
    if (!hasNotified) {
      setHasNotified(true);
      await scheduleNotification(
        "✅ WebView Loaded",
        "Your website has finished loading!",
        2
      );
    }
  };

  return (
    <LinearGradient
      colors={["#020617", "#1e293b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View
        style={[
          styles.container,
          { paddingTop: top + 16, paddingBottom: bottom + 20 },
        ]}
      >
        <View className="mb-4 mt-10">
          <Text className="text-4xl font-semibold text-white tracking-tight">
            Embedded Web Experience
          </Text>
          <Text className="text-base text-slate-300 mt-2 leading-5">
            Trigger contextual alerts directly from the web content and guide users into native flows.
          </Text>
        </View>

        <View className="flex-1 bg-white/95 rounded-3xl shadow-2xl overflow-hidden border border-white/40">
          <View className="px-6 py-4 border-b border-slate-100 bg-white/80">
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              live preview
            </Text>
            <Text className="text-lg font-semibold text-slate-900 mt-1">
              expo.dev in-app
            </Text>
            <Text className="text-sm text-slate-500 mt-1">
              Notifications queue while the webview boots and respond after load.
            </Text>
          </View>

          <View className="flex-1">
            {loading && (
              <View className="absolute inset-0 z-10 bg-slate-900/70 justify-center items-center">
                <ActivityIndicator size="large" color="#60a5fa" />
                <Text className="mt-3 text-slate-200 font-medium">
                  Bringing the site online…
                </Text>
              </View>
            )}
            <WebView
              source={{ uri: "https://expo.dev" }}
              onLoadEnd={handleLoadEnd}
            />
          </View>

          {/* Buttons */}
          <View className="px-6 py-5 border-t border-slate-100 bg-white/85">
            <Text className="text-slate-500 font-medium mb-3">
              Trigger local notifications
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleButton1}
                className="flex-1 rounded-2xl bg-blue-600/90 border border-blue-500 shadow-md shadow-blue-500/20 px-4 py-3"
              >
                <Text className="text-white text-center font-semibold">
                  Friendly Ping (3s)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleButton2}
                className="flex-1 rounded-2xl bg-emerald-500/90 border border-emerald-400 shadow-md shadow-emerald-500/20 px-4 py-3"
              >
                <Text className="text-white text-center font-semibold">
                  Video Reminder (5s)
                </Text>
              </TouchableOpacity>
            </View>

            <Link
              href="/video"
              className="mt-4 text-center text-blue-600 font-semibold"
            >
              ▶ Jump into the video player
            </Link>
          </View>
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
    paddingHorizontal: 24,
  },
});
