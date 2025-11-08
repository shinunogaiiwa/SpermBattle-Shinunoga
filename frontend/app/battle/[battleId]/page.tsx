'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Swords } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FloatingSperm } from '@/components/FloatingSperm';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import type { Battle } from '@/types';

interface BattlePageProps {
  params: { battleId: string };
  searchParams?: { analysis?: string };
}

export default function BattlePage({ params, searchParams }: BattlePageProps) {
  const router = useRouter();
  const currentAnalysis = useAppStore(state => state.currentAnalysis);
  const battleId = parseInt(params.battleId, 10);
  const queryAnalysisId = searchParams?.analysis
    ? parseInt(searchParams.analysis, 10)
    : undefined;

  const [battle, setBattle] = useState<Battle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    api
      .getBattle(battleId)
      .then(data => {
        if (cancelled) return;
        setBattle(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Battle not found. Start a new match from the leaderboard.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [battleId]);

  const playerAnalysisId = useMemo(() => {
    if (currentAnalysis?.id) return currentAnalysis.id;
    if (queryAnalysisId) return queryAnalysisId;
    if (battle) return battle.user1.analysis_id;
    return undefined;
  }, [battle, currentAnalysis, queryAnalysisId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Loading battle...</p>
      </div>
    );
  }

  if (!battle || !playerAnalysisId || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground px-4 text-center">
        <p className="text-lg text-red-400">{error || 'Battle unavailable.'}</p>
        <Button onClick={() => router.push('/leaderboard')}>Back to Leaderboard</Button>
      </div>
    );
  }

  const isUser1 = battle.user1.analysis_id === playerAnalysisId;
  const user = isUser1 ? battle.user1 : battle.user2;
  const opponent = isUser1 ? battle.user2 : battle.user1;
  const isWinner = battle.winner_id === user.analysis_id;

  const dimensions = [
    {
      name: 'Quantity',
      userScore: user.quantity_score,
      opponentScore: opponent.quantity_score,
    },
    {
      name: 'Morphology',
      userScore: user.morphology_score,
      opponentScore: opponent.morphology_score,
    },
    {
      name: 'Motility',
      userScore: user.motility_score,
      opponentScore: opponent.motility_score,
    },
    {
      name: 'Overall',
      userScore: user.score,
      opponentScore: opponent.score,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 relative overflow-hidden">
      <FloatingSperm />

      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-blob" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-blob animation-delay-2000" />

      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/leaderboard')}
            className="rounded-full text-gray-200 hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl text-white">⚔️ Battle Results</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 relative z-10">
        <motion.div
          className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-800"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Swords className="w-12 h-12 mx-auto text-red-500 mb-2" />
            </motion.div>
            <div className="text-sm text-gray-400">In Battle</div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <motion.div
              className="text-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl mb-2">{user.country_flag}</div>
              <div className="text-xs text-gray-400 mb-1">You</div>
              <div className="text-gray-200 mb-2">{user.title}</div>
              <div className="text-3xl text-red-500 tabular-nums">{user.score}</div>
              <div className="text-xs text-gray-400">pts</div>
            </motion.div>

            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-5xl text-red-500">{isWinner ? 'Victory' : 'Defeat'}</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl mb-2">{opponent.country_flag}</div>
              <div className="text-xs text-gray-400 mb-1">Opponent</div>
              <div className="text-gray-200 mb-2">{opponent.title}</div>
              <div className="text-3xl text-orange-500 tabular-nums">{opponent.score}</div>
              <div className="text-xs text-gray-400">pts</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl mb-6 text-center text-white">Dimension Comparison</h3>
          <div className="space-y-4">
            {dimensions.map((dimension, index) => {
              const totalScore = dimension.userScore + dimension.opponentScore || 1;
              const userWidth = `${(dimension.userScore / totalScore) * 100}%`;
              const opponentWidth = `${(dimension.opponentScore / totalScore) * 100}%`;

              return (
                <div key={dimension.name} className="space-y-2">
                  <div className="text-sm text-gray-400 text-center">{dimension.name}</div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 text-right tabular-nums text-red-500">
                      {dimension.userScore.toFixed(1)}
                    </div>
                    <div className="flex-1 h-8 bg-gray-800 rounded-full overflow-hidden relative">
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600"
                        initial={{ width: 0 }}
                        animate={{ width: userWidth }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                      />
                      <motion.div
                        className="absolute right-0 top-0 h-full bg-gradient-to-l from-orange-500 to-orange-600"
                        initial={{ width: 0 }}
                        animate={{ width: opponentWidth }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <div className="w-16 text-left tabular-nums text-orange-500">
                      {dimension.opponentScore.toFixed(1)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
