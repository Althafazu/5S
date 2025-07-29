package id.ac.astra.polytechnic.backend_5s_sisprod.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AbsensiScheduler {


    @Autowired
    AbsensiService absensiService;


    @Scheduled(cron = "0 30 23 * * *")
    public void cekKehadiranHariIni() {
        absensiService.updateStatusAbsensiBerdasarkanShift();
        absensiService.createAbsensiAlpa();
    }
}
