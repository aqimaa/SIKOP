const db = require("../../config/database");

exports.lihatKreditElektronik = async (req, res) => {
  try {
    const query = `
      SELECT 
        ke.id,
        ke.id_anggota,
        pg.nama AS nama_anggota,
        ke.jumlah_pinjaman,
        ke.jangka_waktu,
        ke.total_angsuran,
        ke.pokok,
        ke.margin,
        ke.angsuran_ke,
        ke.sisa_piutang,
        ke.tanggal_mulai,
        ke.ket_status,
        ke.margin_persen
      FROM kredit_elektronik ke
      JOIN anggota a ON ke.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error saat mengambil data kredit elektronik:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
      }
      if (results.length === 0) {
        return res.status(404).send("Data kredit elektronik tidak ditemukan.");
      }

      res.render("koperasi/kreditKeuangan/kreditElektronik/lihatKreditElektro", { kreditElektronik: results });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
  }
};