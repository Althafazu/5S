package id.ac.astra.polytechnic.backend_5s_sisprod.repository;

import id.ac.astra.polytechnic.epresent.model.HariLibur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository("HariLiburRepository")
public interface HariLiburRepository extends JpaRepository<HariLibur, Integer> {

    @Query("SELECT h FROM Departemen h WHERE h.tanggal_mulai <= :akhir AND h.tanggal_selesai >= :awal")
    List<HariLibur> findLiburBetweenRange(@Param("awal") LocalDate awal, @Param("akhir") LocalDate akhir);


}
