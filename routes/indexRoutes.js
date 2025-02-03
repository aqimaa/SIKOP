const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Import Controllers
const loginController = require("../controllers/auth/loginController.js");
const simpananController = require('../controllers/koperasi/simpananController');
const pinjamanController = require('../controllers/koperasi/pinjamanController');
const kreditController = require('../controllers/koperasi/kreditController');
const kreditPimpinanController = require('../controllers/pimpinan/kreditPimpinanController');
const pinjamanPimpinanController = require('../controllers/pimpinan/pinjamanPimpinanController');
const simpananPimpinanController = require('../controllers/pimpinan/simpananPimpinanController');
const cetakLaporanPimpinanController = require('../controllers/pimpinan/cetakLaporanPimpinanController');

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
router.get('/kreditPimpinan', kreditPimpinanController.getKreditPimpinan);
router.post('/kredit/filter', kreditPimpinanController.filterData);
  


// Route untuk Pinjaman Pimpinan
router.get('/pinjamanPimpinan', pinjamanPimpinanController.getPinjamanPimpinan);
router.post('/pinjaman/filter', pinjamanPimpinanController.filterData);


// Route untuk Simpanan Pimpinan,Filter Data Simpanan dengan Pagination
router.get('/cetak-laporan', cetakLaporanPimpinanController.cetakLaporan); 
router.get('/simpananPimpinan', simpananPimpinanController.getSimpananPimpinan);

router.post('/simpanan/filter', simpananPimpinanController.filterData);

module.exports = router;