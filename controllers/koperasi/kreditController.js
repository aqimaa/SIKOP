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
  

exports.getAnggotaListKredit = (req, res) => {
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
exports.updateKreditBarang = (req, res) => {
    const { id } = req.params;
    const { 
        id_anggota, 
        harga_pokok, 
        jangka_waktu, 
        pokok_dp, 
        total_angsuran, 
        ket_status,
        pokok,
        margin,
        angsuran_ke,
        sisa_piutang,
        tanggal_mulai
    } = req.body;

    // Tambahkan logging untuk debugging
    console.log('Update Request:', req.body);

    const formattedDate = new Date(tanggal_mulai).toISOString().split('T')[0];

    const query = `
        UPDATE kredit_barang 
        SET 
            id_anggota = ?, 
            harga_pokok = ?, 
            jangka_waktu = ?, 
            pokok_dp = ?, 
            total_angsuran = ?, 
            ket_status = ?,
            pokok = ?,
            margin = ?,
            angsuran_ke = ?,
            sisa_piutang = ?,
            tanggal_mulai = ?
        WHERE id = ?
    `;

    const values = [
        id_anggota, 
        harga_pokok, 
        jangka_waktu, 
        pokok_dp, 
        total_angsuran, 
        ket_status,
        pokok,
        margin,
        angsuran_ke,
        sisa_piutang,
        formattedDate,
        id
    ];

    db.query(query, values, (error, result) => {
        if (error) {
            console.error('Error updating kredit barang:', error);
            return res.status(500).json({
                success: false,
                message: 'Gagal memperbarui kredit barang',
                error: error.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kredit barang tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data kredit barang berhasil diperbarui'
        });
    });
};

exports.getEditKreditBarang = (req, res) => {
    const { id } = req.params;

    const kreditQuery = `
        SELECT 
            kb.*,
            p.nama as nama_anggota
        FROM kredit_barang kb
        JOIN anggota a ON kb.id_anggota = a.id
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE kb.id = ?
    `;

    db.query(kreditQuery, [id], (error, results) => {
        if (error) {
            console.error('Error getting kredit barang:', error);
            return res.status(500).send('Gagal mengambil data kredit barang');
        }

        if (results.length === 0) {
            return res.status(404).send('Kredit barang tidak ditemukan');
        }

        res.render('koperasi/kreditKeuangan/kreditBarang/editKreditBarang', {
            kredit: results[0]
        });
    });
};


// Delete Kredit Barang
exports.hapusKreditElektronik = async (req, res) => {
    const connection = await db.getConnection(); // Dapatkan koneksi untuk transaksi
    
    try {
      const id = req.params.id;
  
      // Mulai transaksi
      await connection.beginTransaction();
  
      // Hapus data pembayaran terkait terlebih dahulu
      const [deletePembayaranResult] = await connection.query(
        "DELETE FROM pembayaran WHERE id_kredit_elektronik = ?", 
        [id]
      );
  
      // Kemudian hapus data kredit elektronik
      const [deleteKreditElektronikResult] = await connection.query(
        "DELETE FROM kredit_elektronik WHERE id = ?", 
        [id]
      );
  
      // Commit transaksi
      await connection.commit();
  
      // Periksa apakah data berhasil dihapus
      if (deleteKreditElektronikResult.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Data kredit elektronik tidak ditemukan"
        });
      }
  
      // Kirim respons sukses
      res.json({
        success: true,
        message: "Data kredit elektronik berhasil dihapus"
      });
  
    } catch (error) {
      // Rollback transaksi jika terjadi error
      if (connection) await connection.rollback();
  
      console.error("Error saat menghapus kredit elektronik:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus kredit elektronik",
        error: error.message
      });
  
    } finally {
      // Pastikan koneksi ditutup
      if (connection) connection.release();
    }
};

