package id.ac.astra.polytechnic.backend_5s_sisprod.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.ac.astra.polytechnic.epresent.model.Pengguna;
import id.ac.astra.polytechnic.epresent.response.DtoResponse;
import id.ac.astra.polytechnic.epresent.service.PenggunaService;
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
@RequestMapping("/user")
@CrossOrigin
public class PenggunaController {
    @Autowired
    PenggunaService penggunaService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${file.upload-profile-dir}")
    private String uploadDir;

    PenggunaController(PenggunaService penggunaService) {
        this.penggunaService = penggunaService;
    }

    @PostMapping("/login")
    public DtoResponse getUser(@RequestBody Pengguna pengguna) {
        return penggunaService.login(pengguna);
    }

    @PostMapping(value="/addUser", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DtoResponse saveUser(@RequestPart("file") MultipartFile file,
                                @RequestPart("pengguna") String penggunaJson) {
        Pengguna penggunaParam = objectMapper.convertValue(penggunaJson, Pengguna.class);
        return  penggunaService.saveUser(file, penggunaParam);
    }

    @PostMapping(value = "/updateProfilePic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DtoResponse updateFotoProfil(@RequestPart("file") MultipartFile file,
                                        @RequestParam("id") Integer id_pengguna) {
        return penggunaService.updateProfilePic(file, id_pengguna);
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
