const mysql = require('mysql');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const db = require('../../config/database');

const exportDatabase = (req, res, format) => {
    const tables = ['users', 'anggota', 'kredit_barang', 'kredit_elektronik', 'kredit_motor', 'kredit_umroh', 'pegawai', 'pembayaran', 'pinjaman', 'simpanan', 'simpanan_history'];

    const exportTableData = (table) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table}`, (err, results) => {
                if (err) return reject(err);
                resolve({ table, results });
            });
        });
    };

    Promise.all(tables.map(exportTableData))
        .then((data) => {
            if (data.length === 0) {
                return res.status(404).json({ error: 'Tidak ada data untuk diekspor' });
            }

            switch (format) {
                case 'json':
                    res.setHeader('Content-Disposition', 'attachment; filename=backup.json');
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                    break;

                case 'csv':
                    try {
                        const csvData = data.flatMap(({ table, results }) => results.map(row => ({ ...row, table })));
                        const parser = new Parser();
                        const csv = parser.parse(csvData);
                        res.setHeader('Content-Disposition', 'attachment; filename=backup.csv');
                        res.setHeader('Content-Type', 'text/csv');
                        res.send(csv);
                    } catch (csvError) {
                        res.status(500).json({ error: 'Gagal mengekspor ke CSV' });
                    }
                    break;

                case 'xlsx':
                    const workbook = new ExcelJS.Workbook();
                    data.forEach(({ table, results }) => {
                        const worksheet = workbook.addWorksheet(table);
                        worksheet.columns = Object.keys(results[0] || {}).map(key => ({ header: key, key }));
                        results.forEach(row => worksheet.addRow(row));
                    });

                    res.setHeader('Content-Disposition', 'attachment; filename=backup.xlsx');
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                    workbook.xlsx.write(res).then(() => res.end()).catch(() => {
                        res.status(500).json({ error: 'Gagal mengekspor ke XLSX' });
                    });
                    break;

                case 'sql':
                    let sqlDump = '';
                    data.forEach(({ table, results }) => {
                        if (results.length > 0) {
                            sqlDump += `-- Dumping data for table ${table}\n`;
                            sqlDump += `INSERT INTO ${table} (${Object.keys(results[0]).join(", ")}) VALUES \n`;
                            sqlDump += results.map(row => `(${Object.values(row).map(value => mysql.escape(value)).join(", ")})`).join(",\n") + ";\n\n";
                        }
                    });

                    res.setHeader('Content-Disposition', 'attachment; filename=backup.sql');
                    res.setHeader('Content-Type', 'application/sql');
                    res.send(sqlDump);
                    break;

                default:
                    res.status(400).json({ error: 'Format tidak didukung' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        });
};

const exportData = (req, res) => {
    const { table, format } = req.params;
    const validTables = ['users', 'anggota', 'kredit_barang', 'kredit_elektronik', 'kredit_motor', 'kredit_umroh', 'pegawai', 'pembayaran', 'pinjaman', 'simpanan', 'simpanan_history'];
    
    if (!validTables.includes(table)) {
        return res.status(400).json({ error: 'Tabel tidak valid' });
    }

    db.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!results.length) return res.status(404).json({ error: 'Tidak ada data untuk diekspor' });

        switch (format) {
            case 'csv':
                try {
                    const parser = new Parser();
                    const csv = parser.parse(results);
                    res.setHeader('Content-Disposition', `attachment; filename=${table}.csv`);
                    res.setHeader('Content-Type', 'text/csv');
                    res.send(csv);
                } catch (csvError) {
                    res.status(500).json({ error: 'Gagal mengekspor ke CSV' });
                }
                break;

            case 'xlsx':
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet(table);
                worksheet.columns = Object.keys(results[0]).map(key => ({ header: key, key }));
                results.forEach(row => worksheet.addRow(row));
                res.setHeader('Content-Disposition', `attachment; filename=${table}.xlsx`);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                workbook.xlsx.write(res).then(() => res.end()).catch(() => {
                    res.status(500).json({ error: 'Gagal mengekspor ke XLSX' });
                });
                break;

            case 'pdf':
                const doc = new PDFDocument();
                res.setHeader('Content-Disposition', `attachment; filename=${table}.pdf`);
                res.setHeader('Content-Type', 'application/pdf');
                doc.pipe(res);
                doc.text(JSON.stringify(results, null, 2));
                doc.end();
                break;

            default:
                res.status(400).json({ error: 'Format tidak didukung' });
        }
    });
};

module.exports = {
    exportDatabase,
    exportData
  };