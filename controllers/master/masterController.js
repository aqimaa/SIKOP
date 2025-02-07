// controllers/master/masterController.js

const db = require('../../config/database');

// Pegawai Fix
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
  const query = `
      SELECT anggota.id, anggota.nip_anggota, anggota.status, pegawai.nama 
      FROM anggota 
      JOIN pegawai ON anggota.nip_anggota = pegawai.nip
  `;
  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
      }
      res.render('master/anggota/anggotaKoperasi', { anggota: results });
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

// Mengambil daftar pegawai yang belum menjadi anggota aktif
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


// Menambahkan anggota baru
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

  // Cek status anggota saat ini
  const getStatusQuery = 'SELECT status FROM anggota WHERE nip_anggota = ?';
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
  console.log("Menghapus anggota dengan ID:", id); // Debugging

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

    // Redirect ke halaman daftar anggota dan kirim pesan sukses lewat query parameter
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
      return res.status(404).json({ message: 'User  not found' });
    }
    res.render('master/user/editUser ', { user: results[0] });
  });
};

exports.updateUser  = (req, res) => {
  const { id } = req.params;
  const { nama, email, password, role_user } = req.body;
  const query = 'UPDATE users SET nama = ?, email = ?, password = ?, role_user = ? WHERE id = ?';
  db.query(query, [nama, email, password, role_user, id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.redirect('/master/user');
  });
};

// ------------------------------
// A. Controller.js (menggunakan Express.js mysql tanpa sequelize):
// // Anggota
// exports.getAnggota = (req, res) => {
//   const queryAnggota = 'SELECT * FROM anggota';
//   db.query(queryAnggota, (err, anggotaResults) => {
//     if (err) {
//       return res.status(500).json({ message: 'Database error', error: err });
//     }

//     res.render('master/anggota/anggotaKoperasi', { anggota: anggotaResults });
//   });
// }; 

// exports.getPegawaiForAnggota = (req, res) => {
//   const query = 'SELECT * FROM pegawai';
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Database error', error: err });
//     }
//     res.render('master/anggota/tambahAnggota', { pegawai: results, title: 'Tambah Anggota' });
//   });
// };

// exports.createAnggota = (req, res) => {
//   const { nip_anggota, status } = req.body;
//   const query = 'INSERT INTO anggota (nip_anggota, status) VALUES (?, ?)';
//   db.query(query, [nip_anggota, status], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Database error', error: err });
//     }
//     res.redirect('/master/anggota');
//   });
// };

// exports.updateAnggota = (req, res) => {
//   const { id, nip_anggota, status } = req.body;
//   const query = 'UPDATE anggota SET nip_anggota = ?, status = ? WHERE id = ?';
//   db.query(query, [nip_anggota, status, id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Database error', error: err });
//     }
//     res.redirect('/master/anggota/ubahAnggota');
//   });
// };

// exports.deleteAnggota = (req, res) => {
//   const { id } = req.params;
//   const query = 'DELETE FROM anggota WHERE id = ?';
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Database error', error: err });
//     }
//     res.redirect('/master/anggota/tambahAnggota');
//   });
// };

// B. Route.js : 
// // Route Anggota
// router.get('/master/anggota', masterController.getAnggota);
// router.get('/master/anggota/tambahAnggota', masterController.getPegawaiForAnggota);
// router.post('/master/anggota/tambahAnggota', masterController.createAnggota);
// router.get('/master/anggota/ubahAnggota/:id', (req, res) => {
//     res.render('master/anggota/ubahAnggota', { anggota: results[0] });
//   });
// router.post('/master/anggota/ubahAnggota/:id', masterController.updateAnggota);
// router.get('/master/anggota/delete/:id', masterController.deleteAnggota);

