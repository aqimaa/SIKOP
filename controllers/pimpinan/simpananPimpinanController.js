const db = require('../../config/database');

exports.getSimpananPimpinan = (req, res) => {
    console.log("Session Data:", req.session); // Debug session

    if (req.session.role !== 'Pimpinan') {
        console.log("Redirecting to /auth/login because role is:", req.session.role);
        return res.status(403).redirect('/auth/login');
    }

    console.log("User is Pimpinan, fetching data...");

    // Ambil tahun unik dari database
    const queryTahun = `SELECT DISTINCT YEAR(tanggal) AS tahun FROM simpanan ORDER BY tahun DESC`;

    // Ambil bulan unik dari database
    const queryBulan = `SELECT DISTINCT MONTH(tanggal) AS bulan FROM simpanan ORDER BY bulan ASC`;

    db.query(queryTahun, (err, tahunResults) => {
        if (err) {
            return res.status(500).json({ message: 'Database error (tahun)', error: err });
        }

        db.query(queryBulan, (err, bulanResults) => {
            if (err) {
                return res.status(500).json({ message: 'Database error (bulan)', error: err });
            }

            res.render('koperasi/pimpinan/simpananPimpinan', {
                title: 'Data Simpanan',
                tahunList: tahunResults.map(t => t.tahun),
                bulanList: bulanResults.map(b => b.bulan),
                jenisSimpanan: ['simpanan_wajib', 'simpanan_pokok', 'simpanan_sukarela'],
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

        // Helper function for database queries
        const executeQuery = (query, params) => {
            return new Promise((resolve, reject) => {
                db.query(query, params, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });
        };

        // Modified query to join with pegawai table
        const query = `
            SELECT 
                p.nip,
                p.nama,
                s.${jenis} AS jumlah
            FROM simpanan s
            JOIN anggota a ON s.id_anggota = a.id
            JOIN pegawai p ON a.nip_anggota = p.nip
            WHERE YEAR(s.tanggal) = ?
            AND MONTH(s.tanggal) = ?
            LIMIT ? OFFSET ?
        `;

        // Modified count query
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM simpanan s
            JOIN anggota a ON s.id_anggota = a.id
            JOIN pegawai p ON a.nip_anggota = p.nip
            WHERE YEAR(s.tanggal) = ?
            AND MONTH(s.tanggal) = ?
        `;

        // Execute both queries
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
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            message: 'Terjadi kesalahan saat memuat data.',
            error: error.message
        });
    }
};