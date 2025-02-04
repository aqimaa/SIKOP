const db = require('../../config/database');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    req.session.userId = user.id;
    req.session.role = user.role_user;

    switch (user.role_user) {
      case 'Super Admin':
        return res.redirect('/dashboardSuperadmin');
      case 'Pimpinan':
        return res.redirect('/dashboardPimpinan');
      case 'Admin Keuangan':
        return res.redirect('/dashboardKeuangan');
      default:
        return res.status(401).json({ message: 'Invalid role' });
    }
  });
};

exports.getChangePassword = (req, res) => {
  res.render('auth/changePassword');
};

exports.changePassword = async (req, res) => {
  console.log("Change Password Request Received", req.body); // Debugging
  const { email, newPassword, oldPassword } = req.body;
  
  if (!email || !newPassword || !oldPassword) {
      return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
      const query = 'SELECT * FROM users WHERE email = ?';
      db.query(query, [email], (err, results) => {
          if (err) {
              console.error("Database Error:", err); // Debugging
              return res.status(500).json({ message: 'Database error', error: err });
          }

          if (results.length === 0) {
              return res.status(400).send("User tidak ditemukan.");
          }

          const user = results[0];

          if (user.password !== oldPassword) {
              return res.status(400).send("Password lama tidak benar.");
          }

          const queryUpdate = 'UPDATE users SET password = ? WHERE email = ?';
          db.query(queryUpdate, [newPassword, email], (err, results) => {
              if (err) {
                  console.error("Database Update Error:", err);
                  return res.status(500).json({ message: 'Database error', error: err });
              }

              console.log("Password berhasil diubah untuk", email);
              
              res.send(`
                  <script>
                      alert("Password berhasil diubah. Silakan login kembali.");
                      window.location.href = "/login";
                  </script>
              `);
          });
      });
  } catch (error) {
      console.error("Unexpected Error:", error); // Debugging
      res.status(500).send("Terjadi kesalahan saat mengubah password.");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out', error: err });
    }
    return res.json({ success: true, message: 'Anda berhasil logout' });
  });
};