import { prisma } from '../../utils/database.js';
import { logger } from '../../utils/logger.js';

export class VehicleActAdminController {
  // Получение всех актов с пагинацией и фильтрацией
  async getVehicleActs(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search = '',
        status = '',
        dateFrom = '',
        dateTo = ''
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Строим условия фильтрации
      const where = {};

      if (search) {
        where.OR = [
          { vin: { contains: search, mode: 'insensitive' } },
          { licensePlate: { contains: search, mode: 'insensitive' } },
          { contractNumber: { contains: search, mode: 'insensitive' } },
          { principal: { contains: search, mode: 'insensitive' } },
          { sender: { contains: search, mode: 'insensitive' } }
        ];
      }

      if (status) {
        where.status = status;
      }

      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
      }

      const [acts, total] = await Promise.all([
        prisma.vehicleAct.findMany({
          where,
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
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.vehicleAct.count({ where })
      ]);

      const pages = Math.ceil(total / limitNum);

      res.json({
        acts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages
        }
      });
    } catch (error) {
      logger.error('Get vehicle acts admin error:', error);
      res.status(500).json({ error: 'Ошибка при получении актов' });
    }
  }

  // Получение акта по ID
  async getVehicleAct(req, res) {
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
      logger.error('Get vehicle act admin error:', error);
      res.status(500).json({ error: 'Ошибка при получении акта' });
    }
  }

  // Обновление акта
async updateVehicleAct(req, res) {
  try {
    const { id } = req.params;
    const {
      principalPhone,
      senderPhone,
      principalPassport,
      transportCost,
      bodyType,
      // ... другие поля
    } = req.body;

    const updatedAct = await prisma.vehicleAct.update({
      where: { id },
      data: {
        principalPhone,
        senderPhone,
        principalPassport,
        transportCost: transportCost ? parseFloat(transportCost) : null,
        bodyType,
        // ... другие поля
      },
      include: {
        // ... include relations
      }
    });

      res.json(updatedAct);
    } catch (error) {
      logger.error('Update vehicle act error:', error);
      res.status(500).json({ error: 'Ошибка при обновлении акта' });
    }
  }

  // Удаление акта
  async deleteVehicleAct(req, res) {
    try {
      const { id } = req.params;

      // Проверяем существование акта
      const existingAct = await prisma.vehicleAct.findUnique({
        where: { id }
      });

      if (!existingAct) {
        return res.status(404).json({ error: 'Акт не найден' });
      }

      // Удаляем связанные фото сначала
      await prisma.photo.deleteMany({
        where: { vehicleActId: id }
      });

      // Удаляем сам акт
      await prisma.vehicleAct.delete({
        where: { id }
      });

      res.json({ message: 'Акт успешно удален' });
    } catch (error) {
      logger.error('Delete vehicle act error:', error);
      res.status(500).json({ error: 'Ошибка при удалении акта' });
    }
  }
}

export const vehicleActAdminController = new VehicleActAdminController();