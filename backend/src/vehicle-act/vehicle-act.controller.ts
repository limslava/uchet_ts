import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Res, Req } from '@nestjs/common';
import { VehicleActService } from './vehicle-act.service';
import { CreateVehicleActDto } from './dto/create-vehicle-act.dto';
import { UpdateVehicleActDto } from './dto/update-vehicle-act.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('vehicle-acts')
export class VehicleActController {
  constructor(private readonly vehicleActService: VehicleActService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('photos'))
  async create(
    @Body() createVehicleActDto: CreateVehicleActDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any
  ) {
    return this.vehicleActService.create(createVehicleActDto, files, req.user.id);
  }

  @Get()
  findAll() {
    return this.vehicleActService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleActService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleActDto: UpdateVehicleActDto) {
    return this.vehicleActService.update(id, updateVehicleActDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleActService.remove(id);
  }

  @Get('uploads/:filename')
  async getPhoto(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = await this.vehicleActService.getPhoto(filename);
    res.sendFile(filePath);
  }

  @Get('check-vin/:vin')
  async checkVin(@Param('vin') vin: string) {
    const exists = await this.vehicleActService.checkVinExists(vin);
    return { exists };
  }

  @Get(':id/label')
  async generateLabel(@Param('id') id: string, @Res() res: Response) {
    try {
      const buffer = await this.vehicleActService.generateLabel(id);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="label-${id}.pdf"`);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ 
        message: 'Не удалось сгенерировать наклейку',
        error: error.message 
      });
    }
  }
}