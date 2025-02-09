const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sikop'
});

connection.connect((err) => {
  if (err) {
    console.error("Koneksi database gagal: " + err.message);
} else {
    console.log("Terhubung ke database MySQL!");
}
});

module.exports = connection;