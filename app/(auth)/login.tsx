import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login = () => {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement your login logic here
      // Example: await authService.login(username, password);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("Success", "Login Berhasil!");
      // TODO: Navigate to main app screen
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Login Gagal. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 40,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
      fontWeight: "500",
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
    },
    inputFocused: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    loginButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: 15,
      alignItems: "center",
      marginTop: 20,
      opacity: 1,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
    forgotPasswordContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    forgotPasswordText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 30,
    },
    signupText: {
      color: theme.colors.text,
      fontSize: 16,
    },
    signupLink: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Aplikasi 5S</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukan Username anda"
              placeholderTextColor={theme.colors.text + "80"}
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan Password anda"
              placeholderTextColor={theme.colors.text + "80"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            <Text style={styles.loginButtonText}>{isLoading ? "Signing In..." : "Sign In"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
