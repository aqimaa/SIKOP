const mysql = require('mysql')
const { Parser } = require('json2csv')
const ExcelJS = require('exceljs')
const { PDFDocument, rgb } = require('pdf-lib');

const db = require('../../config/database')

const exportDatabase = (req, res, format) => {
    const tables = [
        'users',
        'anggota',
        'kredit_barang',
        'kredit_elektronik',
        'kredit_motor',
        'kredit_umroh',
        'pegawai',
        'pembayaran',
        'pinjaman',
        'simpanan',
        'simpanan_history'
    ]

    const exportTableData = table => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table}`, (err, results) => {
                if (err) return reject(err)
                resolve({ table, results })
            })
        })
    }

    Promise.all(tables.map(exportTableData))
        .then(data => {
            if (data.length === 0) {
                return res.status(404).json({ error: 'Tidak ada data untuk diekspor' })
            }

            switch (format) {
                case 'json':
                    res.setHeader(
                        'Content-Disposition',
                        'attachment; filename=backup.json'
                    )
                    res.setHeader('Content-Type', 'application/json')
                    res.json(data)
                    break

                case 'csv':
                    try {
                        const csvData = data.flatMap(({ table, results }) =>
                            results.map(row => ({ ...row, table }))
                        )
                        const parser = new Parser()
                        const csv = parser.parse(csvData)
                        res.setHeader(
                            'Content-Disposition',
                            'attachment; filename=backup.csv'
                        )
                        res.setHeader('Content-Type', 'text/csv')
                        res.send(csv)
                    } catch (csvError) {
                        res.status(500).json({ error: 'Gagal mengekspor ke CSV' })
                    }
                    break

                case 'xlsx':
                    const workbook = new ExcelJS.Workbook()
                    data.forEach(({ table, results }) => {
                        const worksheet = workbook.addWorksheet(table)
                        worksheet.columns = Object.keys(results[0] || {}).map(key => ({
                            header: key,
                            key
                        }))
                        results.forEach(row => worksheet.addRow(row))
                    })

                    res.setHeader(
                        'Content-Disposition',
                        'attachment; filename=backup.xlsx'
                    )
                    res.setHeader(
                        'Content-Type',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    )

                    workbook.xlsx
                        .write(res)
                        .then(() => res.end())
                        .catch(() => {
                            res.status(500).json({ error: 'Gagal mengekspor ke XLSX' })
                        })
                    break

                case 'sql':
                    let sqlDump = ''
                    data.forEach(({ table, results }) => {
                        if (results.length > 0) {
                            sqlDump += `-- Dumping data for table ${table}\n`
                            sqlDump += `INSERT INTO ${table} (${Object.keys(results[0]).join(
                                ', '
                            )}) VALUES \n`
                            sqlDump +=
                                results
                                    .map(
                                        row =>
                                            `(${Object.values(row)
                                                .map(value => mysql.escape(value))
                                                .join(', ')})`
                                    )
                                    .join(',\n') + ';\n\n'
                        }
                    })

                    res.setHeader(
                        'Content-Disposition',
                        'attachment; filename=backup.sql'
                    )
                    res.setHeader('Content-Type', 'application/sql')
                    res.send(sqlDump)
                    break

                default:
                    res.status(400).json({ error: 'Format tidak didukung' })
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        })
}

const exportData = (req, res, table, format) => {
    const validTables = ['users', 'anggota', 'pegawai']

    if (!validTables.includes(table)) {
        return res.status(400).json({ error: 'Tabel tidak valid' })
    }

    db.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' })
        if (!results.length)
            return res.status(404).json({ error: 'Tidak ada data untuk diekspor' })

        switch (format) {
            case 'csv':
                try {
                    const parser = new Parser()
                    const csv = parser.parse(results)
                    res.setHeader(
                        'Content-Disposition',
                        `attachment; filename=${table}.csv`
                    )
                    res.setHeader('Content-Type', 'text/csv')
                    res.send(csv)
                } catch (csvError) {
                    res.status(500).json({ error: 'Gagal mengekspor ke CSV' })
                }
                break

            case 'xlsx':
                const workbook = new ExcelJS.Workbook()
                const worksheet = workbook.addWorksheet(table)
                worksheet.columns = Object.keys(results[0]).map(key => ({
                    header: key,
                    key
                }))
                results.forEach(row => worksheet.addRow(row))
                res.setHeader(
                    'Content-Disposition',
                    `attachment; filename=${table}.xlsx`
                )
                res.setHeader(
                    'Content-Type',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                workbook.xlsx
                    .write(res)
                    .then(() => res.end())
                    .catch(() => {
                        res.status(500).json({ error: 'Gagal mengekspor ke XLSX' })
                    })
                break

                
             
                case 'pdf':
                    (async () => {
                        try {
                            const pdfDoc = await PDFDocument.create();
                            const page = pdfDoc.addPage([600, 400]); // Create a new page with specified dimensions
                            const { width, height } = page.getSize();
                
                            // Function to draw a table
                            const drawTable = (headers, rows) => {
                                const tableWidth = 500; // Width of the table
                                const columnWidth = tableWidth / headers.length; // Width of each column
                                const rowHeight = 20; // Fixed height for each row
                                let yPosition = height - 50; // Start position for the table
                
                                // Draw header
                                headers.forEach((header, index) => {
                                    page.drawRectangle({
                                        x: 50 + index * columnWidth,
                                        y: yPosition,
                                        width: columnWidth,
                                        height: rowHeight,
                                        color: rgb(0.8, 0.8, 0.8), // Light gray background
                                    });
                                    page.drawText(header, {
                                        x: 50 + index * columnWidth + 5,
                                        y: yPosition + 5,
                                        size: 12,
                                        color: rgb(0, 0, 0),
                                    });
                                });
                                yPosition -= rowHeight; // Move down for the next row
                
                                // Draw rows
                                rows.forEach(row => {
                                    headers.forEach((header, index) => {
                                        const key = header.toLowerCase().replace(/\s+/g, '_'); // Convert header to match row keys
                                        const cellValue = String(row[key] || ''); // Handle undefined values safely
                                        page.drawRectangle({
                                            x: 50 + index * columnWidth,
                                            y: yPosition,
                                            width: columnWidth,
                                            height: rowHeight,
                                            color: rgb(1, 1, 1), // White background for cells
                                            borderColor: rgb(0, 0, 0), // Black border
                                            borderWidth: 1,
                                        });
                                        page.drawText(cellValue, {
                                            x: 50 + index * columnWidth + 5,
                                            y: yPosition + 5,
                                            size: 12,
                                            color: rgb(0, 0, 0),
                                        });
                                    });
                                    yPosition -= rowHeight; // Move down for the next row
                                });
                            };
                
                            // Check if `results` is an array
                            if (!Array.isArray(results) || results.length === 0) {
                                throw new Error('Data tidak tersedia untuk dibuat PDF.');
                            }
                
                            // Generate PDF for different tables
                            if (table === 'anggota') {
                                page.drawText('Data Anggota', { x: 50, y: height - 30, size: 16, color: rgb(0, 0, 0) });
                                const headers = ['ID', 'NIP Anggota', 'Status'];
                                drawTable(headers, results);
                            } else if (table === 'pegawai') {
                                page.drawText('Data Pegawai', { x: 50, y: height - 30, size: 16, color: rgb(0, 0, 0) });
                                const headers = ['NIP', 'Nama', 'Wilayah'];
                                drawTable(headers, results);
                            } else if (table === 'users') {
                                page.drawText('Data Users', { x: 50, y: height - 30, size: 16, color: rgb(0, 0, 0) });
                                const headers = ['ID', 'Nama', 'Email', 'Role User'];
                                drawTable(headers, results);
                            } else {
                                throw new Error('Tabel tidak dikenali.');
                            }
                
                            // Serialize the PDF document to bytes
                            const pdfBytes = await pdfDoc.save();
                
                            // Set headers for the response
                            res.setHeader('Content-Type', 'application/pdf');
                            res.setHeader('Content-Disposition', `attachment; filename="${table}.pdf"`);
                            res.setHeader('Content-Length', pdfBytes.length); // Ensure correct length
                            res.end(pdfBytes);

                        } catch (error) {
                            console.error('Error generating PDF:', error.message);
                            res.status(500).send({ error: error.message });
                        }
                    })();
                    break;
                

                default:
                res.status(400).json({ error: 'Format tidak didukung' })
        }
    })
}

module.exports = {
    exportDatabase,
    exportData
}
