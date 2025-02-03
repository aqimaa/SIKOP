const connection = require('../../config/database');

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

    connection.query(query, (error, results) => {
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
    
    connection.query(query, (error, results) => {
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
            s.id,
            p.nip,
            p.nama,
            s.tanggal,
            s.simpanan_wajib,
            s.simpanan_pokok,
            s.simpanan_sukarela,
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
   
    query += ` ORDER BY s.tanggal DESC`;

    connection.query(query, params, (error, results) => {
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
    
    connection.query(query, (error, results) => {
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

    try {
        // Check if there's already an entry for this member on this date
        const checkQuery = `
            SELECT s.id, s.simpanan_wajib, s.simpanan_pokok, s.simpanan_sukarela 
            FROM simpanan s 
            WHERE s.id_anggota = ? AND DATE(s.tanggal) = ?`;
        
        connection.query(checkQuery, [anggota, tanggal], (checkError, checkResults) => {
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
                        metode_bayar = ?
                    WHERE id = ?`;

                const updateValues = [
                    simpanan_wajib || 0,
                    simpanan_pokok || 0,
                    simpanan_sukarela || 0,
                    metode_bayar,
                    existingRecord.id
                ];

                connection.query(updateQuery, updateValues, (updateError, updateResults) => {
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

                connection.query(insertQuery, insertValues, (insertError, insertResults) => {
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
    
    const query = 'DELETE FROM simpanan WHERE id = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json({ message: 'Simpanan berhasil dihapus' });
    });
};

module.exports = {
    lihatSimpanan,
    getSimpananData,
    getAnggotaList,
    filterSimpanan,
    getAvailableYears,
    createSimpanan,
    deleteSimpanan
};