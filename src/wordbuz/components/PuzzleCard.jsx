import React from 'react';
import { Puzzle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PuzzleCard = ({ puzzle }) => {
  const navigate = useNavigate();
  const handlePlay = () => {
    navigate(`/wordbuz/daily`, { state: { puzzleId: puzzle.id } });
  };
  return (
    <div className="puzzle-card glassmorphism hover:shadow-xl transition-shadow duration-300" style={{ width: '260px', margin: '1rem' }}>
      <img src={puzzle.imageUrl} alt={puzzle.title} className="w-full h-40 object-cover rounded-t" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{puzzle.title}</h3>
        <p className="text-sm text-gray-300 mb-3 h-12 overflow-hidden">{puzzle.description}</p>
        <div className="flex justify-between items-center">
          <span className="badge badge-outline">{puzzle.difficulty}</span>
          <button onClick={handlePlay} className="btn-primary btn-sm">
            <Puzzle size={16} className="inline mr-1" />
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default PuzzleCard;
