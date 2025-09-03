import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleActDto } from './create-vehicle-act.dto';

export class UpdateVehicleActDto extends PartialType(CreateVehicleActDto) {}