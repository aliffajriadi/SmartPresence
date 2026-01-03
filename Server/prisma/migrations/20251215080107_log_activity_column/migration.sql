-- CreateTable
CREATE TABLE `log_aktifitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` INTEGER NOT NULL,
    `os` VARCHAR(191) NOT NULL,
    `browser` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `isMobile` BOOLEAN NOT NULL,
    `aktivitas` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `log_aktifitas_userid_idx`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log_aktifitas` ADD CONSTRAINT `log_aktifitas_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
