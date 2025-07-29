package id.ac.astra.polytechnic.backend_5s_sisprod.service;

import id.ac.astra.polytechnic.epresent.repository.AbsensiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    @Autowired
    private AbsensiRepository absensiRepository;
//    @Autowired
//    GoogleAPIService googleAPIService;

    public Map<String, Object> getRekapSebulan(Integer userId) {
        List<Object[]> hasil = absensiRepository.getRekapAbsensi(userId);

        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();

        for (Object[] row : hasil) {
            labels.add((String) row[0]);                 // status (e.g., Hadir, SOP)
            data.add(((Number) row[1]).intValue());      // jumlah
        }

        Map<String, Object> chartData = new HashMap<>();
        chartData.put("labels", labels);
        chartData.put("data", data);
        return chartData;
    }

//    public Map<String, Object> getPersentaseHadirBulanan(Integer userId) {
//        List<Object[]> hasil = absensiRepository.getPersentasePerBulan(userId); // panggil SP
//
//        List<String> labels = new ArrayList<>();
//        List<Double> data = new ArrayList<>();
//
//        // 1. Ambil semua range tanggal dari seluruh bulan yang ada di hasil
//        Set<LocalDate> semuaTanggal = new HashSet<>();
//
//        for (Object[] row : hasil) {
//            String bulanStr = (String) row[0]; // format: yyyy-MM
//            YearMonth ym = YearMonth.parse(bulanStr);
//            LocalDate start = ym.atDay(1);
//            LocalDate end = ym.atEndOfMonth();
//
//            semuaTanggal.addAll(start.datesUntil(end.plusDays(1)).toList());
//        }
//
//        // 2. Ambil semua hari libur dalam satu batch
//        Set<LocalDate> tanggalLibur = semuaTanggal.stream()
//                .filter(t -> googleAPIService.isHariLibur(t)) // ← Panggilan API tetap di luar loop utama
//                .collect(Collectors.toSet());
//
//        // 3. Proses hasil per bulan
//        for (Object[] row : hasil) {
//            String bulanStr = (String) row[0]; // format: yyyy-MM
//            int hadir = ((Number) row[1]).intValue();
//
//            YearMonth ym = YearMonth.parse(bulanStr);
//            LocalDate start = ym.atDay(1);
//            LocalDate end = ym.atEndOfMonth();
//
//            long totalHariKerja = start.datesUntil(end.plusDays(1))
//                    .filter(date -> {
//                        DayOfWeek dow = date.getDayOfWeek();
//                        return dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY && !tanggalLibur.contains(date);
//                    })
//                    .count();
//
//            double persen = (totalHariKerja > 0) ? ((double) hadir / totalHariKerja) * 100 : 0.0;
//            labels.add(ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
//            data.add(Math.round(persen * 10.0) / 10.0);
//        }
//
//        Map<String, Object> chartData = new HashMap<>();
//        chartData.put("labels", labels);
//        chartData.put("data", data);
//        return chartData;
//    }

}
