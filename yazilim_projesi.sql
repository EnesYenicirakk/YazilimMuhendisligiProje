-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 27, 2026 at 04:31 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yazilim_projesi`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Fren Balataları', '2026-04-24 17:01:08', '2026-04-24 17:01:08'),
(2, 'Filtre', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 'Fren', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 'Elektrik', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(5, 'Şanzıman', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(6, 'Motor', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(7, 'Diğer', '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tax_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_purchase_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `full_name`, `phone`, `email`, `address`, `tax_number`, `last_purchase_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'Yıldız Oto', '0212 555 01 01', 'info@yildizoto.com', 'Bağcılar, İstanbul', '1234567890', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(2, 'Tekin Otomotiv', '0216 555 02 02', 'info@tekinoto.com', 'Kadıköy, İstanbul', '2345678901', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 'Mert Motor', '0312 555 03 03', 'info@mertmotor.com', 'Çankaya, Ankara', '3456789012', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 'Hızlı Servis', '0232 555 04 04', 'info@hizliservis.com', 'Konak, İzmir', '4567890123', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(5, 'Akın Oto', '0322 555 05 05', 'info@akinoto.com', 'Seyhan, Adana', '5678901234', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(6, 'Bora Yedek Parça', '0242 555 06 06', 'info@borayedek.com', 'Muratpaşa, Antalya', '6789012345', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(7, 'Demir Oto', '0224 555 07 07', 'info@demiroto.com', 'Osmangazi, Bursa', '7890123456', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(8, 'Asil Sanayi', '0352 555 08 08', 'info@asilsanayi.com', 'Melikgazi, Kayseri', '8901234567', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(9, 'Nehir Otomotiv', '0342 555 09 09', 'info@nehiroto.com', 'Şahinbey, Gaziantep', '9012345678', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(10, 'Kaya Oto Servis', '0362 555 10 10', 'info@kayaservis.com', 'İlkadım, Samsun', '0123456789', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(11, 'Yaman Yedek', '0462 555 11 11', 'info@yamanyedek.com', 'Ortahisar, Trabzon', '1357924680', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(12, 'Gürkan Oto', '0452 555 12 12', 'info@gurkanoto.com', 'Yakutiye, Erzurum', '2468013579', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(13, 'Doğan Oto', '0382 555 13 13', 'info@doganoto.com', 'Merkez, Kırşehir', '1122334455', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(14, 'Özen Servis', '0422 555 14 14', 'info@ozenservis.com', 'Merkez, Malatya', '2233445566', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(15, 'Başak Otomotiv', '0414 555 15 15', 'info@basakoto.com', 'Eyyübiye, Şanlıurfa', '3344556677', NULL, NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `customer_orders`
--

CREATE TABLE `customer_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `preparation_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `delivery_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_orders`
--

INSERT INTO `customer_orders` (`id`, `customer_id`, `total_amount`, `order_date`, `payment_status`, `preparation_status`, `delivery_status`, `created_at`, `updated_at`) VALUES
(1, 1, '580.00', '2026-04-10 07:00:00', 'paid', 'ready', 'delivered', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(2, 2, '930.00', '2026-04-11 08:00:00', 'paid', 'ready', 'delivered', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 3, '1200.00', '2026-04-13 06:00:00', 'pending', 'preparing', 'pending', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 4, '625.00', '2026-04-14 11:00:00', 'pending', 'pending', 'pending', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(5, 6, '675.00', '2026-04-15 13:00:00', 'paid', 'ready', 'pending', '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `customer_order_items`
--

CREATE TABLE `customer_order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_order_items`
--

INSERT INTO `customer_order_items` (`id`, `customer_order_id`, `product_id`, `quantity`, `unit_price`, `created_at`, `updated_at`) VALUES
(1, 1, 6, 2, '290.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(2, 2, 10, 1, '1450.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 2, 2, 1, '120.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 3, 14, 1, '1200.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(5, 4, 3, 2, '145.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(6, 4, 9, 2, '150.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(7, 4, 12, 2, '195.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(8, 5, 22, 1, '675.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `issue_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `sub_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tax_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `tax_rate` decimal(5,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_20_190426_create_categories_table', 1),
(5, '2026_04_20_191246_create_products_table', 1),
(6, '2026_04_20_193314_create_customers_table', 2),
(7, '2026_04_20_193344_create_suppliers_table', 2),
(8, '2026_04_20_193935_create_customer_orders_table', 3),
(9, '2026_04_20_193937_create_customer_order_items_table', 3),
(10, '2026_04_20_194303_create_supplier_orders_table', 4),
(11, '2026_04_20_194304_create_supplier_order_items_table', 4),
(12, '2026_04_20_202802_create_invoices_table', 5),
(13, '2026_04_20_202813_create_invoice_items_table', 5),
(14, '2026_04_20_202818_create_payments_table', 5),
(15, '2026_04_20_204034_create_stock_logs_table', 6),
(16, '2026_04_25_000001_add_username_role_to_users_table', 7),
(17, '2026_04_25_000002_add_unique_to_categories_name', 7),
(18, '2026_04_24_210850_create_personal_access_tokens_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `supplier_id` bigint(20) UNSIGNED DEFAULT NULL,
  `invoice_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `type`, `amount`, `payment_date`, `customer_id`, `supplier_id`, `invoice_id`, `status`, `description`, `created_at`, `updated_at`) VALUES
(1, 'incoming', '580.00', '2026-04-10', 1, NULL, NULL, 'completed', 'Yıldız Oto - Sipariş ödemesi (Fren Balatası)', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(2, 'incoming', '1570.00', '2026-04-11', 2, NULL, NULL, 'completed', 'Tekin Otomotiv - Sipariş ödemesi', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 'incoming', '675.00', '2026-04-15', 6, NULL, NULL, 'completed', 'Bora Yedek Parça - Triger Kayışı Seti', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 'outgoing', '8500.00', '2026-03-12', NULL, 1, NULL, 'completed', 'Anadolu Filtre Sanayi - AP-103 tedarik ödemesi', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(5, 'outgoing', '15600.00', '2026-03-22', NULL, 2, NULL, 'completed', 'Delta Fren Sistemleri - DF-211 tedarik ödemesi', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(6, 'outgoing', '2500.00', '2026-04-01', NULL, NULL, NULL, 'completed', 'Kira - Nisan 2026', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(7, 'outgoing', '1200.00', '2026-04-05', NULL, NULL, NULL, 'completed', 'Elektrik faturası - Nisan 2026', '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(6, 'App\\Models\\User', 1, 'auth-token', 'd38dc8aba39ccebbc55e6dd3fd43e5755b2799e0c4050a179ccfb287bacd9301', '[\"*\"]', '2026-04-26 21:32:12', NULL, '2026-04-24 19:05:31', '2026-04-26 21:32:12');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barcode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT '0',
  `store_stock` int(11) NOT NULL DEFAULT '0',
  `minimum_stock` int(11) NOT NULL DEFAULT '5',
  `purchase_price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `is_favorite` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `sku`, `barcode`, `name`, `avatar`, `stock_quantity`, `store_stock`, `minimum_stock`, `purchase_price`, `sale_price`, `is_favorite`, `created_at`, `updated_at`) VALUES
(1, 1, 'BSCH-BRK-001', NULL, 'Bosch Seramik Fren Balatası', NULL, 50, 0, 5, '450.00', '850.00', 0, '2026-04-24 17:01:51', '2026-04-24 17:01:51'),
(2, 2, 'FLT-2201', '8690123456781', 'Yağ Filtresi', '#F59E0B', 45, 10, 10, '75.00', '120.00', 1, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 2, 'FLT-2202', '8690123456782', 'Hava Filtresi', '#F59E0B', 32, 8, 8, '90.00', '145.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 2, 'FLT-2203', '8690123456783', 'Polen Filtresi', '#F59E0B', 28, 6, 5, '55.00', '90.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(5, 2, 'FLT-2204', '8690123456784', 'Yakıt Filtresi', '#F59E0B', 20, 5, 5, '110.00', '175.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(6, 3, 'FRN-2101', '8690123456785', 'Fren Balatası Ön Takım', '#EF4444', 38, 12, 10, '180.00', '290.00', 1, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(7, 3, 'FRN-2102', '8690123456786', 'Fren Balatası Arka Takım', '#EF4444', 25, 8, 8, '160.00', '255.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(8, 3, 'FRN-2103', '8690123456787', 'Fren Diski Ön Çift', '#EF4444', 18, 4, 5, '350.00', '560.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(9, 3, 'FRN-2104', '8690123456788', 'Fren Hortumu', '#EF4444', 15, 4, 5, '95.00', '150.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(10, 4, 'ELK-2301', '8690123456789', 'Akü 72Ah', '#3B82F6', 12, 3, 3, '950.00', '1450.00', 1, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(11, 4, 'ELK-2302', '8690123456790', 'Şarj Dinamosu', '#3B82F6', 8, 2, 2, '1200.00', '1900.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(12, 4, 'ELK-2305', '8690123456791', 'Buji Takımı', '#3B82F6', 40, 10, 10, '120.00', '195.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(13, 4, 'ELK-2311', '8690123456792', 'ABS Sensörü Ön', '#3B82F6', 10, 3, 3, '280.00', '450.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(14, 5, 'SAN-2401', '8690123456793', 'Debriyaj Seti', '#8B5CF6', 14, 4, 3, '750.00', '1200.00', 1, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(15, 5, 'SAN-2402', '8690123456794', 'Debriyaj Bilyası', '#8B5CF6', 20, 5, 5, '110.00', '175.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(16, 5, 'SAN-2405', '8690123456795', 'Şanzıman Takozu', '#8B5CF6', 16, 4, 4, '145.00', '230.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(17, 6, 'MTR-2001', '8690123456796', 'Silindir Kapak Contası', '#10B981', 9, 2, 2, '320.00', '510.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(18, 6, 'MTR-2005', '8690123456797', 'Yağ Pompası', '#10B981', 7, 2, 2, '480.00', '770.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(19, 6, 'MTR-2012', '8690123456798', 'Motor Yağ Soğutucusu', '#10B981', 11, 3, 3, '220.00', '350.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(20, 7, 'DGR-2502', '8690123456799', 'Klima Kompresörü', '#6B7280', 5, 1, 2, '1800.00', '2900.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(21, 7, 'DGR-2503', '8690123456800', 'Direksiyon Kutusu', '#6B7280', 4, 1, 2, '2200.00', '3500.00', 0, '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(22, 7, 'DGR-2510', '8690123456801', 'Triger Kayışı Seti', '#6B7280', 22, 6, 5, '420.00', '675.00', 1, '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('nIz92xwcJjYsa0Pdv9yzMxVqlULMxzTi0AzdtXCy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMmpVemI4b2RMTGZxdE5STkVIeFdhbWZPa3BkcXpVNjFwWXlubGhUZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777060247),
('rFHTEmTaoAn73uTsWgS2dg7RPQ3QKiYGgDoUy77f', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiODhaSlo4aGl6dElqMmU5R3htQWg2UGxETHV5WjRSMHd6V3ZyVGc2RSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777068387),
('zbNMSDC8C3zWph4HMtV5NoMiHNSQmfPtvdIsIfc3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmVNU2NTbzJKYUp2d0pVRUs3TzVRcHFzaWE1WGhFYUdaczZ6NkpjMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1776718557);

-- --------------------------------------------------------

--
-- Table structure for table `stock_logs`
--

CREATE TABLE `stock_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_stock` int(11) NOT NULL,
  `new_stock` int(11) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `tax_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_group` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `company_name`, `contact_person`, `phone`, `email`, `address`, `tax_number`, `product_group`, `created_at`, `updated_at`) VALUES
(1, 'Anadolu Filtre Sanayi', 'Kemal Aydın', '0212 600 01 01', 'satis@anadolufiltre.com', 'İkitelli OSB, İstanbul', '1111111111', 'Filtre', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(2, 'Delta Fren Sistemleri', 'Serdar Kaya', '0232 600 02 02', 'satis@deltafren.com', 'Atatürk OSB, İzmir', '2222222222', 'Fren', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 'Mavi Elektrik Oto', 'Burak Çelik', '0312 600 03 03', 'satis@mavielektrik.com', 'Ostim OSB, Ankara', '3333333333', 'Elektrik', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 'Şanzıman Parça Merkezi', 'Hüseyin Yıldız', '0224 600 04 04', 'satis@sanzımanparca.com', 'Nilüfer OSB, Bursa', '4444444444', 'Şanzıman', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(5, 'MotorTek Endüstri', 'Faruk Demir', '0342 600 05 05', 'satis@motortek.com.tr', 'İslahiye OSB, Gaziantep', '5555555555', 'Motor', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(6, 'Kuzey Oto Kimya', 'Mustafa Öztürk', '0462 600 06 06', 'satis@kuzeyotokimya.com', 'Arsin OSB, Trabzon', '6666666666', 'Diğer', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(7, 'Eksen Filtre Dağıtım', 'Cem Arslan', '0216 600 07 07', 'satis@eksenfiltre.com', 'Dudullu OSB, İstanbul', '7777777777', 'Filtre', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(8, 'Atlas Fren Lojistik', 'Tolga Şahin', '0322 600 08 08', 'satis@atlasfren.com', 'Huzur OSB, Adana', '8888888888', 'Fren', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(9, 'Volta Elektrik Parça', 'Emre Yılmaz', '0352 600 09 09', 'satis@voltaelektrik.com', 'Hacılar OSB, Kayseri', '9999999999', 'Elektrik', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(10, 'YedekNet Genel Tedarik', 'Alper Kılıç', '0242 600 10 10', 'satis@yedeknet.com', 'Antalya OSB, Antalya', '1010101010', 'Diğer', '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_orders`
--

CREATE TABLE `supplier_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `order_date` date NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supplier_orders`
--

INSERT INTO `supplier_orders` (`id`, `supplier_id`, `order_number`, `total_amount`, `order_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'AP-103', '8500.00', '2026-03-12', 'pending', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(2, 1, 'AP-099', '12400.00', '2026-03-08', 'completed', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 2, 'DF-211', '15600.00', '2026-03-20', 'completed', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 5, 'MT-055', '9600.00', '2026-04-01', 'pending', '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_order_items`
--

CREATE TABLE `supplier_order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `supplier_order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supplier_order_items`
--

INSERT INTO `supplier_order_items` (`id`, `supplier_order_id`, `product_id`, `quantity`, `unit_price`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 50, '75.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(2, 1, 3, 30, '90.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(3, 2, 4, 60, '55.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(4, 2, 5, 50, '110.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(5, 3, 6, 40, '180.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(6, 3, 7, 30, '160.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(7, 4, 14, 8, '750.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(8, 4, 15, 20, '110.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11'),
(9, 4, 16, 15, '145.00', '2026-04-24 18:09:11', '2026-04-24 18:09:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Yönetici', 'admin@erp.local', NULL, '$2y$12$Qz5i5.D2xejD791GIIMahOrCB/7YmOOk5Vj61a/gxBQ5y95m6DxYW', 'admin', NULL, '2026-04-24 18:09:11', '2026-04-24 18:09:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_orders`
--
ALTER TABLE `customer_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_orders_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `customer_order_items`
--
ALTER TABLE `customer_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_order_items_customer_order_id_foreign` (`customer_order_id`),
  ADD KEY `customer_order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`),
  ADD KEY `invoices_customer_id_foreign` (`customer_id`),
  ADD KEY `invoices_supplier_id_foreign` (`supplier_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_items_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_customer_id_foreign` (`customer_id`),
  ADD KEY `payments_supplier_id_foreign` (`supplier_id`),
  ADD KEY `payments_invoice_id_foreign` (`invoice_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_sku_unique` (`sku`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `stock_logs`
--
ALTER TABLE `stock_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_logs_product_id_foreign` (`product_id`),
  ADD KEY `stock_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier_orders`
--
ALTER TABLE `supplier_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `supplier_orders_order_number_unique` (`order_number`),
  ADD KEY `supplier_orders_supplier_id_foreign` (`supplier_id`);

--
-- Indexes for table `supplier_order_items`
--
ALTER TABLE `supplier_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_order_items_supplier_order_id_foreign` (`supplier_order_id`),
  ADD KEY `supplier_order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `customer_orders`
--
ALTER TABLE `customer_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer_order_items`
--
ALTER TABLE `customer_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `stock_logs`
--
ALTER TABLE `stock_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `supplier_orders`
--
ALTER TABLE `supplier_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `supplier_order_items`
--
ALTER TABLE `supplier_order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_orders`
--
ALTER TABLE `customer_orders`
  ADD CONSTRAINT `customer_orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_order_items`
--
ALTER TABLE `customer_order_items`
  ADD CONSTRAINT `customer_order_items_customer_order_id_foreign` FOREIGN KEY (`customer_order_id`) REFERENCES `customer_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `customer_order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `invoices_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_logs`
--
ALTER TABLE `stock_logs`
  ADD CONSTRAINT `stock_logs_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `supplier_orders`
--
ALTER TABLE `supplier_orders`
  ADD CONSTRAINT `supplier_orders_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_order_items`
--
ALTER TABLE `supplier_order_items`
  ADD CONSTRAINT `supplier_order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `supplier_order_items_supplier_order_id_foreign` FOREIGN KEY (`supplier_order_id`) REFERENCES `supplier_orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
