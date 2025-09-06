import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDictionaries() {
  console.log('Seeding dictionaries...');

  try {
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

    console.log('Dictionaries seeded successfully!');
  } catch (error) {
    console.error('Error seeding dictionaries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск сидера
seedDictionaries()
  .then(() => {
    console.log('Dictionaries seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Dictionaries seeding failed:', error);
    process.exit(1);
  });