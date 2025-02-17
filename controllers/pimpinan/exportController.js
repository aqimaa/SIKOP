// controllers/pimpinan/exportController.js
const XLSX = require('xlsx');
const db = require('../../config/database');

exports.exportToExcel = async (req, res) => {
    const { tipe, jenis, tahun, bulan } = req.query;
    
    try {
        if (!req.session || req.session.role !== 'Pimpinan') {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized access' 
            });
        }

        let data = [];
        let filename;

        const executeQuery = (query, params = []) => {
            return new Promise((resolve, reject) => {
                db.query(query, params, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });
        };

        // Get data based on type
        if (tipe === 'simpanan') {
            if (jenis === 'Semua') {
                const query = `
                    SELECT 
                        p.nip,
                        p.nama,
                        s.simpanan_wajib,
                        s.simpanan_pokok,
                        s.simpanan_sukarela,
                        (s.simpanan_wajib + s.simpanan_pokok + s.simpanan_sukarela) as total_simpanan
                    FROM simpanan s
                    JOIN anggota a ON s.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(s.tanggal) = ? AND MONTH(s.tanggal) = ?
                    ORDER BY p.nip
                `;
                
                data = await executeQuery(query, [tahun, bulan]);
                
                data = data.map((row, index) => ({
                    'No': index + 1,
                    'NIP': row.nip,
                    'Nama': row.nama,
                    'Simpanan Wajib': row.simpanan_wajib,
                    'Simpanan Pokok': row.simpanan_pokok,
                    'Simpanan Sukarela': row.simpanan_sukarela,
                    'Total Simpanan': row.total_simpanan
                }));
                
                filename = `Laporan_Semua_Simpanan_${bulan}_${tahun}.xlsx`;
            } else {
                const jenisColumn = jenis.replace('simpanan_', '');
                const query = `
                    SELECT 
                        p.nip,
                        p.nama,
                        s.${jenis} as jumlah
                    FROM simpanan s
                    JOIN anggota a ON s.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(s.tanggal) = ? AND MONTH(s.tanggal) = ?
                    ORDER BY p.nip
                `;
                
                data = await executeQuery(query, [tahun, bulan]);
                
                data = data.map((row, index) => ({
                    'No': index + 1,
                    'NIP': row.nip,
                    'Nama': row.nama,
                    'Jenis Simpanan': jenisColumn.charAt(0).toUpperCase() + jenisColumn.slice(1),
                    'Jumlah': row.jumlah
                }));
                
                filename = `Laporan_Simpanan_${jenisColumn}_${bulan}_${tahun}.xlsx`;
            }
        } 
        else if (tipe === 'pinjaman') {
            if (jenis === 'Semua') {
                const query = `
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
                    WHERE YEAR(pj.tanggal_perjanjian) = ? AND MONTH(pj.tanggal_perjanjian) = ?
                    ORDER BY p.nip
                `;
                
                data = await executeQuery(query, [tahun, bulan]);
                
                data = data.map((row, index) => ({
                    'No': index + 1,
                    'NIP': row.nip,
                    'Nama': row.nama,
                    'Kategori': row.kategori,
                    'Jumlah Pinjaman': row.jumlah_pinjaman,
                    'Jangka Waktu': row.jangka_waktu,
                    'Margin %': row.margin_persen,
                    'Angsuran Pokok': row.angsuran_pokok,
                    'Angsuran Margin': row.margin_per_bulan,
                    'Total Angsuran': row.total_angsuran,
                    'Angsuran Ke-': row.angsuran_ke,
                    'Sisa Piutang Pokok': row.sisa_piutang,
                    'Tanggal Perjanjian': row.tanggal_perjanjian,
                    'Status': row.ket_status
                }));
                
                filename = `Laporan_Semua_Pinjaman_${bulan}_${tahun}.xlsx`;
            } else {
                const query = `
                    SELECT 
                        p.nip,
                        p.nama,
                        pj.kategori AS jenis,
                        pj.jangka_waktu,
                        pj.jumlah_pinjaman AS jumlah
                    FROM pinjaman pj
                    JOIN anggota a ON pj.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE pj.kategori = ? 
                    AND YEAR(pj.tanggal_perjanjian) = ? 
                    AND MONTH(pj.tanggal_perjanjian) = ?
                    ORDER BY p.nip
                `;
                
                data = await executeQuery(query, [jenis, tahun, bulan]);
                
                data = data.map((row, index) => ({
                    'No': index + 1,
                    'NIP': row.nip,
                    'Nama': row.nama,
                    'Jenis Pinjaman': row.jenis,
                    'Jangka Waktu': row.jangka_waktu,
                    'Jumlah': row.jumlah
                }));
                
                filename = `Laporan_Pinjaman_${jenis.replace(' ', '_')}_${bulan}_${tahun}.xlsx`;
            }
        } 
        else if (tipe === 'kredit') {
            if (jenis === 'kredit_barang') {
                const query = `
                    SELECT 
                        p.nip,
                        p.nama,
                        kb.harga_pokok,
                        kb.jangka_waktu,
                        kb.pokok_dp,
                        kb.total_angsuran,
                        kb.pokok,
                        kb.margin,
                        kb.angsuran_ke,
                        kb.sisa_piutang,
                        kb.tanggal_mulai,
                        kb.ket_status
                    FROM kredit_barang kb
                    JOIN anggota a ON kb.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(kb.tanggal_mulai) = ? AND MONTH(kb.tanggal_mulai) = ?
                    ORDER BY p.nip
                `;
                
                data = await executeQuery(query, [tahun, bulan]);
                
                data = data.map((row, index) => ({
                    'No': index + 1,
                    'NIP': row.nip,
                    'Nama': row.nama,
                    'Harga Pokok': row.harga_pokok,
                    'Jangka Waktu': row.jangka_waktu,
                    'Pokok DP': row.pokok_dp,
                    'Total Angsuran': row.total_angsuran,
                    'Pokok': row.pokok,
                    'Margin': row.margin,
                    'Angsuran Ke-': row.angsuran_ke,
                    'Sisa Piutang': row.sisa_piutang,
                    'Tanggal Mulai': row.tanggal_mulai,
                    'Status': row.ket_status
                }));
                
                filename = `Laporan_Kredit_Barang_${bulan}_${tahun}.xlsx`;
            } else {
                const query = `
                    SELECT 
                        p.nip,
                        p.nama,
                        k.jumlah_pinjaman,
                        k.jangka_waktu,
                        k.margin_persen,
                        k.pokok,
                        k.margin,
                        k.total_angsuran,
                        k.angsuran_ke,
                        k.sisa_piutang,
                        k.tanggal_mulai,
                        k.ket_status
                    FROM ${jenis} k
                    JOIN anggota a ON k.id_anggota = a.id
                    JOIN pegawai p ON a.nip_anggota = p.nip
                    WHERE YEAR(k.tanggal_mulai) = ? AND MONTH(k.tanggal_mulai) = ?
                    ORDER BY p.nip
                `;
                
                data = await executeQuery(query, [tahun, bulan]);
                
                data = data.map((row, index) => ({
                    'No': index + 1,
                    'NIP': row.nip,
                    'Nama': row.nama,
                    'Jumlah Pinjaman': row.jumlah_pinjaman,
                    'Jangka Waktu': row.jangka_waktu,
                    'Margin %': row.margin_persen,
                    'Angsuran Pokok': row.pokok,
                    'Angsuran Margin': row.margin,
                    'Total Angsuran': row.total_angsuran,
                    'Angsuran Ke-': row.angsuran_ke,
                    'Sisa Piutang': row.sisa_piutang,
                    'Tanggal Perjanjian': row.tanggal_mulai,
                    'Status': row.ket_status
                }));
                
                filename = `Laporan_${jenis.replace('kredit_', 'Kredit_')}_${bulan}_${tahun}.xlsx`;
            }
        }

        // Create workbook
        const workbook = XLSX.utils.book_new();
        
        // Create worksheet from data
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Auto-fit columns
        const colWidths = [];
        data.forEach(row => {
            Object.keys(row).forEach((key, col) => {
                const value = String(row[key]);
                colWidths[col] = Math.max(colWidths[col] || 0, value.length);
            });
        });
        
        worksheet['!cols'] = colWidths.map(width => ({ width }));
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        
        // Write to response
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.send(excelBuffer);

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengekspor data',
            error: error.message 
        });
    }
};