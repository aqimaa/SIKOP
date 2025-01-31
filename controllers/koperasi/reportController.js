const db = require('../config/database');

exports.getLaporanKredit = (req, res) => {
    const { tahun, bulan, jenis } = req.query;
    const query = `
        SELECT a.nip, a.nama, k.jangka_waktu, k.total_angsuran, k.jumlah_pinjaman as jumlah 
        FROM anggota a 
        JOIN kredit_${jenis.toLowerCase()} k ON a.id = k.id_anggota
        WHERE YEAR(k.tanggal_mulai) = ? AND MONTH(k.tanggal_mulai) = ?
    `;
    
    db.query(query, [tahun, bulan], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        res.render('reportTemplate', {
            jenis: 'Kredit',
            jenisDetail: jenis,
            tahun,
            bulan,
            data: results
        });
    });
};

exports.getLaporanPinjaman = (req, res) => {
    const { tahun, bulan, kategori } = req.query;
    const query = `
        SELECT a.nip, a.nama, p.jangka_waktu, p.total_angsuran, p.jumlah_pinjaman as jumlah 
        FROM anggota a 
        JOIN pinjaman p ON a.id = p.id_anggota
        WHERE YEAR(p.tanggal_perjanjian) = ? AND MONTH(p.tanggal_perjanjian) = ?
        AND p.kategori = ?
    `;
    
    db.query(query, [tahun, bulan, kategori], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        res.render('reportTemplate', {
            jenis: 'Pinjaman',
            jenisDetail: kategori,
            tahun,
            bulan,
            data: results
        });
    });
};

exports.getLaporanSimpanan = (req, res) => {
    const { tahun, bulan, jenis } = req.query;
    const jenisColumn = `simpanan_${jenis.toLowerCase()}`;
    
    const query = `
        SELECT a.nip, a.nama, s.${jenisColumn} as jumlah 
        FROM anggota a 
        JOIN simpanan s ON a.id = s.id_anggota
        WHERE YEAR(s.tanggal) = ? AND MONTH(s.tanggal) = ?
    `;
    
    db.query(query, [tahun, bulan], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        res.render('reportTemplate', {
            jenis: 'Simpanan',
            jenisDetail: jenis,
            tahun,
            bulan,
            data: results
        });
    });
};
