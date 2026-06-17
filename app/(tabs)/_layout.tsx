import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="funding">
        <Icon sf={{ default: "banknote", selected: "banknote.fill" }} />
        <Label>Funding</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="purchase">
        <Icon sf={{ default: "cart", selected: "cart.fill" }} />
        <Label>Purchase</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="grants">
        <Icon sf={{ default: "trophy", selected: "trophy.fill" }} />
        <Label>Grants</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="menu">
        <Icon sf={{ default: "line.3.horizontal", selected: "line.3.horizontal" }} />
        <Label>Menu</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: isWeb ? 84 : 60,
          paddingBottom: isWeb ? 34 : 8,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "house.fill" : "house"} tintColor={color} size={22} />
            ) : (
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="funding"
        options={{
          title: "Funding",
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "banknote.fill" : "banknote"} tintColor={color} size={22} />
            ) : (
              <Ionicons name={focused ? "trending-up" : "trending-up-outline"} size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="purchase"
        options={{
          title: "Purchase",
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "cart.fill" : "cart"} tintColor={color} size={22} />
            ) : (
              <Ionicons name={focused ? "cart" : "cart-outline"} size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="grants"
        options={{
          title: "Grants",
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "trophy.fill" : "trophy"} tintColor={color} size={22} />
            ) : (
              <Ionicons name={focused ? "trophy" : "trophy-outline"} size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="line.3.horizontal" tintColor={color} size={22} />
            ) : (
              <Feather name="menu" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
