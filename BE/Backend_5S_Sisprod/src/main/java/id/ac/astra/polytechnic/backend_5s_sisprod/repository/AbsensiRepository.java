package id.ac.astra.polytechnic.backend_5s_sisprod.repository;

import id.ac.astra.polytechnic.epresent.model.Absensi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository("AbsensiRepository")
public interface AbsensiRepository extends JpaRepository<Absensi, Integer> {
    List<Absensi> findTop100ByIdPenggunaOrderByTanggalDesc(Integer idParams);
    List<Absensi> findByIdIzin(Integer idIzin);
    Absensi findByIdPenggunaAndTanggal(Integer idPengguna, LocalDate tanggal);
    boolean existsByIdPenggunaAndTanggal(Integer idPengguna, LocalDate tanggal);

    @Query(value = "CALL spRekapAbsensiSebulan(:userId)", nativeQuery = true)
    List<Object[]> getRekapAbsensi(@Param("userId") Integer userId);

    @Query(value = "SELECT tanggal FROM tr_absensi WHERE tanggal > CURDATE() AND id_izin IS NOT NULL AND id_pengguna = ?1", nativeQuery = true)
    List<java.sql.Date> findTanggalIzinMendatangByIdPengguna(Integer idPengguna);

    @Modifying
    @Query(value =
            "UPDATE tr_absensi a " +
                    "JOIN ms_shift_kerja b ON a.id_shift = b.id_shift " +
                    "SET a.status_kehadiran = 'Tidak absen pulang'," +
                    "a.jam_keluar = null " +
                    "WHERE b.status = 1 " +
                    "AND a.tanggal = CURDATE() " +
                    "AND (a.jam_keluar IS NULL OR a.jam_keluar > ADDTIME(b.jam_pulang, '01:00:00'))",
            nativeQuery = true)
    void updateStatusAbsensiBerdasarkanShift();

//    @Query(value = "CALL spHadirPerBulan(:userId)", nativeQuery = true)
//    List<Object[]> getPersentasePerBulan(@Param("userId") Integer userId);
}
