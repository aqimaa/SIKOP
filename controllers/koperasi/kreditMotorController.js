const db = require("../../config/database");

exports.lihatKreditMotor = async (req, res) => {
  try {
    const query = `
      SELECT 
        km.id,
        km.id_anggota,
        pg.nama AS nama_anggota,
        km.jumlah_pinjaman,
        km.jangka_waktu,
        km.total_angsuran,
        km.pokok,
        km.margin,
        km.angsuran_ke,
        km.sisa_piutang,
        km.tanggal_mulai,
        km.ket_status,
        km.margin_persen
      FROM kredit_motor km
      JOIN anggota a ON km.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error saat mengambil data kredit motor:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data kredit motor.");
      }
      if (results.length === 0) {
        return res.status(404).send("Data kredit motor tidak ditemukan.");
      }

      res.render("koperasi/kreditKeuangan/kreditMotor/lihatKreditMotor", { kreditMotor: results });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data kredit motor.");
  }
};

exports.tampilkanTambahKreditMotor = async (req, res) => {
  try {

    const queryAnggota = "SELECT id, nama FROM anggota";
    db.query(queryAnggota, (error, results) => {
      if (error) {
        console.error("Error saat mengambil data anggota:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data anggota.");
      }

      res.render("koperasi/kreditKeuangan/kreditMotor/tambahKreditMotor", { anggota: results });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat menampilkan halaman tambah kredit motor.");
  }
};

exports.tambahKreditMotor = async (req, res) => {
  const {
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai,
    total_angsuran,
    pokok,
    margin,
    sisa_piutang
  } = req.body;

  try {

    const formattedJumlahPinjaman = parseFloat(jumlah_pinjaman.replace(/,/g, ''));
    const formattedTotalAngsuran = parseFloat(total_angsuran.replace(/,/g, ''));
    const formattedPokok = parseFloat(pokok.replace(/,/g, ''));
    const formattedMargin = parseFloat(margin.replace(/,/g, ''));
    const formattedSisaPiutang = parseFloat(sisa_piutang.replace(/,/g, ''));
    const formattedMarginPersen = parseFloat(margin_persen);

    const query = `
            INSERT INTO kredit_motor 
            (id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, 
             pokok, margin, sisa_piutang, tanggal_mulai, ket_status, 
             angsuran_ke, margin_persen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      id_anggota,
      formattedJumlahPinjaman,
      jangka_waktu,
      formattedTotalAngsuran,
      formattedPokok,
      formattedMargin,
      formattedSisaPiutang,
      tanggal_mulai,
      'Belum Lunas',
      0,
      formattedMarginPersen
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error saat menambahkan kredit motor:", error);
        return res.status(500).send("Terjadi kesalahan saat menambahkan kredit motor.");
      }

      res.redirect('/kreditMotor');
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat menambahkan kredit motor.");
  }
};

exports.tampilkanEditKreditMotor = async (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT
      km.id,
      km.id_anggota,
      pg.nama AS nama_anggota,
      km.jumlah_pinjaman,
      km.jangka_waktu,
      km.total_angsuran,
      km.margin_persen,
      km.pokok,
      km.margin,
      km.angsuran_ke,
      km.sisa_piutang,
      km.tanggal_mulai,
      km.ket_status
    FROM kredit_motor km
    JOIN anggota a ON km.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE km.id = ?
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data kredit motor:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data kredit motor.");
    }
    if (results.length === 0) {
      return res.status(404).send("Data kredit motor tidak ditemukan.");
    }
    const kredit = results[0];
    res.render("koperasi/kreditKeuangan/kreditMotor/editKreditMotor", { kredit });
  });
};

