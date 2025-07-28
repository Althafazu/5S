import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useEffect } from 'react';

const { width, height } = Dimensions.get('window');

const methods = [
  { 
    id: "seiri", 
    title: "Seiri", 
    subtitle: "Sort / Pilah", 
    icon: "filter",
    colors: ["#FF6B6B", "#FF8E8E"],
    description: "Memisahkan barang yang diperlukan dari yang tidak diperlukan"
  },
  { 
    id: "seiton", 
    title: "Seiton", 
    subtitle: "Set in Order / Tata", 
    icon: "grid",
    colors: ["#4ECDC4", "#7EDDD8"],
    description: "Mengatur dan menyusun barang agar mudah digunakan"
  },
  { 
    id: "seiso", 
    title: "Seiso", 
    subtitle: "Shine / Bersih", 
    icon: "sparkles",
    colors: ["#45B7D1", "#74C7E3"],
    description: "Membersihkan tempat kerja dan peralatan"
  },
  { 
    id: "seiketsu", 
    title: "Seiketsu", 
    subtitle: "Standardize / Rawat", 
    icon: "shield-checkmark",
    colors: ["#96CEB4", "#B8DCC6"],
    description: "Mempertahankan kondisi yang telah dicapai"
  },
  { 
    id: "shitsuke", 
    title: "Shitsuke", 
    subtitle: "Sustain / Rajin", 
    icon: "refresh",
    colors: ["#FFEAA7", "#FFF2C7"],
    description: "Membiasakan diri melaksanakan 4S secara konsisten"
  },
];

// Component untuk method card dengan animasi
const AnimatedMethodCard = ({ method, index, onPress }: any) => {
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
    outputRange: ['0deg', '8deg'],
  });

  // Posisi melingkar
  const centerX = width / 2;
  const centerY = 180;
  const radius = 100;
  const angle = (index * 72) - 90; // 72 degrees apart (360/5)
  const x = centerX + radius * Math.cos((angle * Math.PI) / 180) - 45;
  const y = centerY + radius * Math.sin((angle * Math.PI) / 180) - 45;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: 90,
          height: 90,
          transform: [
            { scale: scaleAnim },
            { rotate: rotate },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={{ width: '100%', height: '100%' }}
      >
        <LinearGradient
          colors={method.colors}
          style={styles.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons 
            name={method.icon as any} 
            size={32} 
            color="#FFFFFF" 
          />
          <Text style={styles.circularTitle}>{method.title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Component untuk center logo
const CenterLogo = () => {
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

  return (
    <Animated.View
      style={[
        styles.centerLogo,
        {
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.centerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.centerText}>5S</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const theme = useTheme();

  const navigateToMethod = (methodId: string) => {
    router.push(`/${methodId}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Aplikasi 5S</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Sistem Informasi 5S untuk Meningkatkan Kualitas Lingkungan Kerja
          </Text>
        </View>
        
        {/* Circular Layout */}
        <View style={styles.circularContainer}>
          <CenterLogo />
          {methods.map((method, index) => (
            <AnimatedMethodCard
              key={method.id}
              method={method}
              index={index}
              onPress={() => navigateToMethod(method.id)}
            />
          ))}
        </View>

        {/* Detail Cards */}
        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Detail Metode 5S</Text>
          <View style={styles.methodsList}>
            {methods.map((method) => (
              <TouchableOpacity
                key={`detail-${method.id}`}
                style={styles.methodCard}
                onPress={() => navigateToMethod(method.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[...method.colors, method.colors[0] + '80']}
                  style={styles.methodGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.methodIcon}>
                    <Ionicons 
                      name={method.icon as any} 
                      size={28} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                    <Text style={styles.methodDescription}>{method.description}</Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={24} 
                    color="#FFFFFF" 
                    style={[styles.chevron, { opacity: 0.8 }]}
                  />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40, // Extra padding untuk mencegah konten terpotong
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  circularContainer: {
    height: 360,
    position: 'relative',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  gradientCard: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  circularTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
  },
  centerLogo: {
    position: 'absolute',
    top: 130,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    zIndex: 10,
  },
  centerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  methodsList: {
    gap: 16,
  },
  methodCard: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  methodGradient: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 6,
  },
  methodDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 16,
  },
  chevron: {
    marginLeft: 8,
  },
  detailSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});