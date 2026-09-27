import React, { createContext, useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup on unmount
  }, []);

  const register = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Save name to Firebase profile
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      setUser({ ...userCredential.user, displayName: name });
      return { success: true };
    } catch (err) {
      let message = "Registration failed";
      if (err.code === "auth/email-already-in-use")
        message = "Email already registered";
      if (err.code === "auth/weak-password")
        message = "Password must be at least 6 characters";
      if (err.code === "auth/invalid-email") message = "Invalid email address";
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      let message = "Login failed";
      if (err.code === "auth/user-not-found")
        message = "No account found with this email";
      if (err.code === "auth/wrong-password") message = "Incorrect password";
      if (err.code === "auth/invalid-email") message = "Invalid email address";
      if (err.code === "auth/invalid-credential")
        message = "Invalid email or password";
      return { success: false, message };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
