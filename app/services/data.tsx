import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const NETWORKS = [
  { id: "mtn", label: "MTN", color: "#FFCC00", logo: require("@/assets/images/logos/mtn.png") },
  { id: "airtel", label: "Airtel", color: "#E30000", logo: require("@/assets/images/logos/airtel.png") },
  { id: "glo", label: "GLO", color: "#00B140", logo: require("@/assets/images/logos/glo.png") },
  { id: "9mobile", label: "9mobile", color: "#006633", logo: require("@/assets/images/logos/9mobile.png") },
];

type PlanTab = "hot" | "daily" | "weekly" | "monthly";

const DATA_PLANS: Record<PlanTab, Array<{ id: string; size: string; price: number; validity: string; desc: string; cashback: number }>> = {
  hot: [
    { id: "1", size: "110MB", price: 100, validity: "1 Day", desc: "110MB Daily Plan (1day)", cashback: 2 },
    { id: "2", size: "230MB", price: 200, validity: "1 Day", desc: "230MB Daily Plan (1Day)", cashback: 4 },
    { id: "3", size: "500MB", price: 350, validity: "1 Day", desc: "500MB Daily Plan (1Day)", cashback: 7 },
    { id: "4", size: "500MB", price: 500, validity: "7 Days", desc: "500MB Weekly Plan (7DAYS)", cashback: 10 },
    { id: "5", size: "1GB", price: 700, validity: "1 Day", desc: "1GB Daily Plan (1day)", cashback: 10 },
    { id: "6", size: "1GB", price: 1000, validity: "30 Days", desc: "1GB Monthly Plan (30Days)", cashback: 16 },
  ],
  daily: [
    { id: "d1", size: "100MB", price: 100, validity: "1 Day", desc: "100MB for 1 day", cashback: 2 },
    { id: "d2", size: "200MB", price: 200, validity: "1 Day", desc: "200MB for 1 day", cashback: 4 },
    { id: "d3", size: "500MB", price: 300, validity: "1 Day", desc: "500MB for 1 day", cashback: 6 },
    { id: "d4", size: "1GB", price: 500, validity: "1 Day", desc: "1GB for 1 day", cashback: 10 },
    { id: "d5", size: "2GB", price: 800, validity: "1 Day", desc: "2GB for 1 day", cashback: 16 },
  ],
  weekly: [
    { id: "w1", size: "500MB", price: 500, validity: "7 Days", desc: "500MB for 7 days", cashback: 10 },
    { id: "w2", size: "1GB", price: 1000, validity: "7 Days", desc: "1GB for 7 days", cashback: 20 },
    { id: "w3", size: "2GB", price: 1500, validity: "7 Days", desc: "2GB for 7 days", cashback: 30 },
    { id: "w4", size: "3.5GB", price: 2000, validity: "7 Days", desc: "3.5GB for 7 days", cashback: 40 },
    { id: "w5", size: "5GB", price: 2500, validity: "14 Days", desc: "5GB for 14 days", cashback: 50 },
  ],
  monthly: [
    { id: "m1", size: "1GB", price: 1000, validity: "30 Days", desc: "1GB for 30 days", cashback: 20 },
    { id: "m2", size: "2GB", price: 1500, validity: "30 Days", desc: "2GB for 30 days", cashback: 30 },
    { id: "m3", size: "5GB", price: 2000, validity: "30 Days", desc: "5GB for 30 days", cashback: 40 },
    { id: "m4", size: "10GB", price: 3000, validity: "30 Days", desc: "10GB for 30 days", cashback: 60 },
    { id: "m5", size: "20GB", price: 5000, validity: "30 Days", desc: "20GB for 30 days", cashback: 100 },
    { id: "m6", size: "50GB", price: 10000, validity: "30 Days", desc: "50GB for 30 days", cashback: 200 },
  ],
};

