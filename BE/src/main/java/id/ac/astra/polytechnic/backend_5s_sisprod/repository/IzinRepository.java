package id.ac.astra.polytechnic.backend_5s_sisprod.repository;

import id.ac.astra.polytechnic.epresent.model.Izin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("IzinRepository")
public interface IzinRepository extends JpaRepository<Izin, Integer>  {

}
