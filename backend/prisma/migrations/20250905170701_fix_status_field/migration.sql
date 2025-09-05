/*
  Warnings:

  - The `status` column on the `vehicle_acts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."vehicle_acts" DROP COLUMN "status",
ADD COLUMN     "status" "public"."VehicleActStatus" NOT NULL DEFAULT 'NEW';
