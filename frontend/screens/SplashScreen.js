import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { theme } from "../theme";

const { width } = Dimensions.get("window");

const SplashScreen = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation sequence
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // App name appears
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      // Tagline appears
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      // Loading dots appear
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Go to login after 3 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>💚</Text>
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: textOpacity,
          },
        ]}
      >
        DiaCare
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: taglineOpacity,
          },
        ]}
      >
        Your Diabetes Companion
      </Animated.Text>

      {/* Features list */}
      <Animated.View
        style={[
          styles.featureRow,
          {
            opacity: taglineOpacity,
          },
        ]}
      >
        {["🩸 Sugar", "💊 Medicine", "🥗 Diet", "🦶 Scan"].map((f) => (
          <View key={f} style={styles.featurePill}>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Loading dots */}
      <Animated.View
        style={[
          styles.dotsRow,
          {
            opacity: dotsOpacity,
          },
        ]}
      >
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </Animated.View>

      {/* Bottom text */}
      <Animated.Text
        style={[
          styles.bottomText,
          {
            opacity: dotsOpacity,
          },
        ]}
      >
        Team Red Falcon 🦅
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: "center",
    alignItems: "center",
  },
  bgCircle1: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: theme.primary + "08",
    top: -width * 0.2,
    right: -width * 0.2,
  },
  bgCircle2: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: theme.secondary + "08",
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.primary + "40",
    elevation: 8,
    shadowColor: theme.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  logoEmoji: { fontSize: 56 },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: theme.text,
    letterSpacing: 2,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: theme.subText,
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  featureRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 48,
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  featurePill: {
    backgroundColor: theme.primary + "15",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.primary + "30",
  },
  featureText: {
    color: theme.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.border,
  },
  dotActive: {
    backgroundColor: theme.primary,
    width: 24,
  },
  bottomText: {
    position: "absolute",
    bottom: 48,
    fontSize: 13,
    color: theme.subText,
    letterSpacing: 1,
  },
});

export default SplashScreen;
