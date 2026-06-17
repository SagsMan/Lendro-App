import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    gradient: ["#2D1B8E", "#4A3AB5"] as [string, string],
    icon: "people" as const,
    iconSet: "ionicons",
    title: "Welcome to Lendro",
    subtitle: "Community Support Made Easy",
    description:
      "Join thousands of community members accessing repayable support funds, earning rewards, and qualifying for annual grants — all in one app.",
    accent: "#F5A623",
  },
  {
    id: "2",
    gradient: ["#1A3A8E", "#2D6AB5"] as [string, string],
    icon: "flash" as const,
    iconSet: "ionicons",
    title: "Buy Utility Services",
    subtitle: "Save More on Every Purchase",
    description:
      "Buy Airtime, Mobile Data, Electricity, Cable TV and more at competitive rates. Earn usage points on every transaction that count toward grants.",
    accent: "#34D399",
  },
  {
    id: "3",
    gradient: ["#3D2D00", "#8B6000"] as [string, string],
    icon: "trophy" as const,
    iconSet: "ionicons",
    title: "Access Grants & Rewards",
    subtitle: "Your Community Supports You",
    description:
      "Top members on the leaderboard qualify for Annual Reward Grants. The more you participate and use services, the higher you rank.",
    accent: "#F5A623",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const app = useApp();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const handleViewChange = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setActiveIndex(viewableItems[0].index ?? 0);
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      app.completeOnboarding();
      router.replace("/auth/login" as any);
    }
  };

  const handleSkip = () => {
    app.completeOnboarding();
    router.replace("/auth/login" as any);
  };

  return (
    <View style={styles.root}>
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={handleViewChange}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={item.gradient}
            style={[styles.slide, { width: SCREEN_WIDTH }]}
          >
            <View style={[styles.slideContent, { paddingTop: insets.top + 40 }]}>
              <View style={[styles.iconCircle, { borderColor: item.accent + "40" }]}>
                <View style={[styles.iconInner, { backgroundColor: item.accent + "20" }]}>
                  <Ionicons name={item.icon as any} size={64} color={item.accent} />
                </View>
              </View>

              <Text style={[styles.slideTitle, { color: item.accent }]}>{item.title}</Text>
              <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
              <Text style={styles.slideDesc}>{item.description}</Text>

              <View style={styles.features}>
                {item.id === "1" && (
                  <>
                    <Feature icon="checkmark-circle" text="Repayable Support Funds" accent={item.accent} />
                    <Feature icon="checkmark-circle" text="oShare Reward Program" accent={item.accent} />
                    <Feature icon="checkmark-circle" text="Annual Grant Qualification" accent={item.accent} />
                  </>
                )}
                {item.id === "2" && (
                  <>
                    <Feature icon="checkmark-circle" text="MTN, Airtel, GLO, 9mobile" accent={item.accent} />
                    <Feature icon="checkmark-circle" text="Electricity & Cable TV" accent={item.accent} />
                    <Feature icon="checkmark-circle" text="Earn Points on Every Purchase" accent={item.accent} />
                  </>
                )}
                {item.id === "3" && (
                  <>
                    <Feature icon="checkmark-circle" text="Top 20 Leaderboard" accent={item.accent} />
                    <Feature icon="checkmark-circle" text="Annual Reward Grant" accent={item.accent} />
                    <Feature icon="checkmark-circle" text="Community Recognition" accent={item.accent} />
                  </>
                )}
              </View>
            </View>
          </LinearGradient>
        )}
      />

      {/* Bottom Controls */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24, backgroundColor: SLIDES[activeIndex].gradient[0] }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex
                  ? { backgroundColor: "#F5A623", width: 24 }
                  : { backgroundColor: "rgba(255,255,255,0.35)" },
              ]}
            />
          ))}
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.85}>
            <LinearGradient colors={["#F5A623", "#E8940F"]} style={styles.nextGradient}>
              <Text style={styles.nextText}>
                {activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
              </Text>
              <Ionicons
                name={activeIndex === SLIDES.length - 1 ? "rocket" : "arrow-forward"}
                size={18}
                color="#1A1A2E"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.logo}>LENDRO</Text>
      </View>
    </View>
  );
}

function Feature({ icon, text, accent }: { icon: any; text: string; accent: string }) {
  return (
    <View style={styles.featureRow}>
      <Ionicons name={icon} size={18} color={accent} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#2D1B8E" },
  slide: { flex: 1 },
  slideContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 20,
    alignItems: "center",
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  iconInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  slideTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  slideSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginBottom: 16,
  },
  slideDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  features: { alignSelf: "stretch" },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  featureText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
  },
  bottom: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 24 },
  dot: { height: 8, borderRadius: 4 },
  btnRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  skipBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
  },
  skipText: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  nextBtn: { flex: 2, borderRadius: 30, overflow: "hidden" },
  nextGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  nextText: { color: "#1A1A2E", fontFamily: "Inter_700Bold", fontSize: 15 },
  logo: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "rgba(255,255,255,0.3)",
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
  },
});
