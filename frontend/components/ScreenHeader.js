import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ScreenHeader = ({ title, subtitle }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  header: {
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#0D1B2A",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#7A9BB5",
    fontSize: 13,
    marginTop: 4,
  },
});

export default ScreenHeader;
