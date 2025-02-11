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
const getAnggotaListSimpanan = (req, res) => {
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
    const { anggota, tahun } = req.query;
    let query = `
        SELECT
            MIN(s.id) as id,
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

    // Modifikasi kondisi tahun
    if (tahun && tahun !== '') {
        query += ` AND YEAR(s.tanggal) = ?`;
        params.push(tahun);
    }

    query += ` GROUP BY id_anggota, p.nip, p.nama, s.metode_bayar, MONTH(s.tanggal), YEAR(s.tanggal)
              ORDER BY s.tanggal ASC`;

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

const createPeriode = async (req, res) => {
    const { tahun, bulan } = req.body;
    
    try {
        // Get all active members
        const getActiveMembers = `
            SELECT id 
            FROM anggota 
            WHERE status = 'aktif'
        `;
        
        db.query(getActiveMembers, async (error, members) => {
            if (error) {
                console.error("Error getting members:", error);
                return res.status(500).json({ message: error.message });
            }

            // Set tanggal ke awal bulan yang dipilih
            const tanggal = new Date(tahun, bulan - 1, 1);
            const formattedDate = tanggal.toISOString().split('T')[0];

            // Create records for each active member
            for (const member of members) {
                const createQuery = `
                    INSERT INTO simpanan 
                    (id_anggota, tanggal, simpanan_wajib, simpanan_pokok, simpanan_sukarela, metode_bayar)
                    VALUES (?, ?, 0, 0, 0, 'system')
                `;

                try {
                    const result = await new Promise((resolve, reject) => {
                        db.query(createQuery, [member.id, formattedDate], (err, res) => {
                            if (err) reject(err);
                            resolve(res);
                        });
                    });

                    // Save to history
                    const historyQuery = `
                        INSERT INTO simpanan_history
                        (simpanan_id, id_anggota, action_type, new_data, changed_by)
                        VALUES (?, ?, 'buat', ?, 'system')
                    `;

                    const newData = {
                        id: result.insertId,
                        id_anggota: member.id,
                        tanggal: formattedDate,
                        simpanan_wajib: 0,
                        simpanan_pokok: 0,
                        simpanan_sukarela: 0,
                        metode_bayar: 'system'
                    };

                    await new Promise((resolve, reject) => {
                        db.query(historyQuery, [result.insertId, member.id, JSON.stringify(newData)], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    });
                } catch (err) {
                    console.error("Error creating record for member:", member.id, err);
                    // Continue with next member even if one fails
                }
            }

            res.json({
                success: true,
                message: 'Periode berhasil dibuat',
                tahun,
                bulan
            });
        });
    } catch (error) {
        console.error("Error in createPeriode:", error);
        res.status(500).json({ message: error.message });
    }
};


// Create new simpanan
const createSimpanan = async (req, res) => {
    const { anggota, simpanan_wajib, simpanan_pokok, simpanan_sukarela, metode_bayar } = req.body;
    const tanggal = new Date().toISOString().slice(0, 10);
    const tahun = new Date().getFullYear();
    const bulan = new Date().getMonth() + 1;

    try {
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
                const oldData = {
                    id: existingRecord.id,
                    id_anggota: anggota,
                    tanggal,
                    simpanan_wajib: existingRecord.simpanan_wajib,
                    simpanan_pokok: existingRecord.simpanan_pokok,
                    simpanan_sukarela: existingRecord.simpanan_sukarela,
                    metode_bayar
                };

                const newData = {
                    id: existingRecord.id,
                    id_anggota: anggota,
                    tanggal,
                    simpanan_wajib: parseFloat(existingRecord.simpanan_wajib) + parseFloat(simpanan_wajib || 0),
                    simpanan_pokok: parseFloat(existingRecord.simpanan_pokok) + parseFloat(simpanan_pokok || 0),
                    simpanan_sukarela: parseFloat(existingRecord.simpanan_sukarela) + parseFloat(simpanan_sukarela || 0),
                    metode_bayar
                };

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
                    parseFloat(simpanan_wajib || 0),
                    parseFloat(simpanan_pokok || 0),
                    parseFloat(simpanan_sukarela || 0),
                    metode_bayar,
                    tanggal,
                    existingRecord.id
                ];

                db.query(updateQuery, updateValues, (updateError) => {
                    if (updateError) {
                        console.error("Error updating simpanan:", updateError);
                        return res.status(500).json({ message: updateError.message });
                    }

                    const historyQuery = `
                        INSERT INTO simpanan_history
                        (simpanan_id, id_anggota, action_type, old_data, new_data, changed_by)
                        VALUES (?, ?, ?, ?, ?, ?)`;

                    const historyValues = [
                        existingRecord.id,
                        anggota,
                        'tambah', // Changed from 'update' to 'tambah'
                        JSON.stringify(oldData),
                        JSON.stringify(newData),
                        req.session?.email || 'system'
                    ];

                    db.query(historyQuery, historyValues);
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
                    parseFloat(simpanan_wajib || 0),
                    parseFloat(simpanan_pokok || 0),
                    parseFloat(simpanan_sukarela || 0),
                    metode_bayar
                ];

                db.query(insertQuery, insertValues, (insertError, insertResults) => {
                    if (insertError) {
                        console.error("Error inserting simpanan:", insertError);
                        return res.status(500).json({ message: insertError.message });
                    }

                    const newData = {
                        id: insertResults.insertId,
                        id_anggota: anggota,
                        tanggal,
                        simpanan_wajib: parseFloat(simpanan_wajib || 0),
                        simpanan_pokok: parseFloat(simpanan_pokok || 0),
                        simpanan_sukarela: parseFloat(simpanan_sukarela || 0),
                        metode_bayar
                    };

                    const historyQuery = `
                        INSERT INTO simpanan_history
                        (simpanan_id, id_anggota, action_type, old_data, new_data, changed_by)
                        VALUES (?, ?, ?, ?, ?, ?)`;

                    const historyValues = [
                        insertResults.insertId,
                        anggota,
                        'buat',
                        null,
                        JSON.stringify(newData),
                        req.session?.email || 'system'
                    ];

                    db.query(historyQuery, historyValues);
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
    
    // First get info about the simpanan to be deleted
    const getInfoQuery = 'SELECT * FROM simpanan WHERE id = ?';
    
    db.query(getInfoQuery, [id], (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Simpanan tidak ditemukan' });
        }

        const simpananData = results[0];
        const { id_anggota, tanggal } = simpananData;
        const month = new Date(tanggal).getMonth() + 1;
        const year = new Date(tanggal).getFullYear();

        // Record the delete action in history before deleting
        const historyQuery = `
            INSERT INTO simpanan_history
            (simpanan_id, id_anggota, action_type, old_data, new_data, changed_by)
            VALUES (?, ?, ?, ?, ?, ?)`;

        const historyValues = [
            id,
            id_anggota,
            'delete',
            JSON.stringify(simpananData),
            null,
            req.session?.email || 'system'
        ];

        db.query(historyQuery, historyValues, (historyError) => {
            if (historyError) {
                console.error("Error recording history:", historyError);
                // Continue with deletion even if history recording fails
            }

            // Delete all simpanan records for this member in the same month and year
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
    });
};

// Get single simpanan data
const getSimpananById = (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT 
            s.id,
            s.id_anggota,
            p.nip,
            p.nama,
            s.simpanan_wajib,
            s.simpanan_pokok,
            s.simpanan_sukarela,
            s.metode_bayar
        FROM simpanan s
        JOIN anggota a ON s.id_anggota = a.id
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE s.id = ?
    `;
    
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Data simpanan tidak ditemukan' });
        }
        
        res.json(results[0]);
    });
};

