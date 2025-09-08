import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Очищаем существующие данные (осторожно!)
  await prisma.inspectionDamage.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vehicleAct.deleteMany();
  await prisma.photo.deleteMany();

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

  // Создаем марки и модели автомобилей
  const brandsData = [
    {
      name: 'Toyota',
      models: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Hilux', 'Prius']
    },
    {
      name: 'Honda', 
      models: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Fit', 'HR-V']
    },
    {
      name: 'Nissan',
      models: ['Qashqai', 'X-Trail', 'Patrol', 'Almera', 'Note', 'Juke']
    },
    {
      name: 'Hyundai',
      models: ['Solaris', 'Elantra', 'Tucson', 'Santa Fe', 'Creta', 'Sonata']
    },
    {
      name: 'Kia',
      models: ['Rio', 'Optima', 'Sportage', 'Sorento', 'Cerato', 'Stinger']
    }
  ];

  for (const brandData of brandsData) {
    const brand = await prisma.carBrand.create({
      data: {
        name: brandData.name,
        models: {
          create: brandData.models.map(modelName => ({
            name: modelName
          }))
        }
      }
    });
    console.log(`Created brand: ${brand.name}`);
  }

  // Создаем направления перевозок
  const directions = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
    'Нижний Новгород', 'Красноярск', 'Челябинск', 'Самара', 'Уфа'
  ];

  for (const name of directions) {
    await prisma.direction.create({
      data: { name }
    });
    console.log(`Created direction: ${name}`);
  }

  // Создаем способы перевозки
  const transportMethods = [
    'Автотранспорт', 'Железнодорожный транспорт', 'Авиаперевозка',
    'Морской транспорт', 'Речной транспорт', 'Мультимодальная перевозка'
  ];

  for (const name of transportMethods) {
    await prisma.transportMethod.create({
      data: { name }
    });
    console.log(`Created transport method: ${name}`);
  }

  // Создаем локации
  const locations = [
    { name: "Склад Северный", address: "ул. Северная, 1" },
    { name: "Склад Южный", address: "ул. Южная, 15" },
    { name: "Склад Центральный", address: "ул. Центральная, 25" },
    { name: "Терминал Восточный", address: "ул. Восточная, 42" },
    { name: "Логистический центр Западный", address: "ул. Западная, 7" }
  ];

  for (const location of locations) {
    await prisma.location.create({
      data: location
    });
    console.log(`Created location: ${location.name}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });