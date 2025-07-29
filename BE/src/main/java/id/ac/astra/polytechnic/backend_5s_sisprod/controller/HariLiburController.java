package id.ac.astra.polytechnic.backend_5s_sisprod.controller;

import id.ac.astra.polytechnic.epresent.model.HariLibur;
import id.ac.astra.polytechnic.epresent.response.DtoResponse;
import id.ac.astra.polytechnic.epresent.service.HariLiburService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/holiday")
@CrossOrigin
public class HariLiburController {
    @Autowired
    private HariLiburService hariLiburService;

    HariLiburController(HariLiburService hariLiburService) {
        this.hariLiburService = hariLiburService;
    }

    @GetMapping("/getHolidays")
    public DtoResponse getHolidays() {
        return hariLiburService.getHariLibur();
    }

    @PostMapping("/addHolidays")
    public DtoResponse saveHolidays(@RequestBody HariLibur hariLibur) {
        return hariLiburService.saveHariLibur(hariLibur);
    }
}
