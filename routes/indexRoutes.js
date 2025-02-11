const express = require("express");
const router = express.Router();

// Import Controllers
const loginController = require("../controllers/auth/loginController.js");
const simpananController = require("../controllers/koperasi/simpananController");
// const pinjamanController = require('../controllers/koperasi/pinjamanController');
const pinjamanController = require("../controllers/koperasi/lihatPinjaman.js");
const kreditController = require("../controllers/koperasi/kreditController");
const kreditPimpinanController = require("../controllers/pimpinan/kreditPimpinanController");
const pinjamanPimpinanController = require("../controllers/pimpinan/pinjamanPimpinanController");
const simpananPimpinanController = require("../controllers/pimpinan/simpananPimpinanController");
const cetakLaporanPimpinanController = require("../controllers/pimpinan/cetakLaporanPimpinanController");
const lihatPinjamanController = require("../controllers/koperasi/lihatPinjaman");
// const laporanController = require('../controllers/koperasi/laporanController');
// const pinjamanController = require('../controllers/koperasi/pinjamanController');
const masterController = require('../controllers/master/masterController');
const { exportData } = require('../controllers/master/eksporBackup');
// const kreditController = require('../controllers/koperasi/kreditController');

// Route untuk Login
router.get("/", (req, res) => {
  res.redirect("/login");
});
router.get("/login", loginController.getLogin);
router.post("/login", loginController.login);

// Route untuk Change Password
router.get("/changePassword", (req, res) => {
  console.log("Change Password Page Accessed");
  res.render("auth/changePassword");
});
router.post("/changePassword", loginController.changePassword);

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
router.get("/kreditPimpinan", kreditPimpinanController.getKreditPimpinan);
router.post("/kredit/filter", kreditPimpinanController.filterData);

// Route untuk Pinjaman Pimpinan
router.get("/pinjamanPimpinan", pinjamanPimpinanController.getPinjamanPimpinan);
router.post("/pinjaman/filter", pinjamanPimpinanController.filterData);

// Route untuk Simpanan Pimpinan,Filter Data Simpanan dengan Pagination
router.get("/cetak-laporan", cetakLaporanPimpinanController.cetakLaporan);
router.get("/simpananPimpinan", simpananPimpinanController.getSimpananPimpinan);

router.post("/simpanan/filter", simpananPimpinanController.filterData);

// Route untuk Laporan
// router.get('/laporan', laporanController.getLaporan);
// router.post('/laporan', laporanController.createLaporan);

// Route untuk Pinjaman
// router.get('/pinjaman', pinjamanController.getPinjaman);
// router.post('/pinjaman', pinjamanController.createPinjaman);

// Route untuk Kredit Barang
router.get("/kredit-barang", kreditController.getAllKreditBarang);
router.post("/kredit-barang", kreditController.createKreditBarang);
router.get("/kredit-barang/:id", kreditController.getKreditBarangById);
router.put("/kredit-barang/:id", kreditController.updateKreditBarang);
router.delete("/kredit-barang/:id", kreditController.deleteKreditBarang);

// Route untuk pembayaran kredit barang
router.get('/bayarKreditBarang/:id', kreditController.getBayarKreditBarang);
router.post('/bayarKreditBarang/:id', kreditController.prosesBayarKreditBarang);

// Tambahkan route baru di sini
router.get('/api/anggota', kreditController.getAnggotaList);


// Route untuk menampilkan halaman tambah kredit barang
router.get("/tambahKreditBarang", kreditController.getTambahKredit);

// Route untuk Simpanan
router.get("/simpanan", (req, res) => {
  if (req.session.role === "Admin Keuangan") {
    res.render("koperasi/simpananKeuangan/lihatsimpanan");
  } else {
    res.redirect("/login");
  }
});

// API Routes untuk Simpanan
router.get("/api/simpanan", simpananController.getSimpananData);
router.get("/simpanankoperasi", simpananController.lihatSimpanan);

router.get("/api/simpanan/filter", simpananController.filterSimpanan);
router.get("/api/simpanan/years", simpananController.getAvailableYears);
router.get("/api/anggota", simpananController.getAnggotaList);
router.get("/api/simpanan/history/:id_anggota", simpananController.getHistorySimpanan);
router.post("/api/simpanan/periode", simpananController.createPeriode);

router.get("/api/simpanan/:id", simpananController.getSimpananById);
router.put("/api/simpanan/:id", simpananController.updateSimpanan);

router.post("/api/simpanan", simpananController.createSimpanan);
router.delete("/api/simpanan/:id", simpananController.deleteSimpanan);

