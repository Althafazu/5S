package id.ac.astra.polytechnic.backend_5s_sisprod.service;

import id.ac.astra.polytechnic.epresent.JwtUtil;
import id.ac.astra.polytechnic.epresent.model.Pengguna;
import id.ac.astra.polytechnic.epresent.model.ShiftKerja;
import id.ac.astra.polytechnic.epresent.repository.PenggunaRepository;
import id.ac.astra.polytechnic.epresent.repository.ShiftKerjaRepository;
import id.ac.astra.polytechnic.epresent.response.DtoResponse;
import id.ac.astra.polytechnic.epresent.vo.PenggunaVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static id.ac.astra.polytechnic.epresent.constant.API_URL.FOTO_PENGGUNA_URL;


@Service
public class PenggunaService {

    @Autowired
    private PenggunaRepository penggunaRepository;

    @Autowired
    private ShiftKerjaRepository shiftKerjaRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    private DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm");

    @Value("${file.upload-profile-dir}")
    private String uploadDir;

    public DtoResponse saveUser(MultipartFile file, Pengguna user) {
        try {
            // 1. Generate nama file unik
            String namaFile = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // 2. Simpan file ke folder upload
            Path path = Paths.get(uploadDir, namaFile);
            Files.copy(file.getInputStream(), path);

            // 3. Enkripsi password
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);

            // 4. Set data tambahan
            user.setStatus(1);
            user.setFoto_pengguna(namaFile); // ← simpan nama file ke entitas

            // 5. Simpan ke database
            penggunaRepository.save(user);

            return new DtoResponse(200, user, "Pengguna berhasil disimpan");
        } catch (IOException e) {
            return new DtoResponse(500, null, "Gagal menyimpan foto pengguna");
        }
    }

    public DtoResponse updateProfilePic(MultipartFile file, Integer id_pengguna) {
        try {
            // 1. Cari data pengguna berdasarkan ID
            Optional<Pengguna> penggunaOpt = penggunaRepository.findById(id_pengguna);

            if (penggunaOpt.isEmpty()) {
                return new DtoResponse(404, null, "Pengguna tidak ditemukan");
            }

            Pengguna pengguna = penggunaOpt.get();

            // 2. Generate nama file baru
            String namaFileBaru = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // 3. Simpan file baru ke direktori upload
            Files.createDirectories(Paths.get(uploadDir)); // pastikan folder ada
            Path path = Paths.get(uploadDir, namaFileBaru);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // 4. (Opsional) Hapus file lama jika ada
            if (pengguna.getFoto_pengguna() != null && !pengguna.getFoto_pengguna().isEmpty()) {
                Path oldPath = Paths.get(uploadDir, pengguna.getFoto_pengguna());
                Files.deleteIfExists(oldPath);
            }

            // 5. Update field foto_pengguna di database
            pengguna.setFoto_pengguna(namaFileBaru);
            penggunaRepository.save(pengguna);
            pengguna.setFoto_pengguna(FOTO_PENGGUNA_URL + namaFileBaru);

            return new DtoResponse(200, pengguna, "Foto profil berhasil diperbarui");
        } catch (IOException e) {
            return new DtoResponse(500, null, "Gagal memperbarui foto profil");
        }
    }


    public DtoResponse login(Pengguna pengguna) {
        Pengguna currentUser = penggunaRepository.findByUsernameAndStatus(pengguna.getUsername(), 1);

        if (currentUser != null) {
            if (passwordEncoder.matches(pengguna.getPassword(), currentUser.getPassword())) {
                String token = jwtUtil.generateToken(currentUser.getUsername());
                ShiftKerja shiftKerja = shiftKerjaRepository.findByIdShift(currentUser.getId_shift());
                String shiftKerjaFull = shiftKerja.getJamMasuk().format(dtf) + " - " + shiftKerja.getJamPulang().format(dtf);

                String urlFoto = FOTO_PENGGUNA_URL + currentUser.getFoto_pengguna();

                PenggunaVo penggunaVo = new PenggunaVo(
                        currentUser.getId_pengguna(),
                        currentUser.getNama_lengkap(),
                        currentUser.getAlamat(),
                        currentUser.getId_shift(),
                        shiftKerja.getDeskripsi(),
                        shiftKerjaFull,
                        urlFoto
                );
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", penggunaVo);

                return new DtoResponse(200, response, "Berhasil Login");
            }
        }

        return new DtoResponse(404, null, "Username atau Password salah");
    }
}