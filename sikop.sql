-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 31 Jan 2025 pada 07.41
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sikop`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `anggota`
--

CREATE TABLE `anggota` (
  `id` int(11) NOT NULL,
  `nip_anggota` bigint(20) DEFAULT NULL,
  `status` enum('aktif','tidak aktif') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `anggota`
--

INSERT INTO `anggota` (`id`, `nip_anggota`, `status`) VALUES
(1, 197810092005011002, 'aktif'),
(2, 198512102006011003, 'aktif'),
(3, 199003152007011004, 'aktif'),
(4, 198704202008011005, 'aktif'),
(5, 199205252009011006, 'aktif'),
(6, 198809302010011007, 'aktif'),
(7, 199101052011011008, 'aktif'),
(8, 198602152012011009, 'aktif'),
(9, 199308202013011010, 'aktif'),
(10, 198710252014011011, 'aktif'),
(11, 199412302015011012, 'aktif'),
(12, 198503052016011013, 'aktif'),
(13, 199206102017011014, 'aktif'),
(14, 198907152018011015, 'aktif'),
(15, 199310202019011016, 'aktif');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kredit_barang`
--

CREATE TABLE `kredit_barang` (
  `id` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `harga_pokok` decimal(10,2) DEFAULT NULL,
  `jangka_waktu` int(11) DEFAULT NULL,
  `pokok_dp` decimal(10,2) DEFAULT NULL,
  `total_angsuran` decimal(10,2) DEFAULT NULL,
  `pokok` decimal(10,2) DEFAULT NULL,
  `margin` decimal(10,2) DEFAULT NULL,
  `angsuran_ke` int(11) DEFAULT NULL,
  `sisa_piutang` decimal(10,2) DEFAULT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kredit_barang`
--

INSERT INTO `kredit_barang` (`id`, `id_anggota`, `harga_pokok`, `jangka_waktu`, `pokok_dp`, `total_angsuran`, `pokok`, `margin`, `angsuran_ke`, `sisa_piutang`, `tanggal_mulai`, `ket_status`) VALUES
(1, 1, 2000000.00, 6, 500000.00, 275000.00, 250000.00, 25000.00, 1, 1500000.00, '2025-01-30', 'Aktif'),
(2, 2, 3000000.00, 12, 750000.00, 225000.00, 200000.00, 25000.00, 1, 2250000.00, '2025-02-01', 'Aktif'),
(3, 3, 2500000.00, 10, 600000.00, 210000.00, 190000.00, 20000.00, 1, 1900000.00, '2025-02-05', 'Aktif'),
(4, 4, 4000000.00, 12, 1000000.00, 300000.00, 250000.00, 50000.00, 1, 3000000.00, '2025-02-10', 'Aktif'),
(5, 5, 1500000.00, 6, 300000.00, 225000.00, 200000.00, 25000.00, 1, 1200000.00, '2025-02-15', 'Aktif'),
(6, 6, 5000000.00, 24, 1000000.00, 225000.00, 200000.00, 25000.00, 1, 4000000.00, '2025-02-20', 'Aktif'),
(7, 7, 3500000.00, 12, 700000.00, 262500.00, 225000.00, 37500.00, 1, 2800000.00, '2025-02-25', 'Aktif'),
(8, 8, 4500000.00, 18, 900000.00, 225000.00, 200000.00, 25000.00, 1, 3600000.00, '2025-03-01', 'Aktif'),
(9, 9, 2000000.00, 6, 400000.00, 300000.00, 250000.00, 50000.00, 1, 1600000.00, '2025-03-05', 'Aktif'),
(10, 10, 3000000.00, 12, 600000.00, 225000.00, 200000.00, 25000.00, 1, 2400000.00, '2025-03-10', 'Aktif'),
(11, 11, 2500000.00, 10, 500000.00, 225000.00, 200000.00, 25000.00, 1, 2000000.00, '2025-03-15', 'Aktif'),
(12, 12, 4000000.00, 12, 800000.00, 300000.00, 250000.00, 50000.00, 1, 3200000.00, '2025-03-20', 'Aktif'),
(13, 13, 1500000.00, 6, 300000.00, 225000.00, 200000.00, 25000.00, 1, 1200000.00, '2025-03-25', 'Aktif'),
(14, 14, 5000000.00, 24, 1000000.00, 225000.00, 200000.00, 25000.00, 1, 4000000.00, '2025-03-30', 'Aktif'),
(15, 15, 3500000.00, 12, 700000.00, 262500.00, 225000.00, 37500.00, 1, 2800000.00, '2025-04-01', 'Aktif');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kredit_elektronik`
--

CREATE TABLE `kredit_elektronik` (
  `id` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `jumlah_pinjaman` decimal(10,2) DEFAULT NULL,
  `jangka_waktu` int(11) DEFAULT NULL,
  `total_angsuran` decimal(10,2) DEFAULT NULL,
  `pokok` decimal(10,2) DEFAULT NULL,
  `margin` decimal(10,2) DEFAULT NULL,
  `angsuran_ke` int(11) DEFAULT NULL,
  `sisa_piutang` decimal(10,2) DEFAULT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kredit_elektronik`
--

INSERT INTO `kredit_elektronik` (`id`, `id_anggota`, `jumlah_pinjaman`, `jangka_waktu`, `total_angsuran`, `pokok`, `margin`, `angsuran_ke`, `sisa_piutang`, `tanggal_mulai`, `ket_status`) VALUES
(1, 1, 3000000.00, 12, 275000.00, 250000.00, 25000.00, 1, 3000000.00, '2025-01-30', 'Aktif'),
(2, 2, 4000000.00, 12, 350000.00, 300000.00, 50000.00, 1, 4000000.00, '2025-02-01', 'Aktif'),
(3, 3, 2500000.00, 10, 225000.00, 200000.00, 25000.00, 1, 2500000.00, '2025-02-05', 'Aktif'),
(4, 4, 5000000.00, 12, 450000.00, 400000.00, 50000.00, 1, 5000000.00, '2025-02-10', 'Aktif'),
(5, 5, 2000000.00, 6, 200000.00, 175000.00, 25000.00, 1, 2000000.00, '2025-02-15', 'Aktif'),
(6, 6, 6000000.00, 24, 300000.00, 250000.00, 50000.00, 1, 6000000.00, '2025-02-20', 'Aktif'),
(7, 7, 3500000.00, 12, 300000.00, 250000.00, 50000.00, 1, 3500000.00, '2025-02-25', 'Aktif'),
(8, 8, 4500000.00, 18, 275000.00, 225000.00, 50000.00, 1, 4500000.00, '2025-03-01', 'Aktif'),
(9, 9, 3000000.00, 12, 250000.00, 200000.00, 50000.00, 1, 3000000.00, '2025-03-05', 'Aktif'),
(10, 10, 4000000.00, 12, 350000.00, 300000.00, 50000.00, 1, 4000000.00, '2025-03-10', 'Aktif'),
(11, 11, 2500000.00, 10, 225000.00, 200000.00, 25000.00, 1, 2500000.00, '2025-03-15', 'Aktif'),
(12, 12, 5000000.00, 12, 450000.00, 400000.00, 50000.00, 1, 5000000.00, '2025-03-20', 'Aktif'),
(13, 13, 2000000.00, 6, 200000.00, 175000.00, 25000.00, 1, 2000000.00, '2025-03-25', 'Aktif'),
(14, 14, 6000000.00, 24, 300000.00, 250000.00, 50000.00, 1, 6000000.00, '2025-03-30', 'Aktif'),
(15, 15, 3500000.00, 12, 300000.00, 250000.00, 50000.00, 1, 3500000.00, '2025-04-01', 'Aktif');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kredit_motor`
--

CREATE TABLE `kredit_motor` (
  `id` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `jumlah_pinjaman` decimal(10,2) DEFAULT NULL,
  `jangka_waktu` int(11) DEFAULT NULL,
  `total_angsuran` decimal(10,2) DEFAULT NULL,
  `pokok` decimal(10,2) DEFAULT NULL,
  `margin` decimal(10,2) DEFAULT NULL,
  `angsuran_ke` int(11) DEFAULT NULL,
  `sisa_piutang` decimal(10,2) DEFAULT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kredit_motor`
--

INSERT INTO `kredit_motor` (`id`, `id_anggota`, `jumlah_pinjaman`, `jangka_waktu`, `total_angsuran`, `pokok`, `margin`, `angsuran_ke`, `sisa_piutang`, `tanggal_mulai`, `ket_status`) VALUES
(1, 1, 15000000.00, 24, 687500.00, 625000.00, 62500.00, 1, 15000000.00, '2025-01-30', 'Aktif'),
(2, 2, 20000000.00, 36, 625000.00, 555555.56, 69444.44, 1, 20000000.00, '2025-02-01', 'Aktif'),
(3, 3, 18000000.00, 24, 812500.00, 750000.00, 62500.00, 1, 18000000.00, '2025-02-05', 'Aktif'),
(4, 4, 22000000.00, 36, 638888.89, 555555.56, 83333.33, 1, 22000000.00, '2025-02-10', 'Aktif'),
(5, 5, 16000000.00, 24, 750000.00, 666666.67, 83333.33, 1, 16000000.00, '2025-02-15', 'Aktif'),
(6, 6, 25000000.00, 36, 763888.89, 694444.44, 69444.45, 1, 25000000.00, '2025-02-20', 'Aktif'),
(7, 7, 17000000.00, 24, 791666.67, 708333.33, 83333.34, 1, 17000000.00, '2025-02-25', 'Aktif'),
(8, 8, 23000000.00, 36, 666666.67, 583333.33, 83333.34, 1, 23000000.00, '2025-03-01', 'Aktif'),
(9, 9, 19000000.00, 24, 875000.00, 791666.67, 83333.33, 1, 19000000.00, '2025-03-05', 'Aktif'),
(10, 10, 21000000.00, 36, 625000.00, 555555.56, 69444.44, 1, 21000000.00, '2025-03-10', 'Aktif'),
(11, 11, 20000000.00, 36, 625000.00, 555555.56, 69444.44, 1, 20000000.00, '2025-03-15', 'Aktif'),
(12, 12, 24000000.00, 36, 722222.22, 638888.89, 83333.33, 1, 24000000.00, '2025-03-20', 'Aktif'),
(13, 13, 15000000.00, 24, 687500.00, 625000.00, 62500.00, 1, 15000000.00, '2025-03-25', 'Aktif'),
(14, 14, 25000000.00, 36, 763888.89, 694444.44, 69444.45, 1, 25000000.00, '2025-03-30', 'Aktif'),
(15, 15, 17000000.00, 24, 791666.67, 708333.33, 83333.34, 1, 17000000.00, '2025-04-01', 'Aktif');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kredit_umroh`
--

CREATE TABLE `kredit_umroh` (
  `id` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `jumlah_pinjaman` decimal(10,2) DEFAULT NULL,
  `jangka_waktu` int(11) DEFAULT NULL,
  `total_angsuran` decimal(10,2) DEFAULT NULL,
  `pokok` decimal(10,2) DEFAULT NULL,
  `margin` decimal(10,2) DEFAULT NULL,
  `angsuran_ke` int(11) DEFAULT NULL,
  `sisa_piutang` decimal(10,2) DEFAULT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kredit_umroh`
--

INSERT INTO `kredit_umroh` (`id`, `id_anggota`, `jumlah_pinjaman`, `jangka_waktu`, `total_angsuran`, `pokok`, `margin`, `angsuran_ke`, `sisa_piutang`, `tanggal_mulai`, `ket_status`) VALUES
(1, 1, 25000000.00, 36, 763888.89, 694444.44, 69444.45, 1, 25000000.00, '2025-01-30', 'Aktif'),
(2, 2, 30000000.00, 36, 916666.67, 833333.33, 83333.34, 1, 30000000.00, '2025-02-01', 'Aktif'),
(3, 3, 28000000.00, 36, 861111.11, 777777.78, 83333.33, 1, 28000000.00, '2025-02-05', 'Aktif'),
(4, 4, 32000000.00, 36, 972222.22, 888888.89, 83333.33, 1, 32000000.00, '2025-02-10', 'Aktif'),
(5, 5, 26000000.00, 36, 805555.56, 722222.22, 83333.34, 1, 26000000.00, '2025-02-15', 'Aktif'),
(6, 6, 35000000.00, 36, 1055555.56, 972222.22, 83333.34, 1, 35000000.00, '2025-02-20', 'Aktif'),
(7, 7, 27000000.00, 36, 833333.33, 750000.00, 83333.33, 1, 27000000.00, '2025-02-25', 'Aktif'),
(8, 8, 33000000.00, 36, 1000000.00, 916666.67, 83333.33, 1, 33000000.00, '2025-03-01', 'Aktif'),
(9, 9, 29000000.00, 36, 888888.89, 805555.56, 83333.33, 1, 29000000.00, '2025-03-05', 'Aktif'),
(10, 10, 31000000.00, 36, 944444.44, 861111.11, 83333.33, 1, 31000000.00, '2025-03-10', 'Aktif'),
(11, 11, 30000000.00, 36, 916666.67, 833333.33, 83333.34, 1, 30000000.00, '2025-03-15', 'Aktif'),
(12, 12, 34000000.00, 36, 1027777.78, 944444.44, 83333.34, 1, 34000000.00, '2025-03-20', 'Aktif'),
(13, 13, 25000000.00, 36, 763888.89, 694444.44, 69444.45, 1, 25000000.00, '2025-03-25', 'Aktif'),
(14, 14, 35000000.00, 36, 1055555.56, 972222.22, 83333.34, 1, 35000000.00, '2025-03-30', 'Aktif'),
(15, 15, 27000000.00, 36, 833333.33, 750000.00, 83333.33, 1, 27000000.00, '2025-04-01', 'Aktif');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pegawai`
--

CREATE TABLE `pegawai` (
  `nip` bigint(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `wilayah` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pegawai`
--

INSERT INTO `pegawai` (`nip`, `nama`, `wilayah`) VALUES
(197810092005011002, 'AHMAD HIDAYAT S.Psi', 'Sumatra Barat'),
(198503052016011013, 'LUKMAN HAKIM', 'Sumatra Barat'),
(198512102006011003, 'BUDI SANTOSO', 'Sumatra Barat'),
(198602152012011009, 'HENDRA GUNAWAN', 'Sumatra Barat'),
(198704202008011005, 'DEDI PRASETYO', 'Jambi'),
(198710252014011011, 'JOKO SUSILO', 'Sumatra Barat'),
(198809302010011007, 'FARID HIDAYAT', 'Kep. Riau'),
(198907152018011015, 'NURHADI', 'Sumatra Barat'),
(199003152007011004, 'CITRA DEWI', 'Riau'),
(199101052011011008, 'GITA ANANDA', 'Jambi'),
(199205252009011006, 'ERNA WATI', 'Jambi'),
(199206102017011014, 'MIRA WATI', 'Riau'),
(199308202013011010, 'IRMA YULIANA', 'Jambi'),
(199310202019011016, 'OKTAVIA DEWI', 'Kep. Riau'),
(199412302015011012, 'KARTIKA SARI', 'Kep. Riau');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` int(11) NOT NULL,
  `id_kredit_barang` int(11) DEFAULT NULL,
  `id_kredit_motor` int(11) DEFAULT NULL,
  `id_kredit_elektronik` int(11) DEFAULT NULL,
  `id_kredit_umroh` int(11) DEFAULT NULL,
  `id_pinjaman` int(11) DEFAULT NULL,
  `tanggal_bayar` date DEFAULT NULL,
  `angsuran_ke` int(11) DEFAULT NULL,
  `jumlah_bayar` decimal(10,2) NOT NULL,
  `ket` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pembayaran`
--

INSERT INTO `pembayaran` (`id`, `id_kredit_barang`, `id_kredit_motor`, `id_kredit_elektronik`, `id_kredit_umroh`, `id_pinjaman`, `tanggal_bayar`, `angsuran_ke`, `jumlah_bayar`, `ket`) VALUES
(1, 1, NULL, NULL, NULL, NULL, '2025-01-30', 1, 275000.00, 'Pembayaran Angsuran Kredit Barang'),
(2, 2, NULL, NULL, NULL, NULL, '2025-02-01', 1, 225000.00, 'Pembayaran Angsuran Kredit Barang'),
(3, 3, NULL, NULL, NULL, NULL, '2025-02-05', 1, 210000.00, 'Pembayaran Angsuran Kredit Barang'),
(4, 4, NULL, NULL, NULL, NULL, '2025-02-10', 1, 300000.00, 'Pembayaran Angsuran Kredit Barang'),
(5, 5, NULL, NULL, NULL, NULL, '2025-02-15', 1, 225000.00, 'Pembayaran Angsuran Kredit Barang'),
(6, 6, NULL, NULL, NULL, NULL, '2025-02-20', 1, 225000.00, 'Pembayaran Angsuran Kredit Barang'),
(7, 7, NULL, NULL, NULL, NULL, '2025-02-25', 1, 262500.00, 'Pembayaran Angsuran Kredit Barang'),
(8, 8, NULL, NULL, NULL, NULL, '2025-03-01', 1, 225000.00, 'Pembayaran Angsuran Kredit Barang'),
(9, 9, NULL, NULL, NULL, NULL, '2025-03-05', 1, 300000.00, 'Pembayaran Angsuran Kredit Barang'),
(10, 10, NULL, NULL, NULL, NULL, '2025-03-10', 1, 225000.00, 'Pembayaran Angsuran Kredit Barang'),
(11, 11, NULL, NULL, NULL, NULL, '2025-03-15', 1, 225000.00, 'Pembayaran Angsuran Kredit Barang'),
(12, 12, NULL, NULL, NULL, NULL, '2025-03-20', 1, 300000.00, 'Pembayaran Angsuran Kredit Barang'),
(13, 13, NULL, NULL, NULL, NULL, '2025-03-25', 1, 225000.00, 'Pembayaran Angsuran Kredit Barang'),
(14, 14, NULL, NULL, NULL, NULL, '2025-03-30', 1, 225000.00, 'Pembayaran Angsuran Kredit Barang'),
(15, 15, NULL, NULL, NULL, NULL, '2025-04-01', 1, 262500.00, 'Pembayaran Angsuran Kredit Barang');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pinjaman`
--

CREATE TABLE `pinjaman` (
  `id` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `kategori` enum('jangka panjang','jangka pendek') DEFAULT NULL,
  `jumlah_pinjaman` decimal(10,2) DEFAULT NULL,
  `jangka_waktu` int(11) DEFAULT NULL,
  `margin_persen` decimal(5,2) DEFAULT NULL,
  `angsuran_pokok` decimal(10,2) DEFAULT NULL,
  `margin_per_bulan` decimal(10,2) DEFAULT NULL,
  `total_angsuran` decimal(10,2) DEFAULT NULL,
  `sisa_piutang` decimal(10,2) DEFAULT NULL,
  `tanggal_perjanjian` date DEFAULT NULL,
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pinjaman`
--

INSERT INTO `pinjaman` (`id`, `id_anggota`, `kategori`, `jumlah_pinjaman`, `jangka_waktu`, `margin_persen`, `angsuran_pokok`, `margin_per_bulan`, `total_angsuran`, `sisa_piutang`, `tanggal_perjanjian`, `ket_status`) VALUES
(1, 1, 'jangka panjang', 5000000.00, 12, 1.50, 416666.67, 75000.00, 491666.67, 5000000.00, '2025-01-30', 'Aktif'),
(2, 2, 'jangka pendek', 6000000.00, 6, 2.00, 1000000.00, 120000.00, 1120000.00, 6000000.00, '2025-02-01', 'Aktif'),
(3, 3, 'jangka panjang', 7000000.00, 12, 1.75, 583333.33, 102083.33, 685416.67, 7000000.00, '2025-02-05', 'Aktif'),
(4, 4, 'jangka pendek', 8000000.00, 6, 2.25, 1333333.33, 150000.00, 1483333.33, 8000000.00, '2025-02-10', 'Aktif'),
(5, 5, 'jangka panjang', 9000000.00, 12, 1.50, 750000.00, 112500.00, 862500.00, 9000000.00, '2025-02-15', 'Aktif'),
(6, 6, 'jangka pendek', 10000000.00, 6, 2.00, 1666666.67, 200000.00, 1866666.67, 10000000.00, '2025-02-20', 'Aktif'),
(7, 7, 'jangka panjang', 11000000.00, 12, 1.75, 916666.67, 160416.67, 1077083.33, 11000000.00, '2025-02-25', 'Aktif'),
(8, 8, 'jangka pendek', 12000000.00, 6, 2.25, 2000000.00, 225000.00, 2225000.00, 12000000.00, '2025-03-01', 'Aktif'),
(9, 9, 'jangka panjang', 13000000.00, 12, 1.50, 1083333.33, 162500.00, 1245833.33, 13000000.00, '2025-03-05', 'Aktif'),
(10, 10, 'jangka pendek', 14000000.00, 6, 2.00, 2333333.33, 280000.00, 2613333.33, 14000000.00, '2025-03-10', 'Aktif'),
(11, 11, 'jangka panjang', 15000000.00, 12, 1.75, 1250000.00, 218750.00, 1468750.00, 15000000.00, '2025-03-15', 'Aktif'),
(12, 12, 'jangka pendek', 16000000.00, 6, 2.25, 2666666.67, 300000.00, 2966666.67, 16000000.00, '2025-03-20', 'Aktif'),
(13, 13, 'jangka panjang', 17000000.00, 12, 1.50, 1416666.67, 212500.00, 1629166.67, 17000000.00, '2025-03-25', 'Aktif'),
(14, 14, 'jangka pendek', 18000000.00, 6, 2.00, 3000000.00, 360000.00, 3360000.00, 18000000.00, '2025-03-30', 'Aktif'),
(15, 15, 'jangka panjang', 19000000.00, 12, 1.75, 1583333.33, 277083.33, 1860416.67, 19000000.00, '2025-04-01', 'Aktif');

-- --------------------------------------------------------

--
-- Struktur dari tabel `simpanan`
--

CREATE TABLE `simpanan` (
  `id` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `tanggal` date DEFAULT NULL,
  `simpanan_wajib` decimal(10,2) DEFAULT NULL,
  `simpanan_pokok` decimal(10,2) DEFAULT NULL,
  `simpanan_sukarela` decimal(10,2) DEFAULT NULL,
  `metode_bayar` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `simpanan`
--

INSERT INTO `simpanan` (`id`, `id_anggota`, `tanggal`, `simpanan_wajib`, `simpanan_pokok`, `simpanan_sukarela`, `metode_bayar`) VALUES
(1, 1, '2025-01-30', 100000.00, 500000.00, 250000.00, 'Transfer'),
(2, 2, '2025-02-01', 150000.00, 600000.00, 300000.00, 'Tunai'),
(3, 3, '2025-02-05', 200000.00, 700000.00, 350000.00, 'Transfer'),
(4, 4, '2025-02-10', 250000.00, 800000.00, 400000.00, 'Tunai'),
(5, 5, '2025-02-15', 300000.00, 900000.00, 450000.00, 'Transfer'),
(6, 6, '2025-02-20', 350000.00, 1000000.00, 500000.00, 'Tunai'),
(7, 7, '2025-02-25', 400000.00, 1100000.00, 550000.00, 'Transfer'),
(8, 8, '2025-03-01', 450000.00, 1200000.00, 600000.00, 'Tunai'),
(9, 9, '2025-03-05', 500000.00, 1300000.00, 650000.00, 'Transfer'),
(10, 10, '2025-03-10', 550000.00, 1400000.00, 700000.00, 'Tunai'),
(11, 11, '2025-03-15', 600000.00, 1500000.00, 750000.00, 'Transfer'),
(12, 12, '2025-03-20', 650000.00, 1600000.00, 800000.00, 'Tunai'),
(13, 13, '2025-03-25', 700000.00, 1700000.00, 850000.00, 'Transfer'),
(14, 14, '2025-03-30', 750000.00, 1800000.00, 900000.00, 'Tunai'),
(15, 15, '2025-04-01', 800000.00, 1900000.00, 950000.00, 'Transfer');

-- --------------------------------------------------------

--
-- Table structure for table `simpanan_history`
--

CREATE TABLE `simpanan_history` (
  `id` int(11) NOT NULL,
  `simpanan_id` int(11) NOT NULL,
  `id_anggota` int(11) NOT NULL,
  `action_type` enum('buat','edit','tambah','delete') NOT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_data`)),
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_data`)),
  `changed_by` varchar(100) DEFAULT NULL,
  `action_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `simpanan_history`
--

INSERT INTO `simpanan_history` (`id`, `simpanan_id`, `id_anggota`, `action_type`, `old_data`, `new_data`, `changed_by`, `action_date`) VALUES
(43, 20, 1, 'buat', NULL, '{\"id\":20,\"id_anggota\":\"1\",\"tanggal\":\"2025-02-04\",\"simpanan_wajib\":100000,\"simpanan_pokok\":100000,\"simpanan_sukarela\":0,\"metode_bayar\":\"cash\"}', 'system', '2025-02-04 04:30:58');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_user` enum('Super Admin','Pimpinan','Admin Keuangan') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role_user`) VALUES
(1, 'Admin IT', 'superadmin@gmail.com', 'superadmin', 'Super Admin'),
(2, 'Pimpinan Koperasi', 'adminpimpinan@gmail.com', 'adminp', 'Pimpinan'),
(3, 'Administrasi & Keuangan', 'adminkeuangan@gmail.com', 'admink', 'Admin Keuangan');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `anggota`
--
ALTER TABLE `anggota`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_ibfk_1` (`nip_anggota`);

--
-- Indeks untuk tabel `kredit_barang`
--
ALTER TABLE `kredit_barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kredit_barang_ibfk_1` (`id_anggota`);

--
-- Indeks untuk tabel `kredit_elektronik`
--
ALTER TABLE `kredit_elektronik`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kredit_elektronik_ibfk_1` (`id_anggota`);

--
-- Indeks untuk tabel `kredit_motor`
--
ALTER TABLE `kredit_motor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kredit_motor_ibfk_1` (`id_anggota`);

--
-- Indeks untuk tabel `kredit_umroh`
--
ALTER TABLE `kredit_umroh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kredit_umroh_ibfk_1` (`id_anggota`);

--
-- Indeks untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`nip`);

--
-- Indeks untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pembayaran_ibfk_1` (`id_kredit_barang`),
  ADD KEY `pembayaran_ibfk_2` (`id_kredit_motor`),
  ADD KEY `pembayaran_ibfk_3` (`id_kredit_elektronik`),
  ADD KEY `pembayaran_ibfk_4` (`id_kredit_umroh`),
  ADD KEY `pembayaran_ibfk_5` (`id_pinjaman`);

--
-- Indeks untuk tabel `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pinjaman_ibfk_1` (`id_anggota`);

--
-- Indeks untuk tabel `simpanan`
--
ALTER TABLE `simpanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `simpanan_ibfk_1` (`id_anggota`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `anggota`
--
ALTER TABLE `anggota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `kredit_barang`
--
ALTER TABLE `kredit_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `kredit_elektronik`
--
ALTER TABLE `kredit_elektronik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `kredit_motor`
--
ALTER TABLE `kredit_motor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `kredit_umroh`
--
ALTER TABLE `kredit_umroh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `pinjaman`
--
ALTER TABLE `pinjaman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `simpanan`
--
ALTER TABLE `simpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `anggota`
--
ALTER TABLE `anggota`
  ADD CONSTRAINT `anggota_ibfk_1` FOREIGN KEY (`nip_anggota`) REFERENCES `pegawai` (`nip`);

--
-- Ketidakleluasaan untuk tabel `kredit_barang`
--
ALTER TABLE `kredit_barang`
  ADD CONSTRAINT `kredit_barang_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Ketidakleluasaan untuk tabel `kredit_elektronik`
--
ALTER TABLE `kredit_elektronik`
  ADD CONSTRAINT `kredit_elektronik_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Ketidakleluasaan untuk tabel `kredit_motor`
--
ALTER TABLE `kredit_motor`
  ADD CONSTRAINT `kredit_motor_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Ketidakleluasaan untuk tabel `kredit_umroh`
--
ALTER TABLE `kredit_umroh`
  ADD CONSTRAINT `kredit_umroh_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Ketidakleluasaan untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_kredit_barang`) REFERENCES `kredit_barang` (`id`),
  ADD CONSTRAINT `pembayaran_ibfk_2` FOREIGN KEY (`id_kredit_motor`) REFERENCES `kredit_motor` (`id`),
  ADD CONSTRAINT `pembayaran_ibfk_3` FOREIGN KEY (`id_kredit_elektronik`) REFERENCES `kredit_elektronik` (`id`),
  ADD CONSTRAINT `pembayaran_ibfk_4` FOREIGN KEY (`id_kredit_umroh`) REFERENCES `kredit_umroh` (`id`),
  ADD CONSTRAINT `pembayaran_ibfk_5` FOREIGN KEY (`id_pinjaman`) REFERENCES `pinjaman` (`id`);

--
-- Ketidakleluasaan untuk tabel `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD CONSTRAINT `pinjaman_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Ketidakleluasaan untuk tabel `simpanan`
--
ALTER TABLE `simpanan`
  ADD CONSTRAINT `simpanan_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
