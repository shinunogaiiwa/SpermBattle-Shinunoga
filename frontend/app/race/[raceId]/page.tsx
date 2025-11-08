'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function RacePage({ params }: { params: { raceId: string } }) {
  const router = useRouter();

  return (
    <main className="min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold">🏁 Sperm Battle Royale</h1>
      <div className="mt-8">
        <p>Race ID: {params.raceId}</p>
        <p className="text-gray-400 mt-4">[Racing game coming soon]</p>
        <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
      </div>
    </main>
  );
}
