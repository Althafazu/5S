import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API_ENDPOINTS from "../../API_CONFIG";
import { useNavigation } from "@react-navigation/native";

export default function Penilaian() {
  const navigation = useNavigation();

  const [periode, setPeriode] = useState("2025-07");
  const [nilaiSeiri, setNilaiSeiri] = useState("");
  const [nilaiSeiton, setNilaiSeiton] = useState("");
  const [nilaiSeiso, setNilaiSeiso] = useState("");
  const [nilaiSeiketsu, setNilaiSeiketsu] = useState("");
  const [nilaiShitsuke, setNilaiShitsuke] = useState("");
  const [catatan, setCatatan] = useState("");

  const submitPenilaian = async () => {
    if (
      !nilaiSeiri ||
      !nilaiSeiton ||
      !nilaiSeiso ||
      !nilaiSeiketsu ||
      !nilaiShitsuke
    ) {
      Alert.alert("Validasi", "Semua nilai wajib diisi.");
      return;
    }

    const totalNilai =
      parseInt(nilaiSeiri) +
      parseInt(nilaiSeiton) +
      parseInt(nilaiSeiso) +
      parseInt(nilaiSeiketsu) +
      parseInt(nilaiShitsuke);

    const payload = {
      idPengguna: 1, // Ganti sesuai ID pengguna
      periode,
      nilaiSeiri: parseInt(nilaiSeiri),
      nilaiSeiton: parseInt(nilaiSeiton),
      nilaiSeiso: parseInt(nilaiSeiso),
      nilaiSeiketsu: parseInt(nilaiSeiketsu),
      nilaiShitsuke: parseInt(nilaiShitsuke),
      totalNilai,
      catatanPenilai: catatan,
      waktuPenilaian: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_ENDPOINTS.SAVE_PENILAIAN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const result = await response.json();
      console.log("RESPON PENYIMPANAN:", result);
      Alert.alert("Berhasil", "Penilaian berhasil dikirim.");

      // Reset form
      setNilaiSeiri("");
      setNilaiSeiton("");
      setNilaiSeiso("");
      setNilaiSeiketsu("");
      setNilaiShitsuke("");
      setCatatan("");
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Form Penilaian 5S</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* Spacer */}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Periode (YYYY-MM):</Text>
        <TextInput style={styles.input} value={periode} onChangeText={setPeriode} />

        <Text style={styles.label}>Nilai Seiri:</Text>
        <TextInput
          style={styles.input}
          value={nilaiSeiri}
          onChangeText={setNilaiSeiri}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nilai Seiton:</Text>
        <TextInput
          style={styles.input}
          value={nilaiSeiton}
          onChangeText={setNilaiSeiton}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nilai Seiso:</Text>
        <TextInput
          style={styles.input}
          value={nilaiSeiso}
          onChangeText={setNilaiSeiso}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nilai Seiketsu:</Text>
        <TextInput
          style={styles.input}
          value={nilaiSeiketsu}
          onChangeText={setNilaiSeiketsu}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Nilai Shitsuke:</Text>
        <TextInput
          style={styles.input}
          value={nilaiShitsuke}
          onChangeText={setNilaiShitsuke}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Catatan (opsional):</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={catatan}
          onChangeText={setCatatan}
          multiline
        />

        <View style={styles.buttonContainer}>
          <Button title="Kirim Penilaian" color="#2e86de" onPress={submitPenilaian} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  header: {
    backgroundColor: "#2e86de",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    backgroundColor: "#fafafa",
  },
  buttonContainer: {
    marginTop: 24,
    borderRadius: 8,
    overflow: "hidden",
  },
});
