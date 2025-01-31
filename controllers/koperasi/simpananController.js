const connection = require('../../config/database');

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

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json(results);
    });
};

// Get data anggota untuk dropdown
const getAnggotaList = (req, res) => {
    const query = 'SELECT id, nip, nama FROM anggota';
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json(results);
    });
};

// Filter data simpanan
const filterSimpanan = (req, res) => {
    const { anggota, tahun, bulan } = req.query;
    let query = `
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
        WHERE 1=1
    `;
    
    const params = [];
    if (anggota) {
        query += ` AND s.id_anggota = ?`;
        params.push(anggota);
    }
    if (tahun) {
        query += ` AND YEAR(s.tanggal) = ?`;
        params.push(tahun);
    }
    if (bulan) {
        query += ` AND MONTH(s.tanggal) = ?`;
        params.push(bulan);
    }
    
    query += ` ORDER BY s.tanggal DESC`;

    connection.query(query, params, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json(results);
    });
};

// Create new simpanan
const createSimpanan = (req, res) => {
    const { anggota, simpanan_wajib, simpanan_pokok, simpanan_sukarela, metode_bayar } = req.body;
    
    const query = `
        INSERT INTO simpanan 
        (id_anggota, tanggal, simpanan_wajib, simpanan_pokok, simpanan_sukarela, metode_bayar)
        VALUES (?, CURDATE(), ?, ?, ?, ?)
    `;
    
    const values = [anggota, simpanan_wajib, simpanan_pokok, simpanan_sukarela, metode_bayar];
    
    connection.query(query, values, (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json({ message: 'Simpanan berhasil ditambahkan', id: results.insertId });
    });
};

// Delete simpanan
const deleteSimpanan = (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM simpanan WHERE id = ?';
    
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: error.message });
        }
        res.json({ message: 'Simpanan berhasil dihapus' });
    });
};

module.exports = {
    lihatSimpanan,
    getSimpananData,
    getAnggotaList,
    filterSimpanan,
    createSimpanan,
    deleteSimpanan
};