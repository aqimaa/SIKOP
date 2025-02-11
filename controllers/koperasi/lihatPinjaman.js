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
        COALESCE(p.angsuran_pokok, 0) AS angsuran_pokok,
        COALESCE(p.margin_per_bulan, 0) AS margin_per_bulan,
        COALESCE(p.total_angsuran, 0) AS total_angsuran,
        COALESCE(p.sisa_piutang, 0) AS sisa_piutang,
        p.tanggal_perjanjian,
        p.ket_status,
        COALESCE(p.angsuran_ke, 0) AS angsuran_ke
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

      // Debug data
      console.log(results);

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

  // Hapus data pembayaran terkait terlebih dahulu
  const deletePembayaranQuery = 'DELETE FROM pembayaran WHERE id_pinjaman = ?';
  
  db.query(deletePembayaranQuery, [id], (error, results) => {
    if (error) {
      console.error('Error saat menghapus data pembayaran:', error);
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data pembayaran.' });
    }

    // Setelah data pembayaran dihapus, hapus data pinjaman
    const deletePinjamanQuery = 'DELETE FROM pinjaman WHERE id = ?';
    
    db.query(deletePinjamanQuery, [id], (error, results) => {
      if (error) {
        console.error('Error saat menghapus data pinjaman:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus data pinjaman.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Data pinjaman tidak ditemukan.' });
      }
      res.json({ success: true, message: 'Data pinjaman berhasil dihapus.' });
    });
  });
};

