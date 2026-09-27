import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../config";
import { theme } from "../theme";

const HomeScreen = ({ navigation }) => {
  const [sugarData, setSugarData] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [sugarRes, medicineRes, dietRes] = await Promise.all([
        axios.get(`${BASE_URL}/sugar`),
        axios.get(`${BASE_URL}/medicine`),
        axios.get(`${BASE_URL}/diet`),
      ]);
      setSugarData(sugarRes.data.data[0]);
      setMedicines(medicineRes.data.data);
      setDietLogs(dietRes.data.data);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const takenCount = medicines.filter((m) => m.taken).length;
  const totalMedicines = medicines.length;
  const todayFoods = dietLogs.length;
  const latestSugar = sugarData?.level ?? "--";
  const sugarStatus = sugarData?.status ?? "No data";

  const getSugarColor = (status) => {
    if (status === "High") return theme.danger;
    if (status === "Low") return theme.accent;
    return theme.success;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Loading your health data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.subtitle}>Here's your health summary</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchAllData}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Sugar Status Banner */}
        <View
          style={[
            styles.bannerCard,
            { borderLeftColor: getSugarColor(sugarStatus) },
          ]}
        >
          <View>
            <Text style={styles.bannerLabel}>Latest Sugar Level</Text>
            <Text
              style={[
                styles.bannerValue,
                { color: getSugarColor(sugarStatus) },
              ]}
            >
              {latestSugar} {latestSugar !== "--" ? "mg/dL" : ""}
            </Text>
          </View>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: getSugarColor(sugarStatus) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                { color: getSugarColor(sugarStatus) },
              ]}
            >
              {sugarStatus}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🩸</Text>
            <Text
              style={[styles.statValue, { color: getSugarColor(sugarStatus) }]}
            >
              {latestSugar}
            </Text>
            <Text style={styles.statLabel}>Sugar</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💊</Text>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {takenCount}/{totalMedicines}
            </Text>
            <Text style={styles.statLabel}>Medicines</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🥗</Text>
            <Text style={[styles.statValue, { color: theme.secondary }]}>
              {todayFoods}
            </Text>
            <Text style={styles.statLabel}>Foods</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🦶</Text>
            <Text style={[styles.statValue, { color: theme.accent }]}>
              Scan
            </Text>
            <Text style={styles.statLabel}>Foot</Text>
          </View>
        </View>

        {/* Medicine Progress */}
        {totalMedicines > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>💊 Medicine Progress</Text>
              <Text style={styles.progressCount}>
                {takenCount}/{totalMedicines} taken
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${
                      totalMedicines > 0
                        ? (takenCount / totalMedicines) * 100
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressSub}>
              {takenCount === totalMedicines
                ? "✅ All medicines taken today!"
                : `${totalMedicines - takenCount} medicines remaining`}
            </Text>
          </View>
        )}

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View
              style={[
                styles.activityDot,
                { backgroundColor: getSugarColor(sugarStatus) },
              ]}
            />
            <Text style={styles.activityText}>
              🩸 Sugar: {latestSugar} mg/dL — {sugarStatus}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.activityItem}>
            <View
              style={[styles.activityDot, { backgroundColor: theme.primary }]}
            />
            <Text style={styles.activityText}>
              💊 Medicines: {takenCount}/{totalMedicines} taken today
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.activityItem}>
            <View
              style={[styles.activityDot, { backgroundColor: theme.secondary }]}
            />
            <Text style={styles.activityText}>
              🥗 Foods logged today: {todayFoods}
            </Text>
          </View>
        </View>

        {/* Tips Card */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Daily Tip</Text>
          <Text style={styles.tipText}>
            Check your blood sugar before meals and 2 hours after eating to
            track how food affects your levels.
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: theme.primary,
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 24,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    color: theme.text,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: theme.subText,
    marginTop: 4,
  },
  refreshBtn: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 2,
  },
  refreshIcon: { fontSize: 20 },
  bannerCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  bannerLabel: {
    fontSize: 13,
    color: theme.subText,
    marginBottom: 6,
  },
  bannerValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  statusPillText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 17,
    color: theme.text,
    fontWeight: "bold",
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text,
  },
  statLabel: {
    fontSize: 13,
    color: theme.subText,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    color: theme.text,
    fontWeight: "bold",
  },
  progressCount: {
    fontSize: 14,
    color: theme.subText,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: theme.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.primary,
    borderRadius: 10,
  },
  progressSub: {
    fontSize: 13,
    color: theme.subText,
    marginTop: 8,
  },
  activityCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  activityText: {
    fontSize: 14,
    color: theme.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
  },
  tipCard: {
    backgroundColor: theme.primary + "15",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.primary + "40",
  },
  tipTitle: {
    fontSize: 15,
    color: theme.primary,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: theme.text,
    lineHeight: 22,
  },
});

export default HomeScreen;
