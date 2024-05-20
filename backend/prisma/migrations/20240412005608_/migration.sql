/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[firebaseUid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebaseUid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `hashedPassword`,
    ADD COLUMN `firebaseUid` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_firebaseUid_key` ON `User`(`firebaseUid`);
