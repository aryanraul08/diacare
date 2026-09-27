import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";

import ScanScreen from "./screens/ScanScreen";
import TrackScreen from "./screens/TrackScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import SplashScreen from "./screens/SplashScreen";
import NearbyHospitalsScreen from "./screens/NearbyHospitalsScreen";
import HomeScreen from "./screens/HomeScreen";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, label, focused }) => (
  <View style={{ alignItems: "center", justifyContent: "center", width: 60 }}>
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={20}
      color={focused ? theme.primary : theme.subText}
    />
    <Text
      numberOfLines={1}
      ellipsizeMode="clip"
      style={{
        fontSize: 9,
        marginTop: 2,
        color: focused ? theme.primary : theme.subText,
        fontWeight: focused ? "600" : "400",
        textAlign: "center",
        width: 60,
      }}
    >
      {label}
    </Text>
  </View>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            borderTopWidth: 1,
            height: 62,
            paddingBottom: 6,
            paddingTop: 4,
            paddingHorizontal: 0,
            elevation: 10,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 10,
          },
          tabBarItemStyle: {
            paddingVertical: 0,
            flex: 1,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home" label="Home" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="scan" label="Scan" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Track"
          component={TrackScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="bar-chart" label="Track" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="person" label="Profile" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