const updateSimpanan = async (req, res) => {
    const { id } = req.params;
    const { simpanan_wajib, simpanan_pokok, simpanan_sukarela, metode_bayar } = req.body;
    
    try {
        // First get the old data
        const getOldDataQuery = `
            SELECT * FROM simpanan WHERE id = ?
        `;
        
        db.query(getOldDataQuery, [id], async (error, oldResults) => {
            if (error) {
                console.error("Error fetching old data:", error);
                return res.status(500).json({ message: error.message });
            }

            const oldData = oldResults[0];
            const newData = {
                simpanan_wajib,
                simpanan_pokok,
                simpanan_sukarela,
                metode_bayar
            };

            // Update the simpanan
            const updateQuery = `
                UPDATE simpanan
                SET
                    simpanan_wajib = ?,
                    simpanan_pokok = ?,
                    simpanan_sukarela = ?,
                    metode_bayar = ?
                WHERE id = ?
            `;

            const values = [
                simpanan_wajib || 0,
                simpanan_pokok || 0,
                simpanan_sukarela || 0,
                metode_bayar,
                id
            ];

            db.query(updateQuery, values, async (updateError) => {
                if (updateError) {
                    console.error("Error:", updateError);
                    return res.status(500).json({ message: updateError.message });
                }

                // Record the change in history
                const historyQuery = `
                    INSERT INTO simpanan_history 
                    (simpanan_id, id_anggota, action_type, old_data, new_data, changed_by)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                const historyValues = [
                    id,
                    oldData.id_anggota,
                    'edit', // Ubah dari 'update' menjadi 'edit'
                    JSON.stringify(oldData),
                    JSON.stringify(newData),
                    req.session?.email || 'system'
                ];

                db.query(historyQuery, historyValues, (historyError) => {
                    if (historyError) {
                        console.error("Error recording history:", historyError);
                        // Don't return error to client as the main update succeeded
                    }

                    res.json({ message: 'Simpanan berhasil diperbarui' });
                });
            });
        });
    } catch (error) {
        console.error("Error in updateSimpanan:", error);
        res.status(500).json({ message: error.message });
    }
};

const getHistorySimpanan = (req, res) => {
    const { id_anggota } = req.params;
    
    const query = `
        SELECT 
            sh.simpanan_id as id,
            sh.id_anggota,
            p.nip,
            p.nama,
            COALESCE(
                JSON_UNQUOTE(JSON_EXTRACT(sh.new_data, '$.tanggal')),
                JSON_UNQUOTE(JSON_EXTRACT(sh.old_data, '$.tanggal'))
            ) as tanggal,
            COALESCE(
                CAST(JSON_EXTRACT(sh.new_data, '$.simpanan_wajib') AS DECIMAL(10,2)),
                CAST(JSON_EXTRACT(sh.old_data, '$.simpanan_wajib') AS DECIMAL(10,2))
            ) as simpanan_wajib,
            COALESCE(
                CAST(JSON_EXTRACT(sh.new_data, '$.simpanan_pokok') AS DECIMAL(10,2)),
                CAST(JSON_EXTRACT(sh.old_data, '$.simpanan_pokok') AS DECIMAL(10,2))
            ) as simpanan_pokok,
            COALESCE(
                CAST(JSON_EXTRACT(sh.new_data, '$.simpanan_sukarela') AS DECIMAL(10,2)),
                CAST(JSON_EXTRACT(sh.old_data, '$.simpanan_sukarela') AS DECIMAL(10,2))
            ) as simpanan_sukarela,
            COALESCE(
                JSON_UNQUOTE(JSON_EXTRACT(sh.new_data, '$.metode_bayar')),
                JSON_UNQUOTE(JSON_EXTRACT(sh.old_data, '$.metode_bayar'))
            ) as metode_bayar,
            sh.action_date,
            sh.action_type,
            sh.old_data,
            sh.new_data
        FROM simpanan_history sh
        JOIN anggota a ON sh.id_anggota = a.id
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE sh.id_anggota = ?
        ORDER BY sh.action_date DESC`;

    db.query(query, [id_anggota], (error, results) => {
        if (error) {
            console.error("Error fetching history:", error);
            return res.status(500).json({ message: error.message });
        }

        // Map the results to ensure proper data formatting
        const formattedResults = results.map(item => ({
            ...item,
            simpanan_wajib: parseFloat(item.simpanan_wajib || 0),
            simpanan_pokok: parseFloat(item.simpanan_pokok || 0),
            simpanan_sukarela: parseFloat(item.simpanan_sukarela || 0),
            // Convert JSON strings to objects if needed
            old_data: item.old_data ? JSON.parse(item.old_data) : null,
            new_data: item.new_data ? JSON.parse(item.new_data) : null
        }));

        res.json(formattedResults);
    });
};

module.exports = {
    lihatSimpanan,
    createPeriode,
    getSimpananData,
    getAnggotaListSimpanan,
    filterSimpanan,
    getAvailableYears,
    createSimpanan,
    deleteSimpanan,
    getHistorySimpanan,
    updateSimpanan,
    getSimpananById
};
