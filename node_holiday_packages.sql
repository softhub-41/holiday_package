-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 27, 2023 at 08:43 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_holiday_packages`
--

-- --------------------------------------------------------

--
-- Table structure for table `accommodations`
--

CREATE TABLE `accommodations` (
  `acc_id` int(11) NOT NULL,
  `hotel` int(11) NOT NULL,
  `free_wifi` int(3) NOT NULL,
  `free_parking` int(3) NOT NULL,
  `restaurant` int(3) NOT NULL,
  `two4hour_roomservice` int(3) NOT NULL,
  `breakfast` int(3) NOT NULL,
  `extra_bedding` int(3) NOT NULL,
  `minibar` int(3) NOT NULL,
  `air_conditioned` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accommodations`
--

INSERT INTO `accommodations` (`acc_id`, `hotel`, `free_wifi`, `free_parking`, `restaurant`, `two4hour_roomservice`, `breakfast`, `extra_bedding`, `minibar`, `air_conditioned`) VALUES
(7, 17, 1, 1, 1, 1, 1, 1, 1, 1),
(8, 16, 1, 0, 1, 1, 1, 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `username` varchar(50) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  `fullname` varchar(80) DEFAULT NULL,
  `email` varchar(145) DEFAULT NULL,
  `usertype` varchar(30) DEFAULT NULL,
  `status` varchar(25) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`username`, `password`, `fullname`, `email`, `usertype`, `status`) VALUES
('admin', '123', 'Admin', 'admin@gmail.com', 'Admin', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `bookid` int(11) NOT NULL,
  `user` varchar(100) NOT NULL,
  `pack` int(11) NOT NULL,
  `pack_type` varchar(20) NOT NULL,
  `booking_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_amount` float(10,2) NOT NULL,
  `status` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`bookid`, `user`, `pack`, `pack_type`, `booking_date`, `end_date`, `total_amount`, `status`) VALUES
(4, 'user@gmail.com', 5, 'gold', '2023-09-27', '2024-09-27', 5000.00, 'paid');

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `city_id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `pincode` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`city_id`, `name`, `pincode`, `state`) VALUES
(1, 'amritsar', '143001', 'Punjab'),
(2, 'jalandhar', '144001', 'Punjab');

-- --------------------------------------------------------

--
-- Table structure for table `hotels`
--

CREATE TABLE `hotels` (
  `hotel_id` int(11) NOT NULL,
  `hotel_name` varchar(120) NOT NULL,
  `address` text NOT NULL,
  `city` int(11) NOT NULL,
  `coverphoto` text NOT NULL,
  `contactno1` varchar(15) NOT NULL,
  `contactno2` varchar(15) NOT NULL,
  `status` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `hotels`
--

INSERT INTO `hotels` (`hotel_id`, `hotel_name`, `address`, `city`, `coverphoto`, `contactno1`, `contactno2`, `status`) VALUES
(15, 'hotel veenus international', 'Queens Road', 1, 'images/hotel3.jpeg', '1234567890', '1234567890', 'active'),
(16, 'hotel grand', 'Mall Road', 2, 'images/hotel4.png', '1234567890', '', 'active'),
(17, 'Hotel Taj', 'Green Avenue', 1, 'images/hotel2.jpeg', '1234567890', '1234567890', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `hotel_gallery`
--

CREATE TABLE `hotel_gallery` (
  `hg_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `path` text NOT NULL,
  `hotel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `hotel_gallery`
--

INSERT INTO `hotel_gallery` (`hg_id`, `title`, `path`, `hotel`) VALUES
(11, 'Suite', '/images/hotel4.png', 17);

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `pck_id` int(11) NOT NULL,
  `hotel_id` int(11) NOT NULL,
  `gold` float(10,2) NOT NULL,
  `silver` float(10,2) NOT NULL,
  `platinum` float(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`pck_id`, `hotel_id`, `gold`, `silver`, `platinum`) VALUES
(5, 17, 5000.00, 7000.00, 10000.00),
(6, 16, 2000.00, 4000.00, 7000.00),
(7, 15, 3000.00, 5000.00, 8000.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_email` varchar(100) NOT NULL,
  `fullname` varchar(145) DEFAULT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(35) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_email`, `fullname`, `gender`, `phone`, `password`) VALUES
('user@gmail.com', 'John Doe', 'Male', '1234567890', '123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accommodations`
--
ALTER TABLE `accommodations`
  ADD PRIMARY KEY (`acc_id`),
  ADD KEY `hotel` (`hotel`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`bookid`),
  ADD KEY `user` (`user`),
  ADD KEY `pack` (`pack`);

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`city_id`);

--
-- Indexes for table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`hotel_id`),
  ADD KEY `city` (`city`);

--
-- Indexes for table `hotel_gallery`
--
ALTER TABLE `hotel_gallery`
  ADD PRIMARY KEY (`hg_id`),
  ADD KEY `hotel` (`hotel`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`pck_id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accommodations`
--
ALTER TABLE `accommodations`
  MODIFY `acc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `bookid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `hotel_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `hotel_gallery`
--
ALTER TABLE `hotel_gallery`
  MODIFY `hg_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `pck_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accommodations`
--
ALTER TABLE `accommodations`
  ADD CONSTRAINT `accommodations_ibfk_1` FOREIGN KEY (`hotel`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`pack`) REFERENCES `packages` (`pck_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`user_email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hotels`
--
ALTER TABLE `hotels`
  ADD CONSTRAINT `hotels_ibfk_1` FOREIGN KEY (`city`) REFERENCES `city` (`city_id`);

--
-- Constraints for table `hotel_gallery`
--
ALTER TABLE `hotel_gallery`
  ADD CONSTRAINT `hotel_gallery_ibfk_1` FOREIGN KEY (`hotel`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `packages`
--
ALTER TABLE `packages`
  ADD CONSTRAINT `packages_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
