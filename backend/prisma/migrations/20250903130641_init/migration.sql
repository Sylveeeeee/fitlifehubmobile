/*
  Warnings:

  - The values [Weight] on the enum `ExerciseEntry_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `ExerciseEntry` MODIFY `type` ENUM('Running', 'Swimming', 'Walking', 'Cycling', 'HIIT', 'BenchPress', 'Squat', 'Deadlift', 'PullUp', 'PushUp', 'ShoulderPress', 'Row', 'BicepCurl', 'TricepExtension', 'LegPress', 'Lunges', 'Plank', 'WeightTraining', 'Bodyweight', 'CrossFit', 'Yoga', 'Stretching', 'Pilates', 'BalanceBoard', 'Weightlifting', 'Other') NOT NULL;
