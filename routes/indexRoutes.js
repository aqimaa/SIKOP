const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Import Controllers
const loginController = require("../controllers/auth/loginController.js");
// const laporanController = require('../controllers/koperasi/laporanController');
// const pinjamanController = require('../controllers/koperasi/pinjamanController');
// const simpananController = require('../controllers/koperasi/simpananController');
// const kreditController = require('../controllers/koperasi/kreditController');
// const masterController = require('../controllers/master/masterController');

// Route untuk Login
router.get("/login", loginController.getLogin);
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);

// // Route untuk Laporan
// router.get('/laporan', laporanController.getLaporan);
// router.post('/laporan', laporanController.createLaporan);

// // Route untuk Pinjaman
// router.get('/pinjaman', pinjamanController.getPinjaman);
// router.post('/pinjaman', pinjamanController.createPinjaman);

// // Route untuk Simpanan
// router.get('/simpanan', simpananController.getSimpanan);
// router.post('/simpanan', simpananController.createSimpanan);

// // Route untuk Kredit
// router.get('/kredit', kreditController.getKredit);
// router.post('/kredit', kreditController.createKredit);

// // Route untuk Master
// router.get('/master/anggota', masterController.getAnggota);
// router.get('/master/user', masterController.getUser);

// Export Router
module.exports = router;