package id.ac.astra.polytechnic.backend_5s_sisprod.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import id.ac.astra.polytechnic.epresent.model.Absensi;
import id.ac.astra.polytechnic.epresent.model.HariLibur;
import id.ac.astra.polytechnic.epresent.model.Izin;
import id.ac.astra.polytechnic.epresent.repository.AbsensiRepository;
import id.ac.astra.polytechnic.epresent.repository.HariLiburRepository;
import id.ac.astra.polytechnic.epresent.repository.IzinRepository;
import id.ac.astra.polytechnic.epresent.response.DtoResponse;
import id.ac.astra.polytechnic.epresent.vo.IzinVoForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static id.ac.astra.polytechnic.epresent.constant.API_URL.FOTO_IZIN_URL;

@Service
public class IzinService {
    @Autowired
    private IzinRepository izinRepository;

    @Autowired
    private AbsensiRepository absensiRepository;

    @Autowired
    private HariLiburRepository hariLiburRepository;

    @Value("${file.upload-permit-dir}")
    private String uploadDir;

    public DtoResponse saveIzin(MultipartFile file, IzinVoForm izinVoForm) {
        try {
            // 1. Generate nama file unik
            String namaFile = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // 2. Simpan file ke direktori
            Path path = Paths.get(uploadDir, namaFile);
            Files.copy(file.getInputStream(), path);

            // 3. Buat dan simpan entitas izin
            Izin izin = new Izin(
                    izinVoForm.getJenis_izin(),
                    izinVoForm.getKeterangan(),
                    null,
                    null,
                    0,
                    namaFile // ← simpan nama file ke kolom bukti_izin
            );
            izinRepository.save(izin);

            Integer newIdIzin = izin.getIdIzin(); // ← ID setelah insert

            LocalDate tanggalAwal = izinVoForm.getTanggal_awal();
            LocalDate tanggalAkhir = izinVoForm.getTanggal_akhir();

            if (tanggalAkhir == null) {
                tanggalAkhir = tanggalAwal;
            }

            // Ambil semua tanggal libur nasional
            List<HariLibur> listHariLibur = hariLiburRepository.findAll();
            Set<LocalDate> tanggalLibur = listHariLibur.stream()
                    .flatMap(h -> h.getTanggal_mulai().datesUntil(h.getTanggal_selesai().plusDays(1)))
                    .collect(Collectors.toSet());

            int jumlahHariIzin = 0;
            String outMessage = null;

            for (LocalDate tgl = tanggalAwal; !tgl.isAfter(tanggalAkhir); tgl = tgl.plusDays(1)) {
                DayOfWeek day = tgl.getDayOfWeek();

                // Skip hari Sabtu dan Minggu
                if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) continue;

                // Skip jika termasuk hari libur nasional
                if (tanggalLibur.contains(tgl)){
                    outMessage = "SOP gagal disimpan karena hari libur";
                    continue;
                }



                Absensi existing = absensiRepository.findByIdPenggunaAndTanggal(izinVoForm.getId_pengguna(), tgl);
                if (existing != null) {
                    outMessage = "SOP gagal disimpan karena sudah ada data";
                    continue;
                }
                Absensi absensi = new Absensi();
                absensi.setTanggal(tgl);
                absensi.setIdPengguna(izinVoForm.getId_pengguna());
                absensi.setStatusKehadiran("SOP");
                absensi.setIdShift(izinVoForm.getId_shift());
                absensi.setIdIzin(newIdIzin);
                absensiRepository.save(absensi);

                jumlahHariIzin++;
            }

            if (jumlahHariIzin == 0 && outMessage != null) {
                return new DtoResponse(200, "gagal", outMessage);
            }else {
                return new DtoResponse(200, "Sukses", "SOP berhasil disimpan untuk " + jumlahHariIzin + " hari kerja");

            }


        } catch (JsonProcessingException e) {
            return new DtoResponse(400, "Gagal", "Format data izin tidak valid: " + e.getMessage());
        } catch (IOException e) {
            return new DtoResponse(500, "Gagal", "Gagal menyimpan file bukti izin: " + e.getMessage());
        }
    }

    public DtoResponse saveIzinSementara(MultipartFile file, IzinVoForm izinVoForm) {
        try {
            LocalDate tanggalHariIni = LocalDate.now();

            // 1. Generate nama file unik
            String namaFile = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // 2. Simpan file ke direktori
            Path path = Paths.get(uploadDir, namaFile);
            Files.copy(file.getInputStream(), path);

            // 3. Buat dan simpan entitas izin
            Izin izin = new Izin(
                    izinVoForm.getJenis_izin(),
                    izinVoForm.getKeterangan(),
                    izinVoForm.getJamMulai(),
                    izinVoForm.getJamAkhir(),
                    0,
                    namaFile
            );
            izinRepository.save(izin);

            Integer newIdIzin = izin.getIdIzin();

            // 4. Cek apakah sudah ada absensi untuk pengguna dan tanggal hari ini
            Absensi existing = absensiRepository.findByIdPenggunaAndTanggal(
                    izinVoForm.getId_pengguna(), tanggalHariIni);

            if (existing != null) {
                // Sudah ada absensi → update menjadi izin
                existing.setStatusKehadiran("SOP");
                existing.setIdIzin(newIdIzin);
                absensiRepository.save(existing);

                return new DtoResponse(200, "Sukses", "BarangKerja hari ini diubah menjadi SOP Sementara.");
            }

            // 5. Belum ada absensi → buat absensi baru dengan status "SOP"
            Absensi absensi = new Absensi();
            absensi.setTanggal(tanggalHariIni);
            absensi.setIdPengguna(izinVoForm.getId_pengguna());
            absensi.setStatusKehadiran("SOP");
            absensi.setIdShift(izinVoForm.getId_shift());
            absensi.setIdIzin(newIdIzin);
            absensiRepository.save(absensi);

            return new DtoResponse(200, "Sukses", "Data izin sementara berhasil disimpan.");

        } catch (JsonProcessingException e) {
            return new DtoResponse(400, "Gagal", "Format data izin sementara tidak valid: " + e.getMessage());
        } catch (IOException e) {
            return new DtoResponse(500, "Gagal", "Gagal menyimpan file bukti izin sementara: " + e.getMessage());
        }
    }
    public DtoResponse approveIzin(Integer idIzinParams) {
        Optional<Izin> izinOptional = izinRepository.findById(idIzinParams);

        if (izinOptional.isPresent()) {
            Izin izin = izinOptional.get();
            izin.setStatusIzin(1); // 1 = Disetujui
            izinRepository.save(izin);
            return new DtoResponse(200, "Sukses", "SOP berhasil disetujui");
        } else {
            return new DtoResponse(404, "Gagal", "SOP tidak ditemukan");
        }
    }


    public DtoResponse approveIzinSementara(Integer idIzinParams) {
        Optional<Izin> izinOpt = izinRepository.findById(idIzinParams);

        if (izinOpt.isEmpty()) {
            return new DtoResponse(404, "Gagal", "SOP tidak ditemukan");
        }

        Izin izin = izinOpt.get();
        izin.setStatusIzin(1); // 1 = Disetujui
        izinRepository.save(izin);

        return new DtoResponse(200, "Sukses", "SOP sementara berhasil disetujui");
    }


    public DtoResponse getExistingIzin(Integer idIzinParams) {
        List<Date> sqlDateLists = absensiRepository.findTanggalIzinMendatangByIdPengguna(idIzinParams);
        List<LocalDate> dateLists = sqlDateLists.stream().map(Date::toLocalDate).collect(Collectors.toList());
        return new DtoResponse(200, dateLists, "OK");
    }

    public DtoResponse getIzinPengguna(Integer izinParams) {
        Izin izin = izinRepository.findById(izinParams).orElse(null);

        if (izin == null) {
            return new DtoResponse(404, null, "SOP tidak ditemukan");
        }

        String urlFoto = FOTO_IZIN_URL + izin.getBuktiIzin();
        izin.setBuktiIzin(urlFoto);

        return new DtoResponse(200, izin, "OK");
    }
}
