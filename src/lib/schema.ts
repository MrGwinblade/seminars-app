import { z } from 'zod';


// Схема валидации с помощью Zod
export const seminarSchema = z.object({
  title: z.string()
    .min(1, 'Название не может быть пустым')
    .max(30, 'Название не должно превышать 30 символов'),
  description: z.string().optional(),
  date: z.string()
  .regex(/^\d{2}\.\d{2}\.\d{4}$/, 'Дата должна быть в формате DD.MM.YYYY')
  .refine(
    (date) => {
      const [day, month, year] = date.split('.').map(Number);
      const d = new Date(year, month - 1, day);
      
      // Проверяем корректность даты
      if (d.getDate() !== day || d.getMonth() !== month - 1 || d.getFullYear() !== year) {
        return false;
      }

      // Проверяем диапазон года
      return year >= 1971 && year <= 2050;
    },
    'Некорректная дата или год выходит за пределы 1971-2050'
  ),

  time: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Время должно быть в формате HH:MM')
    .refine(
      (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      },
      'Некорректное время'
    ),
    photo: z.string()
    .url('Введите корректную ссылку')
    .superRefine(async (url, ctx) => {
        try {
        const response = await fetch(url, { method: 'GET' }); // Изменено с HEAD на GET
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.startsWith('image/')) {
            ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Ссылка должна вести на изображение',
            });
        }
        } catch {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Не удалось проверить изображение',
        });
        }
    }),

  
});

// Тип данных формы
export type TFormSeminar = z.infer<typeof seminarSchema>;