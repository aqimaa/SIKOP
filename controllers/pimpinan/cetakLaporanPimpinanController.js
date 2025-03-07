const db = require('../../config/database');
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const XLSX = require('xlsx');


exports.cetakLaporan = (req, res) => {
    const { tahun, bulan, jenis, tipe, namaPimpinan, nipPimpinan } = req.query;
    let query, tableName, jenisField;

    switch (tipe) {
        case 'simpanan':
            tableName = 'simpanan';
            if (jenis === 'Semua') {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        s.simpanan_wajib,
                        s.simpanan_pokok,
                        s.simpanan_sukarela,
                        (s.simpanan_wajib + s.simpanan_pokok + s.simpanan_sukarela) AS total_simpanan
                    FROM ${tableName} s
                    JOIN anggota a ON s.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(s.tanggal) = ?
                    AND MONTH(s.tanggal) = ?
                `;
            } else {
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
            }
            break;

        case 'pinjaman':
            tableName = 'pinjaman';
            if (jenis === 'Semua') {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        pj.kategori,
                        pj.jumlah_pinjaman,
                        pj.jangka_waktu,
                        pj.margin_persen,
                        pj.angsuran_pokok,
                        pj.margin_per_bulan,
                        pj.total_angsuran,
                        pj.angsuran_ke,
                        pj.sisa_piutang,
                        pj.tanggal_perjanjian,
                        pj.ket_status
                    FROM pinjaman pj
                    JOIN anggota a ON pj.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(pj.tanggal_perjanjian) = ?
                    AND MONTH(pj.tanggal_perjanjian) = ?
                `;
            } else {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        pj.kategori AS jenis,
                        pj.jangka_waktu,
                        pj.jumlah_pinjaman AS jumlah
                    FROM pinjaman pj
                    JOIN anggota a ON pj.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(pj.tanggal_perjanjian) = ?
                    AND MONTH(pj.tanggal_perjanjian) = ?
                    AND pj.kategori = ?
                `;
            }
            break;

        case 'kredit':
            tableName = jenis;
            if (jenis === 'kredit_barang') {
                query = `
                    SELECT
                        p.nip,
                        p.nama, 
                        kb.harga_pokok,
                        kb.jangka_waktu,
                        kb.pokok_dp,
                        CAST(kb.total_angsuran AS DECIMAL(10,2)) as total_angsuran,
                        kb.pokok,
                        kb.margin,
                        kb.angsuran_ke,
                        kb.sisa_piutang,
                        kb.tanggal_mulai,
                        kb.ket_status
                    FROM kredit_barang kb
                    JOIN anggota a ON kb.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(kb.tanggal_mulai) = ?
                    AND MONTH(kb.tanggal_mulai) = ?
                `;
            } else {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        k.jumlah_pinjaman,
                        k.jangka_waktu,
                        k.margin_persen,
                        CAST(k.total_angsuran AS DECIMAL(10,2)) as total_angsuran,
                        k.pokok,
                        k.margin,
                        k.angsuran_ke,
                        k.sisa_piutang,
                        k.tanggal_mulai,
                        k.ket_status
                    FROM ${tableName} k
                    JOIN anggota a ON k.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(k.tanggal_mulai) = ?
                    AND MONTH(k.tanggal_mulai) = ?
                `;
            }
            break;

        default:
            return res.status(400).json({ message: 'Tipe laporan tidak valid' });
    }

    const queryParams = jenis === 'Semua' || tipe === 'kredit' ? [tahun, bulan] : [tahun, bulan, jenis];

    db.query(query, queryParams, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const bulanNama = bulanList[bulan - 1];

        const data = {
            tahun: tahun,
            bulan: bulanNama,
            jenisSimpanan: tipe === 'simpanan' ? (jenis === 'Semua' ? 'Semua' : jenis.replace('simpanan_', '').toUpperCase()) : null,
            jenis: jenis,
            data: results,
            tipe: tipe,
            jenisKredit: jenis.replace('kredit_', '').toUpperCase(),
            namaPimpinan: namaPimpinan, // Tambahkan ini
            nipPimpinan: nipPimpinan
        };

        const filePath = path.join(__dirname, '../../views/koperasi/pimpinan/templateLaporan.ejs');

        ejs.renderFile(filePath, data, (err, html) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error rendering template',
                    error: err
                });
            }

            const options = {
                format: 'A4',
                orientation: 'landscape',
                border: {
                    top: '1cm',
                    right: '1cm',
                    bottom: '1cm',
                    left: '1cm'
                }
            };

            pdf.create(html, options).toStream((err, stream) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error generating PDF',
                        error: err
                    });
                }

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=laporan-${tipe}-${tahun}-${bulan}.pdf`);
                stream.pipe(res);
            });
        });
    });
};

// Fungsi export Excel
exports.exportExcel = async (req, res) => {
    const { tahun, bulan, jenis, tipe } = req.query;

    try {
        let query;
        let params = [];

        if (tipe === 'simpanan') {
            if (jenis === 'Semua') {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        s.simpanan_wajib,
                        s.simpanan_pokok,
                        s.simpanan_sukarela,
                        (s.simpanan_wajib + s.simpanan_pokok + s.simpanan_sukarela) AS total_simpanan
                    FROM simpanan s
                    JOIN anggota a ON s.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(s.tanggal) = ?
                    AND MONTH(s.tanggal) = ?
                `;
                params = [tahun, bulan];
            } else {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        s.${jenis} AS jumlah
                    FROM simpanan s
                    JOIN anggota a ON s.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(s.tanggal) = ?
                    AND MONTH(s.tanggal) = ?
                `;
                params = [tahun, bulan];
            }
        } else if (tipe === 'pinjaman') {
            if (jenis === 'Semua') {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        pj.kategori,
                        pj.jumlah_pinjaman,
                        pj.jangka_waktu,
                        pj.margin_persen,
                        pj.angsuran_pokok,
                        pj.margin_per_bulan,
                        pj.total_angsuran,
                        pj.angsuran_ke,
                        pj.sisa_piutang,
                        pj.tanggal_perjanjian,
                        pj.ket_status
                    FROM pinjaman pj
                    JOIN anggota a ON pj.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(pj.tanggal_perjanjian) = ?
                    AND MONTH(pj.tanggal_perjanjian) = ?
                `;
                params = [tahun, bulan];
            } else {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        pj.kategori AS jenis,
                        pj.jangka_waktu,
                        pj.jumlah_pinjaman AS jumlah
                    FROM pinjaman pj
                    JOIN anggota a ON pj.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(pj.tanggal_perjanjian) = ?
                    AND MONTH(pj.tanggal_perjanjian) = ?
                    AND pj.kategori = ?
                `;
                params = [tahun, bulan, jenis];
            }
        } else if (tipe === 'kredit') {
            if (jenis === 'kredit_barang') {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        kb.harga_pokok,
                        kb.jangka_waktu,
                        kb.pokok_dp,
                        CAST(kb.total_angsuran AS DECIMAL(10,2)) as total_angsuran,
                        kb.pokok,
                        kb.margin,
                        kb.angsuran_ke,
                        kb.sisa_piutang,
                        kb.tanggal_mulai,
                        kb.ket_status
                    FROM kredit_barang kb
                    JOIN anggota a ON kb.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(kb.tanggal_mulai) = ?
                    AND MONTH(kb.tanggal_mulai) = ?
                `;
            } else {
                query = `
                    SELECT
                        p.nip,
                        p.nama,
                        k.jumlah_pinjaman,
                        k.jangka_waktu,
                        k.margin_persen,
                        CAST(k.total_angsuran AS DECIMAL(10,2)) as total_angsuran,
                        k.pokok,
                        k.margin,
                        k.angsuran_ke,
                        k.sisa_piutang,
                        k.tanggal_mulai,
                        k.ket_status
                    FROM ${jenis} k
                    JOIN anggota a ON k.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(k.tanggal_mulai) = ?
                    AND MONTH(k.tanggal_mulai) = ?
                `;
            }
            params = [tahun, bulan];
        }

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error', error: err });
            }

            // Format data untuk Excel
            const formattedData = results.map(row => {
                const newRow = {};
                for (let key in row) {
                    if (typeof row[key] === 'number') {
                        // Format angka dengan pemisah ribuan
                        newRow[key] = row[key].toLocaleString('id-ID');
                    } else if (row[key] instanceof Date) {
                        // Format tanggal
                        newRow[key] = row[key].toLocaleDateString('id-ID');
                    } else {
                        newRow[key] = row[key];
                    }
                }
                return newRow;
            });

            // Buat workbook baru
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(formattedData);

            // Tambahkan judul
            const title = `Laporan ${tipe.toUpperCase()} - ${bulan}/${tahun}`;
            XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 'A1' });

            // Atur lebar kolom
            const colWidths = results.length > 0 ? Object.keys(results[0]).map(key => ({
                wch: Math.max(key.length, ...results.map(row => String(row[key]).length))
            })) : [];
            ws['!cols'] = colWidths;

            // Tambahkan worksheet ke workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Report');

            // Generate Excel file
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

            // Set header untuk download file
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Laporan_${tipe}_${bulan}_${tahun}.xlsx`);

            // Kirim file
            res.send(excelBuffer);
        });
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Error generating Excel file', error: error.message });
    }
};