// C. UI anggotaKoperasi.ejs :
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Data Anggota</title>
//     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//     <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
//     <script>
//         function logout() {
//             if (confirm("Yakin ingin keluar?")) {
//                 fetch('/logout', { method: 'POST' })
//                     .then(response => response.json())
//                     .then(data => {
//                         if (data.success) {
//                             alert("Anda berhasil logout");
//                             window.location.href = "/login";
//                         } else {
//                             alert("Gagal logout, coba lagi.");
//                         }
//                     })
//                     .catch(error => console.error('Logout error:', error));
//             }
//         }
//         function toggleDropdown() {
//             const dropdownMenu = document.getElementById('dropdownMenu');
//             dropdownMenu.classList.toggle('hidden');
//         }
//     </script>
// </head>
// <body class="flex bg-gray-100">
//     <!-- Sidebar -->
//     <div id="sidebar" class="w-72 text-white min-h-screen p-4 fixed left-0 top-0 transform transition-transform bg-green-800" style="background-color: #5D8736; z-index: 999;">
//         <div class="flex items-center mb-8">
//             <img src="/images/logo.png" alt="Logo" class="w-16 h-16 mr-7 cursor-pointer" id="logo">
//             <div id="sidebarContent">
//                 <h1 class="text-2xl font-bold">SIKOP</h1>
//                 <p class="text-sm">Sistem Informasi Koperasi</p>
//             </div>
//         </div>
//         <nav>
//             <ul>
//                 <li class="mb-4">
//                     <a href="/dashboardSuperadmin" class="flex items-center block p-6 py-3 hover:bg-green-900 rounded">
//                         <img src="/images/vectordasbor.png" alt="lihat data icon" class="w=5 h-5">
//                         <span class="ml-2 text-xl ml-5">Dashboard</span>
//                     </a>
//                 </li>
//                 <li>
//                     <button onclick="toggleDropdown()" class="flex items-center justify-between w-full focus:outline-none">
//                         <div class="flex items-center">
//                             <a href="#" class="flex items-center block p-6 py-3 hover:">
//                                 <img src="/images/lihatdata.png" alt="lihat data icon" class="w=5 h-5">
//                                 <span class="ml-2 text-xl ml-5">Data Master</span>
//                             </a>
//                         </div>
//                         <img src="/images/angle-small-down.png" alt="dropdown icon" class="w-6 h-6 transform transition-transform" id="dropdownIcon">
//                     </button>
//                     <ul id="dropdownMenu" class="pl-6 hidden">
//                         <li class="mb-2"><a href="/master/pegawai" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Pegawai</a></li>
//                         <li class="mb-2"><a href="/master/anggota" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Anggota Koperasi</a></li>
//                         <li class="mb-2"><a href="/master/user" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Admin Area</a></li>
//                     </ul>
//                 </li>
//             </ul>
//         </nav>
//         <div class="absolute bottom-0 left-0 w-full p-4">
//             <button onclick="logout()" class="flex items-center w-full p-6 py-3 hover:bg-green-900 rounded transition duration-300">
//                 <span class="material-icons">logout</span>
//                 <span class="ml-5 text-xl">Log Out</span>
//             </button>
//         </div>
//     </div>
//     <!-- Main Content -->
//     <div class="flex-1 ml-72 bg-gray-100 min-h-screen">
//         <header class="flex justify-between items-center mb-8 bg-white p-4 shadow-md">
//             <div class="flex-1"><h1 class="text-2xl font-bold text-center">Data Anggota Koperasi</h1></div>
//             <div class="flex items-center">
//                 <span class="mr-2">Super Admin</span>
//                 <img src="../../images/profile-user.png" alt="User" class="rounded-full w-10 h-10" />
//             </div>
//         </header>
//         <div class="bg-white p-8 w-3/4 rounded shadow mx-auto">
//             <div class="mb-4 flex justify-between items-center">
//                 <div class="flex items-center">
//                     <input type="text" placeholder="Cari Anggota" class="border border-gray-300 p-2 rounded w-64" />
//                     <button style="background-color: #3394cc; color: white;" class="ml-2 px-4 py-2 rounded hover:bg-[#4c6e2f]">Cari</button>
//                 </div>
//                 <div><a href="/master/anggota/tambahAnggota"><button style="background-color: #5D8736; color: white;" class="px-4 py-2 rounded hover:bg-[#4c6e2f]">+ Tambah Anggota Baru</button></a></div>
//             </div>
//             <table class="table-auto w-full border-collapse">
//                 <thead>
//                     <tr class="text-left bg-gray-100">
//                         <th class="p-4">Id</th>
//                         <th class="p-4">NIP</th>
//                         <th class="p-4">Status</th>
//                         <th class="p-4">Aksi</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <% anggota.forEach(function(anggota) { %>
//                     <tr class="border-b">
//                         <td class="p-4"><%= anggota.id %></td>
//                         <td class="p-4"><%= anggota.nip_anggota %></td>
//                         <td class="p-4"><%= anggota.status %></td>
//                         <td class="p-4">
//                             <form action="/master/anggota/<%= anggota.id %>" method="GET" class="inline">
//                                 <button type="submit" class="bg-blue-600 text-white p-1 rounded hover:bg-blue-700" title="Edit">
//                                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//                                         <path d="M12 20h9" />
//                                         <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
//                                     </svg>
//                                 </button>
//                             </form>
//                             <form action="/master/anggota/<%= anggota.id %>?_method=DELETE" method="POST" class="inline">
//                                 <button type="submit" class="bg-red-600 text-white p-1 rounded hover:bg-red-700" title="Hapus" onclick="return confirm('Apakah Anda yakin ingin menghapus?');">
//                                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
//                                     </svg>
//                                 </button>
//                             </form>
//                         </td>
//                     </tr>
//                     <% }); %>
//                 </tbody>
//             </table>
//         </div>
//     </div>
// </body>
// </html>

