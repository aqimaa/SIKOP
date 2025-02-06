const db = require('../../config/database'); // Sesuaikan dengan konfigurasi database Anda

// ==================================================
// Fungsi Umum untuk Kredit Elektronik, Motor, Umroh
// ==================================================

// Fungsi umum untuk membuat kredit (elektronik, motor, umroh)
const createKredit = async (req, res, tableName) => {
    const { id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO ${tableName} 
            (id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status]
        );

        res.status(201).json({
            message: `Kredit di tabel ${tableName} berhasil ditambahkan`,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: `Gagal menambahkan kredit di tabel ${tableName}`,
            error: error.message
        });
    }
};

// Fungsi umum untuk mengambil semua data kredit (elektronik, motor, umroh)
const getAllKredit = async (req, res, tableName) => {
    try {
        const [results] = await db.query(`SELECT * FROM ${tableName}`);
        res.status(200).json({
            message: `Data kredit di tabel ${tableName} berhasil diambil`,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            message: `Gagal mengambil data kredit di tabel ${tableName}`,
            error: error.message
        });
    }
};

// Fungsi umum untuk mengambil kredit berdasarkan ID (elektronik, motor, umroh)
const getKreditById = async (req, res, tableName) => {
    const { id } = req.params;

    try {
        const [results] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
        if (results.length === 0) {
            return res.status(404).json({
                message: `Kredit di tabel ${tableName} tidak ditemukan`
            });
        }

        res.status(200).json({
            message: `Data kredit di tabel ${tableName} berhasil diambil`,
            data: results[0]
        });
    } catch (error) {
        res.status(500).json({
            message: `Gagal mengambil data kredit di tabel ${tableName}`,
            error: error.message
        });
    }
};

// Fungsi umum untuk memperbarui kredit (elektronik, motor, umroh)
const updateKredit = async (req, res, tableName) => {
    const { id } = req.params;
    const { id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE ${tableName} 
            SET id_anggota = ?, jumlah_pinjaman = ?, jangka_waktu = ?, total_angsuran = ?, pokok = ?, margin = ?, angsuran_ke = ?, sisa_piutang = ?, tanggal_mulai = ?, ket_status = ?
            WHERE id = ?`,
            [id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: `Kredit di tabel ${tableName} tidak ditemukan`
            });
        }

        res.status(200).json({
            message: `Kredit di tabel ${tableName} berhasil diperbarui`,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: `Gagal memperbarui kredit di tabel ${tableName}`,
            error: error.message
        });
    }
};

// Fungsi umum untuk menghapus kredit (elektronik, motor, umroh)
const deleteKredit = async (req, res, tableName) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: `Kredit di tabel ${tableName} tidak ditemukan`
            });
        }

        res.status(200).json({
            message: `Kredit di tabel ${tableName} berhasil dihapus`,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: `Gagal menghapus kredit di tabel ${tableName}`,
            error: error.message
        });
    }
};

// ==================================================
// Fungsi Khusus untuk Kredit Barang
// ==================================================


// Create Kredit Barang
exports.createKreditBarang = async (req, res) => {
    const { harga_pokok, jangka_waktu, pokok_dp, margin, tanggal_perjanjian, total_angsuran, total_margin } = req.body;

    try {
        await db.query(
            `INSERT INTO kredit_barang 
            (harga_pokok, jangka_waktu, pokok_dp, margin, tanggal_perjanjian, total_angsuran, total_margin) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [harga_pokok, jangka_waktu, pokok_dp, margin, tanggal_perjanjian, total_angsuran, total_margin]
        );

        // Redirect ke halaman daftar kredit barang setelah sukses menyimpan
        res.redirect('/kredit-barang');
    } catch (error) {
        res.status(500).json({
            message: 'Gagal menambahkan kredit barang',
            error: error.message
        });
    }
};


// Menampilkan halaman Tambah Kredit Barang
exports.getTambahKredit = (req, res) => {
    res.render('koperasi/kreditKeuangan/kreditBarang/tambahKredit');
};

