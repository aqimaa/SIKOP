const db = require("../../config/database");

exports.lihatKreditBarang = async (req, res) => {
  try {
    const query = `
      SELECT 
        kb.id,
        kb.id_anggota,
        pg.nama AS nama_anggota,
        kb.harga_pokok,
        kb.jangka_waktu,
        kb.pokok_dp,
        kb.total_angsuran,
        COALESCE(kb.pokok, 0) AS pokok,
        COALESCE(kb.margin, 0) AS margin,
        COALESCE(kb.angsuran_ke, 0) AS angsuran_ke,
        COALESCE(kb.sisa_piutang, 0) AS sisa_piutang,
        kb.tanggal_mulai,
        kb.ket_status
      FROM kredit_barang kb
      JOIN anggota a ON kb.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      ORDER BY kb.id DESC;
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error saat mengambil data kredit barang:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data kredit barang.");
      }

      const formattedResults = results.map(item => ({
        ...item,
        harga_pokok: item.harga_pokok.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        pokok_dp: item.pokok_dp.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        total_angsuran: item.total_angsuran.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        pokok: item.pokok.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        margin: item.margin.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        sisa_piutang: item.sisa_piutang.toLocaleString('id-ID', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      }));

      res.render("koperasi/kreditKeuangan/kreditBarang/lihatKreditBarang", {
        data: formattedResults
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data kredit barang.");
  }
};

exports.tambahKreditBarang = async (req, res) => {
  const {
    id_anggota,
    harga_pokok,
    jangka_waktu,
    pokok_dp,
    margin,
    tanggal_mulai,
  } = req.body;

  // Validasi input
  if (!id_anggota || !harga_pokok || !jangka_waktu || !pokok_dp || !margin || !tanggal_mulai) {
    return res.status(400).json({
      success: false,
      message: "Semua field harus diisi."
    });
  }

  // Parse dan format angka
  const parseNumberWithComma = (value) => {
    if (!value || typeof value !== 'string') return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  const formattedHargaPokok = parseNumberWithComma(harga_pokok);
  const formattedPokokDP = parseNumberWithComma(pokok_dp);
  const formattedMargin = parseNumberWithComma(margin);

  // Hitung total angsuran dan sisa piutang
  const totalAngsuranPerBulan = formattedPokokDP + formattedMargin;
  const sisaPiutang = formattedHargaPokok - formattedPokokDP;

  const query = `
    INSERT INTO kredit_barang 
    (id_anggota, harga_pokok, jangka_waktu, pokok_dp, margin, total_angsuran, 
    sisa_piutang, tanggal_mulai, ket_status, angsuran_ke)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id_anggota,
    formattedHargaPokok,
    jangka_waktu,
    formattedPokokDP,
    formattedMargin,
    totalAngsuranPerBulan,
    sisaPiutang,
    tanggal_mulai,
    "Belum Lunas",
    0
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat menambahkan kredit barang:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menambahkan kredit barang."
      });
    }
    res.redirect("/kredit-barang");
  });
};

exports.getAnggota = async (req, res) => {
  const keyword = req.query.search || '';
  
  const query = `
    SELECT a.id, p.nama
    FROM anggota a
    JOIN pegawai p ON a.nip_anggota = p.nip
    WHERE a.status = 'Aktif'
    AND (p.nama LIKE ? OR CAST(a.id AS CHAR) LIKE ?)
    ORDER BY p.nama ASC
  `;

  db.query(query, [`%${keyword}%`, `%${keyword}%`], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data anggota:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data anggota."
      });
    }
    res.json(results);
  });
};

exports.searchKreditBarang = async (req, res) => {
  const { search } = req.query;

  try {
    const query = `
      SELECT 
        kb.id,
        kb.id_anggota,
        pg.nama AS nama_anggota,
        kb.harga_pokok,
        kb.jangka_waktu,
        kb.pokok_dp,
        kb.total_angsuran,
        COALESCE(kb.pokok, 0) AS pokok,
        COALESCE(kb.margin, 0) AS margin,
        COALESCE(kb.angsuran_ke, 0) AS angsuran_ke,
        COALESCE(kb.sisa_piutang, 0) AS sisa_piutang,
        kb.tanggal_mulai,
        kb.ket_status
      FROM kredit_barang kb
      JOIN anggota a ON kb.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE pg.nama LIKE ? OR kb.id_anggota LIKE ?
      ORDER BY kb.id DESC
    `;

    db.query(query, [`%${search}%`, `%${search}%`], (error, results) => {
      if (error) {
        console.error("Error saat mencari data kredit barang:", error);
        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat mencari data kredit barang."
        });
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mencari data kredit barang."
    });
  }
};

