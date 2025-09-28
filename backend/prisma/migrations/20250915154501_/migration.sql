/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `DailyGoal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DailyGoal_userId_date_key` ON `DailyGoal`(`userId`, `date`);
