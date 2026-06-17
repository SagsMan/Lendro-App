import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const NETWORKS = [
  { id: "airtel", label: "Airtel\nAirtime", bg: "#E30000", text: "#FFFFFF", abbr: "A", route: "/services/airtime?network=airtel" },
  { id: "mtn", label: "MTN\nAirtime", bg: "#FFCC00", text: "#1A1A2E", abbr: "M", route: "/services/airtime?network=mtn" },
  { id: "glo", label: "GLO\nAirtime", bg: "#00B140", text: "#FFFFFF", abbr: "G", route: "/services/airtime?network=glo" },
  { id: "9mobile", label: "9mobile\nAirtime", bg: "#006633", text: "#FFFFFF", abbr: "9", route: "/services/airtime?network=9mobile" },
];

const SERVICES = [
  { id: "data", label: "Data", icon: "wifi", iconSet: "feather", color: "#3B82F6", bg: "#EFF6FF", route: "/services/data" },
  { id: "cable", label: "Cable TV", icon: "tv", iconSet: "feather", color: "#8B5CF6", bg: "#F5F3FF", route: "/services/cable" },
  { id: "electricity", label: "Electricity", icon: "zap", iconSet: "feather", color: "#F59E0B", bg: "#FFFBEB", route: "/services/electricity" },
  { id: "more", label: "More", icon: "more-horizontal", iconSet: "feather", color: "#6B7280", bg: "#F3F4F6", route: "/services/more" },
];