exports.getBayarKreditBarang = async (req, res) => {
  const { id } = req.params;

  const queryKreditBarang = `
    SELECT 
      kb.id,
      kb.id_anggota,
      pg.nama AS nama_anggota,
      kb.harga_pokok,
      kb.jangka_waktu,
      kb.pokok_dp,
      kb.total_angsuran,
      kb.angsuran_ke,
      kb.sisa_piutang,
      kb.margin
    FROM kredit_barang kb
    JOIN anggota a ON kb.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE kb.id = ?
  `;

  const queryPembayaran = `
    SELECT 
      tanggal_bayar,
      angsuran_ke,
      jumlah_bayar,
      ket
    FROM pembayaran
    WHERE id_kredit_barang = ?
    ORDER BY tanggal_bayar DESC
  `;

  db.query(queryKreditBarang, [id], (error, kreditResults) => {
    if (error) {
      console.error("Error saat mengambil data kredit barang:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data kredit barang.");
    }

    if (kreditResults.length === 0) {
      return res.status(404).send("Data kredit barang tidak ditemukan.");
    }

    db.query(queryPembayaran, [id], (error, pembayaranResults) => {
      if (error) {
        console.error("Error saat mengambil riwayat pembayaran:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil riwayat pembayaran.");
      }

      res.render("koperasi/kreditKeuangan/kreditBarang/bayarKreditBarang", {
        kredit: kreditResults[0],
        pembayaran: pembayaranResults
      });
    });
  });
};

exports.prosesBayarKreditBarang = async (req, res) => {
  const { id } = req.params;
  const { tanggal_bayar, jumlah_bayar, keterangan } = req.body;

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Gagal memulai transaksi"
      });
    }

    // Get current kredit info
    db.query('SELECT * FROM kredit_barang WHERE id = ?', [id], (errKredit, kredits) => {
      if (errKredit) {
        return db.rollback(() => {
          res.status(500).json({
            success: false,
            message: "Gagal mengambil data kredit"
          });
        });
      }

      const kredit = kredits[0];
      const jumlahBayarNum = parseFloat(jumlah_bayar);
      const newAngsuranKe = kredit.angsuran_ke + 1;
      const newSisaPiutang = kredit.sisa_piutang - jumlahBayarNum;
      const isLunas = newSisaPiutang <= 0 || newAngsuranKe >= kredit.jangka_waktu;

      // Insert payment record
      db.query(
        'INSERT INTO pembayaran (id_kredit_barang, tanggal_bayar, angsuran_ke, jumlah_bayar, ket) VALUES (?, ?, ?, ?, ?)',
        [id, tanggal_bayar, newAngsuranKe, jumlahBayarNum, keterangan || 'Pembayaran Angsuran'],
        errPembayaran => {
          if (errPembayaran) {
            return db.rollback(() => {
              res.status(500).json({
                success: false,
                message: "Gagal menyimpan pembayaran"
              });
            });
          }

          // Update kredit status
          db.query(
            'UPDATE kredit_barang SET angsuran_ke = ?, sisa_piutang = ?, ket_status = ? WHERE id = ?',
            [newAngsuranKe, newSisaPiutang, isLunas ? 'Lunas' : 'Belum Lunas', id],
            errUpdate => {
              if (errUpdate) {
                return db.rollback(() => {
                  res.status(500).json({
                    success: false,
                    message: "Gagal memperbarui status kredit"
                  });
                });
              }

              db.commit(errCommit => {
                if (errCommit) {
                  return db.rollback(() => {
                    res.status(500).json({
                      success: false,
                      message: "Gagal commit transaksi"
                    });
                  });
                }

                res.status(200).json({
                  success: true,
                  message: "Pembayaran berhasil disimpan",
                  details: {
                    angsuranKe: newAngsuranKe,
                    jumlahBayar: jumlahBayarNum,
                    sisaPiutang: newSisaPiutang,
                    status: isLunas ? 'Lunas' : 'Belum Lunas'
                  }
                });
              });
            }
          );
        }
      );
    });
  });
};

