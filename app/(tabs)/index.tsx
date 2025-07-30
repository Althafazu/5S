import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "../utils/CustomAlert";

const { width, height } = Dimensions.get("window");

// User roles enum
export enum UserRole {
  PEKERJA = "pekerja",
  SUPERVISOR = "supervisor",
}

// User interface
interface StoredUserData {
  username: string;
  role: UserRole;
  password: string;
}

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: "@user_data",
  IS_LOGGED_IN: "@is_logged_in",
};

const methods = [
  {
    id: "seiri",
    title: "Seiri",
    subtitle: "Sort / Pilah",
    icon: "filter",
    colors: ["#FF6B6B", "#FF8E8E"],
    allowedRoles: [UserRole.PEKERJA],
  },
  { 
    id: "Pekerja/seitonRead", 
    title: "Seiton", 
    subtitle: "Set in Order / Tata", 
    icon: "grid",
    colors: ["#4ECDC4", "#7EDDD8"],
    allowedRoles: [UserRole.PEKERJA],
  },
  {
    id: "seiso",
    title: "Seiso",
    subtitle: "Shine / Bersih",
    icon: "sparkles",
    colors: ["#45B7D1", "#74C7E3"],
    allowedRoles: [UserRole.PEKERJA, UserRole.SUPERVISOR],
  },
  {
    id: "seiketsu",
    title: "Seiketsu",
    subtitle: "Standardize / Rawat",
    icon: "help",
    colors: ["#96CEB4", "#B8DCC6"],
    allowedRoles: [UserRole.PEKERJA],
  },
  { 
    id: "Pekerja/shitsukeRead", 
    title: "Shitsuke", 
    subtitle: "Sustain / Rajin", 
    icon: "refresh",
    colors: ["#FFEAA7", "#FFF2C7"],
    allowedRoles: [UserRole.PEKERJA]
  },
    { 
    id: "Supervisor/shitsukeCreate", 
    title: "Shitsuke", 
    subtitle: "Sustain / Rajin", 
    icon: "refresh",
    colors: ["#FFEAA7", "#FFF2C7"],
    allowedRoles: [UserRole.SUPERVISOR]
  },
  // {
  //   id: "temuan",
  //   title: "Temuan",
  //   subtitle: "Form Temuan",
  //   icon: "camera",
  //   colors: ["#DDA0DD", "#E6B8E6"],
  //   allowedRoles: [UserRole.PEKERJA, UserRole.SUPERVISOR],
  // },
];

// AsyncStorage utility functions
const getUserData = async (): Promise<StoredUserData | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);

    if (userData && isLoggedIn === "true") {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    await AsyncStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    console.log("User data cleared from AsyncStorage");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};