// Route untuk Pinjaman
router.get("/lihatPinjaman", lihatPinjamanController.lihatPinjaman);

// Route untuk menghapus pinjaman
router.delete("/pinjaman/hapus/:id", lihatPinjamanController.hapusPinjaman);

// Route untuk menampilkan form edit pinjaman
// router.get("/pinjaman/edit/:id", lihatPinjamanController.tampilkanEditPinjaman);
// router.post("/pinjaman/edit/:id", lihatPinjamanController.simpanEditPinjaman);

// Route untuk menampilkan form tambah pinjaman
router.get("/pinjaman/tambah", (req, res) => {
  res.render("koperasi/pinjamanKeuangan/tambahPinjaman");
});

// Route untuk menambahkan pinjaman
router.post("/pinjaman/tambah", lihatPinjamanController.tambahPinjaman);

// Route untuk mengambil data anggota berdasarkan ID
router.get("/pinjaman/getAnggota/:id", lihatPinjamanController.getAnggotaById);

// Route untuk mencari anggota
router.get("/pinjaman/cari", lihatPinjamanController.cariAnggota);

// Route untuk Kredit
// router.get('/kredit', kreditController.getKredit);
// router.post('/kredit', kreditController.createKredit);

// Route untuk Master
//Route Pegawai

// 📌 Menampilkan daftar pegawai
router.get("/master/pegawai", masterController.getPegawai);

// 📌 Form tambah pegawai
router.get("/master/pegawai/tambahPegawai", (req, res) => {
  res.render("master/pegawai/tambahPegawai");
});

// 📌 Proses tambah pegawai
router.post("/master/pegawai/tambahPegawai", masterController.createPegawai);

// 📌 Form ubah pegawai (Memastikan data dikirim dengan benar)
router.get("/master/pegawai/ubahPegawai/:nip", masterController.getUbahPegawai);

// 📌 Proses update pegawai
router.put("/master/pegawai/:nip", masterController.updatePegawai);

// 📌 Proses hapus pegawai
router.delete("/master/pegawai/:nip", masterController.deletePegawai);

// Route Anggota
// Menampilkan daftar anggota
router.get("/master/anggota", masterController.getAnggota);

// Menampilkan form tambah anggota
router.get("/master/anggota/tambahAnggota", masterController.getPegawaiForAnggota);

// Menambahkan anggota baru
router.post("/master/anggota/tambahAnggota", masterController.tambahAnggota);
router.get("/master/anggota/pegawaiTersedia", masterController.getPegawaiYangBisaDipilih);

// Menampilkan form ubah anggota
router.get("/master/anggota/ubahAnggota/:id", masterController.getAnggotaById);

// Mengubah status anggota
router.post("/master/anggota/ubahAnggota/:id", masterController.updateAnggota);

// Menghapus anggota
router.delete("/master/anggota/delete/:id", masterController.deleteAnggota);

//Route user
// Menampilkan daftar user
router.get("/master/user", masterController.getUser);
// Menampilkan halaman edit user berdasarkan ID
router.get("/master/user/editUser/:id", masterController.getUserById);
// Menangani update user
router.post("/master/user/editUser/:id", masterController.updateUser);
router.get('/master/pegawai', masterController.getPegawai);
router.get('/master/pegawai/tambahPegawai', (req, res) => {
  res.render('master/pegawai/tambahPegawai');
});
router.post('/master/pegawai/tambahPegawai', masterController.createPegawai);
router.get('/master/pegawai/ubahPegawai/:nip', masterController.getUbahPegawai);
router.put('/master/pegawai/:nip', masterController.updatePegawai);
router.delete('/master/pegawai/:nip', masterController.deletePegawai);

// Route Anggota
router.get('/master/anggota', masterController.getAnggota);
router.get('/master/anggota/tambahAnggota', masterController.getPegawaiForAnggota);
router.post('/master/anggota/tambahAnggota', masterController.tambahAnggota);
router.get('/master/anggota/pegawaiTersedia', masterController.getPegawaiYangBisaDipilih);
router.get('/master/anggota/ubahAnggota/:id', masterController.getAnggotaById);
router.post('/master/anggota/ubahAnggota/:id', masterController.updateAnggota);
router.delete('/master/anggota/delete/:id', masterController.deleteAnggota);

//Route user
router.get('/master/user', masterController.getUser);
router.get('/master/user/editUser/:id', masterController.getUserById);
router.post('/master/user/editUser/:id', masterController.updateUser);
router.get('/master/user/export/:format', (req, res) => {
  const format = req.params.format.toLowerCase();
  exportData(req, res, format);
});
// Export Router
module.exports = router;
