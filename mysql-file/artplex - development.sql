-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 22, 2020 at 02:12 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `artplex`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` bigint(20) NOT NULL,
  `tag` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `tag`) VALUES
(2, 'Socials'),
(3, 'Games'),
(4, 'Mobile Legend'),
(6, 'Music'),
(7, 'Geography'),
(8, 'Comedy'),
(9, 'Movies'),
(10, 'Disaster'),
(11, 'Romance'),
(12, 'Science'),
(13, 'Pandemic'),
(14, 'Beauty'),
(17, 'Motivation'),
(18, 'Corona'),
(19, 'PUBG'),
(20, 'Karma'),
(72, 'Adolescent'),
(73, 'Thriller'),
(527, 'Jumanji'),
(830, 'Guitar'),
(7764, 'Culinary'),
(368846, 'Youtube'),
(459420, 'Programming'),
(838433, 'Ruby'),
(876426, 'Romance'),
(876427, 'PHP'),
(876428, 'ReactJS'),
(876429, 'O2SN'),
(876430, 'Twitter'),
(876431, 'Instagram'),
(876432, 'Reddit'),
(876433, 'Facebook'),
(876434, 'Tsunami'),
(876435, 'Trending'),
(876436, 'FIFA World Cup U21 2020'),
(876437, 'Romeo and Juliete'),
(876438, 'Jakarta'),
(876439, 'Maria Carie'),
(876443, 'Doraemon'),
(876445, 'McD Sarinah'),
(876446, 'Web Developer');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `body` text NOT NULL,
  `status` enum('on','off') NOT NULL,
  `publish_date` datetime NOT NULL,
  `last_updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--


-- --------------------------------------------------------

--
-- Table structure for table `reset_tokens_temp`
--

CREATE TABLE `reset_tokens_temp` (
  `v_key` varchar(255) NOT NULL,
  `user_id` bigint(255) NOT NULL,
  `exp_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `stories`
--

CREATE TABLE `stories` (
  `story_id` varchar(100) NOT NULL,
  `title` text NOT NULL,
  `body` text NOT NULL,
  `title_html` text NOT NULL,
  `body_html` text NOT NULL,
  `total_word` int(11) NOT NULL,
  `last_update` datetime DEFAULT NULL,
  `story_point` int(10) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `epic_id` bigint(20) DEFAULT NULL,
  `status` enum('on','off') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stories`
--


-- --------------------------------------------------------

--
-- Table structure for table `stories_categories`
--

CREATE TABLE `stories_categories` (
  `id` int(255) NOT NULL,
  `story_id` varchar(100) NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stories_categories`
--


-- --------------------------------------------------------

--
-- Table structure for table `stories_comments`
--

CREATE TABLE `stories_comments` (
  `id` bigint(20) NOT NULL,
  `story_id` varchar(255) NOT NULL,
  `comment_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stories_comments`
--


-- --------------------------------------------------------

--
-- Table structure for table `stories_publish`
--

CREATE TABLE `stories_publish` (
  `story_id` varchar(255) NOT NULL,
  `preview_image` varchar(255) NOT NULL,
  `publish_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stories_publish`
--


-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(225) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(35) NOT NULL,
  `password` varchar(100) NOT NULL,
  `verified` tinyint(4) NOT NULL,
  `status` enum('on','off') NOT NULL,
  `level` enum('reader','author','admin') NOT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `remember_token` varchar(255) DEFAULT NULL,
  `last_activity` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--


-- --------------------------------------------------------

--
-- Table structure for table `verify_tokens_temp`
--

CREATE TABLE `verify_tokens_temp` (
  `v_key` varchar(255) NOT NULL,
  `user_id` bigint(255) NOT NULL,
  `exp_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `verify_tokens_temp`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `comments_user_id_index` (`user_id`);

--
-- Indexes for table `reset_tokens_temp`
--
ALTER TABLE `reset_tokens_temp`
  ADD PRIMARY KEY (`v_key`),
  ADD KEY `FK_UserID` (`user_id`);

--
-- Indexes for table `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`story_id`),
  ADD UNIQUE KEY `stories_user_id_index` (`user_id`,`epic_id`) USING BTREE,
  ADD UNIQUE KEY `stories_epic_id_index` (`epic_id`);

--
-- Indexes for table `stories_categories`
--
ALTER TABLE `stories_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stories_categories_story_id_index` (`story_id`) USING BTREE,
  ADD KEY `stories_categories_category_id_index` (`category_id`) USING BTREE;

--
-- Indexes for table `stories_comments`
--
ALTER TABLE `stories_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stories_comments_comment_id_index` (`comment_id`),
  ADD KEY `stories_comments_story_id_index` (`story_id`);

--
-- Indexes for table `stories_publish`
--
ALTER TABLE `stories_publish`
  ADD UNIQUE KEY `story_id` (`story_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `verify_tokens_temp`
--
ALTER TABLE `verify_tokens_temp`
  ADD PRIMARY KEY (`v_key`),
  ADD KEY `FK_verify_UserID` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=876447;

--
-- AUTO_INCREMENT for table `stories_categories`
--
ALTER TABLE `stories_categories`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `stories_comments`
--
ALTER TABLE `stories_comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=192;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(225) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reset_tokens_temp`
--
ALTER TABLE `reset_tokens_temp`
  ADD CONSTRAINT `reset_tokens_temp_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `stories`
--
ALTER TABLE `stories`
  ADD CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `stories_categories`
--
ALTER TABLE `stories_categories`
  ADD CONSTRAINT `stories_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `stories_categories_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`);

--
-- Constraints for table `stories_comments`
--
ALTER TABLE `stories_comments`
  ADD CONSTRAINT `stories_comments_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`),
  ADD CONSTRAINT `stories_comments_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`);

--
-- Constraints for table `stories_publish`
--
ALTER TABLE `stories_publish`
  ADD CONSTRAINT `stories_publish_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`);

--
-- Constraints for table `verify_tokens_temp`
--
ALTER TABLE `verify_tokens_temp`
  ADD CONSTRAINT `verify_tokens_temp_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
