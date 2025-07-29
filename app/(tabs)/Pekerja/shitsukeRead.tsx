import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_ENDPOINTS } from "../../API_CONFIG"; // Sesuaikan path jika perlu

export default function Shitsuke() {
  const [penilaian, setPenilaian] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchPenilaian = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ALL_PENILAIAN);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log("DATA PENILAIAN:", result);

      if (result.status === 200 && Array.isArray(result.data)) {
        setPenilaian(result.data);
      } else {
        setPenilaian([]);
        Alert.alert("Kosong", "Data penilaian tidak ditemukan.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal", "Tidak bisa mengambil data penilaian.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenilaian();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="event-note" size={20} color="#555" />
          <Text style={styles.cardDate}>
            {new Date(item.waktuPenilaian).toLocaleDateString("id-ID")}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{item.totalNilai}</Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.scoreList}>
        <Text style={styles.scoreItem}>Seiri: {item.nilaiSeiri}</Text>
        <Text style={styles.scoreItem}>Seiton: {item.nilaiSeiton}</Text>
        <Text style={styles.scoreItem}>Seiso: {item.nilaiSeiso}</Text>
        <Text style={styles.scoreItem}>Seiketsu: {item.nilaiSeiketsu}</Text>
        <Text style={styles.scoreItem}>Shitsuke: {item.nilaiShitsuke}</Text>
      </View>

      <View style={styles.cardContent}>
        <MaterialIcons
          name="comment"
          size={18}
          color="#777"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.commentText}>
          {item.catatanPenilai || (
            <Text style={styles.italic}>Tidak ada komentar</Text>
          )}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasil Penilaian Shitsuke</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ marginTop: 8, color: "#fff" }}>
            Memuat hasil penilaian...
          </Text>
        </View>
      ) : (
        <FlatList
          data={penilaian}
          keyExtractor={(item) => item.idPenilaian.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 16 }}>
              Belum ada penilaian.
            </Text>
          }
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8" },
  header: {
    backgroundColor: "#FFEAA7",
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
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDate: {
    marginLeft: 6,
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  scoreBox: {
    backgroundColor: "#007AFF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  scoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  scoreList: {
    marginBottom: 10,
  },
  scoreItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  commentText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  italic: { fontStyle: "italic", color: "#888" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
});
