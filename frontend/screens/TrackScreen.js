import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

const TrackScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Track</Text>
      <Text style={styles.sub}>Charts coming next!</Text>
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
  title: { fontSize: 28, color: theme.primary, fontWeight: "bold" },
  sub: { color: theme.subText, marginTop: 8 },
});

export default TrackScreen;
