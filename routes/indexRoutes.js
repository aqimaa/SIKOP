const express = require("express");
const router = express.Router();

const loginController = require("../controllers/auth/loginController.js");
const simpananController = require("../controllers/koperasi/simpananController");
const pinjamanController = require("../controllers/koperasi/lihatPinjaman.js");
const kreditController = require("../controllers/koperasi/kreditController");
const kreditPimpinanController = require("../controllers/pimpinan/kreditPimpinanController");
const pinjamanPimpinanController = require("../controllers/pimpinan/pinjamanPimpinanController");
const simpananPimpinanController = require("../controllers/pimpinan/simpananPimpinanController");
const cetakLaporanPimpinanController = require("../controllers/pimpinan/cetakLaporanPimpinanController");
const lihatPinjamanController = require("../controllers/koperasi/lihatPinjaman");
const masterController = require('../controllers/master/masterController');
const kreditUmrohController = require("../controllers/koperasi/kreditUmrohController");
const kreditElektronikController = require("../controllers/koperasi/kreditElektronik");
const kreditMotorController = require("../controllers/koperasi/kreditMotorController");
const { exportDatabase} = require('../controllers/master/eksporBackup');
const { exportData} = require('../controllers/master/eksporBackup');

router.get("/", (req, res) => {
  res.redirect("/login");
});
router.get("/login", loginController.getLogin);
router.post("/login", loginController.login);

router.get("/changePassword", (req, res) => {
  console.log("Change Password Page Accessed");
  res.render("auth/changePassword");
});
router.post("/changePassword", loginController.changePassword);

router.get("/logout", loginController.logout);
router.post("/logout", loginController.logout);

router.get("/dashboardSuperadmin", (req, res) => {
  res.render("dashboardSuperadmin");
});

router.get("/api/dashboard", masterController.getDashboardData); 
router.get("/dashboardPimpinan", (req, res) => {
  res.render("dashboardPimpinan");
});
router.get("/dashboardKeuangan", (req, res) => {
  res.render("dashboardKeuangan");
});

// <!=============================================== Route Pimpinan ===============================================> //


router.get("/kreditPimpinan", kreditPimpinanController.getKreditPimpinan);
router.post("/kredit/filter", kreditPimpinanController.filterData);
router.get("/pinjamanPimpinan", pinjamanPimpinanController.getPinjamanPimpinan);
router.post("/pinjaman/filter", pinjamanPimpinanController.filterData);
router.get("/cetak-laporan", cetakLaporanPimpinanController.cetakLaporan);
router.get("/simpananPimpinan", simpananPimpinanController.getSimpananPimpinan);
router.post("/simpanan/filter", simpananPimpinanController.filterData);
// <!=============================================== Route Kredit ===============================================> //

router.get("/kredit-barang", kreditController.getAllKreditBarang);
router.post("/kredit-barang", kreditController.createKreditBarang);
router.get("/kredit-barang/:id", kreditController.getKreditBarangById);
router.put("/kredit-barang/:id", kreditController.updateKreditBarang);
router.delete("/kredit-barang/:id", kreditController.deleteKreditBarang);
router.get('/bayarKreditBarang/:id', kreditController.getBayarKreditBarang);
router.post('/bayarKreditBarang/:id', kreditController.prosesBayarKreditBarang);
router.get('/api/anggotaKredit', kreditController.getAnggotaListKredit);
router.get("/tambahKreditBarang", kreditController.getTambahKredit);
router.get('/kredit-barang/edit/:id', kreditController.getEditKreditBarang);
router.put('/kredit-barang/:id', kreditController.updateKreditBarang);
router.get("/api/kredit-barang/search", kreditController.searchKreditBarang);

router.get("/lihatKreditElektronik", kreditElektronikController.lihatKreditElektronik);
router.get("/kreditElektronik/tambah", (req, res) => {
  res.render("koperasi/kreditKeuangan/kreditElektronik/tambahKreditElektro");
});
router.post("/kreditElektronik/tambah", kreditElektronikController.tambahKreditElektronik);
router.get("/kreditElektronik/edit/:id", kreditElektronikController.tampilkanEditKreditElektronik);
router.put("/kreditElektronik/edit/:id", kreditElektronikController.simpanEditKreditElektronik);
router.delete("/kreditElektronik/hapus/:id", kreditElektronikController.hapusKreditElektronik);
router.get("/kreditElektronik/bayar/:id", kreditElektronikController.tampilkanBayarKreditElektronik);
router.post("/kreditElektronik/bayar/:id", kreditElektronikController.prosesBayarKreditElektronik);
router.get("/kreditElektronik/cari", kreditElektronikController.cariKreditElektronik);

router.get("/lihatKreditMotor", kreditMotorController.lihatKreditMotor);
router.get('/kreditMotor/getAnggota/:id', kreditMotorController.getAnggotaById);
router.get("/kreditMotor/tambah", (req, res) => {
 res.render("koperasi/kreditKeuangan/kreditMotor/tambahKreditMotor");
 });