// D. UI tambahAnggota.ejs :
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Tambah Anggota</title>
//     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//     <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
//     <script>
//         function logout() {
//             if (confirm("Yakin ingin keluar?")) {
//                 fetch('/logout', { method: 'POST' })
//                     .then(response => response.json())
//                     .then(data => {
//                         if (data.success) {
//                             alert("Anda berhasil logout");
//                             window.location.href = "/login";
//                         } else {
//                             alert("Gagal logout, coba lagi.");
//                         }
//                     })
//                     .catch(error => console.error('Logout error:', error));
//             }
//         }

//         function toggleDropdown() {
//             const dropdownMenu = document.getElementById('dropdownMenu');
//             dropdownMenu.classList.toggle('hidden');
//         }
//         </script>
// </head>
// <body class="flex">
//     <!-- Sidebar -->
//     <div id="sidebar" class="w-72 text-white min-h-screen p-4 fixed left-0 top-0 transform transition-transform bg-green-800" style="background-color: #5D8736; z-index: 999;">
//         <div class="flex items-center mb-8">
//             <img src="/images/logo.png" alt="Logo" class="w-16 h-16 mr-7 cursor-pointer" id="logo">
//             <div id="sidebarContent">
//                 <h1 class="text-2xl font-bold">SIKOP</h1>
//                 <p class="text-sm">Sistem Informasi Koperasi</p>
//             </div>
//         </div>
//         <nav>
//             <ul>
//                 <li class="mb-4">
//                     <a href="/dashboardSuperadmin" class="flex items-center block p-6 py-3 hover:bg-green-900 rounded">
//                         <img src="/images/vectordasbor.png" alt="lihat data icon" class="w=5 h-5 ">
//                         <span class="ml-2 text-xl ml-5">Dashboard</span>
//                     </a>
//                 </li>
//                 <li>
//                     <button onclick="toggleDropdown()" class="flex items-center justify-between w-full focus:outline-none">
//                         <div class="flex items-center">
//                             <a href="#" class="flex items-center block p-6 py-3 hover:">
//                                 <img src="/images/lihatdata.png" alt="lihat data icon" class="w=5 h-5 ">
//                                 <span class="ml-2 text-xl ml-5">Data Master</span>
//                             </a>
//                         </div>
//                         <img src="/images/angle-small-down.png" alt="dropdown icon" class="w-6 h-6 transform transition-transform" id="dropdownIcon">
//                     </button>
//                     <ul id="dropdownMenu" class="pl-6 hidden">
//                         <li class="mb-2">
//                             <a href="/master/pegawai" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Pegawai</a>
//                         </li>
//                         <li class="mb-2">
//                             <a href="/master/anggota" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Anggota Koperasi</a>
//                         </li>
//                         <li class="mb-2">
//                             <a href="/master/user" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Admin Area</a>
//                         </li>
//                     </ul>
//                 </li>
//             </ul>
//         </nav>
//         <div class="absolute bottom-0 left-0 w-full p-4">
//             <button onclick="logout()" class="flex items-center w-full p-6 py-3 hover:bg-green-900 rounded transition duration-300">
//                 <span class="material-icons">logout</span>
//                 <span class="ml-5 text-xl">Log Out</span>
//             </button>
//         </div>
//     </div>
//     <div class="flex-1 ml-72 bg-gray-100 min-h-screen">
//         <header class="flex justify-between items-center mb-8 bg-white p-4 shadow-md">
//             <div class="flex-1"><h1 class="text-2xl font-bold text-center">Data Anggota Koperasi</h1></div>
//             <div class="flex items-center">
//                 <span class="mr-2">Super Admin</span>
//                 <img src="../../images/profile-user.png" alt="User" class="rounded-full w-10 h-10" />
//             </div>
//         </header>
//         <div class="flex-1 p-8">
//             <div class="bg-white p-6 rounded-lg shadow-md">
//                 <div class="text-center mb-4">
//                     <h2 class="text-2xl font-bold mb-8">Tambah Anggota</h2>
//                 </div>

