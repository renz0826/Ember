-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2025 at 01:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ember_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `moments`
--

CREATE TABLE `moments` (
  `id` int(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `seal` date NOT NULL,
  `open` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `moments`
--

INSERT INTO `moments` (`id`, `title`, `image_url`, `description`, `seal`, `open`) VALUES
(1, 'The day after tomorrow', '/Ember/uploads/moment_693046ba39f8b9.96216545.jpg', 'May the memory we shared lasts more than time itself.', '2025-12-03', '2025-12-03'),
(2, 'A brink of the Past', '/Ember/uploads/moment_69304994b76248.85811175.jpg', 'Every moment sealed is a time to reminisce and feel nostalgic.', '2025-12-03', '2025-12-05'),
(3, 'Legendary Meme', '/Ember/uploads/moment_69304add733422.88670421.png', 'A meme we used to share laughter with reminds us the joy of our time spent together.', '2025-12-03', '2025-12-06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `moments`
--
ALTER TABLE `moments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `moments`
--
ALTER TABLE `moments`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
