const db = require('../config/database');

class ReportController {
    async generateReport(req, res) {
        const { tahun, bulan, jenis } = req.body;
        let query = '';
        let tableHeaders = '';
        
        try {
            switch(jenis) {
                case 'kredit':
                    query = `
                        SELECT a.nip, a.nama, k.jenis_kredit, k.jatuh_tempo, k.jumlah 
                        FROM anggota a 
                        JOIN kredit_barang k ON a.id = k.id_anggota
                        WHERE YEAR(k.tanggal_mulai) = ? AND MONTH(k.tanggal_mulai) = ?
                    `;
                    tableHeaders = `
                        <th>Jenis Kredit</th>
                        <th>Jatuh Tempo</th>
                        <th>Jumlah</th>
                    `;
                    break;
                    
                case 'pinjaman':
                    query = `
                        SELECT a.nip, a.nama, p.kategori, p.jumlah_pinjaman, p.jangka_waktu 
                        FROM anggota a 
                        JOIN pinjaman p ON a.id = p.id_anggota
                        WHERE YEAR(p.tanggal_perjanjian) = ? AND MONTH(p.tanggal_perjanjian) = ?
                    `;
                    tableHeaders = `
                        <th>Kategori</th>
                        <th>Jumlah Pinjaman</th>
                        <th>Jangka Waktu</th>
                    `;
                    break;
                    
                case 'simpanan':
                    query = `
                        SELECT a.nip, a.nama, s.simpanan_wajib, s.simpanan_pokok, s.simpanan_sukarela 
                        FROM anggota a 
                        JOIN simpanan s ON a.id = s.id_anggota
                        WHERE YEAR(s.tanggal) = ? AND MONTH(s.tanggal) = ?
                    `;
                    tableHeaders = `
                        <th>Simpanan Wajib</th>
                        <th>Simpanan Pokok</th>
                        <th>Simpanan Sukarela</th>
                    `;
                    break;
            }

            const [data] = await db.execute(query, [tahun, bulan]);
            
            // Generate table rows
            const tableData = data.map((item, index) => {
                let rows = '';
                switch(jenis) {
                    case 'kredit':
                        rows = `
                            <td>${item.jenis_kredit}</td>
                            <td>${item.jatuh_tempo}</td>
                            <td>${item.jumlah}</td>
                        `;
                        break;
                        case 'pinjaman':
                           rows = `
                                <td>${item.jenis_pinjaman}</td>
                                <td>${item.jatuh_tempo}</td>
                                <td>${item.jumlah}</td>
                            `;
                            break; 
                        case 'simpanan':
                           rows = `
                                <td>${item.jenis_simpanan}</td>
                                <td>${item.jumlah}</td>
                            `;
                            break; 
                    
                }
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.nip}</td>
                        <td>${item.nama}</td>
                        ${rows}
                    </tr>
                `;
            }).join('');

            res.render('report-template', {
                jenis: jenis.toUpperCase(),
                tahun,
                bulan,
                jenisDetail: req.body.jenisDetail,
                tableHeaders,
                tableData
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Terjadi kesalahan saat generate laporan');
        }
    }
}

module.exports = new ReportController();
