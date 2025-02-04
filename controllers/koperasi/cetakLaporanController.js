const db = require('../../../../config/database');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');

exports.cetakLaporan = (req, res) => {
    // Middleware check role
    if (req.session.role !== 'Pimpinan') {
        return res.status(403).redirect('/login');
    }

    const { tahun, bulan, jenis, tipe } = req.query;
    let query, tableName, jenisField;

    // Tentukan query dan field berdasarkan tipe laporan
    switch (tipe) {
        case 'simpanan':
            tableName = 'simpanan';
            jenisField = jenis;
            query = `
                SELECT 
                    p.nip,
                    p.nama,
                    ${tableName}.${jenisField} AS jumlah
                FROM ${tableName}
                JOIN anggota a ON ${tableName}.id_anggota = a.id
                JOIN pegawai p ON a.nip_anggota = p.nip
                WHERE YEAR(${tableName}.tanggal) = ?
                AND MONTH(${tableName}.tanggal) = ?
            `;
            break;

        case 'pinjaman':
            tableName = 'pinjaman';
            jenisField = 'kategori';
            query = `
                SELECT 
                    p.nip,
                    p.nama,
                    ${tableName}.${jenisField} AS jenis,
                    DATE_ADD(tanggal_perjanjian, INTERVAL jangka_waktu MONTH) AS jatuh_tempo,
                    ${tableName}.jumlah_pinjaman AS jumlah
                FROM ${tableName}
                JOIN anggota a ON ${tableName}.id_anggota = a.id
                JOIN pegawai p ON a.nip_anggota = p.nip
                WHERE YEAR(${tableName}.tanggal_perjanjian) = ?
                AND MONTH(${tableName}.tanggal_perjanjian) = ?
            `;
            break;

        case 'kredit':
            tableName = jenis; // Menggunakan jenis kredit yang dipilih
            jenisField = 'ket_status';
            query = `
                SELECT 
                    p.nip,
                    p.nama,
                    '${jenis.replace('kredit_', '').toUpperCase()}' AS jenis,
                    DATE_ADD(tanggal_mulai, INTERVAL jangka_waktu MONTH) AS jatuh_tempo,
                    ${jenis === 'kredit_barang' ? 'harga_pokok' : 'jumlah_pinjaman'} AS jumlah
                FROM ${tableName}
                JOIN anggota a ON ${tableName}.id_anggota = a.id
                JOIN pegawai p ON a.nip_anggota = p.nip
                WHERE YEAR(${tableName}.tanggal_mulai) = ?
                AND MONTH(${tableName}.tanggal_mulai) = ?
            `;
            break;

        default:
            return res.status(400).json({ message: 'Tipe laporan tidak valid' });
    }

    db.query(query, [tahun, bulan], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        const bulanList = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const bulanNama = bulanList[bulan - 1];

        const data = {
            tahun: tahun,
            bulan: bulanNama,
            jenisSimpanan: jenis.replace('simpanan_', '').toUpperCase(),
            data: results,
            tipe: tipe
        };

        // Sesuaikan path template sesuai struktur folder baru
        const filePath = path.join(__dirname, '../../../../views/koperasi/pimpinan/templateLaporan.ejs');
        
        ejs.renderFile(filePath, data, (err, html) => {
            if (err) {
                console.error("Error rendering template:", err);
                return res.status(500).json({ message: 'Error rendering template', error: err });
            }

            const options = {
                format: 'A4',
                border: {
                    top: '1cm',
                    right: '1cm',
                    bottom: '1cm',
                    left: '1cm'
                }
            };

            pdf.create(html, options).toStream((err, stream) => {
                if (err) {
                    console.error("Error generating PDF:", err);
                    return res.status(500).json({ message: 'Error generating PDF', error: err });
                }

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=laporan-${tipe}-${tahun}-${bulan}.pdf`);
                stream.pipe(res);
            });
        });
    });
};