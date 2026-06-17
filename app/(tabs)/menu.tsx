import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const MENU_ITEMS = [
  { id: "profile", label: "My Profile", icon: "user", sub: "Manage your account details" },
  { id: "kyc", label: "KYC Verification", icon: "shield", sub: "Verify your identity" },
  { id: "referral", label: "Referral Program", icon: "users", sub: "Invite friends and earn points" },
  { id: "oshare", label: "oShare Program", icon: "star", sub: "Earn & track oShare tokens" },
  { id: "notifications", label: "Notifications", icon: "bell", sub: "Manage your alerts" },
  { id: "security", label: "Security", icon: "lock", sub: "PIN, biometrics & password" },
  { id: "support", label: "Help & Support", icon: "help-circle", sub: "Chat with us or browse FAQs" },
  { id: "about", label: "About Lendro", icon: "info", sub: "Version 1.0.0" },
];

export default function MenuScreen() {
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
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: "#F5A623" }]}>
            <Ionicons name="person" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Hi, {app.username}</Text>
            <Text style={styles.profileSub}>Community Member</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert("Edit Profile", "Coming soon!")}>
            <Feather name="edit-2" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{app.totalPointsEarned}</Text>
            <Text style={styles.statLbl}>Points</Text>
          </View>
          <View style={[styles.statDivider]} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>₦{(app.walletBalance / 1000).toFixed(0)}K</Text>
            <Text style={styles.statLbl}>Balance</Text>
          </View>
          <View style={[styles.statDivider]} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{app.transactions.length}</Text>
            <Text style={styles.statLbl}>Transactions</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}>
        {MENU_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuRow,
              { backgroundColor: colors.card, borderColor: colors.border },
              idx === 0 && styles.menuRowFirst,
              idx === MENU_ITEMS.length - 1 && styles.menuRowLast,
            ]}
            onPress={() => Alert.alert(item.label, "This feature is coming soon!")}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.purpleLight }]}>
              <Feather name={item.icon as any} size={18} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.destructive }]}
          onPress={() => Alert.alert("Sign Out", "Are you sure you want to sign out?")}
        >
          <Feather name="log-out" size={18} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  logoText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#F5A623", letterSpacing: 2, marginBottom: 16 },
  profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", marginRight: 14 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  profileSub: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular", marginTop: 2 },
  editBtn: { padding: 8 },
  statsRow: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 14, padding: 16 },
  statBox: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 18, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  statLbl: { fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  menuRow: { flexDirection: "row", alignItems: "center", padding: 14, borderWidth: 1, marginBottom: 1 },
  menuRowFirst: { borderTopLeftRadius: 14, borderTopRightRadius: 14 },
  menuRowLast: { borderBottomLeftRadius: 14, borderBottomRightRadius: 14, marginBottom: 20 },
  menuIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 14 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  menuSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderWidth: 1.5, borderRadius: 14, paddingVertical: 14, marginBottom: 20 },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
