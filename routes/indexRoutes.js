const express = require("express");
const router = express.Router();

// Import Controllers
const loginController = require("../controllers/auth/loginController.js");
const simpananController = require("../controllers/koperasi/simpananController");
const pinjamanController = require("../controllers/koperasi/lihatPinjaman.js");
const kreditController = require("../controllers/koperasi/kreditController");
const kreditPimpinanController = require("../controllers/pimpinan/kreditPimpinanController");
const pinjamanPimpinanController = require("../controllers/pimpinan/pinjamanPimpinanController");
const simpananPimpinanController = require("../controllers/pimpinan/simpananPimpinanController");
const cetakLaporanPimpinanController = require("../controllers/pimpinan/cetakLaporanPimpinanController");
const lihatPinjamanController = require("../controllers/koperasi/lihatPinjaman");
// const laporanController = require('../controllers/koperasi/laporanController');
const masterController = require('../controllers/master/masterController');
const kreditUmrohController = require("../controllers/koperasi/kreditUmrohController");
const kreditElektronikController = require("../controllers/koperasi/kreditElektronik");
const kreditMotorController = require("../controllers/koperasi/kreditMotorController");
const { exportData } = require('../controllers/master/eksporBackup');

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
// Route untuk mengambil data dashboard
router.get("/api/dashboard", masterController.getDashboardData); 
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

// <!=============================================== Route Kredit ===============================================> //

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
router.get('/api/anggotaKredit', kreditController.getAnggotaListKredit);

// Route untuk menampilkan halaman tambah kredit barang
router.get("/tambahKreditBarang", kreditController.getTambahKredit);


// Route untuk edit kredit barang
router.get('/kredit-barang/edit/:id', kreditController.getEditKreditBarang);
router.put('/kredit-barang/:id', kreditController.updateKreditBarang);

//Route untuk cari kredit barang
router.get("/api/kredit-barang/search", kreditController.searchKreditBarang);

// Route untuk Kredit Elektronik
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
router.get("/kreditElektronik/cari", kreditElektronikController.cariKreditElektronik);// router.delete("/kreditElektronik/hapus/:id", kreditUmrohController.hapusKreditUmroh);

// Route untuk Motor
router.get("/lihatKreditMotor", kreditMotorController.lihatKreditMotor);
router.get('/kreditMotor/getAnggota/:id', kreditMotorController.getAnggotaById);
// router.delete("/kreditElektronik/hapus/:id", kreditUmrohController.hapusKreditUmroh);
// router.get("/kreditElektronik/edit/:id", kreditUmrohController.tampilkanEditKreditUmroh);
// router.post("/kreditElektronik/edit/:id", kreditUmrohController.simpanEditKreditUmroh);
router.get("/kreditMotor/tambah", (req, res) => {
 res.render("koperasi/kreditKeuangan/kreditMotor/tambahKreditMotor");
 });
router.post("/kreditMotor/tambah", kreditMotorController.tambahKreditMotor);
// router.get("/kreditUmroh/getAnggota/:id", kreditUmrohController.getAnggotaById);
router.get("/kreditMotor/bayar/:id", kreditMotorController.tampilkanBayarKreditMotor);
router.post("/kreditMotor/bayar/:id", kreditMotorController.prosesBayarKreditMotor);
// router.get("/kreditUmroh/cari", kreditUmrohController.cariAnggota);

//Router edit kredit motor di sini
router.get('/kreditMotor/edit/:id', kreditMotorController.tampilkanEditKreditMotor);
router.put('/kredit-motor/:id', kreditMotorController.simpanEditKreditMotor);

//Route hapus kredit motor
router.delete("/kreditMotor/hapus/:id", kreditMotorController.hapusKreditMotor);

//Route hapus kredit motor
router.get("/kreditMotor/cari", kreditMotorController.cariKreditMotor);

// Route untuk Kredit Umroh
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
router.get("/api/anggota", simpananController.getAnggotaListSimpanan);
router.get("/api/simpanan/history/:id_anggota", simpananController.getHistorySimpanan);
router.post("/api/simpanan/periode", simpananController.createPeriode);

router.get("/api/simpanan/:id", simpananController.getSimpananById);
router.put("/api/simpanan/:id", simpananController.updateSimpanan);

router.post("/api/simpanan", simpananController.createSimpanan);
router.delete("/api/simpanan/:id", simpananController.deleteSimpanan);

// <!=============================================== Route Pinjaman ===============================================> //

// Route untuk Pinjaman
router.get("/lihatPinjaman", lihatPinjamanController.lihatPinjaman);

// Route untuk menghapus pinjaman
router.delete("/pinjaman/hapus/:id", lihatPinjamanController.hapusPinjaman);

// Route untuk menampilkan form edit pinjaman
router.get("/pinjaman/edit/:id", lihatPinjamanController.tampilkanEditPinjaman);

// Route untuk menyimpan perubahan pinjaman
router.post("/pinjaman/edit/:id", lihatPinjamanController.simpanEditPinjaman);

// Route untuk menampilkan form tambah pinjaman
router.get("/pinjaman/tambah", (req, res) => {
  res.render("koperasi/pinjamanKeuangan/tambahPinjaman");
});

// Route untuk menambahkan pinjaman
router.post("/pinjaman/tambah", lihatPinjamanController.tambahPinjaman);

// Route untuk mengambil data anggota berdasarkan ID
router.get("/pinjaman/getAnggota/:id", lihatPinjamanController.getAnggotaById);

// Route untuk menampilkan halaman bayar pinjaman
router.get("/pinjaman/bayar/:id", lihatPinjamanController.tampilkanBayarPinjaman);

// Route untuk menyimpan pembayaran pinjaman
router.post("/pinjaman/bayar/:id", lihatPinjamanController.prosesBayar);

// Route untuk mencari anggota
router.get("/pinjaman/cari", lihatPinjamanController.cariAnggota);

// <!=============================================== Route Master ===============================================> //

// Melakukan ekspor
router.get('/master/user/export/:format', (req, res) => {
  const format = req.params.format.toLowerCase();
  exportData(req, res, format);
});

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

router.get("/master/user", masterController.getUser);
router.get("/master/user/editUser/:id", masterController.getUserById);
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
router.get('/master/anggota/ubahAnggota/:id', masterController.getAnggotaById); //catatan ubah agar saat sudah tidak aktif tidak bisa diubah lagi
//router.post('/master/anggota/ubahAnggota/:id', masterController.updateAnggota);
router.post('/master/anggota/ubahStatus', masterController.updateAnggota);
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
