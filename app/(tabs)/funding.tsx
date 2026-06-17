import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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

type Tab = "deposit" | "request" | "history";

export default function FundingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const app = useApp();
  const [tab, setTab] = useState<Tab>("deposit");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      app.creditWallet(val);
      app.addTransaction({ type: "deposit", description: "Wallet Deposit", amount: val, status: "success" });
      setAmount("");
      setLoading(false);
      Alert.alert("Success", `₦${val.toLocaleString()} has been added to your wallet.`);
    }, 1500);
  };

  const handleRequestFunding = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    if (val > 50000) {
      Alert.alert("Limit Exceeded", "Maximum funding request is ₦50,000.");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      app.addTransaction({ type: "funding", description: "Funding Request", amount: val, status: "pending" });
      setAmount("");
      setLoading(false);
      Alert.alert("Request Submitted", "Your funding request is under review. You will be notified.");
    }, 1500);
  };

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#2D1B8E", "#4A3AB5"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Text style={styles.logoText}>LENDRO</Text>
        <Text style={styles.headerSub}>Funding Centre</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balLabel}>Wallet Balance</Text>
          <Text style={styles.balAmount}>
            ₦{app.walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.balRow}>
            <View>
              <Text style={styles.balSub}>Support Limit</Text>
              <Text style={styles.balSubVal}>
                ₦{app.supportFundingLimit.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View>
              <Text style={styles.balSub}>Outstanding</Text>
              <Text style={styles.balSubVal}>
                ₦{app.outstanding.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
        {(["deposit", "request", "history"] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => { setTab(t); Haptics.selectionAsync(); }}
          >
            <Text
              style={[
                styles.tabLabel,
                { color: tab === t ? colors.primary : colors.mutedForeground },
              ]}
            >
              {t === "deposit" ? "Deposit" : t === "request" ? "Request Funding" : "History"}
            </Text>
            {tab === t && <View style={[styles.tabUnderline, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {tab === "history" ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Transaction History</Text>
            {app.transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="clock" size={40} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No transactions yet</Text>
              </View>
            ) : (
              app.transactions.map((tx) => (
                <View key={tx.id} style={[styles.txRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.txIcon, { backgroundColor: tx.status === "success" ? "#DCFCE7" : tx.status === "pending" ? "#FEF9C3" : "#FEE2E2" }]}>
                    <Feather
                      name={tx.type === "deposit" ? "arrow-down-circle" : tx.type === "funding" ? "credit-card" : "zap"}
                      size={20}
                      color={tx.status === "success" ? "#16A34A" : tx.status === "pending" ? "#CA8A04" : "#DC2626"}
                    />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txDesc, { color: colors.foreground }]}>{tx.description}</Text>
                    <Text style={[styles.txDate, { color: colors.mutedForeground }]}>
                      {new Date(tx.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmt, { color: tx.type === "deposit" ? colors.success : colors.destructive }]}>
                      {tx.type === "deposit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </Text>
                    <Text style={[styles.txStatus, { color: tx.status === "success" ? colors.success : tx.status === "pending" ? "#CA8A04" : colors.destructive }]}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </>
        ) : (
          <>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>
              {tab === "deposit" ? "Enter Deposit Amount" : "Enter Funding Amount"}
            </Text>
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
            <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>Quick Select</Text>
            <View style={styles.quickGrid}>
              {quickAmounts.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={[styles.quickBtn, { borderColor: colors.border, backgroundColor: amount === q.toString() ? colors.purpleLight : colors.card }]}
                  onPress={() => { setAmount(q.toString()); Haptics.selectionAsync(); }}
                >
                  <Text style={[styles.quickBtnText, { color: amount === q.toString() ? colors.primary : colors.foreground }]}>
                    ₦{q.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {tab === "request" && (
              <View style={[styles.infoBox, { backgroundColor: colors.purpleLight }]}>
                <Ionicons name="information-circle" size={18} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.primary }]}>
                  Max request: ₦50,000. Repayment period: 30 days. Points required: 100+
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
              onPress={tab === "deposit" ? handleDeposit : handleRequestFunding}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>
                {loading ? "Processing..." : tab === "deposit" ? "Deposit Now" : "Submit Request"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  logoText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#F5A623", letterSpacing: 2, marginBottom: 2 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 16 },
  balanceCard: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 },
  balLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
  balAmount: { fontSize: 28, color: "#FFFFFF", fontFamily: "Inter_700Bold", marginVertical: 6 },
  balRow: { flexDirection: "row", gap: 32 },
  balSub: { fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular" },
  balSubVal: { fontSize: 14, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 14 },
  tabBtnActive: {},
  tabLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  tabUnderline: { position: "absolute", bottom: 0, left: 8, right: 8, height: 2, borderRadius: 1 },
  scroll: { flex: 1 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 16 },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  txRow: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 12 },
  txInfo: { flex: 1 },
  txDesc: { fontSize: 14, fontFamily: "Inter_500Medium" },
  txDate: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  txRight: { alignItems: "flex-end" },
  txAmt: { fontSize: 14, fontFamily: "Inter_700Bold" },
  txStatus: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  inputLabel: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 10 },
  inputWrap: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20 },
  nairaSign: { fontSize: 20, fontFamily: "Inter_600SemiBold", marginRight: 4 },
  amtInput: { flex: 1, fontSize: 24, fontFamily: "Inter_700Bold" },
  quickLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 10 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  quickBtn: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  quickBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  infoBox: { flexDirection: "row", alignItems: "flex-start", padding: 12, borderRadius: 10, gap: 8, marginBottom: 20 },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  actionBtn: { borderRadius: 28, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  actionBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
});