const LEADERBOARD = [
  { rank: 1, name: "You", pts: 240, isUser: true },
  { rank: 2, name: "Chukwu E.", pts: 210, isUser: false },
  { rank: 3, name: "Amaka O.", pts: 185, isUser: false },
];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const app = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const handleService = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const scoreData = [
    { label: "Participation Points", value: app.participationPoints, max: 100, display: `${app.participationPoints}`, sub: "100% relative to community peak" },
    { label: "Usage Points", value: app.usagePoints, max: app.usagePoints || 1, display: `${app.usagePoints}/∞`, sub: "" },
    { label: "Repayment Score (±)", value: app.repaymentScore, max: 100, display: `${app.repaymentScore}%`, sub: "" },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={["#2D1B8E", "#4A3AB5"]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.logoText}>LENDRO</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
              <Feather name="credit-card" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
              <View>
                <Feather name="bell" size={22} color="#FFFFFF" />
                <View style={styles.badge} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.fundingLabel}>Support Funding Limit</Text>
        <Text style={styles.fundingAmount}>{formatNaira(app.supportFundingLimit)}</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Outstanding</Text>
            <Text style={styles.statValue}>{formatNaira(app.outstanding)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Points Earned</Text>
            <Text style={styles.statValue}>{app.totalPointsEarned}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Wallet Balance</Text>
            <Text style={styles.statValue}>{formatNaira(app.walletBalance)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>oShare Balance</Text>
            <Text style={styles.statValue}>{formatNaira(app.oShareBalance)}</Text>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.depositBtn}
            onPress={() => router.push("/(tabs)/funding" as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.depositBtnText}>Deposit Fund</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.requestBtn}
            onPress={() => router.push("/(tabs)/funding" as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.requestBtnText}>Request Funding</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: botPad + 100 }}
      >
        {/* Partner Services */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Partner Services</Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
            Use partner services to earn usage points.
          </Text>
          <View style={styles.serviceGrid}>
            {NETWORKS.map((n) => (
              <TouchableOpacity
                key={n.id}
                style={styles.serviceItem}
                onPress={() => handleService(n.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.networkCircle, { backgroundColor: n.bg }]}>
                  <Text style={[styles.networkAbbr, { color: n.text }]}>{n.abbr}</Text>
                </View>
                <Text style={[styles.serviceLabel, { color: colors.mutedForeground }]}>{n.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.serviceGrid}>
            {SERVICES.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.serviceItem}
                onPress={() => handleService(s.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.serviceCircle, { backgroundColor: s.bg }]}>
                  <Feather name={s.icon as any} size={22} color={s.color} />
                </View>
                <Text style={[styles.serviceLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Score Breakdown */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeaderRow}>
            <Feather name="bar-chart-2" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginLeft: 8 }]}>Score Breakdown</Text>
          </View>
          {scoreData.map((item) => (
            <View key={item.label} style={styles.scoreRow}>
              <View style={styles.scoreLabelRow}>
                <Text style={[styles.scoreLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.scoreValue, { color: colors.mutedForeground }]}>{item.display}</Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.primary,
                      width: `${Math.min(100, item.max > 0 ? (item.value / item.max) * 100 : 0)}%`,
                    },
                  ]}
                />
              </View>
              {item.sub ? (
                <Text style={[styles.scoreSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Why Use Lendro */}
        <View style={styles.whyCard}>
          <LinearGradient colors={["#3D2DB5", "#2D1B8E"]} style={styles.whyGradient}>
            <View style={styles.whyHeaderRow}>
              <View style={[styles.whyIconCircle, { backgroundColor: "rgba(245,166,35,0.2)" }]}>
                <Ionicons name="star" size={20} color="#F5A623" />
              </View>
              <Text style={styles.whyTitle}>Why Use Lendro</Text>
            </View>
            <Text style={styles.whyIntro}>
              Lendro is a community support app built for the empowerment of community members to;
            </Text>
            {[
              "Buy Data at Cheaper price",
              "Get Repayable Support Funds (RSF)",
              "Earn Rewards through the oShare program",
              "Access Grants",
            ].map((item) => (
              <View key={item} style={styles.whyBulletRow}>
                <View style={styles.whyDot} />
                <Text style={styles.whyBullet}>{item}</Text>
              </View>
            ))}
            <Text style={styles.whyFooter}>
              Our programs are supported by partner organizations that contribute to community development
              when members patronize their services.{" "}
              <Text style={styles.whyLink}>Learn more</Text>
            </Text>
          </LinearGradient>
        </View>

        {/* Leaderboard */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="trophy-outline" size={20} color="#F5A623" />
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginLeft: 8 }]}>
              Top 20 Grant Leaderboard
            </Text>
          </View>
          <Text style={[styles.leaderSub, { color: colors.mutedForeground }]}>
            Members with the highest usage points qualify for the Annual Reward Grant.
          </Text>
          {LEADERBOARD.map((entry) => (
            <View
              key={entry.rank}
              style={[
                styles.leaderRow,
                entry.isUser && { backgroundColor: colors.purpleLight },
              ]}
            >
              <Text style={[styles.leaderRank, { color: colors.mutedForeground }]}>{entry.rank}</Text>
              <View style={[styles.leaderAvatar, { backgroundColor: entry.isUser ? colors.accent : colors.muted }]}>
                <Ionicons name="person" size={16} color={entry.isUser ? "#fff" : colors.mutedForeground} />
              </View>
              <Text style={[styles.leaderName, { color: colors.foreground }]}>{entry.name}</Text>
              <Text style={[styles.leaderPts, { color: colors.primary }]}>{entry.pts}pts</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  logoText: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#F5A623", letterSpacing: 2 },
  headerIcons: { flexDirection: "row", gap: 12 },
  iconBtn: { padding: 4 },
  badge: { position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },
  fundingLabel: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 4 },
  fundingAmount: { fontSize: 36, color: "#FFFFFF", fontFamily: "Inter_700Bold", marginBottom: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  statItem: { width: "50%", marginBottom: 10 },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular" },
  statValue: { fontSize: 16, color: "#FFFFFF", fontFamily: "Inter_600SemiBold", marginTop: 2 },
  ctaRow: { flexDirection: "row", gap: 12 },
  depositBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  depositBtnText: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  requestBtn: {
    flex: 1,
    backgroundColor: "#F5A623",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  requestBtnText: { color: "#1A1A2E", fontFamily: "Inter_600SemiBold", fontSize: 14 },
  scroll: { flex: 1 },
  section: { marginHorizontal: 0, paddingHorizontal: 16, paddingVertical: 20, marginBottom: 4 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 16, marginTop: -4 },
  serviceGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  serviceItem: { alignItems: "center", width: "23%" },
  networkCircle: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  networkAbbr: { fontSize: 22, fontFamily: "Inter_700Bold" },
  serviceCircle: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  serviceLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  scoreRow: { marginBottom: 14 },
  scoreLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  scoreLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  scoreValue: { fontSize: 13, fontFamily: "Inter_400Regular" },
  progressBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
  scoreSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4 },
  whyCard: { marginHorizontal: 16, marginVertical: 8, borderRadius: 16, overflow: "hidden" },
  whyGradient: { padding: 20 },
  whyHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  whyIconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", marginRight: 10 },
  whyTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  whyIntro: { fontSize: 13, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_400Regular", marginBottom: 10, lineHeight: 20 },
  whyBulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  whyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F5A623", marginTop: 6, marginRight: 10 },
  whyBullet: { fontSize: 13, color: "#FFFFFF", fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  whyFooter: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular", marginTop: 12, lineHeight: 18 },
  whyLink: { color: "#F5A623", fontFamily: "Inter_500Medium" },
  leaderSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 14, lineHeight: 18 },
  leaderRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, marginBottom: 6 },
  leaderRank: { width: 24, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  leaderAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 10 },
  leaderName: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  leaderPts: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
