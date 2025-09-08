/*
  Warnings:

  - You are about to drop the column `receiverLocationId` on the `vehicle_acts` table. All the data in the column will be lost.
  - You are about to drop the `receiver_locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."vehicle_acts" DROP CONSTRAINT "vehicle_acts_receiverLocationId_fkey";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "locationId" INTEGER;

-- AlterTable
ALTER TABLE "public"."vehicle_acts" DROP COLUMN "receiverLocationId",
ADD COLUMN     "LocationId" INTEGER;

-- DropTable
DROP TABLE "public"."receiver_locations";

-- CreateTable
CREATE TABLE "public"."locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_key" ON "public"."locations"("name");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_acts" ADD CONSTRAINT "vehicle_acts_LocationId_fkey" FOREIGN KEY ("LocationId") REFERENCES "public"."locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
