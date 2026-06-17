import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Transaction, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Filter = "all" | "success" | "pending" | "failed";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "success", label: "Success" },
  { key: "pending", label: "Pending" },
  { key: "failed", label: "Failed" },
];

const TYPE_ICON: Record<Transaction["type"], { name: string; color: string; bg: string }> = {
  airtime: { name: "call", color: "#E30000", bg: "#FEE2E2" },
  data: { name: "wifi", color: "#3B82F6", bg: "#EFF6FF" },
  electricity: { name: "flash", color: "#F59E0B", bg: "#FFFBEB" },
  cable: { name: "tv", color: "#8B5CF6", bg: "#F5F3FF" },
  deposit: { name: "wallet", color: "#10B981", bg: "#ECFDF5" },
  funding: { name: "trending-up", color: "#2D1B8E", bg: "#EDE9FF" },
  more: { name: "grid", color: "#6B7280", bg: "#F3F4F6" },
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function TransactionsScreen() {
  const router = useRouter();
  const app = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = app.transactions.filter((t) => filter === "all" || t.status === filter);

  const handleRetry = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    app.retryTransaction(id);
  };

  const statusColors = {
    success: { bg: "#ECFDF5", text: "#10B981" },
    pending: { bg: "#FFFBEB", text: "#F59E0B" },
    failed: { bg: "#FEF2F2", text: "#EF4444" },
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const icon = TYPE_ICON[item.type] ?? TYPE_ICON.more;
    const sc = statusColors[item.status];
    const isCredit = item.type === "deposit";
    return (
      <View style={[styles.txCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.txIcon, { backgroundColor: icon.bg }]}>
          <Ionicons name={icon.name as any} size={20} color={icon.color} />
        </View>
        <View style={styles.txMeta}>
          <Text style={[styles.txDesc, { color: colors.foreground }]} numberOfLines={1}>{item.description}</Text>
          <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{formatDate(item.date)}</Text>
          {item.network && (
            <Text style={[styles.txNetwork, { color: colors.mutedForeground }]}>Network: {item.network?.toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.txRight}>
          <Text style={[styles.txAmount, { color: isCredit ? "#10B981" : "#EF4444" }]}>
            {isCredit ? "+" : "-"}{formatNaira(item.amount)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.statusText, { color: sc.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          {item.status === "failed" && (
            <TouchableOpacity style={styles.retryBtn} onPress={() => handleRetry(item.id)} activeOpacity={0.8}>
              <Ionicons name="refresh" size={12} color="#2D1B8E" />
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const totalSuccess = app.transactions
    .filter((t) => t.status === "success" && t.type !== "deposit")
    .reduce((s, t) => s + t.amount, 0);
  const totalDeposit = app.transactions
    .filter((t) => t.type === "deposit" && t.status === "success")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Summary */}
      <View style={[styles.summary, { backgroundColor: "#2D1B8E" }]}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>{formatNaira(totalSuccess)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Deposited</Text>
          <Text style={[styles.summaryValue, { color: "#34D399" }]}>{formatNaira(totalDeposit)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Transactions</Text>
          <Text style={styles.summaryValue}>{app.transactions.length}</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersWrap}>
        {FILTERS.map((f) => {
          const count = f.key === "all"
            ? app.transactions.length
            : app.transactions.filter((t) => t.status === f.key).length;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                {f.label} {count > 0 ? `(${count})` : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No transactions</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              {filter === "all" ? "Start buying services to see your history" : `No ${filter} transactions yet`}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 16, backgroundColor: "#2D1B8E",
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  summary: {
    flexDirection: "row", paddingHorizontal: 16, paddingVertical: 16,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryLabel: { fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular", marginBottom: 4 },
  summaryValue: { fontSize: 15, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  summaryDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 4 },
  filtersWrap: {
    flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 8,
    backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1.5, borderColor: "#E5E7EB", backgroundColor: "#F9FAFB",
  },
  filterChipActive: { borderColor: "#2D1B8E", backgroundColor: "#EDE9FF" },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#6B7280" },
  filterTextActive: { color: "#2D1B8E" },
  txCard: {
    flexDirection: "row", alignItems: "flex-start",
    padding: 14, borderRadius: 14, borderWidth: 1,
    marginBottom: 10, gap: 12,
  },
  txIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  txMeta: { flex: 1 },
  txDesc: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 3 },
  txDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  txNetwork: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  txRight: { alignItems: "flex-end", gap: 4 },
  txAmount: { fontSize: 15, fontFamily: "Inter_700Bold" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  retryBtn: {
    flexDirection: "row", alignItems: "center", gap: 3,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    backgroundColor: "#EDE9FF", borderWidth: 1, borderColor: "#DDD5FF",
  },
  retryText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#2D1B8E" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptySub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", maxWidth: 260 },
});
