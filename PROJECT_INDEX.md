markdown:PROJECT_INDEX.md
# 📁 Индекс проекта Uchet_TS

## 🏗️ Структура проекта
uchet_ts/
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ │ ├── auth.js # Аутентификация
│ │ │ ├── vehicleActs.js # Акты приёмки ✓
│ │ │ ├── dictionaries.js # Справочники ✓
│ │ │ └── carBrands.js # Марки авто ✓
│ │ ├── middleware/
│ │ │ └── auth.js # JWT ✓
│ │ ├── services/
│ │ │ └── VehicleActExportService.js # DOCX генерация ✓
│ │ └── app.js # Главный файл ✓
│ ├── prisma/
│ │ └── schema.prisma # Schema БД ✓
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── ReceivePage.js # Форма приёмки ✓
│ │ │ ├── QrScanner.js # Сканер QR ✓
│ │ │ └── Login.js # Авторизация ✓
│ │ ├── pages/
│ │ │ └── ReceiveByScan.js # Приём по QR ✓
│ │ ├── services/
│ │ │ └── api.js # API функции ✓
│ │ └── App.js # Главный компонент ✓
│ └── package.json
└── документация/
├── ARCHITECTURE.md # Архитектура ✓
├── API_REFERENCE.md # API справка ✓
├── TECH_STACK.md # Технологии ✓
└── PROJECT_LOG.md # Лог проекта ✓

text

## ✅ Текущий статус (что уже реализовано)
- [x] Аутентификация JWT
- [x] Система актов приёмки с фото
- [x] Сканер QR-кодов (мобильный)
- [x] Печатные формы и экспорт DOCX
- [x] Система справочников
- [x] Поддержка повторяющихся VIN

## 🔄 Последние изменения
- 2025-09-08: Исправление интерфейса сканера QR
- 2025-09-08: Поддержка повторяющихся VIN
- 2025-09-07: Исправление выбора локации