const db = require('../../config/database'); // Pastikan untuk mengimpor konfigurasi database

exports.getLogin = (req, res) => {
    res.render('login'); // Render halaman login
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Mencari pengguna berdasarkan email
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Memeriksa apakah password yang dimasukkan sama dengan password di database
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Jika login berhasil, simpan informasi pengguna ke sesi
        req.session.userId = user.id;
        req.session.role = user.role_user;

        // Redirect ke dashboard setelah login berhasil
        return res.redirect('/dashboard'); // Ganti '/dashboard' dengan route yang sesuai untuk dashboard Anda
    });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out', error: err });
        }
        res.redirect('/auth/login'); // Redirect ke halaman login setelah logout
    });
};