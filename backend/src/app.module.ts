import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { InspectionsModule } from './inspections/inspections.module';
import { VehicleActModule } from './vehicle-act/vehicle-act.module'; // Должен быть здесь

@Module({
  imports: [
    AuthModule,
    UsersModule,
    VehiclesModule,
    InspectionsModule,
    VehicleActModule, // И здесь
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}