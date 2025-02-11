// controllers/master/masterController.js

const db = require('../../config/database');

exports.getPegawai = (req, res) => {
  const search = req.query.search || "";
  const query = `SELECT * FROM pegawai WHERE nama LIKE ? OR nip LIKE ? OR wilayah LIKE ?`;

  db.query(query, [`%${search}%`, `%${search}%`, `%${search}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.render("master/pegawai/pegawai", { pegawai: results, search });
  });
};

exports.createPegawai = (req, res) => {
  console.log("Data diterima dari frontend:", req.body);

  const { nip, nama, wilayah } = req.body;

  if (!nip || !nama || !wilayah) {
    return res.status(400).json({ success: false, message: "Semua field harus diisi" });
  }

  const query = "INSERT INTO pegawai (nip, nama, wilayah) VALUES (?, ?, ?)";

  db.query(query, [nip, nama, wilayah], (err, results) => {
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
  const { new_nip, nama, wilayah } = req.body;

  if (!new_nip || !nama || !wilayah) {
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

    const updateQuery = 'UPDATE pegawai SET nip = ?, nama = ?, wilayah = ? WHERE nip = ?';
    db.query(updateQuery, [new_nip, nama, wilayah, nip], (err) => {
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

// Anggota
exports.getAnggota = (req, res) => {
  const searchQuery = req.query.search ? `%${req.query.search}%` : '%';

  const query = `
      SELECT anggota.id, anggota.nip_anggota, anggota.status, pegawai.nama 
      FROM anggota 
      JOIN pegawai ON anggota.nip_anggota = pegawai.nip
      WHERE anggota.id LIKE ? OR pegawai.nama LIKE ? OR anggota.nip_anggota LIKE ?
  `;

  db.query(query, [searchQuery, searchQuery, searchQuery], (err, results) => {
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
  const { nip_anggota } = req.body; // No need for `status`, since it's always "Aktif"

  if (!nip_anggota) {
    return res.status(400).json({ success: false, message: "Harap pilih pegawai." });
  }

  // Check if the pegawai exists in the database
  const checkPegawaiQuery = 'SELECT nama FROM pegawai WHERE nip = ?';
  db.query(checkPegawaiQuery, [nip_anggota], (err, pegawaiResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error saat mencari pegawai' });
    if (pegawaiResults.length === 0) {
      return res.status(404).json({ success: false, message: 'Pegawai tidak ditemukan di database' });
    }

    const nama = pegawaiResults[0].nama;

    // Get the current highest ID in the anggota table
    const getMaxIdQuery = 'SELECT MAX(id) AS max_id FROM anggota';
    db.query(getMaxIdQuery, (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal mendapatkan ID terakhir' });

      // If there are no entries, start with id 1
      const newId = result[0].max_id ? result[0].max_id + 1 : 1;

      // Insert the new anggota with the next available ID
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

// Mengubah status anggota (Aktif <-> Tidak Aktif)
exports.updateAnggota = (req, res) => {
  const { nip } = req.body;

  const getStatusQuery = "SELECT status FROM anggota WHERE nip_anggota = ?";
  db.query(getStatusQuery, [nip], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error saat mencari anggota' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Anggota tidak ditemukan' });
      }

      const currentStatus = results[0].status;
      const newStatus = currentStatus === 'Aktif' ? 'Tidak Aktif' : 'Aktif';

      // Update status anggota
      const updateQuery = 'UPDATE anggota SET status = ? WHERE nip_anggota = ?';
      db.query(updateQuery, [newStatus, nip], (err, result) => {
          if (err) {
              return res.status(500).json({ error: 'Gagal mengubah status anggota' });
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

// User Fix
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