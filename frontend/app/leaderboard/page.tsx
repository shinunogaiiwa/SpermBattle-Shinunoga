'use client';

import React, { useEffect, useState } from 'react';
import { Swords, ArrowLeft, MessageCircle, Info, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FloatingSperm } from '@/components/FloatingSperm';
import { useAppStore } from '@/lib/store';
import { api, type LeaderboardCategory } from '@/lib/api';
import type { LeaderboardEntry, UserHealthData } from '@/types';
import { enhanceLeaderboardWithHealthData, calculateRacingBoost, randomizeRacingLeaderboard } from '@/lib/mockData';

const roastComments = [
  { user: 'Player420', message: 'How tf you get 8 points??' },
  { user: 'xXNoobSlayerXx', message: 'Bro just adopt atp' },
  { user: 'GamerGod', message: 'You good fam?' },
  { user: 'SpermKing', message: 'LMAOOOO' },
  { user: 'ProGamer', message: 'ded 💀' },
  { user: 'Anonymous', message: 'F in the chat' },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardCategory>('global');
  const [leaderboard, setLeaderboard] = useState<Array<LeaderboardEntry & { healthData?: UserHealthData }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<(LeaderboardEntry & { healthData?: UserHealthData }) | null>(null);
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
        // 🆕 Randomize usernames/titles for racing mode
        const isRacingMode = activeTab === 'gaming';
        let processedData = data;
        if (isRacingMode) {
          processedData = randomizeRacingLeaderboard(data, currentAnalysis?.id);
        }
        // 🆕 Enhance with health data (pass isRacingMode for higher device/app chance)
        const enhanced = enhanceLeaderboardWithHealthData(processedData, isRacingMode);
        setLeaderboard(enhanced);
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
  }, [activeTab, currentAnalysis]);

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
        return ''; // Hidden subtitle for racing mode
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
                <div className="text-2xl">🏃</div>
                <div className="text-xs mt-1">Real Life Racing</div>
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
                {leaderboard.slice(0, activeTab === 'gaming' ? 8 : leaderboard.length).map((entry, index) => {
                  const isCurrentUser = currentAnalysis && entry.analysis_id === currentAnalysis.id;
                  const isShameBoard = activeTab === 'shame';
                  const isGamingBoard = activeTab === 'gaming';

                  return (
                    <motion.div
                      key={entry.analysis_id}
                      className={`
                        bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-sm transition-all hover:shadow-lg border cursor-pointer
                        ${isCurrentUser ? 'ring-2 ring-purple-500 bg-purple-950/30 border-purple-500' : 'border-gray-800'}
                        ${index < 3 && !isShameBoard ? 'border-2 border-yellow-500' : ''}
                        ${isShameBoard && index < 3 ? 'border-2 border-red-500' : ''}
                      `}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => setSelectedUser(entry)}
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
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-lg">{entry.country_flag}</span>
                            <span className="text-sm text-gray-400 truncate">
                              {isCurrentUser ? 'You' : entry.username}
                            </span>
                            
                            {/* 🆕 Rank Change */}
                            {entry.rank_change && entry.rank_change !== 0 && (
                              <span className={`text-xs font-semibold ${entry.rank_change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {entry.rank_change > 0 ? '⬆️' : '⬇️'} {Math.abs(entry.rank_change)}
                              </span>
                            )}
                          </div>
                          <div
                            className={`truncate ${
                              isShameBoard && entry.score < 30 ? 'text-toxic' : 'text-gray-200'
                            }`}
                          >
                            {entry.title}
                          </div>
                        </div>

                        {!isGamingBoard && (
                          <>
                            <div className="flex-shrink-0 text-right">
                              <div
                                className={`text-2xl tabular-nums ${
                                  isShameBoard ? 'text-red-500' : 'text-purple-500'
                                }`}
                              >
                                {entry.score}
                              </div>
                              <div className="text-xs text-gray-400">pts</div>
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
                          </>
                        )}
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

                      {isGamingBoard && (entry.device || (entry.connected_apps && entry.connected_apps.length > 0)) && (
                        <motion.div
                          className="mt-3 pt-3 border-t border-gray-800"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {/* Connected Apps/Devices */}
                          <div className="flex items-center gap-1 flex-wrap">
                            {/* Device Badge */}
                            {entry.device && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                                <span>⌚</span>
                                <span>{entry.device}</span>
                              </span>
                            )}
                            
                            {/* Connected Apps */}
                            {entry.connected_apps?.map((app, appIdx) => {
                              // Map colors to Tailwind classes
                              const colorClasses = {
                                cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                                green: 'bg-green-500/20 text-green-400 border-green-500/30',
                                blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                                purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                                orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                                indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
                                red: 'bg-red-500/20 text-red-400 border-red-500/30',
                              };
                              return (
                                <span
                                  key={`${app.name}-${appIdx}`}
                                  className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${colorClasses[app.color as keyof typeof colorClasses] || colorClasses.blue}`}
                                >
                                  <span>{app.icon}</span>
                                  <span>{app.name}</span>
                                </span>
                              );
                            })}
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

        {/* User Health Detail Modal */}
        {selectedUser && selectedUser.healthData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full border-2 border-cyan-500/50 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl">{selectedUser.country_flag}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedUser.username}</h2>
                      <div className="text-sm text-gray-400">{selectedUser.title}</div>
                    </div>
                  </div>
                  
                  {selectedUser.device && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">
                        ⌚ {selectedUser.device}
                      </span>
                      <span className="text-sm text-gray-400">Connected 7 days ago</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Health Score Overview */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-900/30 to-cyan-900/30 border border-green-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-gray-400">Overall Health Score</div>
                    <div className="text-4xl font-bold text-green-400">
                      {selectedUser.health_score}/100
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">vs Last Month</div>
                    <div className={`text-2xl font-bold flex items-center gap-1 ${
                      (selectedUser.score_change || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <span>{(selectedUser.score_change || 0) >= 0 ? '⬆️' : '⬇️'}</span>
                      <span>{Math.abs(selectedUser.score_change || 0)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedUser.health_score}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Health Improvements This Month - Simplified Card View */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>📊</span>
                  <span>Health Improvements This Month</span>
                </h3>

                {/* 2x2 Grid of Simple Cards */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Sleep Card */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/30 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">😴</div>
                      <div className="text-xs text-gray-400 mb-1">Sleep</div>
                      <div className={`text-2xl font-bold ${
                        selectedUser.healthData.sleep.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedUser.healthData.sleep.change >= 0 ? '↗️' : '↘️'} 
                        {selectedUser.healthData.sleep.change >= 0 ? '+' : ''}{(selectedUser.healthData.sleep.change * 60).toFixed(0)}min
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedUser.healthData.sleep.average}h avg
                      </div>
                    </div>
                  </motion.div>

                  {/* Steps Card */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 hover:border-green-500/50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏃</div>
                      <div className="text-xs text-gray-400 mb-1">Steps</div>
                      <div className={`text-2xl font-bold ${
                        selectedUser.healthData.activity.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedUser.healthData.activity.change >= 0 ? '↗️' : '↘️'} 
                        {selectedUser.healthData.activity.change >= 0 ? '+' : ''}{(selectedUser.healthData.activity.change / 1000).toFixed(1)}k
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(selectedUser.healthData.activity.steps / 1000).toFixed(1)}k avg
                      </div>
                    </div>
                  </motion.div>

                  {/* Workouts Card */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 hover:border-orange-500/50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🔥</div>
                      <div className="text-xs text-gray-400 mb-1">Workouts</div>
                      <div className={`text-2xl font-bold ${
                        selectedUser.healthData.workouts.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedUser.healthData.workouts.change >= 0 ? '↗️' : '↘️'} 
                        {selectedUser.healthData.workouts.change >= 0 ? '+' : ''}{selectedUser.healthData.workouts.change}x
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedUser.healthData.workouts.per_week}x/week
                      </div>
                    </div>
                  </motion.div>

                  {/* Heart Card */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-red-900/30 to-pink-900/30 border border-red-500/30 hover:border-red-500/50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">❤️</div>
                      <div className="text-xs text-gray-400 mb-1">Heart</div>
                      <div className={`text-2xl font-bold ${
                        selectedUser.healthData.heart.change <= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedUser.healthData.heart.change <= 0 ? '↘️' : '↗️'} 
                        {Math.abs(selectedUser.healthData.heart.change)}bpm
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedUser.healthData.heart.resting_hr} avg
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Racing Boost Summary */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🎮</div>
                      <div>
                        <div className="text-sm text-gray-400">Racing Power</div>
                        <div className="text-xs text-gray-500">Based on health data</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-400">
                        +{calculateRacingBoost(selectedUser.healthData) - 100}%
                      </div>
                      <div className="text-xs text-gray-400">speed boost</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Privacy Notice */}
              <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <span>🔒</span>
                  <div>
                    <span className="font-semibold text-gray-300">Privacy:</span> This user has consented to share their health data publicly for competitive purposes. All data is anonymized and aggregated.
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
