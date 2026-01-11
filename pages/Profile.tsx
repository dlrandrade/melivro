
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_USERS } from '../constants';
import GoalSetter from '../components/GoalSetter';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  // In a real app, you'd fetch user data. Here we'll use a mock.
  const user = MOCK_USERS['u1']; // Mocking the logged-in user as 'Daniel G.'

  const [goal, setGoal] = useState(24);
  const [readCount, setReadCount] = useState(5); // Mocked data

  const progress = goal > 0 ? Math.round((readCount / goal) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
        <div>
          <h1 className="font-serif text-5xl font-bold text-black tracking-tighter">{user.name}</h1>
          <p className="text-gray-500 text-lg">@{user.username}</p>
        </div>
      </div>

      {/* Goal and Progress Section */}
      <div className="bg-white p-8 rounded-lg border border-[var(--border-color)] mb-12">
        <h2 className="font-bold text-lg mb-4">Meta de Leitura para 2024</h2>
        <div className="flex items-center gap-4 mb-2">
            <p className="font-bold text-black text-2xl">{readCount}</p>
            <p className="text-gray-500">de</p>
            <p className="font-bold text-black text-2xl">{goal} livros</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-black h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <GoalSetter currentGoal={goal} onGoalSet={setGoal} />
      </div>

      {/* User's Library/Feed would go here */}
      <div>
        <h2 className="font-serif text-3xl font-bold tracking-tighter mb-8">Minha Atividade</h2>
        <div className="text-center py-20 bg-gray-50 border border-dashed border-[var(--border-color)] rounded-md">
            <p className="text-gray-500 font-semibold">O feed de atividades do usuário aparecerá aqui.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;