'use client';

import { useAuth } from '@/contexts/AuthContext';
import SignIn from '@/components/auth/SignIn';
import GameContainer from '@/components/game/GameContainer';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  return <GameContainer />;
}