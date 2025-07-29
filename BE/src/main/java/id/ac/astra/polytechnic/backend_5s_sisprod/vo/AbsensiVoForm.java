package id.ac.astra.polytechnic.backend_5s_sisprod.vo;

import java.time.LocalDate;
import java.time.LocalTime;

public class AbsensiVoForm {
    private LocalDate tanggal;
    private LocalTime jam;
    private Integer id_pengguna;
    private String shift_kerja;
    private String bukti_kehadiran;
    private String status_kehadiran;

    public AbsensiVoForm(LocalDate tanggal, LocalTime jam, Integer id_pengguna, String shift_kerja, String bukti_kehadiran, String status_kehadiran) {
        this.tanggal = tanggal;
        this.jam = jam;
        this.id_pengguna = id_pengguna;
        this.shift_kerja = shift_kerja;
        this.bukti_kehadiran = bukti_kehadiran;
        this.status_kehadiran = status_kehadiran;
    }

    public LocalDate getTanggal() {
        return tanggal;
    }

    public void setTanggal(LocalDate tanggal) {
        this.tanggal = tanggal;
    }

    public LocalTime getJam() {
        return jam;
    }

    public void setJam(LocalTime jam) {
        this.jam = jam;
    }

    public Integer getId_pengguna() {
        return id_pengguna;
    }

    public void setId_pengguna(Integer id_pengguna) {
        this.id_pengguna = id_pengguna;
    }

    public String getShift_kerja() {
        return shift_kerja;
    }

    public void setShift_kerja(String shift_kerja) {
        this.shift_kerja = shift_kerja;
    }

    public String getBukti_kehadiran() {
        return bukti_kehadiran;
    }

    public void setBukti_kehadiran(String bukti_kehadiran) {
        this.bukti_kehadiran = bukti_kehadiran;
    }

    public String getStatus_kehadiran() {
        return status_kehadiran;
    }

    public void setStatus_kehadiran(String status_kehadiran) {
        this.status_kehadiran = status_kehadiran;
    }
}
