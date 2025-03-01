import SeminarItem from './SeminarItem';
import { Seminar } from '../@types';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface SeminarListProps {
  seminars: Seminar[];
  setSeminars: React.Dispatch<React.SetStateAction<Seminar[]>>;
}

function SeminarList({ seminars, setSeminars }: SeminarListProps) {

  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибки

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:3001/seminars');
        setSeminars(response.data);
      } catch (err) {
        setError('Не удалось загрузить данные с сервера. Попробуйте позже.');
        console.error('Ошибка при загрузке семинаров:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeminars();
  }, [setSeminars]);

  // Отображение загрузки
  if (loading) {
    return (
      <div className="seminar-list loading">
        <Loader className="animate-spin" size={48} />
        <p>Загрузка семинаров...</p>
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="seminar-list error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="seminar-list">
      {seminars.map(seminar => (
        <SeminarItem
          key={seminar.id}
          seminar={seminar}
          seminars={seminars}
          setSeminars={setSeminars}
        />
      ))}
    </div>
  );
}

export default SeminarList;