import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../utils/database.js';

export class AnalyticsAdminController {
  async getDashboardStats(req, res) {
    try {
      const [
        totalActs,
        totalUsers,
        totalVehicles,
        todayActs,
        activeUsersCount
      ] = await Promise.all([
        prisma.vehicleAct.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.vehicle.count(),
        prisma.vehicleAct.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.user.count({
          where: { 
            isActive: true,
            lastActivity: {
              gte: new Date(Date.now() - 30 * 60 * 1000)
            }
          }
        })
      ]);

      res.json({
        totalActs,
        totalUsers,
        totalVehicles,
        todayActs,
        activeUsersCount
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Ошибка при получении статистики' });
    }
  }
}

export const analyticsAdminController = new AnalyticsAdminController();
import { logger } from '../../utils/logger.js';
import { vehicleActExportService } from '../../services/export/vehicleActExportService.js';


const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// Функции преобразования Enum (из старого кода)
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

const convertInteriorCondition = (condition) => {
  const mapping = {
    'Чистый': 'CLEAN',
    'Грязный': 'DIRTY', 
    'Поврежден': 'DAMAGED'
  };
  return mapping[condition] || 'CLEAN';
};

// Функции преобразования Enum (для экспорта/печати)
const convertFuelLevelToText = (level) => {
  const mapping = {
    'EMPTY': '0%',
    'QUARTER': '25%',
    'HALF': '50%',
    'THREE_QUARTERS': '75%',
    'FULL': '100%'
  };
  return mapping[level] || '0%';
};

const convertInspectionTimeToText = (time) => {
  const mapping = {
    'DAY': 'день',
    'NIGHT': 'темное время суток',
    'RAIN': 'дождь',
    'SNOW': 'снег'
  };
  return mapping[time] || 'день';
};

const convertExternalConditionToText = (condition) => {
  const mapping = {
    'CLEAN': 'Чистый',
    'DIRTY': 'грязный',
    'WET': 'мокрый',
    'DUSTY': 'в пыли',
    'SNOWY': 'в снегу',
    'ICY': 'обледенелый'
  };
  return mapping[condition] || 'Чистый';
};

const convertInteriorConditionToText = (condition) => {
  const mapping = {
    'CLEAN': 'Чистый',
    'DIRTY': 'Грязный',
    'DAMAGED': 'Поврежден'
  };
  return mapping[condition] || 'Чистый';
};

// Генерация номера договора (из старого кода)
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

// Функция генерации HTML (из старого кода)
const generatePrintableHtml = (act) => {
  const API_URL = process.env.API_URL || 'http://localhost:5000';
  
  // Вспомогательная функция для получения названий комплектности
  const getEquipmentLabel = (key) => {
    const labels = {
      'wipers': 'Щетки стеклоочистителя',
      'fogLights': 'Противотуманные фары',
      'battery': 'АКБ',
      'mirrorsOuter': 'Зеркала наружные',
      'mirrorInner': 'Зеркало внутреннее',
      'mudguards': 'Брызговики',
      'wheelCaps': 'Колпаки колес',
      'alloyWheels': 'Литые диски',
      'ignitionKey': 'Ключ зажигания',
      'alarmFob': 'Брелок сигнализации',
      'keyCylinder': 'Личинка ключа',
      'keyCard': 'Ключ-карта',
      'floorMats': 'Коврики',
      'headrests': 'Подголовники',
      'radio': 'Радиоприемник',
      'sdCard': 'Карта памяти',
      'monitor': 'Монитор',
      'repairKit': 'Рем.комплект',
      'spareWheel': 'Колесо запасное',
      'jack': 'Домкрат',
      'wheelWrench': 'Ключ-балонник',
      'trunkShelf': 'Шторка/полка багаж.',
      'dashCam': 'Видеорегистратор'
    };
    return labels[key] || key;
  };

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Акт приёмки ${act.contractNumber}</title>
    <style>
        body { 
            font-family: 'Arial Narrow', Arial, sans-serif; 
            margin: 0;
            padding: 10px;
            line-height: 1.2;
            font-size: 11px;
        }
        
        .company-info {
            text-align: right;
            font-size: 12px;
            margin-bottom: 10px;
            line-height: 1.1;
            margin-right: 0px;
            width: 100%;
        }
        
        .header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
            width: 100%;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
            font-size: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 3px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .section-title {
            font-weight: bold;
            margin-top: 8px;
            margin-bottom: 2px;
            font-size: 10px;
            text-align: left;
        }
        .equipment-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 3px;
            margin: 5px 0;
            font-size: 9px;
            text-align: left;
        }
        .equipment-item {
            padding: 2px;
            border-bottom: 1px solid #eee;
            text-align: left;
        }
        
        .condition-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 8px 0;
            text-align: left;
        }
        .condition-column {
            display: flex;
            flex-direction: column;
            gap: 5px;
            text-align: left;
        }
        
