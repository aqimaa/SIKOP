const db = require("../../config/database");

exports.lihatKreditUmroh = async (req, res) => {
  try {
    const query = `
      SELECT 
        ku.id,
        ku.id_anggota,
        pg.nama AS nama_anggota,
        ku.jumlah_pinjaman,
        ku.jangka_waktu,
        ku.total_angsuran,
        ku.pokok,
        ku.margin,
        ku.angsuran_ke,
        ku.sisa_piutang,
        ku.tanggal_mulai,
        ku.ket_status,
        ku.margin_persen
      FROM kredit_umroh ku
      JOIN anggota a ON ku.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      ORDER BY ku.id DESC;  
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error saat mengambil data kredit umroh:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data kredit umroh.");
      }
      if (results.length === 0) {
        return res.status(404).send("Data kredit umroh tidak ditemukan.");
      }

      res.render("koperasi/kreditKeuangan/kreditUmroh/lihatKreditUmroh", { kreditUmroh: results });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data kredit umroh.");
  }
};

exports.hapusKreditUmroh = async (req, res) => {
  const id = req.params.id;

  const deletePembayaranQuery = 'DELETE FROM pembayaran WHERE id_kredit_umroh = ?';

  db.query(deletePembayaranQuery, [id], (error, results) => {
    if (error) {
      console.error('Error saat menghapus data pembayaran:', error);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data pembayaran.' });
    }

    const deleteKreditUmrohQuery = 'DELETE FROM kredit_umroh WHERE id = ?';

    db.query(deleteKreditUmrohQuery, [id], (error, results) => {
      if (error) {
        console.error('Error saat menghapus data kredit umroh:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data kredit umroh.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Data kredit umroh tidak ditemukan.' });
      }
      res.json({ success: true, message: 'Data kredit umroh berhasil dihapus.' });
    });
  });
};

exports.tambahKreditUmroh = async (req, res) => {
  const {
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    total_angsuran,
    pokok,
    margin,
    margin_persen,
    tanggal_mulai,
    sisa_piutang
  } = req.body;

  const query = `
    INSERT INTO kredit_umroh 
    (id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, pokok, margin, sisa_piutang, tanggal_mulai, ket_status, angsuran_ke, margin_persen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    total_angsuran,
    pokok,
    margin,
    sisa_piutang,
    tanggal_mulai,
    'Belum Lunas',
    0,
    margin_persen
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat menambahkan kredit umroh:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menambahkan kredit umroh." });
    }
    res.redirect('/lihatKreditUmroh');
  });
};

exports.getAnggotaById = async (req, res) => {
  const idAnggota = req.params.id;

  const query = `
      SELECT pg.nama 
      FROM anggota a
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE a.id = ?
  `;

  db.query(query, [idAnggota], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data anggota:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil data anggota." });
    }
    if (results.length === 0) {
      return res.json({ success: false, message: "Anggota tidak ditemukan." });
    }
    res.json({ success: true, nama: results[0].nama });
  });
};

