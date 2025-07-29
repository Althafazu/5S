package id.ac.astra.polytechnic.backend_5s_sisprod.model;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "ms_zona_simpan")
public class ZonaSimpan {
    @Id
    @Column(name = "id_zona")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idZona;

    @Column(name = "nama_zona")
    private String namaZona;

    @Column(name = "warnaZona")
    private String warnaZona;

    @Column(name = "deskripsi")
    private String deskripsi;

    public ZonaSimpan(Integer idZona, String namaZona, String warnaZona, String deskripsi) {
        this.idZona = idZona;
        this.namaZona = namaZona;
        this.warnaZona = warnaZona;
        this.deskripsi = deskripsi;
    }
    public ZonaSimpan() {}

    public Integer getIdZona() {
        return idZona;
    }

    public void setIdZona(Integer idZona) {
        this.idZona = idZona;
    }

    public String getNamaZona() {
        return namaZona;
    }

    public void setNamaZona(String namaZona) {
        this.namaZona = namaZona;
    }

    public String getWarnaZona() {
        return warnaZona;
    }

    public void setWarnaZona(String warnaZona) {
        this.warnaZona = warnaZona;
    }

    public String getDeskripsi() {
        return deskripsi;
    }

    public void setDeskripsi(String deskripsi) {
        this.deskripsi = deskripsi;
    }
}
