import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from "celebrate";
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// Маршрути нотаток
app.use(notesRoutes);

// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

// підключення до MongoDB перед запуском сервера
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
