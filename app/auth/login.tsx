import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
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

const { width } = Dimensions.get("window");

type Mode = "phone" | "email";

export default function LoginScreen() {
  const router = useRouter();
  const app = useApp();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>("phone");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isValid = mode === "phone" ? value.replace(/\D/g, "").length >= 10 : value.includes("@") && value.includes(".");

  const handleContinue = async () => {
    if (!isValid) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      const { sendOtp } = await import("@/services/api");
      await sendOtp(value, mode as "phone" | "email");
    } catch {
      // Server unreachable — continue to OTP in demo mode
    }
    setLoading(false);
    router.push({ pathname: "/auth/otp", params: { contact: value, mode } } as any);
  };

  const handleBiometric = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (Platform.OS === "web") {
      Alert.alert("Biometric Login", "Fingerprint authentication available on iOS/Android devices.", [
        { text: "OK", onPress: () => { app.login("+2348000000000", "Olatunde"); router.replace("/(tabs)" as any); } }
      ]);
      return;
    }
    try {
      const LocalAuth = await import("expo-local-authentication").catch(() => null);
      if (!LocalAuth) {
        Alert.alert("Not Available", "Biometric authentication not supported on this device.");
        return;
      }
      const hasHardware = await LocalAuth.hasHardwareAsync();
      const isEnrolled = await LocalAuth.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        Alert.alert("Biometric Not Set Up", "Please enable fingerprint/face ID in your device settings.");
        return;
      }
      const result = await LocalAuth.authenticateAsync({
        promptMessage: "Authenticate to sign in to Lendro",
        fallbackLabel: "Use PIN",
        cancelLabel: "Cancel",
      });
      if (result.success) {
        app.login("+2348000000000", "Olatunde");
        router.replace("/(tabs)" as any);
      }
    } catch {
      Alert.alert("Error", "Biometric authentication failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Header gradient */}
      <LinearGradient colors={["#2D1B8E", "#4A3AB5"]} style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.logo}>LENDRO</Text>
        <Text style={styles.tagline}>Community Support · Simplified</Text>

        <View style={styles.iconRow}>
          {[
            { icon: "people", label: "Community" },
            { icon: "flash", label: "Services" },
            { icon: "trophy", label: "Grants" },
          ].map((item) => (
            <View key={item.label} style={styles.iconItem}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={22} color="#F5A623" />
              </View>
              <Text style={styles.iconLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Sign In to Lendro</Text>
        <Text style={styles.subtitle}>Enter your details to access your account</Text>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === "phone" && styles.modeBtnActive]}
            onPress={() => { setMode("phone"); setValue(""); }}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={15} color={mode === "phone" ? "#2D1B8E" : "#9CA3AF"} />
            <Text style={[styles.modeBtnText, mode === "phone" && styles.modeBtnTextActive]}>Phone</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === "email" && styles.modeBtnActive]}
            onPress={() => { setMode("email"); setValue(""); }}
            activeOpacity={0.8}
          >
            <Ionicons name="mail" size={15} color={mode === "email" ? "#2D1B8E" : "#9CA3AF"} />
            <Text style={[styles.modeBtnText, mode === "email" && styles.modeBtnTextActive]}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={styles.inputWrapper}>
          {mode === "phone" && (
            <View style={styles.prefix}>
              <Text style={styles.prefixFlag}>🇳🇬</Text>
              <Text style={styles.prefixCode}>+234</Text>
            </View>
          )}
          <TextInput
            ref={inputRef}
            style={[styles.input, mode === "phone" && { paddingLeft: 72 }]}
            value={value}
            onChangeText={setValue}
            placeholder={mode === "phone" ? "080 0000 0000" : "you@example.com"}
            placeholderTextColor="#9CA3AF"
            keyboardType={mode === "phone" ? "phone-pad" : "email-address"}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
          {value.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => setValue("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={[styles.continueBtn, !isValid && { opacity: 0.5 }]}
          onPress={handleContinue}
          disabled={!isValid || loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={isValid ? ["#2D1B8E", "#4A3AB5"] : ["#9CA3AF", "#9CA3AF"]}
            style={styles.continueBtnInner}
          >
            {loading ? (
              <Text style={styles.continueBtnText}>Sending OTP…</Text>
            ) : (
              <>
                <Text style={styles.continueBtnText}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or sign in with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Biometric */}
        <TouchableOpacity style={styles.bioBtn} onPress={handleBiometric} activeOpacity={0.8}>
          <LinearGradient colors={["#F0ECFF", "#EDE9FF"]} style={styles.bioBtnInner}>
            <MaterialCommunityIcons name="fingerprint" size={32} color="#2D1B8E" />
            <Text style={styles.bioBtnText}>Fingerprint / Face ID</Text>
            <Text style={styles.bioBtnSub}>Use biometrics to sign in instantly</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to Lendro's{" "}
          <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: "center",
  },
  logo: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#F5A623", letterSpacing: 4, marginBottom: 4 },
  tagline: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 28 },
  iconRow: { flexDirection: "row", gap: 32 },
  iconItem: { alignItems: "center", gap: 6 },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(245,166,35,0.15)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(245,166,35,0.3)",
  },
  iconLabel: { fontSize: 11, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_500Medium" },
  body: { padding: 24 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#1A1A2E", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#6B7280", fontFamily: "Inter_400Regular", marginBottom: 24 },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 10,
  },
  modeBtnActive: { backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  modeBtnText: { fontSize: 14, fontFamily: "Inter_500Medium", color: "#9CA3AF" },
  modeBtnTextActive: { color: "#2D1B8E" },
  inputWrapper: {
    borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 14,
    backgroundColor: "#F9FAFB", marginBottom: 16,
    flexDirection: "row", alignItems: "center", overflow: "hidden",
  },
  prefix: {
    position: "absolute", left: 0, flexDirection: "row", alignItems: "center",
    paddingLeft: 14, paddingRight: 8, gap: 4, zIndex: 1,
  },
  prefixFlag: { fontSize: 18 },
  prefixCode: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#1A1A2E" },
  input: {
    flex: 1, paddingHorizontal: 16, paddingVertical: 16,
    fontSize: 16, fontFamily: "Inter_400Regular", color: "#1A1A2E",
  },
  clearBtn: { padding: 14 },
  continueBtn: { borderRadius: 14, overflow: "hidden", marginBottom: 20 },
  continueBtnInner: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, gap: 8,
  },
  continueBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { fontSize: 13, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  bioBtn: { borderRadius: 16, overflow: "hidden", marginBottom: 24, borderWidth: 1.5, borderColor: "#DDD5FF" },
  bioBtnInner: { alignItems: "center", paddingVertical: 20, gap: 6 },
  bioBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#2D1B8E" },
  bioBtnSub: { fontSize: 12, color: "#6B7280", fontFamily: "Inter_400Regular" },
  terms: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 18 },
  termsLink: { color: "#2D1B8E", fontFamily: "Inter_500Medium" },
});
