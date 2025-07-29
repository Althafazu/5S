package id.ac.astra.polytechnic.backend_5s_sisprod.vo;

import java.time.LocalDate;
import java.time.LocalTime;

public class AbsensiVo {
    private LocalDate tanggal;
    private LocalTime jam_masuk;
    private LocalTime jam_keluar;
    private String shift_kerja;
    private String status_kehadiran;
    private Integer id_izin;
    private String bukti_kehadiran;
    private String bukti_kehadiran2;
    private String bukti_izin;
//    private String jenis_izin;
//    private String keterangan_izin;
//    private Integer status_izin;


    public AbsensiVo(LocalDate tanggal, LocalTime jam_masuk, LocalTime jam_keluar, String shift_kerja, String status_kehadiran, Integer id_izin, String bukti_kehadiran, String bukti_kehadiran2, String bukti_izin) {
        this.tanggal = tanggal;
        this.jam_masuk = jam_masuk;
        this.jam_keluar = jam_keluar;
        this.shift_kerja = shift_kerja;
        this.status_kehadiran = status_kehadiran;
        this.id_izin = id_izin;
        this.bukti_kehadiran = bukti_kehadiran;
        this.bukti_kehadiran2 = bukti_kehadiran2;
        this.bukti_izin = bukti_izin;
    }

//    public AbsensiVo(LocalDate tanggal, LocalTime jam_masuk, LocalTime jam_keluar, String shift_kerja, String status_kehadiran, Integer id_izin, String bukti_kehadiran, String bukti_kehadiran2, String bukti_izin, String jenis_izin, String keterangan_izin, Integer status_izin) {
//        this.tanggal = tanggal;
//        this.jam_masuk = jam_masuk;
//        this.jam_keluar = jam_keluar;
//        this.shift_kerja = shift_kerja;
//        this.status_kehadiran = status_kehadiran;
//        this.id_izin = id_izin;
//        this.bukti_kehadiran = bukti_kehadiran;
//        this.bukti_kehadiran2 = bukti_kehadiran2;
//        this.bukti_izin = bukti_izin;
//        this.jenis_izin = jenis_izin;
//        this.keterangan_izin = keterangan_izin;
//        this.status_izin = status_izin;
//    }

    public AbsensiVo() {}

    public String getBukti_kehadiran2() {
        return bukti_kehadiran2;
    }

    public void setBukti_kehadiran2(String bukti_kehadiran2) {
        this.bukti_kehadiran2 = bukti_kehadiran2;
    }

    public LocalDate getTanggal() {
        return tanggal;
    }

    public void setTanggal(LocalDate tanggal) {
        this.tanggal = tanggal;
    }

    public LocalTime getJam_masuk() {
        return jam_masuk;
    }

    public void setJam_masuk(LocalTime jam_masuk) {
        this.jam_masuk = jam_masuk;
    }

    public LocalTime getJam_keluar() {
        return jam_keluar;
    }

    public void setJam_keluar(LocalTime jam_keluar) {
        this.jam_keluar = jam_keluar;
    }

    public String getShift_kerja() {
        return shift_kerja;
    }

    public void setShift_kerja(String shift_kerja) {
        this.shift_kerja = shift_kerja;
    }

    public String getStatus_kehadiran() {
        return status_kehadiran;
    }

    public void setStatus_kehadiran(String status_kehadiran) {
        this.status_kehadiran = status_kehadiran;
    }

    public Integer getId_izin() {
        return id_izin;
    }

    public void setId_izin(Integer id_izin) {
        this.id_izin = id_izin;
    }

    public String getBukti_kehadiran() {
        return bukti_kehadiran;
    }

    public void setBukti_kehadiran(String bukti_kehadiran) {
        this.bukti_kehadiran = bukti_kehadiran;
    }

    public String getBukti_izin() {
        return bukti_izin;
    }

    public void setBukti_izin(String bukti_izin) {
        this.bukti_izin = bukti_izin;
    }

//    public String getJenis_izin() {
//        return jenis_izin;
//    }
//
//    public void setJenis_izin(String jenis_izin) {
//        this.jenis_izin = jenis_izin;
//    }
//
//    public String getKeterangan_izin() {
//        return keterangan_izin;
//    }
//
//    public void setKeterangan_izin(String keterangan_izin) {
//        this.keterangan_izin = keterangan_izin;
//    }
//
//    public Integer getStatus_izin() {
//        return status_izin;
//    }
//
//    public void setStatus_izin(Integer status_izin) {
//        this.status_izin = status_izin;
//    }
}
