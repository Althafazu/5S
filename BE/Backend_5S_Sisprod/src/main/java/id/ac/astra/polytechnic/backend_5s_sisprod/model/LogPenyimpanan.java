package id.ac.astra.polytechnic.backend_5s_sisprod.model;

import jakarta.persistence.*;

import java.sql.Timestamp;


@Entity
@Table(name = "tr_log_penyimpanan")
public class LogPenyimpanan {
    @Id
    @Column(name = "id_log")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLog;

    @Column(name = "id_barang")
    private Integer idBarang;

    @Column(name = "id_zona")
    private Integer idZona;

    @Column(name = "status")
    private Integer status;

    @Column(name = "waktu_log")
    private Timestamp waktuLog;

    @Column(name = "keterangan")
    private String keterangan;

    public LogPenyimpanan() {}

    public LogPenyimpanan(Integer idLog, Integer idBarang, Integer idZona, Integer status, Timestamp waktuLog, String keterangan) {
        this.idLog = idLog;
        this.idBarang = idBarang;
        this.idZona = idZona;
        this.status = status;
        this.waktuLog = waktuLog;
        this.keterangan = keterangan;
    }

    public Integer getIdLog() {
        return idLog;
    }

    public void setIdLog(Integer idLog) {
        this.idLog = idLog;
    }

    public Integer getIdBarang() {
        return idBarang;
    }

    public void setIdBarang(Integer idBarang) {
        this.idBarang = idBarang;
    }

    public Integer getIdZona() {
        return idZona;
    }

    public void setIdZona(Integer idZona) {
        this.idZona = idZona;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Timestamp getWaktuLog() {
        return waktuLog;
    }

    public void setWaktuLog(Timestamp waktuLog) {
        this.waktuLog = waktuLog;
    }

    public String getKeterangan() {
        return keterangan;
    }

    public void setKeterangan(String keterangan) {
        this.keterangan = keterangan;
    }
}
