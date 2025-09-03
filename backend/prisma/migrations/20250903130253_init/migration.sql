-- AlterTable
ALTER TABLE `ExerciseEntry` MODIFY `type` ENUM('Running', 'Swimming', 'Walking', 'Cycling', 'HIIT', 'BenchPress', 'Squat', 'Deadlift', 'PullUp', 'PushUp', 'ShoulderPress', 'Row', 'BicepCurl', 'TricepExtension', 'LegPress', 'Lunges', 'Plank', 'Weight', 'Bodyweight', 'CrossFit', 'Yoga', 'Stretching', 'Pilates', 'BalanceBoard', 'Weightlifting', 'Other') NOT NULL;
