const db = require('../../config/database');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');

exports.cetakLaporan = (req, res) => {
    const { tahun, bulan, jenis, tipe } = req.query;

    let query, tableName, jenisField;

    // Tentukan query dan field berdasarkan tipe laporan
    switch (tipe) {
        case 'simpanan':
            tableName = 'simpanan';
            jenisField = jenis;
            query = `
                SELECT anggota.nip, anggota.nama, ${tableName}.${jenisField} AS jumlah 
                FROM ${tableName} 
                JOIN anggota ON ${tableName}.id_anggota = anggota.id 
                WHERE YEAR(tanggal) = ? AND MONTH(tanggal) = ?
            `;
            break;

        case 'pinjaman':
            tableName = 'pinjaman';
            jenisField = 'kategori';
            query = `
                SELECT anggota.nip, anggota.nama, ${tableName}.${jenisField} AS jenis, 
                       DATE_ADD(tanggal_perjanjian, INTERVAL jangka_waktu MONTH) AS jatuh_tempo, 
                       ${tableName}.jumlah_pinjaman AS jumlah 
                FROM ${tableName} 
                JOIN anggota ON ${tableName}.id_anggota = anggota.id 
                WHERE YEAR(tanggal_perjanjian) = ? AND MONTH(tanggal_perjanjian) = ?
            `;
            break;

        case 'kredit':
            tableName = 'kredit_barang'; // Sesuaikan dengan tabel kredit yang sesuai
            jenisField = 'ket_status';
            query = `
                SELECT anggota.nip, anggota.nama, ${tableName}.${jenisField} AS jenis, 
                       DATE_ADD(tanggal_mulai, INTERVAL jangka_waktu MONTH) AS jatuh_tempo, 
                       ${tableName}.total_angsuran AS jumlah 
                FROM ${tableName} 
                JOIN anggota ON ${tableName}.id_anggota = anggota.id 
                WHERE YEAR(tanggal_mulai) = ? AND MONTH(tanggal_mulai) = ?
            `;
            break;

        default:
            return res.status(400).json({ message: 'Tipe laporan tidak valid' });
    }

    db.query(query, [tahun, bulan], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const bulanNama = bulanList[bulan - 1];

        const data = {
            tahun: tahun,
            bulan: bulanNama,
            jenisSimpanan: jenis.replace('simpanan_', '').toUpperCase(),
            data: results,
            tipe: tipe // Tambahkan tipe untuk menentukan template
        };

        const filePath = path.join(__dirname, '../../views/koperasi/pimpinan/templateLaporan.ejs');
        ejs.renderFile(filePath, data, (err, html) => {
            if (err) {
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
                    return res.status(500).json({ message: 'Error generating PDF', error: err });
                }

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=laporan-${tipe}-${tahun}-${bulan}.pdf`);
                stream.pipe(res);
            });
        });
    });
};