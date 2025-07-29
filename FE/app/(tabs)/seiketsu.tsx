import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Tipe data sesuai struktur database
interface SOPItem {
  id_sop: number;
  id_departemen: number;
  judul_sop: string;
  dokumen: string;
  status: "aktif" | "tidak_aktif";
}

// Hanya 3 mock data sesuai contoh database
const mockSOPData: SOPItem[] = [
  {
    id_sop: 1,
    id_departemen: 1,
    judul_sop: "SOP Penggunaan Komputer",
    dokumen: "sop_penggunaan_komputer.pdf",
    status: "aktif",
  },
  {
    id_sop: 2,
    id_departemen: 2,
    judul_sop: "SOP Permintaan Dana",
    dokumen: "sop_perm_dana.pdf",
    status: "aktif",
  },
  {
    id_sop: 3,
    id_departemen: 3,
    judul_sop: "SOP Pengelolaan Inventaris",
    dokumen: "sop_inventaris_umum.docx",
    status: "tidak_aktif",
  },
];

// Base URL untuk dokumen (sesuaikan dengan server Anda)
const DOCUMENT_BASE_URL = "https://example.com/sop/";

export default function Seiketsu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const openDocument = (fileName: string) => {
    const fileUrl = DOCUMENT_BASE_URL + fileName;
    Linking.openURL(fileUrl).catch((err) =>
      alert("Gagal membuka dokumen. Pastikan Anda memiliki aplikasi pembaca PDF/DOCX.")
    );
  };

  const filteredSOPs = mockSOPData.filter((item) => {
    const matchesSearch = item.judul_sop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = showInactive || item.status === "aktif";
    return matchesSearch && matchesStatus;
  });

  const getDocumentIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) return "document-text";
    if (fileName.endsWith(".docx")) return "document";
    return "document-outline";
  };

  const getStatusColor = (status: string) => {
    return status === "aktif" ? "#27ae60" : "#e74c3c";
  };

  const renderSOPItem = ({ item }: { item: SOPItem }) => {
    const isInactive = item.status === "tidak_aktif";

    return (
      <View style={[styles.card, isInactive && styles.inactiveCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Ionicons name={getDocumentIcon(item.dokumen)} size={24} color={isInactive ? "#bdc3c7" : "#96CEB4"} />
            <View>
              <Text style={[styles.title, isInactive && styles.inactiveText]}>{item.judul_sop}</Text>
              <Text style={styles.fileName}>{item.dokumen}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.statusBadge}>
              <Ionicons name="ellipse" size={10} color={getStatusColor(item.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status === "aktif" ? "Aktif" : "Tidak Aktif"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, isInactive && styles.disabledButton]}
            onPress={() => !isInactive && openDocument(item.dokumen)}
            disabled={isInactive}>
            <Ionicons name="document" size={16} color={isInactive ? "#bdc3c7" : "#2c3e50"} />
            <Text style={[styles.actionText, isInactive && styles.inactiveText]}>Buka Dokumen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>Seiketsu</Text>
          <Text style={styles.headerSubtitle}>Standardize / Rawat</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari SOP..."
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

      {/* Filter Toggle */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowInactive(!showInactive)}>
          <Ionicons name={showInactive ? "checkbox" : "square-outline"} size={20} color="#96CEB4" />
          <Text style={styles.filterText}>Tampilkan SOP Tidak Aktif</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredSOPs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#bdc3c7" />
            <Text style={styles.emptyText}>{showInactive ? "Tidak ada SOP" : "Tidak ada SOP aktif"}</Text>
            <Text style={styles.emptySubtext}>
              {showInactive ? "Semua SOP dalam status tidak aktif" : "Belum ada SOP aktif yang tersedia"}
            </Text>
          </View>
        ) : (
          filteredSOPs.map((item) => <View key={item.id_sop}>{renderSOPItem({ item })}</View>)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#96CEB4",
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
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    elevation: 1,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#2c3e50",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7f8c8d",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 15,
    color: "#95a5a6",
    marginTop: 8,
    textAlign: "center",
    maxWidth: 280,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    padding: 16,
  },
  inactiveCard: {
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    flex: 1,
    marginBottom: 4,
  },
  inactiveText: {
    color: "#bdc3c7",
  },
  fileName: {
    fontSize: 13,
    color: "#6c757d",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#e9ecef",
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
    color: "#2c3e50",
    fontWeight: "500",
  },
});
