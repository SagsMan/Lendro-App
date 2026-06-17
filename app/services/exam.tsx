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

const BODIES = [
  {
    id: "waec",
    label: "WAEC",
    fullName: "West African Examinations Council",
    logo: require("@/assets/images/logos/waec.png"),
    color: "#003399",
    types: [
      { id: "w1", name: "WAEC Result Checker", price: 1000, desc: "Check WASSCE result online" },
      { id: "w2", name: "WAEC Scratch Card (2 subjects)", price: 700, desc: "2-subject result checker card" },
      { id: "w3", name: "WAEC Direct Entry PIN", price: 1500, desc: "DE screening verification" },
    ],
  },
  {
    id: "neco",
    label: "NECO",
    fullName: "National Examinations Council",
    logo: require("@/assets/images/logos/neco.png"),
    color: "#006400",
    types: [
      { id: "n1", name: "NECO Result Checker", price: 1000, desc: "Check SSCE/BECE result" },
      { id: "n2", name: "NECO Token (June/July)", price: 750, desc: "June/July result token" },
      { id: "n3", name: "NECO GCE Result", price: 750, desc: "GCE result checker" },
    ],
  },
  {
    id: "jamb",
    label: "JAMB",
    fullName: "Joint Admissions & Matriculation Board",
    logo: require("@/assets/images/logos/jamb.png"),
    color: "#003E7E",
    types: [
      { id: "j1", name: "JAMB e-PIN (UTME)", price: 3500, desc: "UTME registration e-PIN" },
      { id: "j2", name: "JAMB Result Checker", price: 500, desc: "Check UTME/DE result" },
      { id: "j3", name: "JAMB Change of Institution", price: 2500, desc: "Change of course/institution" },
      { id: "j4", name: "JAMB Direct Entry Form", price: 2500, desc: "Direct entry application" },
    ],
  },
  {
    id: "nabteb",
    label: "NABTEB",
    fullName: "National Business & Technical Examinations Board",
    logo: require("@/assets/images/logos/nabteb.png"),
    color: "#800000",
    types: [
      { id: "nb1", name: "NABTEB Result Checker", price: 900, desc: "Check NBC/NBT result" },
      { id: "nb2", name: "NABTEB GCE PIN", price: 900, desc: "GCE result checker PIN" },
    ],
  },
];

