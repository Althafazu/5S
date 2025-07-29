package id.ac.astra.polytechnic.backend_5s_sisprod.model;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "ms_departemen")
public class Departemen {
    @Id
    @Column(name = "id_departemen")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDepartemen;

    @Column(name = "nama_departemen")
    private String namaDepartemen;

    @Column(name = "deskripsi")
    private String deskripsi;

    @Column(name = "status")
    private Integer status;


    public Departemen(Integer idDepartemen, String namaDepartemen, String deskripsi, Integer status) {
        this.idDepartemen = idDepartemen;
        this.namaDepartemen = namaDepartemen;
        this.deskripsi = deskripsi;
        this.status = status;
    }
    public Departemen() {}

    public Integer getIdDepartemen() {
        return idDepartemen;
    }

    public void setIdDepartemen(Integer idDepartemen) {
        this.idDepartemen = idDepartemen;
    }

    public String getNamaDepartemen() {
        return namaDepartemen;
    }

    public void setNamaDepartemen(String namaDepartemen) {
        this.namaDepartemen = namaDepartemen;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}