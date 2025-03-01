import express from 'express';
import fs from 'fs-extra';
import { z } from 'zod';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';



// Определяем __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;
const seminarsFile = path.join(__dirname, 'seminars.json');


// Настраиваем CORS
app.use(cors({
    origin: 'http://localhost:5173', // Разрешаем запросы только с этого происхождения
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
    allowedHeaders: ['Content-Type'], // Разрешенные заголовки
  }));

// Схема валидации для одного семинара
const seminarSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(50),
  description: z.string().optional(),
  date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  photo: z.string().url(),
});

// Схема для всего файла
const seminarsFileSchema = z.object({
  seminars: z.array(seminarSchema),
});

// Функция для чтения и проверки файла
async function loadAndValidateSeminars() {
  try {
    const data = await fs.readJson(seminarsFile);
    const result = seminarsFileSchema.safeParse(data);

    if (!result.success) {
      console.error('Ошибка валидации seminars.json:', result.error.format());
      process.exit(1); // Останавливаем сервер, если файл некорректен
    }

    return result.data.seminars;
  } catch (error) {
    console.error('Ошибка чтения seminars.json:', error.message);
    process.exit(1);
  }
}

// Функция для сохранения данных в файл
async function saveSeminars(seminars) {
  try {
    await fs.writeJson(seminarsFile, { seminars }, { spaces: 2 });
  } catch (error) {
    console.error('Ошибка записи в seminars.json:', error.message);
    throw error;
  }
}

// Инициализация данных
let seminarsData = [];

(async () => {
  seminarsData = await loadAndValidateSeminars();
  console.log('seminars.json успешно загружен и проверен');

  // Middleware для разбора JSON в запросах
  app.use(express.json());

  // CRUD эндпоинты

  // GET /seminars - Получить все семинары
  app.get('/seminars', (req, res) => {
    res.json(seminarsData);
  });

  // GET /seminars/:id - Получить семинар по ID
  app.get('/seminars/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const seminar = seminarsData.find(s => s.id === id);
    if (!seminar) {
      return res.status(404).json({ error: 'Семинар не найден' });
    }
    res.json(seminar);
  });

  // POST /seminars - Создать новый семинар
  app.post('/seminars', async (req, res) => {
    try {
      const newSeminar = seminarSchema.parse(req.body);
      const maxId = Math.max(...seminarsData.map(s => s.id), 0);
      newSeminar.id = maxId + 1;
      seminarsData.push(newSeminar);
      await saveSeminars(seminarsData);
      res.status(201).json(newSeminar);
    } catch (error) {
      res.status(400).json({ error: error.errors || error.message });
    }
  });

  // PUT /seminars/:id - Обновить семинар
  app.put('/seminars/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const seminarIndex = seminarsData.findIndex(s => s.id === id);
    if (seminarIndex === -1) {
      return res.status(404).json({ error: 'Семинар не найден' });
    }
    try {
      const updatedSeminar = seminarSchema.parse({ ...req.body, id });
      seminarsData[seminarIndex] = updatedSeminar;
      await saveSeminars(seminarsData);
      res.json(updatedSeminar);
    } catch (error) {
      res.status(400).json({ error: error.errors || error.message });
    }
  });

  // DELETE /seminars/:id - Удалить семинар
  app.delete('/seminars/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const seminarIndex = seminarsData.findIndex(s => s.id === id);
    if (seminarIndex === -1) {
      return res.status(404).json({ error: 'Семинар не найден' });
    }
    seminarsData.splice(seminarIndex, 1);
    await saveSeminars(seminarsData);
    res.status(204).send();
  });

  // Запуск сервера
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();