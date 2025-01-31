// controllers/master/masterController.js

const db = require('../../config/database');

// Pegawai
exports.getPegawai = (req, res) => {
  const query = 'SELECT * FROM pegawai';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
};

exports.createPegawai = (req, res) => {
  const { nip, nama, wilayah } = req.body;
  const query = 'INSERT INTO pegawai (nip, nama, wilayah) VALUES (?, ?, ?)';
  db.query(query, [nip, nama, wilayah], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Pegawai berhasil ditambahkan' });
  });
};

exports.updatePegawai = (req, res) => {
  const { nip, nama, wilayah } = req.body;
  const query = 'UPDATE pegawai SET nama = ?, wilayah = ? WHERE nip = ?';
  db.query(query, [nama, wilayah, nip], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Pegawai berhasil diupdate' });
  });
};

exports.deletePegawai = (req, res) => {
  const { nip } = req.params;
  const query = 'DELETE FROM pegawai WHERE nip = ?';
  db.query(query, [nip], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Pegawai berhasil dihapus' });
  });
};

// Anggota
exports.getAnggota = (req, res) => {
  const query = 'SELECT * FROM anggota';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
};

exports.createAnggota = (req, res) => {
  const { id, nip_anggota, status } = req.body;
  const query = 'INSERT INTO anggota (id, nip_anggota, status) VALUES (?, ?, ?)';
  db.query(query, [id, nip_anggota, status], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Anggota berhasil ditambahkan' });
  });
};

exports.updateAnggota = (req, res) => {
  const { id, nip_anggota, status } = req.body;
  const query = 'UPDATE anggota SET nip_anggota = ?, status = ? WHERE id = ?';
  db.query(query, [nip_anggota, status, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Anggota berhasil diupdate' });
  });
};

exports.deleteAnggota = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM anggota WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Anggota berhasil dihapus' });
  });
};

// User
exports.getUser = (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  const { nama, email, password, role_user } = req.body;
  const query = 'INSERT INTO users (nama, email, password, role_user) VALUES (?, ?, ?, ?)';
  db.query(query, [nama, email, password, role_user], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'User  berhasil ditambahkan' });
  });
};

exports.updateUser  = (req, res) => {
  const { id, nama, email, password, role_user } = req.body;
  const query = 'UPDATE users SET nama = ?, email = ?, password = ?, role_user = ? WHERE id = ?';
  db.query(query, [nama, email, password, role_user, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'User  berhasil diupdate' });
  });
};

exports.deleteUser  = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'User  berhasil dihapus' });
  });
};