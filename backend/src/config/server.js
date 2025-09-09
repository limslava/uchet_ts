import fs from 'fs';
import path from 'path';

export const serverConfig = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
};

export const corsConfig = {
  origin: function (origin, callback) {
    // Разрешаем запросы из localhost и с вашего IP
    const allowedOrigins = [
      'https://localhost:3000',
      'https://192.168.0.121:3000',
      'http://localhost:3000',
      'http://192.168.0.121:3000'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// HTTPS конфигурация
export const httpsConfig = {
  key: fs.readFileSync(path.join(process.cwd(), 'certs', 'localhost+3-key.pem')),
  cert: fs.readFileSync(path.join(process.cwd(), 'certs', 'localhost+3.pem'))
};