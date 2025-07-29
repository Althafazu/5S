package id.ac.astra.polytechnic.backend_5s_sisprod.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ms_pengguna")
public class Pengguna {
    @Id
    @Column(name = "id_pengguna")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_pengguna;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "nama_lengkap")
    private String nama_lengkap;

    @Column(name = "alamat")
    private String alamat;

    @Column(name = "id_departemen")
    private Integer idDepartemen;

    @Column(name = "role")
    private Integer role;

    @Column(name = "status")
    private Integer status;

    public Pengguna(Integer id_pengguna, String username, String password, String nama_lengkap, String alamat, Integer idDepartemen, Integer role, Integer status) {
        this.id_pengguna = id_pengguna;
        this.username = username;
        this.password = password;
        this.nama_lengkap = nama_lengkap;
        this.alamat = alamat;
        this.idDepartemen = idDepartemen;
        this.role = role;
        this.status = status;
    }

    public Pengguna() {}

    public Integer getId_pengguna() {
        return id_pengguna;
    }

    public void setId_pengguna(Integer id_pengguna) {
        this.id_pengguna = id_pengguna;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNama_lengkap() {
        return nama_lengkap;
    }

    public void setNama_lengkap(String nama_lengkap) {
        this.nama_lengkap = nama_lengkap;
    }

    public String getAlamat() {
        return alamat;
    }

    public void setAlamat(String alamat) {
        this.alamat = alamat;
    }

    public Integer getIdDepartemen() {
        return idDepartemen;
    }

    public void setIdDepartemen(Integer idDepartemen) {
        this.idDepartemen = idDepartemen;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
