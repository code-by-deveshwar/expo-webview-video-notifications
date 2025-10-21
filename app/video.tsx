// app/video.tsx
import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StyleSheet } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// 🎥 Define available video streams
const VIDEO_SOURCES = [
  {
    id: "mux1",
    name: "Main Stream",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  },
  {
    id: "mux2",
    name: "Nature Stream",
    url: "https://test-streams.mux.dev/test_001/stream.m3u8",
  },
  {
    id: "mux3",
    name: "Tears of Steel (Big Buck Bunny)",
    url: "https://test-streams.mux.dev/tears-of-steel/playlist.m3u8",
  },
];

const formatMillis = (value?: number | null) => {
  if (!value || value < 0) return "0:00";
  const totalSeconds = Math.floor(value / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function VideoPlayerScreen() {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(VIDEO_SOURCES[0]);
  const { top, bottom } = useSafeAreaInsets();

  const togglePlayPause = async () => {
    if (!videoRef.current || !status || !status.isLoaded) return;
    if (status.isPlaying) await videoRef.current.pauseAsync();
    else await videoRef.current.playAsync();
  };

  const toggleMute = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setIsMutedAsync(!isMuted);
    setIsMuted((prev) => !prev);
  };

  const skip = async (seconds: number) => {
    if (!videoRef.current || !status || !status.isLoaded) return;
    const startingPosition = status.positionMillis ?? 0;
    const rawTarget = startingPosition + seconds * 1000;
    const cappedTarget =
      status.durationMillis != null
        ? Math.min(Math.max(rawTarget, 0), status.durationMillis)
        : Math.max(rawTarget, 0);
    await videoRef.current.setPositionAsync(cappedTarget);
  };

  const enterFullscreen = async () => {
    if (videoRef.current) await videoRef.current.presentFullscreenPlayer();
  };

  const handleVideoChange = async (video: typeof VIDEO_SOURCES[0]) => {
    setSelectedVideo(video);
    if (videoRef.current) {
      const nextStatus = await videoRef.current.loadAsync(
        { uri: video.url },
        { shouldPlay: true, isMuted },
        true
      );
      if ("isLoaded" in nextStatus && nextStatus.isLoaded) {
        setStatus(nextStatus);
      }
    }
  };

  const playback = status && status.isLoaded ? status : null;

  return (
    <LinearGradient
      colors={["#0b1120", "#0f172a", "#1e293b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: top + 16,
          paddingBottom: bottom + 32,
          paddingHorizontal: 20,
        }}
      >
        <View className="mb-6 mt-10">
          <Text className="text-4xl font-semibold text-white tracking-tight">
            Premium HLS Player
          </Text>
          <Text className="text-base text-slate-300 mt-2">
            Switch between curated demo streams and control playback with a cinematic UI.
          </Text>
        </View>

        <View className="bg-slate-900/80 border border-slate-700 rounded-3xl p-5 shadow-2xl">
          <View className="flex-row flex-wrap gap-3 mb-4">
            {VIDEO_SOURCES.map((video) => {
              const isActive = selectedVideo.id === video.id;
              return (
                <TouchableOpacity
                  key={video.id}
                  onPress={() => handleVideoChange(video)}
                  className={`rounded-2xl px-4 py-2 border ${
                    isActive
                      ? "bg-blue-600 border-blue-400"
                      : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      isActive ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {video.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-black/70">
            <Video
              ref={videoRef}
              style={{ width: "100%", height: width * 0.56 }}
              source={{ uri: selectedVideo.url }}
              useNativeControls={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isMuted={isMuted}
              onPlaybackStatusUpdate={setStatus}
            />
          </View>

          <View className="mt-4 flex-row justify-between items-center">
            <Text className="text-slate-400 text-sm">
              {playback ? formatMillis(playback.positionMillis) : "0:00"}
            </Text>
            <Text className="text-slate-500 text-xs uppercase tracking-wide">
              {selectedVideo.name}
            </Text>
            <Text className="text-slate-400 text-sm">
              {playback && playback.durationMillis
                ? formatMillis(playback.durationMillis)
                : "—"}
            </Text>
          </View>

          <View className="mt-6 flex-col items-center space-y-4">
            <View className="flex-row w-full gap-3">
              <TouchableOpacity
                onPress={() => skip(-10)}
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-2xl py-3 px-4 items-center"
              >
                <Text className="text-white font-semibold text-lg">⏪ 10s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={togglePlayPause}
                className="flex-[1.2] bg-blue-600 border border-blue-400 rounded-2xl py-3 px-4 items-center shadow-lg shadow-blue-500/30"
              >
                <Text className="text-white font-semibold text-lg">
                  {playback && playback.isPlaying ? "⏸ Pause" : "▶ Play"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => skip(10)}
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-2xl py-3 px-4 items-center"
              >
                <Text className="text-white font-semibold text-lg">10s ⏩</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row w-full gap-3 mt-4">
              <TouchableOpacity
                onPress={toggleMute}
                className="flex-1 bg-amber-500 border border-amber-400 rounded-2xl py-3 px-4 items-center"
              >
                <Text className="text-white font-semibold text-lg">
                  {isMuted ? "🔈 Unmute" : "🔇 Mute"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={enterFullscreen}
                className="flex-1 bg-emerald-500 border border-emerald-400 rounded-2xl py-3 px-4 items-center"
              >
                <Text className="text-white font-semibold text-lg">⛶ Fullscreen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Link
          href="/webview"
          className="mt-8 text-blue-300 font-semibold text-center text-base"
        >
          ← Return to WebView experience
        </Link>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
