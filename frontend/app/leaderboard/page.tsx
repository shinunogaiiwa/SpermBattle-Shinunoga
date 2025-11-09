'use client';

import React, { useEffect, useState } from 'react';
import { Swords, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FloatingSperm } from '@/components/FloatingSperm';
import { useAppStore } from '@/lib/store';
import { api, type LeaderboardCategory } from '@/lib/api';
import type { LeaderboardEntry } from '@/types';

const roastComments = [
  { user: 'Player420', message: 'How tf you get 8 points??' },
  { user: 'xXNoobSlayerXx', message: 'Bro just adopt atp' },
  { user: 'GamerGod', message: 'You good fam?' },
  { user: 'SpermKing', message: 'LMAOOOO' },
  { user: 'ProGamer', message: 'ded 💀' },
  { user: 'Anonymous', message: 'F in the chat' },
];

const hypeComments = [
  { user: 'GeneChamp', message: 'Never seen motility stats spike like that—clinic reports will be jealous.' },
  { user: 'LabCoach', message: 'Sample looked textbook perfect, even the tail whip cadence stayed on beat.' },
  { user: 'PixelPilot', message: 'Frame-by-frame review shows those swimmers holding their lane like pros.' },
  { user: 'MetaMorph', message: 'Morphology and velocity both in the green zone? That combo is rare.' },
  { user: 'Fertilizer', message: 'High progressive motility with zero lateral drift—absolute clinic.' },
  { user: 'DataWhisperer', message: 'Downstream analytics flagged elite stamina across the entire cohort.' },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardCategory>('global');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const currentAnalysis = useAppStore(state => state.currentAnalysis);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    api
      .getLeaderboard(activeTab)
      .then(data => {
        if (cancelled) return;
        setLeaderboard(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load leaderboard. Please try again.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getTabDescription = (tab: LeaderboardCategory) => {
    switch (tab) {
      case 'global':
        return '🏆 Global Rankings (by overall score)';
      case 'shame':
        return '😂 Hall of Shame (bottom feeders for entertainment)';
      case 'gaming':
        return '🎮 Gaming Leaderboard (by win rate)';
      default:
        return '';
    }
  };

  const handleChallenge = async () => {
    if (!currentAnalysis) {
      alert('Please upload your analysis first!');
      router.push('/');
      return;
    }

    try {
      const battle = await api.createBattle(currentAnalysis.id);
      router.push(`/battle/${battle.id}?analysis=${currentAnalysis.id}`);
    } catch (err) {
      console.error(err);
      alert('Match failed, please try again');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 relative overflow-hidden">
      <FloatingSperm />

      {/* Neon gaming orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-blob" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000" />

      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-gray-200 hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl text-white">🎮 SpermWars Thunderdome</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as LeaderboardCategory)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 h-auto bg-gray-900/80 border border-gray-800">
            <TabsTrigger value="global" className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600">
              <div>
                <div className="text-2xl">🏆</div>
                <div className="text-xs mt-1">Global</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="shame" className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600">
              <div>
                <div className="text-2xl">😂</div>
                <div className="text-xs mt-1">Hall of Shame</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="gaming" className="py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-cyan-600">
              <div>
                <div className="text-2xl">🎮</div>
                <div className="text-xs mt-1">Gaming</div>
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="text-center text-sm text-gray-400 mt-4 mb-6">
            {getTabDescription(activeTab)}
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading && (
              <div className="text-center py-10 text-gray-400">Loading leaderboard...</div>
            )}
            {error && !isLoading && (
              <div className="text-center py-10 text-red-400">{error}</div>
            )}
            {!isLoading && !error && (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = currentAnalysis && entry.analysis_id === currentAnalysis.id;
                  const isShameBoard = activeTab === 'shame';
                  const isGamingBoard = activeTab === 'gaming';
                  const isGlobalBoard = activeTab === 'global';

                  return (
                    <motion.div
                      key={entry.analysis_id}
                      className={`
                        bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-sm transition-all hover:shadow-lg border
                        ${isCurrentUser ? 'ring-2 ring-purple-500 bg-purple-950/30 border-purple-500' : 'border-gray-800'}
                        ${index < 3 && !isShameBoard ? 'border-2 border-yellow-500' : ''}
                        ${isShameBoard && index < 3 ? 'border-2 border-red-500' : ''}
                      `}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                            flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl
                            ${
                              index === 0 && !isShameBoard
                                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                                : index === 1 && !isShameBoard
                                ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                : index === 2 && !isShameBoard
                                ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                : isShameBoard && index < 3
                                ? 'bg-gradient-to-br from-red-600 to-gray-900 text-white'
                                : 'bg-gray-800 text-gray-400'
                            }
                          `}
                        >
                          {isShameBoard && index === 0 ? '💀' : getRankIcon(entry.rank)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{entry.country_flag}</span>
                            <span className="text-sm text-gray-400 truncate">
                              {isCurrentUser ? 'You' : entry.username}
                            </span>
                          </div>
                          <div
                            className={`truncate ${
                              isShameBoard && entry.score < 30 ? 'text-toxic' : 'text-gray-200'
                            }`}
                          >
                            {entry.title}
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <div
                            className={`text-2xl tabular-nums ${
                              isGamingBoard ? 'text-green-500' : isShameBoard ? 'text-red-500' : 'text-purple-500'
                            }`}
                          >
                            {isGamingBoard ? `${entry.score}%` : entry.score}
                          </div>
                          <div className="text-xs text-gray-400">
                            {isGamingBoard ? 'win rate' : 'pts'}
                          </div>
                        </div>

                        <div className="flex-shrink-0 flex gap-2">
                          {!isCurrentUser && !isShameBoard && (
                            <Button
                              size="sm"
                              onClick={handleChallenge}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                              <Swords className="w-4 h-4" />
                            </Button>
                          )}
                          {isShameBoard && index < 3 && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-950/30"
                            >
                              Spectate
                            </Button>
                          )}
                        </div>
                      </div>

                      {isShameBoard && index < 3 && (
                        <motion.div
                          className="mt-3 pt-3 border-t border-gray-800"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                            <MessageCircle className="w-3 h-3" />
                            Comments
                          </div>
                          <div className="space-y-1">
                            {roastComments.slice(index, index + 2).map((comment, idx) => (
                              <div key={idx} className="text-xs text-gray-400">
                                <span className="text-cyan-400">{comment.user}:</span> {comment.message}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {isGlobalBoard && (
                        <motion.div
                          className="mt-3 pt-3 border-t border-gray-800"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.25 }}
                        >
                          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                            <MessageCircle className="w-3 h-3" />
                            Comments
                          </div>
                          <div className="space-y-1">
                            {[hypeComments[index % hypeComments.length], hypeComments[(index + 1) % hypeComments.length]].map(
                              (comment, idx) => (
                                <div key={idx} className="text-xs text-gray-300">
                                  <span className="text-purple-400">{comment.user}:</span> {comment.message}
                                </div>
                              ),
                            )}
                          </div>
                        </motion.div>
                      )}

                      {isGamingBoard && entry.wins !== undefined && (
                        <motion.div
                          className="mt-3 pt-3 border-t border-gray-800 flex gap-4 text-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="text-green-400">{entry.wins ?? 0}W</div>
                          <div className="text-red-400">{entry.losses ?? 0}L</div>
                          <div className="text-gray-500">
                            {(entry.wins ?? 0) + (entry.losses ?? 0)} games
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {currentAnalysis && activeTab !== 'shame' && (
          <motion.div
            className="fixed bottom-6 right-6 z-30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={handleChallenge}
              className="h-16 px-8 text-lg rounded-full shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gaming-pulse"
            >
              <Swords className="w-6 h-6 mr-2" />
              Random Match
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
