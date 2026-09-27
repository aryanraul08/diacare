import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (!isLogin && !name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const result = isLogin
        ? await login(email.trim(), password)
        : await register(name.trim(), email.trim(), password);

      if (!result.success) {
        Alert.alert("Error", result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>💚</Text>
            </View>
            <Text style={styles.appName}>DiaCare</Text>
            <Text style={styles.tagline}>Your diabetes companion</Text>
          </View>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, isLogin && styles.toggleBtnActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text
                style={[styles.toggleText, isLogin && styles.toggleTextActive]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text
                style={[styles.toggleText, !isLogin && styles.toggleTextActive]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.subText}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.subText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Min 6 characters"
                  placeholderTextColor={theme.subText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {isLogin ? "🔐 Login" : "🚀 Create Account"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Switch mode */}
            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Text style={styles.switchBold}>
                  {isLogin ? "Sign Up" : "Login"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>🦅 Team Red Falcon — DiaCare </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    paddingTop: 48,
    marginBottom: 32,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: theme.primary + "40",
    elevation: 4,
    shadowColor: theme.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoEmoji: { fontSize: 44 },
  appName: {
    fontSize: 34,
    fontWeight: "bold",
    color: theme.text,
    letterSpacing: 1,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: theme.subText,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: theme.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleBtnActive: {
    backgroundColor: theme.card,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  toggleText: {
    fontSize: 15,
    color: theme.subText,
    fontWeight: "500",
  },
  toggleTextActive: {
    color: theme.primary,
    fontWeight: "bold",
  },
  formCard: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 24,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    color: theme.text,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.background,
    color: theme.text,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eyeBtn: {
    padding: 14,
    backgroundColor: theme.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  eyeIcon: { fontSize: 18 },
  submitBtn: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    elevation: 3,
    shadowColor: theme.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    color: theme.subText,
    fontSize: 14,
  },
  switchBtn: {
    alignItems: "center",
    padding: 8,
  },
  switchText: {
    fontSize: 14,
    color: theme.subText,
  },
  switchBold: {
    color: theme.primary,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: theme.subText,
    fontSize: 12,
  },
});

export default LoginScreen;
