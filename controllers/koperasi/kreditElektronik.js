const db = require("../../config/database");

// Lihat Kredit Elektronik
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
      res.render("koperasi/kreditKeuangan/kreditElektronik/lihatKreditElektro", { kreditElektronik: results });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
  }
};

// Tambah Kredit Elektronik
exports.tambahKreditElektronik = async (req, res) => {
  const {
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai
  } = req.body;

  const query = `
    INSERT INTO kredit_elektronik
    (id_anggota, jumlah_pinjaman, jangka_waktu, margin_persen, tanggal_mulai, ket_status, angsuran_ke, sisa_piutang)
    VALUES (?, ?, ?, ?, ?, 'Belum Lunas', 0, ?)
  `;

  const values = [
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai,
    jumlah_pinjaman
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat menambahkan kredit elektronik:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menambahkan kredit elektronik." });
    }
    res.json({ success: true, message: "Data kredit elektronik berhasil ditambahkan." });
  });
};

// Edit Kredit Elektronik
exports.tampilkanEditKreditElektronik = async (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT
      ke.id,
      ke.id_anggota,
      pg.nama AS nama_anggota,
      ke.jumlah_pinjaman,
      ke.jangka_waktu,
      ke.margin_persen,
      ke.tanggal_mulai
    FROM kredit_elektronik ke
    JOIN anggota a ON ke.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE ke.id = ?
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data kredit elektronik:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
    }
    if (results.length === 0) {
      return res.status(404).send("Data kredit elektronik tidak ditemukan.");
    }
    const kredit = results[0];
    res.render("koperasi/kreditKeuangan/kreditElektronik/editKreditElektro", { kredit });
  });
};

exports.simpanEditKreditElektronik = async (req, res) => {
  const id = req.params.id;
  const {
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai
  } = req.body;

  const query = `
    UPDATE kredit_elektronik
    SET
      jumlah_pinjaman = ?,
      jangka_waktu = ?,
      margin_persen = ?,
      tanggal_mulai = ?
    WHERE id = ?
  `;

  const values = [
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai,
    id
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat mengupdate kredit elektronik:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupdate kredit elektronik." });
    }
    res.redirect('/lihatKreditElektronik');
  });
};

// Hapus Kredit Elektronik
exports.hapusKreditElektronik = async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM kredit_elektronik WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error saat menghapus kredit elektronik:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghapus kredit elektronik." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Data kredit elektronik tidak ditemukan." });
    }
    res.json({ success: true, message: "Data kredit elektronik berhasil dihapus." });
  });
};

// Bayar Kredit Elektronik
exports.tampilkanBayarKreditElektronik = async (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT
      ke.id,
      ke.id_anggota,
      pg.nama AS nama_anggota,
      ke.jumlah_pinjaman,
      ke.jangka_waktu,
      ke.sisa_piutang,
      ke.total_angsuran,
      ke.angsuran_ke
    FROM kredit_elektronik ke
    JOIN anggota a ON ke.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE ke.id = ?
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data kredit elektronik:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
    }
    if (results.length === 0) {
      return res.status(404).send("Data kredit elektronik tidak ditemukan.");
    }
    const kredit = results[0];
    res.render("koperasi/kreditKeuangan/kreditElektronik/bayarKreditElektro", { kredit });
  });
};

exports.prosesBayarKreditElektronik = async (req, res) => {
  const id = req.params.id;
  const { tanggal_bayar, jumlah_bayar, keterangan } = req.body;

  const getAngsuranKeQuery = `
    SELECT angsuran_ke, sisa_piutang
    FROM kredit_elektronik
    WHERE id = ?
  `;

  db.query(getAngsuranKeQuery, [id], (error, results) => {
    if (error) {
      console.error("Error saat mengambil angsuran_ke:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil angsuran_ke." });
    }

    const angsuranKe = results[0].angsuran_ke + 1;
    const sisaPiutangBaru = results[0].sisa_piutang - jumlah_bayar;

    const statusKredit = sisaPiutangBaru <= 0 ? 'Lunas' : 'Belum Lunas';

    const insertPembayaranQuery = `
      INSERT INTO pembayaran (id_kredit_elektronik, tanggal_bayar, jumlah_bayar, ket, angsuran_ke)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertPembayaranQuery, [id, tanggal_bayar, jumlah_bayar, keterangan, angsuranKe], (error, results) => {
      if (error) {
        console.error("Error saat mencatat pembayaran:", error);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mencatat pembayaran." });
      }

      const updateKreditQuery = `
        UPDATE kredit_elektronik
        SET sisa_piutang = ?,
            angsuran_ke = ?,
            ket_status = ?
        WHERE id = ?
      `;

      db.query(updateKreditQuery, [sisaPiutangBaru, angsuranKe, statusKredit, id], (updateError, updateResults) => {
        if (updateError) {
          console.error("Error saat mengupdate sisa piutang dan angsuran_ke:", updateError);
          return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupdate sisa piutang dan angsuran_ke." });
        }
        res.redirect('/lihatKreditElektronik');
      });
    });
  });
};

// Cari Kredit Elektronik
exports.cariKreditElektronik = async (req, res) => {
  const { keyword } = req.query;
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
        ke.ket_status
      FROM kredit_elektronik ke
      JOIN anggota a ON ke.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE pg.nama LIKE ? OR ke.id_anggota LIKE ?
    `;

    db.query(query, [`%${keyword}%`, `%${keyword}%`], (error, results) => {
      if (error) {
        console.error("Error saat mencari data kredit elektronik:", error);
        return res.status(500).send("Terjadi kesalahan saat mencari data kredit elektronik.");
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mencari data kredit elektronik.");
  }
};