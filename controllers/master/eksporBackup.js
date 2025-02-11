const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const router = express.Router();
const db = require('../../config/database');

// Controller untuk ekspor data dalam berbagai format
const exportData = (req, res, format) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (!results.length) {
            return res.status(404).json({ error: 'Tidak ada data untuk diekspor' });
        }

        switch (format) {
            case 'json':
                res.setHeader('Content-Disposition', 'attachment; filename=users.json');
                res.setHeader('Content-Type', 'application/json');
                res.json(results);
                break;

            case 'csv':
                try {
                    const parser = new Parser();
                    const csv = parser.parse(results);
                    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
                    res.setHeader('Content-Type', 'text/csv');
                    res.send(csv);
                } catch (csvError) {
                    res.status(500).json({ error: 'Gagal mengekspor ke CSV' });
                }
                break;

            case 'xlsx':
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Users');

                worksheet.columns = Object.keys(results[0]).map(key => ({ header: key, key }));
                results.forEach(row => worksheet.addRow(row));

                res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

                workbook.xlsx.write(res).then(() => res.end()).catch(() => {
                    res.status(500).json({ error: 'Gagal mengekspor ke XLSX' });
                });
                break;

            case 'sql':
                try {
                    let sqlDump = "INSERT INTO users (" + Object.keys(results[0]).join(", ") + ") VALUES \n";
                    sqlDump += results.map(row => `(${Object.values(row).map(value => mysql.escape(value)).join(", ")})`).join(",\n") + ";";

                    res.setHeader('Content-Disposition', 'attachment; filename=backup.sql');
                    res.setHeader('Content-Type', 'application/sql');
                    res.send(sqlDump);
                } catch (sqlError) {
                    res.status(500).json({ error: 'Gagal mengekspor ke SQL' });
                }
                break;

            case 'pdf':
                try {
                    const doc = new PDFDocument();
                    res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
                    res.setHeader('Content-Type', 'application/pdf');

                    doc.pipe(res);
                    doc.fontSize(16).text('Data Users', { align: 'center' });
                    doc.moveDown();
                    
                    results.forEach(user => {
                        doc.fontSize(12).text(`${user.id} - ${user.nama} - ${user.email} - ${user.role_user}`);
                    });

                    doc.end();
                } catch (pdfError) {
                    res.status(500).json({ error: 'Gagal mengekspor ke PDF' });
                }
                break;

            default:
                res.status(400).json({ error: 'Format tidak didukung' });
        }
    });
};

// Ekspor fungsi
module.exports = { exportData };