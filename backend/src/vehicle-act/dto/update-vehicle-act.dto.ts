import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsObject } from 'class-validator';
import { InspectionTime, ExternalCondition, FuelLevel } from '@prisma/client';

export class CreateVehicleActDto {
  @IsOptional()
  @IsString()
  principal?: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  direction?: string;

  @IsOptional()
  @IsString()
  transportMethod?: string;

  @IsString()
  vin: string;

  @IsString()
  licensePlate: string;

  @IsString()
  makeModel: string;

  @IsString()
  color: string;

  @IsNumber()
  year: number;

  @IsEnum(FuelLevel)
  fuelLevel: FuelLevel;

  @IsOptional()
  @IsString()
  internalContents?: string;

  @IsEnum(InspectionTime)
  inspectionTime: InspectionTime;

  @IsEnum(ExternalCondition)
  externalCondition: ExternalCondition;

  @IsBoolean()
  paintInspectionImpossible: boolean;

  @IsObject()
  equipment: Record<string, string>;
}