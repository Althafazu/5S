package id.ac.astra.polytechnic.backend_5s_sisprod.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class GoogleAPIService {

//    @Value("${google.calendar.api-key}")
    private final String API_KEY = "AIzaSyASdAnPyCeRCUpdpU4BcVKMI9G4xlx1wvA";
//    @Value("${google.calendar.id}")
    private final String CALENDAR_ID = "id.indonesian#holiday@group.v.calendar.google.com";
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean isHariLibur(LocalDate tanggal) {
        String timeMin = tanggal.atStartOfDay().format(DateTimeFormatter.ISO_DATE_TIME) + "Z";
        String timeMax = tanggal.plusDays(1).atStartOfDay().format(DateTimeFormatter.ISO_DATE_TIME) + "Z";

        String url = String.format(
                "https://www.googleapis.com/calendar/v3/calendars/%s/events?timeMin=%s&timeMax=%s&key=%s",
                CALENDAR_ID,
                timeMin,
                timeMax,
                API_KEY
        );

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getBody() != null && response.getBody().contains("items");
        } catch (Exception e) {
            e.printStackTrace();
            return false; // fallback
        }
    }
}
