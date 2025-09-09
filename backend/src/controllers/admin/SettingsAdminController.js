export class SettingsAdminController {
  async getSettings(req, res) {
    try {
      // Заглушка - в будущем можно хранить в БД
      res.json({
        systemName: 'Uchet_TS',
        version: '2.1.0',
        maintenanceMode: false,
        allowRegistrations: true
      });
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Ошибка при получении настроек' });
    }
  }
}

export const settingsAdminController = new SettingsAdminController();