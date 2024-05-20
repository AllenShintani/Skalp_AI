-- DropIndex
DROP INDEX `User_firebaseUid_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `firebaseUid` TEXT NOT NULL;
