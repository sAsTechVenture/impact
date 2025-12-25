/*
  Warnings:

  - You are about to drop the column `designation` on the `event_attendees` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `event_attendees` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `event_categories` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `event_documents` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `currentAttendees` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `fullDescription` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrls` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `isAllDay` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioUrl` on the `job_applications` table. All the data in the column will be lost.
  - You are about to drop the column `applicationUrl` on the `job_postings` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `job_postings` table. All the data in the column will be lost.
  - You are about to drop the column `fullDescription` on the `job_postings` table. All the data in the column will be lost.
  - You are about to drop the column `qualifications` on the `job_postings` table. All the data in the column will be lost.
  - You are about to drop the column `responsibilities` on the `job_postings` table. All the data in the column will be lost.
  - You are about to drop the column `salaryType` on the `job_postings` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `job_postings` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `job_postings` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `product_documents` table. All the data in the column will be lost.
  - You are about to drop the column `fullDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrls` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `primaryImageUrl` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `service_categories` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `service_inquiries` table. All the data in the column will be lost.
  - You are about to drop the column `benefits` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `fullDescription` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrls` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `priceType` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `services` table. All the data in the column will be lost.
  - You are about to drop the `event_speakers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_packages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `event_speakers` DROP FOREIGN KEY `event_speakers_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `service_packages` DROP FOREIGN KEY `service_packages_serviceId_fkey`;

-- DropIndex
DROP INDEX `event_attendees_registrationDate_idx` ON `event_attendees`;

-- DropIndex
DROP INDEX `events_isFeatured_idx` ON `events`;

-- DropIndex
DROP INDEX `job_applications_appliedAt_idx` ON `job_applications`;

-- DropIndex
DROP INDEX `job_postings_postedAt_idx` ON `job_postings`;

-- DropIndex
DROP INDEX `products_createdAt_idx` ON `products`;

-- DropIndex
DROP INDEX `service_inquiries_createdAt_idx` ON `service_inquiries`;

-- AlterTable
ALTER TABLE `event_attendees` DROP COLUMN `designation`,
    DROP COLUMN `notes`;

-- AlterTable
ALTER TABLE `event_categories` DROP COLUMN `color`;

-- AlterTable
ALTER TABLE `event_documents` DROP COLUMN `fileSize`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `country`,
    DROP COLUMN `currentAttendees`,
    DROP COLUMN `fullDescription`,
    DROP COLUMN `imageUrls`,
    DROP COLUMN `isAllDay`,
    DROP COLUMN `keywords`,
    DROP COLUMN `metaDescription`,
    DROP COLUMN `metaTitle`,
    DROP COLUMN `shortDescription`,
    DROP COLUMN `state`,
    DROP COLUMN `viewCount`,
    ADD COLUMN `description` TEXT NULL;

-- AlterTable
ALTER TABLE `job_applications` DROP COLUMN `address`,
    DROP COLUMN `linkedinUrl`,
    DROP COLUMN `portfolioUrl`;

-- AlterTable
ALTER TABLE `job_postings` DROP COLUMN `applicationUrl`,
    DROP COLUMN `experienceLevel`,
    DROP COLUMN `fullDescription`,
    DROP COLUMN `qualifications`,
    DROP COLUMN `responsibilities`,
    DROP COLUMN `salaryType`,
    DROP COLUMN `shortDescription`,
    DROP COLUMN `viewCount`,
    ADD COLUMN `description` TEXT NULL;

-- AlterTable
ALTER TABLE `product_documents` DROP COLUMN `fileSize`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `fullDescription`,
    DROP COLUMN `imageUrls`,
    DROP COLUMN `keywords`,
    DROP COLUMN `metaDescription`,
    DROP COLUMN `metaTitle`,
    DROP COLUMN `primaryImageUrl`,
    DROP COLUMN `shortDescription`,
    DROP COLUMN `stockQuantity`,
    DROP COLUMN `viewCount`,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `imageUrl` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `service_categories` DROP COLUMN `icon`;

-- AlterTable
ALTER TABLE `service_inquiries` DROP COLUMN `notes`;

-- AlterTable
ALTER TABLE `services` DROP COLUMN `benefits`,
    DROP COLUMN `fullDescription`,
    DROP COLUMN `imageUrls`,
    DROP COLUMN `keywords`,
    DROP COLUMN `metaDescription`,
    DROP COLUMN `metaTitle`,
    DROP COLUMN `priceType`,
    DROP COLUMN `shortDescription`,
    ADD COLUMN `description` TEXT NULL;

-- DropTable
DROP TABLE `event_speakers`;

-- DropTable
DROP TABLE `service_packages`;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `designation` VARCHAR(255) NOT NULL,
    `department` VARCHAR(255) NULL,
    `bio` TEXT NULL,
    `imageUrl` VARCHAR(500) NULL,
    `linkedinUrl` VARCHAR(500) NULL,
    `managerId` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `joinedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_email_key`(`email`),
    INDEX `employees_managerId_idx`(`managerId`),
    INDEX `employees_department_idx`(`department`),
    INDEX `employees_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
