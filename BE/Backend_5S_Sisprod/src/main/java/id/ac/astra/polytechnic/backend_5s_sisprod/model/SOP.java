package id.ac.astra.polytechnic.backend_5s_sisprod.model;

import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalTime;

@Entity
@Table(name = "ms_sop")
public class SOP {
    @Id
    @Column(name = "id_sop")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSop;

    @Column(name = "id_departemen")
    private Integer idDepartemen;

    @Column(name = "judul_sop")
    private String judulSop;

    @Column(name = "dokumen")
    private String dokumen;

    @Column(name = "status")
    private Integer status;

    public SOP(Integer idSop, Integer idDepartemen, String judulSop, String dokumen, Integer status) {
        this.idSop = idSop;
        this.idDepartemen = idDepartemen;
        this.judulSop = judulSop;
        this.dokumen = dokumen;
        this.status = status;
    }
    public SOP() {}

    public Integer getIdSop() {
        return idSop;
    }

    public void setIdSop(Integer idSop) {
        this.idSop = idSop;
    }

    public Integer getIdDepartemen() {
        return idDepartemen;
    }

    public void setIdDepartemen(Integer idDepartemen) {
        this.idDepartemen = idDepartemen;
    }

    public String getJudulSop() {
        return judulSop;
    }

    public void setJudulSop(String judulSop) {
        this.judulSop = judulSop;
    }

    public String getDokumen() {
        return dokumen;
    }

    public void setDokumen(String dokumen) {
        this.dokumen = dokumen;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
