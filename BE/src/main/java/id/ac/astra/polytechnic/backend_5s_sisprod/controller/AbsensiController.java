package id.ac.astra.polytechnic.backend_5s_sisprod.controller;

import id.ac.astra.polytechnic.epresent.response.DtoResponse;
import id.ac.astra.polytechnic.epresent.service.AbsensiService;
import id.ac.astra.polytechnic.epresent.vo.AbsensiVoForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/present")
@CrossOrigin
public class AbsensiController {
    @Autowired
    AbsensiService absensiService;

    @Autowired

    @Value("${file.upload-present-dir}")
    private String uploadDir;

    AbsensiController(AbsensiService absensiService) {
        this.absensiService = absensiService;
    }

    @GetMapping("/getHistory/{id}")
    public DtoResponse getHistory(@PathVariable Integer id) {
        return absensiService.getAbsensiPengguna(id);
    }

    @PostMapping(value = "/addPresent", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DtoResponse savePresent(@RequestPart("file") MultipartFile file,
                                   @RequestPart("absensi") AbsensiVoForm absensi) {
        return absensiService.saveAbsensi(file, absensi);
    }

    @GetMapping("/foto/{filename}")
    public ResponseEntity<Resource> getFoto(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }

}