exports.getEditKreditBarang = (req, res) => {
    const { id } = req.params

    const kreditQuery = `
        SELECT 
            kb.*,
            p.nama as nama_anggota
        FROM kredit_barang kb
        JOIN anggota a ON kb.id_anggota = a.id
        JOIN pegawai p ON a.nip_anggota = p.nip
        WHERE kb.id = ?
    `

    db.query(kreditQuery, [id], (error, results) => {
        if (error) {
            console.error('Error getting kredit barang:', error)
            return res.status(500).send('Gagal mengambil data kredit barang')
        }

        if (results.length === 0) {
            return res.status(404).send('Kredit barang tidak ditemukan')
        }

        res.render('koperasi/kreditKeuangan/kreditBarang/editKreditBarang', {
            kredit: results[0]
        })
    })
}


exports.updateKreditBarang = async (req, res) => {
    const { id } = req.params;
    const {
        id_anggota,
        harga_pokok,
        jangka_waktu,
        pokok_dp,
        total_angsuran,
        pokok,
        margin,
        angsuran_ke,
        sisa_piutang,
        tanggal_mulai,
        ket_status
    } = req.body;

    try {
        console.log('Update Request:', req.body);
        
        // Helper function untuk membersihkan format angka
        const cleanNumber = (value) => {
            if (typeof value === 'string') {
                return parseFloat(value.replace(/\./g, '').replace(',', '.'));
            }
            return value;
        };

        // Format semua nilai numerik
        const formattedValues = {
            harga_pokok: cleanNumber(harga_pokok),
            pokok_dp: cleanNumber(pokok_dp),
            total_angsuran: cleanNumber(total_angsuran),
            pokok: cleanNumber(pokok),
            margin: cleanNumber(margin),
            sisa_piutang: cleanNumber(sisa_piutang)
        };

        const formattedDate = new Date(tanggal_mulai).toISOString().split('T')[0];

        const query = `
            UPDATE kredit_barang
            SET
                id_anggota = ?,
                harga_pokok = ?,
                jangka_waktu = ?,
                pokok_dp = ?,
                total_angsuran = ?,
                pokok = ?,
                margin = ?,
                angsuran_ke = ?,
                sisa_piutang = ?,
                tanggal_mulai = ?,
                ket_status = ?
            WHERE id = ?
        `;

        const values = [
            id_anggota,
            formattedValues.harga_pokok,
            jangka_waktu,
            formattedValues.pokok_dp,
            formattedValues.total_angsuran,
            formattedValues.pokok,
            formattedValues.margin,
            angsuran_ke,
            formattedValues.sisa_piutang,
            formattedDate,
            formattedValues.sisa_piutang <= 0 ? 'Lunas' : 'Belum Lunas',
            id
        ];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error updating kredit barang:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal memperbarui kredit barang',
                    error: error.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Kredit barang tidak ditemukan'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Data kredit barang berhasil diperbarui'
            });
        });

    } catch (error) {
        console.error('Error in updateKreditBarang:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan internal server',
            error: error.message
        });
    }
};

exports.hitungUlangKreditBarang = async (req, res) => {
    const { id } = req.params;
    const {
        harga_pokok,
        jangka_waktu,
        margin_persen
    } = req.body;

    try {
        // Hitung nilai-nilai baru
        const pokokPerBulan = harga_pokok / jangka_waktu;
        const marginPerBulan = (harga_pokok * margin_persen) / 100;
        const totalAngsuran = pokokPerBulan + marginPerBulan;

        res.json({
            success: true,
            data: {
                pokok_dp: pokokPerBulan,
                margin: marginPerBulan,
                total_angsuran: totalAngsuran
            }
        });
    } catch (error) {
        console.error('Error in hitungUlangKreditBarang:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghitung ulang kredit',
            error: error.message
        });
    }
};

exports.getHistoryKreditBarang = async (req, res) => {
    const { id } = req.params;

    const query = `
        SELECT 
            p.tanggal_bayar,
            p.angsuran_ke,
            p.jumlah_bayar,
            p.ket
        FROM pembayaran p
        WHERE p.id_kredit_barang = ?
        ORDER BY p.tanggal_bayar DESC
    `;

    try {
        db.query(query, [id], (error, results) => {
            if (error) {
                console.error('Error fetching kredit history:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal mengambil riwayat kredit'
                });
            }

            res.json({
                success: true,
                data: results
            });
        });
    } catch (error) {
        console.error('Error in getHistoryKreditBarang:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan internal server'
        });
    }
};