        .signatures {
            margin-top: 15px;
            text-align: left;
        }
        .signature-item {
            margin: 8px 0;
            text-align: left;
        }
        .signature-line {
            border-top: 1px solid #000;
            margin-top: 3px;
            padding-top: 2px;
            font-size: 10px;
            width: 800px;
            text-align: left;
        }
        .signature-label {
            text-align: center;
            font-size: 8px;
            color: #666;
            margin-top: 1px;
        }
        .footer {
            margin-top: 15px;
            font-size: 8px;
            color: #666;
            line-height: 1.1;
            text-align: left;
        }
        .footer-note {
            margin: 3px 0;
            text-align: left;
        }
        h1 {
            font-size: 16px;
            margin: 3px 0;
        }
        h2 {
            font-size: 12px;
            margin: 2px 0;
        }
        
        .qr-container {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 100;
        }
        .qr-code {
            width: 100px;
            height: 100px;
            border: 1px solid #ccc;
            padding: 2px;
            background: white;
        }
        
        .main-content {
            margin-left: 0px;
        }
        
        @media print {
            body { 
                padding: 5px;
                margin: 0; 
                font-size: 10px;
                text-align: left;
            }
            .no-print { display: none; }
            .header, table, .equipment-grid, .signatures, .condition-grid {
                page-break-inside: avoid;
            }
            @page {
                margin: 0.3cm;
                size: portrait;
            }
        }
    </style>
</head>
<body>
    <div class="qr-container">
        <div class="qr-code">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${API_URL}/vehicle-acts/${act.id}" 
                 alt="QR Code" 
                 style="width: 100%; height: 100%;">
        </div>
    </div>

    <div class="company-info">
        ООО «Симпл Вэй» ОГРН: 122250000047. ИНН: 2543164502. КПП: 254301001<br>
        690108 г. Владивосток, Вилкова, 5А
    </div>
<br><br><br><br>
    <div class="header">
        <h1>АКТ ПРИЕМА-ПЕРЕДАЧИ</h1>
        <h2>К Договору № ${act.contractNumber || ''}</h2>
    </div>
        <br>
        <table>
            <tr>
                <th>Принципал/Получатель</th>
                <th>Гос. номер</th>
                <th>Дата</th>
            </tr>
            <tr>
                <td>${act.principal || ''}</td>
                <td>${act.licensePlate || ''}</td>
                <td>${act.formattedDate}</td>
            </tr>
            <tr>
                <th>Отправитель</th>
                <th>Пункт назначения</th>
                <th>Способ перевозки</th>
            </tr>
            <tr>
                <td>${act.sender || ''}</td>
                <td>${act.direction || ''}</td>
                <td>${act.transportMethod || ''}</td>
            </tr>
            <tr>
                <th>Марка и модель</th>
                <th>VIN</th>
                <th>Цвет</th>
            </tr>
            <tr>
                <td>${act.makeModel || ''}</td>
                <td>${act.vin || ''}</td>
                <td>${act.color || ''}</td>
            </tr>
            <tr>
                <th>Локация</th>
                <th>Год выпуска</th>
                <th></th>
            </tr>
            <tr>
                <td>${act.location || ''}</td>
                <td>${act.year || ''}</td>
                <td></td>
            </tr>
        </table>
        <br>
        <div class="section-title">Комплектность:</div>
        <div class="equipment-grid">
            ${Object.entries(act.equipment || {}).map(([key, value]) => `
                <div class="equipment-item">
                    <strong>${getEquipmentLabel(key)}:</strong> ${value}
                </div>
            `).join('')}
        </div>
        <br>
        <div class="section-title">Уровень топлива: ${act.fuelLevel || '0%'}</div>

        <div class="condition-grid">
            <div class="condition-column">
                <div class="section-title">Перечень внутренних вложений в а/м:</div>
                <div>${act.internalContents || 'Отсутствуют'}</div>

                <div class="section-title">Условия осмотра:</div>
                <div>${act.inspectionTime || 'день'}</div>

                <div class="section-title">Внешнее состояние а/м:</div>
                <div>${act.externalCondition || 'Чистый'}</div>
            </div>
            
            <div class="condition-column">
                <div class="section-title">Состояние салона автомобиля:</div>
                <div>${act.interiorCondition || 'Чистый'}</div>

                <div class="section-title">Осмотр ЛКП невозможен:</div>
                <div>${act.paintInspectionImpossible ? 'Да' : 'Нет'}</div>

                <div class="section-title">Карта внешнего вида:</div>
                <div>${act.photos?.length || 0} фотографий</div>
            </div>
        </div>
        <br><br>
        <div class="signatures">
            <div class="signature-item">
                <div>Ознакомлен: </div>
                <div class="signature-line"></div>
                <div class="signature-label">подпись, ФИО</div>
            </div>
            
