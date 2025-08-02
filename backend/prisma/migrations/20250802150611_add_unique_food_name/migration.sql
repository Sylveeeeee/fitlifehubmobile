/*
  Warnings:

  - A unique constraint covering the columns `[foodName]` on the table `Food` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Food_foodName_key` ON `Food`(`foodName`);
