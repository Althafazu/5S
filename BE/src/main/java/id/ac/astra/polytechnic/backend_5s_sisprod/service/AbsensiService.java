package id.ac.astra.polytechnic.backend_5s_sisprod.service;

import id.ac.astra.polytechnic.epresent.model.*;
import id.ac.astra.polytechnic.epresent.repository.*;
import id.ac.astra.polytechnic.epresent.response.DtoResponse;
import id.ac.astra.polytechnic.epresent.vo.AbsensiVo;
import id.ac.astra.polytechnic.epresent.vo.AbsensiVoForm;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static id.ac.astra.polytechnic.epresent.constant.API_URL.FOTO_ABSENSI_URL;
import static id.ac.astra.polytechnic.epresent.constant.API_URL.FOTO_IZIN_URL;

@Service
public class AbsensiService {
    @Autowired
    AbsensiRepository absensiRepository;

    @Autowired
    IzinRepository izinRepository;

    @Autowired
    PenggunaRepository penggunaRepository;

    @Autowired
    private HariLiburRepository hariLiburRepository;


    @Autowired
    private ShiftKerjaRepository shiftKerjaRepository;

//    @Autowired
//    GoogleAPIService googleAPIService;

    @Value("${file.upload-present-dir}")
    private String uploadDir;



    public DtoResponse getAbsensiPengguna(Integer idParams) {
        List<Absensi> absensi = absensiRepository.findTop100ByIdPenggunaOrderByTanggalDesc(idParams);
        if (absensi.isEmpty()) {
            return new DtoResponse(404, null, "BarangKerja tidak ditemukan");
        }

        List<AbsensiVo> absensiVos = new ArrayList<>();

        for (Absensi item : absensi) {
            String urlFoto1 = FOTO_ABSENSI_URL + item.getBuktiKehadiran();
            String urlFoto2 = FOTO_ABSENSI_URL + item.getBuktiKehadiran2();

            // Ambil deskripsi shift berdasarkan ID
            String shiftDeskripsi = null;
            if (item.getIdShift() != null) {
                ShiftKerja shift = shiftKerjaRepository.findById(item.getIdShift()).orElse(null);
                if (shift != null) {
                    shiftDeskripsi = shift.getDeskripsi(); // asumsinya field-nya 'deskripsi'
                }
            }

            AbsensiVo absensiVo;
            if (item.getIdIzin() != null) {
                Izin selectedIzin = izinRepository.findById(item.getIdIzin()).orElse(null);
                absensiVo = new AbsensiVo(
                        item.getTanggal(),
                        item.getJamMasuk(),
                        item.getJamKeluar(),
                        shiftDeskripsi,
                        item.getStatusKehadiran(),
                        item.getIdIzin(),
                        urlFoto1,
                        urlFoto2,
                        selectedIzin != null ? FOTO_IZIN_URL + selectedIzin.getBuktiIzin() : null
//                        selectedIzin != null ? selectedIzin.getJenisIzin() : null,
//                        selectedIzin != null ? selectedIzin.getKeterangan() : null,
//                        selectedIzin != null ? selectedIzin.getStatusIzin() : null
                );
            } else {
                absensiVo = new AbsensiVo(
                        item.getTanggal(),
                        item.getJamMasuk(),
                        item.getJamKeluar(),
                        shiftDeskripsi, // ganti dari item.getIdShift()
                        item.getStatusKehadiran(),
                        item.getIdIzin(),
                        urlFoto1,
                        urlFoto2,
                        null
                );
            }
            absensiVos.add(absensiVo);
        }

        return new DtoResponse(200, absensiVos, "OK");
    }

    public DtoResponse saveAbsensi(MultipartFile file, AbsensiVoForm absensiVoForm) {
        try {
//            System.out.println("== MULAI SIMPAN ABSENSI ==");
//            System.out.println("ID Pengguna: " + absensiVoForm.getId_pengguna());
//            System.out.println("Jam: " + absensiVoForm.getJam());
//            System.out.println("Shift: " + absensiVoForm.getShift_kerja());
//            System.out.println("Status Kehadiran: " + absensiVoForm.getStatus_kehadiran());
//            System.out.println("Original file name: " + file.getOriginalFilename());
//            System.out.println("File empty? " + file.isEmpty());

            LocalDate hariIni = LocalDate.now();

            // Validasi hari Sabtu/Minggu
//            DayOfWeek day = hariIni.getDayOfWeek();
//            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY){
//                return new DtoResponse(500, "Gagal", "Hari libur" );
//            }
            // Ambil semua tanggal libur nasional
//            List<Departemen> listHariLibur = hariLiburRepository.findAll();
//            Set<LocalDate> tanggalLibur = listHariLibur.stream()
//                    .flatMap(h -> h.getTanggal_mulai().datesUntil(h.getTanggal_selesai().plusDays(1)))
//                    .collect(Collectors.toSet());
//
//            if (tanggalLibur.contains(hariIni)){
//                return new DtoResponse(500, "Gagal", "Hari libur" );
//            }

            //  Validasi data
            if (file == null || file.isEmpty()) {
                return new DtoResponse(400, "Gagal", "File tidak ditemukan atau kosong.");
            }

            if (absensiVoForm.getId_pengguna() == null || absensiVoForm.getJam() == null || absensiVoForm.getShift_kerja() == null) {
                return new DtoResponse(400, "Gagal", "Data absensi tidak lengkap.");
            }
            Path folderPath = Paths.get(uploadDir);
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
                System.out.println("Folder upload dibuat: " + uploadDir);
            }

            String namaFile = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, namaFile);

