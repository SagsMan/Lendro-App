import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import * as Api from "@/services/api";

export interface Transaction {
  id: string;
  type: "airtime" | "data" | "electricity" | "cable" | "deposit" | "funding" | "exam" | "more";
  description: string;
  amount: number;
  status: "success" | "pending" | "failed";
  date: string;
  phone?: string;
  network?: string;
}

interface AppState {
  walletBalance: number;
  oShareBalance: number;
  supportFundingLimit: number;
  outstanding: number;
  totalPointsEarned: number;
  usagePoints: number;
  participationPoints: number;
  repaymentScore: number;
  transactions: Transaction[];
  username: string;
  phone: string;
  email: string;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
}

interface AppContextValue extends AppState {
  loaded: boolean;
  debitWallet: (amount: number) => boolean;
  creditWallet: (amount: number) => void;
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;
  refreshData: () => Promise<void>;
  login: (phoneOrEmail: string, name?: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
  retryTransaction: (id: string) => void;
}

const defaultState: AppState = {
  walletBalance: 0,
  oShareBalance: 0,
  supportFundingLimit: 0,
  outstanding: 0,
  totalPointsEarned: 0,
  usagePoints: 0,
  participationPoints: 0,
  repaymentScore: 0,
  transactions: [],
  username: "",
  phone: "",
  email: "",
  isAuthenticated: false,
  hasSeenOnboarding: false,
};

export const AppContext = createContext<AppContextValue>({
  ...defaultState,
  loaded: false,
  debitWallet: () => false,
  creditWallet: () => {},
  addTransaction: () => {},
  refreshData: async () => {},
  login: () => {},
  logout: () => {},
  completeOnboarding: () => {},
  retryTransaction: () => {},
});

const STORAGE_KEY = "@lendro_app_state";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  // Load persisted state + API token on mount
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setState({ ...defaultState, ...saved });
        } catch { /* ignore corrupt state */ }
      }
      // Restore API token if present
      await Api.loadStoredToken();
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback((s: AppState) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s)).catch(() => {});
  }, []);

  /** Sync wallet balance + recent transactions from the live API. */
  const refreshData = useCallback(async () => {
    try {
      const wallet = await Api.getWallet();
      setState((prev) => {
        const serverTxs: Transaction[] = (wallet.transactions ?? []).map((t) => ({
          id: t.reference,
          type: "more" as Transaction["type"],
          description: t.service ?? t.type,
          amount: t.amount,
          status: t.status === "success"
            ? "success"
            : t.status === "failed" || t.status === "reversed"
            ? "failed"
            : "pending",
          date: t.date,
        }));
        const next = {
          ...prev,
          walletBalance: wallet.balance,
          transactions: serverTxs.length ? serverTxs : prev.transactions,
        };
        persist(next);
        return next;
      });
    } catch {
      // Server unreachable — keep local state
    }
  }, [persist]);

  const debitWallet = useCallback(
    (amount: number) => {
      if (state.walletBalance < amount) return false;
      setState((prev) => {
        const next = { ...prev, walletBalance: prev.walletBalance - amount };
        persist(next);
        return next;
      });
      return true;
    },
    [state.walletBalance, persist]
  );

  const creditWallet = useCallback(
    (amount: number) => {
      setState((prev) => {
        const next = { ...prev, walletBalance: prev.walletBalance + amount };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const addTransaction = useCallback(
    (tx: Omit<Transaction, "id" | "date">) => {
      const full: Transaction = {
        ...tx,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        date: new Date().toISOString(),
      };
      setState((prev) => {
        const pointsEarned = tx.status === "success" ? Math.floor(tx.amount * 0.01) : 0;
        const next = {
          ...prev,
          transactions: [full, ...prev.transactions],
          usagePoints: prev.usagePoints + pointsEarned,
          totalPointsEarned: prev.totalPointsEarned + pointsEarned,
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const login = useCallback(
    (phoneOrEmail: string, name = "User") => {
      setState((prev) => {
        const isEmail = phoneOrEmail.includes("@");
        const next = {
          ...prev,
          isAuthenticated: true,
          phone: isEmail ? prev.phone : phoneOrEmail,
          email: isEmail ? phoneOrEmail : prev.email,
          username: name,
        };
        persist(next);
        return next;
      });
      // Sync wallet balance from server after login
      setTimeout(() => refreshData(), 1000);
    },
    [persist, refreshData]
  );

  const logout = useCallback(() => {
    // Best-effort server logout
    Api.logout().catch(() => {});
    setState((prev) => {
      const next = { ...prev, isAuthenticated: false, phone: "", email: "" };
      persist(next);
      return next;
    });
  }, [persist]);

  const completeOnboarding = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, hasSeenOnboarding: true };
      persist(next);
      return next;
    });
  }, [persist]);

  const retryTransaction = useCallback(
    (id: string) => {
      setState((prev) => {
        const next = {
          ...prev,
          transactions: prev.transactions.map((tx) =>
            tx.id === id ? { ...tx, status: "pending" as const } : tx
          ),
        };
        persist(next);
        // Poll the real status after 3 seconds
        setTimeout(() => {
          Api.getOrderStatus(id)
            .then((res) => {
              const apiStatus = res.transaction.status;
              const mapped: "success" | "failed" | "pending" =
                apiStatus === "success" ? "success" : apiStatus === "failed" || apiStatus === "reversed" ? "failed" : "pending";
              setState((p) => {
                const updated = {
                  ...p,
                  transactions: p.transactions.map((tx) =>
                    tx.id === id ? { ...tx, status: mapped } : tx
                  ),
                };
                persist(updated);
                return updated;
              });
            })
            .catch(() => {
              // Server offline — optimistically mark success after 2s
              setTimeout(() => {
                setState((p) => {
                  const updated = {
                    ...p,
                    transactions: p.transactions.map((tx) =>
                      tx.id === id ? { ...tx, status: "success" as const } : tx
                    ),
                  };
                  persist(updated);
                  return updated;
                });
              }, 2000);
            });
        }, 3000);
        return next;
      });
    },
    [persist]
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        loaded,
        debitWallet,
        creditWallet,
        addTransaction,
        refreshData,
        login,
        logout,
        completeOnboarding,
        retryTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
