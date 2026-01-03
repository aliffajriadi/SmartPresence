-- AlterTable
ALTER TABLE `password_otp` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX `password_otp_userid_id_idx` ON `password_otp`(`userid`, `id`);
