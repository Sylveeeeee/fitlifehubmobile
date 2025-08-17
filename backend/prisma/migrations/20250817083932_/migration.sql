/*
  Warnings:

  - Added the required column `mealType` to the `ExerciseEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExerciseEntry` ADD COLUMN `mealType` VARCHAR(191) NOT NULL;
