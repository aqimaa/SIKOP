const db = require('../../config/database');

exports.getDashboardData = (req, res) => {
  const queryPegawai = 'SELECT COUNT(*) AS total_pegawai FROM pegawai';
  const queryAnggotaAktif = "SELECT COUNT(*) AS total_anggota_aktif FROM anggota WHERE status = 'Aktif'";
  const queryAnggotaTidakAktif = "SELECT COUNT(*) AS total_anggota_tidak_aktif FROM anggota WHERE status = 'Tidak Aktif'";
  const querySimpanan = 'SELECT SUM(simpanan_wajib + simpanan_pokok + simpanan_sukarela) AS total_simpanan FROM simpanan';
  const queryPinjaman = 'SELECT SUM(jumlah_pinjaman) AS total_pinjaman FROM pinjaman';
  const queryKredit = `
      SELECT SUM(harga_pokok) AS total_kredit FROM kredit_barang 
      UNION ALL 
      SELECT SUM(jumlah_pinjaman) FROM kredit_motor 
      UNION ALL 
      SELECT SUM(jumlah_pinjaman) FROM kredit_elektronik 
      UNION ALL 
      SELECT SUM(jumlah_pinjaman) FROM kredit_umroh
  `;

  db.query(queryPegawai, (err, pegawaiResult) => {
    if (err) throw err;
    db.query(queryAnggotaAktif, (err, anggotaAktifResult) => {
      if (err) throw err;
      db.query(queryAnggotaTidakAktif, (err, anggotaTidakAktifResult) => {
        if (err) throw err;
        db.query(querySimpanan, (err, simpananResult) => {
          if (err) throw err;
          db.query(queryPinjaman, (err, pinjamanResult) => {
            if (err) throw err;
            db.query(queryKredit, (err, kreditResult) => {
              if (err) throw err;

              const totalKredit = kreditResult.reduce((acc, curr) => acc + (curr.total_kredit || 0), 0);

              res.json({
                total_pegawai: pegawaiResult[0].total_pegawai,
                total_anggota_aktif: anggotaAktifResult[0].total_anggota_aktif,
                total_anggota_tidak_aktif: anggotaTidakAktifResult[0].total_anggota_tidak_aktif,
                total_simpanan: simpananResult[0].total_simpanan,
                total_pinjaman: pinjamanResult[0].total_pinjaman,
                total_kredit: totalKredit
              });
            });
          });
        });
      });
    });
  });
};

