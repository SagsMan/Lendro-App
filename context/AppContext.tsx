import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Transaction {
  id: string;
  type: "airtime" | "data" | "electricity" | "cable" | "deposit" | "funding" | "more";
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
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
}

interface AppContextValue extends AppState {
  debitWallet: (amount: number) => boolean;
  creditWallet: (amount: number) => void;
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;
  refreshData: () => void;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
  retryTransaction: (id: string) => void;
}

const defaultState: AppState = {
  walletBalance: 59000,
  oShareBalance: 0,
  supportFundingLimit: 0,
  outstanding: 0,
  totalPointsEarned: 240,
  usagePoints: 240,
  participationPoints: 0,
  repaymentScore: 0,
  transactions: [
    {
      id: "1",
      type: "deposit",
      description: "Wallet Deposit",
      amount: 59000,
      status: "success",
      date: "2026-06-10T10:00:00Z",
    },
  ],
  username: "Olatunde",
  phone: "",
  isAuthenticated: false,
  hasSeenOnboarding: false,
};

export const AppContext = createContext<AppContextValue>({
  ...defaultState,
  debitWallet: () => false,
  creditWallet: () => {},
  addTransaction: () => {},
  refreshData: () => {},
  login: () => {},
  logout: () => {},
  completeOnboarding: () => {},
  retryTransaction: () => {},
});

const STORAGE_KEY = "@lendro_app_state";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setState({ ...defaultState, ...saved });
        } catch {
          // ignore
        }
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((s: AppState) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(s)).catch(() => {});
  }, []);

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
        const next = {
          ...prev,
          transactions: [full, ...prev.transactions],
          usagePoints:
            tx.status === "success"
              ? prev.usagePoints + Math.floor(tx.amount * 0.01)
              : prev.usagePoints,
          totalPointsEarned:
            tx.status === "success"
              ? prev.totalPointsEarned + Math.floor(tx.amount * 0.01)
              : prev.totalPointsEarned,
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const login = useCallback(
    (phone: string, name = "User") => {
      setState((prev) => {
        const next = { ...prev, isAuthenticated: true, phone, username: name };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const logout = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, isAuthenticated: false, phone: "" };
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
        // Simulate retry after 2s
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
        return next;
      });
    },
    [persist]
  );

  const refreshData = useCallback(() => {}, []);

  if (!loaded) return null;

  return (
    <AppContext.Provider
      value={{
        ...state,
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
