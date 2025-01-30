const db = require('../config/database');

const reportController = {
    getLaporanKredit: async (req, res) => {
        try {
            const { tahun, bulan, jenis } = req.query;
            let query = `
                SELECT a.nip, a.nama, k.jangka_waktu, k.total_angsuran, k.jumlah_pinjaman as jumlah 
                FROM anggota a 
                JOIN kredit_${jenis.toLowerCase()} k ON a.id = k.id_anggota
                WHERE YEAR(k.tanggal_mulai) = ? AND MONTH(k.tanggal_mulai) = ?
            `;
            
            const [data] = await db.execute(query, [tahun, bulan]);
            
            res.render('reportTemplate', {
                jenis: 'Kredit',
                jenisDetail: jenis,
                tahun,
                bulan,
                data
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getLaporanPinjaman: async (req, res) => {
        try {
            const { tahun, bulan, kategori } = req.query;
            let query = `
                SELECT a.nip, a.nama, p.jangka_waktu, p.total_angsuran, p.jumlah_pinjaman as jumlah 
                FROM anggota a 
                JOIN pinjaman p ON a.id = p.id_anggota
                WHERE YEAR(p.tanggal_perjanjian) = ? AND MONTH(p.tanggal_perjanjian) = ?
                AND p.kategori = ?
            `;
            
            const [data] = await db.execute(query, [tahun, bulan, kategori]);
            
            res.render('reportTemplate', {
                jenis: 'Pinjaman',
                jenisDetail: kategori,
                tahun,
                bulan,
                data
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    getLaporanSimpanan: async (req, res) => {
        try {
            const { tahun, bulan, jenis } = req.query;
            const jenisColumn = `simpanan_${jenis.toLowerCase()}`;
            
            let query = `
                SELECT a.nip, a.nama, s.${jenisColumn} as jumlah 
                FROM anggota a 
                JOIN simpanan s ON a.id = s.id_anggota
                WHERE YEAR(s.tanggal) = ? AND MONTH(s.tanggal) = ?
            `;
            
            const [data] = await db.execute(query, [tahun, bulan]);
            
            res.render('reportTemplate', {
                jenis: 'Simpanan',
                jenisDetail: jenis,
                tahun,
                bulan,
                data
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
};

module.exports = reportController;
