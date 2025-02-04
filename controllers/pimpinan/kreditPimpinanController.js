const db = require('../../config/database');


exports.getKreditPimpinan = (req, res) => {
    console.log("Session Data:", req.session); // Debug session

    if (req.session.role !== 'Pimpinan') {
        console.log("Redirecting to /auth/login because role is:", req.session.role);
        return res.status(403).redirect('/auth/login');
    }

    console.log("User is Pimpinan, fetching data...");

    // Ambil tahun unik dari database
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

    // Ambil bulan unik dari database
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
                jenisKredit: ['kredit_barang', 'kredit_elektronik', 'kredit_motor', 'kredit_umroh'], // Sesuaikan dengan jenis kredit
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

        // Updated query to join with pegawai table
        const query = `
            SELECT 
                p.nip,
                p.nama,
                '${jenis}' AS jenis,
                k.jangka_waktu,
                ${jenis === 'kredit_barang' ? 'k.harga_pokok' : 'k.jumlah_pinjaman'} AS jumlah
            FROM ${jenis} k
            JOIN anggota a ON k.id_anggota = a.id
            JOIN pegawai p ON a.nip_anggota = p.nip
            WHERE YEAR(k.tanggal_mulai) = ?
            AND MONTH(k.tanggal_mulai) = ?
            LIMIT ? OFFSET ?
        `;

        // Updated count query
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM ${jenis} k
            JOIN anggota a ON k.id_anggota = a.id
            JOIN pegawai p ON a.nip_anggota = p.nip
            WHERE YEAR(k.tanggal_mulai) = ?
            AND MONTH(k.tanggal_mulai) = ?
        `;

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
