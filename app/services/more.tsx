import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
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
  { id: "airtime", label: "Airtime", icon: "phone", color: "#E30000", bg: "#FFF0F0", desc: "Any network airtime", route: "/services/airtime" },
  { id: "data", label: "Mobile Data", icon: "wifi", color: "#3B82F6", bg: "#EFF6FF", desc: "Data bundles", route: "/services/data" },
  { id: "cable", label: "Cable TV", icon: "tv", color: "#8B5CF6", bg: "#F5F3FF", desc: "DSTV, GOtv, StarTimes", route: "/services/cable" },
  { id: "electricity", label: "Electricity", icon: "zap", color: "#F59E0B", bg: "#FFFBEB", desc: "Prepaid/Postpaid", route: "/services/electricity" },
  { id: "exam", label: "Exam Pin", icon: "file-text", color: "#10B981", bg: "#ECFDF5", desc: "JAMB, WAEC, NECO" },
  { id: "internet", label: "Internet", icon: "globe", color: "#06B6D4", bg: "#ECFEFF", desc: "Broadband & fiber" },
  { id: "insurance", label: "Insurance", icon: "shield", color: "#6366F1", bg: "#EEF2FF", desc: "Health & auto" },
  { id: "betting", label: "Betting", icon: "trending-up", color: "#F97316", bg: "#FFF7ED", desc: "Bet9ja, Sportybet" },
  { id: "water", label: "Water Bill", icon: "droplet", color: "#0EA5E9", bg: "#F0F9FF", desc: "Water board payment" },
  { id: "school", label: "School Fees", icon: "book", color: "#7C3AED", bg: "#F5F3FF", desc: "Tertiary institutions" },
  { id: "transport", label: "Transport", icon: "truck", color: "#64748B", bg: "#F8FAFC", desc: "Bus & train tickets" },
  { id: "voucher", label: "Voucher", icon: "tag", color: "#EC4899", bg: "#FDF2F8", desc: "Gift & shopping" },
];

export default function MoreServicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>All Services</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={styles.grid}>
          {ALL_SERVICES.map((svc) => (
            <TouchableOpacity
              key={svc.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (svc.route) {
                  router.push(svc.route as any);
                } else {
                  Alert.alert(svc.label, "This service is coming soon!");
                }
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrap, { backgroundColor: svc.bg }]}>
                <Feather name={svc.icon as any} size={22} color={svc.color} />
              </View>
              <Text style={[styles.cardLabel, { color: colors.foreground }]}>{svc.label}</Text>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{svc.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "47.5%", borderRadius: 14, padding: 16, borderWidth: 1 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  cardLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  cardDesc: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
});