router.post("/kreditMotor/tambah", kreditMotorController.tambahKreditMotor);
router.get("/kreditMotor/bayar/:id", kreditMotorController.tampilkanBayarKreditMotor);
router.post("/kreditMotor/bayar/:id", kreditMotorController.prosesBayarKreditMotor);
router.get('/kreditMotor/edit/:id', kreditMotorController.tampilkanEditKreditMotor);
router.put('/kredit-motor/:id', kreditMotorController.simpanEditKreditMotor);
router.delete("/kreditMotor/hapus/:id", kreditMotorController.hapusKreditMotor);
router.get("/kreditMotor/cari", kreditMotorController.cariKreditMotor);

router.get("/lihatKreditUmroh", kreditUmrohController.lihatKreditUmroh);
router.delete("/kreditUmroh/hapus/:id", kreditUmrohController.hapusKreditUmroh);
router.get("/kreditUmroh/edit/:id", kreditUmrohController.tampilkanEditKreditUmroh);
router.post("/kreditUmroh/edit/:id", kreditUmrohController.simpanEditKreditUmroh);
router.get("/kreditUmroh/tambah", (req, res) => {
  res.render("koperasi/kreditKeuangan/kreditUmroh/tambahKreditUmroh");
});
router.post("/kreditUmroh/tambah", kreditUmrohController.tambahKreditUmroh);
router.get("/kreditUmroh/getAnggota/:id", kreditUmrohController.getAnggotaById);
router.get("/kreditUmroh/bayar/:id", kreditUmrohController.tampilkanBayarKreditUmroh);
router.post("/kreditUmroh/bayar/:id", kreditUmrohController.prosesBayar);
router.get("/kreditUmroh/cari", kreditUmrohController.cariAnggota);

// <!=============================================== Route Simpanan ===============================================> //

router.get("/simpanan", (req, res) => {
  if (req.session.role === "Admin Keuangan") {
    res.render("koperasi/simpananKeuangan/lihatsimpanan");
  } else {
    res.redirect("/login");
  }
});

router.get("/api/simpanan", simpananController.getSimpananData);
router.get("/simpanankoperasi", simpananController.lihatSimpanan);
router.get("/api/simpanan/filter", simpananController.filterSimpanan);
router.get("/api/simpanan/years", simpananController.getAvailableYears);
router.get("/api/anggota", simpananController.getAnggotaListSimpanan);
router.get("/api/simpanan/history/:id_anggota", simpananController.getHistorySimpanan);
router.post("/api/simpanan/periode", simpananController.createPeriode);
router.get("/api/simpanan/:id", simpananController.getSimpananById);
router.put("/api/simpanan/:id", simpananController.updateSimpanan);
router.post("/api/simpanan", simpananController.createSimpanan);
router.delete("/api/simpanan/:id", simpananController.deleteSimpanan);

// <!=============================================== Route Pinjaman ===============================================> //

router.get("/lihatPinjaman", lihatPinjamanController.lihatPinjaman);
router.delete("/pinjaman/hapus/:id", lihatPinjamanController.hapusPinjaman);
router.get("/pinjaman/edit/:id", lihatPinjamanController.tampilkanEditPinjaman);
router.post("/pinjaman/edit/:id", lihatPinjamanController.simpanEditPinjaman);
router.get("/pinjaman/tambah", (req, res) => {
  res.render("koperasi/pinjamanKeuangan/tambahPinjaman");
});
router.post("/pinjaman/tambah", lihatPinjamanController.tambahPinjaman);
router.get("/pinjaman/getAnggota/:id", lihatPinjamanController.getAnggotaById);
router.get("/pinjaman/bayar/:id", lihatPinjamanController.tampilkanBayarPinjaman);
router.post("/pinjaman/bayar/:id", lihatPinjamanController.prosesBayar);
router.get("/pinjaman/cari", lihatPinjamanController.cariAnggota);

// <!=============================================== Route Master ===============================================> //

router.get("/master/pegawai", masterController.getPegawai);
router.get("/master/pegawai/tambahPegawai", (req, res) => {
  res.render("master/pegawai/tambahPegawai");
});
router.post("/master/pegawai/tambahPegawai", masterController.createPegawai);
router.get("/master/pegawai/ubahPegawai/:nip", masterController.getUbahPegawai);
router.put("/master/pegawai/:nip", masterController.updatePegawai);
router.delete("/master/pegawai/:nip", masterController.deletePegawai);

router.get("/master/anggota", masterController.getAnggota);
router.get("/master/anggota/tambahAnggota", masterController.getPegawaiForAnggota);
router.post("/master/anggota/tambahAnggota", masterController.tambahAnggota);
router.get("/master/anggota/pegawaiTersedia", masterController.getPegawaiYangBisaDipilih);
router.get("/master/anggota/ubahAnggota/:id", masterController.getAnggotaById);
router.post('/master/anggota/ubahStatus', masterController.updateAnggota);
router.delete("/master/anggota/delete/:id", masterController.deleteAnggota);

router.get("/master/user", masterController.getUser);
router.get("/master/user/editUser/:id", masterController.getUserById);
router.post("/master/user/editUser/:id", masterController.updateUser);
router.get('/master/user/export/:format', (req, res) => {
  const format = req.params.format.toLowerCase();
  exportDatabase(req, res, format);
});
router.get('/master/user/exportTable/:format', (req, res) => {
  const format = req.params.format.toLowerCase();
  exportData(req, res, format);
});

module.exports = router;