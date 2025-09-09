import { prisma } from '../../utils/database.js';

export class DictionaryAdminController {
  
  // === МАРКИ АВТОМОБИЛЕЙ ===
  async getCarBrands(req, res) {
    try {
      const { page = 1, limit = 50, search, withModels = 'false' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      
      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }
      
      const include = {
        _count: {
          select: {
            vehicleActs: true,
            models: true
          }
        }
      };
      
      if (withModels === 'true') {
        include.models = {
          orderBy: { name: 'asc' }
        };
      }
      
      const [brands, total] = await Promise.all([
        prisma.carBrand.findMany({
          where,
          include,
          orderBy: { name: 'asc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.carBrand.count({ where })
      ]);
      
      res.json({
        brands,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get car brands error:', error);
      res.status(500).json({ error: 'Ошибка при получении марок автомобилей' });
    }
  }
  
  async createCarBrand(req, res) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название марки обязательно' });
      }
      
      const existingBrand = await prisma.carBrand.findUnique({
        where: { name: name.trim() }
      });
      
      if (existingBrand) {
        return res.status(409).json({ error: 'Марка с таким названием уже существует' });
      }
      
      const brand = await prisma.carBrand.create({
        data: { name: name.trim() },
        include: {
          models: true,
          _count: {
            select: {
              vehicleActs: true,
              models: true
            }
          }
        }
      });
      
      res.status(201).json(brand);
    } catch (error) {
      console.error('Create car brand error:', error);
      res.status(500).json({ error: 'Ошибка при создании марки автомобиля' });
    }
  }
  
  async updateCarBrand(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название марки обязательно' });
      }
      
      const brand = await prisma.carBrand.update({
        where: { id: parseInt(id) },
        data: { name: name.trim() },
        include: {
          models: true,
          _count: {
            select: {
              vehicleActs: true,
              models: true
            }
          }
        }
      });
      
      res.json(brand);
    } catch (error) {
      console.error('Update car brand error:', error);
      res.status(500).json({ error: 'Ошибка при обновлении марки автомобиля' });
    }
  }
  
