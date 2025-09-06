import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCarBrands() {
  console.log('Seeding car brands...');

  try {
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

    console.log('Car brands seeded successfully!');
  } catch (error) {
    console.error('Error seeding car brands:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск сидера
seedCarBrands()
  .then(() => {
    console.log('Car brands seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Car brands seeding failed:', error);
    process.exit(1);
  });