exports.cariAnggota = async (req, res) => {
  const { keyword } = req.query;
  try {
    const query = `
          SELECT 
              ku.id,
              ku.id_anggota,
              pg.nama AS nama_anggota,
              ku.jumlah_pinjaman,
              ku.jangka_waktu,
              ku.total_angsuran,
              ku.pokok,
              ku.margin,
              ku.angsuran_ke,
              ku.sisa_piutang,
              ku.tanggal_mulai,
              ku.ket_status,
              ku.margin_persen
          FROM kredit_umroh ku
          JOIN anggota a ON ku.id_anggota = a.id
          JOIN pegawai pg ON a.nip_anggota = pg.nip
          WHERE pg.nama LIKE ? OR ku.id_anggota LIKE ?
      `;
    db.query(query, [`%${keyword}%`, `%${keyword}%`], (error, results) => {
      if (error) {
        console.error("Error saat mencari data kredit umroh:", error);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mencari data kredit umroh." });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat mencari data kredit umroh." });
  }
};

exports.tampilkanBayarKreditUmroh = async (req, res) => {
  const id = req.params.id;

  const queryKreditUmroh = `
      SELECT
          ku.id,
          ku.id_anggota,
          pg.nama AS nama_anggota,
          ku.jumlah_pinjaman,
          ku.jangka_waktu,
          ku.total_angsuran,
          ku.pokok,
          ku.margin,
          ku.angsuran_ke,
          ku.sisa_piutang,
          ku.tanggal_mulai,
          ku.ket_status
      FROM kredit_umroh ku
      JOIN anggota a ON ku.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE ku.id = ?
  `;

  const queryPembayaran = `
      SELECT
          tanggal_bayar,
          angsuran_ke,
          jumlah_bayar,
          ket
      FROM pembayaran
      WHERE id_kredit_umroh = ?
      ORDER BY tanggal_bayar DESC
  `;

  db.query(queryKreditUmroh, [id], (error, resultsKreditUmroh) => {
      if (error) {
          console.error("Error saat mengambil data kredit umroh:", error);
          return res.status(500).send("Terjadi kesalahan saat mengambil data kredit umroh.");
      }

      if (resultsKreditUmroh.length === 0) {
          return res.status(404).send("Data kredit umroh tidak ditemukan.");
      }

      const kreditUmroh = resultsKreditUmroh[0];

      db.query(queryPembayaran, [id], (error, resultsPembayaran) => {
          if (error) {
              console.error("Error saat mengambil riwayat pembayaran:", error);
              return res.status(500).send("Terjadi kesalahan saat mengambil riwayat pembayaran.");
          }

          res.render("koperasi/kreditKeuangan/kreditUmroh/bayarKreditUmroh", {
              kreditUmroh: kreditUmroh,
              riwayatPembayaran: resultsPembayaran,
          });
      });
  });
};


exports.prosesBayar = async (req, res) => {
  const idKreditUmroh = req.params.id;
  const { tanggal_bayar, jumlah_bayar, keterangan } = req.body;
  
  try {
      // Pastikan jumlah_bayar ada dan tidak undefined
      if (!jumlah_bayar) {
          return res.status(400).json({ 
              success: false, 
              message: "Jumlah pembayaran harus diisi." 
          });
      }

      // Bersihkan dan format jumlah_bayar
      const jumlahBayar = parseFloat(jumlah_bayar.replace(/[^0-9,]/g, '').replace(',', '.'));

      // Pastikan jumlahBayar adalah angka yang valid
      if (isNaN(jumlahBayar)) {
          return res.status(400).json({ 
              success: false, 
              message: "Jumlah pembayaran tidak valid." 
          });
      }

      const queryKreditUmroh = `
          SELECT
              sisa_piutang,
              angsuran_ke,
              total_angsuran,
              pokok,
              margin
          FROM kredit_umroh
          WHERE id = ?
      `;

      db.query(queryKreditUmroh, [idKreditUmroh], (error, results) => {
          if (error) {
              console.error("Error saat mengambil data kredit umroh:", error);
              return res.status(500).json({ 
                  success: false, 
                  message: "Terjadi kesalahan saat mengambil data kredit umroh." 
              });
          }

          if (results.length === 0) {
              return res.status(404).json({ 
                  success: false, 
                  message: "Data kredit umroh tidak ditemukan." 
              });
          }

          const kreditUmroh = results[0];
          const sisaPiutangBaru = kreditUmroh.sisa_piutang - jumlahBayar;
          const angsuranKeBaru = kreditUmroh.angsuran_ke + 1;
          const statusPinjaman = sisaPiutangBaru <= 0 ? 'Lunas' : 'Belum Lunas';

          const insertPembayaranQuery = `
              INSERT INTO pembayaran 
                  (id_kredit_umroh, tanggal_bayar, jumlah_bayar, ket, angsuran_ke)
              VALUES (?, ?, ?, ?, ?)
          `;

          db.query(
              insertPembayaranQuery,
              [idKreditUmroh, tanggal_bayar, jumlahBayar, keterangan, angsuranKeBaru],
              (error, results) => {
                  if (error) {
                      console.error("Error saat mencatat pembayaran:", error);
                      return res.status(500).json({ 
                          success: false, 
                          message: "Terjadi kesalahan saat mencatat pembayaran." 
                      });
                  }

                  const updateKreditUmrohQuery = `
                      UPDATE kredit_umroh
                      SET
                          sisa_piutang = ?,
                          angsuran_ke = ?,
                          ket_status = ?
                      WHERE id = ?
                  `;

                  db.query(
                      updateKreditUmrohQuery,
                      [sisaPiutangBaru, angsuranKeBaru, statusPinjaman, idKreditUmroh],
                      (updateError, updateResults) => {
                          if (updateError) {
                              console.error("Error saat mengupdate sisa piutang dan angsuran_ke:", updateError);
                              return res.status(500).json({ 
                                  success: false, 
                                  message: "Terjadi kesalahan saat mengupdate sisa piutang dan angsuran_ke." 
                              });
                          }

                          res.redirect('/lihatKreditUmroh');
                      }
                  );
              }
          );
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Terjadi kesalahan saat memproses pembayaran kredit umroh.");
  }
};

exports.tampilkanEditKreditUmroh = async (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT 
      ku.id,
      ku.id_anggota,
      pg.nama AS nama_anggota,
      ku.jumlah_pinjaman,
      ku.jangka_waktu,
      ku.total_angsuran,
      ku.pokok,
      ku.margin,
      ku.sisa_piutang,
      ku.tanggal_mulai,
      ku.margin_persen
    FROM kredit_umroh ku
    JOIN anggota a ON ku.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE ku.id = ?
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data kredit umroh:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data kredit umroh.");
    }
    if (results.length === 0) {
      return res.status(404).send("Data kredit umroh tidak ditemukan.");
    }

    const kreditUmroh = results[0];
    res.render("koperasi/kreditKeuangan/kreditUmroh/editKreditUmroh", { kreditUmroh });
  });
};

