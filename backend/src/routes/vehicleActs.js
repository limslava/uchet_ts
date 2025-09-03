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

// Создание акта приёмки
router.post('/', authenticateToken, (req, res, next) => {
  // Сначала обрабатываем multipart форму
  upload.array('photos', 10)(req, res, (err) => {
if (!makeModel) {
  return res.status(400).json({ error: 'Поле makeModel обязательно' });
}
    next();
  });
}, async (req, res) => {
  try {
    // Теперь req.body содержит текстовые поля, а req.files - файлы
    const {
      principal,
      sender,
      direction,
      transportMethod,
      vin,
      licensePlate,
      makeModel,
      color,
      year,
      fuelLevel,
      internalContents,
      inspectionTime,
      externalCondition,
      paintInspectionImpossible,
      equipment
    } = req.body; // ← Получаем из req.body

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
        direction,
        transportMethod,
        vin,
        licensePlate,
        makeModel,
        color,
        year: parseInt(year),
        fuelLevel,
        internalContents,
        inspectionTime,
        externalCondition,
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
        }
      }
    });

    res.status(201).json(vehicleAct);
  } catch (error) {
    console.error('Create vehicle act error:', error);
    res.status(500).json({ error: 'Ошибка при создании акта приёмки' });
  }
});

// Получение всех актов
router.get('/', authenticateToken, async (req, res) => {
  try {
    const acts = await prisma.vehicleAct.findMany({
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(acts);
  } catch (error) {
    console.error('Get vehicle acts error:', error);
    res.status(500).json({ error: 'Ошибка при получении актов' });
  }
});

// Проверка VIN
router.get('/check-vin/:vin', async (req, res) => {
  try {
    const { vin } = req.params;
    const act = await prisma.vehicleAct.findUnique({
      where: { vin }
    });

    res.json({ exists: !!act });
  } catch (error) {
    console.error('Check VIN error:', error);
    res.status(500).json({ error: 'Ошибка при проверке VIN' });
  }
});

// Получение акта по ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const act = await prisma.vehicleAct.findUnique({
      where: { id },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!act) {
      return res.status(404).json({ error: 'Акт не найден' });
    }

    res.json(act);
  } catch (error) {
    console.error('Get vehicle act error:', error);
    res.status(500).json({ error: 'Ошибка при получении акта' });
  }
});

export default router;

