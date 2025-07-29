import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
 import { API_ENDPOINTS } from "../../API_CONFIG"; // sesuaikan path-nya
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Seiton() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


const fetchLogs = async () => {
  try {
    setLoading(true);
    
    // const id_pengguna = await AsyncStorage.getItem("id");
    const id_pengguna = "1";
    console.log(id_pengguna);
    if (!id_pengguna) throw new Error("ID pengguna tidak ditemukan");

    const response = await fetch(API_ENDPOINTS.GET_PENYIMPANAN_BY_SEARCH(id_pengguna));
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);


    const json = await response.json();

    console.log(json);
    // Pastikan backend return { data: [...] }
    setLogs(json.data);
  } catch (error) {
    console.error(error);
    Alert.alert("Gagal", "Tidak bisa mengambil data penyimpanan.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchLogs();
  }, []);

const renderItem = ({ item }: { item: any }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <MaterialCommunityIcons name="tools" size={20} color="#333" />
      <Text style={styles.cardTitle}>{item.namaBarang}</Text>
    </View>

    <View style={styles.cardInfo}>
      <Ionicons name="location-outline" size={16} color="#007AFF" />
      <Text style={styles.cardText}>{item.namaZona}</Text>
    </View>

    <View style={styles.cardInfo}>
      <Ionicons name="time-outline" size={16} color="#007AFF" />
      <Text style={styles.cardText}>
        {new Date(item.waktuLog).toLocaleString("id-ID")}
      </Text>
    </View>

    <View style={styles.cardInfo}>
      <Ionicons name="document-text-outline" size={16} color="#007AFF" />
      <Text style={styles.cardText}>{item.keterangan || "-"}</Text>
    </View>
  </View>
);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Penyimpanan (Seiton)</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 8 }}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
  data={logs}
  keyExtractor={(item) => item.id_log?.toString() ?? Math.random().toString()}
  renderItem={renderItem}
  contentContainerStyle={{ padding: 16 }}
  ListEmptyComponent={
    <Text style={{ textAlign: "center", marginTop: 20 }}>
      Tidak ada log penyimpanan.
    </Text>
  }
/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8" },
  header: {
    backgroundColor: "#4ECDC4",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  cardText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
  },
});
