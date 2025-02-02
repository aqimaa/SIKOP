const db = require('../../config/database');

exports.getPinjamanPimpinan = (req, res) => {
    console.log("Session Data:", req.session); // Debug session

    if (req.session.role !== 'Pimpinan') {
        console.log("Redirecting to /auth/login because role is:", req.session.role);
        return res.status(403).redirect('/auth/login');
    }

    console.log("User is Pimpinan, fetching data...");

    // Ambil tahun unik dari database
    const queryTahun = `SELECT DISTINCT YEAR(tanggal_perjanjian) AS tahun FROM pinjaman ORDER BY tahun DESC`;

    // Ambil bulan unik dari database
    const queryBulan = `SELECT DISTINCT MONTH(tanggal_perjanjian) AS bulan FROM pinjaman ORDER BY bulan ASC`;

    db.query(queryTahun, (err, tahunResults) => {
        if (err) {
            return res.status(500).json({ message: 'Database error (tahun)', error: err });
        }

        db.query(queryBulan, (err, bulanResults) => {
            if (err) {
                return res.status(500).json({ message: 'Database error (bulan)', error: err });
            }

            res.render('koperasi/pimpinan/pinjamanPimpinan', {
                title: 'Data Pinjaman',
                tahunList: tahunResults.map(t => t.tahun),
                bulanList: bulanResults.map(b => b.bulan),
                jenisPinjaman: ['jangka panjang', 'jangka pendek'], // Sesuaikan dengan kategori pinjaman
                data: []
            });
        });
    });
};