'use client';

import { useEffect, useState } from 'react';
import { auth, genkit } from '@/lib/firebase';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Welcome to WhiskeyWiz</h1>
        {user ? (
          <div>Logged in as {user.email}</div>
        ) : (
          <div>Please sign in to continue</div>
        )}
      </div>
    </main>
  );
}
