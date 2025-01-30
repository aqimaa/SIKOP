const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/kredit', reportController.getLaporanKredit);
router.get('/pinjaman', reportController.getLaporanPinjaman);
router.get('/simpanan', reportController.getLaporanSimpanan);

module.exports = router;