// Read All Kredit Barang
// Fungsi untuk mengambil semua data kredit barang
exports.getAllKreditBarang = (req, res) => {
    const sql = `
        SELECT
            kb.id,
            kb.id_anggota,
            p.nama AS nama_anggota,  
            kb.harga_pokok,
            kb.jangka_waktu,
            kb.pokok_dp,
            kb.total_angsuran,
            kb.pokok,
            kb.margin,
            kb.angsuran_ke,
            kb.sisa_piutang,
            kb.tanggal_mulai,
            kb.ket_status
        FROM kredit_barang kb
        JOIN anggota a ON kb.id_anggota = a.id
        JOIN pegawai p ON a.nip_anggota = p.nip;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).send("Internal Server Error");
        }

        console.log("Hasil Query:", results); // Cek hasil query di terminal

        res.render('koperasi/kreditKeuangan/kreditBarang/lihatKreditBarang', {
            data: results
        });
    });
};




// Read Kredit Barang by ID
exports.getKreditBarangById = async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query('SELECT * FROM kredit_barang WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({
                message: 'Kredit barang tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Data kredit barang berhasil diambil',
            data: results[0]
        });
    } catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data kredit barang',
            error: error.message
        });
    }
};

// Update Kredit Barang
exports.updateKreditBarang = async (req, res) => {
    const { id } = req.params;
    const { id_anggota, harga_pokok, jangka_waktu, pokok_dp, total_angsuran, pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE kredit_barang 
            SET id_anggota = ?, harga_pokok = ?, jangka_waktu = ?, pokok_dp = ?, total_angsuran = ?, pokok = ?, margin = ?, angsuran_ke = ?, sisa_piutang = ?, tanggal_mulai = ?, ket_status = ?
            WHERE id = ?`,
            [id_anggota, harga_pokok, jangka_waktu, pokok_dp, total_angsuran, pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Kredit barang tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Kredit barang berhasil diperbarui',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: 'Gagal memperbarui kredit barang',
            error: error.message
        });
    }
};

// Delete Kredit Barang
exports.deleteKreditBarang = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM kredit_barang WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Kredit barang tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Kredit barang berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Gagal menghapus kredit barang',
            error: error.message
        });
    }
};

// ==================================================
// Controller untuk Kredit Elektronik, Motor, Umroh
// ==================================================

// Kredit Elektronik
exports.createKreditElektronik = (req, res) => createKredit(req, res, 'kredit_elektronik');
exports.getAllKreditElektronik = (req, res) => getAllKredit(req, res, 'kredit_elektronik');
exports.getKreditElektronikById = (req, res) => getKreditById(req, res, 'kredit_elektronik');
exports.updateKreditElektronik = (req, res) => updateKredit(req, res, 'kredit_elektronik');
exports.deleteKreditElektronik = (req, res) => deleteKredit(req, res, 'kredit_elektronik');

// Kredit Motor
exports.createKreditMotor = (req, res) => createKredit(req, res, 'kredit_motor');
exports.getAllKreditMotor = (req, res) => getAllKredit(req, res, 'kredit_motor');
exports.getKreditMotorById = (req, res) => getKreditById(req, res, 'kredit_motor');
exports.updateKreditMotor = (req, res) => updateKredit(req, res, 'kredit_motor');
exports.deleteKreditMotor = (req, res) => deleteKredit(req, res, 'kredit_motor');

// Kredit Umroh
exports.createKreditUmroh = (req, res) => createKredit(req, res, 'kredit_umroh');
exports.getAllKreditUmroh = (req, res) => getAllKredit(req, res, 'kredit_umroh');
exports.getKreditUmrohById = (req, res) => getKreditById(req, res, 'kredit_umroh');
exports.updateKreditUmroh = (req, res) => updateKredit(req, res, 'kredit_umroh');
exports.deleteKreditUmroh = (req, res) => deleteKredit(req, res, 'kredit_umroh');