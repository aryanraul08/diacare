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
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../config";
import { theme } from "../theme";

const SugarTrackerScreen = () => {
  const [level, setLevel] = useState("");
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sugar`);
      setLogs(response.data.data);
    } catch (err) {
      Alert.alert("Error", "Could not fetch sugar logs");
    }
  };

  const handleSubmit = async () => {
    if (!level) {
      Alert.alert("Error", "Please enter sugar level");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/sugar`, {
        level: Number(level),
        note,
      });
      setLevel("");
      setNote("");
      fetchLogs();
      Alert.alert("✅ Saved!", "Sugar level recorded");
    } catch (err) {
      Alert.alert("Error", "Could not save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/sugar/${id}`);
      fetchLogs();
    } catch (err) {
      Alert.alert("Error", "Could not delete");
    }
  };

  const getStatusColor = (status) => {
    if (status === "High") return theme.danger;
    if (status === "Low") return theme.accent;
    return theme.success;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🩸 Sugar Tracker</Text>
          <Text style={styles.subtitle}>Log and monitor your blood sugar</Text>
        </View>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>Add New Reading</Text>
          <TextInput
            style={styles.input}
            placeholder="Sugar level (mg/dL)"
            placeholderTextColor={theme.subText}
            value={level}
            onChangeText={setLevel}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Add a note (optional)"
            placeholderTextColor={theme.subText}
            value={note}
            onChangeText={setNote}
          />

          {/* Live Preview */}
          {level !== "" && (
            <View
              style={[
                styles.previewPill,
                {
                  backgroundColor:
                    getStatusColor(
                      Number(level) > 140
                        ? "High"
                        : Number(level) < 70
                          ? "Low"
                          : "Normal",
                    ) + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.previewText,
                  {
                    color: getStatusColor(
                      Number(level) > 140
                        ? "High"
                        : Number(level) < 70
                          ? "Low"
                          : "Normal",
                    ),
                  },
                ]}
              >
                {Number(level) > 140
                  ? "⚠️ High"
                  : Number(level) < 70
                    ? "⚠️ Low"
                    : "✅ Normal"}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Reading</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* History */}
        <Text style={styles.sectionTitle}>History</Text>
        <FlatList
          data={logs}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.logCard}>
              <View
                style={[
                  styles.levelIndicator,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
              <View style={styles.logContent}>
                <Text
                  style={[
                    styles.levelText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.level} mg/dL
                </Text>
                <Text style={styles.statusText}>{item.status}</Text>
                {item.note ? (
                  <Text style={styles.noteText}>📝 {item.note}</Text>
                ) : null}
                <Text style={styles.dateText}>
                  📅 {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item._id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🩸</Text>
              <Text style={styles.emptyText}>
                No readings yet. Add your first one!
              </Text>
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
    marginBottom: 20,
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
  previewPill: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  previewText: {
    fontWeight: "bold",
    fontSize: 14,
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
  logCard: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  levelIndicator: {
    width: 5,
    height: "100%",
    borderRadius: 4,
    marginRight: 14,
    minHeight: 50,
  },
  logContent: { flex: 1 },
  levelText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statusText: {
    color: theme.subText,
    fontSize: 13,
    marginTop: 2,
  },
  noteText: {
    color: theme.subText,
    fontSize: 13,
    marginTop: 4,
  },
  dateText: {
    color: theme.border,
    fontSize: 12,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
  },
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
    textAlign: "center",
  },
});

export default SugarTrackerScreen;