export default function ExamScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const app = useApp();

  const [bodyId, setBodyId] = useState("waec");
  const [examNumber, setExamNumber] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const body = BODIES.find((b) => b.id === bodyId)!;
  const selectedType = body.types.find((t) => t.id === selected);

  const handlePurchase = () => {
    if (!examNumber || examNumber.length < 8) {
      Alert.alert("Invalid Number", "Enter a valid exam registration/index number.");
      return;
    }
    if (!selectedType) {
      Alert.alert("No PIN Type", "Please select a PIN type.");
      return;
    }
    if (!app.debitWallet(selectedType.price)) {
      Alert.alert("Insufficient Balance", "Your wallet balance is too low. Please deposit funds.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      const pin = Math.random().toString(36).slice(2, 12).toUpperCase();
      app.addTransaction({
        type: "exam",
        description: `${body.label} ${selectedType.name} — ${examNumber}`,
        amount: selectedType.price,
        status: "success",
      });
      setLoading(false);
      Alert.alert(
        "PIN Generated!",
        `${body.label} PIN: ${pin}\n\nKeep this safe. Valid for ${examNumber}.`,
        [{ text: "Copy & Close", onPress: () => router.back() }]
      );
    }, 2000);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Exam PIN</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <View style={[styles.banner, { backgroundColor: "#EDE9FF" }]}>
          <Feather name="file-text" size={16} color={colors.primary} />
          <Text style={[styles.bannerText, { color: colors.primary }]}>
            Earn 1.5% usage points on every exam PIN purchase
          </Text>
        </View>

        {/* Exam Body Selector */}
        <Text style={[styles.label, { color: colors.foreground }]}>Select Exam Body</Text>
        <View style={styles.bodyGrid}>
          {BODIES.map((b) => (
            <TouchableOpacity
              key={b.id}
              style={[
                styles.bodyBtn,
                { borderColor: bodyId === b.id ? b.color : colors.border },
                bodyId === b.id && { borderWidth: 2, backgroundColor: b.color + "10" },
              ]}
              onPress={() => { setBodyId(b.id); setSelected(null); Haptics.selectionAsync(); }}
            >
              <View style={styles.bodyLogoCircle}>
                <Image source={b.logo} style={styles.bodyLogoImg} resizeMode="cover" />
              </View>
              <Text style={[styles.bodyLabel, { color: colors.foreground }]}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Full name */}
        <View style={[styles.bodyInfoRow, { backgroundColor: body.color + "12", borderColor: body.color + "30" }]}>
          <View style={styles.bodyInfoLogo}>
            <Image source={body.logo} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          </View>
          <Text style={[styles.bodyInfoText, { color: body.color }]}>{body.fullName}</Text>
        </View>

        {/* Registration / Index Number */}
        <Text style={[styles.label, { color: colors.foreground }]}>Exam Reg / Index Number</Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Feather name="hash" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={examNumber}
            onChangeText={setExamNumber}
            placeholder="e.g. 1234567890"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="default"
            autoCapitalize="characters"
            maxLength={20}
          />
        </View>

        {/* PIN Types */}
        <Text style={[styles.label, { color: colors.foreground }]}>Select PIN Type</Text>
        {body.types.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.typeRow,
              {
                borderColor: selected === t.id ? body.color : colors.border,
                backgroundColor: selected === t.id ? body.color + "10" : colors.card,
              },
            ]}
            onPress={() => { setSelected(t.id); Haptics.selectionAsync(); }}
          >
            <View style={styles.typeInfo}>
              <Text style={[styles.typeName, { color: colors.foreground }]}>{t.name}</Text>
              <Text style={[styles.typeDesc, { color: colors.mutedForeground }]}>{t.desc}</Text>
            </View>
            <View style={styles.typeRight}>
              <Text style={[styles.typePrice, { color: body.color }]}>₦{t.price.toLocaleString()}</Text>
              {selected === t.id && (
                <Feather name="check-circle" size={18} color={body.color} style={{ marginTop: 4 }} />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Balance */}
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
          style={[
            styles.buyBtn,
            { backgroundColor: selectedType ? body.color : colors.muted, opacity: loading ? 0.7 : 1 },
          ]}
          onPress={handlePurchase}
          disabled={loading || !selectedType}
          activeOpacity={0.8}
        >
          <Text style={[styles.buyBtnText, { color: selectedType ? "#FFFFFF" : colors.mutedForeground }]}>
            {loading ? "Generating PIN..." : selectedType ? `Get PIN — ₦${selectedType.price.toLocaleString()}` : "Select PIN Type"}
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
  bannerText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  label: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 10 },
  bodyGrid: { flexDirection: "row", gap: 10, marginBottom: 16 },
  bodyBtn: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 10, alignItems: "center" },
  bodyLogoCircle: { width: 44, height: 44, borderRadius: 22, overflow: "hidden", marginBottom: 6, borderWidth: 1, borderColor: "#E5E7EB" },
  bodyLogoImg: { width: "100%", height: "100%" },
  bodyLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  bodyInfoRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 20 },
  bodyInfoLogo: { width: 28, height: 28, borderRadius: 14, overflow: "hidden" },
  bodyInfoText: { fontSize: 12, fontFamily: "Inter_500Medium", flex: 1 },
  inputWrap: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  typeRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, padding: 14, marginBottom: 10 },
  typeInfo: { flex: 1 },
  typeName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  typeDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  typeRight: { alignItems: "flex-end" },
  typePrice: { fontSize: 16, fontFamily: "Inter_700Bold" },
  balRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 24, marginTop: 8 },
  balText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  buyBtn: { borderRadius: 28, paddingVertical: 16, alignItems: "center" },
  buyBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
