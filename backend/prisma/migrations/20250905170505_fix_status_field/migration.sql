-- CreateEnum
CREATE TYPE "public"."VehicleActStatus" AS ENUM ('NEW', 'RECEIVED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."vehicle_acts" ADD COLUMN     "receivedAt" TIMESTAMP(3),
ADD COLUMN     "receiverLocationId" INTEGER;

-- CreateTable
CREATE TABLE "public"."receiver_locations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receiver_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "receiver_locations_name_key" ON "public"."receiver_locations"("name");

-- AddForeignKey
ALTER TABLE "public"."vehicle_acts" ADD CONSTRAINT "vehicle_acts_receiverLocationId_fkey" FOREIGN KEY ("receiverLocationId") REFERENCES "public"."receiver_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