//                 <form class="space-y-4" method="POST" action="/master/anggota/tambahAnggota">
//                     <div>
//                         <label class="block text-gray-700 mb-1">NIP</label>
//                         <select id="nip_anggota" class="w-full p-2 border border-gray-300 rounded" name="nip_anggota" required>
//                             <option value="" disabled selected>Pilih NIP Pegawai</option>
//                             <% if (pegawai) { %>
//                               <% pegawai.forEach(function(pegawai) { %>
//                                 <option value="<%= pegawai.nip %>"><%= pegawai.nip %> - <%= pegawai.nama %></option>
//                               <% }); %>
//                             <% } %>
//                           </select>
//                     </div>
//                     <div>
//                         <label class="block text-gray-700 mb-1">Status Anggota</label>
//                         <select class="w-full p-2 border border-gray-300 rounded mb-4" name="status">
//                             <option value="Aktif">Aktif</option>
//                             <option value="Tidak Aktif">Tidak Aktif</option>
//                         </select>
//                     </div>
//                     <div class="text-center mt-12">
//                         <button type="submit" class="bg-green-700 text-white px-4 py-2 rounded w-full" style="background-color: #5D8736;">Simpan</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     </div>
// </body>
// </html>

// E. UI ubahAnggota.ejs : 
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Ubah Status Anggota</title>
//     <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//     <script>
//         function logout() {
//             if (confirm("Yakin ingin keluar?")) {
//                 fetch('/logout', { method: 'POST' })
//                     .then(response => response.json())
//                     .then(data => {
//                         if (data.success) {
//                             alert("Anda berhasil logout");
//                             window.location.href = "/login";
//                         } else {
//                             alert("Gagal logout, coba lagi.");
//                         }
//                     })
//                     .catch(error => console.error('Logout error:', error));
//             }
//         }

