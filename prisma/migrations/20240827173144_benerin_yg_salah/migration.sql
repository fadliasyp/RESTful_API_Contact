/*
  Warnings:

  - You are about to drop the column `contry` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `country` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `contry`,
    ADD COLUMN `country` VARCHAR(100) NOT NULL;
