markdown
# API Reference Uchet_TS

## Базовый URL
`https://localhost:5000` (development) или `https://your-domain.com` (production)

## Аутентификация
Большинство эндпоинтов требуют JWT токен в заголовке:
`Authorization: Bearer <token>`

## Эндпоинты

### Аутентификация
- `POST /api/auth/login` - вход пользователя
  - Body: `{email, password}`
  - Response: `{token, user}`

- `GET /api/auth/me` - информация о текущем пользователе
  - Headers: `Authorization: Bearer <token>`
  - Response: `{user}`

### Справочники
- `GET /api/car-brands` - список марок автомобилей
- `GET /api/car-brands/:id/models` - модели по марке
- `GET /api/dictionaries/directions` - направления перевозок
- `GET /api/dictionaries/transport-methods` - способы перевозки

### Акт приёмки ТС
- `POST /vehicle-acts` - создание акта (с загрузкой фото)
  - Headers: `Authorization: Bearer <token>`
  - Content-Type: `multipart/form-data`
  - Body: Форма с полями акта и файлами фотографий

- `GET /vehicle-acts` - список всех актов
- `GET /vehicle-acts/:id` - акт по ID
- `POST /vehicle-acts/:id/receive` - подтверждение приема ТС
- `GET /vehicle-acts/:id/export-docx` - экспорт в DOCX
- `GET /vehicle-acts/:id/print` - HTML версия для печати
- `GET /vehicle-acts/check-vin/:vin` - проверка VIN

### Примеры запросов

```javascript
// Логин
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'receiver@example.com', 
    password: 'password123' 
  })
});

// Получение акта
const response = await fetch('/vehicle-acts/abc123', {
  headers: { 'Authorization': 'Bearer ' + token }
});
Коды ответов
200 Успешный запрос

201 Ресурс создан

400 Ошибка валидации

401 Неавторизованный доступ

404 Ресурс не найден

500 Внутренняя ошибка сервера