markdown
# Uchet_TS API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "receiver@example.com",
  "password": "password123"
}
Response:

json
{
  "message": "Вход выполнен успешно",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "receiver@example.com",
    "name": "Иван Петров",
    "role": "RECEIVER",
    "isActive": true,
    "createdAt": "2025-09-03T09:23:30.782Z",
    "updatedAt": "2025-09-03T09:23:30.782Z"
  }
}
Vehicles
Get All Vehicles
GET /vehicles (requires auth)

Find Vehicle by VIN
GET /vehicles/vin/{vin} (requires auth)

Inspections
Get All Inspections
GET /inspections (requires auth)

Create Inspection
POST /inspections (requires auth)

Request:

json
{
  "vehicleId": 1,
  "notes": "Осмотр транспортного средства",
  "status": "COMPLETED",
  "assignedToId": null
}
Headers
All authenticated requests require:

text
Authorization: Bearer <token>
Content-Type: application/json
Test Credentials
Email: receiver@example.com

Password: password123

Role: RECEIVER

text

## 6. Добавляем и коммитим документацию

```bash
git add backend/API_DOCUMENTATION.md
git commit -m "docs: add API documentation"
git push origin main