//         function toggleDropdown() {
//             const dropdownMenu = document.getElementById('dropdownMenu');
//             dropdownMenu.classList.toggle('hidden');
//         }
//         </script>
// </head>
// <body class="flex">
//     <!-- Sidebar -->
//     <div id="sidebar" class="w-72 text-white min-h-screen p-4 fixed left-0 top-0 transform transition-transform bg-green-800" style="background-color: #5D8736; z-index: 999;">
//         <div class="flex items-center mb-8">
//             <img src="/images/logo.png" alt="Logo" class="w-16 h-16 mr-7 cursor-pointer" id="logo">
//             <div id="sidebarContent">
//                 <h1 class="text-2xl font-bold">SIKOP</h1>
//                 <p class="text-sm">Sistem Informasi Koperasi</p>
//             </div>
//         </div>
//         <nav>
//             <ul>
//                 <li class="mb-4">
//                     <a href="/dashboardSuperadmin" class="flex items-center block p-6 py-3 hover:bg-green-900 rounded">
//                         <img src="/images/vectordasbor.png" alt="lihat data icon" class="w=5 h-5 ">
//                         <span class="ml-2 text-xl ml-5">Dashboard</span>
//                     </a>
//                 </li>
//                 <li>
//                     <button onclick="toggleDropdown()" class="flex items-center justify-between w-full focus:outline-none">
//                         <div class="flex items-center">
//                             <a href="#" class="flex items-center block p-6 py-3 hover:">
//                                 <img src="/images/lihatdata.png" alt="lihat data icon" class="w=5 h-5 ">
//                                 <span class="ml-2 text-xl ml-5">Data Master</span>
//                             </a>
//                         </div>
//                         <img src="/images/angle-small-down.png" alt="dropdown icon" class="w-6 h-6 transform transition-transform" id="dropdownIcon">
//                     </button>
//                     <ul id="dropdownMenu" class="pl-6 hidden">
//                         <li class="mb-2">
//                             <a href="/master/pegawai" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Pegawai</a>
//                         </li>
//                         <li class="mb-2">
//                             <a href="/master/anggota" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Anggota Koperasi</a>
//                         </li>
//                         <li class="mb-2">
//                             <a href="/master/user" class="block p-3 py-3 text-lg hover:bg-green-900 rounded">o Admin Area</a>
//                         </li>
//                     </ul>
//                 </li>
//             </ul>
//         </nav>
//         <div class="absolute bottom-0 left-0 w-full p-4">
//             <button onclick="logout()" class="flex items-center w-full p-6 py-3 hover:bg-green-900 rounded transition duration-300">
//                 <span class="material-icons">logout</span>
//                 <span class="ml-5 text-xl">Log Out</span>
//             </button>
//         </div>
//     </div>
//     <div class="flex-1 ml-72 bg-gray-100 min-h-screen">
//         <header class="flex justify-between items-center mb-8 bg-white p-4 shadow-md">
//             <div class="flex-1"><h1 class="text-2xl font-bold text-center">Data Anggota Koperasi</h1></div>
//             <div class="flex items-center">
//                 <span class="mr-2">Super Admin</span>
//                 <img src="../../images/profile-user.png" alt="User" class="rounded-full w-10 h-10" />
//             </div>
//         </header>
//         <div class="bg-white p-6 rounded-lg shadow-md">
//             <div class="text-center mb-4">
//                 <h2 class="text-2xl font-bold">Form Ubah Status</h2>
//             </div>
//             <form class="space-y-4" method="POST" action="/master/anggota/ubahStatus">
//                 <input type="hidden" name="id" value="<%= anggota.id %>">
//                 <div>
//                     <label class="block text-gray-700 mb-1">NIP</label>
//                     <input type="text" name="nip_anggota" value="<%= anggota.nip %>" class="w-full p-2 border border-gray-300 rounded bg-gray-100" readonly>
//                 </div>
//                 <div>
//                     <label class="block text-gray-700 mb-1">Nama</label>
//                     <input type="text" name="nama" value="<%= anggota.nama %>" class="w-full p-2 border border-gray-300 rounded bg-gray-100" readonly>
//                 </div>
//                 <div>
//                     <label class="block text-gray-700 mb-1">Status Anggota</label>
//                     <select class="w-full p-2 border border-gray-300 rounded mb-4" name="status">
//                         <option value="Aktif" <%= anggota.status === "Aktif" ? "selected" : "" %>>Aktif</option>
//                         <option value="Tidak Aktif" <%= anggota.status === "Tidak Aktif" ? "selected" : "" %>>Tidak Aktif</option>
//                     </select>
//                 </div>
//                 <div class="text-center mt-12">
//                     <button type="submit" class="bg-green-700 text-white px-4 py-2 rounded w-full">Simpan</button>
//                 </div>
//             </form>
//         </div>
//     </div>
// </body>
// </html>