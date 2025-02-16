const db = require('../../config/database')

const createKredit = async (req, res, tableName) => {
    const {
        id_anggota,
        jumlah_pinjaman,
        jangka_waktu,
        total_angsuran,
        pokok,
        margin,
        angsuran_ke,
        sisa_piutang,
        tanggal_mulai,
        ket_status
    } = req.body

    try {
        const [result] = await db.query(
            `INSERT INTO ${tableName} 
            (id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id_anggota,
                jumlah_pinjaman,
                jangka_waktu,
                total_angsuran,
                pokok,
                margin,
                angsuran_ke,
                sisa_piutang,
                tanggal_mulai,
                ket_status
            ]
        )

        res.status(201).json({
            message: `Kredit di tabel ${tableName} berhasil ditambahkan`,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            message: `Gagal menambahkan kredit di tabel ${tableName}`,
            error: error.message
        })
    }
}

const getAllKredit = async (req, res, tableName) => {
    try {
        const [results] = await db.query(`SELECT * FROM ${tableName}`)
        res.status(200).json({
            message: `Data kredit di tabel ${tableName} berhasil diambil`,
            data: results
        })
    } catch (error) {
        res.status(500).json({
            message: `Gagal mengambil data kredit di tabel ${tableName}`,
            error: error.message
        })
    }
}

const getKreditById = async (req, res, tableName) => {
    const { id } = req.params

    try {
        const [results] = await db.query(
            `SELECT * FROM ${tableName} WHERE id = ?`,
            [id]
        )
        if (results.length === 0) {
            return res.status(404).json({
                message: `Kredit di tabel ${tableName} tidak ditemukan`
            })
        }

        res.status(200).json({
            message: `Data kredit di tabel ${tableName} berhasil diambil`,
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: `Gagal mengambil data kredit di tabel ${tableName}`,
            error: error.message
        })
    }
}

const updateKredit = async (req, res, tableName) => {
    const { id } = req.params
    const {
        id_anggota,
        jumlah_pinjaman,
        jangka_waktu,
        total_angsuran,
        pokok,
        margin,
        angsuran_ke,
        sisa_piutang,
        tanggal_mulai,
        ket_status
    } = req.body

    try {
        const [result] = await db.query(
            `UPDATE ${tableName} 
            SET id_anggota = ?, jumlah_pinjaman = ?, jangka_waktu = ?, total_angsuran = ?, pokok = ?, margin = ?, angsuran_ke = ?, sisa_piutang = ?, tanggal_mulai = ?, ket_status = ?
            WHERE id = ?`,
            [
                id_anggota,
                jumlah_pinjaman,
                jangka_waktu,
                total_angsuran,
                pokok,
                margin,
                angsuran_ke,
                sisa_piutang,
                tanggal_mulai,
                ket_status,
                id
            ]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: `Kredit di tabel ${tableName} tidak ditemukan`
            })
        }

        res.status(200).json({
            message: `Kredit di tabel ${tableName} berhasil diperbarui`,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            message: `Gagal memperbarui kredit di tabel ${tableName}`,
            error: error.message
        })
    }
}

const deleteKredit = async (req, res) => {
    const { id } = req.params

    try {
        console.log(`🔹 Mencoba menghapus kredit barang dengan ID: ${id}`)

        const deletePembayaran = await db.query(
            'DELETE FROM pembayaran WHERE id_kredit = ?',
            [id]
        )
        console.log('🔹 Data pembayaran yang dihapus:', deletePembayaran)

        const result = await db.query('DELETE FROM kredit_barang WHERE id = ?', [
            id
        ])
        console.log('🔹 Data Kredit Barang:', result)

        if (!result || result.affectedRows === 0) {
            console.log('⚠️ Kredit barang tidak ditemukan atau gagal dihapus')
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Kredit barang tidak ditemukan atau gagal dihapus'
                })
        }

        console.log('✅ Kredit barang berhasil dihapus')
        return res
            .status(200)
            .json({ success: true, message: 'Kredit barang berhasil dihapus' })
    } catch (error) {
        console.error('❌ Gagal menghapus kredit barang:', error)
        return res
            .status(500)
            .json({ success: false, message: 'Gagal menghapus kredit barang' })
    }
}

exports.createKreditBarang = async (req, res) => {
    try {
        const {
            id_anggota,
            harga_pokok,
            jangka_waktu,
            pokok_dp,
            margin,
            total_angsuran,
            angsuran_pokok,
            margin_per_bulan,
            total_margin,
            tanggal_perjanjian
        } = req.body

        const angsuran_ke = 1
        const sisa_piutang = harga_pokok - pokok_dp
        const ket_status = 'Belum Lunas'

        const query = `
            INSERT INTO kredit_barang 
            (id_anggota, harga_pokok, jangka_waktu, pokok_dp, total_angsuran,
            pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

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
        ]

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error:', error)
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menambahkan data kredit barang'
                })
            }

            res.status(201).json({
                success: true,
                message: 'Data kredit barang berhasil ditambahkan'
            })
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan data kredit barang'
        })
    }
}

