'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function GameContainer() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
  };

  if (!gameStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to WhiskeyWiz!</h1>
          <p className="mb-8 text-lg">
            Test your whiskey knowledge and tasting skills.
          </p>
          <Button onClick={startGame} size="lg">
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between">
        <div>Score: {score}</div>
        <Button variant="outline" onClick={() => setGameStarted(false)}>
          End Game
        </Button>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-lg">
        {/* Game content will go here */}
        <p className="text-center text-lg">Game interface coming soon...</p>
      </div>
    </div>
  );
}