exports.simpanEditKreditMotor = async (req, res) => {
  const id = req.params.id;
  const {
    jumlah_pinjaman,
    jangka_waktu,
    total_angsuran,
    margin_persen,
    pokok,
    margin,
    angsuran_ke,
    sisa_piutang,
    tanggal_mulai,
    ket_status,
    id_anggota
  } = req.body;

  const query = `
    UPDATE kredit_motor
    SET
      jumlah_pinjaman = ?,
      jangka_waktu = ?,
      total_angsuran = ?,
      margin_persen = ?,
      pokok = ?,
      margin = ?,
      angsuran_ke = ?,
      sisa_piutang = ?,
      tanggal_mulai = ?,
      ket_status = ?
    WHERE id = ?
  `;

  const values = [
    jumlah_pinjaman,
    jangka_waktu,
    total_angsuran,
    margin_persen,
    pokok,
    margin,
    angsuran_ke,
    sisa_piutang,
    tanggal_mulai,
    ket_status,
    id
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat mengupdate kredit motor:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengupdate kredit motor."
      });
    }

    res.json({
      success: true,
      message: "Data kredit motor berhasil diperbarui"
    });
  });
};

exports.tampilkanBayarKreditMotor = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
        SELECT 
          km.id,
          km.id_anggota,
          pg.nama AS nama_anggota,
          km.jumlah_pinjaman,
          km.jangka_waktu,
          km.total_angsuran,
          km.pokok,
          km.margin,
          km.angsuran_ke,
          km.sisa_piutang,
          km.tanggal_mulai,
          km.ket_status,
          km.margin_persen
        FROM kredit_motor km
        JOIN anggota a ON km.id_anggota = a.id
        JOIN pegawai pg ON a.nip_anggota = pg.nip
        WHERE km.id = ?
      `;

    db.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error saat mengambil data kredit motor:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data kredit motor.");
      }
      if (results.length === 0) {
        return res.status(404).send("Data kredit motor tidak ditemukan.");
      }

      const kreditMotor = results[0];

      const queryPembayaran = `
          SELECT * FROM pembayaran
          WHERE id_kredit_motor = ?
          ORDER BY tanggal_bayar DESC
        `;

      db.query(queryPembayaran, [id], (error, pembayaranResults) => {
        if (error) {
          console.error("Error saat mengambil data pembayaran:", error);
          return res.status(500).send("Terjadi kesalahan saat mengambil data pembayaran.");
        }

        res.render("koperasi/kreditKeuangan/kreditMotor/bayarKreditMotor", {
          kreditMotor: kreditMotor,
          pembayaran: pembayaranResults
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat menampilkan halaman pembayaran kredit motor.");
  }
};

exports.prosesBayarKreditMotor = async (req, res) => {
  const { id } = req.params;
  const { tanggal_bayar, jumlah_bayar, keterangan } = req.body;

  try {

    const queryKreditMotor = `
            SELECT * FROM kredit_motor
            WHERE id = ?
        `;

    db.query(queryKreditMotor, [id], (error, results) => {
      if (error) {
        console.error("Error saat mengambil data kredit motor:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data kredit motor.");
      }
      if (results.length === 0) {
        return res.status(404).send("Data kredit motor tidak ditemukan.");
      }

      const kreditMotor = results[0];
      const angsuranKe = kreditMotor.angsuran_ke + 1;
      const sisaPiutang = kreditMotor.sisa_piutang - jumlah_bayar;
      const ketStatus = sisaPiutang <= 0 ? 'Lunas' : 'Belum Lunas';
      const queryInsertPembayaran = `
                INSERT INTO pembayaran (id_kredit_motor, tanggal_bayar, angsuran_ke, jumlah_bayar, ket)
                VALUES (?, ?, ?, ?, ?)
            `;

      db.query(queryInsertPembayaran, [id, tanggal_bayar, angsuranKe, jumlah_bayar, keterangan], (error, results) => {
        if (error) {
          console.error("Error saat menyimpan data pembayaran:", error);
          return res.status(500).send("Terjadi kesalahan saat menyimpan data pembayaran.");
        }

        const queryUpdateKreditMotor = `
                    UPDATE kredit_motor
                    SET angsuran_ke = ?, sisa_piutang = ?, ket_status = ?
                    WHERE id = ?
                `;

        db.query(queryUpdateKreditMotor, [angsuranKe, sisaPiutang, ketStatus, id], (error, results) => {
          if (error) {
            console.error("Error saat mengupdate data kredit motor:", error);
            return res.status(500).send("Terjadi kesalahan saat mengupdate data kredit motor.");
          }

          res.redirect('/lihatKreditMotor');
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat memproses pembayaran kredit motor.");
  }
};

exports.getAnggotaById = async (req, res) => {
  const idAnggota = req.params.id;

  console.log("Mencari anggota dengan ID:", idAnggota);

  const query = `
        SELECT 
            pg.nama,
            a.id as id_anggota,
            a.status
        FROM anggota a
        JOIN pegawai pg ON a.nip_anggota = pg.nip
        WHERE a.id = ?
    `;

  db.query(query, [idAnggota], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data anggota:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data anggota."
      });
    }

    console.log("Hasil query:", results);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Anggota tidak ditemukan."
      });
    }

    if (results[0].status !== 'Aktif') {
      return res.status(400).json({
        success: false,
        message: "Status anggota tidak aktif."
      });
    }

    res.json({
      success: true,
      nama: results[0].nama,
      id_anggota: results[0].id_anggota
    });
  });
};

exports.tambahKreditMotor = async (req, res) => {
  try {
    const {
      id_anggota,
      jumlah_pinjaman,
      jangka_waktu,
      margin_persen,
      tanggal_mulai,
      total_angsuran,
      pokok,
      margin,
      sisa_piutang
    } = req.body;

    const formattedJumlahPinjaman = parseFloat(jumlah_pinjaman.replace(/,/g, ''));
    const formattedTotalAngsuran = parseFloat(total_angsuran.replace(/,/g, ''));
    const formattedPokok = parseFloat(pokok.replace(/,/g, ''));
    const formattedMargin = parseFloat(margin.replace(/,/g, ''));
    const formattedSisaPiutang = parseFloat(sisa_piutang.replace(/,/g, ''));
    const formattedMarginPersen = parseFloat(margin_persen);

    if (!id_anggota || !formattedJumlahPinjaman || !jangka_waktu || !tanggal_mulai) {
      throw new Error('Semua field wajib diisi');
    }

    const query = `
            INSERT INTO kredit_motor 
            (id_anggota, jumlah_pinjaman, jangka_waktu, total_angsuran, 
             pokok, margin, sisa_piutang, tanggal_mulai, ket_status, 
             angsuran_ke, margin_persen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      id_anggota,
      formattedJumlahPinjaman,
      jangka_waktu,
      formattedTotalAngsuran,
      formattedPokok,
      formattedMargin,
      formattedSisaPiutang,
      tanggal_mulai,
      'Belum Lunas',
      0,
      formattedMarginPersen
    ];

    console.log("Query values:", values);

    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error saat menambahkan kredit motor:", error);
        return res.status(500).send("Terjadi kesalahan saat menambahkan kredit motor.");
      }

      res.redirect('/lihatKreditMotor');
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message || "Terjadi kesalahan saat menambahkan kredit motor.");
  }
};

