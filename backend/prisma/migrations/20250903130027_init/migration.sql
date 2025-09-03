-- AlterTable
ALTER TABLE `ExerciseEntry` MODIFY `type` ENUM('Running', 'Swimming', 'Walking', 'Cycling', 'HIIT', 'Weight', 'Bodyweight', 'CrossFit', 'BenchPress', 'Squat', 'Deadlift', 'PullUp', 'PushUp', 'ShoulderPress', 'Row', 'BicepCurl', 'TricepExtension', 'LegPress', 'Lunges', 'Plank', 'Yoga', 'Stretching', 'Pilates', 'BalanceBoard', 'Weightlifting', 'Other') NOT NULL;
