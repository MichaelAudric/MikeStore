-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'No address',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Unnamed User';
