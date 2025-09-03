import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { prisma } from '../app.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Генерация номера договора
const generateContractNumber = async () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  
  const todaysActsCount = await prisma.vehicleAct.count({
    where: {
      createdAt: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });
  
  const sequenceNumber = (todaysActsCount + 1).toString().padStart(2, '0');
  
  return `ДП${year}${month}-${day}-${sequenceNumber}`;
};

// Функции преобразования Enum
const convertFuelLevel = (percentage) => {
  const level = parseInt(percentage) || 0;
  if (level === 0) return 'EMPTY';
  if (level <= 25) return 'QUARTER';
  if (level <= 50) return 'HALF';
  if (level <= 75) return 'THREE_QUARTERS';
  return 'FULL';
};

const convertInspectionTime = (time) => {
  const mapping = {
    'день': 'DAY',
    'темное время суток': 'NIGHT',
    'дождь': 'RAIN',
    'снег': 'SNOW'
  };
  return mapping[time] || 'DAY';
};

const convertExternalCondition = (condition) => {
  const mapping = {
    'Чистый': 'CLEAN',
    'грязный': 'DIRTY',
    'мокрый': 'WET',
    'в пыли': 'DUSTY',
    'в снегу': 'SNOWY',
    'обледенелый': 'ICY'
  };
  return mapping[condition] || 'CLEAN';
};

// Создание акта приёмки
router.post('/', authenticateToken, (req, res, next) => {
  upload.array('photos', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Ошибка загрузки файлов' });
    }
    
    // Обновляем проверку на carBrandId и carModelId
    if (!req.body.carBrandId || !req.body.carModelId) {
      return res.status(400).json({ error: 'Поля марка и модель обязательны' });
    }
    
    next();
  });
}, async (req, res) => {
  try {
    const {
      principal,
      sender,
      directionId,
      transportMethodId,
      vin,
      licensePlate,
      carBrandId,
      carModelId,
      color,
      year,
      fuelLevel,
      internalContents,
      inspectionTime,
      externalCondition,
      paintInspectionImpossible,
      equipment
    } = req.body;

    // Проверяем существующий VIN
    const existingAct = await prisma.vehicleAct.findUnique({
      where: { vin }
    });

    if (existingAct) {
      return res.status(409).json({
        error: 'Акт с таким VIN уже существует',
        existingAct
      });
    }

    const contractNumber = await generateContractNumber();
    
    // Создаем папку для загрузок если нет
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Обрабатываем фотографии
    const photoNames = req.files ? req.files.map(file => {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.originalname}`;
      const filePath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(filePath, file.buffer);
      return uniqueName;
    }) : [];

    // Создаем акт
    const vehicleAct = await prisma.vehicleAct.create({
      data: {
        contractNumber,
        date: new Date(),
        principal,
        sender,
        directionId: directionId ? parseInt(directionId) : null,
        transportMethodId: transportMethodId ? parseInt(transportMethodId) : null,
        vin,
        licensePlate,
        carBrandId: carBrandId ? parseInt(carBrandId) : null,
        carModelId: carModelId ? parseInt(carModelId) : null,
        color,
        year: parseInt(year),
        fuelLevel: convertFuelLevel(fuelLevel),
        internalContents,
        inspectionTime: convertInspectionTime(inspectionTime),
        externalCondition: convertExternalCondition(externalCondition),
        paintInspectionImpossible: paintInspectionImpossible === 'true',
        equipment: JSON.parse(equipment || '{}'),
        status: 'NEW',
        userId: req.user.id,
        photos: {
          create: photoNames.map(filename => ({ filename }))
        }
      },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        carBrand: true,
        carModel: true
      }
    });

    res.status(201).json(vehicleAct);
  } catch (error) {
    console.error('Create vehicle act error:', error);
    res.status(500).json({ error: 'Ошибка при создании акта приёмки' });
  }
});

// ... остальные маршруты остаются без изменений

export default router;

