import { prisma } from '../app.js';

export async function seedCarBrands() {
  const brands = [
    {
      name: 'Toyota',
      models: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Hilux']
    },
    {
      name: 'Honda',
      models: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Fit']
    },
    {
      name: 'Nissan',
      models: ['Qashqai', 'X-Trail', 'Patrol', 'Almera', 'Note']
    },
    {
      name: 'Hyundai',
      models: ['Solaris', 'Elantra', 'Tucson', 'Santa Fe', 'Creta']
    },
    {
      name: 'Kia',
      models: ['Rio', 'Optima', 'Sportage', 'Sorento', 'Cerato']
    }
  ];

  for (const brandData of brands) {
    const brand = await prisma.carBrand.upsert({
      where: { name: brandData.name },
      update: {},
      create: {
        name: brandData.name,
        models: {
          create: brandData.models.map(modelName => ({
            name: modelName
          }))
        }
      },
      include: { models: true }
    });
  }
}