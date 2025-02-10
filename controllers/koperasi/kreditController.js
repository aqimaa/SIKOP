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
const deleteKredit = async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`🔹 Mencoba menghapus kredit barang dengan ID: ${id}`);

        // Hapus data pembayaran terkait dulu
        const deletePembayaran = await db.query("DELETE FROM pembayaran WHERE id_kredit = ?", [id]);
        console.log("🔹 Data pembayaran yang dihapus:", deletePembayaran);

        // Hapus data kredit barang
        const result = await db.query("DELETE FROM kredit_barang WHERE id = ?", [id]);
        console.log("🔹 Data Kredit Barang:", result);

        // Pastikan affectedRows tidak mengalami destructuring error
        if (!result || result.affectedRows === 0) {
            console.log("⚠️ Kredit barang tidak ditemukan atau gagal dihapus");
            return res.status(404).json({ success: false, message: "Kredit barang tidak ditemukan atau gagal dihapus" });
        }

        console.log("✅ Kredit barang berhasil dihapus");
        return res.status(200).json({ success: true, message: "Kredit barang berhasil dihapus" });

    } catch (error) {
        console.error("❌ Gagal menghapus kredit barang:", error);
        return res.status(500).json({ success: false, message: "Gagal menghapus kredit barang" });
    }
};

// ==================================================
// Fungsi Khusus untuk Kredit Barang
// ==================================================


// Create Kredit Barang
exports.createKreditBarang = async (req, res) => {
    try {
        const {
            id_anggota,
            harga_pokok,
            jangka_waktu,
            pokok_dp,
            margin,
            total_angsuran,
            angsuran_pokok, // pokok
            margin_per_bulan, // margin
            total_margin,
            tanggal_perjanjian
        } = req.body;

        // Set nilai default untuk field lainnya
        const angsuran_ke = 1;
        const sisa_piutang = harga_pokok - pokok_dp;
        const ket_status = 'Belum Lunas';

        const query = `
            INSERT INTO kredit_barang 
            (id_anggota, harga_pokok, jangka_waktu, pokok_dp, total_angsuran,
            pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            id_anggota,
            harga_pokok,
            jangka_waktu,
            pokok_dp,
            total_angsuran,
            angsuran_pokok,
            margin_per_bulan,
            angsuran_ke,
            sisa_piutang,
            tanggal_perjanjian,
            ket_status
        ];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menambahkan data kredit barang'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Data kredit barang berhasil ditambahkan'
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan data kredit barang'
        });
    }
};
  

exports.getAnggotaList = (req, res) => {
    const { search } = req.query;
    
    let sql = `
        SELECT a.id, p.nama 
        FROM anggota a 
        JOIN pegawai p ON a.nip_anggota = p.nip 
        WHERE a.status = 'Aktif'
    `;
    
    if (search) {
        sql += ` AND (p.nama LIKE '%${search}%' OR CAST(a.id AS CHAR) LIKE '%${search}%')`;
    }
    
    sql += ` ORDER BY p.nama ASC`;

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: 'Gagal mengambil data anggota' });
        }
        console.log('Results:', results); // untuk debugging
        res.json(results);
    });
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
    try {
      const { id } = req.params;
      console.log(`🔹 Mencoba menghapus kredit barang dengan ID: ${id}`);
  
      // Hapus data pembayaran dulu
      await db.query("DELETE FROM pembayaran WHERE id_kredit_barang = ?", [id]);
  
      // Hapus data kredit_barang
      const [result] = await db.query("DELETE FROM kredit_barang WHERE id = ?", [id]);
  
      // Cek hasil query
      if (!result || result.affectedRows === 0) {
        console.log("⚠️ Kredit barang tidak ditemukan atau gagal dihapus");
        return res.status(404).json({
          success: false,
          message: "Data tidak ditemukan"
        });
      }
  
      console.log("✅ Kredit barang berhasil dihapus");
      return res.status(200).json({
        success: true,
        message: "Data berhasil dihapus"
      });
  
    } catch (error) {
      console.error("❌ Gagal menghapus kredit barang:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal menghapus data"
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