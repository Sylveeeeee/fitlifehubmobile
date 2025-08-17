-- CreateTable
CREATE TABLE `ExerciseEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `category` ENUM('Cardio', 'Gym', 'Strength', 'Flexibility', 'Balance', 'Other') NOT NULL,
    `type` ENUM('Running', 'Swimming', 'Walking', 'Cycling', 'HIIT', 'BenchPress', 'Squat', 'Deadlift', 'PullUp', 'PushUp', 'ShoulderPress', 'Row', 'BicepCurl', 'TricepExtension', 'LegPress', 'Lunges', 'Plank', 'Yoga', 'Stretching', 'Pilates', 'BalanceBoard', 'Weightlifting', 'Other') NOT NULL,
    `duration` INTEGER NOT NULL,
    `calories` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExerciseEntry` ADD CONSTRAINT `ExerciseEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
