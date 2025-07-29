package id.ac.astra.polytechnic.backend_5s_sisprod.vo;


public class PenggunaVo {
    private Integer id_pengguna;
    private String nama_lengkap;
    private String alamat_lengkap;
    private String id_shift;
    private String nama_shift;
    private String jam_shift;
    private String foto_pengguna;

    public PenggunaVo() {}

    public PenggunaVo(Integer id_pengguna, String nama_lengkap, String alamat_lengkap, String id_shift, String nama_shift, String jam_shift, String foto_pengguna) {
        this.id_pengguna = id_pengguna;
        this.nama_lengkap = nama_lengkap;
        this.alamat_lengkap = alamat_lengkap;
        this.id_shift = id_shift;
        this.nama_shift = nama_shift;
        this.jam_shift = jam_shift;
        this.foto_pengguna = foto_pengguna;
    }

    public Integer getId_pengguna() {
        return id_pengguna;
    }

    public void setId_pengguna(Integer id_pengguna) {
        this.id_pengguna = id_pengguna;
    }

    public String getId_shift() {
        return id_shift;
    }

    public void setId_shift(String id_shift) {
        this.id_shift = id_shift;
    }

    public String getJam_shift() {
        return jam_shift;
    }

    public void setJam_shift(String jam_shift) {
        this.jam_shift = jam_shift;
    }

    public String getNama_lengkap() {
        return nama_lengkap;
    }

    public void setNama_lengkap(String nama_lengkap) {
        this.nama_lengkap = nama_lengkap;
    }

    public String getAlamat_lengkap() {
        return alamat_lengkap;
    }

    public void setAlamat_lengkap(String alamat_lengkap) {
        this.alamat_lengkap = alamat_lengkap;
    }

    public String getNama_shift() {
        return nama_shift;
    }

    public void setNama_shift(String nama_shift) {
        this.nama_shift = nama_shift;
    }

    public String getFoto_pengguna() {
        return foto_pengguna;
    }

    public void setFoto_pengguna(String foto_pengguna) {
        this.foto_pengguna = foto_pengguna;
    }
}
