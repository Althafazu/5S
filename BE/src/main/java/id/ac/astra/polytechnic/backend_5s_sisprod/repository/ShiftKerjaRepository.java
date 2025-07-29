package id.ac.astra.polytechnic.backend_5s_sisprod.repository;


import id.ac.astra.polytechnic.epresent.model.ShiftKerja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("ShiftKerjaRepository")
public interface ShiftKerjaRepository extends JpaRepository<ShiftKerja, String> {
//    @Query(value = "SELECT deskripsi, jam_masuk, jam_pulang FROM ms_shift_kerja where status = 1 and id_shift = ?1", nativeQuery = true)
    ShiftKerja findByIdShift(String id);
}
