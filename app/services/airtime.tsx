import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const NETWORKS = [
  { id: "airtel", label: "Airtel", color: "#E30000", logo: require("@/assets/images/logos/airtel.png") },
  { id: "mtn", label: "MTN", color: "#FFCC00", logo: require("@/assets/images/logos/mtn.png") },
  { id: "glo", label: "GLO", color: "#00B140", logo: require("@/assets/images/logos/glo.png") },
  { id: "9mobile", label: "9mobile", color: "#006633", logo: require("@/assets/images/logos/9mobile.png") },
];

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000, 5000];

export default function AirtimeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ network?: string }>();
  const app = useApp();

  const [selectedNetwork, setSelectedNetwork] = useState(params.network ?? "mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const net = NETWORKS.find((n) => n.id === selectedNetwork) ?? NETWORKS[1];

  const handlePurchase = () => {
    if (!phone || phone.length < 11) {
      Alert.alert("Invalid Phone", "Enter a valid 11-digit phone number.");
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val < 50) {
      Alert.alert("Invalid Amount", "Minimum airtime purchase is ₦50.");
      return;
    }
    if (!app.debitWallet(val)) {
      Alert.alert("Insufficient Balance", "Your wallet balance is too low. Please deposit funds.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      app.addTransaction({
        type: "airtime",
        description: `${net.label} Airtime — ${phone}`,
        amount: val,
        status: "success",
        phone,
        network: net.label,
      });
      setLoading(false);
      Alert.alert("Success!", `₦${val} airtime sent to ${phone} on ${net.label}.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    }, 1800);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Buy Airtime</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Cashback Banner */}
        <View style={[styles.banner, { backgroundColor: colors.purpleLight }]}>
          <Text style={[styles.bannerText, { color: colors.primary }]}>
            🎉 Earn 1% usage points on every airtime purchase
          </Text>
        </View>

        {/* Network Selection */}
        <Text style={[styles.label, { color: colors.foreground }]}>Select Network</Text>
        <View style={styles.networksRow}>
          {NETWORKS.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[
                styles.networkBtn,
                { borderColor: selectedNetwork === n.id ? n.color : colors.border },
                selectedNetwork === n.id && { borderWidth: 2, backgroundColor: n.color + "12" },
              ]}
              onPress={() => { setSelectedNetwork(n.id); Haptics.selectionAsync(); }}
            >
              <View style={styles.netLogoCircle}>
                <Image source={n.logo} style={styles.netLogoImg} resizeMode="cover" />
              </View>
              <Text style={[styles.netLabel, { color: colors.foreground }]}>{n.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Phone Input */}
        <Text style={[styles.label, { color: colors.foreground }]}>Phone Number</Text>
        <View style={[styles.phoneWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <View style={styles.netTagLogo}>
            <Image source={net.logo} style={styles.netTagImg} resizeMode="cover" />
          </View>
          <TextInput
            style={[styles.phoneInput, { color: colors.foreground }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone number"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="phone-pad"
            maxLength={11}
          />
          <TouchableOpacity onPress={() => {}}>
            <Feather name="user" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <Text style={[styles.label, { color: colors.foreground }]}>Amount</Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.nairaSign, { color: colors.mutedForeground }]}>₦</Text>
          <TextInput
            style={[styles.amtInput, { color: colors.foreground }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
          />
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.quickChip, { borderColor: amount === q.toString() ? colors.primary : colors.border, backgroundColor: amount === q.toString() ? colors.purpleLight : colors.card }]}
              onPress={() => { setAmount(q.toString()); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.quickChipText, { color: amount === q.toString() ? colors.primary : colors.foreground }]}>
                ₦{q}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Balance */}
        <View style={[styles.balRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="credit-card" size={16} color={colors.mutedForeground} />
          <Text style={[styles.balText, { color: colors.mutedForeground }]}>
            Wallet Balance:{" "}
            <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold" }}>
              ₦{app.walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.buyBtn, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buyBtnText}>{loading ? "Processing..." : "Purchase Airtime"}</Text>
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
  banner: { padding: 12, borderRadius: 10, marginBottom: 20 },
  bannerText: { fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "center" },
  label: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 10 },
  networksRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  networkBtn: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 10, alignItems: "center" },
  netLogoCircle: { width: 44, height: 44, borderRadius: 22, overflow: "hidden", marginBottom: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  netLogoImg: { width: "100%", height: "100%" },
  netLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  phoneWrap: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 20, gap: 12 },
  netTagLogo: { width: 34, height: 34, borderRadius: 17, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB" },
  netTagImg: { width: "100%", height: "100%" },
  phoneInput: { flex: 1, fontSize: 16, fontFamily: "Inter_500Medium" },
  inputWrap: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16, gap: 8 },
  nairaSign: { fontSize: 20, fontFamily: "Inter_600SemiBold" },
  amtInput: { flex: 1, fontSize: 24, fontFamily: "Inter_700Bold" },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  quickChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  quickChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  balRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 24 },
  balText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  buyBtn: { borderRadius: 28, paddingVertical: 16, alignItems: "center" },
  buyBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
});
