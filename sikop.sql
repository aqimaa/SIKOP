-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 11, 2025 at 06:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

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
-- Table structure for table `anggota`
--

CREATE TABLE `anggota` (
  `id` int(11) NOT NULL,
  `nip_anggota` varchar(30) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `anggota`
--

INSERT INTO `anggota` (`id`, `nip_anggota`, `status`) VALUES
(1, '197810092005011002', 'Aktif'),
(2, '198512102006011003', 'Aktif'),
(3, '199003152007011004', 'Aktif'),
(4, '198704202008011005', 'Aktif'),
(5, '199205252009011006', 'Aktif'),
(6, '198809302010011007', 'Aktif'),
(7, '199101052011011008', 'Aktif'),
(8, '198602152012011009', 'Aktif'),
(9, '199308202013011010', 'Aktif'),
(10, '198710252014011011', 'Aktif'),
(11, '199412302015011012', 'Aktif'),
(12, '198503052016011013', 'Aktif'),
(13, '199206102017011014', 'Aktif'),
(14, '198907152018011015', 'Aktif'),
(15, '199310202019011016', 'Aktif');

-- --------------------------------------------------------

--
-- Table structure for table `kredit_barang`
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
-- Dumping data for table `kredit_barang`
--

INSERT INTO `kredit_barang` (`id`, `id_anggota`, `harga_pokok`, `jangka_waktu`, `pokok_dp`, `total_angsuran`, `pokok`, `margin`, `angsuran_ke`, `sisa_piutang`, `tanggal_mulai`, `ket_status`) VALUES
(1, 1, 2000000.00, 6, 500000.00, 275000.00, 250000.00, 25000.00, 1, 1500000.00, '2025-01-30', 'Lunas'),
(2, 2, 3000000.00, 12, 750000.00, 225000.00, 200000.00, 25000.00, 1, 2250000.00, '2025-02-01', 'Lunas'),
(3, 3, 2500000.00, 10, 600000.00, 210000.00, 190000.00, 20000.00, 1, 1900000.00, '2025-02-05', 'Lunas'),
(4, 4, 4000000.00, 12, 1000000.00, 300000.00, 250000.00, 50000.00, 1, 3000000.00, '2025-02-10', 'Lunas'),
(5, 5, 1500000.00, 6, 300000.00, 225000.00, 200000.00, 25000.00, 1, 1200000.00, '2025-02-15', 'Lunas'),
(6, 6, 5000000.00, 24, 1000000.00, 225000.00, 200000.00, 25000.00, 1, 4000000.00, '2025-02-20', 'Lunas'),
(7, 7, 3500000.00, 12, 700000.00, 262500.00, 225000.00, 37500.00, 1, 2800000.00, '2025-02-25', 'Lunas'),
(8, 8, 4500000.00, 18, 900000.00, 225000.00, 200000.00, 25000.00, 1, 3600000.00, '2025-03-01', 'Lunas'),
(9, 9, 2000000.00, 6, 400000.00, 300000.00, 250000.00, 50000.00, 1, 1600000.00, '2025-03-05', 'Lunas'),
(10, 10, 3000000.00, 12, 600000.00, 225000.00, 200000.00, 25000.00, 1, 2400000.00, '2025-03-10', 'Lunas'),
(11, 11, 2500000.00, 10, 500000.00, 225000.00, 200000.00, 25000.00, 1, 2000000.00, '2025-03-15', 'Lunas'),
(12, 12, 4000000.00, 12, 800000.00, 300000.00, 250000.00, 50000.00, 1, 3200000.00, '2025-03-20', 'Lunas'),
(13, 13, 1500000.00, 6, 300000.00, 225000.00, 200000.00, 25000.00, 1, 1200000.00, '2025-03-25', 'Lunas'),
(14, 14, 5000000.00, 24, 1000000.00, 225000.00, 200000.00, 25000.00, 1, 4000000.00, '2025-03-30', 'Lunas'),
(15, 15, 3500000.00, 12, 700000.00, 262500.00, 225000.00, 37500.00, 1, 2800000.00, '2025-04-01', 'Lunas');

-- --------------------------------------------------------

--
-- Table structure for table `kredit_elektronik`
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
  `ket_status` varchar(100) DEFAULT NULL,
  `margin_persen` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kredit_elektronik`
--

INSERT INTO `kredit_elektronik` (`id`, `id_anggota`, `jumlah_pinjaman`, `jangka_waktu`, `total_angsuran`, `pokok`, `margin`, `angsuran_ke`, `sisa_piutang`, `tanggal_mulai`, `ket_status`, `margin_persen`) VALUES
(1, 1, 3000000.00, 12, 275000.00, 250000.00, 25000.00, 1, 3000000.00, '2025-01-30', 'Lunas', 2.00),
(2, 2, 4000000.00, 12, 350000.00, 300000.00, 50000.00, 1, 4000000.00, '2025-02-01', 'Lunas', 2.00),
(3, 3, 2500000.00, 10, 225000.00, 200000.00, 25000.00, 1, 2500000.00, '2025-02-05', 'Lunas', 2.00),
(4, 4, 5000000.00, 12, 450000.00, 400000.00, 50000.00, 1, 5000000.00, '2025-02-10', 'Lunas', 2.00),
(5, 5, 2000000.00, 6, 200000.00, 175000.00, 25000.00, 1, 2000000.00, '2025-02-15', 'Lunas', 2.00),
(6, 6, 6000000.00, 24, 300000.00, 250000.00, 50000.00, 1, 6000000.00, '2025-02-20', 'Lunas', 2.00),
(7, 7, 3500000.00, 12, 300000.00, 250000.00, 50000.00, 1, 3500000.00, '2025-02-25', 'Lunas', 2.00),
(8, 8, 4500000.00, 18, 275000.00, 225000.00, 50000.00, 1, 4500000.00, '2025-03-01', 'Lunas', 2.00),
(9, 9, 3000000.00, 12, 250000.00, 200000.00, 50000.00, 1, 3000000.00, '2025-03-05', 'Lunas', 2.00),
(10, 10, 4000000.00, 12, 350000.00, 300000.00, 50000.00, 1, 4000000.00, '2025-03-10', 'Lunas', 2.00),
(11, 11, 2500000.00, 10, 225000.00, 200000.00, 25000.00, 1, 2500000.00, '2025-03-15', 'Lunas', 2.00),
(12, 12, 5000000.00, 12, 450000.00, 400000.00, 50000.00, 1, 5000000.00, '2025-03-20', 'Lunas', 2.00),
(13, 13, 2000000.00, 6, 200000.00, 175000.00, 25000.00, 1, 2000000.00, '2025-03-25', 'Lunas', 2.00),
(14, 14, 6000000.00, 24, 300000.00, 250000.00, 50000.00, 1, 6000000.00, '2025-03-30', 'Lunas', 2.00),
(15, 15, 3500000.00, 12, 300000.00, 250000.00, 50000.00, 1, 3500000.00, '2025-04-01', 'Lunas', 2.00);

-- --------------------------------------------------------

--
-- Table structure for table `kredit_motor`
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
  `ket_status` varchar(100) DEFAULT NULL,
  `margin_persen` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kredit_motor`
--

INSERT INTO `kredit_motor` (`id`, `id_anggota`, `jumlah_pinjaman`, `jangka_waktu`, `total_angsuran`, `pokok`, `margin`, `angsuran_ke`, `sisa_piutang`, `tanggal_mulai`, `ket_status`, `margin_persen`) VALUES
(1, 1, 15000000.00, 24, 687500.00, 625000.00, 62500.00, 1, 15000000.00, '2025-01-30', 'Lunas', 1.00),
(2, 2, 20000000.00, 36, 625000.00, 555555.56, 69444.44, 1, 20000000.00, '2025-02-01', 'Lunas', 1.00),
(3, 3, 18000000.00, 24, 812500.00, 750000.00, 62500.00, 1, 18000000.00, '2025-02-05', 'Lunas', 2.00),
(4, 4, 22000000.00, 36, 638888.89, 555555.56, 83333.33, 1, 22000000.00, '2025-02-10', 'Lunas', 1.25),
(5, 5, 16000000.00, 24, 750000.00, 666666.67, 83333.33, 1, 16000000.00, '2025-02-15', 'Lunas', 2.00),
(6, 6, 25000000.00, 36, 763888.89, 694444.44, 69444.45, 1, 25000000.00, '2025-02-20', 'Lunas', 1.20),
(7, 7, 17000000.00, 24, 791666.67, 708333.33, 83333.34, 1, 17000000.00, '2025-02-25', 'Lunas', 1.00),
(8, 8, 23000000.00, 36, 666666.67, 583333.33, 83333.34, 1, 23000000.00, '2025-03-01', 'Lunas', 2.00),
(9, 9, 19000000.00, 24, 875000.00, 791666.67, 83333.33, 1, 19000000.00, '2025-03-05', 'Lunas', 1.00),
(10, 10, 21000000.00, 36, 625000.00, 555555.56, 69444.44, 1, 21000000.00, '2025-03-10', 'Lunas', 1.00),
(11, 11, 20000000.00, 36, 625000.00, 555555.56, 69444.44, 1, 20000000.00, '2025-03-15', 'Lunas', 2.00),
(12, 12, 24000000.00, 36, 722222.22, 638888.89, 83333.33, 1, 24000000.00, '2025-03-20', 'Lunas', 1.00),
(13, 13, 15000000.00, 24, 687500.00, 625000.00, 62500.00, 1, 15000000.00, '2025-03-25', 'Lunas', 1.00),
(14, 14, 25000000.00, 36, 763888.89, 694444.44, 69444.45, 1, 25000000.00, '2025-03-30', 'Lunas', 2.00),
(15, 15, 17000000.00, 24, 791666.67, 708333.33, 83333.34, 1, 17000000.00, '2025-04-01', 'Lunas', 1.00),
(16, 15, 17000000.00, 24, 791666.67, 708333.33, 83333.34, 1, 17000000.00, '2025-04-01', 'Lunas', 1.00);

-- --------------------------------------------------------

--
-- Table structure for table `kredit_umroh`
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
  `ket_status` varchar(100) DEFAULT NULL,
  `margin_persen` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kredit_umroh`
--

INSERT INTO `kredit_umroh` (`id`, `id_anggota`, `jumlah_pinjaman`, `jangka_waktu`, `total_angsuran`, `pokok`, `margin`, `angsuran_ke`, `sisa_piutang`, `tanggal_mulai`, `ket_status`, `margin_persen`) VALUES
(1, 1, 25000000.00, 36, 763888.89, 694444.44, 69444.45, 1, 25000000.00, '2025-01-30', 'Lunas', 2.00),
(2, 2, 30000000.00, 36, 916666.67, 833333.33, 83333.34, 1, 30000000.00, '2025-02-01', 'Lunas', 2.00),
(3, 3, 28000000.00, 36, 861111.11, 777777.78, 83333.33, 1, 28000000.00, '2025-02-05', 'Lunas', 2.00),
(4, 4, 32000000.00, 36, 972222.22, 888888.89, 83333.33, 1, 32000000.00, '2025-02-10', 'Lunas', 2.00),
(5, 5, 26000000.00, 36, 805555.56, 722222.22, 83333.34, 1, 26000000.00, '2025-02-15', 'Lunas', 1.00),
(6, 6, 35000000.00, 36, 1055555.56, 972222.22, 83333.34, 1, 35000000.00, '2025-02-20', 'Lunas', 2.00),
(7, 7, 27000000.00, 36, 833333.33, 750000.00, 83333.33, 1, 27000000.00, '2025-02-25', 'Lunas', 1.00),
(8, 8, 33000000.00, 36, 1000000.00, 916666.67, 83333.33, 1, 33000000.00, '2025-03-01', 'Lunas', 1.00),
(9, 9, 29000000.00, 36, 888888.89, 805555.56, 83333.33, 1, 29000000.00, '2025-03-05', 'Lunas', 1.00),
(10, 10, 31000000.00, 36, 944444.44, 861111.11, 83333.33, 1, 31000000.00, '2025-03-10', 'Lunas', 1.00),
(11, 11, 30000000.00, 36, 916666.67, 833333.33, 83333.34, 1, 30000000.00, '2025-03-15', 'Lunas', 1.00),
(12, 12, 34000000.00, 36, 1027777.78, 944444.44, 83333.34, 1, 34000000.00, '2025-03-20', 'Lunas', 1.00),
(13, 13, 25000000.00, 36, 763888.89, 694444.44, 69444.45, 1, 25000000.00, '2025-03-25', 'Lunas', 1.00),
(14, 14, 35000000.00, 36, 1055555.56, 972222.22, 83333.34, 1, 35000000.00, '2025-03-30', 'Lunas', 2.00),
(15, 15, 27000000.00, 36, 833333.33, 750000.00, 83333.33, 1, 27000000.00, '2025-04-01', 'Lunas', 2.00);

-- --------------------------------------------------------

--
-- Table structure for table `pegawai`
--

CREATE TABLE `pegawai` (
  `nip` varchar(30) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `wilayah` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pegawai`
--

INSERT INTO `pegawai` (`nip`, `nama`, `wilayah`) VALUES
('197810092005011002', 'AHMAD HIDAYAT S.Psi', 'Sumatra Barat'),
('198503052016011013', 'LUKMAN HAKIM', 'Sumatra Barat'),
('198512102006011003', 'BUDI SANTOSO', 'Sumatra Barat'),
('198602152012011009', 'HENDRA GUNAWAN', 'Sumatra Barat'),
('198704202008011005', 'DEDI PRASETYO', 'Jambi'),
('198710252014011011', 'JOKO SUSILO', 'Sumatra Barat'),
('198809302010011007', 'FARID HIDAYAT', 'Kep. Riau'),
('198907152018011015', 'NURHADI', 'Sumatra Barat'),
('199003152007011004', 'CITRA DEWI', 'Riau'),
('199101052011011008', 'GITA ANANDA', 'Jambi'),
('199205252009011006', 'ERNA WATI', 'Jambi'),
('199206102017011014', 'MIRA WATI', 'Riau'),
('199308202013011010', 'IRMA YULIANA', 'Jambi'),
('199310202019011016', 'OKTAVIA DEWI', 'Kep. Riau'),
('199412302015011012', 'KARTIKA SARI', 'Kep. Riau');

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
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
-- Dumping data for table `pembayaran`
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
(15, 15, NULL, NULL, NULL, NULL, '2025-04-01', 1, 262500.00, 'Pembayaran Angsuran Kredit Barang'),
(38, NULL, NULL, NULL, NULL, 43, '2025-01-31', 1, 1.00, 'belum lunas'),
(39, NULL, NULL, NULL, NULL, 43, '2025-01-31', 1, 1.00, 'belum lunas'),
(40, NULL, NULL, NULL, NULL, 43, '2025-01-31', 1, 1.00, 'belum lunas'),
(41, NULL, NULL, NULL, NULL, 43, '2025-02-01', 1, 1413333.33, ''),
(42, NULL, NULL, NULL, NULL, 43, '2025-02-02', 2, 1.00, 'belum lunas'),
(43, NULL, NULL, NULL, NULL, 43, '2025-02-02', 2, 1413333.33, 'belum'),
(44, NULL, NULL, NULL, NULL, 43, '2025-02-03', 3, 1413333.33, '-'),
(45, NULL, NULL, NULL, NULL, 43, '2025-02-04', 4, 1413333.33, ''),
(46, NULL, NULL, NULL, NULL, 43, '2025-02-05', 5, 1413333.33, ''),
(47, NULL, NULL, NULL, NULL, 43, '2025-02-09', 6, 1413333.33, 'LUNAS'),
(48, NULL, NULL, NULL, NULL, 50, '2025-02-10', 1, 948600.23, 'langsung semua');

-- --------------------------------------------------------

--
-- Table structure for table `pinjaman`
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
  `ket_status` varchar(100) DEFAULT 'Belum Lunas',
  `angsuran_ke` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pinjaman`
--

INSERT INTO `pinjaman` (`id`, `id_anggota`, `kategori`, `jumlah_pinjaman`, `jangka_waktu`, `margin_persen`, `angsuran_pokok`, `margin_per_bulan`, `total_angsuran`, `sisa_piutang`, `tanggal_perjanjian`, `ket_status`, `angsuran_ke`) VALUES
(42, 8, 'jangka panjang', 24000000.00, 24, 1.00, 1000000.00, 240000.00, 1240000.00, 29760000.00, '2025-01-19', 'Belum Lunas', 0),
(43, 6, 'jangka pendek', 8000000.00, 6, 1.00, 1333333.33, 80000.00, 1413333.33, 0.00, '2025-01-28', 'Lunas', 6),
(44, 1, 'jangka panjang', 15000000.00, 18, 1.00, 833333.33, 150000.00, 983333.33, 17699999.94, '2025-01-08', 'Belum Lunas', 0),
(45, 11, 'jangka panjang', 750000.00, 3, 1.00, 250000.00, 7500.00, 257500.00, 772500.00, '2025-02-07', 'Belum Lunas', 0),
(47, 4, 'jangka pendek', 870000.00, 2, 1.25, 435000.00, 10875.00, 445875.00, 891750.00, '2025-02-08', 'Belum Lunas', 0),
(48, 7, 'jangka panjang', 15750000.00, 20, 2.50, 787500.00, 393750.00, 1181250.00, 23625000.00, '2025-01-09', 'Belum Lunas', 0),
(49, 14, 'jangka pendek', 8000000.00, 6, 1.25, 1333333.33, 100000.00, 1433333.33, 8599999.98, '2025-01-02', 'Belum Lunas', 0),
(50, 2, 'jangka pendek', 765000.23, 12, 2.23, 63750.46, 15300.12, 79050.32, 0.00, '2025-02-11', 'Lunas', 1),
(51, 3, 'jangka pendek', 2000000.00, 6, 2.00, 333333.33, 40000.00, 373333.33, 2239999.98, '2025-01-31', 'Belum Lunas', 0);

-- --------------------------------------------------------

--
-- Table structure for table `simpanan`
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
-- Dumping data for table `simpanan`
--

INSERT INTO `simpanan` (`id`, `id_anggota`, `tanggal`, `simpanan_wajib`, `simpanan_pokok`, `simpanan_sukarela`, `metode_bayar`) VALUES
(1, 1, '2025-01-30', 100000.00, 500001.00, 2500000.00, ''),
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
(15, 15, '2025-04-01', 800000.00, 1900000.00, 950000.00, 'Transfer'),
(16, 1, '2025-02-10', 150000.00, 100000.00, 0.00, 'transfer');

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
(0, 1, 1, 'edit', '{\"id\":1,\"id_anggota\":1,\"tanggal\":\"2025-01-29T17:00:00.000Z\",\"simpanan_wajib\":100000,\"simpanan_pokok\":500000,\"simpanan_sukarela\":250000,\"metode_bayar\":\"Transfer\"}', '{\"simpanan_wajib\":100000,\"simpanan_pokok\":500001,\"simpanan_sukarela\":2500000,\"metode_bayar\":\"\"}', 'system', '2025-02-10 02:21:20'),
(0, 16, 1, 'buat', NULL, '{\"id\":16,\"id_anggota\":\"1\",\"tanggal\":\"2025-02-10\",\"simpanan_wajib\":150000,\"simpanan_pokok\":100000,\"simpanan_sukarela\":0,\"metode_bayar\":\"transfer\"}', 'system', '2025-02-10 08:01:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_user` enum('Super Admin','Pimpinan','Admin Keuangan') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role_user`) VALUES
(1, 'Admin IT', 'superadmin@gmail.com', 'super', 'Super Admin'),
(2, 'Pimpinan Koperasi', 'adminpimpinan@gmail.com', 'adminp', 'Pimpinan'),
(3, 'Administrasi & Keuangan', 'adminkeuangan@gmail.com', 'admink', 'Admin Keuangan');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anggota`
--
ALTER TABLE `anggota`
  ADD PRIMARY KEY (`id`),
  ADD KEY `anggota_ibfk_1` (`nip_anggota`);

--
-- Indexes for table `kredit_barang`
--
ALTER TABLE `kredit_barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kredit_barang_ibfk_1` (`id_anggota`);

--
-- Indexes for table `kredit_elektronik`
--
ALTER TABLE `kredit_elektronik`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kredit_elektronik_ibfk_1` (`id_anggota`);

--
-- Indexes for table `kredit_motor`
--
ALTER TABLE `kredit_motor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kredit_motor_ibfk_1` (`id_anggota`);

--
-- Indexes for table `kredit_umroh`
--
ALTER TABLE `kredit_umroh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kredit_umroh_ibfk_1` (`id_anggota`);

--
-- Indexes for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`nip`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pembayaran_ibfk_1` (`id_kredit_barang`),
  ADD KEY `pembayaran_ibfk_2` (`id_kredit_motor`),
  ADD KEY `pembayaran_ibfk_3` (`id_kredit_elektronik`),
  ADD KEY `pembayaran_ibfk_4` (`id_kredit_umroh`),
  ADD KEY `pembayaran_ibfk_5` (`id_pinjaman`);

--
-- Indexes for table `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pinjaman_ibfk_1` (`id_anggota`);

--
-- Indexes for table `simpanan`
--
ALTER TABLE `simpanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `simpanan_ibfk_1` (`id_anggota`);

--
-- Indexes for table `simpanan_history`
--
ALTER TABLE `simpanan_history`
  ADD KEY `fk_simpanan` (`simpanan_id`),
  ADD KEY `fk_anggota_simpanan_history` (`id_anggota`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anggota`
--
ALTER TABLE `anggota`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `kredit_barang`
--
ALTER TABLE `kredit_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `kredit_elektronik`
--
ALTER TABLE `kredit_elektronik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `kredit_motor`
--
ALTER TABLE `kredit_motor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `kredit_umroh`
--
ALTER TABLE `kredit_umroh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `pinjaman`
--
ALTER TABLE `pinjaman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `simpanan`
--
ALTER TABLE `simpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anggota`
--
ALTER TABLE `anggota`
  ADD CONSTRAINT `anggota_ibfk_1` FOREIGN KEY (`nip_anggota`) REFERENCES `pegawai` (`nip`);

--
-- Constraints for table `kredit_barang`
--
ALTER TABLE `kredit_barang`
  ADD CONSTRAINT `kredit_barang_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Constraints for table `kredit_elektronik`
--
ALTER TABLE `kredit_elektronik`
  ADD CONSTRAINT `kredit_elektronik_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Constraints for table `kredit_motor`
--
ALTER TABLE `kredit_motor`
  ADD CONSTRAINT `kredit_motor_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Constraints for table `kredit_umroh`
--
ALTER TABLE `kredit_umroh`
  ADD CONSTRAINT `kredit_umroh_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_kredit_barang`) REFERENCES `kredit_barang` (`id`),
  ADD CONSTRAINT `pembayaran_ibfk_2` FOREIGN KEY (`id_kredit_motor`) REFERENCES `kredit_motor` (`id`),
  ADD CONSTRAINT `pembayaran_ibfk_3` FOREIGN KEY (`id_kredit_elektronik`) REFERENCES `kredit_elektronik` (`id`),
  ADD CONSTRAINT `pembayaran_ibfk_4` FOREIGN KEY (`id_kredit_umroh`) REFERENCES `kredit_umroh` (`id`),
  ADD CONSTRAINT `pembayaran_ibfk_5` FOREIGN KEY (`id_pinjaman`) REFERENCES `pinjaman` (`id`);

--
-- Constraints for table `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD CONSTRAINT `pinjaman_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Constraints for table `simpanan`
--
ALTER TABLE `simpanan`
  ADD CONSTRAINT `simpanan_ibfk_1` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`);

--
-- Constraints for table `simpanan_history`
--
ALTER TABLE `simpanan_history`
  ADD CONSTRAINT `fk_anggota_simpanan_history` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`),
  ADD CONSTRAINT `fk_simpanan` FOREIGN KEY (`simpanan_id`) REFERENCES `simpanan` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