            <div class="signature-item">
                <div>Прочее: </div>
                <div class="signature-line"></div>
            </div>
            
            <div class="signature-item">
                <div>Передал: </div>
                <div class="signature-line"></div>
                <div class="signature-label">подпись, ФИО</div>
            </div>
            
            <div class="signature-item">
                <div>Принял: </div>
                <div class="signature-line"></div>
                <div class="signature-label">подпись, ФИО</div>
            </div>
            
            <div class="signature-item">
                <div class="section-title">Отметка Грузополучателя:</div>
                <br>
                <div>Автомобиль получил, претензий к перевозке не имею.</div>
                <br>
                <div class="signature-line"></div>
                <div class="signature-label">подпись, ФИО</div>
                <div style="text-align: right; margin-top: 3px;">
                <br><br>
                    «_______»_______________ 20____ г.
                </div>
            </div>
        </div>
        <br><br><br><br>
        <div class="footer">
            <div class="footer-note">
                *Автомобиль принят без тщательного осмотра, без мойки. При получении автомобиля клиент обязуется не предъявлять претензии по внешним повреждениям, которые не могли быть обнаружены при передаче.
            </div>
            <div class="footer-note">
                *При приемке автомобиля проверка технического состояния узлов, агрегатов, электрических и электронных систем не производится. Ответственность за их работоспособность и состояние Экспедитор не несет. За повреждения салона автомобиля, произошедшее вследствие нахождения в нем предметов не относящихся к заводской комплектации, Экспедитор ответственности не несет.
            </div>
            <div class="footer-note">
                *При обнаружении повреждений, не отмеченных в данном акте, приоритетными следует считать фотографии, сделанные при описи автомобиля.
            </div>
        </div>
    </div>

    <script>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
  `;
};

export const vehicleActController = {
  // Конфигурация загрузки файлов
  uploadMiddleware: upload.array('photos', 10),

  // Создание акта приёмки
  async createVehicleAct(req, res) {
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
        interiorCondition,
        paintInspectionImpossible,
        equipment
      } = req.body;

      if (!carBrandId || !carModelId) {
        return res.status(400).json({ error: 'Поля марка и модель обязательны' });
      }

      const contractNumber = await generateContractNumber();
      
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const photoNames = req.files ? req.files.map(file => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.originalname}`;
        const filePath = path.join(uploadsDir, uniqueName);
        fs.writeFileSync(filePath, file.buffer);
        return uniqueName;
      }) : [];

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { location: true }
      });

      if (!user.locationId && user.role === 'RECEIVER') {
        return res.status(400).json({ 
          error: 'У пользователя не выбрана локация. Пожалуйста, выберите локацию перед созданием акта.' 
        });
      }

      const vehicleAct = await prisma.vehicleAct.create({
        data: {
          contractNumber,
          date: new Date(),
          principal,
          sender,
          direction: directionId ? { connect: { id: parseInt(directionId) } } : undefined,
          transportMethod: transportMethodId ? { connect: { id: parseInt(transportMethodId) } } : undefined,
          vin,
          licensePlate,
          carBrand: carBrandId ? { connect: { id: parseInt(carBrandId) } } : undefined,
          carModel: carModelId ? { connect: { id: parseInt(carModelId) } } : undefined,
          color,
          year: parseInt(year),
          fuelLevel: convertFuelLevel(fuelLevel),
          internalContents,
          inspectionTime: convertInspectionTime(inspectionTime),
          externalCondition: convertExternalCondition(externalCondition),
          interiorCondition: convertInteriorCondition(interiorCondition),
          paintInspectionImpossible: paintInspectionImpossible === 'true',
          equipment: JSON.parse(equipment || '{}'),
          status: 'NEW',
          user: { connect: { id: req.user.id } },
          Location: user.locationId ? { connect: { id: user.locationId } } : undefined,
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
          carModel: true,
          direction: true,
          transportMethod: true,
          Location: true
        }
      });

      res.status(201).json(vehicleAct);
    } catch (error) {
      logger.error('Create vehicle act error:', error);
      res.status(500).json({ error: 'Ошибка при создании акта приёмки' });
    }
  },

  // Получение всех актов
  async getAllVehicleActs(req, res) {
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
          },
          carBrand: true,
          carModel: true,
          direction: true,
          transportMethod: true,
          Location: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(acts);
    } catch (error) {
      logger.error('Get vehicle acts error:', error);
      res.status(500).json({ error: 'Ошибка при получении актов' });
    }
  },

  // Получение акта по ID
  async getVehicleActById(req, res) {
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
          },
          carBrand: true,
          carModel: true,
          direction: true,
          transportMethod: true,
          Location: true
        }
      });

      if (!act) {
        return res.status(404).json({ error: 'Акт не найден' });
      }

      res.json(act);
    } catch (error) {
      logger.error('Get vehicle act error:', error);
      res.status(500).json({ error: 'Ошибка при получении акта' });
    }
  },

  // Проверка VIN
  async checkVin(req, res) {
    try {
      const { vin } = req.params;
      const existingAct = await prisma.vehicleAct.findUnique({
        where: { vin }
      });

      res.json({ exists: !!existingAct, act: existingAct });
    } catch (error) {
      logger.error('Check VIN error:', error);
      res.status(500).json({ error: 'Ошибка при проверке VIN' });
    }
  },

  // Подтверждение приема ТС