exports.getAnggotaListKredit = (req, res) => {
    const { search } = req.query

    let sql = `
        SELECT a.id, p.nama 
        FROM anggota a 
        JOIN pegawai p ON a.nip_anggota = p.nip 
        WHERE a.status = 'Aktif'
    `

    if (search) {
        sql += ` AND (p.nama LIKE '%${search}%' OR CAST(a.id AS CHAR) LIKE '%${search}%')`
    }

    sql += ` ORDER BY p.nama ASC`

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error:', error)
            return res.status(500).json({ message: 'Gagal mengambil data anggota' })
        }
        console.log('Results:', results)
        res.json(results)
    })
}

exports.getTambahKredit = (req, res) => {
    res.render('koperasi/kreditKeuangan/kreditBarang/tambahKredit')
}

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
    `

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error SQL:', err)
            return res.status(500).send('Internal Server Error')
        }

        console.log('Hasil Query:', results)
        res.render('koperasi/kreditKeuangan/kreditBarang/lihatKreditBarang', {
            data: results
        })
    })
}

exports.getKreditBarangById = async (req, res) => {
    const { id } = req.params

    try {
        const [results] = await db.query(
            'SELECT * FROM kredit_barang WHERE id = ?',
            [id]
        )
        if (results.length === 0) {
            return res.status(404).json({
                message: 'Kredit barang tidak ditemukan'
            })
        }

        res.status(200).json({
            message: 'Data kredit barang berhasil diambil',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data kredit barang',
            error: error.message
        })
    }
}

exports.updateKreditBarang = (req, res) => {
    const { id } = req.params
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
    } = req.body

    console.log('Update Request:', req.body)

    const formattedDate = new Date(tanggal_mulai).toISOString().split('T')[0]

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
    `

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
    ]

    db.query(query, values, (error, result) => {
        if (error) {
            console.error('Error updating kredit barang:', error)
            return res.status(500).json({
                success: false,
                message: 'Gagal memperbarui kredit barang',
                error: error.message
            })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kredit barang tidak ditemukan'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Data kredit barang berhasil diperbarui'
        })
    })
}

exports.getEditKreditBarang = (req, res) => {
    const { id } = req.params

    const kreditQuery = `
        SELECT 
            kb.*,
            p.nama as nama_anggota
        FROM kredit_barang kb
        JOIN anggota a ON kb.id_anggota = a.id
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE kb.id = ?
    `

    db.query(kreditQuery, [id], (error, results) => {
        if (error) {
            console.error('Error getting kredit barang:', error)
            return res.status(500).send('Gagal mengambil data kredit barang')
        }

        if (results.length === 0) {
            return res.status(404).send('Kredit barang tidak ditemukan')
        }

        res.render('koperasi/kreditKeuangan/kreditBarang/editKreditBarang', {
            kredit: results[0]
        })
    })
}

