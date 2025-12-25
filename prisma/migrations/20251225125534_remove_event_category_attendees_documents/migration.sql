/*
  Warnings:

  - You are about to drop the column `categoryId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `event_attendees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `event_attendees` DROP FOREIGN KEY `event_attendees_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `event_documents` DROP FOREIGN KEY `event_documents_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `product_documents` DROP FOREIGN KEY `product_documents_productId_fkey`;

-- DropIndex
DROP INDEX `events_categoryId_idx` ON `events`;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `categoryId`;

-- DropTable
DROP TABLE `event_attendees`;

-- DropTable
DROP TABLE `event_categories`;

-- DropTable
DROP TABLE `event_documents`;

-- DropTable
DROP TABLE `product_documents`;
