-- CreateEnum
CREATE TYPE "public"."InspectionTime" AS ENUM ('DAY', 'NIGHT', 'RAIN', 'SNOW');

-- CreateEnum
CREATE TYPE "public"."ExternalCondition" AS ENUM ('CLEAN', 'DIRTY', 'WET', 'DUSTY', 'SNOWY', 'ICY');

-- CreateEnum
CREATE TYPE "public"."FuelLevel" AS ENUM ('EMPTY', 'QUARTER', 'HALF', 'THREE_QUARTERS', 'FULL');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MANAGER', 'RECEIVER');

-- CreateEnum
CREATE TYPE "public"."InspectionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SeverityLevel" AS ENUM ('MINOR', 'MODERATE', 'SEVERE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."InteriorCondition" AS ENUM ('CLEAN', 'DIRTY', 'DAMAGED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'RECEIVER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."directions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "directions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transport_methods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "transport_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."car_brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."car_models" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "car_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehicles" (
    "id" SERIAL NOT NULL,
    "vin" TEXT NOT NULL,
    "licensePlate" TEXT,
    "year" INTEGER,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inspections" (
    "id" SERIAL NOT NULL,
    "status" "public"."InspectionStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "createdById" INTEGER NOT NULL,
    "assignedToId" INTEGER,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."damage_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severity" "public"."SeverityLevel" NOT NULL DEFAULT 'MINOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "damage_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inspection_damages" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "coordinates" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspectionId" INTEGER NOT NULL,
    "damageTypeId" INTEGER NOT NULL,

    CONSTRAINT "inspection_damages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehicle_acts" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "principal" TEXT,
    "sender" TEXT,
    "directionId" INTEGER,
    "transportMethodId" INTEGER,
    "vin" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "carBrandId" INTEGER,
    "carModelId" INTEGER,
    "color" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "fuelLevel" "public"."FuelLevel" NOT NULL,
    "internalContents" TEXT,
    "inspectionTime" "public"."InspectionTime" NOT NULL,
    "externalCondition" "public"."ExternalCondition" NOT NULL,
    "interiorCondition" "public"."InteriorCondition" NOT NULL DEFAULT 'CLEAN',
    "paintInspectionImpossible" BOOLEAN NOT NULL DEFAULT false,
    "equipment" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "vehicle_acts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."photos" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "vehicleActId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "directions_name_key" ON "public"."directions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "transport_methods_name_key" ON "public"."transport_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "car_brands_name_key" ON "public"."car_brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "car_models_brandId_name_key" ON "public"."car_models"("brandId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_vin_key" ON "public"."vehicles"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "damage_types_name_key" ON "public"."damage_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_acts_contractNumber_key" ON "public"."vehicle_acts"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_acts_vin_key" ON "public"."vehicle_acts"("vin");

-- AddForeignKey
ALTER TABLE "public"."car_models" ADD CONSTRAINT "car_models_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."car_brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicles" ADD CONSTRAINT "vehicles_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "public"."car_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inspections" ADD CONSTRAINT "inspections_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inspections" ADD CONSTRAINT "inspections_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inspections" ADD CONSTRAINT "inspections_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inspection_damages" ADD CONSTRAINT "inspection_damages_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "public"."inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inspection_damages" ADD CONSTRAINT "inspection_damages_damageTypeId_fkey" FOREIGN KEY ("damageTypeId") REFERENCES "public"."damage_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_acts" ADD CONSTRAINT "vehicle_acts_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "public"."directions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_acts" ADD CONSTRAINT "vehicle_acts_transportMethodId_fkey" FOREIGN KEY ("transportMethodId") REFERENCES "public"."transport_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_acts" ADD CONSTRAINT "vehicle_acts_carBrandId_fkey" FOREIGN KEY ("carBrandId") REFERENCES "public"."car_brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_acts" ADD CONSTRAINT "vehicle_acts_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "public"."car_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_acts" ADD CONSTRAINT "vehicle_acts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."photos" ADD CONSTRAINT "photos_vehicleActId_fkey" FOREIGN KEY ("vehicleActId") REFERENCES "public"."vehicle_acts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