exports.hapusKreditElektronik = async (req, res) => {
    const connection = await db.getConnection()

    try {
        const id = req.params.id
        await connection.beginTransaction()
        const [deletePembayaranResult] = await connection.query(
            'DELETE FROM pembayaran WHERE id_kredit_elektronik = ?',
            [id]
        )
        const [deleteKreditElektronikResult] = await connection.query(
            'DELETE FROM kredit_elektronik WHERE id = ?',
            [id]
        )

        await connection.commit()

        if (deleteKreditElektronikResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data kredit elektronik tidak ditemukan'
            })
        }

        res.json({
            success: true,
            message: 'Data kredit elektronik berhasil dihapus'
        })
    } catch (error) {
        if (connection) await connection.rollback()

        console.error('Error saat menghapus kredit elektronik:', error)
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus kredit elektronik',
            error: error.message
        })
    } finally {
        if (connection) connection.release()
    }
}

exports.searchKreditBarang = (req, res) => {
    const { search } = req.query

    console.log('Search Query:', search)

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
    `

    console.log('Running query with search:', `%${search}%`)

    db.query(sql, [`%${search}%`], (err, results) => {
        if (err) {
            console.error('Error SQL:', err)
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan saat mencari data',
                error: err.message
            })
        }
        console.log('Search results:', results)
        res.json(results || [])
    })
}

exports.deleteKreditBarang = async (req, res) => {
    try {
        const { id } = req.params
        console.log(`🔹 Mencoba menghapus kredit barang dengan ID: ${id}`)

        await new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM pembayaran WHERE id_kredit_barang = ?',
                [id],
                err => {
                    if (err) return reject(err)
                    resolve()
                }
            )
        })

        const result = await new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM kredit_barang WHERE id = ?',
                [id],
                (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                }
            )
        })

        if (result.affectedRows === 0) {
            console.log('⚠️ Kredit barang tidak ditemukan atau gagal dihapus')
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            })
        }

        console.log('✅ Kredit barang berhasil dihapus')
        return res.status(200).json({
            success: true,
            message: 'Data berhasil dihapus'
        })
    } catch (error) {
        console.error('❌ Gagal menghapus kredit barang:', error)
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus data',
            error: error.message
        })
    }
}

exports.getBayarKreditBarang = async (req, res) => {
    try {
        const { id } = req.params

        const kreditQuery = `
            SELECT 
                kb.*,
                p.nama as nama_anggota
            FROM kredit_barang kb
            JOIN anggota a ON kb.id_anggota = a.id
            JOIN pegawai p ON a.nip_anggota = p.nip
            WHERE kb.id = ?
        `

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
        `

        db.query(kreditQuery, [id], (errKredit, kreditResults) => {
            if (errKredit) {
                console.error('Error query kredit:', errKredit)
                return res
                    .status(500)
                    .send('Terjadi kesalahan saat mengambil data kredit')
            }

            if (kreditResults.length === 0) {
                return res.status(404).send('Data kredit tidak ditemukan')
            }

            db.query(pembayaranQuery, [id], (errPembayaran, pembayaranResults) => {
                if (errPembayaran) {
                    console.error('Error query pembayaran:', errPembayaran)
                    return res
                        .status(500)
                        .send('Terjadi kesalahan saat mengambil data pembayaran')
                }

                res.render('koperasi/kreditKeuangan/kreditBarang/bayarKreditBarang', {
                    kredit: kreditResults[0],
                    pembayaran: pembayaranResults || []
                })
            })
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Terjadi kesalahan saat memuat halaman pembayaran')
    }
}

exports.prosesBayarKreditBarang = (req, res) => {
    console.log('Payment request received:', {
        kreditId: req.params.id,
        body: req.body
    })

    db.beginTransaction(err => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Gagal memulai transaksi',
                error: err.message
            })
        }

        const { id } = req.params
        const { tanggal_bayar, jumlah_bayar, keterangan } = req.body

        if (!tanggal_bayar || !jumlah_bayar) {
            res.setHeader('Content-Type', 'application/json')
            return db.rollback(() => {
                res.status(400).json({
                    success: false,
                    message: 'Tanggal dan jumlah bayar wajib diisi'
                })
            })
        }

        db.query(
            'SELECT * FROM kredit_barang WHERE id = ?',
            [id],
            (errKredit, kredits) => {
                if (errKredit) {
                    return db.rollback(() => {
                        res.status(500).json({
                            success: false,
                            message: 'Gagal mengambil data kredit',
                            error: errKredit.message
                        })
                    })
                }

                if (kredits.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json({
                            success: false,
                            message: 'Kredit tidak ditemukan'
                        })
                    })
                }

                const currentKredit = kredits[0]

                const jumlahBayarNumeric = parseFloat(jumlah_bayar)
                if (jumlahBayarNumeric > currentKredit.sisa_piutang) {
                    return db.rollback(() => {
                        return db.rollback(() => {
                            res.status(400).json({
                                success: false,
                                message: `Jumlah bayar (Rp ${jumlahBayarNumeric.toLocaleString(
                                    'id-ID'
                                )}) tidak boleh melebihi sisa hutang (Rp ${currentKredit.sisa_piutang.toLocaleString(
                                    'id-ID'
                                )})`
                            })
                        })
                    })
                }

                const newAngsuranKe = currentKredit.angsuran_ke + 1
                const newSisaPiutang = currentKredit.sisa_piutang - jumlahBayarNumeric
                const isLunas =
                    newSisaPiutang <= 0 || newAngsuranKe >= currentKredit.jangka_waktu

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
                    errPembayaran => {
                        if (errPembayaran) {
                            return db.rollback(() => {
                                res.status(500).json({
                                    success: false,
                                    message: 'Gagal menyimpan pembayaran',
                                    error: errPembayaran.message
                                })
                            })
                        }

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
                            errUpdate => {
                                if (errUpdate) {
                                    return db.rollback(() => {
                                        res.status(500).json({
                                            success: false,
                                            message: 'Gagal memperbarui status kredit',
                                            error: errUpdate.message
                                        })
                                    })
                                }

                                db.commit(errCommit => {
                                    if (errCommit) {
                                        return db.rollback(() => {
                                            res.setHeader('Content-Type', 'application/json')
                                            res.status(500).json({
                                                success: false,
                                                message: 'Gagal commit transaksi',
                                                error: errCommit.message
                                            })
                                        })
                                    }

                                    res.setHeader('Content-Type', 'application/json')

                                    res.status(200).json({
                                        success: true,
                                        message: `Pembayaran angsuran ke-${newAngsuranKe} sebesar Rp ${jumlahBayarNumeric.toLocaleString(
                                            'id-ID'
                                        )} berhasil disimpan`,
                                        angsuranKe: newAngsuranKe,
                                        sisaPiutang: newSisaPiutang,
                                        status: isLunas ? 'Lunas' : 'Belum Lunas'
                                    })
                                })
                            }
                        )
                    }
                )
            }
        )
    })
}

