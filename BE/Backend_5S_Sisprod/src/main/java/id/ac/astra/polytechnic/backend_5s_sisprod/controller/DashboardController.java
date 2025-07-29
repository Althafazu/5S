package id.ac.astra.polytechnic.backend_5s_sisprod.controller;


import id.ac.astra.polytechnic.epresent.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rekap")
@CrossOrigin
public class DashboardController {

    @Autowired
    DashboardService dashboardService;

    DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

        @GetMapping("/pieSebulan/{userId}")
    public ResponseEntity<?> getChartData(@PathVariable Integer userId) {
        return ResponseEntity.ok(dashboardService.getRekapSebulan(userId));
    }

//    @GetMapping("/lineAbsensiBulanan/{userId}")
//    public ResponseEntity<?> getChart(@PathVariable Integer userId) {
//        return ResponseEntity.ok(dashboardService.getPersentaseHadirBulanan(userId));
//    }

}
