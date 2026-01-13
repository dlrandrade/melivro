
import React, { useState } from 'react';

interface GoalSetterProps {
  currentGoal: number;
  onGoalSet: (newGoal: number) => void;
}

const GoalSetter: React.FC<GoalSetterProps> = ({ currentGoal, onGoalSet }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState(currentGoal);

  const handleSave = () => {
    onGoalSet(goal);
    setIsEditing(false);
    // In a real app, this would also trigger a feed post.
    console.log(`New goal set: ${goal}`);
  };

  if (!isEditing) {
    return (
      <button 
        onClick={() => setIsEditing(true)} 
        className="text-sm font-bold text-gray-600 hover:text-black"
      >
        Editar meta
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md border border-gray-200">
      <label htmlFor="goal" className="font-semibold text-sm">Quero ler</label>
      <input
        type="number"
        id="goal"
        value={goal}
        onChange={(e) => setGoal(parseInt(e.target.value, 10))}
        className="w-20 border-b-2 border-gray-300 focus:border-black bg-transparent text-center font-bold outline-none"
      />
      <label htmlFor="goal" className="font-semibold text-sm">livros este ano.</label>
      <button 
        onClick={handleSave}
        className="ml-auto bg-black text-white px-4 py-1 rounded-md text-sm font-bold"
      >
        Salvar
      </button>
       <button 
        onClick={() => setIsEditing(false)}
        className="text-sm font-semibold text-gray-500"
      >
        Cancelar
      </button>
    </div>
  );
};

export default GoalSetter;
