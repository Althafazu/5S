package id.ac.astra.polytechnic.backend_5s_sisprod.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "tr_penilaian")
public class Penilaian {
    @Id
    @Column(name = "id_penilaian")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPenilaian;

    @Column(name = "id_pengguna")
    private Integer idPengguna;

    @Column(name = "periode")
    private String periode;

    @Column(name = "nilai_seiri")
    private Integer nilaiSeiri;

    @Column(name = "nilai_seiton")
    private Integer nilaiSeiton;

    @Column(name = "nilai_seiso")
    private Integer nilaiSeiso;

    @Column(name = "nilai_seiketsu")
    private Integer nilaiSeiketsu;

    @Column(name = "nilai_shitsuke")
    private Integer nilaiShitsuke;

    @Column(name = "total_nilai")
    private Integer totalNilai;

    @Column(name = "catatan_penilai")
    private String catatanPenilai;

    @Column(name = "waktu_penilaian")
    private Timestamp waktuPenilaian;

    public Penilaian(Integer idPenilaian, Integer idPengguna, String periode, Integer nilaiSeiri, Integer nilaiSeiton, Integer nilaiSeiso, Integer nilaiSeiketsu, Integer nilaiShitsuke, Integer totalNilai, String catatanPenilai, Timestamp waktuPenilaian) {
        this.idPenilaian = idPenilaian;
        this.idPengguna = idPengguna;
        this.periode = periode;
        this.nilaiSeiri = nilaiSeiri;
        this.nilaiSeiton = nilaiSeiton;
        this.nilaiSeiso = nilaiSeiso;
        this.nilaiSeiketsu = nilaiSeiketsu;
        this.nilaiShitsuke = nilaiShitsuke;
        this.totalNilai = totalNilai;
        this.catatanPenilai = catatanPenilai;
        this.waktuPenilaian = waktuPenilaian;
    }
    public Penilaian() {}

    public Integer getIdPenilaian() {
        return idPenilaian;
    }

    public void setIdPenilaian(Integer idPenilaian) {
        this.idPenilaian = idPenilaian;
    }

    public Integer getIdPengguna() {
        return idPengguna;
    }

    public void setIdPengguna(Integer idPengguna) {
        this.idPengguna = idPengguna;
    }

    public String getPeriode() {
        return periode;
    }

    public void setPeriode(String periode) {
        this.periode = periode;
    }

    public Integer getNilaiSeiri() {
        return nilaiSeiri;
    }

    public void setNilaiSeiri(Integer nilaiSeiri) {
        this.nilaiSeiri = nilaiSeiri;
    }

    public Integer getNilaiSeiton() {
        return nilaiSeiton;
    }

    public void setNilaiSeiton(Integer nilaiSeiton) {
        this.nilaiSeiton = nilaiSeiton;
    }

    public Integer getNilaiSeiso() {
        return nilaiSeiso;
    }

    public void setNilaiSeiso(Integer nilaiSeiso) {
        this.nilaiSeiso = nilaiSeiso;
    }

    public Integer getNilaiSeiketsu() {
        return nilaiSeiketsu;
    }

    public void setNilaiSeiketsu(Integer nilaiSeiketsu) {
        this.nilaiSeiketsu = nilaiSeiketsu;
    }

    public Integer getNilaiShitsuke() {
        return nilaiShitsuke;
    }

    public void setNilaiShitsuke(Integer nilaiShitsuke) {
        this.nilaiShitsuke = nilaiShitsuke;
    }

    public Integer getTotalNilai() {
        return totalNilai;
    }

    public void setTotalNilai(Integer totalNilai) {
        this.totalNilai = totalNilai;
    }

    public String getCatatanPenilai() {
        return catatanPenilai;
    }

    public void setCatatanPenilai(String catatanPenilai) {
        this.catatanPenilai = catatanPenilai;
    }

    public Timestamp getWaktuPenilaian() {
        return waktuPenilaian;
    }

    public void setWaktuPenilaian(Timestamp waktuPenilaian) {
        this.waktuPenilaian = waktuPenilaian;
    }
}
