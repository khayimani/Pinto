/*
  Warnings:

  - You are about to drop the column `meta` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the `Connector` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "meta",
ALTER COLUMN "providerId" DROP NOT NULL;

-- DropTable
DROP TABLE "Connector";
