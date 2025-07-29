package id.ac.astra.polytechnic.backend_5s_sisprod.vo;

import java.time.LocalDate;
import java.time.LocalTime;

public class IzinVoForm {
    private LocalDate tanggal_awal;
    private LocalDate tanggal_akhir;
    private String jenis_izin;
    private String keterangan;
    private LocalTime jamMulai;
    private  LocalTime jamAkhir;
    private String bukti_izin;
    private String id_shift;
    private Integer id_pengguna;


    public IzinVoForm(LocalDate tanggal_awal, LocalDate tanggal_akhir, String jenis_izin, String keterangan, LocalTime jamMulai,LocalTime jamAkhir,String bukti_izin,String id_shift, Integer id_pengguna) {
        this.tanggal_awal = tanggal_awal;
        this.tanggal_akhir = tanggal_akhir;
        this.jenis_izin = jenis_izin;
        this.keterangan = keterangan;
        this.jamMulai = jamMulai;
        this.jamAkhir = jamAkhir;
        this.bukti_izin = bukti_izin;
        this.id_shift = id_shift;
        this.id_pengguna = id_pengguna;
    }

    public String getId_shift() {
        return id_shift;
    }

    public void setId_shift(String id_shift) {
        this.id_shift = id_shift;
    }

    public LocalTime getJamMulai() {
        return jamMulai;
    }

    public void setJamMulai(LocalTime jamMulai) {
        this.jamMulai = jamMulai;
    }

    public LocalTime getJamAkhir() {
        return jamAkhir;
    }

    public void setJamAkhir(LocalTime jamAkhir) {
        this.jamAkhir = jamAkhir;
    }

    public Integer getId_pengguna() {
        return id_pengguna;
    }

    public void setId_pengguna(Integer id_pengguna) {
        this.id_pengguna = id_pengguna;
    }

    public LocalDate getTanggal_awal() {
        return tanggal_awal;
    }

    public void setTanggal_awal(LocalDate tanggal_awal) {
        this.tanggal_awal = tanggal_awal;
    }

    public LocalDate getTanggal_akhir() {
        return tanggal_akhir;
    }

    public void setTanggal_akhir(LocalDate tanggal_akhir) {
        this.tanggal_akhir = tanggal_akhir;
    }

    public String getJenis_izin() {
        return jenis_izin;
    }

    public void setJenis_izin(String jenis_izin) {
        this.jenis_izin = jenis_izin;
    }

    public String getKeterangan() {
        return keterangan;
    }

    public void setKeterangan(String keterangan) {
        this.keterangan = keterangan;
    }

    public String getBukti_izin() {
        return bukti_izin;
    }

    public void setBukti_izin(String bukti_izin) {
        this.bukti_izin = bukti_izin;
    }
}