// Component untuk method card dengan animasi
const AnimatedMethodCard = ({ method, index, onPress, totalMethods }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "8deg"],
  });

  // Posisi melingkar - adjust based on total methods
  const centerX = width / 2;
  const centerY = 200;
  const radius = 110;
  const angleStep = 360 / totalMethods;
  const angle = index * angleStep - 90;
  const x = centerX + radius * Math.cos((angle * Math.PI) / 180) - 45;
  const y = centerY + radius * Math.sin((angle * Math.PI) / 180) - 45;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: 90,
          height: 90,
          transform: [{ scale: scaleAnim }, { rotate: rotate }],
        },
      ]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={{ width: "100%", height: "100%" }}>
        <LinearGradient colors={method.colors} style={styles.gradientCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name={method.icon as any} size={28} color="#FFFFFF" />
          <Text style={styles.circularTitle}>{method.title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Component untuk center logo dengan role-based color
const CenterLogo = ({ userRole }: { userRole?: UserRole }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const getRoleColors = (role?: UserRole) => {
    switch (role) {
      case UserRole.PEKERJA:
        return ["#667eea", "#764ba2"];
      case UserRole.SUPERVISOR:
        return ["#f093fb", "#f5576c"];
      default:
        return ["#667eea", "#764ba2"];
    }
  };

  return (
    <Animated.View
      style={[
        styles.centerLogo,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}>
      <LinearGradient
        colors={getRoleColors(userRole)}
        style={styles.centerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.centerText}>5S</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// User info component
const UserInfo = ({ user, onLogout }: { user: StoredUserData | null; onLogout: () => void }) => {
  if (!user) return null;

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.PEKERJA:
        return "Pekerja";
      case UserRole.SUPERVISOR:
        return "Supervisor";
      default:
        return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.PEKERJA:
        return "#667eea";
      case UserRole.SUPERVISOR:
        return "#f093fb";
      default:
        return "#667eea";
    }
  };

  return (
    <View style={styles.userInfo}>
      <View style={styles.userDetails}>
        <View style={[styles.userAvatar, { backgroundColor: getRoleColor(user.role) }]}>
          <Ionicons name="person" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.userTextInfo}>
          <Text style={styles.userName}>Selamat datang, {user.username}</Text>
          <Text style={styles.userRole}>{getRoleDisplayName(user.role)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ff4757" />
      </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen() {
  const theme = useTheme();
  const [user, setUser] = useState<StoredUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        setUser(userData);
      }
      // Don't navigate automatically - let user manually go to login if needed
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    CustomAlert.warning("Logout", "Apakah Anda yakin ingin logout?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await clearUserData();
            setUser(null); // Clear user state instead of navigating
          } catch (error) {
            Alert.alert("Error", "Gagal logout. Coba lagi.");
          }
        },
      },
    ]);
  };

  const handleGoToLogin = () => {
    try {
      router.push("/login");
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Error", "Tidak dapat membuka halaman login");
    }
  };

  const navigateToMethod = (methodId: string) => {
    router.push(`/(tabs)/${methodId}` as any);
  };

  const hasAccess = (method: any) => {
    return user && method.allowedRoles.includes(user.role);
  };

  // Filter methods based on user role
  const accessibleMethods = methods.filter((method) => hasAccess(method));

  const getRoleSpecificTitle = (role?: UserRole) => {
    switch (role) {
      case UserRole.PEKERJA:
        return "Dashboard Pekerja";
      case UserRole.SUPERVISOR:
        return "Dashboard Supervisor";
      default:
        return "Aplikasi 5S";
    }
  };

  // Show loading while checking user data
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={40} color="#667eea" />
          <Text style={styles.loadingText}>Memuat data pengguna...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no user data, show login prompt
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginPromptContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>5S</Text>
          </View>
          <Text style={styles.promptTitle}>Aplikasi 5S</Text>
          <Text style={styles.promptSubtitle}>Silakan login untuk mengakses aplikasi</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleGoToLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        {/* User Info */}
        <UserInfo user={user} onLogout={handleLogout} />

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{getRoleSpecificTitle(user?.role)}</Text>
        </View>

        {/* Circular Layout */}
        {accessibleMethods.length > 0 && (
          <View style={styles.circularContainer}>
            <CenterLogo userRole={user?.role} />
            {accessibleMethods.map((method, index) => (
              <AnimatedMethodCard
                key={method.id}
                method={method}
                index={index}
                totalMethods={accessibleMethods.length}
                onPress={() => navigateToMethod(method.id)}
              />
            ))}
          </View>
        )}

        {/* No access message */}
        {accessibleMethods.length === 0 && (
          <View style={styles.noAccessContainer}>
            <Ionicons name="lock-closed" size={60} color="#ccc" />
            <Text style={styles.noAccessTitle}>Tidak Ada Akses</Text>
            <Text style={styles.noAccessText}>Role Anda tidak memiliki akses ke metode 5S.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#667eea",
  },
  promptTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  promptSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667eea",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff5f5",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  circularContainer: {
    height: 400,
    position: "relative",
    backgroundColor: "transparent",
  },
  gradientCard: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  circularTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 4,
  },
  centerLogo: {
    position: "absolute",
    top: 150,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    zIndex: 10,
  },
  centerGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  centerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noAccessTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
    marginTop: 16,
    marginBottom: 8,
  },
  noAccessText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
