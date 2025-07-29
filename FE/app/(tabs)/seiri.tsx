import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Tipe data untuk barang
interface Barang {
  id: number;
  nama_barang: string;
  id_pengguna: number;
  id_departemen: number;
  jenis_kepemilikan: string;
  qty: number;
  status_penggunaan: string;
  alasan_tidak_dipakai?: string;
  tindak_lanjut?: string;
}

// Tipe untuk data user dari AsyncStorage
interface StoredUserData {
  username: string;
  role: string;
  password: string;
  id: number;
}

export default function Seiri() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data for demonstration
  const dummyBarang: Barang[] = [
    {
      id: 1,
      nama_barang: "Monitor LG 24 inch",
      id_pengguna: 1,
      id_departemen: 1,
      jenis_kepemilikan: "perusahaan",
      qty: 3,
      status_penggunaan: "dipakai",
    },
    {
      id: 2,
      nama_barang: "Keyboard Mechanical",
      id_pengguna: 1,
      id_departemen: 1,
      jenis_kepemilikan: "perusahaan",
      qty: 5,
      status_penggunaan: "tidak_dipakai",
      alasan_tidak_dipakai: "Rusak beberapa tombol",
      tindak_lanjut: "Akan diperbaiki",
    },
    {
      id: 3,
      nama_barang: "Printer Epson L3150",
      id_pengguna: 1,
      id_departemen: 2,
      jenis_kepemilikan: "sewa",
      qty: 1,
      status_penggunaan: "dipakai",
    },
    {
      id: 4,
      nama_barang: "CPU Intel i7",
      id_pengguna: 1,
      id_departemen: 3,
      jenis_kepemilikan: "perusahaan",
      qty: 8,
      status_penggunaan: "dipakai",
    },
    {
      id: 5,
      nama_barang: "Proyektor Epson",
      id_pengguna: 1,
      id_departemen: 2,
      jenis_kepemilikan: "sewa",
      qty: 2,
      status_penggunaan: "tidak_dipakai",
      alasan_tidak_dipakai: "Lampu proyektor rusak",
      tindak_lanjut: "Akan diganti lampu baru",
    },
  ];

  // Ambil data user dari AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      const jsonValue = await AsyncStorage.getItem("userData");
      if (jsonValue) {
        const user: StoredUserData = JSON.parse(jsonValue);
        setUserData(user);
      } else {
        // Dummy user data if not found in storage
        const dummyUser: StoredUserData = {
          id: 1,
          username: "admin",
          role: "admin",
          password: "admin",
        };
        setUserData(dummyUser);
      }

      // Set dummy data for barang list
      setBarangList(dummyBarang);
    };
    getUserData();
  }, []);

  // Fungsi untuk menghapus barang
  const handleDelete = (id: number) => {
    Alert.alert("Konfirmasi", "Apakah Anda yakin ingin menghapus barang ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        onPress: () => {
          setBarangList(barangList.filter((item) => item.id !== id));
          if (selectedBarang?.id === id) {
            setSelectedBarang(null);
          }
        },
      },
    ]);
  };

  // Filter barang berdasarkan pencarian
  const filteredBarang = barangList.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi untuk menangani submit form
  const handleSubmit = (data: Omit<Barang, "id">) => {
    if (selectedBarang) {
      // Update existing
      const updatedList = barangList.map((item) =>
        item.id === selectedBarang.id ? { ...data, id: selectedBarang.id } : item
      );
      setBarangList(updatedList);
      Alert.alert("Sukses", "Barang berhasil diupdate");
    } else {
      // Add new
      const newBarang = {
        id: Math.max(0, ...barangList.map((b) => b.id)) + 1,
        ...data,
        id_pengguna: userData?.id || 0,
      };
      setBarangList([...barangList, newBarang]);
      Alert.alert("Sukses", "Barang berhasil ditambahkan");
    }
    setModalVisible(false);
    setSelectedBarang(null);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8, paddingBottom: 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#ffffffff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Seiri</Text>
          <Text style={styles.headerSubtitle}>Ringkas / Rapi</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Barang..."
          placeholderTextColor="#95a5a6"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        )}
      </View>

      {/* Daftar Barang */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Tombol Tambah Barang */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedBarang(null);
            setModalVisible(true);
          }}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Tambah Barang</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Daftar Barang</Text>
        {filteredBarang.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color="#bdc3c7" />
            <Text style={styles.emptyText}>Tidak ada barang</Text>
          </View>
        ) : (
          filteredBarang.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.nama_barang}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedBarang(item);
                      setModalVisible(true);
                    }}>
                    <Ionicons name="create-outline" size={20} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.cardDetail}>
                <Text style={styles.detailText}>Qty: {item.qty}</Text>
                <Text style={styles.detailText}>
                  Status: {item.status_penggunaan === "dipakai" ? "Dipakai" : "Tidak Dipakai"}
                </Text>
                {item.status_penggunaan === "tidak_dipakai" && (
                  <>
                    <Text style={styles.detailText}>Alasan: {item.alasan_tidak_dipakai}</Text>
                    <Text style={styles.detailText}>Tindak Lanjut: {item.tindak_lanjut}</Text>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedBarang(null);
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}>
              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <View style={styles.modalContent}>
                  <BarangForm
                    barang={selectedBarang}
                    onClose={() => {
                      setModalVisible(false);
                      setSelectedBarang(null);
                    }}
                    onSubmit={handleSubmit}
                    userId={userData?.id || 0}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

// Komponen Form Terpisah
const BarangForm = ({
  barang,
  onClose,
  onSubmit,
  userId,
}: {
  barang: Barang | null;
  onClose: () => void;
  onSubmit: (data: Omit<Barang, "id">) => void;
  userId: number;
}) => {
  const [formData, setFormData] = useState<Omit<Barang, "id">>({
    nama_barang: barang?.nama_barang || "",
    id_pengguna: userId,
    id_departemen: barang?.id_departemen || 1,
    jenis_kepemilikan: barang?.jenis_kepemilikan || "perusahaan",
    qty: barang?.qty || 1,
    status_penggunaan: barang?.status_penggunaan || "dipakai",
    alasan_tidak_dipakai: barang?.alasan_tidak_dipakai || "",
    tindak_lanjut: barang?.tindak_lanjut || "",
  });

  const handleInputChange = (name: keyof typeof formData, value: string | number) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!formData.nama_barang) {
      Alert.alert("Error", "Nama barang wajib diisi");
      return;
    }
    onSubmit(formData);
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{barang ? "Edit Barang" : "Tambah Barang Baru"}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#7f8c8d" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Nama Barang</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Barang"
        placeholderTextColor="#95a5a6"
        value={formData.nama_barang}
        onChangeText={(text) => handleInputChange("nama_barang", text)}
      />

      <Text style={styles.label}>Qty Barang:</Text>
      <TextInput
        style={styles.input}
        placeholder="Jumlah"
        placeholderTextColor="#95a5a6"
        keyboardType="numeric"
        value={formData.qty.toString()}
        onChangeText={(text) => handleInputChange("qty", parseInt(text) || 0)}
      />

      <Text style={styles.label}>Status Penggunaan</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.status_penggunaan}
          onValueChange={(value) => handleInputChange("status_penggunaan", value)}
          style={styles.picker}>
          <Picker.Item label="Dipakai" value="dipakai" />
          <Picker.Item label="Tidak Dipakai" value="tidak_dipakai" />
        </Picker>
      </View>

      {formData.status_penggunaan === "tidak_dipakai" && (
        <>
          <Text style={styles.label}>Alasan</Text>
          <TextInput
            style={styles.input}
            placeholder="Alasan Tidak Dipakai"
            placeholderTextColor="#95a5a6"
            value={formData.alasan_tidak_dipakai}
            onChangeText={(text) => handleInputChange("alasan_tidak_dipakai", text)}
          />

          <Text style={styles.label}>Tindak Lanjut</Text>
          <TextInput
            style={styles.input}
            placeholder="Tindak Lanjut"
            placeholderTextColor="#95a5a6"
            value={formData.tindak_lanjut}
            onChangeText={(text) => handleInputChange("tindak_lanjut", text)}
          />
        </>
      )}

      <View style={styles.formButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{barang ? "Update" : "Simpan"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffffff",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#ffffffff",
    fontWeight: "500",
    marginTop: 2,
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 14,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    color: "#2c3e50",
  },
  clearButton: {
    padding: 4,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 2,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2c3e50",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2c3e50",
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  cardDetail: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f2f6",
  },
  detailText: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 6,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignSelf: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  // Form Styles
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#2c3e50",
  },
  input: {
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
    color: "#2c3e50",
  },
  label: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
    fontWeight: "500",
  },
  pickerContainer: {
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#2c3e50",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: "#2c3e50",
    fontWeight: "600",
    fontSize: 16,
  },
});
