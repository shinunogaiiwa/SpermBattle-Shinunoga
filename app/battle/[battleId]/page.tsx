'use client';

import React, { use } from 'react';
import { ArrowLeft, Swords, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FloatingSperm } from '@/components/FloatingSperm';
import { useAppStore } from '@/lib/store';
import { createBattle } from '@/lib/mockData';

export default function BattlePage({ params }: { params: Promise<{ battleId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const currentAnalysis = useAppStore(state => state.currentAnalysis);

  if (!currentAnalysis) {
    router.push('/');
    return null;
  }

  // Create a new battle
  const battle = createBattle(currentAnalysis.id);
  const isUser1 = battle.user1.analysis_id === currentAnalysis.id;
  const user = isUser1 ? battle.user1 : battle.user2;
  const opponent = isUser1 ? battle.user2 : battle.user1;
  const isWinner = battle.winner_id === user.analysis_id;

  const getDimensionWinner = (
    userScore: number,
    opponentScore: number
  ): 'user' | 'opponent' | 'tie' => {
    if (userScore > opponentScore) return 'user';
    if (opponentScore > userScore) return 'opponent';
    return 'tie';
  };

  const dimensions = [
    {
      name: 'Quantity',
      userScore: user.quantity_score,
      opponentScore: opponent.quantity_score,
      winner: getDimensionWinner(user.quantity_score, opponent.quantity_score),
    },
    {
      name: 'Morphology',
      userScore: user.morphology_score,
      opponentScore: opponent.morphology_score,
      winner: getDimensionWinner(user.morphology_score, opponent.morphology_score),
    },
    {
      name: 'Motility',
      userScore: user.motility_score,
      opponentScore: opponent.motility_score,
      winner: getDimensionWinner(user.motility_score, opponent.motility_score),
    },
    {
      name: 'Overall',
      userScore: user.score,
      opponentScore: opponent.score,
      winner: getDimensionWinner(user.score, opponent.score),
    },
  ];

  const handleShare = () => {
    const result = isWinner ? 'defeated' : 'lost to';
    const text = `I ${result} my opponent on SpermBattle!\nMe: ${user.score} pts vs Opponent: ${opponent.score} pts\nCome challenge me!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'SpermBattle Result',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 relative overflow-hidden">
      <FloatingSperm />
      
      {/* 3D Gradient Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-blob" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-blob animation-delay-2000" />
      
      {/* Header */}
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
        {/* VS Header */}
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
            {/* User */}
            <motion.div 
              className="text-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl mb-2">{user.country_flag}</div>
              <div className="text-xs text-gray-400 mb-1">You</div>
              <div className="text-gray-200 mb-2">{user.title}</div>
              <div className="text-3xl text-red-500 tabular-nums">
                {user.score}
              </div>
              <div className="text-xs text-gray-400">pts</div>
            </motion.div>

            {/* VS */}
            <motion.div 
              className="text-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-5xl text-red-500">VS</div>
            </motion.div>

            {/* Opponent */}
            <motion.div 
              className="text-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl mb-2">{opponent.country_flag}</div>
              <div className="text-xs text-gray-400 mb-1">Opponent</div>
              <div className="text-gray-200 mb-2">{opponent.title}</div>
              <div className="text-3xl text-orange-500 tabular-nums">
                {opponent.score}
              </div>
              <div className="text-xs text-gray-400">pts</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Dimension Comparison */}
        <motion.div 
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl mb-6 text-center text-white">Dimension Comparison</h3>
          <div className="space-y-4">
            {dimensions.map((dimension, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm text-gray-400 text-center">
                  {dimension.name}
                </div>
                <div className="flex items-center gap-3">
                  {/* User Score */}
                  <div className="w-16 text-right tabular-nums text-red-500">
                    {dimension.userScore}
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 h-8 bg-gray-800 rounded-full overflow-hidden relative">
                    {/* User bar */}
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (dimension.userScore /
                            (dimension.userScore + dimension.opponentScore)) *
                          100
                        }%`,
                      }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    />
                    {/* Opponent bar */}
                    <motion.div
                      className="absolute right-0 top-0 h-full bg-gradient-to-l from-orange-500 to-orange-600"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (dimension.opponentScore /
                            (dimension.userScore + dimension.opponentScore)) *
                          100
                        }%`,
                      }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    />
                  </div>

                  {/* Opponent Score */}
                  <div className="w-16 text-left tabular-nums text-orange-500">
                    {dimension.opponentScore}
                  </div>

                  {/* Winner Icon */}
                  <div className="w-6">
                    {dimension.winner === 'user' && (
                      <span className="text-green-500">✓</span>
                    )}
                    {dimension.winner === 'opponent' && (
                      <span className="text-red-500">✗</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Result Card */}
        <motion.div
          className={`
          rounded-2xl p-8 text-center shadow-lg border
          ${
            isWinner
              ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white border-green-500'
              : 'bg-gradient-to-br from-orange-600 to-red-700 text-white border-red-500'
          }
        `}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <div className="text-6xl mb-4">{isWinner ? '🎉' : '😢'}</div>
          <div className="text-3xl mb-4">
            {isWinner ? 'Victory!' : 'Close Match'}
          </div>
          <div className="text-xl opacity-90 mb-2">
            {isWinner
              ? `You won by ${battle.score_difference.toFixed(1)} points!`
              : `Lost by only ${battle.score_difference.toFixed(1)} points. Keep going!`}
          </div>
          <div className="text-sm opacity-80">
            {isWinner
              ? 'Congratulations! Keep it up! 💪'
              : dimensions
                  .filter(d => d.winner === 'opponent')
                  .map(d => d.name)
                  .join(', ') + ' can be improved!'}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push('/leaderboard')}
              size="lg"
              className="h-14 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full"
            >
              <Swords className="w-5 h-5 mr-2" />
              Rematch
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleShare}
              size="lg"
              variant="outline"
              className="h-14 text-lg border-2 border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-red-500 w-full"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </Button>
          </motion.div>
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push('/leaderboard')} className="text-gray-400 hover:text-gray-200 hover:bg-gray-800">
            Back to Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}
