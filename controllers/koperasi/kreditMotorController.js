const db = require("../../config/database");

exports.lihatKreditMotor = async (req, res) => {
  try {
    const query = `
      SELECT 
        km.id,
        km.id_anggota,
        pg.nama AS nama_anggota,
        km.jumlah_pinjaman,
        km.jangka_waktu,
        km.total_angsuran,
        km.pokok,
        km.margin,
        km.angsuran_ke,
        km.sisa_piutang,
        km.tanggal_mulai,
        km.ket_status,
        km.margin_persen
      FROM kredit_motor km
      JOIN anggota a ON km.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error saat mengambil data kredit motor:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data kredit motor.");
      }
      if (results.length === 0) {
        return res.status(404).send("Data kredit motor tidak ditemukan.");
      }

      res.render("koperasi/kreditKeuangan/kreditMotor/lihatKreditMotor", { kreditMotor: results });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data kredit motor.");
  }
};