//Method searvh untuk cari kredit barang
exports.searchKreditBarang = (req, res) => {
    const { search } = req.query;
    
    // Tambahkan log
    console.log('Search Query:', search);
    
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
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE LOWER(p.nama) LIKE LOWER(?)
        ORDER BY kb.id DESC
    `;

    // Tambahkan debug log
    console.log('Running query with search:', `%${search}%`);

    db.query(sql, [`%${search}%`], (err, results) => {
        if (err) {
            console.error("Error SQL:", err);
            return res.status(500).json({ 
                success: false,
                message: "Terjadi kesalahan saat mencari data",
                error: err.message 
            });
        }
        // Log hasil
        console.log('Search results:', results);
        res.json(results || []);
    });
};

// Delete Kredit Barang
exports.deleteKreditBarang = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔹 Mencoba menghapus kredit barang dengan ID: ${id}`);

        // Hapus data pembayaran terkait dulu
        await new Promise((resolve, reject) => {
            db.query("DELETE FROM pembayaran WHERE id_kredit_barang = ?", [id], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Hapus data kredit_barang
        const result = await new Promise((resolve, reject) => {
            db.query("DELETE FROM kredit_barang WHERE id = ?", [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // Cek hasil query
        if (result.affectedRows === 0) {
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
            message: "Gagal menghapus data",
            error: error.message
        });
    }
};

// Menampilkan halaman pembayaran kredit barang
exports.getBayarKreditBarang = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Query untuk mendapatkan detail kredit dengan nama anggota
        const kreditQuery = `
            SELECT 
                kb.*,
                p.nama as nama_anggota
            FROM kredit_barang kb
            JOIN anggota a ON kb.id_anggota = a.id
            JOIN pegawai p ON a.nip_anggota = p.nip
            WHERE kb.id = ?
        `;

        // Query untuk mendapatkan riwayat pembayaran
        const pembayaranQuery = `
            SELECT 
                id,
                tanggal_bayar,
                angsuran_ke,
                jumlah_bayar,
                ket
            FROM pembayaran 
            WHERE id_kredit_barang = ?
            ORDER BY tanggal_bayar DESC
        `;

        // Eksekusi query menggunakan callback
        db.query(kreditQuery, [id], (errKredit, kreditResults) => {
            if (errKredit) {
                console.error('Error query kredit:', errKredit);
                return res.status(500).send('Terjadi kesalahan saat mengambil data kredit');
            }

            if (kreditResults.length === 0) {
                return res.status(404).send('Data kredit tidak ditemukan');
            }

            // Query pembayaran
            db.query(pembayaranQuery, [id], (errPembayaran, pembayaranResults) => {
                if (errPembayaran) {
                    console.error('Error query pembayaran:', errPembayaran);
                    return res.status(500).send('Terjadi kesalahan saat mengambil data pembayaran');
                }

                // Render halaman dengan data
                res.render('koperasi/kreditKeuangan/kreditBarang/bayarKreditBarang', {
                    kredit: kreditResults[0],
                    pembayaran: pembayaranResults || [] // Pastikan pembayaran selalu array
                });
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat memuat halaman pembayaran');
    }
};

// Proses pembayaran kredit barang
exports.prosesBayarKreditBarang = (req, res) => {
    console.log('Payment request received:', {
        kreditId: req.params.id,
        body: req.body
    });

    // Mulai transaksi
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal memulai transaksi',
                error: err.message
            });
        }

        const { id } = req.params;
        const { tanggal_bayar, jumlah_bayar, keterangan } = req.body;

        // Validasi input
        if (!tanggal_bayar || !jumlah_bayar) {
            res.setHeader('Content-Type', 'application/json');
            return db.rollback(() => {
                res.status(400).json({
                    success: false,
                    message: 'Tanggal dan jumlah bayar wajib diisi'
                });
            });
        }

        // Query untuk mendapatkan data kredit saat ini
        db.query('SELECT * FROM kredit_barang WHERE id = ?', [id], (errKredit, kredits) => {
            if (errKredit) {
                return db.rollback(() => {
                    res.status(500).json({
                        success: false,
                        message: 'Gagal mengambil data kredit',
                        error: errKredit.message
                    });
                });
            }
            
            if (kredits.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({
                        success: false,
                        message: 'Kredit tidak ditemukan'
                    });
                });
            }

            const currentKredit = kredits[0];
            
            // Validasi jumlah bayar
            const jumlahBayarNumeric = parseFloat(jumlah_bayar);
            if (jumlahBayarNumeric > currentKredit.sisa_piutang) {
                return db.rollback(() => {
                    return db.rollback(() => {
                            res.status(400).json({
                            success: false,
                            message: `Jumlah bayar (Rp ${jumlahBayarNumeric.toLocaleString('id-ID')}) tidak boleh melebihi sisa hutang (Rp ${currentKredit.sisa_piutang.toLocaleString('id-ID')})`,
                        });
                    });
                });
            }

            const newAngsuranKe = currentKredit.angsuran_ke + 1;
            const newSisaPiutang = currentKredit.sisa_piutang - jumlahBayarNumeric;
            const isLunas = newSisaPiutang <= 0 || newAngsuranKe >= currentKredit.jangka_waktu;

            // Simpan pembayaran
            db.query(
                `INSERT INTO pembayaran (
                    id_kredit_barang, 
                    tanggal_bayar, 
                    angsuran_ke, 
                    jumlah_bayar, 
                    ket
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    id, 
                    tanggal_bayar, 
                    newAngsuranKe, 
                    jumlahBayarNumeric, 
                    keterangan || 'Pembayaran Angsuran'
                ],
                (errPembayaran) => {
                    if (errPembayaran) {
                        return db.rollback(() => {
                            res.status(500).json({
                                success: false,
                                message: 'Gagal menyimpan pembayaran',
                                error: errPembayaran.message
                            });
                        });
                    }

                    // Update status kredit
                    db.query(
                        `UPDATE kredit_barang 
                        SET 
                            angsuran_ke = ?,
                            sisa_piutang = ?,
                            ket_status = ?
                        WHERE id = ?`,
                        [
                            newAngsuranKe, 
                            newSisaPiutang, 
                            isLunas ? 'Lunas' : 'Belum Lunas', 
                            id
                        ],
                        (errUpdate) => {
                            if (errUpdate) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        success: false,
                                        message: 'Gagal memperbarui status kredit',
                                        error: errUpdate.message
                                    });
                                });
                            }

                            // Commit transaksi
                            db.commit((errCommit) => {
                                if (errCommit) {
                                    return db.rollback(() => {
                                        // Set header JSON
                                        res.setHeader('Content-Type', 'application/json');
                                        res.status(500).json({
                                            success: false,
                                            message: 'Gagal commit transaksi',
                                            error: errCommit.message
                                        });
                                    });
                                }
                    
                                // Set header JSON
                                res.setHeader('Content-Type', 'application/json');
                    
                                // Kirim respon sukses
                                res.status(200).json({
                                    success: true,
                                    message: `Pembayaran angsuran ke-${newAngsuranKe} sebesar Rp ${jumlahBayarNumeric.toLocaleString('id-ID')} berhasil disimpan`,
                                    angsuranKe: newAngsuranKe,
                                    sisaPiutang: newSisaPiutang,
                                    status: isLunas ? 'Lunas' : 'Belum Lunas'
                                });
                            });                        
                        }
                    );
                }
            );
        });
    });
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