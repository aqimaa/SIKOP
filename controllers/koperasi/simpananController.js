const db = require('../../config/database');

const lihatSimpanan = (req, res) => {
    try {
        res.render("koperasi/simpananKeuangan/lihatsimpanan");
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: error });
    }
};

// Get data simpanan
const getSimpananData = (req, res) => {
    const query = `
        SELECT 
            s.id,
            a.nip,
            a.nama,
            s.tanggal,
            s.simpanan_wajib,
            s.simpanan_pokok,
            s.simpanan_sukarela,
            s.metode_bayar
        FROM simpanan s
        JOIN anggota a ON s.id_anggota = a.id
        ORDER BY s.tanggal DESC
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json(results);
    });
};

// Get data anggota untuk dropdown
const getAnggotaList = (req, res) => {
    const query = `
        SELECT 
            a.id,
            p.nip,
            p.nama
        FROM anggota a
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE a.status = 'aktif'
        ORDER BY p.nama ASC
    `;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json(results);
    });
};

// Filter data simpanan
const filterSimpanan = (req, res) => {
    const { anggota, tahun, bulan } = req.query;
    let query = `
        SELECT 
            MIN(s.id) as id,  /* Tambahkan ini untuk mendapatkan ID */
            id_anggota,
            p.nip,
            p.nama,
            MAX(s.tanggal) as tanggal,
            SUM(s.simpanan_wajib) as simpanan_wajib,
            SUM(s.simpanan_pokok) as simpanan_pokok,
            SUM(s.simpanan_sukarela) as simpanan_sukarela,
            s.metode_bayar
        FROM simpanan s
        JOIN anggota a ON s.id_anggota = a.id
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE 1=1
    `;

    const params = [];
    if (anggota) {
        query += ` AND s.id_anggota = ?`;
        params.push(anggota);
    }
    if (tahun) {
        query += ` AND YEAR(s.tanggal) = ?`;
        params.push(tahun);
    }
    if (bulan) {
        query += ` AND MONTH(s.tanggal) = ?`;
        params.push(bulan);
    }

    query += ` GROUP BY id_anggota, p.nip, p.nama, s.metode_bayar
              ORDER BY MAX(s.tanggal) DESC`;

    db.query(query, params, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json(results);
    });
};

const getAvailableYears = (req, res) => {
    const query = `
        SELECT DISTINCT YEAR(tanggal) as year 
        FROM simpanan 
        ORDER BY year ASC
    `;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json(results.map(row => row.year));
    });
};

// Create new simpanan
const createSimpanan = async (req, res) => {
    const { anggota, simpanan_wajib, simpanan_pokok, simpanan_sukarela, metode_bayar } = req.body;
    const tanggal = new Date().toISOString().slice(0, 10); // Get current date
    const tahun = new Date().getFullYear();
    const bulan = new Date().getMonth() + 1;

    try {
        // Check if there's already an entry for this member in this month and year
        const checkQuery = `
            SELECT s.id, s.simpanan_wajib, s.simpanan_pokok, s.simpanan_sukarela 
            FROM simpanan s 
            WHERE s.id_anggota = ? 
            AND YEAR(s.tanggal) = ? 
            AND MONTH(s.tanggal) = ?`;
        
        db.query(checkQuery, [anggota, tahun, bulan], (checkError, checkResults) => {
            if (checkError) {
                console.error("Error checking existing simpanan:", checkError);
                return res.status(500).json({ message: checkError.message });
            }

            if (checkResults.length > 0) {
                // Update existing record
                const existingRecord = checkResults[0];
                const updateQuery = `
                    UPDATE simpanan 
                    SET 
                        simpanan_wajib = simpanan_wajib + ?,
                        simpanan_pokok = simpanan_pokok + ?,
                        simpanan_sukarela = simpanan_sukarela + ?,
                        metode_bayar = ?,
                        tanggal = ?
                    WHERE id = ?`;

                const updateValues = [
                    simpanan_wajib || 0,
                    simpanan_pokok || 0,
                    simpanan_sukarela || 0,
                    metode_bayar,
                    tanggal, // Update tanggal dengan tanggal terakhir perubahan
                    existingRecord.id
                ];

                db.query(updateQuery, updateValues, (updateError, updateResults) => {
                    if (updateError) {
                        console.error("Error updating simpanan:", updateError);
                        return res.status(500).json({ message: updateError.message });
                    }

                    res.json({ 
                        message: 'Simpanan berhasil diperbarui',
                        id: existingRecord.id,
                        type: 'update'
                    });
                });
            } else {
                // Insert new record
                const insertQuery = `
                    INSERT INTO simpanan 
                    (id_anggota, tanggal, simpanan_wajib, simpanan_pokok, simpanan_sukarela, metode_bayar)
                    VALUES (?, ?, ?, ?, ?, ?)`;

                const insertValues = [
                    anggota,
                    tanggal,
                    simpanan_wajib || 0,
                    simpanan_pokok || 0,
                    simpanan_sukarela || 0,
                    metode_bayar
                ];

                db.query(insertQuery, insertValues, (insertError, insertResults) => {
                    if (insertError) {
                        console.error("Error inserting simpanan:", insertError);
                        return res.status(500).json({ message: insertError.message });
                    }

                    res.json({ 
                        message: 'Simpanan baru berhasil ditambahkan',
                        id: insertResults.insertId,
                        type: 'insert'
                    });
                });
            }
        });
    } catch (error) {
        console.error("Error in createSimpanan:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete simpanan
const deleteSimpanan = (req, res) => {
    const { id } = req.params;
    
    // Pertama ambil informasi dari simpanan yang akan dihapus
    const getInfoQuery = 'SELECT id_anggota, tanggal FROM simpanan WHERE id = ?';
    
    db.query(getInfoQuery, [id], (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Simpanan tidak ditemukan' });
        }

        const { id_anggota, tanggal } = results[0];
        const month = new Date(tanggal).getMonth() + 1;
        const year = new Date(tanggal).getFullYear();

        // Hapus semua simpanan dari anggota di bulan dan tahun yang sama
        const deleteQuery = `
            DELETE FROM simpanan 
            WHERE id_anggota = ? 
            AND MONTH(tanggal) = ? 
            AND YEAR(tanggal) = ?`;

        db.query(deleteQuery, [id_anggota, month, year], (deleteError) => {
            if (deleteError) {
                console.error("Error:", deleteError);
                return res.status(500).json({ message: deleteError.message });
            }
            res.json({ message: 'Simpanan berhasil dihapus' });
        });
    });
};
const getHistorySimpanan = (req, res) => {
    const { id_anggota } = req.params;
    
    const query = `
        SELECT 
            s.id,
            p.nip,
            p.nama,
            s.tanggal,
            s.simpanan_wajib,
            s.simpanan_pokok,
            s.simpanan_sukarela,
            s.metode_bayar,
            'Tambah/Update' as action_type
        FROM simpanan s
        JOIN anggota a ON s.id_anggota = a.id
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE s.id_anggota = ?
        ORDER BY s.tanggal DESC
    `;

    db.query(query, [id_anggota], (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json(results);
    });
};

module.exports = {
    lihatSimpanan,
    getSimpananData,
    getAnggotaList,
    filterSimpanan,
    getAvailableYears,
    createSimpanan,
    deleteSimpanan,
    getHistorySimpanan
};
