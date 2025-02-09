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
    total_angsuran, // Ini adalah Total Angsuran per Bulan
    tanggal_perjanjian
  } = req.body;

  const query = `
    INSERT INTO pinjaman 
    (id_anggota, kategori, jumlah_pinjaman, jangka_waktu, margin_persen, angsuran_pokok, margin_per_bulan, total_angsuran, sisa_piutang, tanggal_perjanjian, ket_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id_anggota,
    kategori,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    angsuran_pokok,
    margin_per_bulan,
    total_angsuran, // Total Angsuran per Bulan
    total_angsuran * jangka_waktu, // Sisa piutang dihitung dari Total Angsuran per Bulan dikali Jangka Waktu
    tanggal_perjanjian,
    'Belum Lunas' // Default status
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat menambahkan pinjaman:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menambahkan pinjaman." });
    }
    res.redirect('/lihatPinjaman'); // Redirect ke halaman lihatPinjaman setelah berhasil menambahkan
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