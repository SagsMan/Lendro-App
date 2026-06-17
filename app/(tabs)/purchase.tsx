import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const ALL_SERVICES = [
  { id: "airtime", label: "Airtime", icon: "phone", color: "#E30000", bg: "#FFF0F0", route: "/services/airtime", desc: "Buy airtime for any network" },
  { id: "data", label: "Data", icon: "wifi", color: "#3B82F6", bg: "#EFF6FF", route: "/services/data", desc: "Buy data bundles" },
  { id: "cable", label: "Cable TV", icon: "tv", color: "#8B5CF6", bg: "#F5F3FF", route: "/services/cable", desc: "Pay for DSTV, GOtv, Startimes" },
  { id: "electricity", label: "Electricity", icon: "zap", color: "#F59E0B", bg: "#FFFBEB", route: "/services/electricity", desc: "Buy electricity units" },
  { id: "exam-pin", label: "Exam Pin", icon: "file-text", color: "#10B981", bg: "#ECFDF5", route: "/services/more", desc: "JAMB, WAEC, NECO pins" },
  { id: "internet", label: "Internet", icon: "globe", color: "#06B6D4", bg: "#ECFEFF", route: "/services/data", desc: "Broadband & fiber plans" },
  { id: "voucher", label: "Voucher", icon: "tag", color: "#EC4899", bg: "#FDF2F8", route: "/services/more", desc: "Gift and shopping vouchers" },
  { id: "more", label: "More", icon: "grid", color: "#6B7280", bg: "#F3F4F6", route: "/services/more", desc: "All other services" },
];

export default function PurchaseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#2D1B8E", "#4A3AB5"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Text style={styles.logoText}>LENDRO</Text>
        <Text style={styles.headerSub}>Services & Purchase</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>All Services</Text>
        <View style={styles.grid}>
          {ALL_SERVICES.map((svc) => (
            <TouchableOpacity
              key={svc.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(svc.route as any);
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.iconCircle, { backgroundColor: svc.bg }]}>
                <Feather name={svc.icon as any} size={24} color={svc.color} />
              </View>
              <Text style={[styles.cardLabel, { color: colors.foreground }]}>{svc.label}</Text>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{svc.desc}</Text>
              <View style={styles.cardArrow}>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Points info */}
        <View style={[styles.pointsBanner, { backgroundColor: colors.purpleLight }]}>
          <Ionicons name="star" size={18} color="#F5A623" />
          <Text style={[styles.pointsText, { color: colors.primary }]}>
            Earn usage points on every service purchase!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  logoText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#F5A623", letterSpacing: 2, marginBottom: 2 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "47.5%", borderRadius: 14, padding: 16, borderWidth: 1, position: "relative" },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  cardLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  cardDesc: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
  cardArrow: { position: "absolute", top: 14, right: 14 },
  pointsBanner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 12, marginTop: 8 },
  pointsText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 18 },
});
