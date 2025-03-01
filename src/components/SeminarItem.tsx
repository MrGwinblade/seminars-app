import { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { Seminar } from '../@types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { seminarSchema, TFormSeminar } from '../lib/schema';



interface SeminarItemProps {
  seminar: Seminar;
  seminars: Seminar[];
  setSeminars: React.Dispatch<React.SetStateAction<Seminar[]>>;
}

function SeminarItem({ seminar, seminars, setSeminars }: SeminarItemProps) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  // Настройка react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormSeminar>({
    resolver: zodResolver(seminarSchema),
    defaultValues: seminar,
  });

  /**
   * Удаление.
   * Запрос Delete на сервер.
   */
  const handleDelete = () => {

    axios.delete(`http://localhost:3001/seminars/${seminar.id}`)
      .then(() => {
        // Обновление данных семинаров, после удаления на сервере.
        setSeminars(seminars.filter(s => s.id !== seminar.id));
        // Закрытие окна
        setDeleteModalOpen(false);
      })
      .catch(error => console.error('Ошибка при удалении:', error)); // Логирование ошибки
  };

//тоже самое но сохранение. После проверки формы.
  const handleEditSave: SubmitHandler<TFormSeminar> = async (data) => {
    try {
      const response = await axios.put(`http://localhost:3001/seminars/${seminar.id}`, {
        ...seminar,
        ...data,
      });
      setSeminars(seminars.map(s => (s.id === seminar.id ? response.data : s)));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Ошибка при редактировании:', error);
    }
  };

  return (
    <div className="seminar-item">
      <img src={seminar.photo} alt={seminar.title} />
      <h2>{seminar.title}</h2>
      <p>{seminar.description}</p>
      <p>Дата: {seminar.date} | Время: {seminar.time}</p>
      <button className='button-item' onClick={() => setEditModalOpen(true)}>Редактировать</button>
      <button className='button-item' onClick={() => setDeleteModalOpen(true)}>Удалить</button>

      {isDeleteModalOpen && (
        <Modal
          title="Подтверждение удаления"
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        >
          <p>Вы уверены, что хотите удалить семинар "{seminar.title}"?</p>
        </Modal>
      )}

      {isEditModalOpen && (
        <Modal
          title="Редактирование семинара"
          onClose={() => {
            setEditModalOpen(false);
            reset(seminar); // Сбрасываем форму до начальных значений при закрытии
          }}
          onConfirm={handleSubmit(handleEditSave)}
        >
          <form onSubmit={handleSubmit(handleEditSave)}>
            <div>
              <input
                {...register('title')}
                placeholder="Название"
              />
              {errors.title && <p className="error">{errors.title.message}</p>}
            </div>
            <div>
              <textarea
                {...register('description')}
                placeholder="Описание"
              />
              {errors.description && <p className="error">{errors.description.message}</p>}
            </div>
            <div>
              <input
                {...register('date')}
                placeholder="Дата (DD.MM.YYYY)"
              />
              {errors.date && <p className="error">{errors.date.message}</p>}
            </div>
            <div>
              <input
                {...register('time')}
                placeholder="Время (HH:MM)"
              />
              {errors.time && <p className="error">{errors.time.message}</p>}
            </div>
            <div>
              <input
                {...register('photo')}
                placeholder="Ссылка на фото"
              />
              {errors.photo && <p className="error">{errors.photo.message}</p>}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default SeminarItem;