            Absensi existingAbsensi = absensiRepository.findByIdPenggunaAndTanggal(
                    absensiVoForm.getId_pengguna(), LocalDate.now());

            if (existingAbsensi == null) {
                Absensi absensiBaru = new Absensi(
                        LocalDate.now(),
                        absensiVoForm.getJam(),
                        null, // jam_keluar
                        absensiVoForm.getId_pengguna(),
                        absensiVoForm.getShift_kerja(),
                        absensiVoForm.getStatus_kehadiran(),
                        null, null, null
                );
                absensiBaru.setBuktiKehadiran(namaFile);
                absensiRepository.save(absensiBaru);
                Files.copy(file.getInputStream(), filePath);

                return new DtoResponse(200, absensiBaru, "Data masuk berhasil ditambahkan");
            } else {

                if (existingAbsensi.getIdIzin() != null) {
                    Izin selectedIzin = izinRepository.findById(existingAbsensi.getIdIzin()).orElse(null);
                    assert selectedIzin != null;
                    if (selectedIzin.getStatusIzin() == 0 || selectedIzin.getStatusIzin() == -1){
                        if (existingAbsensi.getJamMasuk() == null){
                            existingAbsensi.setJamMasuk(absensiVoForm.getJam());
                        } else {
                            existingAbsensi.setJamKeluar(absensiVoForm.getJam());
                        }

                        existingAbsensi.setIdIzin(null);
                        existingAbsensi.setStatusKehadiran(absensiVoForm.getStatus_kehadiran());
                        existingAbsensi.setIdShift(absensiVoForm.getShift_kerja());
                        existingAbsensi.setBuktiKehadiran(namaFile);

                        absensiRepository.save(existingAbsensi);
                        Files.copy(file.getInputStream(), filePath);
                        return new DtoResponse(200, existingAbsensi, "Data berhasil disimpan");
                    }
                }

                existingAbsensi.setJamKeluar(absensiVoForm.getJam());
                existingAbsensi.setStatusKehadiran(absensiVoForm.getStatus_kehadiran());
                existingAbsensi.setBuktiKehadiran2(namaFile);

                absensiRepository.save(existingAbsensi);
                Files.copy(file.getInputStream(), filePath);

                return new DtoResponse(200, existingAbsensi, "Data pulang berhasil ditambahkan");
            }

        } catch (Exception e) {
            System.out.println(" Terjadi kesalahan saat menyimpan absensi:");
            e.printStackTrace();
            return new DtoResponse(500, "Gagal", "Terjadi kesalahan internal saat menyimpan absensi.");
        }

    }
    @Transactional
    public void updateStatusAbsensiBerdasarkanShift() {
        absensiRepository.updateStatusAbsensiBerdasarkanShift();
    }

    @Transactional
    public void createAbsensiAlpa() {
        LocalDate hariIni = LocalDate.now();

        // Validasi hari Sabtu/Minggu
        DayOfWeek day = hariIni.getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) return;

        // Validasi hari libur nasional
//        if (googleAPIService.isHariLibur(hariIni)) return;

        List<Pengguna> semuaPengguna = penggunaRepository.findByStatus(1);

        for (Pengguna pengguna : semuaPengguna) {
            boolean sudahAbsen = absensiRepository.existsByIdPenggunaAndTanggal(pengguna.getId_pengguna(), hariIni);

            if (!sudahAbsen) {
                Absensi alpa = new Absensi();
                alpa.setTanggal(hariIni);
                alpa.setIdPengguna(pengguna.getId_pengguna());
                alpa.setStatusKehadiran("Alpa");

                absensiRepository.save(alpa);
            }
        }
    }



}
