import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

const DISCOS = [
  { id: "ekedc", label: "Eko Electric (EKEDC)", region: "Lagos South" },
  { id: "ikedc", label: "Ikeja Electric (IKEDC)", region: "Lagos North" },
  { id: "ibedc", label: "Ibadan DISCO (IBEDC)", region: "Oyo, Osun, Ogun" },
  { id: "eedc", label: "Enugu DISCO (EEDC)", region: "Southeast" },
  { id: "phed", label: "Port Harcourt DISCO (PHED)", region: "South-South" },
  { id: "aedc", label: "Abuja DISCO (AEDC)", region: "FCT, Niger, Nassarawa" },
  { id: "kedco", label: "Kano DISCO (KEDCO)", region: "Northwest" },
  { id: "bedc", label: "Benin DISCO (BEDC)", region: "Edo, Delta, Ondo" },
];

const METER_TYPES = ["Prepaid", "Postpaid"];
const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

export default function ElectricityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const app = useApp();

  const [disco, setDisco] = useState(DISCOS[0]);
  const [meterType, setMeterType] = useState("Prepaid");
  const [meterNo, setMeterNo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDiscos, setShowDiscos] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handlePurchase = () => {
    if (!meterNo || meterNo.length < 11) { Alert.alert("Invalid Meter", "Enter a valid meter number."); return; }
    const val = parseFloat(amount);
    if (isNaN(val) || val < 500) { Alert.alert("Minimum ₦500", "Minimum electricity purchase is ₦500."); return; }
    if (!app.debitWallet(val)) { Alert.alert("Insufficient Balance", "Please deposit funds first."); return; }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      app.addTransaction({ type: "electricity", description: `Electricity — Meter ${meterNo}`, amount: val, status: "success" });
      setLoading(false);
      Alert.alert("Success!", `₦${val} electricity token sent to meter ${meterNo}.`, [
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Buy Electricity</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={[styles.banner, { backgroundColor: "#FFFBEB" }]}>
          <Feather name="zap" size={16} color="#F59E0B" />
          <Text style={[styles.bannerText, { color: "#92400E" }]}>Instant electricity token delivery</Text>
        </View>

        {/* DISCO */}
        <Text style={[styles.label, { color: colors.foreground }]}>Electricity Provider</Text>
        <TouchableOpacity
          style={[styles.dropdown, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={() => setShowDiscos(!showDiscos)}
        >
          <View>
            <Text style={[styles.dropdownVal, { color: colors.foreground }]}>{disco.label}</Text>
            <Text style={[styles.dropdownSub, { color: colors.mutedForeground }]}>{disco.region}</Text>
          </View>
          <Feather name={showDiscos ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
        {showDiscos && (
          <View style={[styles.dropdownList, { borderColor: colors.border, backgroundColor: colors.card }]}>
            {DISCOS.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[styles.dropdownItem, { borderBottomColor: colors.border }]}
                onPress={() => { setDisco(d); setShowDiscos(false); Haptics.selectionAsync(); }}
              >
                <Text style={[styles.dropdownVal, { color: colors.foreground }]}>{d.label}</Text>
                <Text style={[styles.dropdownSub, { color: colors.mutedForeground }]}>{d.region}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Meter Type */}
        <Text style={[styles.label, { color: colors.foreground }]}>Meter Type</Text>
        <View style={styles.meterTypeRow}>
          {METER_TYPES.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.meterTypeBtn, { borderColor: meterType === m ? colors.primary : colors.border, backgroundColor: meterType === m ? colors.purpleLight : colors.card }]}
              onPress={() => { setMeterType(m); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.meterTypeText, { color: meterType === m ? colors.primary : colors.foreground }]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meter Number */}
        <Text style={[styles.label, { color: colors.foreground }]}>Meter Number</Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Feather name="hash" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={meterNo}
            onChangeText={setMeterNo}
            placeholder="Enter meter number"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="numeric"
            maxLength={13}
          />
        </View>

        {/* Amount */}
        <Text style={[styles.label, { color: colors.foreground }]}>Amount</Text>
        <View style={[styles.amtWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
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

        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.quickChip, { borderColor: amount === q.toString() ? colors.primary : colors.border, backgroundColor: amount === q.toString() ? colors.purpleLight : colors.card }]}
              onPress={() => { setAmount(q.toString()); Haptics.selectionAsync(); }}
            >
              <Text style={[styles.quickText, { color: amount === q.toString() ? colors.primary : colors.foreground }]}>
                ₦{q.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
          style={[styles.buyBtn, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Feather name="zap" size={18} color="#1A1A2E" style={{ marginRight: 8 }} />
          <Text style={styles.buyBtnText}>{loading ? "Processing..." : "Pay Electricity"}</Text>
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
  dropdown: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1.5, borderRadius: 12, padding: 14, marginBottom: 4 },
  dropdownVal: { fontSize: 14, fontFamily: "Inter_500Medium" },
  dropdownSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  dropdownList: { borderWidth: 1, borderRadius: 12, marginBottom: 20, overflow: "hidden" },
  dropdownItem: { padding: 14, borderBottomWidth: 1 },
  meterTypeRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  meterTypeBtn: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  meterTypeText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20 },
  input: { flex: 1, fontSize: 16, fontFamily: "Inter_500Medium" },
  amtWrap: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 14 },
  nairaSign: { fontSize: 20, fontFamily: "Inter_600SemiBold", marginRight: 4 },
  amtInput: { flex: 1, fontSize: 24, fontFamily: "Inter_700Bold" },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  quickChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  quickText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  balRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 24 },
  balText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  buyBtn: { borderRadius: 28, paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  buyBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
});
