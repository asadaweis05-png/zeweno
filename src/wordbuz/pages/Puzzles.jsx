import React from 'react';
import { usePuzzles } from '../context/PuzzleContext';
import PuzzleCard from '../components/PuzzleCard';

const Puzzles = () => {
  const { puzzles } = usePuzzles();

  return (
    <div className="puzzles-page" style={{ padding: '2rem' }}>
      <h2 className="text-2xl font-bold mb-6 text-center">All Puzzles</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {puzzles.map(puzzle => (
          <PuzzleCard key={puzzle.id} puzzle={puzzle} />
        ))}
      </div>
    </div>
  );
};

export default Puzzles;
