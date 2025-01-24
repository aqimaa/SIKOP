-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 23, 2025 at 07:39 AM
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
  `nip` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `ket_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for dumped tables
--

--
-- Indexes for table `anggota`
--
ALTER TABLE `anggota`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nip` (`nip`);

--
-- Indexes for table `kredit_barang`
--
ALTER TABLE `kredit_barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`);

--
-- Indexes for table `kredit_elektronik`
--
ALTER TABLE `kredit_elektronik`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`);

--
-- Indexes for table `kredit_motor`
--
ALTER TABLE `kredit_motor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`);

--
-- Indexes for table `kredit_umroh`
--
ALTER TABLE `kredit_umroh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kredit_barang` (`id_kredit_barang`),
  ADD KEY `id_kredit_motor` (`id_kredit_motor`),
  ADD KEY `id_kredit_elektronik` (`id_kredit_elektronik`),
  ADD KEY `id_kredit_umroh` (`id_kredit_umroh`),
  ADD KEY `id_pinjaman` (`id_pinjaman`);

--
-- Indexes for table `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`);

--
-- Indexes for table `simpanan`
--
ALTER TABLE `simpanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_anggota` (`id_anggota`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kredit_barang`
--
ALTER TABLE `kredit_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kredit_elektronik`
--
ALTER TABLE `kredit_elektronik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kredit_motor`
--
ALTER TABLE `kredit_motor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kredit_umroh`
--
ALTER TABLE `kredit_umroh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pinjaman`
--
ALTER TABLE `pinjaman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `simpanan`
--
ALTER TABLE `simpanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
