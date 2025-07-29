import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomAlert } from "../utils/CustomAlert";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface StoredUserData {
  username: string;
  role: string;
  password: string;
  id: number;
}

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
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export default function SeiritScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nama_barang: "",
    qty: 1,
    status_penggunaan: "dipakai",
    alasan_tidak_dipakai: "",
    tindak_lanjut: "",
  });

  // API Functions (using dummy data for now)
  const fetchBarangData = async (): Promise<ApiResponse<Barang[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyData: Barang[] = [
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
            createdAt: "2024-01-15T08:30:00Z",
          },
          {
            id: 2,
            nama_barang: "Laptop Dell",
            id_pengguna: 1,
            id_departemen: 1,
            jenis_kepemilikan: "perusahaan",
            qty: 1,
            status_penggunaan: "dipakai",
            createdAt: "2024-01-14T10:15:00Z",
          },
          {
            id: 3,
            nama_barang: "Meja Kantor",
            id_pengguna: 2,
            id_departemen: 2,
            jenis_kepemilikan: "departemen",
            qty: 5,
            status_penggunaan: "dipakai",
            createdAt: "2024-01-13T14:20:00Z",
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
            createdAt: "2024-01-12T09:45:00Z",
          },
        ];
        resolve({ success: true, data: dummyData });
      }, 1000);
    });
  };

  const submitBarangData = async (data: Omit<Barang, "id">): Promise<ApiResponse<Barang>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem: Barang = {
          ...data,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        resolve({ success: true, data: newItem, message: "Data berhasil disimpan" });
      }, 1500);
    });
  };

  const updateBarangData = async (id: number, data: Partial<Barang>): Promise<ApiResponse<Barang>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedItem: Barang = {
          ...(data as Barang),
          id,
          updatedAt: new Date().toISOString(),
        };
        resolve({ success: true, data: updatedItem, message: "Data berhasil diupdate" });
      }, 1500);
    });
  };

  const deleteBarangData = async (id: number): Promise<ApiResponse<null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: null, message: "Data berhasil dihapus" });
      }, 1000);
    });
  };

  const resetForm = () => {
    setForm({
      nama_barang: "",
      qty: 1,
      status_penggunaan: "dipakai",
      alasan_tidak_dipakai: "",
      tindak_lanjut: "",
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBarang(null);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!form.nama_barang.trim()) {
      CustomAlert.error("Error", "Nama barang wajib diisi");
      return;
    }

    if (form.status_penggunaan === "tidak_dipakai") {
      if (!form.alasan_tidak_dipakai.trim()) {
        CustomAlert.error("Error", "Alasan tidak dipakai wajib diisi");
        return;
      }
      if (!form.tindak_lanjut.trim()) {
        CustomAlert.error("Error", "Tindak lanjut wajib diisi");
        return;
      }
    }

    if (!userData) {
      CustomAlert.error("Error", "Data user tidak ditemukan");
      return;
    }

    setSubmitting(true);
    try {
      if (selectedBarang) {
        // Update existing
        const response = await updateBarangData(selectedBarang.id, {
          ...selectedBarang,
          nama_barang: form.nama_barang.trim(),
          qty: form.qty,
          status_penggunaan: form.status_penggunaan,
          alasan_tidak_dipakai: form.alasan_tidak_dipakai.trim(),
          tindak_lanjut: form.tindak_lanjut.trim(),
        });

        if (response.success) {
          setBarangList((prev) => prev.map((item) => (item.id === selectedBarang.id ? response.data : item)));
          closeModal();
          CustomAlert.success("Sukses", response.message || "Data berhasil diupdate");
        }
      } else {
        // Add new
        const response = await submitBarangData({
          nama_barang: form.nama_barang.trim(),
          id_pengguna: userData.id,
          id_departemen: userData.id,
          jenis_kepemilikan: "pribadi",
          qty: form.qty,
          status_penggunaan: form.status_penggunaan,
          alasan_tidak_dipakai: form.alasan_tidak_dipakai.trim(),
          tindak_lanjut: form.tindak_lanjut.trim(),
        });

        if (response.success) {
          setBarangList((prev) => [response.data, ...prev]);
          closeModal();
          CustomAlert.success("Sukses", response.message || "Data berhasil ditambahkan");
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
      CustomAlert.error("Error", "Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    CustomAlert.show({
      type: "warning",
      title: "Konfirmasi",
      message: "Apakah Anda yakin ingin menghapus barang ini?",
      buttons: [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await deleteBarangData(id);
              if (response.success) {
                setBarangList((prev) => prev.filter((item) => item.id !== id));
                CustomAlert.success("Sukses", response.message || "Barang berhasil dihapus");
              }
            } catch (error) {
              CustomAlert.error("Error", "Gagal menghapus data");
            }
          },
        },
      ],
    });
  };

  const loadData = async () => {
    try {
      const response = await fetchBarangData();
      if (response.success) {
        setBarangList(response.data);
      }
    } catch (error) {
      console.error("Failed to load barang data", error);
      CustomAlert.error("Error", "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("@user_data");
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedBarang) {
      setForm({
        nama_barang: selectedBarang.nama_barang,
        qty: selectedBarang.qty,
        status_penggunaan: selectedBarang.status_penggunaan,
        alasan_tidak_dipakai: selectedBarang.alasan_tidak_dipakai || "",
        tindak_lanjut: selectedBarang.tindak_lanjut || "",
      });
    }
  }, [selectedBarang]);

  const filteredBarang = barangList.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSubmitDisabled =
    submitting ||
    !form.nama_barang.trim() ||
    (form.status_penggunaan === "tidak_dipakai" && (!form.alasan_tidak_dipakai.trim() || !form.tindak_lanjut.trim()));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Seiri</Text>
            <Text style={styles.headerSubtitle}>Manajemen inventaris barang</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari barang..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={filteredBarang}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6B6B"]} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.nama_barang}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedBarang(item);
                    setModalVisible(true);
                  }}
                  style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Jumlah:</Text>
                <Text style={styles.cardValue}>{item.qty}</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Status:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status_penggunaan === "dipakai" ? styles.statusActive : styles.statusInactive,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      item.status_penggunaan === "dipakai" ? styles.statusTextActive : styles.statusTextInactive,
                    ]}>
                    {item.status_penggunaan === "dipakai" ? "Dipakai" : "Tidak Dipakai"}
                  </Text>
                </View>
              </View>

              {item.status_penggunaan === "tidak_dipakai" && (
                <>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Alasan:</Text>
                    <Text style={styles.cardValue}>{item.alasan_tidak_dipakai}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>Tindak Lanjut:</Text>
                    <Text style={styles.cardValue}>{item.tindak_lanjut}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Belum ada barang</Text>
            <Text style={styles.emptySubtitle}>Tambahkan barang pertama Anda</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setSelectedBarang(null);
          setModalVisible(true);
        }}
        activeOpacity={0.8}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriver
        useNativeDriverForBackdrop
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor="#000"
        backdropOpacity={0.5}
        style={styles.modal}
        avoidKeyboard={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}>
          <View style={styles.modalContainer}>
            {/* Enhanced Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.greyLine} />
              <View style={styles.headerContent}>
                <Text style={styles.modalTitle}>{selectedBarang ? "Edit Barang" : "Tambah Barang"}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Scrollable Form Content */}
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              
              {/* Nama Barang Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  Nama Barang <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan nama barang"
                  placeholderTextColor="#8E8E93"
                  value={form.nama_barang}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, nama_barang: text }))}
                  maxLength={50}
                />
              </View>

              {/* Quantity Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  Jumlah <Text style={styles.asterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan jumlah"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                  value={form.qty.toString()}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, qty: parseInt(text) || 1 }))}
                  maxLength={3}
                />
              </View>

              {/* Status Toggle Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>
                  Status Penggunaan <Text style={styles.asterisk}>*</Text>
                </Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[styles.toggleButton, form.status_penggunaan === "dipakai" && styles.toggleButtonSelected]}
                    onPress={() =>
                      setForm((prev) => ({
                        ...prev,
                        status_penggunaan: "dipakai",
                        alasan_tidak_dipakai: "",
                        tindak_lanjut: "",
                      }))
                    }>
                    <Text style={form.status_penggunaan === "dipakai" ? styles.toggleTextSelected : styles.toggleText}>
                      Dipakai
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      form.status_penggunaan === "tidak_dipakai" && styles.toggleButtonSelected,
                    ]}
                    onPress={() => setForm((prev) => ({ ...prev, status_penggunaan: "tidak_dipakai" }))}>
                    <Text
                      style={form.status_penggunaan === "tidak_dipakai" ? styles.toggleTextSelected : styles.toggleText}>
                      Tidak Dipakai
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Conditional Fields */}
              {form.status_penggunaan === "tidak_dipakai" && (
                <>
                  {/* Alasan Section */}
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>
                      Alasan Tidak Dipakai <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.descriptionInput}
                      placeholder="Masukkan alasan..."
                      placeholderTextColor="#8E8E93"
                      value={form.alasan_tidak_dipakai}
                      onChangeText={(text) => setForm((prev) => ({ ...prev, alasan_tidak_dipakai: text }))}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      maxLength={200}
                    />
                  </View>

                  {/* Tindak Lanjut Section */}
                  <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>
                      Tindak Lanjut <Text style={styles.asterisk}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.descriptionInput}
                      placeholder="Masukkan tindak lanjut..."
                      placeholderTextColor="#8E8E93"
                      value={form.tindak_lanjut}
                      onChangeText={(text) => setForm((prev) => ({ ...prev, tindak_lanjut: text }))}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      maxLength={200}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            {/* Enhanced Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={closeModal} style={styles.cancelButton} disabled={submitting}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
                activeOpacity={isSubmitDisabled ? 1 : 0.8}>
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitText}>{selectedBarang ? "Update" : "Simpan"}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTextContainer: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  placeholder: {
    width: 32,
  },
  searchSection: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 8,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 12,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  cardContent: {
    padding: 16,
    gap: 8,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#D1FAE5",
  },
  statusInactive: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusTextActive: {
    color: "#065F46",
  },
  statusTextInactive: {
    color: "#92400E",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  keyboardAvoidingView: {
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  greyLine: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    maxHeight: 400, // Set a reasonable max height for scrollable area
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  asterisk: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  descriptionInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
    minHeight: 100,
    textAlignVertical: "top",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonSelected: {
    backgroundColor: "#FF6B6B",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  toggleTextSelected: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "white",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FF6B6B",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});