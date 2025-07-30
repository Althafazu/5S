import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from "react-native";

export default function Seiton() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  const fetchLogPenyimpanan = async () => {
    try {
      const response = await fetch("https://your-api.com/api/seiton", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YOUR_ACCESS_TOKEN`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Gagal memuat data:", error);
      Alert.alert("Gagal", "Tidak dapat mengambil data penyimpanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogPenyimpanan();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Memuat log penyimpanan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Penyimpanan</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Nama Barang:</Text>
            <Text>{item.nama_barang}</Text>

            <Text style={styles.label}>Lokasi Simpan:</Text>
            <Text>{item.lokasi_simpan}</Text>

            <Text style={styles.label}>Waktu Simpan:</Text>
            <Text>{new Date(item.waktu_simpan).toLocaleString()}</Text>

            {item.keterangan ? (
              <>
                <Text style={styles.label}>Keterangan:</Text>
                <Text>{item.keterangan}</Text>
              </>
            ) : null}
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: "center" }}>Tidak ada data log penyimpanan.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  label: {
    fontWeight: "600",
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
