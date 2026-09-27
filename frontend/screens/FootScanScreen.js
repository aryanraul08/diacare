import React, { useState } from "react";
import { theme } from "../theme";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const MODEL_URL = "http://10.185.13.202:5001/predict";

const FootScanScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const [manualResult, setManualResult] = useState({
    fs: 70,
    os: 80,
    risk: "HIGH",
  });

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
      setResult(null);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery permission is required");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
      setResult(null);
    }
  };

  const analyzeFoot = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select a foot image first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", {
        uri: image,
        name: "foot.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post(MODEL_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      const scanResult = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        analysis: `
Status: ${data.status}
Risk: ${data.risk}
Confidence: ${data.confidence}%
Message: ${data.message}
        `,
        image: image,
      };

      setResult(scanResult);
      setScanHistory((prev) => [scanResult, ...prev]);
    } catch (err) {
      console.log("Error:", err.message);
      Alert.alert("Error", "Cannot connect to AI server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Foot Scan 🦶</Text>
      <Text style={styles.subtitle}>
        Upload or capture foot image for AI analysis
      </Text>

      {/* Image */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ fontSize: 40 }}>🦶</Text>
            <Text>No Image Selected</Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      {/* Manual Stats */}
      <View style={styles.manualBox}>
        <Text style={styles.manualTitle}>📊 Quick Stats</Text>

        <Text style={styles.manualText}>FS: {manualResult.fs}%</Text>
        <Text style={styles.manualText}>OS: {manualResult.os}%</Text>
        <Text style={styles.manualRisk}>RISK: {manualResult.risk}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={takePhoto}>
          <Text style={styles.btnText}>📷 Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={pickFromGallery}>
          <Text style={styles.btnText}>🖼 Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Analyze */}
      {image && (
        <TouchableOpacity
          style={styles.analyzeBtn}
          onPress={analyzeFoot}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.analyzeText}>🤖 Analyze Foot</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Result */}
      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Result</Text>
          <Text style={styles.resultText}>{result.analysis}</Text>
        </View>
      )}

      {/* History */}
      {scanHistory.length > 0 && (
        <View style={styles.history}>
          <Text style={styles.historyTitle}>History</Text>
          {scanHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <Image source={{ uri: item.image }} style={styles.historyImg} />
              <Text numberOfLines={2}>{item.analysis}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default FootScanScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, padding: 20 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primary,
    marginBottom: 5,
  },

  subtitle: {
    color: "#888",
    marginBottom: 15,
  },

  imageContainer: {
    height: 250,
    borderRadius: 12,
    backgroundColor: theme.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  btn: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: 12,
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#000",
    fontWeight: "bold",
  },

  analyzeBtn: {
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  analyzeText: {
    fontWeight: "bold",
    color: "#000",
  },
  manualBox: {
    backgroundColor: theme.card,
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  manualTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.primary,
    marginBottom: 8,
  },

  manualText: {
    color: "#ddd",
    fontSize: 14,
    marginBottom: 4,
  },

  manualRisk: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },

  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: theme.card,
    borderRadius: 10,
  },

  resultTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  resultText: {
    color: "#ddd",
  },

  history: {
    marginTop: 20,
  },

  historyTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  historyCard: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: theme.card,
    padding: 10,
    borderRadius: 10,
  },

  historyImg: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
});
