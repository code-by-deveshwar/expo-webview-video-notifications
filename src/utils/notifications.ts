import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications behave when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // show banner while app is foregrounded
    shouldShowList: true,     // include in notification center
    shouldPlaySound: true,    // play a sound
    shouldSetBadge: false,    // don't modify app badge count
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    enableVibrate: true,
    enableLights: true,
  });
}

/**
 * Requests permission and schedules a local notification.
 * @param title - Notification title
 * @param body - Notification body text
 * @param delaySeconds - Delay (in seconds) before showing notification
 */
export async function scheduleNotification(
  title: string,
  body: string,
  delaySeconds: number = 3,
  payload: Record<string, unknown> = {}
) {
  // ✅ Ask for permission first
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission for notifications was not granted");
    return;
  }

  await ensureAndroidChannel();

  // ✅ Schedule notification (Expo SDK 51+ type-safe format)
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
      data: payload,
      ...(Platform.OS === "android" ? { channelId: "default" } : null),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // ✅ required
      seconds: delaySeconds,
      repeats: false,
    },
  });
}