exports.getPegawai = (req, res) => {
  const search = req.query.search || "";
  const tipe_pegawai = req.query.tipe_pegawai || ""; 
  
  const query = `
    SELECT nip, nama, wilayah, tipe_pegawai
    FROM pegawai 
    WHERE (nama LIKE ? OR nip LIKE ? OR wilayah LIKE ?)
    AND (tipe_pegawai LIKE ?)
  `;

  db.query(query, [`%${search}%`, `%${search}%`, `%${search}%`, `%${tipe_pegawai}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    // Pass the results, search, and tipe_pegawai to the view
    res.render("master/pegawai/pegawai", { pegawai: results, search, tipe_pegawai });
  });
};

exports.createPegawai = (req, res) => {
  console.log("Data diterima dari frontend:", req.body);

  const { nip, nama, wilayah, tipe_pegawai } = req.body;

  // Validate input
  if (!nip || !nama || !wilayah || !tipe_pegawai) {
    return res.status(400).json({ success: false, message: "Semua field harus diisi" });
  }

  const query = "INSERT INTO pegawai (nip, nama, wilayah, tipe_pegawai) VALUES (?, ?, ?, ?)";

  db.query(query, [nip, nama, wilayah, tipe_pegawai], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan pada database", error: err.message });
    }

    res.status(201).json({ success: true, message: "Pegawai berhasil ditambahkan!" });
  });
};

exports.getUbahPegawai = (req, res) => {
  const { nip } = req.params;
  const query = 'SELECT * FROM pegawai WHERE nip = ?';

  db.query(query, [nip], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
    }
    res.render('master/pegawai/ubahPegawai', { pegawai: results[0] });
  });
};

exports.updatePegawai = (req, res) => {
  const { nip } = req.params;
  const { new_nip, nama, wilayah, tipe_pegawai } = req.body; // Include tipe_pegawai

  // Validate input fields
  if (!new_nip || !nama || !wilayah || !tipe_pegawai) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  const checkQuery = 'SELECT * FROM pegawai WHERE nip = ?';
  db.query(checkQuery, [nip], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan' });
    }

    // Update query to include tipe_pegawai
    const updateQuery = 'UPDATE pegawai SET nip = ?, nama = ?, wilayah = ?, tipe_pegawai = ? WHERE nip = ?';
    db.query(updateQuery, [new_nip, nama, wilayah, tipe_pegawai, nip], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.send(`
        <script>
          alert("Pegawai berhasil diperbarui");
          window.location.href = "/master/pegawai";
        </script>
      `);
    });
  });
};

exports.deletePegawai = (req, res) => {
  const { nip } = req.params;

  const query = 'DELETE FROM pegawai WHERE nip = ?';
  db.query(query, [nip], (err, results) => {
    if (err) {
      return res.redirect('/master/pegawai?msg=error');
    }
    if (results.affectedRows === 0) {
      return res.redirect('/master/pegawai?msg=notfound');
    }

    res.redirect('/master/pegawai?msg=deleted');
  });
};

exports.getAnggota = (req, res) => {
  const searchQuery = req.query.search ? `%${req.query.search}%` : '%';

  const query = `
      SELECT anggota.id, anggota.nip_anggota, pegawai.nama, pegawai.wilayah, pegawai.tipe_pegawai, anggota.status 
      FROM anggota 
      JOIN pegawai ON anggota.nip_anggota = pegawai.nip
      WHERE anggota.id LIKE ? 
        OR pegawai.nama LIKE ? 
        OR anggota.nip_anggota LIKE ? 
        OR pegawai.wilayah LIKE ? 
        OR pegawai.tipe_pegawai LIKE ?
  `;

  db.query(query, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/anggota/anggotaKoperasi', { anggota: results, searchQuery: req.query.search || '' });
  });
};

exports.getPegawaiForAnggota = (req, res) => {
  const query = 'SELECT * FROM pegawai';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/anggota/tambahAnggota', { pegawai: results, title: 'Tambah Anggota' });
  });
};


exports.getAnggotaById = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM anggota WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }

    res.render('master/anggota/ubahAnggota', { anggota: results[0], title: 'Ubah Anggota' });
  });
};

exports.getPegawaiYangBisaDipilih = (req, res) => {
  const query = `
        SELECT p.nip, p.nama 
        FROM pegawai p 
        LEFT JOIN anggota a ON p.nip = a.nip_anggota 
        WHERE a.nip_anggota IS NULL
    `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error", error: err });
    }
    res.json({ success: true, data: results });
  });
};

exports.tambahAnggota = (req, res) => {
  console.log("Body data diterima:", req.body);
  const { nip_anggota } = req.body;

  if (!nip_anggota) {
    return res.status(400).json({ success: false, message: "Harap pilih pegawai." });
  }

  const checkPegawaiQuery = 'SELECT nama FROM pegawai WHERE nip = ?';
  db.query(checkPegawaiQuery, [nip_anggota], (err, pegawaiResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error saat mencari pegawai' });
    if (pegawaiResults.length === 0) {
      return res.status(404).json({ success: false, message: 'Pegawai tidak ditemukan di database' });
    }

    const nama = pegawaiResults[0].nama;

    const getMaxIdQuery = 'SELECT MAX(id) AS max_id FROM anggota';
    db.query(getMaxIdQuery, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal mendapatkan ID terakhir' });

      const newId = result[0].max_id ? result[0].max_id + 1 : 1;

      const insertQuery = 'INSERT INTO anggota (id, nip_anggota, status) VALUES (?, ?, "Aktif")';
      db.query(insertQuery, [newId, nip_anggota], (err, insertResult) => {
        if (err) return res.status(500).json({ success: false, message: 'Gagal menambahkan anggota ke database' });

        res.status(201).json({
          success: true,
          message: 'Anggota berhasil ditambahkan',
          data: { id: newId, nip_anggota, nama, status: "Aktif" }
        });
      });
    });
  });
};

exports.updateAnggota = (req, res) => {
  const { nip } = req.body;

  if (!nip) {
    return res.status(400).json({ error: "NIP harus disertakan" });
  }

  const getStatusQuery = "SELECT status FROM anggota WHERE nip_anggota = ?";
  db.query(getStatusQuery, [nip], (err, results) => {
    if (err) {
      console.error("Database error saat mencari anggota:", err);
      return res.status(500).json({ error: "Database error saat mencari anggota" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Anggota tidak ditemukan" });
    }

    const currentStatus = results[0].status;
    const newStatus = currentStatus === "Aktif" ? "Tidak Aktif" : "Aktif";


    const updateQuery = "UPDATE anggota SET status = ? WHERE nip_anggota = ?";
    db.query(updateQuery, [newStatus, nip], (err, result) => {
      if (err) {
        console.error("Gagal mengubah status anggota:", err);
        return res.status(500).json({ error: "Gagal mengubah status anggota" });
      }
      res.status(200).json({ message: `Status anggota berhasil diubah menjadi ${newStatus}` });
    });
  });
};

exports.deleteAnggota = (req, res) => {
  const { id } = req.params;
  console.log("Menghapus anggota dengan ID:", id);

  const query = 'DELETE FROM anggota WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.affectedRows === 0) {
      console.warn("Anggota tidak ditemukan:", id);
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }

    res.redirect('/master/anggota?message=Anggota berhasil dihapus');
  });
};


exports.getUser = (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/user/userKoperasi', { users: results });
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.render('master/user/editUser', { user: results[0] });
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { nama, email, old_password, new_password } = req.body;

  if (!nama || !email || !old_password || !new_password) {
    return res.send(`<script>alert("Semua field harus diisi!"); window.history.back();</script>`);
  }

  db.query("SELECT password FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      return res.send(`<script>alert("Kesalahan database!"); window.history.back();</script>`);
    }

    if (result.length === 0) {
      return res.send(`<script>alert("User tidak ditemukan!"); window.history.back();</script>`);
    }

    const storedPassword = result[0].password;
    if (storedPassword !== old_password) {
      return res.send(`<script>alert("Password lama salah!"); window.history.back();</script>`);
    }

    db.query(
      "UPDATE users SET nama = ?, email = ?, password = ? WHERE id = ?",
      [nama, email, new_password, userId],
      (err, result) => {
        if (err) {
          return res.send(`<script>alert("Gagal memperbarui data user!"); window.history.back();</script>`);
        }

        res.send(`<script>alert("User berhasil diperbarui!"); window.location.href='/master/user';</script>`);
      }
    );
  });
};