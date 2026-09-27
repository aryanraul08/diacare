import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Switch,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../config";
import { theme } from "../theme";

const MedicineReminderScreen = () => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/medicine`);
      setMedicines(response.data.data);
    } catch (err) {
      Alert.alert("Error", "Could not fetch medicines");
    }
  };

  const handleAdd = async () => {
    if (!name || !dosage || !time) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/medicine`, { name, dosage, time });
      setName("");
      setDosage("");
      setTime("");
      fetchMedicines();
      Alert.alert("✅ Added!", "Medicine added successfully");
    } catch (err) {
      Alert.alert("Error", "Could not add medicine");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaken = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/medicine/${id}/taken`);
      fetchMedicines();
    } catch (err) {
      Alert.alert("Error", "Could not update");
    }
  };

  const toggleReminder = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/medicine/${id}/reminder`);
      fetchMedicines();
    } catch (err) {
      Alert.alert("Error", "Could not update reminder");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/medicine/${id}`);
      fetchMedicines();
    } catch (err) {
      Alert.alert("Error", "Could not delete");
    }
  };

  const takenCount = medicines.filter((m) => m.taken).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💊 Medicine Reminder</Text>
          <Text style={styles.subtitle}>
            {medicines.length > 0
              ? `${takenCount}/${medicines.length} taken today`
              : "No medicines added yet"}
          </Text>
        </View>

        {/* Progress Bar */}
        {medicines.length > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(takenCount / medicines.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {takenCount === medicines.length
                ? "✅ All done for today!"
                : `${medicines.length - takenCount} remaining`}
            </Text>
          </View>
        )}

        {/* Add Medicine Form */}
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>Add Medicine</Text>
          <TextInput
            style={styles.input}
            placeholder="Medicine name"
            placeholderTextColor={theme.subText}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Dosage (500mg)"
              placeholderTextColor={theme.subText}
              value={dosage}
              onChangeText={setDosage}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Time (8:00 AM)"
              placeholderTextColor={theme.subText}
              value={time}
              onChangeText={setTime}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAdd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Medicine</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Medicine List */}
        <Text style={styles.sectionTitle}>Your Medicines</Text>
        <FlatList
          data={medicines}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.medicineCard,
                item.taken && styles.medicineCardTaken,
              ]}
            >
              <View style={styles.medicineLeft}>
                <Text style={styles.medicineName}>{item.name}</Text>
                <Text style={styles.medicineSub}>
                  {item.dosage} • ⏰ {item.time}
                </Text>
                <View style={styles.reminderRow}>
                  <Text style={styles.reminderLabel}>🔔 Reminder</Text>
                  <Switch
                    value={item.reminderOn}
                    onValueChange={() => toggleReminder(item._id)}
                    trackColor={{
                      false: theme.border,
                      true: theme.primary,
                    }}
                    thumbColor={theme.card}
                  />
                </View>
              </View>
              <View style={styles.medicineRight}>
                <TouchableOpacity
                  style={[styles.takenBtn, item.taken && styles.takenBtnActive]}
                  onPress={() => toggleTaken(item._id)}
                >
                  <Text
                    style={[
                      styles.takenText,
                      item.taken && styles.takenTextActive,
                    ]}
                  >
                    {item.taken ? "✅ Taken" : "Mark Taken"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item._id)}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💊</Text>
              <Text style={styles.emptyText}>No medicines added yet!</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: theme.text,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: theme.subText,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 2,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: theme.border,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.primary,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 13,
    color: theme.subText,
  },
  inputCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardTitle: {
    fontSize: 16,
    color: theme.text,
    fontWeight: "bold",
    marginBottom: 14,
  },
  input: {
    backgroundColor: theme.background,
    color: theme.text,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  rowInputs: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 17,
    color: theme.text,
    fontWeight: "bold",
    marginBottom: 12,
  },
  medicineCard: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  medicineCardTaken: {
    borderColor: theme.success,
    backgroundColor: theme.success + "10",
  },
  medicineLeft: { flex: 1 },
  medicineName: {
    color: theme.text,
    fontSize: 17,
    fontWeight: "bold",
  },
  medicineSub: {
    color: theme.subText,
    fontSize: 13,
    marginTop: 4,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  reminderLabel: {
    color: theme.subText,
    fontSize: 13,
    marginRight: 8,
  },
  medicineRight: {
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: 10,
  },
  takenBtn: {
    borderWidth: 1.5,
    borderColor: theme.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  takenBtnActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  takenText: {
    color: theme.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  takenTextActive: { color: "#fff" },
  deleteBtn: { padding: 4 },
  deleteText: { fontSize: 20 },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: theme.subText,
    fontSize: 15,
  },
});

export default MedicineReminderScreen;
