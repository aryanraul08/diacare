import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const getInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "?";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👤 Profile</Text>
        </View>

        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
          </View>
          <Text style={styles.userName}>
            {user?.displayName || "DiaCare User"}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>
              {user?.emailVerified ? "✅ Verified" : "⚠️ Not Verified"}
            </Text>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Account Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👤</Text>
            <View>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>
                {user?.displayName || "Not set"}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📧</Text>
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🔐</Text>
            <View>
              <Text style={styles.infoLabel}>Account ID</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {user?.uid?.substring(0, 16)}...
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>App Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💚</Text>
            <View>
              <Text style={styles.infoLabel}>App</Text>
              <Text style={styles.infoValue}>DiaCare v1.0</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🦅</Text>
            <View>
              <Text style={styles.infoLabel}>Team</Text>
              <Text style={styles.infoValue}>Red Falcon</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: theme.text,
    fontWeight: "bold",
  },
  avatarCard: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
    shadowColor: theme.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.subText,
    marginBottom: 12,
  },
  verifiedBadge: {
    backgroundColor: theme.success + "20",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  verifiedText: {
    fontSize: 13,
    color: theme.success,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardTitle: {
    fontSize: 15,
    color: theme.text,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 14,
  },
  infoIcon: { fontSize: 22 },
  infoLabel: {
    fontSize: 12,
    color: theme.subText,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: theme.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
  },
  logoutBtn: {
    backgroundColor: theme.danger + "12",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: theme.danger,
    marginBottom: 8,
  },
  logoutText: {
    color: theme.danger,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
