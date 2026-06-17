import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

const PROVIDERS = [
  { id: "dstv", label: "DSTV", color: "#003087", logo: require("@/assets/images/logos/dstv.png") },
  { id: "gotv", label: "GOtv", color: "#F7941D", logo: require("@/assets/images/logos/gotv.png") },
  { id: "startimes", label: "StarTimes", color: "#C8102E", logo: require("@/assets/images/logos/startimes.png") },
  { id: "showmax", label: "Showmax", color: "#E50000", logo: require("@/assets/images/logos/showmax.png") },
];

const PLANS: Record<string, Array<{ id: string; name: string; price: number; duration: string; channels: string }>> = {
  dstv: [
    { id: "d1", name: "DStv Padi", price: 2950, duration: "1 Month", channels: "~97 channels" },
    { id: "d2", name: "DStv Yanga", price: 3960, duration: "1 Month", channels: "~115 channels" },
    { id: "d3", name: "DStv Confam", price: 6200, duration: "1 Month", channels: "~143 channels" },
    { id: "d4", name: "DStv Compact", price: 15700, duration: "1 Month", channels: "~155 channels" },
    { id: "d5", name: "DStv Premium", price: 29500, duration: "1 Month", channels: "~200+ channels" },
  ],
  gotv: [
    { id: "g1", name: "GOtv Supa+", price: 6400, duration: "1 Month", channels: "~230 channels" },
    { id: "g2", name: "GOtv Supa", price: 4850, duration: "1 Month", channels: "~215 channels" },
    { id: "g3", name: "GOtv Max", price: 4150, duration: "1 Month", channels: "~80 channels" },
    { id: "g4", name: "GOtv Jolli", price: 2800, duration: "1 Month", channels: "~55 channels" },
    { id: "g5", name: "GOtv Jinja", price: 1900, duration: "1 Month", channels: "~45 channels" },
  ],
  startimes: [
    { id: "s1", name: "StarTimes Nova", price: 900, duration: "1 Month", channels: "~35 channels" },
    { id: "s2", name: "StarTimes Basic", price: 1700, duration: "1 Month", channels: "~60 channels" },
    { id: "s3", name: "StarTimes Smart", price: 2000, duration: "1 Month", channels: "~90 channels" },
    { id: "s4", name: "StarTimes Classic", price: 2500, duration: "1 Month", channels: "~130 channels" },
    { id: "s5", name: "StarTimes Super", price: 3500, duration: "1 Month", channels: "~180 channels" },
  ],
  showmax: [
    { id: "x1", name: "Showmax Mobile", price: 1200, duration: "1 Month", channels: "Streaming Only" },
    { id: "x2", name: "Showmax Standard", price: 2900, duration: "1 Month", channels: "HD Streaming" },
    { id: "x3", name: "Showmax Sport", price: 5800, duration: "1 Month", channels: "Sports + Live" },
  ],
};

export default function CableScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const app = useApp();

  const [provider, setProvider] = useState("dstv");
  const [smartCard, setSmartCard] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const prov = PROVIDERS.find((p) => p.id === provider)!;
  const plans = PLANS[provider] ?? [];
  const selectedPlan = plans.find((p) => p.id === selected);

  const handlePay = () => {
    if (!smartCard || smartCard.length < 10) { Alert.alert("Invalid Card", "Enter a valid smartcard/IUC number."); return; }
    if (!selectedPlan) { Alert.alert("No Plan", "Please select a subscription plan."); return; }
    if (!app.debitWallet(selectedPlan.price)) { Alert.alert("Insufficient Balance", "Please deposit funds first."); return; }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      app.addTransaction({ type: "cable", description: `${prov.label} ${selectedPlan.name}`, amount: selectedPlan.price, status: "success" });
      setLoading(false);
      Alert.alert("Success!", `${prov.label} ${selectedPlan.name} activated on card ${smartCard}.`, [
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Cable TV</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={[styles.banner, { backgroundColor: "#F5F3FF" }]}>
          <Feather name="tv" size={16} color="#8B5CF6" />
          <Text style={[styles.bannerText, { color: "#6D28D9" }]}>Instant subscription renewal</Text>
        </View>

        {/* Provider */}
        <Text style={[styles.label, { color: colors.foreground }]}>Select Provider</Text>
        <View style={styles.providerRow}>
          {PROVIDERS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.provBtn, { borderColor: provider === p.id ? p.color : colors.border }, provider === p.id && { borderWidth: 2, backgroundColor: p.color + "12" }]}
              onPress={() => { setProvider(p.id); setSelected(null); Haptics.selectionAsync(); }}
            >
              <View style={styles.provLogoCircle}>
                <Image source={p.logo} style={styles.provLogoImg} resizeMode="cover" />
              </View>
              <Text style={[styles.provLabel, { color: colors.foreground }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Smart Card */}
        <Text style={[styles.label, { color: colors.foreground }]}>Smartcard / IUC Number</Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Feather name="credit-card" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={smartCard}
            onChangeText={setSmartCard}
            placeholder="Enter smartcard number"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>

        {/* Plans */}
        <Text style={[styles.label, { color: colors.foreground }]}>Select Plan</Text>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planRow, { borderColor: selected === plan.id ? colors.primary : colors.border, backgroundColor: selected === plan.id ? colors.purpleLight : colors.card }]}
            onPress={() => { setSelected(plan.id); Haptics.selectionAsync(); }}
          >
            <View style={styles.planInfo}>
              <Text style={[styles.planName, { color: colors.foreground }]}>{plan.name}</Text>
              <Text style={[styles.planChannels, { color: colors.mutedForeground }]}>{plan.channels} • {plan.duration}</Text>
            </View>
            <View style={styles.planRight}>
              <Text style={[styles.planPrice, { color: colors.primary }]}>₦{plan.price.toLocaleString()}</Text>
              {selected === plan.id && (
                <Feather name="check-circle" size={20} color={colors.primary} style={{ marginTop: 4 }} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={[styles.balRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="credit-card" size={16} color={colors.mutedForeground} />
          <Text style={[styles.balText, { color: colors.mutedForeground }]}>
            Balance: <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold" }}>₦{app.walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.buyBtn, { backgroundColor: selectedPlan ? colors.accent : colors.muted, opacity: loading ? 0.7 : 1 }]}
          onPress={handlePay}
          disabled={loading || !selectedPlan}
        >
          <Text style={[styles.buyBtnText, { color: selectedPlan ? "#1A1A2E" : colors.mutedForeground }]}>
            {loading ? "Processing..." : selectedPlan ? `Subscribe — ₦${selectedPlan.price.toLocaleString()}` : "Select a Plan"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  banner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, marginBottom: 20 },
  bannerText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  label: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 10 },
  providerRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  provBtn: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 10, alignItems: "center" },
  provLogoCircle: { width: 44, height: 44, borderRadius: 22, overflow: "hidden", marginBottom: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  provLogoImg: { width: "100%", height: "100%" },
  provLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20 },
  input: { flex: 1, fontSize: 16, fontFamily: "Inter_500Medium" },
  planRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, padding: 14, marginBottom: 10 },
  planInfo: { flex: 1 },
  planName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  planChannels: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  planRight: { alignItems: "flex-end" },
  planPrice: { fontSize: 16, fontFamily: "Inter_700Bold" },
  balRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 24, marginTop: 8 },
  balText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  buyBtn: { borderRadius: 28, paddingVertical: 16, alignItems: "center" },
  buyBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
