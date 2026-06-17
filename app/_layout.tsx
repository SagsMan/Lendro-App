import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const app = useApp();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!app.loaded) return;

    const inOnboarding = segments[0] === "onboarding";
    const inAuth = segments[0] === "auth";
    const inTabs = segments[0] === "(tabs)";

    if (!app.hasSeenOnboarding && !inOnboarding) {
      router.replace("/onboarding");
    } else if (app.hasSeenOnboarding && !app.isAuthenticated && !inAuth) {
      router.replace("/auth/login");
    } else if (app.isAuthenticated && (inOnboarding || inAuth)) {
      router.replace("/(tabs)");
    }
  }, [app.loaded, app.hasSeenOnboarding, app.isAuthenticated]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/otp" options={{ headerShown: false }} />
      <Stack.Screen name="services/airtime" options={{ headerShown: false }} />
      <Stack.Screen name="services/data" options={{ headerShown: false }} />
      <Stack.Screen name="services/electricity" options={{ headerShown: false }} />
      <Stack.Screen name="services/cable" options={{ headerShown: false }} />
      <Stack.Screen name="services/more" options={{ headerShown: false }} />
      <Stack.Screen name="services/exam" options={{ headerShown: false }} />
      <Stack.Screen name="transactions" options={{ headerShown: false }} />
    </Stack>
  );
}

function FontLoader({ children }: { children: React.ReactNode }) {
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppProvider>
                <FontLoader>
                  <RootLayoutNav />
                </FontLoader>
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
