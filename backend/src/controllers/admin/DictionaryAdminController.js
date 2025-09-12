// backend/src/controllers/admin/DictionaryAdminController.js
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger.js';

const prisma = new PrismaClient();

// ========================= CAR BRANDS =========================
export const getCarBrands = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', isActive = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(isActive !== '' && { isActive: isActive === 'true' })
    };

    const [brands, total] = await prisma.$transaction([
      prisma.carBrand.findMany({
        where,
        skip: +offset,
        take: +limit,
        orderBy: { id: 'asc' }
      }),
      prisma.carBrand.count({ where })
    ]);

    res.json({ brands, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
};

export const createCarBrand = async (req, res, next) => {
  try {
    const brand = await prisma.carBrand.create({ data: req.body });
    res.status(201).json(brand);
  } catch (e) { next(e); }
};

export const updateCarBrand = async (req, res, next) => {
  try {
    const brand = await prisma.carBrand.update({
      where: { id: +req.params.id },
      data: req.body
    });
    res.json(brand);
  } catch (e) { next(e); }
};

export const deleteCarBrand = async (req, res, next) => {
  try {
    await prisma.carBrand.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

// ========================= CAR MODELS =========================
export const getCarModels = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', brandId = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(brandId && { brandId: +brandId })
    };

    const [models, total] = await prisma.$transaction([
      prisma.carModel.findMany({
        where,
        skip: +offset,
        take: +limit,
        orderBy: { id: 'asc' },
        include: { brand: true }
      }),
      prisma.carModel.count({ where })
    ]);

    res.json({ models, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
};

export const createCarModel = async (req, res, next) => {
  try {
    const model = await prisma.carModel.create({ data: req.body });
    res.status(201).json(model);
  } catch (e) { next(e); }
};

export const updateCarModel = async (req, res, next) => {
  try {
    const model = await prisma.carModel.update({
      where: { id: +req.params.id },
      data: req.body
    });
    res.json(model);
  } catch (e) { next(e); }
};

export const deleteCarModel = async (req, res, next) => {
  try {
    await prisma.carModel.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

// ========================= DIRECTIONS =========================
export const getDirections = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', isActive = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(isActive !== '' && { isActive: isActive === 'true' })
    };

    const [directions, total] = await prisma.$transaction([
      prisma.direction.findMany({
        where,
        skip: +offset,
        take: +limit,
        orderBy: { id: 'asc' }
      }),
      prisma.direction.count({ where })
    ]);

    res.json({ directions, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
};

export const createDirection = async (req, res, next) => {
  try {
    const direction = await prisma.direction.create({ data: req.body });
    res.status(201).json(direction);
  } catch (e) { next(e); }
};

export const updateDirection = async (req, res, next) => {
  try {
    const direction = await prisma.direction.update({
      where: { id: +req.params.id },
      data: req.body
    });
    res.json(direction);
  } catch (e) { next(e); }
};

export const deleteDirection = async (req, res, next) => {
  try {
    await prisma.direction.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

// ========================= TRANSPORT METHODS =========================
export const getTransportMethods = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', isActive = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(isActive !== '' && { isActive: isActive === 'true' })
    };

    const [methods, total] = await prisma.$transaction([
      prisma.transportMethod.findMany({
        where,
        skip: +offset,
        take: +limit,
        orderBy: { id: 'asc' }
      }),
      prisma.transportMethod.count({ where })
    ]);

    res.json({ transportMethods: methods, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
};

export const createTransportMethod = async (req, res, next) => {
  try {
    const method = await prisma.transportMethod.create({ data: req.body });
    res.status(201).json(method);
  } catch (e) { next(e); }
};

export const updateTransportMethod = async (req, res, next) => {
  try {
    const method = await prisma.transportMethod.update({
      where: { id: +req.params.id },
      data: req.body
    });
    res.json(method);
  } catch (e) { next(e); }
};

export const deleteTransportMethod = async (req, res, next) => {
  try {
    await prisma.transportMethod.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

// ========================= LOCATIONS =========================
export const getLocations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', isActive = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(isActive !== '' && { isActive: isActive === 'true' })
    };

    const [locations, total] = await prisma.$transaction([
      prisma.location.findMany({
        where,
        skip: +offset,
        take: +limit,
        orderBy: { id: 'asc' }
      }),
      prisma.location.count({ where })
    ]);

    res.json({ locations, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
};

export const createLocation = async (req, res, next) => {
  try {
    const location = await prisma.location.create({ data: req.body });
    res.status(201).json(location);
  } catch (e) { next(e); }
};

export const updateLocation = async (req, res, next) => {
  try {
    const location = await prisma.location.update({
      where: { id: +req.params.id },
      data: req.body
    });
    res.json(location);
  } catch (e) { next(e); }
};

export const deleteLocation = async (req, res, next) => {
  try {
    await prisma.location.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

// ========================= DRIVERS =========================
export const getDrivers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', isActive = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(isActive !== '' && { isActive: isActive === 'true' })
    };

    const [drivers, total] = await prisma.$transaction([
      prisma.driver.findMany({
        where,
        skip: +offset,
        take: +limit,
        orderBy: { id: 'asc' }
      }),
      prisma.driver.count({ where })
    ]);

    res.json({ drivers, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
};

export const createDriver = async (req, res, next) => {
  try {
    const driver = await prisma.driver.create({ data: req.body });
    res.status(201).json(driver);
  } catch (e) { next(e); }
};

export const updateDriver = async (req, res, next) => {
  try {
    const driver = await prisma.driver.update({
      where: { id: +req.params.id },
      data: req.body
    });
    res.json(driver);
  } catch (e) { next(e); }
};

export const deleteDriver = async (req, res, next) => {
  try {
    await prisma.driver.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

// ========================= COMPANY VEHICLES =========================
export const getCompanyVehicles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', isActive = '', park = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { brand: { contains: search, mode: 'insensitive' } },
          { model: { contains: search, mode: 'insensitive' } },
          { licensePlate: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(isActive !== '' && { isActive: isActive === 'true' }),
      ...(park && { park })
    };

    const [vehicles, total] = await prisma.$transaction([
      prisma.companyVehicle.findMany({
        where,
        skip: +offset,
        take: +limit,
        orderBy: { id: 'asc' }
      }),
      prisma.companyVehicle.count({ where })
    ]);

    res.json({
      vehicles,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (e) { next(e); }
};

export const createCompanyVehicle = async (req, res, next) => {
  try {
    const vehicle = await prisma.companyVehicle.create({ data: req.body });
    res.status(201).json(vehicle);
  } catch (e) { next(e); }
};

export const updateCompanyVehicle = async (req, res, next) => {
  try {
    const vehicle = await prisma.companyVehicle.update({
      where: { id: +req.params.id },
      data: req.body
    });
    res.json(vehicle);
  } catch (e) { next(e); }
};

export const deleteCompanyVehicle = async (req, res, next) => {
  try {
    await prisma.companyVehicle.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

// ========================= CONTAINERS =========================
export const getContainers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', isActive = '', ownership = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { number: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(isActive !== '' && { isActive: isActive === 'true' }),
      ...(ownership && { ownership })
    };

    const [containers, total] = await prisma.$transaction([
      prisma.container.findMany({
        where,
        skip: +offset,
        take: +limit,
        orderBy: { id: 'asc' }
      }),
      prisma.container.count({ where })
    ]);

    res.json({ containers, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / limit) } });
  } catch (e) { next(e); }
};

export const createContainer = async (req, res, next) => {
  try {
    const container = await prisma.container.create({ data: req.body });
    res.status(201).json(container);
  } catch (e) { next(e); }
};

export const updateContainer = async (req, res, next) => {
  try {
    const container = await prisma.container.update({
      where: { id: +req.params.id },
      data: req.body
    });
    res.json(container);
  } catch (e) { next(e); }
};

export const deleteContainer = async (req, res, next) => {
  try {
    await prisma.container.delete({ where: { id: +req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

// ========================= EXPORT CONTROLLER =========================
export const dictionaryAdminController = {
  // car brands
  getCarBrands, createCarBrand, updateCarBrand, deleteCarBrand,
  // car models
  getCarModels, createCarModel, updateCarModel, deleteCarModel,
  // directions
  getDirections, createDirection, updateDirection, deleteDirection,
  // transport methods
  getTransportMethods, createTransportMethod, updateTransportMethod, deleteTransportMethod,
  // locations
  getLocations, createLocation, updateLocation, deleteLocation,
  // drivers
  getDrivers, createDriver, updateDriver, deleteDriver,
  // company vehicles (бывшие carrier)
  getCompanyVehicles, createCompanyVehicle, updateCompanyVehicle, deleteCompanyVehicle,
  // containers
  getContainers, createContainer, updateContainer, deleteContainer
};