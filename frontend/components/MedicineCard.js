import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MedicineCard = ({ name, dose, time }) => {
  const [taken, setTaken] = useState(false);

  return (
    <View style={[styles.card, taken && styles.cardTaken]}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          {dose} · {time}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.btn, taken && styles.btnTaken]}
        onPress={() => setTaken(!taken)}
      >
        <Text style={styles.btnText}>{taken ? "✓ Done" : "Take"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A2D42",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTaken: {
    opacity: 0.5,
  },
  info: { flex: 1 },
  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  details: {
    color: "#7A9BB5",
    fontSize: 13,
    marginTop: 4,
  },
  btn: {
    backgroundColor: "#00E5A0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  btnTaken: {
    backgroundColor: "#1E4D3A",
  },
  btnText: {
    color: "#0D1B2A",
    fontWeight: "700",
    fontSize: 13,
  },
});

export default MedicineCard;
