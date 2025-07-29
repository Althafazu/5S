package id.ac.astra.polytechnic.backend_5s_sisprod.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "tr_foto_tempat_kerja")
public class FotoTempatKerja {
    @Id
    @Column(name = "id_foto")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFoto;

    @Column(name = "id_pengguna")
    private Integer idPengguna;

    @Column(name = "jenis_foto")
    private Integer jenisFoto;

    @Column(name = "lokasi_kerja")
    private String lokasiKerja;

    @Column(name = "foto")
    private String foto;

    @Column(name = "waktu_foto")
    private Timestamp waktuFoto;

    public FotoTempatKerja() {}

    public FotoTempatKerja(Integer idFoto, Integer idPengguna, Integer jenisFoto, String lokasiKerja, String foto, Timestamp waktuFoto) {
        this.idFoto = idFoto;
        this.idPengguna = idPengguna;
        this.jenisFoto = jenisFoto;
        this.lokasiKerja = lokasiKerja;
        this.foto = foto;
        this.waktuFoto = waktuFoto;
    }

    public Integer getIdFoto() {
        return idFoto;
    }

    public void setIdFoto(Integer idFoto) {
        this.idFoto = idFoto;
    }

    public Integer getIdPengguna() {
        return idPengguna;
    }

    public void setIdPengguna(Integer idPengguna) {
        this.idPengguna = idPengguna;
    }

    public Integer getJenisFoto() {
        return jenisFoto;
    }

    public void setJenisFoto(Integer jenisFoto) {
        this.jenisFoto = jenisFoto;
    }

    public String getLokasiKerja() {
        return lokasiKerja;
    }

    public void setLokasiKerja(String lokasiKerja) {
        this.lokasiKerja = lokasiKerja;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public Timestamp getWaktuFoto() {
        return waktuFoto;
    }

    public void setWaktuFoto(Timestamp waktuFoto) {
        this.waktuFoto = waktuFoto;
    }
}
