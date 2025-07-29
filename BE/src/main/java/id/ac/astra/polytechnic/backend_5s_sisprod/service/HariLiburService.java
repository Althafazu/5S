package id.ac.astra.polytechnic.backend_5s_sisprod.service;

import id.ac.astra.polytechnic.epresent.model.HariLibur;
import id.ac.astra.polytechnic.epresent.repository.HariLiburRepository;
import id.ac.astra.polytechnic.epresent.response.DtoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HariLiburService {
    @Autowired
    private HariLiburRepository hariLiburRepository;

    public DtoResponse getHariLibur() {
        List<HariLibur> allHariLibur = hariLiburRepository.findAll();
        return new DtoResponse(200, allHariLibur, "OK");
    }

    public DtoResponse saveHariLibur(HariLibur hariLibur) {
        hariLiburRepository.save(hariLibur);
        return new DtoResponse(200, hariLibur, "OK");
    }
}
