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

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

const DietCheckerScreen = () => {
  const [foodName, setFoodName] = useState("");
  const [glycemicIndex, setGlycemicIndex] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/diet`);
      setLogs(response.data.data);
    } catch (err) {
      Alert.alert("Error", "Could not fetch diet logs");
    }
  };

  const handleSubmit = async () => {
    if (!foodName || !glycemicIndex) {
      Alert.alert("Error", "Please enter food name and GI value");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/diet`, {
        foodName,
        glycemicIndex: Number(glycemicIndex),
        calories: Number(calories),
        mealType,
      });
      setFoodName("");
      setGlycemicIndex("");
      setCalories("");
      fetchLogs();
      Alert.alert("✅ Logged!", "Food entry saved");
    } catch (err) {
      Alert.alert("Error", "Could not save food entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/diet/${id}`);
      fetchLogs();
    } catch (err) {
      Alert.alert("Error", "Could not delete");
    }
  };

  const getCategoryColor = (category) => {
    if (category === "Avoid") return theme.danger;
    if (category === "Moderate") return theme.accent;
    return theme.success;
  };

  const totalCalories = logs.reduce(
    (sum, item) => sum + (item.calories || 0),
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🥗 Diet Checker</Text>
          <Text style={styles.subtitle}>
            {totalCalories > 0
              ? `${totalCalories} calories today`
              : "Track your food intake"}
          </Text>
        </View>

        {/* Input Form */}
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>Log Food</Text>
          <TextInput
            style={styles.input}
            placeholder="Food name"
            placeholderTextColor={theme.subText}
            value={foodName}
            onChangeText={setFoodName}
          />
          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="GI Value"
              placeholderTextColor={theme.subText}
              value={glycemicIndex}
              onChangeText={setGlycemicIndex}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Calories"
              placeholderTextColor={theme.subText}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>

          {/* Meal Type Selector */}
          <View style={styles.mealRow}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealBtn,
                  mealType === type && styles.mealBtnActive,
                ]}
                onPress={() => setMealType(type)}
              >
                <Text
                  style={[
                    styles.mealBtnText,
                    mealType === type && styles.mealBtnTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log Food</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Food Log */}
        <Text style={styles.sectionTitle}>Today's Food Log</Text>
        <FlatList
          data={logs}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.logCard}>
              <View
                style={[
                  styles.categoryBar,
                  { backgroundColor: getCategoryColor(item.category) },
                ]}
              />
              <View style={styles.logContent}>
                <Text style={styles.foodName}>{item.foodName}</Text>
                <Text style={styles.foodSub}>
                  GI: {item.glycemicIndex}
                  {item.calories ? ` • ${item.calories} cal` : ""}
                  {` • ${item.mealType}`}
                </Text>
                <View
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: getCategoryColor(item.category) + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: getCategoryColor(item.category) },
                    ]}
                  >
                    {item.category}
                  </Text>
                </View>
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
              <Text style={styles.emptyIcon}>🥗</Text>
              <Text style={styles.emptyText}>No food logged yet today!</Text>
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
  rowInputs: {
    flexDirection: "row",
  },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  mealBtn: {
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: 8,
    paddingVertical: 8,
    flex: 1,
    marginHorizontal: 3,
    alignItems: "center",
  },
  mealBtnActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  mealBtnText: {
    color: theme.subText,
    fontSize: 11,
    fontWeight: "500",
  },
  mealBtnTextActive: {
    color: "#fff",
    fontWeight: "bold",
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
  categoryBar: {
    width: 5,
    height: "100%",
    borderRadius: 4,
    marginRight: 14,
    minHeight: 50,
  },
  logContent: { flex: 1 },
  foodName: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  foodSub: {
    color: theme.subText,
    fontSize: 13,
    marginTop: 4,
  },
  categoryPill: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteBtn: { padding: 8 },
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

export default DietCheckerScreen;
