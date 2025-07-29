import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomAlert from "../utils/CustomAlert";

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

interface SeisoItem {
  idFoto: number;
  username: string;
  jenisFoto: number;
  lokasi: string;
  foto: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GroupedSeisoItem {
  lokasi: string;
  username: string;
  timestamp: string;
  sebelum?: SeisoItem;
  sesudah?: SeisoItem;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export default function SeisoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState<null | number>(null);
  const [seisoData, setSeisoData] = useState<SeisoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    jenisFoto: 0,
    lokasi: "",
    timestamp: new Date().toISOString(),
  });

  // API Functions (using dummy data for now)
  const fetchSeisoData = async (): Promise<ApiResponse<SeisoItem[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyData: SeisoItem[] = [
          {
            idFoto: 1,
            username: "admin",
            jenisFoto: 0,
            lokasi: "Ruang Meeting A",
            foto: "https://picsum.photos/400/300?random=1",
            timestamp: "2024-01-15T08:30:00Z",
            createdAt: "2024-01-15T08:30:00Z",
          },
          {
            idFoto: 2,
            username: "admin",
            jenisFoto: 1,
            lokasi: "Ruang Meeting A",
            foto: "https://picsum.photos/400/300?random=2",
            timestamp: "2024-01-15T09:00:00Z",
            createdAt: "2024-01-15T09:00:00Z",
          },
          {
            idFoto: 3,
            username: "user1",
            jenisFoto: 0,
            lokasi: "Pantry Lantai 2",
            foto: "https://picsum.photos/400/300?random=3",
            timestamp: "2024-01-14T14:20:00Z",
            createdAt: "2024-01-14T14:20:00Z",
          },
          {
            idFoto: 4,
            username: "user1",
            jenisFoto: 1,
            lokasi: "Pantry Lantai 2",
            foto: "https://picsum.photos/400/300?random=4",
            timestamp: "2024-01-14T14:45:00Z",
            createdAt: "2024-01-14T14:45:00Z",
          },
          {
            idFoto: 5,
            username: "user2",
            jenisFoto: 0,
            lokasi: "Toilet Lantai 1",
            foto: "https://picsum.photos/400/300?random=5",
            timestamp: "2024-01-13T10:15:00Z",
            createdAt: "2024-01-13T10:15:00Z",
          },
        ];
        resolve({ success: true, data: dummyData });
      }, 1000);
    });
  };

  const submitSeisoData = async (data: Omit<SeisoItem, "idFoto">): Promise<ApiResponse<SeisoItem>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem: SeisoItem = {
          ...data,
          idFoto: Date.now(),
          createdAt: new Date().toISOString(),
        };
        resolve({ success: true, data: newItem, message: "Data berhasil disimpan" });
      }, 1500);
    });
  };

  const resetForm = () => {
    setForm({
      jenisFoto: 0,
      lokasi: "",
      timestamp: new Date().toISOString(),
    });
    setSelectedImage(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !userData || !form.lokasi.trim()) {
      CustomAlert.warning("Error", "Mohon lengkapi semua field yang diperlukan", [{ text: "OK" }]);
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitSeisoData({
        username: userData.username,
        jenisFoto: form.jenisFoto,
        lokasi: form.lokasi.trim(),
        foto: selectedImage,
        timestamp: form.timestamp,
      });

      if (response.success) {
        setSeisoData((prev) => [response.data, ...prev]);
        closeModal();
        CustomAlert.success("Sukses", response.message || "Data berhasil disimpan", [{ text: "OK" }]);
      }
    } catch (error) {
      CustomAlert.error("Error", "Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadData = async () => {
    try {
      const response = await fetchSeisoData();
      if (response.success) {
        setSeisoData(response.data);
      }
    } catch (error) {
      console.error("Failed to load seiso data", error);
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

  // Group data by location and user
  const groupedData = React.useMemo(() => {
    const filtered = seisoData.filter((item) => {
      const matchSearch = item.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchJenis = filterJenis === null || item.jenisFoto === filterJenis;
      return matchSearch && matchJenis;
    });

    const grouped = new Map<string, GroupedSeisoItem>();

    filtered.forEach((item) => {
      const key = `${item.lokasi}-${item.username}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          lokasi: item.lokasi,
          username: item.username,
          timestamp: item.timestamp,
        });
      }

      const group = grouped.get(key)!;
      if (item.jenisFoto === 0) {
        group.sebelum = item;
      } else {
        group.sesudah = item;
      }

      // Update timestamp to latest
      if (new Date(item.timestamp) > new Date(group.timestamp)) {
        group.timestamp = item.timestamp;
      }
    });

    return Array.from(grouped.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [seisoData, searchQuery, filterJenis]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#45B7D1" />
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
            <Text style={styles.headerTitle}>Seiso</Text>
            <Text style={styles.headerSubtitle}>Dokumentasi kebersihan area kerja</Text>
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
            placeholder="Cari lokasi..."
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

        {/* Filter Toggle */}
        <View style={styles.filterToggleContainer}>
          <TouchableOpacity
            style={[styles.filterToggle, filterJenis === null && styles.filterToggleActive]}
            onPress={() => setFilterJenis(null)}>
            <Text style={[styles.filterToggleText, filterJenis === null && styles.filterToggleTextActive]}>Semua</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterToggle, filterJenis === 0 && styles.filterToggleActive]}
            onPress={() => setFilterJenis(0)}>
            <Text style={[styles.filterToggleText, filterJenis === 0 && styles.filterToggleTextActive]}>Sebelum</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterToggle, filterJenis === 1 && styles.filterToggleActive]}
            onPress={() => setFilterJenis(1)}>
            <Text style={[styles.filterToggleText, filterJenis === 1 && styles.filterToggleTextActive]}>Sesudah</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={groupedData}
        keyExtractor={(item, index) => `${item.lokasi}-${item.username}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#45B7D1"]} />}
        renderItem={({ item }) => (
          <View style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupLocation}>{item.lokasi}</Text>
              <View style={styles.groupInfo}>
                <Text style={styles.groupUsername}>{item.username}</Text>
                <Text style={styles.groupTime}>{formatTime(item.timestamp)}</Text>
              </View>
            </View>

            <View style={styles.imageContainer}>
              {item.sebelum && (
                <View style={styles.imageCard}>
                  <Image source={{ uri: item.sebelum.foto }} style={styles.cardImage} />
                  <View style={styles.imageLabel}>
                    <Text style={styles.imageLabelText}>Sebelum</Text>
                  </View>
                </View>
              )}

              {item.sesudah && (
                <View style={styles.imageCard}>
                  <Image source={{ uri: item.sesudah.foto }} style={styles.cardImage} />
                  <View style={[styles.imageLabel, styles.imageLabelAfter]}>
                    <Text style={styles.imageLabelText}>Sesudah</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="camera-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Belum ada data</Text>
            <Text style={styles.emptySubtitle}>Tambahkan foto seiso pertama</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      {userData?.role === "pekerja" && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}

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
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tambah Foto</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Image Upload */}
            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="camera-outline" size={32} color="#45B7D1" />
                  <Text style={styles.uploadText}>Pilih Foto</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Location Input */}
            <TextInput
              style={styles.input}
              placeholder="Lokasi"
              placeholderTextColor="#9CA3AF"
              value={form.lokasi}
              onChangeText={(text) => setForm((prev) => ({ ...prev, lokasi: text }))}
            />

            {/* Jenis Foto Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, form.jenisFoto === 0 && styles.toggleActive]}
                onPress={() => setForm((prev) => ({ ...prev, jenisFoto: 0 }))}>
                <Text style={[styles.toggleText, form.jenisFoto === 0 && styles.toggleTextActive]}>Sebelum</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, form.jenisFoto === 1 && styles.toggleActive]}
                onPress={() => setForm((prev) => ({ ...prev, jenisFoto: 1 }))}>
                <Text style={[styles.toggleText, form.jenisFoto === 1 && styles.toggleTextActive]}>Sesudah</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal} disabled={submitting}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting || !selectedImage || !form.lokasi.trim()}>
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    backgroundColor: "#45B7D1",
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
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginLeft: 8,
  },
  filterToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 4,
  },
  filterToggle: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  filterToggleActive: {
    backgroundColor: "#45B7D1",
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterToggleTextActive: {
    color: "white",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  groupCard: {
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
  groupHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  groupLocation: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  groupInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupUsername: {
    fontSize: 14,
    color: "#6B7280",
  },
  groupTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  imageContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  imageCard: {
    flex: 1,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  imageLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageLabelAfter: {
    backgroundColor: "#D1FAE5",
  },
  imageLabelText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#374151",
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
    backgroundColor: "#45B7D1",
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
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: "80%",
  },
  modalHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginTop: 12,
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalContent: {
    gap: 16,
  },
  imageUpload: {
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    color: "#45B7D1",
    fontWeight: "500",
    marginTop: 8,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#45B7D1",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  toggleTextActive: {
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#45B7D1",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
