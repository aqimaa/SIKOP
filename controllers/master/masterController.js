// controllers/master/masterController.js

const db = require('../../config/database');

// Pegawai
// Mendapatkan semua pegawai
exports.getPegawai = (req, res) => { 
  const query = 'SELECT * FROM pegawai';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/pegawai/pegawai', { pegawai: results });
  });
};

// Menambahkan pegawai
exports.createPegawai = (req, res) => {
  console.log("Data diterima dari frontend:", req.body); // Debugging

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

// 📌 Menampilkan form ubah pegawai dengan data yang benar
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

// 📌 Proses update pegawai
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

// Menghapus pegawai
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
  const queryAnggota = 'SELECT * FROM anggota';
  db.query(queryAnggota, (err, anggotaResults) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.render('master/anggota/anggotaKoperasi', { anggota: anggotaResults });
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

exports.createAnggota = (req, res) => {
  const { nip_anggota, status } = req.body;
  const query = 'INSERT INTO anggota (nip_anggota, status) VALUES (?, ?)';
  db.query(query, [nip_anggota, status], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/anggota');
  });
};

exports.updateAnggota = (req, res) => {
  const { id, nip_anggota, status } = req.body;
  const query = 'UPDATE anggota SET nip_anggota = ?, status = ? WHERE id = ?';
  db.query(query, [nip_anggota, status, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/anggota/ubahAnggota');
  });
};

exports.deleteAnggota = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM anggota WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/anggota/tambahAnggota');
  });
};

// User
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
  const { id } = req.params;
  const { nama, email, password, role_user } = req.body;
  const query = 'UPDATE users SET nama = ?, email = ?, password = ?, role_user = ? WHERE id = ?';

  db.query(query, [nama, email, password, role_user, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    
    res.redirect('/master/user/userKoperasi'); 
  });
};