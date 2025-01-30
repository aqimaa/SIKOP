const db = require('../../config/database');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

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

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out', error: err });
    }
    res.redirect('/auth/login');
  });
};