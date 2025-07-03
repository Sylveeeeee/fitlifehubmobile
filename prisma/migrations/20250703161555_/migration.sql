/*
  Warnings:

  - You are about to drop the column `age` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `age`,
    ADD COLUMN `birthday` DATETIME(3) NULL,
    ADD COLUMN `height` DOUBLE NULL,
    ADD COLUMN `sex` VARCHAR(191) NULL,
    ADD COLUMN `weight` DOUBLE NULL;
