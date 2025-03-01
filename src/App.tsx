import { useState } from 'react';
import SeminarList from './components/SeminarList';
import './index.css';

interface Seminar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  photo: string;
}

function App() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);

  return (
    <div className="app">
      <h1>Список семинаров</h1>
      <SeminarList seminars={seminars} setSeminars={setSeminars} />
    </div>
  );
}

export default App;