exports.simpanEditKreditUmroh = async (req, res) => {
  const id = req.params.id;
  const {
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    total_angsuran,
    pokok,
    margin,
    tanggal_mulai,
    sisa_piutang,
    margin_persen
  } = req.body;

  const query = `
    UPDATE kredit_umroh
    SET 
      id_anggota = ?,
      jumlah_pinjaman = ?,
      jangka_waktu = ?,
      total_angsuran = ?,
      pokok = ?,
      margin = ?,
      tanggal_mulai = ?,
      sisa_piutang = ?,
      margin_persen = ?
    WHERE id = ?
  `;

  const values = [
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    total_angsuran,
    pokok,
    margin,
    tanggal_mulai,
    sisa_piutang,
    margin_persen,
    id
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat mengupdate kredit umroh:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupdate kredit umroh." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Data kredit umroh tidak ditemukan." });
    }
    res.redirect('/lihatKreditUmroh');
  });
};

exports.cariAnggota = async (req, res) => {
  const { keyword } = req.query;
  try {
    const query = `
      SELECT 
        ku.id,
        ku.id_anggota,
        pg.nama AS nama_anggota,
        ku.jumlah_pinjaman,
        ku.jangka_waktu,
        ku.total_angsuran,
        ku.pokok,
        ku.margin,
        ku.angsuran_ke,
        ku.sisa_piutang,
        ku.tanggal_mulai,
        ku.ket_status,
        ku.margin_persen
      FROM kredit_umroh ku
      JOIN anggota a ON ku.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE pg.nama LIKE ? OR ku.id_anggota LIKE ?
    `;
    db.query(query, [`%${keyword}%`, `%${keyword}%`], (error, results) => {
      if (error) {
        console.error("Error saat mencari data kredit umroh:", error);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mencari data kredit umroh." });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat mencari data kredit umroh." });
  }
};