export default function DataScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const app = useApp();

  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState("");
  const [planTab, setPlanTab] = useState<PlanTab>("hot");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const net = NETWORKS.find((n) => n.id === network) ?? NETWORKS[0];
  const plans = DATA_PLANS[planTab];
  const selectedPlan = plans.find((p) => p.id === selected);

  const handlePurchase = () => {
    if (!phone || phone.length < 11) { Alert.alert("Invalid Phone", "Enter a valid 11-digit number."); return; }
    if (!selectedPlan) { Alert.alert("No Plan", "Please select a data plan."); return; }
    if (!app.debitWallet(selectedPlan.price)) {
      Alert.alert("Insufficient Balance", "Wallet balance is too low. Please deposit funds.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      app.addTransaction({
        type: "data",
        description: `${net.label} ${selectedPlan.size} Data — ${phone}`,
        amount: selectedPlan.price,
        status: "success",
        phone,
        network: net.label,
      });
      setLoading(false);
      setSelected(null);
      Alert.alert("Success!", `${selectedPlan.size} data activated on ${phone}.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    }, 2000);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Buy Data</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => {}}>
          <Feather name="clock" size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ padding: 16 }}>
          {/* Cashback Banner */}
          <View style={[styles.banner, { backgroundColor: "#EDE9FF" }]}>
            <Text style={[styles.bannerText, { color: colors.primary }]}>
              Enjoy up to 2% cashback on all data purchases
            </Text>
          </View>

          {/* Phone Input */}
          <View style={[styles.phoneRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={[styles.netSelector, { borderRightColor: colors.border }]}
              onPress={() => {}}
            >
              <View style={styles.netCircle}>
                <Image source={net.logo} style={styles.netCircleImg} resizeMode="cover" />
              </View>
              <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
            <TextInput
              style={[styles.phoneInput, { color: colors.foreground }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              maxLength={11}
            />
            <TouchableOpacity>
              <Feather name="user" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.phoneCount, { color: colors.mutedForeground }]}>{phone.length}/11</Text>

          {/* Beneficiaries */}
          <TouchableOpacity style={[styles.benefRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Feather name="users" size={16} color={colors.mutedForeground} />
            <Text style={[styles.benefText, { color: colors.mutedForeground }]}>Buy for recent beneficiaries</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>

          {/* Network selector */}
          <Text style={[styles.label, { color: colors.foreground }]}>Select Network</Text>
          <View style={styles.netRow}>
            {NETWORKS.map((n) => (
              <TouchableOpacity
                key={n.id}
                style={[styles.netBtn, { borderColor: network === n.id ? n.color : colors.border }, network === n.id && { borderWidth: 2, backgroundColor: n.color + "12" }]}
                onPress={() => { setNetwork(n.id); setSelected(null); Haptics.selectionAsync(); }}
              >
                <View style={styles.netBtnCircle}>
                  <Image source={n.logo} style={styles.netBtnImg} resizeMode="cover" />
                </View>
                <Text style={[styles.netBtnLabel, { color: colors.foreground }]}>{n.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Plan Tabs */}
        <View style={[styles.planTabRow, { borderBottomColor: colors.border }]}>
          {(["hot", "daily", "weekly", "monthly"] as PlanTab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.planTab, planTab === t && { borderBottomWidth: 2, borderBottomColor: colors.primary }]}
              onPress={() => { setPlanTab(t); setSelected(null); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.planTabText, { color: planTab === t ? colors.primary : colors.mutedForeground }]}>
                {t === "hot" ? "Hot Deals" : t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plans grid */}
        <View style={styles.plansGrid}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                { borderColor: selected === plan.id ? colors.primary : colors.border, backgroundColor: colors.card },
                selected === plan.id && { borderWidth: 2, backgroundColor: colors.purpleLight },
              ]}
              onPress={() => { setSelected(plan.id); Haptics.selectionAsync(); }}
            >
              <View style={[styles.cashbackTag, { backgroundColor: "#EDE9FF" }]}>
                <Text style={[styles.cashbackText, { color: colors.primary }]}>₦{plan.cashback} cashback</Text>
              </View>
              <Text style={[styles.planSize, { color: colors.foreground }]}>{plan.size}</Text>
              <Text style={[styles.planPrice, { color: colors.foreground }]}>₦{plan.price.toLocaleString()}</Text>
              <Text style={[styles.planValidity, { color: colors.mutedForeground }]}>{plan.validity} validity</Text>
              <Text style={[styles.planDesc, { color: colors.mutedForeground }]}>{plan.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={[styles.balRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="credit-card" size={16} color={colors.mutedForeground} />
            <Text style={[styles.balText, { color: colors.mutedForeground }]}>
              Balance:{" "}
              <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold" }}>
                ₦{app.walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.buyBtn, { backgroundColor: selectedPlan ? colors.accent : colors.muted, opacity: loading ? 0.7 : 1 }]}
            onPress={handlePurchase}
            disabled={loading || !selectedPlan}
          >
            <Text style={[styles.buyBtnText, { color: selectedPlan ? "#1A1A2E" : colors.mutedForeground }]}>
              {loading ? "Processing..." : selectedPlan ? `Buy ${selectedPlan.size} — ₦${selectedPlan.price.toLocaleString()}` : "Select a Data Plan"}
            </Text>
          </TouchableOpacity>
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
  banner: { padding: 12, borderRadius: 10, marginBottom: 16 },
  bannerText: { fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "center" },
  phoneRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, marginBottom: 4, overflow: "hidden" },
  netSelector: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 14, gap: 8, borderRightWidth: 1 },
  netCircle: { width: 32, height: 32, borderRadius: 16, overflow: "hidden" },
  netCircleImg: { width: "100%", height: "100%" },
  phoneInput: { flex: 1, fontSize: 16, fontFamily: "Inter_500Medium", paddingHorizontal: 12, paddingVertical: 14 },
  phoneCount: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right", marginBottom: 16 },
  benefRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 20 },
  benefText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  label: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 10 },
  netRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  netBtn: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 8, alignItems: "center" },
  netBtnCircle: { width: 36, height: 36, borderRadius: 18, overflow: "hidden", marginBottom: 4 },
  netBtnImg: { width: "100%", height: "100%" },
  netBtnLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  planTabRow: { flexDirection: "row", borderBottomWidth: 1, marginBottom: 0 },
  planTab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  planTabText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  plansGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, paddingTop: 12, gap: 10 },
  planCard: { width: "47%", borderWidth: 1, borderRadius: 14, padding: 14, position: "relative", marginLeft: 2 },
  cashbackTag: { alignSelf: "flex-start", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  cashbackText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  planSize: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 2 },
  planPrice: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 4 },
  planValidity: { fontSize: 12, fontFamily: "Inter_400Regular" },
  planDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4, lineHeight: 16 },
  balRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 16 },
  balText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  buyBtn: { borderRadius: 28, paddingVertical: 16, alignItems: "center" },
  buyBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
