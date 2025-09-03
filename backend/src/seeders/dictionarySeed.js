import { prisma } from '../app.js';

export async function seedDictionaries() {
  // Направления
  const directions = [
    'Москва',
    'Санкт-Петербург',
    'Новосибирск',
    'Екатеринбург',
    'Казань',
    'Нижний Новгород',
    'Красноярск',
    'Челябинск',
    'Самара',
    'Уфа'
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
    'Железнодорожный транспорт',
    'Автовоз',
    'Мультимодальная перевозка'
  ];

  for (const name of transportMethods) {
    await prisma.transportMethod.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('Справочники направлений и способов перевозки созданы');
}