// Fungsi untuk menambah pinjaman
exports.tambahPinjaman = async (req, res) => {
  const {
    id_anggota,
    kategori,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    angsuran_pokok,
    margin_per_bulan,
    total_angsuran,
    tanggal_perjanjian
  } = req.body;

  const query = `
    INSERT INTO pinjaman 
    (id_anggota, kategori, jumlah_pinjaman, jangka_waktu, margin_persen, angsuran_pokok, margin_per_bulan, total_angsuran, sisa_piutang, tanggal_perjanjian, ket_status, angsuran_ke)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id_anggota,
    kategori,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    angsuran_pokok,
    margin_per_bulan,
    total_angsuran,
    total_angsuran * jangka_waktu, // Sisa piutang awal
    tanggal_perjanjian,
    'Belum Lunas', // Status awal
    0 // Inisialisasi angsuran_ke dengan 0
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat menambahkan pinjaman:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menambahkan pinjaman." });
    }
    res.redirect('/lihatPinjaman');
  });
};

// Fungsi untuk mengambil data anggota berdasarkan ID
exports.getAnggotaById = async (req, res) => {
  const idAnggota = req.params.id;
  console.log("ID Anggota yang diminta:", idAnggota); // Debugging

  const query = `
      SELECT pg.nama 
      FROM anggota a
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE a.id = ?
  `;

  db.query(query, [idAnggota], (error, results) => {
      if (error) {
          console.error("Error saat mengambil data anggota:", error); // Debugging
          return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil data anggota." });
      }
      console.log("Hasil query:", results); // Debugging
      if (results.length === 0) {
          return res.json({ success: false, message: "Anggota tidak ditemukan." });
      }
      res.json({ success: true, nama: results[0].nama });
  });
};


// Fungsi untuk mencari anggota
exports.cariAnggota = async (req, res) => {
  const { keyword } = req.query;

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
        COALESCE(p.angsuran_pokok, 0) AS angsuran_pokok,
        COALESCE(p.margin_per_bulan, 0) AS margin_per_bulan,
        COALESCE(p.total_angsuran, 0) AS total_angsuran,
        COALESCE(p.sisa_piutang, 0) AS sisa_piutang,
        p.tanggal_perjanjian,
        p.ket_status
      FROM pinjaman p
      JOIN anggota a ON p.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE pg.nama LIKE ? OR p.id_anggota LIKE ?
    `;

    db.query(query, [`%${keyword}%`, `%${keyword}%`], (error, results) => {
      if (error) {
        console.error("Error saat mencari data pinjaman:", error);
        return res.status(500).send("Terjadi kesalahan saat mencari data pinjaman.");
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mencari data pinjaman.");
  }
};

exports.tampilkanBayarPinjaman = async (req, res) => {
  const id = req.params.id;

  // Ambil data pinjaman
  const queryPinjaman = `
    SELECT 
      p.id,
      p.id_anggota,
      pg.nama AS nama_anggota,
      p.jumlah_pinjaman,
      p.jangka_waktu,
      p.sisa_piutang,
      p.total_angsuran,
      p.angsuran_ke
    FROM pinjaman p
    JOIN anggota a ON p.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE p.id = ?
  `;

  // Ambil riwayat pembayaran
  const queryPembayaran = `
    SELECT 
      tanggal_bayar,
      angsuran_ke,
      jumlah_bayar,
      ket
    FROM pembayaran
    WHERE id_pinjaman = ?
    ORDER BY tanggal_bayar DESC
  `;

  db.query(queryPinjaman, [id], (error, resultsPinjaman) => {
    if (error) {
      console.error("Error saat mengambil data pinjaman:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data pinjaman.");
    }
    if (resultsPinjaman.length === 0) {
      return res.status(404).send("Data pinjaman tidak ditemukan.");
    }

    const pinjaman = resultsPinjaman[0];

    db.query(queryPembayaran, [id], (error, resultsPembayaran) => {
      if (error) {
        console.error("Error saat mengambil riwayat pembayaran:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil riwayat pembayaran.");
      }

      res.render("koperasi/pinjamanKeuangan/bayarPinjaman", {
        pinjaman: pinjaman,
        riwayatPembayaran: resultsPembayaran,
      });
    });
  });
};

// Fungsi untuk memproses pembayaran
exports.prosesBayar = async (req, res) => {
  const idPinjaman = req.params.id;
  const { tanggal_bayar, jumlah_bayar, keterangan } = req.body;

  // Ambil nilai angsuran_ke terakhir dari tabel pinjaman
  const getAngsuranKeQuery = `
    SELECT angsuran_ke, sisa_piutang
    FROM pinjaman
    WHERE id = ?
  `;

  db.query(getAngsuranKeQuery, [idPinjaman], (error, results) => {
    if (error) {
      console.error("Error saat mengambil angsuran_ke:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil angsuran_ke." });
    }

    const angsuranKe = results[0].angsuran_ke + 1; // Increment angsuran_ke
    const sisaPiutangBaru = results[0].sisa_piutang - jumlah_bayar;

    // Jika sisa_piutang <= 0, set status menjadi "Lunas"
    const statusPinjaman = sisaPiutangBaru <= 0 ? 'Lunas' : 'Belum Lunas';

    // Insert pembayaran baru dengan angsuran_ke yang benar
    const insertPembayaranQuery = `
      INSERT INTO pembayaran (id_pinjaman, tanggal_bayar, jumlah_bayar, ket, angsuran_ke)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertPembayaranQuery, [idPinjaman, tanggal_bayar, jumlah_bayar, keterangan, angsuranKe], (error, results) => {
      if (error) {
        console.error("Error saat mencatat pembayaran:", error);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mencatat pembayaran." });
      }

      // Update sisa piutang, angsuran_ke, dan status di tabel pinjaman
      const updatePinjamanQuery = `
        UPDATE pinjaman
        SET sisa_piutang = ?,
            angsuran_ke = ?,
            ket_status = ?
        WHERE id = ?
      `;

      db.query(updatePinjamanQuery, [sisaPiutangBaru, angsuranKe, statusPinjaman, idPinjaman], (updateError, updateResults) => {
        if (updateError) {
          console.error("Error saat mengupdate sisa piutang dan angsuran_ke:", updateError);
          return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupdate sisa piutang dan angsuran_ke." });
        }

        res.redirect('/lihatPinjaman');
      });
    });
  });
};

// Fungsi untuk menampilkan form edit pinjaman
exports.tampilkanEditPinjaman = async (req, res) => {
  const id = req.params.id;

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
      p.tanggal_perjanjian
    FROM pinjaman p
    JOIN anggota a ON p.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE p.id = ?
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data pinjaman:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data pinjaman.");
    }
    if (results.length === 0) {
      return res.status(404).send("Data pinjaman tidak ditemukan.");
    }

    const pinjaman = results[0];
    res.render("koperasi/pinjamanKeuangan/editPinjaman", { pinjaman });
  });
};

// Fungsi untuk menyimpan perubahan pinjaman
exports.simpanEditPinjaman = async (req, res) => {
  const id = req.params.id;
  const {
    id_anggota,
    kategori,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_perjanjian,
    angsuran_pokok,
    margin_per_bulan,
    total_angsuran,
    sisa_piutang
  } = req.body;

  const query = `
    UPDATE pinjaman
    SET 
      id_anggota = ?,
      kategori = ?,
      jumlah_pinjaman = ?,
      jangka_waktu = ?,
      margin_persen = ?,
      tanggal_perjanjian = ?,
      angsuran_pokok = ?,
      margin_per_bulan = ?,
      total_angsuran = ?,
      sisa_piutang = ?
    WHERE id = ?
  `;

  const values = [
    id_anggota,
    kategori,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_perjanjian,
    angsuran_pokok,
    margin_per_bulan,
    total_angsuran,
    sisa_piutang,
    id
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat mengupdate pinjaman:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupdate pinjaman." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Data pinjaman tidak ditemukan." });
    }
    res.redirect('/lihatPinjaman');
  });
};