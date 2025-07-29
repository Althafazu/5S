package id.ac.astra.polytechnic.backend_5s_sisprod.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import id.ac.astra.polytechnic.epresent.response.DtoResponse;
import id.ac.astra.polytechnic.epresent.service.IzinService;
import id.ac.astra.polytechnic.epresent.vo.IzinVoForm;
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
@RequestMapping("/reqPermit")
@CrossOrigin
public class IzinController {
    @Autowired
    private IzinService izinService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${file.upload-permit-dir}")
    private String uploadDir;

    IzinController(IzinService izinService) {
        this.izinService = izinService;
    }

    @GetMapping("/getReqPermit/{id}")
    public DtoResponse getReqPermit(@PathVariable Integer id) {
        return izinService.getIzinPengguna(id);
    }

    @GetMapping("/getExistingReqPermit/{id}")
    public DtoResponse getExisting(@PathVariable Integer id) {
        return izinService.getExistingIzin(id);
    }

    @PostMapping(value = "/addReqPermit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DtoResponse saveReqPermit(@RequestPart("file") MultipartFile file, @RequestPart("izin")String izinJson) throws IOException {
        IzinVoForm izinVoForm = objectMapper.readValue(izinJson, IzinVoForm.class);
        return  izinService.saveIzin(file, izinVoForm);
    }

    @PostMapping(value = "/addReqPermitSementara", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DtoResponse saveReqPermitSementara(@RequestPart("file") MultipartFile file, @RequestPart("izin")String izinJson) throws IOException {

        try {
            System.out.println("izin JSON: " + izinJson);
            IzinVoForm izinVoForm = objectMapper.readValue(izinJson, IzinVoForm.class);
            return izinService.saveIzinSementara(file, izinVoForm);
        } catch (Exception e) {
            e.printStackTrace();
            return new DtoResponse(500, null, "ERROR: " + e.getMessage());
        }
    }

    @PutMapping("/approveReqPermit/{id}")
    public DtoResponse approveReqPermit(@PathVariable Integer id) {
        return  izinService.approveIzin(id);
    }

    @PutMapping("/approveReqPermitSementara/{id}")
    public DtoResponse approveReqPermitSementara(@PathVariable Integer id) {
        return  izinService.approveIzinSementara(id);
    }


    @GetMapping("/foto/{filename}")
    public ResponseEntity<Resource> getFoto(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }
}
