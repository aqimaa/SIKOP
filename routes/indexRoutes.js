const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Import Controllers
const loginController = require("../controllers/auth/loginController.js");
const simpananController = require('../controllers/koperasi/simpananController');
const pinjamanController = require('../controllers/koperasi/pinjamanController');
const kreditController = require('../controllers/koperasi/kreditController');
const cetakLaporanController = require('../controllers/koperasi/cetakLaporan'); // Impor controller cetak laporan

// Route untuk Login
router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", loginController.getLogin);
router.post("/login", loginController.login);

// Route untuk Change Password
router.get('/changePassword', (req, res) => {
  res.render('auth/changePassword');
});

router.post('/changePassword', loginController.changePassword);

// Route untuk Logout
router.post("/logout", loginController.logout);

// Route untuk Dashboard
router.get("/dashboardSuperadmin", (req, res) => {
  res.render("dashboardSuperadmin");
});

router.get("/dashboardPimpinan", (req, res) => {
  res.render("dashboardPimpinan");
});

router.get("/dashboardKeuangan", (req, res) => {
  if (req.session.role === 'Admin Keuangan') {
    res.render("dashboardKeuangan");
  } else {
    res.redirect('/login');
  }
});

// Route untuk Kredit Pimpinan
router.get('/kreditPimpinan', kreditController.getKreditPimpinan);
router.post('/kredit/filter', async (req, res) => {
  const { tahun, bulan, jenis, page = 1, limit = 10 } = req.body;

  if (!tahun || !bulan || !jenis) {
      return res.status(400).json({ message: 'Harap lengkapi semua filter!' });
  }

  try {
      const offset = (page - 1) * limit;

      // Menggunakan Promise untuk db.query
      const executeQuery = (query, params) => {
          return new Promise((resolve, reject) => {
              db.query(query, params, (err, results) => {
                  if (err) reject(err);
                  resolve(results);
              });
          });
      };

      // Query untuk data dengan pagination
      const query = `
          SELECT a.nip, a.nama, 
                 '${jenis}' AS jenis, 
                 k.jangka_waktu AS jangka_waktu, 
                 ${jenis === 'kredit_barang' ? 'k.harga_pokok' : 'k.jumlah_pinjaman'} AS jumlah
          FROM ${jenis} k
          JOIN anggota a ON k.id_anggota = a.id
          WHERE YEAR(k.tanggal_mulai) = ? 
          AND MONTH(k.tanggal_mulai) = ?
          LIMIT ? OFFSET ?
      `;

      // Query untuk total data
      const countQuery = `
          SELECT COUNT(*) AS total 
          FROM ${jenis} k
          JOIN anggota a ON k.id_anggota = a.id
          WHERE YEAR(k.tanggal_mulai) = ? 
          AND MONTH(k.tanggal_mulai) = ?
      `;

      // Eksekusi kedua query secara parallel
      const [data, totalResults] = await Promise.all([
          executeQuery(query, [tahun, bulan, parseInt(limit), offset]),
          executeQuery(countQuery, [tahun, bulan])
      ]);

      const total = totalResults[0].total;

      res.json({
          data,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
      });

  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
          message: 'Terjadi kesalahan saat memuat data.',
          error: error.message
      });
  }
});


// Route untuk Pinjaman Pimpinan
router.get('/pinjamanPimpinan', pinjamanController.getPinjamanPimpinan);
router.post('/pinjaman/filter', async (req, res) => {
  const { tahun, bulan, jenis, page = 1, limit = 10 } = req.body;

  if (!tahun || !bulan || !jenis) {
      return res.status(400).json({ message: 'Harap lengkapi semua filter!' });
  }

  try {
      const offset = (page - 1) * limit;

      // Menggunakan Promise untuk db.query
      const executeQuery = (query, params) => {
          return new Promise((resolve, reject) => {
              db.query(query, params, (err, results) => {
                  if (err) reject(err);
                  resolve(results);
              });
          });
      };

      // Query untuk data dengan pagination
      const query = `
          SELECT a.nip, a.nama, p.kategori AS jenis,
                p.jangka_waktu AS jangka_waktu,  -- Ambil jangka_waktu dari database
                p.jumlah_pinjaman AS jumlah
          FROM pinjaman p
          JOIN anggota a ON p.id_anggota = a.id
          WHERE YEAR(p.tanggal_perjanjian) = ?
          AND MONTH(p.tanggal_perjanjian) = ?
          AND p.kategori = ?
          LIMIT ? OFFSET ?
      `;

      // Query untuk total data
      const countQuery = `
          SELECT COUNT(*) AS total
          FROM pinjaman p
          JOIN anggota a ON p.id_anggota = a.id
          WHERE YEAR(p.tanggal_perjanjian) = ?
          AND MONTH(p.tanggal_perjanjian) = ?
          AND p.kategori = ?
      `;

      // Eksekusi kedua query secara parallel
      const [data, totalResults] = await Promise.all([
          executeQuery(query, [tahun, bulan, jenis, parseInt(limit), offset]),
          executeQuery(countQuery, [tahun, bulan, jenis])
      ]);

      const total = totalResults[0].total;

      res.json({
          data,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
      });

  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
          message: 'Terjadi kesalahan saat memuat data.',
          error: error.message
      });
  }
});


// Route untuk Simpanan Pimpinan,Filter Data Simpanan dengan Pagination
router.get('/cetak-laporan', cetakLaporanController.cetakLaporan); 
router.get('/simpananPimpinan', simpananController.getSimpananPimpinan);

router.post('/simpanan/filter', async (req, res) => {
  const { tahun, bulan, jenis, page = 1, limit = 10 } = req.body;

  if (!tahun || !bulan || !jenis) {
    return res.status(400).json({ message: 'Harap lengkapi semua filter!' });
  }

  try {
    const offset = (page - 1) * limit;

    // Menggunakan Promise untuk db.query
    const executeQuery = (query, params) => {
      return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    };

    // Query untuk data dengan pagination
    const query = `
      SELECT a.nip, a.nama, s.${jenis} AS jumlah 
      FROM simpanan s 
      JOIN anggota a ON s.id_anggota = a.id 
      WHERE YEAR(s.tanggal) = ? 
      AND MONTH(s.tanggal) = ?
      LIMIT ? OFFSET ?
    `;

    // Query untuk total data
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM simpanan s 
      JOIN anggota a ON s.id_anggota = a.id 
      WHERE YEAR(s.tanggal) = ? 
      AND MONTH(s.tanggal) = ?
    `;

    // Eksekusi kedua query secara parallel
    const [data, totalResults] = await Promise.all([
      executeQuery(query, [tahun, bulan, parseInt(limit), offset]),
      executeQuery(countQuery, [tahun, bulan])
    ]);

    const total = totalResults[0].total;

    res.json({
      data,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat memuat data.',
      error: error.message 
    });
  }
});

module.exports = router;