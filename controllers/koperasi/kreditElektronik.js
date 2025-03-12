const db = require("../../config/database");

exports.lihatKreditElektronik = async (req, res) => {
  try {
    const query = `
      SELECT 
        ke.id,
        ke.id_anggota,
        pg.nama AS nama_anggota,
        ke.jumlah_pinjaman,
        ke.jangka_waktu,
        ke.margin_persen,
        COALESCE(ke.pokok, 0) AS pokok,
        COALESCE(ke.margin, 0) AS margin,
        COALESCE(ke.total_angsuran, 0) AS total_angsuran,
        COALESCE(ke.sisa_piutang, 0) AS sisa_piutang,
        ke.tanggal_mulai,
        ke.ket_status,
        COALESCE(ke.angsuran_ke, 0) AS angsuran_ke
      FROM kredit_elektronik ke
      JOIN anggota a ON ke.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      ORDER BY ke.id DESC;
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error saat mengambil data kredit elektronik:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
      }
      if (results.length === 0) {
        return res.status(404).send("Data kredit elektronik tidak ditemukan.");
      }

      const formattedResults = results.map((item) => ({
        ...item,
        jumlah_pinjaman: item.jumlah_pinjaman.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        pokok: item.pokok.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        margin: item.margin.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        total_angsuran: item.total_angsuran.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        sisa_piutang: item.sisa_piutang.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      }));

      res.render("koperasi/kreditKeuangan/kreditElektronik/lihatKreditElektro", { kreditElektronik: formattedResults });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
  }
};

exports.hapusKreditElektronik = async (req, res) => {
  const id = req.params.id;

  const deletePembayaranQuery = "DELETE FROM pembayaran WHERE id_kredit_elektronik = ?";

  db.query(deletePembayaranQuery, [id], (error, results) => {
    if (error) {
      console.error("Error saat menghapus data pembayaran:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghapus data pembayaran." });
    }

    const deleteKreditQuery = "DELETE FROM kredit_elektronik WHERE id = ?";

    db.query(deleteKreditQuery, [id], (error, results) => {
      if (error) {
        console.error("Error saat menghapus data kredit elektronik:", error);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghapus data kredit elektronik." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Data kredit elektronik tidak ditemukan." });
      }
      res.json({ success: true, message: "Data kredit elektronik berhasil dihapus." });
    });
  });
};

exports.tambahKreditElektronik = async (req, res) => {
  const {
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    margin_persen,
    tanggal_mulai,
  } = req.body;

  // Validasi input
  if (!id_anggota || !jumlah_pinjaman || !jangka_waktu || !margin_persen || !tanggal_mulai) {
    return res.status(400).json({ success: false, message: "Semua field harus diisi." });
  }

  // Parse dan format angka
  const parseNumberWithComma = (value) => {
    if (!value || typeof value !== 'string') return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  const formattedJumlahPinjaman = parseNumberWithComma(jumlah_pinjaman);
  const formattedMarginPersen = parseNumberWithComma(margin_persen);

  // Hitung total margin, pokok, dan total angsuran
  const pokokPerBulan = formattedJumlahPinjaman / jangka_waktu;
  
  // Perbaikan perhitungan margin
  const marginPerBulan = (formattedJumlahPinjaman * formattedMarginPersen) / 100;
  const totalMargin = marginPerBulan * jangka_waktu;
  
  const totalAngsuranPerBulan = pokokPerBulan + marginPerBulan;
  const totalAngsuranKeseluruhan = totalAngsuranPerBulan * jangka_waktu;
  

  // Query untuk menyimpan data ke database
  const query = `
    INSERT INTO kredit_elektronik
    (id_anggota, jumlah_pinjaman, jangka_waktu, margin_persen, pokok, margin, total_angsuran, sisa_piutang, tanggal_mulai, ket_status, angsuran_ke)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    id_anggota,
    formattedJumlahPinjaman,
    jangka_waktu,
    formattedMarginPersen,
    pokokPerBulan,
    marginPerBulan,
    totalAngsuranPerBulan,
    formattedJumlahPinjaman,
    tanggal_mulai,
    "Belum Lunas",
    0
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error saat menambahkan kredit elektronik:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Terjadi kesalahan saat menambahkan kredit elektronik." 
      });
    }
    res.redirect("/lihatKreditElektronik");
  });
};

