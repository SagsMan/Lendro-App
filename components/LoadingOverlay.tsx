import React, { useEffect, useRef } from "react";
  import { Animated, Easing, Image, StyleSheet, Text } from "react-native";

  import { useLoader } from "@/context/LoadingContext";

  export function LoadingOverlay() {
    const { isLoading } = useLoader();

    // Overlay fade
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    // Logo scale pulse
    const logoScale = useRef(new Animated.Value(1)).current;
    // Logo opacity
    const logoOpacity = useRef(new Animated.Value(0)).current;

    const pulseAnim = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
      if (isLoading) {
        // Fade overlay in
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();

        // Fade + scale logo in
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();

        // Start pulse loop
        logoScale.setValue(0.85);
        pulseAnim.current = Animated.loop(
          Animated.sequence([
            Animated.timing(logoScale, {
              toValue: 1.1,
              duration: 380,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(logoScale, {
              toValue: 0.95,
              duration: 380,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
        pulseAnim.current.start();
      } else {
        // Stop pulse
        pulseAnim.current?.stop();

        // Fade everything out
        Animated.parallel([
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [isLoading]);

    return (
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
        pointerEvents={isLoading ? "auto" : "none"}
      >
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.Text style={[styles.wordmark, { opacity: logoOpacity }]}>
          LENDRO
        </Animated.Text>
      </Animated.View>
    );
  }

  const styles = StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#2D1B8E",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    logoWrap: {
      width: 110,
      height: 110,
      borderRadius: 30,
      overflow: "hidden",
      backgroundColor: "rgba(255,255,255,0.1)",
      borderWidth: 1.5,
      borderColor: "rgba(245,166,35,0.5)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    logo: {
      width: 96,
      height: 96,
      borderRadius: 24,
    },
    wordmark: {
      fontSize: 22,
      color: "#FFFFFF",
      letterSpacing: 6,
      fontFamily: "Inter_700Bold",
    },
  });
  