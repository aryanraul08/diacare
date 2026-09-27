import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StatCard = ({ label, value, unit, color = "#00E5A0" }) => (
  <View style={styles.card}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { color }]}>{value}</Text>
    <Text style={styles.unit}>{unit}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A2D42",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    flex: 1,
    margin: 6,
  },
  label: {
    color: "#7A9BB5",
    fontSize: 12,
    marginBottom: 6,
  },
  value: {
    fontSize: 26,
    fontWeight: "800",
  },
  unit: {
    color: "#7A9BB5",
    fontSize: 11,
    marginTop: 2,
  },
});

export default StatCard;
