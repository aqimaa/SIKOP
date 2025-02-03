// controllers/koperasi/kreditController.js
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