const BASE_URL = "http://192.168.100.148:8080"; // Ganti sesuai alamat backend

export const API_ENDPOINTS = {
  // ===== Penyimpanan (Seiton) =====
  GET_PENYIMPANAN_BY_SEARCH: (search) =>
    `${BASE_URL}/penyimpanan/getPenyimpananBySearch/${encodeURIComponent(search)}`,

  // ===== Penilaian (Shitsuke) =====
  GET_ALL_PENILAIAN: `${BASE_URL}/penilaian/getAllPenilaian`,
  GET_PENILAIAN_BY_ID: (id) =>
    `${BASE_URL}/penilaian/getPenilaian/${id}`,
  SAVE_PENILAIAN: `${BASE_URL}/penilaian/savePenilaian`,
};

export default API_ENDPOINTS;
