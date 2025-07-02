/*
  Warnings:

  - Added the required column `carbs` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `FoodEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `foodentry` ADD COLUMN `carbs` DOUBLE NOT NULL,
    ADD COLUMN `fat` DOUBLE NOT NULL,
    ADD COLUMN `fiber` DOUBLE NULL,
    ADD COLUMN `protein` DOUBLE NOT NULL;
