const db = require('../../config/database');

exports.getKreditPimpinan = (req, res) => {
    console.log("Session Data:", req.session);

    if (req.session.role !== 'Pimpinan') {
        console.log("Redirecting to /auth/login because role is:", req.session.role);
        return res.status(403).redirect('/auth/login');
    }

    console.log("User is Pimpinan, fetching data...");

    const queryTahun = `
        SELECT DISTINCT YEAR(tanggal_mulai) AS tahun
        FROM (
            SELECT tanggal_mulai FROM kredit_barang
            UNION ALL
            SELECT tanggal_mulai FROM kredit_elektronik
            UNION ALL
            SELECT tanggal_mulai FROM kredit_motor
            UNION ALL
            SELECT tanggal_mulai FROM kredit_umroh
        ) AS all_kredit
        ORDER BY tahun DESC
    `;

    const queryBulan = `
        SELECT DISTINCT MONTH(tanggal_mulai) AS bulan
        FROM (
            SELECT tanggal_mulai FROM kredit_barang
            UNION ALL
            SELECT tanggal_mulai FROM kredit_elektronik
            UNION ALL
            SELECT tanggal_mulai FROM kredit_motor
            UNION ALL
            SELECT tanggal_mulai FROM kredit_umroh
        ) AS all_kredit
        ORDER BY bulan ASC
    `;

    db.query(queryTahun, (err, tahunResults) => {
        if (err) {
            return res.status(500).json({ message: 'Database error (tahun)', error: err });
        }

        db.query(queryBulan, (err, bulanResults) => {
            if (err) {
                return res.status(500).json({ message: 'Database error (bulan)', error: err });
            }

            res.render('koperasi/pimpinan/kreditPimpinan', {
                title: 'Data Kredit',
                tahunList: tahunResults.map(t => t.tahun),
                bulanList: bulanResults.map(b => b.bulan),
                jenisKredit: ['kredit_barang', 'kredit_elektronik', 'kredit_motor', 'kredit_umroh'],
                data: []
            });
        });
    });
};

exports.filterData = async (req, res) => {
    const { tahun, bulan, jenis, page = 1, limit = 10 } = req.body;

    if (!tahun || !bulan || !jenis) {
        return res.status(400).json({ message: 'Harap lengkapi semua filter!' });
    }

    try {
        const offset = (page - 1) * limit;

        const executeQuery = (query, params) => {
            return new Promise((resolve, reject) => {
                db.query(query, params, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });
        };

        let query, countQuery;

        if (jenis === 'kredit_barang') {
            query = `
                SELECT
                    p.nip,
                    p.nama,
                    k.harga_pokok,
                    k.jangka_waktu,
                    k.pokok_dp,
                    k.total_angsuran,
                    k.pokok,
                    k.margin,
                    k.angsuran_ke,
                    k.sisa_piutang,
                    k.tanggal_mulai,
                    k.ket_status
                FROM kredit_barang k
                JOIN anggota a ON k.id_anggota = a.id
                JOIN pegawai p ON a.nip_anggota = p.nip
                WHERE YEAR(k.tanggal_mulai) = ?
                AND MONTH(k.tanggal_mulai) = ?
                LIMIT ? OFFSET ?
            `;
            countQuery = `
                SELECT COUNT(*) AS total
                FROM kredit_barang k
                JOIN anggota a ON k.id_anggota = a.id
                JOIN pegawai p ON a.nip_anggota = p.nip
                WHERE YEAR(k.tanggal_mulai) = ?
                AND MONTH(k.tanggal_mulai) = ?
            `;
        } else {
            query = `
                SELECT
                    p.nip,
                    p.nama,
                    k.jumlah_pinjaman,
                    k.jangka_waktu,
                    k.margin_persen,
                    k.pokok,
                    k.margin,
                    k.total_angsuran,
                    k.angsuran_ke,
                    k.sisa_piutang,
                    k.tanggal_mulai,
                    k.ket_status
                FROM ${jenis} k
                JOIN anggota a ON k.id_anggota = a.id
                JOIN pegawai p ON a.nip_anggota = p.nip
                WHERE YEAR(k.tanggal_mulai) = ?
                AND MONTH(k.tanggal_mulai) = ?
                LIMIT ? OFFSET ?
            `;
            countQuery = `
                SELECT COUNT(*) AS total
                FROM ${jenis} k
                JOIN anggota a ON k.id_anggota = a.id
                JOIN pegawai p ON a.nip_anggota = p.nip
                WHERE YEAR(k.tanggal_mulai) = ?
                AND MONTH(k.tanggal_mulai) = ?
            `;
        }

        const [data, totalResults] = await Promise.all([
            executeQuery(query, [tahun, bulan, parseInt(limit), offset]),
            executeQuery(countQuery, [tahun, bulan])
        ]);

        const total = totalResults[0].total;

        res.json({
            data,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat memuat data.',
            error: error.message
        });
    }
};