import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const router = useRouter();
  const app = useApp();
  const insets = useSafeAreaInsets();
  const { contact, mode } = useLocalSearchParams<{ contact: string; mode: string }>();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setCanResend(true); clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInput = (text: string, index: number) => {
    const digit = text.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }

    // Auto-verify when all filled
    if (digit && next.filter(Boolean).length === OTP_LENGTH) {
      handleVerify(next.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      refs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const handleVerify = async (code?: string) => {
    const finalCode = code || otp.join("");
    if (finalCode.length < OTP_LENGTH) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    // Accept any 6-digit code (demo mode)
    app.login(contact ?? "+2340000000000");
    router.replace("/(tabs)" as any);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setCountdown(60);
    setCanResend(false);
    refs.current[0]?.focus();
    setActiveIndex(0);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setCanResend(true); clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const masked = mode === "phone"
    ? contact?.replace(/(\+234|0)(\d{3})(\d{4})(\d+)/, "+234 $2 **** $4") ?? "your number"
    : contact?.replace(/(.{3})(.+)(@.+)/, "$1***$3") ?? "your email";

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={22} color="#1A1A2E" />
      </TouchableOpacity>

      {/* Icon */}
      <View style={styles.iconWrap}>
        <LinearGradient colors={["#2D1B8E", "#4A3AB5"]} style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={36} color="#F5A623" />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>
        We sent a {OTP_LENGTH}-digit code to{"\n"}
        <Text style={styles.contact}>{masked}</Text>
      </Text>

      {/* OTP Boxes */}
      <View style={styles.otpRow}>
        {Array(OTP_LENGTH).fill(0).map((_, i) => (
          <TextInput
            key={i}
            ref={(r) => { refs.current[i] = r; }}
            style={[
              styles.otpBox,
              activeIndex === i && styles.otpBoxActive,
              otp[i] && styles.otpBoxFilled,
            ]}
            value={otp[i]}
            onChangeText={(t) => handleInput(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            onFocus={() => setActiveIndex(i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            caretHidden
          />
        ))}
      </View>

      {/* Resend */}
      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity onPress={handleResend} disabled={!canResend} activeOpacity={0.7}>
          <Text style={[styles.resendBtn, !canResend && { color: "#9CA3AF" }]}>
            {canResend ? "Resend Code" : `Resend in ${countdown}s`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verify button */}
      <TouchableOpacity
        style={[styles.verifyBtn, { opacity: otp.filter(Boolean).length < OTP_LENGTH ? 0.5 : 1 }]}
        onPress={() => handleVerify()}
        disabled={otp.filter(Boolean).length < OTP_LENGTH || loading}
        activeOpacity={0.85}
      >
        <LinearGradient colors={["#2D1B8E", "#4A3AB5"]} style={styles.verifyGradient}>
          {loading ? (
            <Text style={styles.verifyText}>Verifying…</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.verifyText}>Verify & Sign In</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Demo hint */}
      <View style={styles.demoHint}>
        <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
        <Text style={styles.demoText}>Demo: enter any 6-digit code to sign in</Text>
      </View>

      <Text style={styles.secureNote}>
        <Ionicons name="lock-closed" size={12} color="#10B981" /> Your data is encrypted and secure
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 24 },
  backBtn: { width: 44, height: 44, justifyContent: "center", marginBottom: 16 },
  iconWrap: { alignItems: "center", marginBottom: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#1A1A2E", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#6B7280", fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22, marginBottom: 36 },
  contact: { color: "#2D1B8E", fontFamily: "Inter_700Bold" },
  otpRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 28 },
  otpBox: {
    width: 48, height: 56, borderRadius: 12,
    borderWidth: 2, borderColor: "#E5E7EB",
    textAlign: "center", fontSize: 22, fontFamily: "Inter_700Bold", color: "#1A1A2E",
    backgroundColor: "#F9FAFB",
  },
  otpBoxActive: { borderColor: "#2D1B8E", backgroundColor: "#F0ECFF" },
  otpBoxFilled: { borderColor: "#10B981", backgroundColor: "#F0FDF4" },
  resendRow: { alignItems: "center", gap: 4, marginBottom: 32 },
  resendText: { fontSize: 13, color: "#6B7280", fontFamily: "Inter_400Regular" },
  resendBtn: { fontSize: 14, color: "#2D1B8E", fontFamily: "Inter_700Bold" },
  verifyBtn: { borderRadius: 14, overflow: "hidden", marginBottom: 20 },
  verifyGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, gap: 8,
  },
  verifyText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  demoHint: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 4, marginBottom: 12,
    backgroundColor: "#F3F4F6", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12,
  },
  demoText: { fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
  secureNote: { textAlign: "center", fontSize: 12, color: "#9CA3AF", fontFamily: "Inter_400Regular" },
});
