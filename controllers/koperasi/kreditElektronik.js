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
        COALESCE(ke.margin, 0) AS margin, -- Memberikan nilai default 0 jika margin null
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
    tanggal_mulai,
    total_angsuran,
    total_angsuran_per_bulan,
    margin_per_bulan,
    pokok
  } = req.body;

  const query = `
    INSERT INTO kredit_elektronik
    (id_anggota, jumlah_pinjaman, jangka_waktu, margin_persen, tanggal_mulai, ket_status, angsuran_ke, sisa_piutang, total_angsuran, pokok, margin)
    VALUES (?, ?, ?, ?, ?, 'Belum Lunas', 0, ?, ?, ?, ?)
  `;

  const values = [
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai,
    jumlah_pinjaman,
    total_angsuran,
    pokok,
    margin_per_bulan
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
      ke.total_angsuran,
      ke.margin_persen,
      ke.pokok,
      ke.margin,
      ke.angsuran_ke,
      ke.sisa_piutang,
      ke.tanggal_mulai,
      ke.ket_status
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
  // Log seluruh body request untuk debugging
  console.log('Full Request Body:', req.body);
  console.log('Request Params:', req.params);

  const id = req.params.id;
  const {
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai,
    ket_status
  } = req.body;

  // Validasi input
  if (!id || !jumlah_pinjaman || !jangka_waktu) {
    return res.status(400).json({ 
      success: false, 
      message: "Data tidak lengkap" 
    });
  }

  const query = `
    UPDATE kredit_elektronik
    SET
      jumlah_pinjaman = ?,
      jangka_waktu = ?,
      margin_persen = ?,
      tanggal_mulai = ?,
      ket_status = ?
    WHERE id = ?
  `;

  const values = [
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai,
    ket_status,
    id
  ];

  // Tambahkan log untuk debug
  console.log('Update Kredit Elektronik - ID:', id);
  console.log('Update Values:', values);

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat mengupdate kredit elektronik:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Terjadi kesalahan saat mengupdate kredit elektronik.",
        error: error.message 
      });
    }

    // Periksa apakah ada baris yang terpengaruh
    if (results.affectedRows === 0) {
      console.warn(`Tidak ada baris yang diupdate untuk ID: ${id}`);
      return res.status(404).json({ 
        success: false, 
        message: "Data kredit elektronik tidak ditemukan" 
      });
    }

    res.json({ 
      success: true, 
      message: "Data kredit elektronik berhasil diperbarui" 
    });
  });
};


// Bayar Kredit Elektronik
exports.tampilkanBayarKreditElektronik = async (req, res) => {
  const id = req.params.id;
  
  // Query untuk mengambil data kredit elektronik
  const queryKreditElektronik = `
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

  // Query untuk mengambil riwayat pembayaran
  const queryPembayaran = `
      SELECT
          tanggal_bayar,
          angsuran_ke,
          jumlah_bayar,
          ket
      FROM pembayaran
      WHERE id_kredit_elektronik = ?
      ORDER BY tanggal_bayar DESC
  `;

  db.query(queryKreditElektronik, [id], (error, resultsKreditElektronik) => {
      if (error) {
          console.error("Error saat mengambil data kredit elektronik:", error);
          return res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
      }

      if (resultsKreditElektronik.length === 0) {
          return res.status(404).send("Data kredit elektronik tidak ditemukan.");
      }

      const kreditElektronik = resultsKreditElektronik[0];

      // Mengambil riwayat pembayaran
      db.query(queryPembayaran, [id], (error, resultsPembayaran) => {
          if (error) {
              console.error("Error saat mengambil riwayat pembayaran:", error);
              return res.status(500).send("Terjadi kesalahan saat mengambil riwayat pembayaran.");
          }

          // Render view dengan data kredit dan riwayat pembayaran
          res.render("koperasi/kreditKeuangan/kreditElektronik/bayarKreditElektro", {
              kredit: kreditElektronik,
              riwayatPembayaran: resultsPembayaran,
          });
      });
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
exports.cariKreditElektronik = (req, res) => {
  const { search } = req.query;
  
  // Tambahkan log
  console.log('Search Query:', search);
  
  const sql = `
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
      WHERE LOWER(pg.nama) LIKE LOWER(?)
      ORDER BY ke.id DESC
  `;

  // Tambahkan debug log
  console.log('Running query with search:', `%${search}%`);

  db.query(sql, [`%${search}%`], (err, results) => {
      if (err) {
          console.error("Error SQL:", err);
          return res.status(500).json({ 
              success: false,
              message: "Terjadi kesalahan saat mencari data",
              error: err.message 
          });
      }
      // Log hasil
      console.log('Search results:', results);
      res.json(results || []);
  });
};

exports.hapusKreditElektronik = (req, res) => {
  const id = req.params.id;

  // Hapus data pembayaran terkait terlebih dahulu
  db.query("DELETE FROM pembayaran WHERE id_kredit_elektronik = ?", [id], (errPembayaran) => {
    if (errPembayaran) {
      console.error("Error saat menghapus pembayaran:", errPembayaran);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus pembayaran"
      });
    }

    // Kemudian hapus data kredit elektronik
    db.query("DELETE FROM kredit_elektronik WHERE id = ?", [id], (error, result) => {
      if (error) {
        console.error("Error saat menghapus kredit elektronik:", error);
        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat menghapus kredit elektronik"
        });
      }

      // Periksa apakah data berhasil dihapus
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Data kredit elektronik tidak ditemukan"
        });
      }

      // Kirim respons sukses
      res.json({
        success: true,
        message: "Data kredit elektronik berhasil dihapus"
      });
    });
  });
};

