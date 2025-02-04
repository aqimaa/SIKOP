const express = require('express');
const router = express.Router();

// Import Controllers
const loginController = require("../controllers/auth/loginController.js");
const simpananController = require('../controllers/koperasi/simpananController');
// const pinjamanController = require('../controllers/koperasi/pinjamanController');
// const kreditController = require('../controllers/koperasi/kreditController');
const kreditPimpinanController = require('../controllers/pimpinan/kreditPimpinanController');
const pinjamanPimpinanController = require('../controllers/pimpinan/pinjamanPimpinanController');
const simpananPimpinanController = require('../controllers/pimpinan/simpananPimpinanController');
const cetakLaporanPimpinanController = require('../controllers/pimpinan/cetakLaporanPimpinanController');
// const laporanController = require('../controllers/koperasi/laporanController');
// const pinjamanController = require('../controllers/koperasi/pinjamanController');
// const kreditController = require('../controllers/koperasi/kreditController');
const masterController = require('../controllers/master/masterController');

// Route untuk Login
router.get("/", (req, res) => {
  res.redirect("/login");
});
router.get("/login", loginController.getLogin);
router.post("/login", loginController.login);

// Route untuk Change Password
router.get('/changePassword', (req, res) => {
  console.log("Change Password Page Accessed");
  res.render('auth/changePassword');
});
router.post('/changePassword', loginController.changePassword);

// Route untuk Logout
router.get("/logout", loginController.logout);
router.post("/logout", loginController.logout);

// Route untuk Dashboard
router.get("/dashboardSuperadmin", (req, res) => {
  res.render("dashboardSuperadmin");
});
router.get("/dashboardPimpinan", (req, res) => {
  res.render("dashboardPimpinan");
});
router.get("/dashboardKeuangan", (req, res) => {
  res.render("dashboardKeuangan");
});

// Route untuk Kredit Pimpinan
router.get('/kreditPimpinan', kreditPimpinanController.getKreditPimpinan);
router.post('/kredit/filter', kreditPimpinanController.filterData);
  


// Route untuk Pinjaman Pimpinan
router.get('/pinjamanPimpinan', pinjamanPimpinanController.getPinjamanPimpinan);
router.post('/pinjaman/filter', pinjamanPimpinanController.filterData);


// Route untuk Simpanan Pimpinan,Filter Data Simpanan dengan Pagination
router.get('/cetak-laporan', cetakLaporanPimpinanController.cetakLaporan); 
router.get('/simpananPimpinan', simpananPimpinanController.getSimpananPimpinan);

router.post('/simpanan/filter', simpananPimpinanController.filterData);


// Route untuk Laporan
// router.get('/laporan', laporanController.getLaporan);
// router.post('/laporan', laporanController.createLaporan);

// Route untuk Pinjaman
// router.get('/pinjaman', pinjamanController.getPinjaman);
// router.post('/pinjaman', pinjamanController.createPinjaman);

// Route untuk Simpanan
router.get('/simpanan', (req, res) => {
  if (req.session.role === 'Admin Keuangan') {
      res.render('koperasi/simpananKeuangan/lihatsimpanan');
  } else {
      res.redirect('/login');
  }
});

// API Routes untuk Simpanan
router.get('/api/simpanan', simpananController.getSimpananData);
router.get('/koperasi/simpanan/lihatsimpanan', simpananController.lihatSimpanan);

// API Routes untuk Simpanan
router.get('/api/simpanan', simpananController.getSimpananData);

router.get('/api/simpanan/filter', simpananController.filterSimpanan);
router.get('/api/simpanan/years', simpananController.getAvailableYears);
router.get('/api/anggota', simpananController.getAnggotaList);
router.get('/api/simpanan/history/:id_anggota', simpananController.getHistorySimpanan);

router.post('/api/simpanan', simpananController.createSimpanan);
router.delete('/api/simpanan/:id', simpananController.deleteSimpanan);

// Route untuk Kredit
// router.get('/kredit', kreditController.getKredit);
// router.post('/kredit', kreditController.createKredit);

// Route untuk Master
router.get('/master/pegawai', masterController.getPegawai);
router.get('/master/pegawai/tambahPegawai', (req, res) => {
  res.render('master/pegawai/tambahPegawai');
});
router.post('/master/pegawai/tambahPegawai', masterController.createPegawai);

router.get('/master/pegawai/ubahPegawai/:nip', (req, res) => {
  const { nip } = req.params;
  const query = 'SELECT * FROM pegawai WHERE nip = ?';
  db.query(query, [nip], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/pegawai/ubahPegawai', { pegawai: results[0] });
  });
});
router.post('/master/pegawai/ubahPegawai/:nip', masterController.updatePegawai);

router.get('/master/pegawai/delete/:nip', masterController.deletePegawai);

router.get('/master/anggota', masterController.getAnggota);
router.get('/master/anggota/tambahAnggota', (req, res) => {
  res.render('master/anggota/tambahAnggota');
});
router.post('/master/anggota/tambahAnggota', masterController.createAnggota);

router.get('/master/anggota/ubahAnggota/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM anggota WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/anggota/ubahAnggota', { anggota: results[0] });
  });
});
router.post('/master/anggota/ubahAnggota/:id', masterController.updateAnggota);

router.get('/master/anggota/delete/:id', masterController.deleteAnggota);

router.get('/master/user', masterController.getUser);
router.get('/master/user/editUser /:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/user/editUser ', { user: results[0] });
  });
});
router.post('/master/user/editUser /:id', masterController.updateUser );

// Export Router
module.exports = router;