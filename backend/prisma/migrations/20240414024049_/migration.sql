/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `firebaseUid` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_firebaseUid_key` ON `User`(`firebaseUid`);
