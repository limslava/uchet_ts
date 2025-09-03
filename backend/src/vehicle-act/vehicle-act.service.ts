import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleActDto } from './dto/create-vehicle-act.dto';
import { UpdateVehicleActDto } from './dto/update-vehicle-act.dto';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';

@Injectable()
export class VehicleActService {
  constructor(private prisma: PrismaService) {}

  private async generateContractNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    
    const todaysActsCount = await this.prisma.vehicleAct.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    });
    
    const sequenceNumber = (todaysActsCount + 1).toString().padStart(2, '0');
    
    return `ДП${year}${month}-${day}-${sequenceNumber}`;
  }

  async create(createVehicleActDto: CreateVehicleActDto, files: Express.Multer.File[], userId: string) {
    try {
      const contractNumber = await this.generateContractNumber();
      
      // Создаем папку для загрузок если нет
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Обрабатываем фотографии
      const photoNames = files.map(file => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.originalname}`;
        const filePath = path.join(uploadsDir, uniqueName);
        fs.writeFileSync(filePath, file.buffer);
        return uniqueName;
      });

      // Создаем акт с фотографиями
      return await this.prisma.vehicleAct.create({
        data: {
          ...createVehicleActDto,
          contractNumber,
          date: new Date(),
          photos: {
            create: photoNames.map(filename => ({ filename }))
          },
          userId
        },
        include: {
          photos: true
        }
      });

    } catch (error) {
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target && target.includes('vin')) {
          throw new ConflictException(`Акт с VIN ${createVehicleActDto.vin} уже существует`);
        }
        throw new ConflictException('Запись с такими данными уже существует');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.vehicleAct.findMany({
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const act = await this.prisma.vehicleAct.findUnique({
      where: { id },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    if (!act) {
      throw new NotFoundException(`Акт с ID ${id} не найден`);
    }
    
    return act;
  }

  async checkVinExists(vin: string): Promise<boolean> {
    const act = await this.prisma.vehicleAct.findUnique({
      where: { vin }
    });
    return !!act;
  }

  async update(id: string, updateVehicleActDto: UpdateVehicleActDto) {
    return this.prisma.vehicleAct.update({
      where: { id },
      data: updateVehicleActDto,
      include: {
        photos: true
      }
    });
  }

  async remove(id: string) {
    // Сначала удаляем фотографии
    await this.prisma.photo.deleteMany({
      where: { vehicleActId: id }
    });
    
    // Затем удаляем акт
    return this.prisma.vehicleAct.delete({
      where: { id }
    });
  }

  async getPhoto(filename: string) {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }

    return filePath;
  }

  async generateLabel(id: string): Promise<Buffer> {
    const act = await this.findOne(id);
    
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'A6',
          margins: { top: 20, bottom: 20, left: 20, right: 20 }
        });
        
        const buffers: any[] = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Заголовок
        doc.fontSize(14).text('Акт приёма-передачи ТС', { align: 'center' });
        doc.moveDown(0.5);

        // Данные ТС
        doc.fontSize(10);
        doc.text(`VIN: ${act.vin || ''}`);
        doc.text(`Гос. номер: ${act.licensePlate || ''}`);
        doc.text(`Марка/модель: ${act.makeModel || ''}`);
        doc.text(`Акт №: ${act.contractNumber || ''}`);
        
        doc.moveDown(1);
        
        // QR код с ID акта
        doc.fontSize(8).text(`ID: ${act.id}`, { align: 'center' });
        doc.text(`Скан для просмотра`, { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}