  async deleteCarBrand(req, res) {
    try {
      const { id } = req.params;
      
      // Проверяем, используется ли марка в актах
      const brandWithActs = await prisma.carBrand.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: {
              vehicleActs: true,
              models: true
            }
          }
        }
      });
      
      if (!brandWithActs) {
        return res.status(404).json({ error: 'Марка автомобиля не найдена' });
      }
      
      if (brandWithActs._count.vehicleActs > 0) {
        return res.status(400).json({ 
          error: 'Нельзя удалить марку, которая используется в актах приёмки' 
        });
      }
      
      if (brandWithActs._count.models > 0) {
        return res.status(400).json({ 
          error: 'Нельзя удалить марку, у которой есть модели. Сначала удалите все модели.' 
        });
      }
      
      await prisma.carBrand.delete({
        where: { id: parseInt(id) }
      });
      
      res.json({ message: 'Марка автомобиля удалена' });
    } catch (error) {
      console.error('Delete car brand error:', error);
      res.status(500).json({ error: 'Ошибка при удалении марки автомобиля' });
    }
  }
  
  // === МОДЕЛИ АВТОМОБИЛЕЙ ===
  async getCarModels(req, res) {
    try {
      const { brandId, page = 1, limit = 50, search } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      
      if (brandId) {
        where.brandId = parseInt(brandId);
      }
      
      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }
      
      const [models, total] = await Promise.all([
        prisma.carModel.findMany({
          where,
          include: {
            brand: true,
            _count: {
              select: {
                vehicleActs: true,
                vehicles: true
              }
            }
          },
          orderBy: { name: 'asc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.carModel.count({ where })
      ]);
      
      res.json({
        models,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get car models error:', error);
      res.status(500).json({ error: 'Ошибка при получении моделей автомобилей' });
    }
  }
  
  async createCarModel(req, res) {
    try {
      const { brandId, name, bodyType } = req.body;
      
      if (!brandId || !name || name.trim().length === 0) {
        return res.status(400).json({ error: 'ID марки и название модели обязательны' });
      }
      
      // Проверяем существование марки
      const brand = await prisma.carBrand.findUnique({
        where: { id: parseInt(brandId) }
      });
      
      if (!brand) {
        return res.status(404).json({ error: 'Марка автомобиля не найдена' });
      }
      
      const existingModel = await prisma.carModel.findFirst({
        where: {
          brandId: parseInt(brandId),
          name: name.trim()
        }
      });
      
      if (existingModel) {
        return res.status(409).json({ error: 'Модель с таким названием уже существует у этой марки' });
      }
      
      const model = await prisma.carModel.create({
        data: {
          name: name.trim(),
          bodyType: bodyType || null,
          brand: { connect: { id: parseInt(brandId) } }
        },
        include: {
          brand: true,
          _count: {
            select: {
              vehicleActs: true,
              vehicles: true
            }
          }
        }
      });
      
      res.status(201).json(model);
    } catch (error) {
      console.error('Create car model error:', error);
      res.status(500).json({ error: 'Ошибка при создании модели автомобиля' });
    }
  }
  
  async updateCarModel(req, res) {
    try {
      const { id } = req.params;
      const { name, bodyType } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название модели обязательно' });
      }
      
      const model = await prisma.carModel.update({
        where: { id: parseInt(id) },
        data: {
          name: name.trim(),
          bodyType: bodyType || null
        },
        include: {
          brand: true,
          _count: {
            select: {
              vehicleActs: true,
              vehicles: true
            }
          }
        }
      });
      
      res.json(model);
    } catch (error) {
      console.error('Update car model error:', error);
      res.status(500).json({ error: 'Ошибка при обновлении модели автомобиля' });
    }
  }
  
  async deleteCarModel(req, res) {
    try {
      const { id } = req.params;
      
      // Проверяем, используется ли модель в актах
      const modelWithActs = await prisma.carModel.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: {
              vehicleActs: true,
              vehicles: true
            }
          }
        }
      });
      
      if (!modelWithActs) {
        return res.status(404).json({ error: 'Модель автомобиля не найдена' });
      }
      
      if (modelWithActs._count.vehicleActs > 0) {
        return res.status(400).json({ 
          error: 'Нельзя удалить модель, которая используется в актах приёмки' 
        });
      }
      
      if (modelWithActs._count.vehicles > 0) {
        return res.status(400).json({ 
          error: 'Нельзя удалить модель, которая используется в транспортных средствах' 
        });
      }
      
      await prisma.carModel.delete({
        where: { id: parseInt(id) }
      });
      
      res.json({ message: 'Модель автомобиля удалена' });
    } catch (error) {
      console.error('Delete car model error:', error);
      res.status(500).json({ error: 'Ошибка при удалении модели автомобиля' });
    }
  }
  
  // === НАПРАВЛЕНИЯ ПЕРЕВОЗОК ===
  async getDirections(req, res) {
    try {
      const { page = 1, limit = 50, search, isActive } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      
      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }
      
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }
      
      const [directions, total] = await Promise.all([
        prisma.direction.findMany({
          where,
          include: {
            _count: {
              select: {
                vehicleActs: true
              }
            }
          },
          orderBy: { name: 'asc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.direction.count({ where })
      ]);
      
      res.json({
        directions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get directions error:', error);
      res.status(500).json({ error: 'Ошибка при получении направлений' });
    }
  }
  
  async createDirection(req, res) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название направления обязательно' });
      }
      
      const existingDirection = await prisma.direction.findUnique({
        where: { name: name.trim() }
      });
      
      if (existingDirection) {
        return res.status(409).json({ error: 'Направление с таким названием уже существует' });
      }
      
      const direction = await prisma.direction.create({
        data: { 
          name: name.trim(),
          isActive: true
        },
        include: {
          _count: {
            select: {
              vehicleActs: true
            }
          }
        }
      });
      
      res.status(201).json(direction);
    } catch (error) {
      console.error('Create direction error:', error);
      res.status(500).json({ error: 'Ошибка при создании направления' });
    }
  }
  
  async updateDirection(req, res) {
    try {
      const { id } = req.params;
      const { name, isActive } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название направления обязательно' });
      }
      
      const direction = await prisma.direction.update({
        where: { id: parseInt(id) },
        data: { 
          name: name.trim(),
          isActive: isActive !== undefined ? isActive : undefined
        },
        include: {
          _count: {
            select: {
              vehicleActs: true
            }
          }
        }
      });
      
      res.json(direction);
    } catch (error) {
      console.error('Update direction error:', error);
      res.status(500).json({ error: 'Ошибка при обновлении направления' });
    }
  }
  
  async deleteDirection(req, res) {
    try {
      const { id } = req.params;
      
      // Проверяем, используется ли направление в актах
      const directionWithActs = await prisma.direction.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: {
              vehicleActs: true
            }
          }
        }
      });
      
      if (!directionWithActs) {
        return res.status(404).json({ error: 'Направление не найдено' });
      }
      
      if (directionWithActs._count.vehicleActs > 0) {
        return res.status(400).json({ 
          error: 'Нельзя удалить направление, которое используется в актах приёмки' 
        });
      }
      
      await prisma.direction.delete({
        where: { id: parseInt(id) }
      });
      
      res.json({ message: 'Направление удалено' });
    } catch (error) {
      console.error('Delete direction error:', error);
      res.status(500).json({ error: 'Ошибка при удалении направления' });
    }
  }
  
  // === СПОСОБЫ ПЕРЕВОЗКИ ===
  async getTransportMethods(req, res) {
    try {
      const { page = 1, limit = 50, search, isActive } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      
      if (search) {
        where.name = { contains: search, mode: 'insensitive' };
      }
      
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }
      
      const [methods, total] = await Promise.all([
        prisma.transportMethod.findMany({
          where,
          include: {
            _count: {
              select: {
                vehicleActs: true
              }
            }
          },
          orderBy: { name: 'asc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.transportMethod.count({ where })
      ]);
      
      res.json({
        methods,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get transport methods error:', error);
      res.status(500).json({ error: 'Ошибка при получении способов перевозки' });
    }
  }
  
  async createTransportMethod(req, res) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название способа перевозки обязательно' });
      }
      
      const existingMethod = await prisma.transportMethod.findUnique({
        where: { name: name.trim() }
      });
      
      if (existingMethod) {
        return res.status(409).json({ error: 'Способ перевозки с таким названием уже существует' });
      }
      
      const method = await prisma.transportMethod.create({
        data: { 
          name: name.trim(),
          isActive: true
        },
        include: {
          _count: {
            select: {
              vehicleActs: true
            }
          }
        }
      });
      
      res.status(201).json(method);
    } catch (error) {
      console.error('Create transport method error:', error);
      res.status(500).json({ error: 'Ошибка при создании способа перевозки' });
    }
  }
  
  async updateTransportMethod(req, res) {
    try {
      const { id } = req.params;
      const { name, isActive } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название способа перевозки обязательно' });
      }
      
      const method = await prisma.transportMethod.update({
        where: { id: parseInt(id) },
        data: { 
          name: name.trim(),
          isActive: isActive !== undefined ? isActive : undefined
        },
        include: {
          _count: {
            select: {
              vehicleActs: true
            }
          }
        }
      });
      
      res.json(method);
    } catch (error) {
      console.error('Update transport method error:', error);
      res.status(500).json({ error: 'Ошибка при обновлении способа перевозки' });
    }
  }
  
  async deleteTransportMethod(req, res) {
    try {
      const { id } = req.params;
      
      // Проверяем, используется ли способ перевозки в актах
      const methodWithActs = await prisma.transportMethod.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: {
              vehicleActs: true
            }
          }
        }
      });
      
      if (!methodWithActs) {
        return res.status(404).json({ error: 'Способ перевозки не найден' });
      }
      
      if (methodWithActs._count.vehicleActs > 0) {
        return res.status(400).json({ 
          error: 'Нельзя удалить способ перевозки, который используется в актах приёмки' 
        });
      }
      
      await prisma.transportMethod.delete({
        where: { id: parseInt(id) }
      });
      
      res.json({ message: 'Способ перевозки удален' });
    } catch (error) {
      console.error('Delete transport method error:', error);
      res.status(500).json({ error: 'Ошибка при удалении способа перевозки' });
    }
  }
  
  // === ЛОКАЦИИ ===
  async getLocations(req, res) {
    try {
      const { page = 1, limit = 50, search, isActive } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const where = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }
      
      const [locations, total] = await Promise.all([
        prisma.location.findMany({
          where,
          include: {
            _count: {
              select: {
                users: true,
                vehicleActs: true
              }
            }
          },
          orderBy: { name: 'asc' },
          skip,
          take: parseInt(limit)
        }),
        prisma.location.count({ where })
      ]);
      
      res.json({
        locations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Get locations error:', error);
      res.status(500).json({ error: 'Ошибка при получении локаций' });
    }
  }
  
  async createLocation(req, res) {
    try {
      const { name, address, city } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название локации обязательно' });
      }
      
      if (!address || address.trim().length === 0) {
        return res.status(400).json({ error: 'Адрес локации обязателен' });
      }
      
      const existingLocation = await prisma.location.findUnique({
        where: { name: name.trim() }
      });
      
      if (existingLocation) {
        return res.status(409).json({ error: 'Локация с таким названием уже существует' });
      }
      
      const location = await prisma.location.create({
        data: { 
          name: name.trim(),
          address: address.trim(),
          city: city ? city.trim() : null,
          isActive: true
        },
        include: {
          _count: {
            select: {
              users: true,
              vehicleActs: true
            }
          }
        }
      });
      
      res.status(201).json(location);
    } catch (error) {
      console.error('Create location error:', error);
      res.status(500).json({ error: 'Ошибка при создании локации' });
    }
  }
  
  async updateLocation(req, res) {
    try {
      const { id } = req.params;
      const { name, address, city, isActive } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Название локации обязательно' });
      }
      
      if (!address || address.trim().length === 0) {
        return res.status(400).json({ error: 'Адрес локации обязателен' });
      }
      
      const location = await prisma.location.update({
        where: { id: parseInt(id) },
        data: { 
          name: name.trim(),
          address: address.trim(),
          city: city ? city.trim() : null,
          isActive: isActive !== undefined ? isActive : undefined
        },
        include: {
          _count: {
            select: {
              users: true,
              vehicleActs: true
            }
          }
        }
      });
      
      res.json(location);
    } catch (error) {
      console.error('Update location error:', error);
      res.status(500).json({ error: 'Ошибка при обновлении локации' });
    }
  }
  
  async deleteLocation(req, res) {
    try {
      const { id } = req.params;
      
      // Проверяем, используется ли локация
      const locationWithUsage = await prisma.location.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: {
              users: true,
              vehicleActs: true
            }
          }
        }
      });
      
      if (!locationWithUsage) {
        return res.status(404).json({ error: 'Локация не найдена' });
      }
      
      if (locationWithUsage._count.users > 0) {
        return res.status(400).json({ 
          error: 'Нельзя удалить локацию, которая назначена пользователям' 
        });
      }
      
      if (locationWithUsage._count.vehicleActs > 0) {
        return res.status(400).json({ 
          error: 'Нельзя удалить локацию, которая используется в актах приёмки' 
        });
      }
      
      await prisma.location.delete({
        where: { id: parseInt(id) }
      });
      
      res.json({ message: 'Локация удалена' });
    } catch (error) {
      console.error('Delete location error:', error);
      res.status(500).json({ error: 'Ошибка при удалении локации' });
    }
  }
}

export const dictionaryAdminController = new DictionaryAdminController();