import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { theme } from "../theme";

// Import all sub screens
import FootScanScreen from "./FootScanScreen";
import SugarTrackerScreen from "./SugarTrackerScreen";
import MedicineReminderScreen from "./MedicineReminderScreen";
import DietCheckerScreen from "./DietCheckerScreen";
import NearbyHospitalsScreen from "./NearbyHospitalsScreen"; // ✅ FIXED

const tabs = [
  { key: "foot", label: "Foot", icon: "🦶" },
  { key: "sugar", label: "Sugar", icon: "🩸" },
  { key: "medicine", label: "Meds", icon: "💊" },
  { key: "diet", label: "Diet", icon: "🥗" },
  { key: "hospital", label: "Care", icon: "🏥" }, // ✅ NEW TAB
];

const ScanScreen = () => {
  const [activeTab, setActiveTab] = useState("foot");

  const renderScreen = () => {
    switch (activeTab) {
      case "foot":
        return <FootScanScreen />;
      case "sugar":
        return <SugarTrackerScreen />;
      case "medicine":
        return <MedicineReminderScreen />;
      case "diet":
        return <DietCheckerScreen />;
      case "hospital":
        return <NearbyHospitalsScreen />; // ✅ NEW CASE
      default:
        return <FootScanScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.segmentedControl}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.segmentIcon}>{tab.icon}</Text>
                <Text
                  style={[
                    styles.segmentLabel,
                    isActive && styles.segmentLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Screen */}
      <View style={styles.screenContainer}>{renderScreen()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
  },

  header: {
    backgroundColor: theme.card ?? "#1A2744",
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 10, // 👈 reduced for 5 tabs
    borderBottomWidth: 1,
    borderBottomColor: theme.border ?? "#243050",
    elevation: 4,
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: theme.background ?? "#0D1B2A",
    borderRadius: 12,
    padding: 4,
  },

  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8, // 👈 slightly reduced
    borderRadius: 8,
  },

  segmentActive: {
    backgroundColor: "#00E5A0",
  },

  segmentIcon: {
    fontSize: 14, // 👈 reduced for fit
  },

  segmentLabel: {
    fontSize: 10, // 👈 reduced for 5 tabs
    color: theme.subText ?? "#8896AA",
    fontWeight: "500",
  },

  segmentLabelActive: {
    color: "#0D1B2A",
    fontWeight: "700",
  },

  screenContainer: {
    flex: 1,
  },
});

export default ScanScreen;