exports.hapusKreditMotor = (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM pembayaran WHERE id_kredit_motor = ?", [id], (err) => {
    if (err) {
      console.error("Error saat menghapus pembayaran:", err);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus data pembayaran"
      });
    }

    db.query("DELETE FROM kredit_motor WHERE id = ?", [id], (error, result) => {
      if (error) {
        console.error("Error saat menghapus kredit motor:", error);
        return res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat menghapus data kredit motor"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Data kredit motor tidak ditemukan"
        });
      }

      res.json({
        success: true,
        message: "Data kredit motor berhasil dihapus"
      });
    });
  });
};

exports.cariKreditMotor = (req, res) => {
  const { search } = req.query;

  console.log('Search Query:', search);

  const sql = `
      SELECT 
          km.id,
          km.id_anggota,
          pg.nama AS nama_anggota,
          km.jumlah_pinjaman,
          km.jangka_waktu,
          km.total_angsuran,
          km.pokok,
          km.margin,
          km.angsuran_ke,
          km.sisa_piutang,
          km.tanggal_mulai,
          km.ket_status,
          km.margin_persen
      FROM kredit_motor km
      JOIN anggota a ON km.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE LOWER(pg.nama) LIKE LOWER(?)
      ORDER BY km.id DESC
  `;

  console.log('Running query with search:', `%${search}%`);

  db.query(sql, [`%${search}%`], (err, results) => {
    if (err) {
      console.error("Error SQL:", err);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat mencari data",
        error: err.message
      });
    }

    console.log('Search results:', results);
    res.json(results || []);
  });
};