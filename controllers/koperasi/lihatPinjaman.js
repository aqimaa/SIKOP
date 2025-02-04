const db = require("../../config/database");

exports.lihatPinjaman = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.id_anggota,
        pg.nama AS nama_anggota,
        p.kategori,
        p.jumlah_pinjaman,
        p.jangka_waktu,
        p.margin_persen,
        p.angsuran_pokok,
        p.margin_per_bulan,
        p.total_angsuran,
        p.sisa_piutang,
        p.tanggal_perjanjian,
        p.ket_status
      FROM pinjaman p
      JOIN anggota a ON p.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error saat mengambil data pinjaman:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data pinjaman.");
      }
      if (results.length === 0) {
        return res.status(404).send("Data pinjaman tidak ditemukan.");
      }
      res.render("koperasi/pinjamanKeuangan/lihatPinjaman", { pinjaman: results });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data pinjaman.");
  }
};

// Fungsi untuk menghapus pinjaman
exports.hapusPinjaman = async (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM pinjaman WHERE id = ?';
  
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error saat menghapus data pinjaman:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data pinjaman.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Data pinjaman tidak ditemukan.' });
      }
      res.json({ success: true, message: 'Data pinjaman berhasil dihapus.' });
    });
  };