exports.createKreditElektronik = (req, res) =>
    createKredit(req, res, 'kredit_elektronik')
exports.getAllKreditElektronik = (req, res) =>
    getAllKredit(req, res, 'kredit_elektronik')
exports.getKreditElektronikById = (req, res) =>
    getKreditById(req, res, 'kredit_elektronik')
exports.updateKreditElektronik = (req, res) =>
    updateKredit(req, res, 'kredit_elektronik')
exports.deleteKreditElektronik = (req, res) =>
    deleteKredit(req, res, 'kredit_elektronik')

exports.createKreditMotor = (req, res) => createKredit(req, res, 'kredit_motor')
exports.getAllKreditMotor = (req, res) => getAllKredit(req, res, 'kredit_motor')
exports.getKreditMotorById = (req, res) =>
    getKreditById(req, res, 'kredit_motor')
exports.updateKreditMotor = (req, res) => updateKredit(req, res, 'kredit_motor')
exports.deleteKreditMotor = (req, res) => deleteKredit(req, res, 'kredit_motor')

exports.createKreditUmroh = (req, res) => createKredit(req, res, 'kredit_umroh')
exports.getAllKreditUmroh = (req, res) => getAllKredit(req, res, 'kredit_umroh')
exports.getKreditUmrohById = (req, res) =>
    getKreditById(req, res, 'kredit_umroh')
exports.updateKreditUmroh = (req, res) => updateKredit(req, res, 'kredit_umroh')
exports.deleteKreditUmroh = (req, res) => deleteKredit(req, res, 'kredit_umroh')