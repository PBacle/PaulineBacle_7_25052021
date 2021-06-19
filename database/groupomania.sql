-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Sam 19 Juin 2021 à 04:24
-- Version du serveur :  5.7.34-0ubuntu0.18.04.1
-- Version de PHP :  7.2.24-0ubuntu0.18.04.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `groupomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `content` varchar(300) NOT NULL,
  `creationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `comments`
--

INSERT INTO `comments` (`id`, `content`, `creationDate`, `userId`, `postId`) VALUES
(1, 'Moi aussi j\'aime la sauce Sriracha !', '2021-06-18 11:05:27', 4, 2),
(2, 'Je pourrais en manger tous les jours !', '2021-06-18 11:08:41', 4, 2),
(3, 'Merci pour ce partage !', '2021-06-18 23:08:53', 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `likes`
--

INSERT INTO `likes` (`id`, `postId`, `userId`) VALUES
(1, 3, 4),
(2, 2, 4),
(3, 2, 1),
(4, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(400) NOT NULL,
  `imgUrl` varchar(255) DEFAULT NULL,
  `creationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `imgUrl`, `creationDate`, `userId`) VALUES
(1, 'Ceci est le premier post', 'Il faut bien que quelqu\'un commence ! \r\nVoici donc le premier post.', NULL, '2021-06-18 10:48:03', 4),
(2, 'J\'aime la sauce Sriracha', 'Je voulais partager mon amour de cette sauce asiatique : un peu de riz, de sauce soja et quelques gouttes de Sriracha et c\'est le bonheur assuré !', 'http://localhost:3000/upload/posts/sauce-pimentee-sriracha-150g-coq1624017983108.jpg', '2021-06-18 10:57:41', 3),
(3, 'Quelques règles de bonne conduite', 'Bienvenue sur ce nouvel espace de partage. \r\nN\'hésitez pas à poster ce que bon vous semble mais dans le respect de règles de base : \r\n- Pas d\'insultes, de propos misogynes ou racistes\r\n- Pas de harcèlement, \r\netc. \r\n\r\nUn modérateur veillera au respect de ces consignes et se réservera le droit de supprimer vos posts ou commentaires, voire votre compte, dans le cas contraire.', NULL, '2021-06-19 01:30:23', 1);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `pseudo` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` varchar(300) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `registerDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`userId`, `firstname`, `lastname`, `pseudo`, `email`, `password`, `bio`, `avatarUrl`, `registerDate`, `admin`) VALUES
(1, 'admin', 'admin', 'admin', 'admin@gmail.com', '$2b$10$9ZEiyXpYlMxFeo12OfCEgedvPDQzxGwiUw8OCBs6V2c1qwqBZtqBi', NULL, NULL, '2021-06-18 09:07:27', 1),
(2, 'Mégane', 'Dujon', 'Moulinette', 'pdujon@free.com', '$2b$10$KerBKLAprjy83FZpuoyzNuHZJKARnL9U0w8bcb.fXyT50J8AU477y', NULL, NULL, '2021-06-18 12:24:44', NULL),
(3, 'Pierre', 'Paul', 'PP_du_75', 'pierre.paul@free.com', '$2b$10$fAOH1yc.0IGJcndXqaPcWeBIFZGAvtyqZjRSTqfs576X9Oh7gFzcq', NULL, NULL, '2021-06-18 09:12:41', NULL),
(4, 'Pauline', 'Bacle', 'PB4cl3', 'pauline.bacle@gmail.com', '$2b$10$MYu1ID9q.HFfdT7br4TB0.dnfjUvWMv/s9kglTZSDjay12cOfrOtG', NULL, NULL, '2021-06-18 10:45:23', NULL),
(5, 'Théo', 'Delahaye', 'T0T0', 'toto@gmail.com', '$2b$10$LdbSMrmbhnFB3g4geq8hSebjP3OZNuopqpury62ZfG7u8tPy3x6e.', NULL, NULL, '2021-06-18 12:20:44', NULL);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