exports.deleteKreditBarang = async (req, res) => {
    try {
        const { id } = req.params
        console.log(`🔹 Mencoba menghapus kredit barang dengan ID: ${id}`)

        await new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM pembayaran WHERE id_kredit_barang = ?',
                [id],
                err => {
                    if (err) return reject(err)
                    resolve()
                }
            )
        })

        const result = await new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM kredit_barang WHERE id = ?',
                [id],
                (err, result) => {
                    if (err) return reject(err)
                    resolve(result)
                }
            )
        })

        if (result.affectedRows === 0) {
            console.log('⚠️ Kredit barang tidak ditemukan atau gagal dihapus')
            return res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan'
            })
        }

        console.log('✅ Kredit barang berhasil dihapus')
        return res.status(200).json({
            success: true,
            message: 'Data berhasil dihapus'
        })
    } catch (error) {
        console.error('❌ Gagal menghapus kredit barang:', error)
        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus data',
            error: error.message
        })
    }
}

exports.getTambahKredit = (req, res) => {
    res.render('koperasi/kreditKeuangan/kreditBarang/tambahKredit')
}

exports.getAllKreditBarang = (req, res) => {
    const sql = `
        SELECT
            kb.id,  
            kb.id_anggota,
            p.nama AS nama_anggota,  
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
        JOIN pegawai p ON a.nip_anggota = p.nip;
    `

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error SQL:', err)
            return res.status(500).send('Internal Server Error')
        }

        console.log('Hasil Query:', results)
        res.render('koperasi/kreditKeuangan/kreditBarang/lihatKreditBarang', {
            data: results
        })
    })
}

exports.createKreditBarang = async (req, res) => {
    try {
        const {
            id_anggota,
            harga_pokok,
            jangka_waktu,
            pokok_dp,
            margin,
            total_angsuran,
            angsuran_pokok,
            margin_per_bulan,
            total_margin,
            tanggal_perjanjian
        } = req.body

        const angsuran_ke = 1
        const sisa_piutang = harga_pokok - pokok_dp
        const ket_status = 'Belum Lunas'

        const query = `
            INSERT INTO kredit_barang 
            (id_anggota, harga_pokok, jangka_waktu, pokok_dp, total_angsuran,
            pokok, margin, angsuran_ke, sisa_piutang, tanggal_mulai, ket_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

        const values = [
            id_anggota,
            harga_pokok,
            jangka_waktu,
            pokok_dp,
            total_angsuran,
            angsuran_pokok,
            margin_per_bulan,
            angsuran_ke,
            sisa_piutang,
            tanggal_perjanjian,
            ket_status
        ]

        db.query(query, values, (error, result) => {
            if (error) {
                console.error('Error:', error)
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menambahkan data kredit barang'
                })
            }

            res.status(201).json({
                success: true,
                message: 'Data kredit barang berhasil ditambahkan'
            })
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan data kredit barang'
        })
    }
}

exports.getKreditBarangById = async (req, res) => {
    const { id } = req.params

    try {
        const [results] = await db.query(
            'SELECT * FROM kredit_barang WHERE id = ?',
            [id]
        )
        if (results.length === 0) {
            return res.status(404).json({
                message: 'Kredit barang tidak ditemukan'
            })
        }

        res.status(200).json({
            message: 'Data kredit barang berhasil diambil',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data kredit barang',
            error: error.message
        })
    }
}

exports.getAnggotaListKredit = (req, res) => {
    const { search } = req.query

    let sql = `
        SELECT a.id, p.nama 
        FROM anggota a 
        JOIN pegawai p ON a.nip_anggota = p.nip 
        WHERE a.status = 'Aktif'
    `

    if (search) {
        sql += ` AND (p.nama LIKE '%${search}%' OR CAST(a.id AS CHAR) LIKE '%${search}%')`
    }

    sql += ` ORDER BY p.nama ASC`

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error:', error)
            return res.status(500).json({ message: 'Gagal mengambil data anggota' })
        }
        console.log('Results:', results)
        res.json(results)
    })
}

