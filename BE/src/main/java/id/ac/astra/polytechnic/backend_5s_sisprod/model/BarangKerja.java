package id.ac.astra.polytechnic.backend_5s_sisprod.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ms_barang_kerja")
public class BarangKerja {
    @Id
    @Column(name = "id_barang")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idBarang;

    @Column(name = "nama_barang")
    private String namaBarang;

    @Column(name = "id_pengguna")
    private Integer idPengguna;

    @Column(name = "id_departemen")
    private Integer idDepartemen;

    @Column(name = "jenis_kepemilikan")
    private Integer jenisKepemilikan;

    @Column(name = "jumlah")
    private Integer jumlah;

    @Column(name = "status_penggunaan")
    private Integer statusPenggunaan;

    @Column(name = "alasan_tidak_dipakai")
    private String alasanTidakDipakai;

    @Column(name = "tindak_lanjut")
    private Integer tindakLanjut;

    public BarangKerja(Integer idBarang, String namaBarang, Integer idPengguna, Integer idDepartemen, Integer jenisKepemilikan, Integer jumlah, Integer statusPenggunaan, String alasanTidakDipakai, Integer tindakLanjut) {
        this.idBarang = idBarang;
        this.namaBarang = namaBarang;
        this.idPengguna = idPengguna;
        this.idDepartemen = idDepartemen;
        this.jenisKepemilikan = jenisKepemilikan;
        this.jumlah = jumlah;
        this.statusPenggunaan = statusPenggunaan;
        this.alasanTidakDipakai = alasanTidakDipakai;
        this.tindakLanjut = tindakLanjut;
    }

    public BarangKerja() {}

    public Integer getIdBarang() {
        return idBarang;
    }

    public void setIdBarang(Integer idBarang) {
        this.idBarang = idBarang;
    }

    public String getNamaBarang() {
        return namaBarang;
    }

    public void setNamaBarang(String namaBarang) {
        this.namaBarang = namaBarang;
    }

    public Integer getIdPengguna() {
        return idPengguna;
    }

    public void setIdPengguna(Integer idPengguna) {
        this.idPengguna = idPengguna;
    }

    public Integer getIdDepartemen() {
        return idDepartemen;
    }

    public void setIdDepartemen(Integer idDepartemen) {
        this.idDepartemen = idDepartemen;
    }

    public Integer getJenisKepemilikan() {
        return jenisKepemilikan;
    }

    public void setJenisKepemilikan(Integer jenisKepemilikan) {
        this.jenisKepemilikan = jenisKepemilikan;
    }

    public Integer getJumlah() {
        return jumlah;
    }

    public void setJumlah(Integer jumlah) {
        this.jumlah = jumlah;
    }

    public Integer getStatusPenggunaan() {
        return statusPenggunaan;
    }

    public void setStatusPenggunaan(Integer statusPenggunaan) {
        this.statusPenggunaan = statusPenggunaan;
    }

    public String getAlasanTidakDipakai() {
        return alasanTidakDipakai;
    }

    public void setAlasanTidakDipakai(String alasanTidakDipakai) {
        this.alasanTidakDipakai = alasanTidakDipakai;
    }

    public Integer getTindakLanjut() {
        return tindakLanjut;
    }

    public void setTindakLanjut(Integer tindakLanjut) {
        this.tindakLanjut = tindakLanjut;
    }
}
