import React, { useState, useEffect } from "react";
import { theme } from "../theme";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const NearbyHospitalsScreen = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Nearby", "Top Rated"];

  useEffect(() => {
    getLocationAndHospitals();
  }, []);

  const getLocationAndHospitals = async () => {
    try {
      setLoading(true);

      // Ask for location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is needed to find nearby hospitals",
        );
        setLoading(false);
        return;
      }

      // Get current location
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // Using Overpass API (OpenStreetMap) — 100% free!
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:5000,${latitude},${longitude});
          way["amenity"="hospital"](around:5000,${latitude},${longitude});
          node["amenity"="clinic"](around:5000,${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "text/plain" } },
      );

      // Filter only elements with names
      const results = response.data.elements
        .filter((el) => el.tags && el.tags.name)
        .map((el) => ({
          id: el.id.toString(),
          name: el.tags.name,
          address: el.tags["addr:street"]
            ? `${el.tags["addr:street"]} ${el.tags["addr:city"] || ""}`
            : "Address not available",
          phone: el.tags.phone || el.tags["contact:phone"] || null,
          emergency: el.tags.emergency === "yes",
          lat: el.lat || el.center?.lat,
          lng: el.lon || el.center?.lon,
          type: el.tags.amenity === "hospital" ? "Hospital" : "Clinic",
        }));

      setHospitals(results);
    } catch (err) {
      Alert.alert("Error", "Could not fetch nearby hospitals");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openDirections = (hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
    Linking.openURL(url);
  };

  const callHospital = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert("Not Available", "No phone number listed for this hospital");
    }
  };

  const callEmergency = () => {
    Alert.alert("🚨 Emergency Call", "Call 108 (Ambulance)?", [
      { text: "Cancel", style: "cancel" },
      { text: "Call Now", onPress: () => Linking.openURL("tel:108") },
    ]);
  };

  const getFilteredHospitals = () => {
    if (filter === "Nearby") return hospitals.slice(0, 5);
    if (filter === "Top Rated") return hospitals.filter((h) => h.emergency);
    return hospitals;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#theme.primary" />
        <Text style={styles.loadingText}>Finding hospitals near you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Hospitals 🏥</Text>

      {/* Emergency SOS Button */}
      <TouchableOpacity style={styles.sosButton} onPress={callEmergency}>
        <Text style={styles.sosText}>🚨 EMERGENCY — Call 108</Text>
      </TouchableOpacity>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Count */}
      <Text style={styles.countText}>
        {getFilteredHospitals().length} hospitals found near you
      </Text>

      {/* Hospital List */}
      <FlatList
        data={getFilteredHospitals()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.hospitalCard}>
            <View style={styles.hospitalInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.hospitalName}>{item.name}</Text>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        item.type === "Hospital" ? "#theme.primary" : "#FFB800",
                    },
                  ]}
                >
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
              </View>
              <Text style={styles.hospitalAddress}>📍 {item.address}</Text>
              {item.emergency && (
                <Text style={styles.emergencyText}>
                  🚨 Emergency Services Available
                </Text>
              )}
              {item.phone && (
                <Text style={styles.phoneText}>📞 {item.phone}</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.directionBtn}
                onPress={() => openDirections(item)}
              >
                <Text style={styles.directionText}>📍 Go</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => callHospital(item.phone)}
              >
                <Text style={styles.callText}>📞 Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏥</Text>
            <Text style={styles.emptyText}>No hospitals found nearby</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={getLocationAndHospitals}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Emergency Numbers */}
      <View style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>Emergency Numbers 🆘</Text>
        <View style={styles.emergencyRow}>
          {[
            { label: "Ambulance", number: "108" },
            { label: "Police", number: "100" },
            { label: "Fire", number: "101" },
          ].map((e) => (
            <TouchableOpacity
              key={e.number}
              style={styles.emergencyBtn}
              onPress={() => Linking.openURL(`tel:${e.number}`)}
            >
              <Text style={styles.emergencyNumber}>{e.number}</Text>
              <Text style={styles.emergencyLabel}>{e.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#theme.background", padding: 20 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#theme.background",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#theme.primary", marginTop: 16, fontSize: 16 },
  title: {
    fontSize: 24,
    color: "#theme.primary",
    fontWeight: "bold",
    marginBottom: 16,
  },
  sosButton: {
    backgroundColor: "#theme.danger",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  sosText: { color: "#theme.text", fontWeight: "bold", fontSize: 18 },
  filterRow: { flexDirection: "row", marginBottom: 12 },
  filterBtn: {
    borderWidth: 1,
    borderColor: "#theme.primary",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    paddingHorizontal: 14,
  },
  filterBtnActive: { backgroundColor: "#theme.primary" },
  filterText: { color: "#theme.primary", fontSize: 13 },
  filterTextActive: { color: "#000", fontWeight: "bold" },
  countText: { color: "#theme.subText", fontSize: 13, marginBottom: 12 },
  hospitalCard: {
    backgroundColor: "#theme.card",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hospitalInfo: { flex: 1, marginRight: 10 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  hospitalName: {
    color: "#theme.text",
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
  },
  typeBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  typeText: { fontSize: 10, fontWeight: "bold", color: "#000" },
  hospitalAddress: { color: "#theme.subText", fontSize: 13, marginTop: 4 },
  emergencyText: { color: "#theme.danger", fontSize: 12, marginTop: 4 },
  phoneText: { color: "#aaa", fontSize: 12, marginTop: 4 },
  actionButtons: { justifyContent: "space-around" },
  directionBtn: {
    backgroundColor: "#theme.primary",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginBottom: 6,
  },
  directionText: { color: "#000", fontWeight: "bold", fontSize: 12 },
  callBtn: {
    backgroundColor: "#theme.card",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#theme.primary",
    padding: 8,
    alignItems: "center",
  },
  callText: { color: "#theme.primary", fontWeight: "bold", fontSize: 12 },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: "#555", fontSize: 16, marginBottom: 16 },
  retryBtn: {
    backgroundColor: "#theme.primary",
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 24,
  },
  retryText: { color: "#000", fontWeight: "bold" },
  emergencyCard: {
    backgroundColor: "#theme.card",
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  emergencyTitle: {
    color: "#theme.text",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
  },
  emergencyRow: { flexDirection: "row", justifyContent: "space-around" },
  emergencyBtn: {
    alignItems: "center",
    backgroundColor: "#theme.danger",
    borderRadius: 10,
    padding: 12,
    width: "28%",
  },
  emergencyNumber: { color: "#theme.text", fontSize: 20, fontWeight: "bold" },
  emergencyLabel: { color: "#theme.text", fontSize: 11, marginTop: 4 },
});

export default NearbyHospitalsScreen;
