const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCarBrands() {
  const brands = [
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
    },
    {
      name: 'BMW',
      models: ['X5', 'X3', '3 Series', '5 Series', '7 Series', 'X1']
    },
    {
      name: 'Mercedes-Benz', 
      models: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class']
    },
    {
      name: 'Audi',
      models: ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3']
    },
    {
      name: 'Volkswagen',
      models: ['Polo', 'Jetta', 'Passat', 'Tiguan', 'Touareg', 'Golf']
    },
    {
      name: 'Skoda',
      models: ['Octavia', 'Rapid', 'Kodiaq', 'Superb', 'Karoq', 'Fabia']
    }
  ];

  for (const brandData of brands) {
    await prisma.carBrand.upsert({
      where: { name: brandData.name },
      update: {},
      create: {
        name: brandData.name,
        models: {
          create: brandData.models.map(modelName => ({
            name: modelName
          }))
        }
      }
    });
  }
  console.log('Марки автомобилей созданы');
}

async function seedDictionaries() {
  // Направления
  const directions = [
    'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
    'Нижний Новгород', 'Красноярск', 'Челябинск', 'Самара', 'Уфа',
    'Омск', 'Ростов-на-Дону', 'Краснодар', 'Воронеж', 'Пермь'
  ];

  for (const name of directions) {
    await prisma.direction.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  // Способы перевозки
  const transportMethods = [
    'Автотранспорт', 'Железнодорожный транспорт', 'Авиаперевозка',
    'Морской транспорт', 'Речной транспорт', 'Мультимодальная перевозка',
    'Контейнерные перевозки', 'Сборные грузы', 'Экспедирование'
  ];

  for (const name of transportMethods) {
    await prisma.transportMethod.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }
  console.log('Справочники созданы');
}

async function main() {
  console.log('Запуск сидера...');
  try {
    await seedCarBrands();
    await seedDictionaries();
    console.log('Сидер успешно выполнен!');
  } catch (error) {
    console.error('Ошибка сидера:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});