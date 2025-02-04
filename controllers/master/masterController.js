// controllers/master/masterController.js

const db = require('../../config/database');

// Pegawai
exports.getPegawai = (req, res) => {
  const query = 'SELECT * FROM pegawai';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/pegawai', { pegawai: results });
  });
};

exports.createPegawai = (req, res) => {
  const { nip, nama, wilayah } = req.body;
  const query = 'INSERT INTO pegawai (nip, nama, wilayah) VALUES (?, ?, ?)';
  db.query(query, [nip, nama, wilayah], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/pegawai');
  });
};

exports.updatePegawai = (req, res) => {
  const { nip, nama, wilayah } = req.body;
  const query = 'UPDATE pegawai SET nama = ?, wilayah = ? WHERE nip = ?';
  db.query(query, [nama, wilayah, nip], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/pegawai');
  });
};

exports.deletePegawai = (req, res) => {
  const { nip } = req.params;
  const query = 'DELETE FROM pegawai WHERE nip = ?';
  db.query(query, [nip], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/pegawai');
  });
};

// Anggota
exports.getAnggota = (req, res) => {
  const query = 'SELECT * FROM anggota';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/anggotaKoperasi', { anggota: results });
  });
};

exports.createAnggota = (req, res) => { 
  const { id, nip_anggota, status } = req.body;

  // Cek apakah nip_anggota ada di tabel pegawai
  const checkQuery = 'SELECT nip FROM pegawai WHERE nip = ?';
  db.query(checkQuery, [nip_anggota], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    // Jika tidak ditemukan, kirim pesan error
    if (results.length === 0) {
      return res.status(400).json({ message: 'NIP tidak ditemukan di tabel pegawai' });
    }

    // Jika ditemukan, lanjutkan proses insert ke tabel anggota
    const insertQuery = 'INSERT INTO anggota (id, nip_anggota, status) VALUES (?, ?, ?)';
    db.query(insertQuery, [id, nip_anggota, status], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.redirect('/master/anggota');
    });
  });
};


exports.updateAnggota = (req, res) => {
  const { id, nip_anggota, status } = req.body;
  const query = 'UPDATE anggota SET nip_anggota = ?, status = ? WHERE id = ?';
  db.query(query, [nip_anggota, status, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/anggota');
  });
};

exports.deleteAnggota = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM anggota WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/anggota');
  });
};

// User
exports.getUser = (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.render('master/userKoperasi', { user: results });
  });
};

exports.updateUser   = (req, res) => {
  const { id, nama, email, password, role_user } = req.body;
  const query = 'UPDATE users SET nama = ?, email = ?, password = ?, role_user = ? WHERE id = ?';
  db.query(query, [nama, email, password, role_user, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/user');
  });
};

exports.deleteUser   = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/user');
  });
};