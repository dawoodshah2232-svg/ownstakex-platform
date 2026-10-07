-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: ownstakex
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ownstakex`
--

/*!40000 DROP DATABASE IF EXISTS `ownstakex`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ownstakex` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `ownstakex`;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `announcements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `audience` varchar(30) NOT NULL DEFAULT 'all',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,'August reports published for 2 projects','Monthly reports for the Business Bay Commercial Tower and Dubai Charter Yacht are now available in the document library.','all','2026-10-05 10:02:01','2026-10-07 10:02:01','2026-10-07 10:02:01'),(2,'Yacht funding call expected 05 Nov 2026','A funding call for the Dubai Charter Yacht campaign is expected in early November. Reserved investors will be notified by email.','investors','2026-10-06 10:02:01','2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `actor_id` bigint(20) unsigned DEFAULT NULL,
  `actor_role` varchar(30) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `detail` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` varchar(255) DEFAULT NULL,
  `body` mediumtext NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `read_time` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES (1,'spv-explained','Why every project gets its own company (SPV)','Ring-fencing each asset in its own company protects investors if anything goes wrong elsewhere.','<p class=\"lede\">Every OwnStakeX project is held in its own special purpose vehicle — a dedicated company that owns nothing but that asset.</p><h2>Why it matters</h2><p>If one project underperforms, creditors of that project cannot reach the assets of another. Your stake maps to a specific company, a specific asset and a specific register entry.</p><h2>What to check</h2><ul><li>The SPV name on your certificate matches the project documents</li><li>The asset is the SPV\'s only material holding</li><li>Distributions flow from the SPV to unit holders</li></ul><p><em>Capital at risk. Educational content, not financial advice.</em></p>',NULL,'Mechanics','4 min read','2026-10-01 10:02:01','2026-10-07 10:02:01','2026-10-07 10:02:01'),(2,'reservation-vs-ownership','Reservation vs ownership: know the difference','Reserving units is an expression of interest — ownership begins when payment clears and the register updates.','<p class=\"lede\">A reservation holds your place in the queue. It is not ownership.</p><h2>The journey</h2><ol><li><strong>Reserve</strong> — units are earmarked in your name</li><li><strong>Pay</strong> — funds clear to the project account</li><li><strong>Own</strong> — the register updates and your certificate is issued</li></ol><p>Until step three, you hold a reservation, not an asset.</p><p><em>Capital at risk. Educational content, not financial advice.</em></p>',NULL,'Mechanics','3 min read','2026-10-04 10:02:01','2026-10-07 10:02:01','2026-10-07 10:02:01'),(3,'fractional-ownership-gcc-trend','Fractional ownership is quietly growing across the GCC','High-value assets are being split into affordable units — here is what is driving the trend.','<p class=\"lede\">From marina berths to office floors, the GCC is seeing more assets offered in fractions.</p><h2>What is driving it</h2><ul><li><strong>Ticket sizes</strong> — prime assets are out of reach for most buyers whole</li><li><strong>Transparency</strong> — registers and reporting make shared ownership practical</li><li><strong>Yield focus</strong> — investors want income-producing assets, not just appreciation bets</li></ul><p>None of this removes risk — it changes its shape.</p><p><em>Capital at risk. Educational content, not financial advice.</em></p>',NULL,'Market','5 min read','2026-10-06 10:02:01','2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distributions`
--

DROP TABLE IF EXISTS `distributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `distributions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `per_unit` decimal(15,2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `distributions_project_id_foreign` (`project_id`),
  CONSTRAINT `distributions_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distributions`
--

LOCK TABLES `distributions` WRITE;
/*!40000 ALTER TABLE `distributions` DISABLE KEYS */;
INSERT INTO `distributions` VALUES (1,2,8600.00,35.83,'Q3 2026 rental distribution (demo)','2026-09-17 10:02:01',NULL,NULL);
/*!40000 ALTER TABLE `distributions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `file_size` varchar(255) DEFAULT NULL,
  `mime` varchar(255) DEFAULT NULL,
  `audience` enum('investors','internal') NOT NULL DEFAULT 'investors',
  `project_id` bigint(20) unsigned DEFAULT NULL,
  `version` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `documents_project_id_foreign` (`project_id`),
  CONSTRAINT `documents_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,'Offering terms — Yacht v1.2','Offering','docs/yacht-offering-terms-v1-2.pdf','2.1 MB','application/pdf','investors',1,'v1.2','2026-10-07 10:02:01','2026-10-07 10:02:01'),(2,'Offering terms — Property v1.0','Offering','docs/property-offering-terms-v1-0.pdf','2.4 MB','application/pdf','investors',2,'v1.0','2026-10-07 10:02:01','2026-10-07 10:02:01'),(3,'August 2026 monthly report — Property','Reporting','docs/monthly-report-aug-2026-property.pdf','1.6 MB','application/pdf','investors',2,NULL,'2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `investments`
--

DROP TABLE IF EXISTS `investments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `investments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `project_id` bigint(20) unsigned NOT NULL,
  `units` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `certificate_no` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `investments_certificate_no_unique` (`certificate_no`),
  KEY `investments_user_id_foreign` (`user_id`),
  KEY `investments_project_id_foreign` (`project_id`),
  CONSTRAINT `investments_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `investments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investments`
--

LOCK TABLES `investments` WRITE;
/*!40000 ALTER TABLE `investments` DISABLE KEYS */;
INSERT INTO `investments` VALUES (1,2,2,4,200000.00,'active','CRT-2026-0912','2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `investments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2019_08_19_000000_create_failed_jobs_table',1),(3,'2019_12_14_000001_create_personal_access_tokens_table',1),(4,'2026_10_06_181334_create_projects_table',1),(5,'2026_10_06_181335_create_project_images_table',1),(6,'2026_10_06_181336_create_documents_table',1),(7,'2026_10_06_181337_create_reservations_table',1),(8,'2026_10_06_181338_create_investments_table',1),(9,'2026_10_06_181339_create_payments_table',1),(10,'2026_10_06_181340_create_distributions_table',1),(11,'2026_10_06_181341_create_blog_posts_table',1),(12,'2026_10_06_181342_create_announcements_table',1),(13,'2026_10_06_181343_create_audit_logs_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `investment_id` bigint(20) unsigned DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `method` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `reference` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_user_id_foreign` (`user_id`),
  KEY `payments_investment_id_foreign` (`investment_id`),
  CONSTRAINT `payments_investment_id_foreign` FOREIGN KEY (`investment_id`) REFERENCES `investments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,2,1,200000.00,'bank_transfer','completed','PAY-2026-0841','2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_images`
--

DROP TABLE IF EXISTS `project_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_images` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `url` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_images_project_id_foreign` (`project_id`),
  CONSTRAINT `project_images_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_images`
--

LOCK TABLES `project_images` WRITE;
/*!40000 ALTER TABLE `project_images` DISABLE KEYS */;
INSERT INTO `project_images` VALUES (1,1,'assets/cat-yachts.jpg',0,'2026-10-07 10:02:01','2026-10-07 10:02:01'),(2,2,'assets/cat-real-estate.jpg',0,'2026-10-07 10:02:01','2026-10-07 10:02:01'),(3,3,'assets/cat-hospitality.jpg',0,'2026-10-07 10:02:01','2026-10-07 10:02:01'),(4,4,'assets/cat-business.jpg',0,'2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `project_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `capital` decimal(15,2) NOT NULL,
  `units` int(11) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `min_units` int(11) NOT NULL DEFAULT 1,
  `max_units` int(11) NOT NULL DEFAULT 20,
  `reserved` int(11) NOT NULL DEFAULT 0,
  `funded` int(11) NOT NULL DEFAULT 0,
  `status` enum('draft','evaluation','funding','closing','operating') NOT NULL DEFAULT 'draft',
  `version` varchar(20) NOT NULL DEFAULT 'v1.0',
  `campaign_ends` date DEFAULT NULL,
  `long_stop` date DEFAULT NULL,
  `operator` varchar(255) DEFAULT NULL,
  `issuer` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_code_unique` (`code`),
  UNIQUE KEY `projects_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'OX-YT-01','Dubai Charter Yacht','dubai-charter-yacht','Yachts & Marine','Dubai Marina, UAE','88-ft luxury charter yacht with established booking demand','A fully crewed 88-ft luxury motor yacht operating day and term charters from Dubai Marina. Revenue comes from charter bookings and seasonal events, with quarterly distributions to unit holders.',4800000.00,96,50000.00,1,10,34,44,'funding','v1.2','2026-11-05','2027-02-28','Marina Charter Co.','OwnStakeX Yacht SPV 1 Ltd','assets/cat-yachts.jpg',NULL,'2026-10-07 10:02:01','2026-10-07 10:02:01'),(2,'OX-PR-02','Business Bay Commercial Tower','business-bay-commercial-tower','Real Estate','Business Bay, Dubai, UAE','Grade-A office floors with long-term corporate tenants','Two fully fitted office floors in a Business Bay commercial tower, leased to corporate tenants on multi-year contracts. Rental income is distributed quarterly after service charges.',12000000.00,240,50000.00,1,20,80,141,'funding','v1.0','2026-12-15','2027-03-31','Bay Property Management LLC','OwnStakeX Property SPV 2 Ltd','assets/cat-real-estate.jpg',NULL,'2026-10-07 10:02:01','2026-10-07 10:02:01'),(3,'OX-HS-03','JBR Beachfront Restaurant','jbr-beachfront-restaurant','Hospitality','JBR, Dubai, UAE','High-footfall beachfront dining venue under evaluation','A 220-cover beachfront restaurant on JBR Walk. Currently in evaluation: the investment committee is reviewing footfall data, the operator track record and the fit-out budget before a funding decision.',3600000.00,120,30000.00,1,12,0,0,'evaluation','v0.9',NULL,NULL,'Coastal Hospitality Group','OwnStakeX Hospitality SPV 3 Ltd','assets/cat-hospitality.jpg',NULL,'2026-10-07 10:02:01','2026-10-07 10:02:01'),(4,'OX-FD-04','Falcon SME Growth Fund','falcon-sme-growth-fund','Operating Businesses','Dubai, UAE','Diversified pool of profitable UAE small businesses','A diversified holding of profitable UAE SMEs across logistics, food services and business services. The fund targets quarterly distributions from operating cash flows. Not an approved product — subscriptions are never trader deposits.',8000000.00,160,50000.00,1,16,20,60,'funding','v1.0','2026-11-30','2027-02-28','Falcon Capital Partners','OwnStakeX Falcon SPV 4 Ltd','assets/cat-business.jpg',NULL,'2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `project_id` bigint(20) unsigned NOT NULL,
  `units` int(11) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reservations_user_id_foreign` (`user_id`),
  KEY `reservations_project_id_foreign` (`project_id`),
  CONSTRAINT `reservations_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,2,1,2,50000.00,'confirmed','2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('investor','admin') NOT NULL DEFAULT 'investor',
  `phone` varchar(255) DEFAULT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'UAE',
  `kyc_status` varchar(50) NOT NULL DEFAULT 'pending',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Sara Iqbal','admin@ownstakex.com',NULL,'$2y$12$/Ulz2t9fu9YH/v71oD67G.cIcddimH1W75pikRSoLIH7OGlkwZnnK','admin','+971500000001','UAE','approved',NULL,'2026-10-07 10:02:00','2026-10-07 10:02:00'),(2,'Ahmed Khan','investor@ownstakex.com',NULL,'$2y$12$cncPHqHBSRC8tNiHt/OQPe6BI3JEM/hJY9PEOVa9DEIo26CMaGGQC','investor','+971500000002','UAE','approved',NULL,'2026-10-07 10:02:01','2026-10-07 10:02:01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07 18:02:06
