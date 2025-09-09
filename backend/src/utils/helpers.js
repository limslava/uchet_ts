import { FUEL_LEVEL, INSPECTION_TIME } from '../config/constants.js';

export const convertFuelLevel = (percentage) => {
  const level = parseInt(percentage) || 0;
  if (level === 0) return FUEL_LEVEL.EMPTY;
  if (level <= 25) return FUEL_LEVEL.QUARTER;
  if (level <= 50) return FUEL_LEVEL.HALF;
  if (level <= 75) return FUEL_LEVEL.THREE_QUARTERS;
  return FUEL_LEVEL.FULL;
};

export const convertInspectionTime = (time) => {
  const mapping = {
    'день': INSPECTION_TIME.DAY,
    'темное время суток': INSPECTION_TIME.NIGHT,
    'дождь': INSPECTION_TIME.RAIN,
    'снег': INSPECTION_TIME.SNOW
  };
  return mapping[time] || INSPECTION_TIME.DAY;
};

export const convertExternalCondition = (condition) => {
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

export const convertInteriorCondition = (condition) => {
  const mapping = {
    'Чистый': 'CLEAN',
    'Грязный': 'DIRTY',
    'Поврежден': 'DAMAGED'
  };
  return mapping[condition] || 'CLEAN';
};

export const generateContractNumber = async (prisma) => {
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