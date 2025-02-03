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