exports.getAnggotaById = async (req, res) => {
  const idAnggota = req.params.id;
  console.log("ID Anggota yang diminta:", idAnggota);
  const query = `
      SELECT pg.nama 
      FROM anggota a
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE a.id = ?
  `;

  db.query(query, [idAnggota], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data anggota:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil data anggota." });
    }
    console.log("Hasil query:", results);
    if (results.length === 0) {
      return res.json({ success: false, message: "Anggota tidak ditemukan." });
    }
    res.json({ success: true, nama: results[0].nama });
  });
};

exports.cariKreditElektronik = async (req, res) => {
  const { keyword } = req.query;

  try {
    const query = `
      SELECT 
        ke.id,
        ke.id_anggota,
        pg.nama AS nama_anggota,
        ke.jumlah_pinjaman,
        ke.jangka_waktu,
        ke.margin_persen,
        COALESCE(ke.pokok, 0) AS pokok,
        COALESCE(ke.margin, 0) AS margin,
        COALESCE(ke.total_angsuran, 0) AS total_angsuran,
        COALESCE(ke.sisa_piutang, 0) AS sisa_piutang,
        ke.tanggal_mulai,
        ke.ket_status
      FROM kredit_elektronik ke
      JOIN anggota a ON ke.id_anggota = a.id
      JOIN pegawai pg ON a.nip_anggota = pg.nip
      WHERE pg.nama LIKE ? OR ke.id_anggota LIKE ?
      ORDER BY ke.id DESC;
    `;

    db.query(query, [`%${keyword}%`, `%${keyword}%`], (error, results) => {
      if (error) {
        console.error("Error saat mencari data kredit elektronik:", error);
        return res.status(500).send("Terjadi kesalahan saat mencari data kredit elektronik.");
      }
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Terjadi kesalahan saat mencari data kredit elektronik.");
  }
};

exports.tampilkanBayarKreditElektronik = async (req, res) => {
  const id = req.params.id;

  const queryKreditElektronik = `
    SELECT 
      ke.id,
      ke.id_anggota,
      pg.nama AS nama_anggota,
      ke.jumlah_pinjaman,
      ke.jangka_waktu,
      ke.sisa_piutang,
      ke.total_angsuran,
      ke.angsuran_ke,
      ke.margin,
      ke.pokok
    FROM kredit_elektronik ke
    JOIN anggota a ON ke.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE ke.id = ?
  `;

  const queryPembayaran = `
    SELECT 
      tanggal_bayar,
      angsuran_ke,
      jumlah_bayar,
      ket
    FROM pembayaran
    WHERE id_kredit_elektronik = ?
    ORDER BY tanggal_bayar DESC
  `;

  db.query(queryKreditElektronik, [id], (error, resultsKreditElektronik) => {
    if (error) {
      console.error("Error saat mengambil data kredit elektronik:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
    }
    if (resultsKreditElektronik.length === 0) {
      return res.status(404).send("Data kredit elektronik tidak ditemukan.");
    }

    const kredit = resultsKreditElektronik[0];

    db.query(queryPembayaran, [id], (error, resultsPembayaran) => {
      if (error) {
        console.error("Error saat mengambil riwayat pembayaran:", error);
        return res.status(500).send("Terjadi kesalahan saat mengambil riwayat pembayaran.");
      }

      res.render("koperasi/kreditKeuangan/kreditElektronik/bayarKreditElektro", {
        kredit: kredit,
        riwayatPembayaran: resultsPembayaran,
      });
    });
  });
};

exports.prosesBayarKreditElektronik = async (req, res) => {
  const idKreditElektronik = req.params.id;
  const { tanggal_bayar, pembayaran_pokok, pembayaran_margin, keterangan } = req.body;

  const jumlahBayarPokok = parseFloat(pembayaran_pokok.replace(/[^0-9,]/g, "").replace(",", "."));
  const jumlahBayarMargin = parseFloat(pembayaran_margin.replace(/[^0-9,]/g, "").replace(",", "."));

  const getKreditQuery = `
    SELECT 
      sisa_piutang,
      angsuran_ke
    FROM kredit_elektronik
    WHERE id = ?
  `;

  db.query(getKreditQuery, [idKreditElektronik], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data kredit elektronik:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil data kredit elektronik." });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Data kredit elektronik tidak ditemukan." });
    }

    const kredit = results[0];
    const sisaPiutangBaru = kredit.sisa_piutang - jumlahBayarPokok;
    const angsuranKeBaru = kredit.angsuran_ke + 1;
    const statusKredit = sisaPiutangBaru <= 0 ? "Lunas" : "Belum Lunas";

    const insertPembayaranQuery = `
      INSERT INTO pembayaran 
        (id_kredit_elektronik, tanggal_bayar, jumlah_bayar, ket, angsuran_ke)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertPembayaranQuery, [idKreditElektronik, tanggal_bayar, jumlahBayarPokok + jumlahBayarMargin, keterangan, angsuranKeBaru], (error, results) => {
      if (error) {
        console.error("Error saat mencatat pembayaran:", error);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mencatat pembayaran." });
      }

      const updateKreditQuery = `
          UPDATE kredit_elektronik
          SET 
            sisa_piutang = ?,
            angsuran_ke = ?,
            ket_status = ?
          WHERE id = ?
        `;

      db.query(updateKreditQuery, [sisaPiutangBaru, angsuranKeBaru, statusKredit, idKreditElektronik], (updateError, updateResults) => {
        if (updateError) {
          console.error("Error saat mengupdate sisa piutang dan angsuran_ke:", updateError);
          return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupdate sisa piutang dan angsuran_ke." });
        }

        res.redirect("/lihatKreditElektronik");
      });
    });
  });
};

exports.tampilkanEditKreditElektronik = async (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT 
      ke.id,
      ke.id_anggota,
      pg.nama AS nama_anggota,
      ke.jumlah_pinjaman,
      ke.jangka_waktu,
      ke.margin_persen,
      ke.pokok,
      ke.margin,
      ke.total_angsuran,
      ke.sisa_piutang,
      ke.tanggal_mulai,
      ke.ket_status
    FROM kredit_elektronik ke
    JOIN anggota a ON ke.id_anggota = a.id
    JOIN pegawai pg ON a.nip_anggota = pg.nip
    WHERE ke.id = ?
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error saat mengambil data kredit elektronik:", error);
      return res.status(500).send("Terjadi kesalahan saat mengambil data kredit elektronik.");
    }
    if (results.length === 0) {
      return res.status(404).send("Data kredit elektronik tidak ditemukan.");
    }

    const kredit = results[0];
    res.render("koperasi/kreditKeuangan/kreditElektronik/editKreditElektro", { kredit });
  });
};

exports.simpanEditKreditElektronik = async (req, res) => {
  const id = req.params.id;
  const {
    id_anggota,
    jumlah_pinjaman,
    jangka_waktu,
    tanggal_mulai,
    pokok,
    margin,
    total_angsuran,
    sisa_piutang,
  } = req.body;

  const cleanNumberFormat = (value) => {
    return parseFloat(value.replace(/\./g, '').replace(',', '.'));
  };

  const formattedJumlahPinjaman = cleanNumberFormat(jumlah_pinjaman);
  const formattedPokok = cleanNumberFormat(pokok);
  const formattedMargin = cleanNumberFormat(margin);
  const formattedTotalAngsuran = cleanNumberFormat(total_angsuran);
  const formattedSisaPiutang = cleanNumberFormat(sisa_piutang);

  // Ambil margin_persen yang sudah ada dari database
  const getMarginQuery = "SELECT margin_persen FROM kredit_elektronik WHERE id = ?";
  db.query(getMarginQuery, [id], (error, results) => {
    if (error) {
      console.error("Error saat mengambil margin_persen:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengambil margin_persen." });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Data kredit elektronik tidak ditemukan." });
    }

    const margin_persen = results[0].margin_persen;

    const query = `
      UPDATE kredit_elektronik
      SET 
        id_anggota = ?,
        jumlah_pinjaman = ?,
        jangka_waktu = ?,
        tanggal_mulai = ?,
        pokok = ?,
        margin = ?,
        total_angsuran = ?,
        sisa_piutang = ?,
        ket_status = ?
      WHERE id = ?
    `;

    const values = [
      id_anggota,
      formattedJumlahPinjaman,
      jangka_waktu,
      tanggal_mulai,
      formattedPokok,
      formattedMargin,
      formattedTotalAngsuran,
      formattedSisaPiutang,
      formattedSisaPiutang <= 0 ? "Lunas" : "Belum Lunas",
      id
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error("Error saat mengupdate kredit elektronik:", error);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupdate kredit elektronik." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Data kredit elektronik tidak ditemukan." });
      }
      res.redirect('/lihatKreditElektronik');
    });
  });
};