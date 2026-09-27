import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PrimaryButton = ({ title, onPress, style }) => (
  <TouchableOpacity
    style={[styles.btn, style]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#00E5A0",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: "#0D1B2A",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default PrimaryButton;
