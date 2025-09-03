import { Module } from '@nestjs/common';
import { VehicleActService } from './vehicle-act.service';
import { VehicleActController } from './vehicle-act.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VehicleActController],
  providers: [VehicleActService],
  exports: [VehicleActService]
})
export class VehicleActModule {}