async confirmReceipt(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Получаем пользователя чтобы узнать его текущую локацию
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { location: true }
    });

    // Проверяем что у пользователя есть локация (для приемосдатчиков)
    if (req.user.role === 'RECEIVER' && !user.locationId) {
      return res.status(400).json({ 
        error: 'У пользователя не выбрана локация. Пожалуйста, выберите локацию перед приемом ТС.' 
      });
    }

    const act = await prisma.vehicleAct.findUnique({
      where: { id }
    });

    if (!act) {
      return res.status(404).json({ error: 'Акт не найден' });
    }

    const updatedAct = await prisma.vehicleAct.update({
      where: { id },
      data: {
        status: 'RECEIVED',
        receivedAt: new Date(),
        // ОБНОВЛЯЕМ локацию на локацию пользователя
        Location: user.location ? { connect: { id: user.location.id } } : undefined
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
        carModel: true,
        direction: true,
        transportMethod: true,
        Location: true // Включаем локацию в ответ
      }
    });

    res.json(updatedAct);
  } catch (error) {
    logger.error('Receive vehicle act error:', error);
    res.status(500).json({ 
      error: 'Ошибка при подтверждении приема ТС',
      details: error.message 
    });
  }
},

  // Экспорт в DOCX
  async exportToDocx(req, res) {
    try {
      const { id } = req.params;
      logger.info('Export request for act ID:', id);

      const act = await prisma.vehicleAct.findUnique({
        where: { id: id },
        include: {
          direction: true,
          transportMethod: true,
          carBrand: true,
          carModel: true,
          photos: true,
          Location: true
        }
      });

      if (!act) {
        return res.status(404).json({ error: 'Акт не найден' });
      }

      // Подготовить данные для сервиса
      const dataForExport = {
        ...act,
        makeModel: `${act.carBrand?.name || ''} ${act.carModel?.name || ''}`.trim(),
        direction: act.direction?.name,
        transportMethod: act.transportMethod?.name,
        location: act.Location?.name,
        equipment: typeof act.equipment === 'string' ? JSON.parse(act.equipment) : act.equipment || {},
        fuelLevel: convertFuelLevelToText(act.fuelLevel),
        inspectionTime: convertInspectionTimeToText(act.inspectionTime),
        externalCondition: convertExternalConditionToText(act.externalCondition),
        interiorCondition: convertInteriorConditionToText(act.interiorCondition)
      };

      const buffer = await vehicleActExportService.generateDocx(dataForExport);
      const filename = `act-${act.contractNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(buffer);

    } catch (error) {
      logger.error('Export error details:', error);
      res.status(500).json({ 
        error: 'Ошибка при экспорте акта',
        details: error.message 
      });
    }
  },

  // Печатная HTML форма
  async printHtml(req, res) {
    try {
      const { id } = req.params;

      const act = await prisma.vehicleAct.findUnique({
        where: { id: id },
        include: {
          direction: true,
          transportMethod: true,
          carBrand: true,
          carModel: true,
          photos: true,
          Location: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      if (!act) {
        return res.status(404).json({ error: 'Акт не найден' });
      }

      // Подготовить данные
      const dataForPrint = {
        ...act,
        makeModel: `${act.carBrand?.name || ''} ${act.carModel?.name || ''}`.trim(),
        direction: act.direction?.name,
        transportMethod: act.transportMethod?.name,
        location: act.Location?.name,
        equipment: typeof act.equipment === 'string' ? JSON.parse(act.equipment) : act.equipment || {},
        fuelLevel: convertFuelLevelToText(act.fuelLevel),
        inspectionTime: convertInspectionTimeToText(act.inspectionTime),
        externalCondition: convertExternalConditionToText(act.externalCondition),
        interiorCondition: convertInteriorConditionToText(act.interiorCondition),
        formattedDate: new Date(act.date).toLocaleDateString('ru-RU')
      };

      const htmlContent = generatePrintableHtml(dataForPrint);
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);

    } catch (error) {
      logger.error('Print error details:', error);
      res.status(500).json({ 
        error: 'Ошибка при генерации печатной версии',
        details: error.message 
      });
    }
  }
};