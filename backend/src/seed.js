import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Очищаем существующие данные (осторожно!)
  await prisma.inspectionDamage.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.carModel.deleteMany();
  await prisma.carBrand.deleteMany();
  await prisma.user.deleteMany();

  // Создаем тестового пользователя-приемосдатчика
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'receiver@example.com',
      password: hashedPassword,
      name: 'Иван Петров',
      role: 'RECEIVER',
      isActive: true
    }
  });

  console.log('Created test user:', user);

  // Создаем марки автомобилей
  const toyota = await prisma.carBrand.create({
    data: { name: 'Toyota' }
  });

  const honda = await prisma.carBrand.create({
    data: { name: 'Honda' }
  });

  console.log('Created car brands:', { toyota, honda });

  // Создаем модели автомобилей
  const camry = await prisma.carModel.create({
    data: {
      name: 'Camry',
      brandId: toyota.id
    }
  });

  const civic = await prisma.carModel.create({
    data: {
      name: 'Civic',
      brandId: honda.id
    }
  });

  console.log('Created car models:', { camry, civic });

  // Создаем тестовое транспортное средство
  const testVehicle = await prisma.vehicle.create({
    data: {
      vin: 'ABC123456789DEF01',
      licensePlate: 'А123ВС77',
      modelId: camry.id,
      year: 2022,
      color: 'Черный'
    }
  });

  console.log('Created test vehicle:', testVehicle);

  // Создаем тестовый осмотр
  const inspection = await prisma.inspection.create({
    data: {
      vehicleId: testVehicle.id,
      status: 'COMPLETED',
      notes: 'Тестовый осмотр транспортного средства',
      createdById: user.id
    }
  });

  console.log('Created test inspection:', inspection);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });