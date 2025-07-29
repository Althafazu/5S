import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomAlert } from "../utils/CustomAlert";

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
  const [loading, setLoading] = useState(false);

  // Ambil data user dari AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("userData");
        if (jsonValue) {
          const user: StoredUserData = JSON.parse(jsonValue);
          setUserData(user);
        }
      } catch (error) {
        CustomAlert.error("Error", "Gagal memuat data pengguna");
      }
    };
    getUserData();
  }, []);

  // Load dummy data
  useEffect(() => {
    // Simulasi data awal
    const mockBarang: Barang[] = [
      {
        id: 1,
        nama_barang: "Bor Listrik",
        id_pengguna: 1,
        id_departemen: 3,
        jenis_kepemilikan: "pribadi",
        qty: 2,
        status_penggunaan: "tidak_dipakai",
        alasan_tidak_dipakai: "Mati total",
        tindak_lanjut: "dibuang",
      },
      {
        id: 2,
        nama_barang: "Laptop Dell",
        id_pengguna: 1,
        id_departemen: 1,
        jenis_kepemilikan: "perusahaan",
        qty: 1,
        status_penggunaan: "dipakai",
      },
      {
        id: 3,
        nama_barang: "Meja Kantor",
        id_pengguna: 2,
        id_departemen: 2,
        jenis_kepemilikan: "departemen",
        qty: 5,
        status_penggunaan: "dipakai",
      },
      {
        id: 4,
        nama_barang: "Printer Epson",
        id_pengguna: 3,
        id_departemen: 1,
        jenis_kepemilikan: "perusahaan",
        qty: 1,
        status_penggunaan: "tidak_dipakai",
        alasan_tidak_dipakai: "Kertas macet",
        tindak_lanjut: "Diperbaiki",
      },
    ];
    setBarangList(mockBarang);
  }, []);

  const handleDelete = (id: number) => {
    CustomAlert.show({
      type: "warning",
      title: "Konfirmasi",
      message: "Apakah Anda yakin ingin menghapus barang ini?",
      buttons: [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            // Logika penghapusan
            setBarangList((prev) => prev.filter((item) => item.id !== id));
            setSelectedBarang((prev) => (prev?.id === id ? null : prev));

            // Tampilkan alert sukses setelah alert konfirmasi benar-benar tertutup
            setTimeout(() => {
              CustomAlert.success("Sukses", "Barang berhasil dihapus", [
                { text: "OK" }, // Tambahkan tombol OK agar user bisa menutup manual
              ]);
            }, 300);
          },
        },
      ],
    });
  };

  // Filter barang berdasarkan pencarian
  const filteredBarang = barangList.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi untuk menangani submit form
  const handleSubmit = (formData: Omit<Barang, "id">) => {
    setLoading(true);

    setTimeout(() => {
      if (selectedBarang) {
        // Update existing
        const updatedList = barangList.map((item) =>
          item.id === selectedBarang.id ? { ...formData, id: selectedBarang.id } : item
        );
        setBarangList(updatedList);
        CustomAlert.success("Sukses", "Barang berhasil diupdate");
      } else {
        // Add new
        const newBarang = {
          id: Math.max(0, ...barangList.map((b) => b.id)) + 1,
          ...formData,
          id_pengguna: userData?.id || 0,
          // Departemen dan jenis kepemilikan akan diisi di backend
          id_departemen: userData?.id || 0, // Simpan untuk referensi, tapi tidak ditampilkan di form
          jenis_kepemilikan: "pribadi", // Simpan untuk referensi, tapi tidak ditampilkan di form
        };
        setBarangList([...barangList, newBarang]);
        CustomAlert.success("Sukses", "Barang berhasil ditambahkan", [{ text: "OK" }]);
      }
      setModalVisible(false);
      setSelectedBarang(null);
      setLoading(false);
    }, 800);
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
                <Text style={styles.detailText}>Jumlah: {item.qty}</Text>
                <Text
                  style={[styles.detailText, { color: item.status_penggunaan === "dipakai" ? "#27ae60" : "#e74c3c" }]}>
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
        isVisible={modalVisible}
        style={styles.modal}
        onBackdropPress={() => {
          setModalVisible(false);
          setSelectedBarang(null);
        }}
        onBackButtonPress={() => {
          setModalVisible(false);
          setSelectedBarang(null);
        }}
        backdropColor="#000"
        backdropOpacity={0.5}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedBarang ? "Edit Barang" : "Tambah Barang Baru"}</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSelectedBarang(null);
              }}
              style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <BarangForm
              barang={selectedBarang}
              onClose={() => {
                setModalVisible(false);
                setSelectedBarang(null);
              }}
              onSubmit={handleSubmit}
              userId={userData?.id || 0}
              loading={loading}
            />
          </ScrollView>
        </View>
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
  loading,
}: {
  barang: Barang | null;
  onClose: () => void;
  onSubmit: (formData: Omit<Barang, "id">) => void;
  userId: number;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState<Omit<Barang, "id">>({
    nama_barang: barang?.nama_barang || "",
    id_pengguna: userId,
    // Departemen dan jenis kepemilikan tidak lagi ditampilkan di form
    id_departemen: barang?.id_departemen || 1,
    jenis_kepemilikan: barang?.jenis_kepemilikan || "pribadi",
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
      CustomAlert.error("Error", "Nama barang wajib diisi");
      return;
    }
    if (formData.status_penggunaan === "tidak_dipakai") {
      if (!formData.alasan_tidak_dipakai) {
        CustomAlert.error("Error", "Alasan tidak dipakai wajib diisi");
        return;
      }
      if (!formData.tindak_lanjut) {
        CustomAlert.error("Error", "Tindak lanjut wajib diisi");
        return;
      }
    }
    onSubmit(formData);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Nama Barang</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Barang"
        placeholderTextColor="#95a5a6"
        value={formData.nama_barang}
        onChangeText={(text) => handleInputChange("nama_barang", text)}
        maxLength={50}
      />

      <Text style={styles.label}>Qty Barang:</Text>
      <TextInput
        style={styles.input}
        placeholder="Jumlah"
        placeholderTextColor="#95a5a6"
        keyboardType="numeric"
        value={formData.qty.toString()}
        onChangeText={(text) => handleInputChange("qty", parseInt(text) || 0)}
        maxLength={3}
      />

      <Text style={styles.label}>Status Penggunaan</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.status_penggunaan}
          onValueChange={(value) => {
            handleInputChange("status_penggunaan", value);
            // Reset alasan dan tindak lanjut jika kembali ke dipakai
            if (value === "dipakai") {
              handleInputChange("alasan_tidak_dipakai", "");
              handleInputChange("tindak_lanjut", "");
            }
          }}
          style={styles.picker}>
          <Picker.Item label="Dipakai" value="dipakai" />
          <Picker.Item label="Tidak Dipakai" value="tidak_dipakai" />
        </Picker>
      </View>

      {formData.status_penggunaan === "tidak_dipakai" && (
        <>
          <Text style={styles.label}>Alasan</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Alasan Tidak Dipakai"
            placeholderTextColor="#95a5a6"
            value={formData.alasan_tidak_dipakai}
            onChangeText={(text) => handleInputChange("alasan_tidak_dipakai", text)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            maxLength={200}
          />

          <Text style={styles.label}>Tindak Lanjut</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tindak Lanjut"
            placeholderTextColor="#95a5a6"
            value={formData.tindak_lanjut}
            onChangeText={(text) => handleInputChange("tindak_lanjut", text)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            maxLength={200}
          />
        </>
      )}

      <View style={styles.formButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>{barang ? "Update" : "Simpan"}</Text>
          )}
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
  // Modal Styles (Menggunakan referensi dari file yang diberikan)
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHandle: {
    height: 4,
    width: 40,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    maxHeight: "80%",
    paddingHorizontal: 20,
  },
  // Form Styles
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
    color: "#1C1C1E",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#1C1C1E",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 12,
  },
  submitButton: {
    flex: 2,
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#8E8E93",
    fontWeight: "600",
    fontSize: 16,
  },
});
