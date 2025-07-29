package id.ac.astra.polytechnic.backend_5s_sisprod.repository;

import id.ac.astra.polytechnic.epresent.model.Pengguna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("PenggunaRepository")
public interface PenggunaRepository extends JpaRepository<Pengguna, Integer> {
    Pengguna findByUsernameAndStatus(String username, Integer status);
    List<Pengguna> findByStatus(Integer status);
}
