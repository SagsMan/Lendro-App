import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FULL_LEADERBOARD = [
  { rank: 1, name: "You", pts: 240, isUser: true },
  { rank: 2, name: "Chukwu E.", pts: 210, isUser: false },
  { rank: 3, name: "Amaka O.", pts: 185, isUser: false },
  { rank: 4, name: "Bisi A.", pts: 172, isUser: false },
  { rank: 5, name: "Tunde K.", pts: 165, isUser: false },
  { rank: 6, name: "Ngozi R.", pts: 158, isUser: false },
  { rank: 7, name: "Segun M.", pts: 144, isUser: false },
  { rank: 8, name: "Fatima L.", pts: 132, isUser: false },
  { rank: 9, name: "Emeka S.", pts: 121, isUser: false },
  { rank: 10, name: "Ada N.", pts: 110, isUser: false },
];

const GRANTS = [
  { title: "Annual Reward Grant", amount: "₦100,000", desc: "Top 20 members by usage points qualify annually.", status: "Active", color: "#F5A623" },
  { title: "oShare Dividend", amount: "Variable", desc: "Earn dividends based on your oShare token holdings.", status: "Active", color: "#10B981" },
  { title: "Community Grant", amount: "₦25,000", desc: "Members with 500+ points and 0 outstanding balance.", status: "Active", color: "#3B82F6" },
];

export default function GrantsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const app = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#2D1B8E", "#4A3AB5"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Text style={styles.logoText}>LENDRO</Text>
        <Text style={styles.headerSub}>Grants & Rewards</Text>
        <View style={styles.pointsRow}>
          <View style={styles.pointCard}>
            <Text style={styles.pointLabel}>Your Points</Text>
            <Text style={styles.pointVal}>{app.totalPointsEarned}</Text>
          </View>
          <View style={styles.pointCard}>
            <Text style={styles.pointLabel}>Ranking</Text>
            <Text style={styles.pointVal}>#1</Text>
          </View>
          <View style={styles.pointCard}>
            <Text style={styles.pointLabel}>oShare</Text>
            <Text style={styles.pointVal}>₦{app.oShareBalance.toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Available Grants */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Available Grants</Text>
        {GRANTS.map((g) => (
          <View key={g.title} style={[styles.grantCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.grantBadge, { backgroundColor: g.color + "20" }]}>
              <Text style={[styles.grantBadgeText, { color: g.color }]}>{g.status}</Text>
            </View>
            <Text style={[styles.grantTitle, { color: colors.foreground }]}>{g.title}</Text>
            <Text style={[styles.grantAmt, { color: g.color }]}>{g.amount}</Text>
            <Text style={[styles.grantDesc, { color: colors.mutedForeground }]}>{g.desc}</Text>
          </View>
        ))}

        {/* Leaderboard */}
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>
          Top 20 Grant Leaderboard
        </Text>
        <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
          Members with the highest usage points qualify for the Annual Reward Grant.
        </Text>
        {FULL_LEADERBOARD.map((entry) => (
          <View
            key={entry.rank}
            style={[
              styles.leaderRow,
              { borderColor: colors.border, backgroundColor: entry.isUser ? colors.purpleLight : colors.card },
            ]}
          >
            <View style={[styles.rankBadge, { backgroundColor: entry.rank <= 3 ? "#F5A623" : colors.muted }]}>
              <Text style={[styles.rankText, { color: entry.rank <= 3 ? "#1A1A2E" : colors.mutedForeground }]}>
                {entry.rank}
              </Text>
            </View>
            {entry.rank <= 3 && (
              <Ionicons name="trophy" size={16} color="#F5A623" style={{ marginRight: 4 }} />
            )}
            <View style={[styles.avatar, { backgroundColor: entry.isUser ? colors.accent : colors.muted }]}>
              <Ionicons name="person" size={14} color={entry.isUser ? "#fff" : colors.mutedForeground} />
            </View>
            <Text style={[styles.leaderName, { color: colors.foreground }]}>{entry.name}</Text>
            <Text style={[styles.leaderPts, { color: colors.primary }]}>{entry.pts}pts</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  logoText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#F5A623", letterSpacing: 2, marginBottom: 2 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 16 },
  pointsRow: { flexDirection: "row", gap: 12 },
  pointCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 12 },
  pointLabel: { fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular" },
  pointVal: { fontSize: 18, color: "#FFFFFF", fontFamily: "Inter_700Bold", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  sectionSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 16, lineHeight: 18 },
  grantCard: { borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, position: "relative" },
  grantBadge: { alignSelf: "flex-start", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  grantBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  grantTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  grantAmt: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 6 },
  grantDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  leaderRow: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  rankBadge: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 8 },
  rankText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 10 },
  leaderName: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  leaderPts: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
