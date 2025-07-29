import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
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

// Tipe data sesuai struktur database yang sebenarnya
interface SOPItem {
  id_sop: number;
  id_departemen: number;
  judul_sop: string;
  dokumen: string;
  status: "aktif" | "tidak_aktif";
}

// Mock data sesuai struktur database
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
  {
    id_sop: 4,
    id_departemen: 1,
    judul_sop: "SOP Keamanan Data",
    dokumen: "sop_keamanan_data.pdf",
    status: "aktif",
  },
  {
    id_sop: 5,
    id_departemen: 2,
    judul_sop: "SOP Rapat Mingguan",
    dokumen: "sop_rapat_mingguan.docx",
    status: "aktif",
  },
  {
    id_sop: 6,
    id_departemen: 3,
    judul_sop: "SOP Maintenance Peralatan",
    dokumen: "sop_maintenance.pdf",
    status: "aktif",
  },
  {
    id_sop: 7,
    id_departemen: 1,
    judul_sop: "SOP Backup Data Harian",
    dokumen: "sop_backup_harian.docx",
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
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const openDocument = (fileName: string) => {
    const fileUrl = DOCUMENT_BASE_URL + fileName;
    Linking.openURL(fileUrl).catch((err) =>
      alert("Gagal membuka dokumen. Pastikan Anda memiliki aplikasi pembaca PDF/DOCX.")
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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

  const getDepartmentName = (id_departemen: number) => {
    const departments = {
      1: "IT",
      2: "Finance", 
      3: "Operations"
    };
    return departments[id_departemen as keyof typeof departments] || `Dept ${id_departemen}`;
  };

  const renderSOPItem = ({ item }: { item: SOPItem }) => {
    const isInactive = item.status === "tidak_aktif";

    return (
      <View style={[styles.card, isInactive && styles.inactiveCard]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, isInactive && styles.inactiveIconContainer]}>
            <Ionicons 
              name={getDocumentIcon(item.dokumen)} 
              size={24} 
              color={isInactive ? "#9CA3AF" : "#96CEB4"} 
            />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, isInactive && styles.inactiveText]} numberOfLines={2}>
                {item.judul_sop}
              </Text>
              <View style={[
                styles.statusBadge, 
                item.status === "aktif" ? styles.statusActive : styles.statusInactive
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === "aktif" ? styles.statusTextActive : styles.statusTextInactive
                ]}>
                  {item.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                </Text>
              </View>
            </View>
            
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="business-outline" size={12} color="#6B7280" />
                <Text style={styles.metaText}>{getDepartmentName(item.id_departemen)}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="document-outline" size={12} color="#6B7280" />
                <Text style={styles.metaText}>{item.dokumen}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, isInactive && styles.disabledButton]}
            onPress={() => !isInactive && openDocument(item.dokumen)}
            disabled={isInactive}
            activeOpacity={isInactive ? 1 : 0.7}>
            <Ionicons 
              name="download-outline" 
              size={16} 
              color={isInactive ? "#9CA3AF" : "#96CEB4"} 
            />
            <Text style={[styles.actionText, isInactive && styles.inactiveText]}>
              Buka Dokumen
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#96CEB4" />
        <Text style={styles.loadingText}>Memuat SOP...</Text>
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
            <Text style={styles.headerTitle}>Seiketsu</Text>
            <Text style={styles.headerSubtitle}>Standardisasi & Dokumentasi SOP</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari judul SOP..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <TouchableOpacity 
          style={[styles.filterButton, showInactive && styles.filterButtonActive]} 
          onPress={() => setShowInactive(!showInactive)}
          activeOpacity={0.7}>
          <Ionicons 
            name={showInactive ? "checkbox" : "square-outline"} 
            size={20} 
            color={showInactive ? "#96CEB4" : "#6B7280"} 
          />
          <Text style={[styles.filterText, showInactive && styles.filterTextActive]}>
            Tampilkan SOP Tidak Aktif
          </Text>
        </TouchableOpacity>
        
        <View style={styles.resultCount}>
          <Text style={styles.resultText}>
            {filteredSOPs.length} SOP ditemukan
          </Text>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={filteredSOPs}
        keyExtractor={(item) => item.id_sop.toString()}
        renderItem={renderSOPItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#96CEB4"]}
            tintColor="#96CEB4"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? "SOP tidak ditemukan" : showInactive ? "Tidak ada SOP" : "Tidak ada SOP aktif"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? "Coba gunakan kata kunci yang berbeda" 
                : showInactive 
                  ? "Semua SOP dalam status tidak aktif" 
                  : "Belum ada SOP aktif yang tersedia"
              }
            </Text>
          </View>
        }
      />
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
    backgroundColor: "#96CEB4",
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
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  filterButtonActive: {
    backgroundColor: "#F0F9F4",
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#96CEB4",
  },
  resultCount: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resultText: {
    fontSize: 12,
    color: "#9CA3AF",
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
  inactiveCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F9F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  inactiveIconContainer: {
    backgroundColor: "#F3F4F6",
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  inactiveText: {
    color: "#9CA3AF",
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
  metaInfo: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9F4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#F3F4F6",
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
    color: "#96CEB4",
    fontWeight: "500",
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
    textAlign: "center",
    maxWidth: 280,
  },
});