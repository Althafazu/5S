import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from "../utils/CustomAlert";

// User roles enum
export enum UserRole {
  PEKERJA = 'pekerja',
  SUPERVISOR = 'supervisor'
}

interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  username: string;
  password: string;
}

// Simplified user data for AsyncStorage
interface StoredUserData {
  username: string;
  role: UserRole;
  password: string;
}

// AsyncStorage keys
const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  IS_LOGGED_IN: '@is_logged_in'
};

// Dummy user data
const dummyUsers: User[] = [
  {
    id: '1',
    username: 'pekerja',
    password: '123',
    name: 'Ahmad Pekerja',
    role: UserRole.PEKERJA,
    department: 'Production'
  },
  {
    id: '2',
    username: 'supervisor',
    password: '123',
    name: 'Budi Supervisor',
    role: UserRole.SUPERVISOR,
    department: 'Quality Control'
  }
];

// AsyncStorage utility functions
const saveUserData = async (userData: StoredUserData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    console.log('User data saved to AsyncStorage:', userData);
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

const getUserData = async (): Promise<StoredUserData | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    
    if (userData && isLoggedIn === 'true') {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  // Check if user is already logged in when component mounts
  useEffect(() => {
    checkExistingLogin();
  }, []);

  const checkExistingLogin = async () => {
    try {
      setIsCheckingStorage(true);
      const existingUser = await getUserData();
      
      if (existingUser) {
        console.log('Found existing user:', existingUser);
        router.replace("/(tabs)"); // Navigate to home/tabs
      }
    } catch (error) {
      console.error('Error checking existing login:', error);
    } finally {
      setIsCheckingStorage(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      CustomAlert.error("Error", "Mohon isi semua field");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = dummyUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (user) {
        const userDataToSave: StoredUserData = {
          username: user.username,
          role: user.role,
          password: user.password
        };

        await saveUserData(userDataToSave);

        CustomAlert.success(
          "Login Berhasil", 
          `Selamat datang ${user.name}`,
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/(tabs)"); // Navigate to home/tabs
              }
            }
          ]
        );
      } else {
        CustomAlert.error("Login Gagal", "Username atau password salah!");
      }
    } catch (error) {
      console.error('Login error:', error);
      CustomAlert.error("Error", "Login Gagal. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStorage) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Memeriksa status login...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Aplikasi 5S</Text>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Masukan username anda"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="Masukkan password anda"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Masuk..." : "Masuk"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;