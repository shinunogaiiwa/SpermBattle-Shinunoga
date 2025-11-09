'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Share2, Swords, TrendingUp, Zap, Gamepad2, Info, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { SpermRadarChart } from '@/components/SpermRadarChart';
import { AnnotatedImage } from '@/components/AnnotatedImage';
import { Button } from '@/components/ui/button';
import { FloatingSperm } from '@/components/FloatingSperm';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import type { Analysis } from '@/types';
import { generateRoasts, generateBadges } from '@/lib/roastGenerator';

export default function ReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const analysisFromStore = useAppStore(state => state.currentAnalysis);
  const setCurrentAnalysis = useAppStore(state => state.setCurrentAnalysis);
  const analysisId = parseInt(params.id, 10);
  const initialAnalysis =
    analysisFromStore && analysisFromStore.id === analysisId
      ? analysisFromStore
      : null;
  const [analysis, setAnalysis] = useState<Analysis | null>(initialAnalysis);
  const [isLoading, setIsLoading] = useState(!initialAnalysis);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (analysisFromStore && analysisFromStore.id === analysisId) {
      setAnalysis(analysisFromStore);
      setIsLoading(false);
      setError(null);
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);
    setError(null);

    api
      .getAnalysis(analysisId)
      .then(data => {
        if (cancelled) return;
        setAnalysis(data);
        setCurrentAnalysis(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Analysis not found. Upload a sample to continue.');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [analysisFromStore, analysisId, setCurrentAnalysis]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Loading analysis...</h1>
          <p className="text-sm text-gray-500">Please hold while we fetch your results.</p>
        </div>
      </div>
    );
  }

  if (!analysis || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl mb-4">{error || 'Analysis not found'}</h1>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const getTitleColor = (category: string) => {
    switch (category) {
      case 'GOD':
        return 'from-yellow-500 to-orange-600';
      case 'MID':
        return 'from-blue-600 to-cyan-600';
      case 'TRASH':
        return 'from-orange-600 to-red-700';
      case 'OMEGA':
        return 'from-gray-600 to-gray-900';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getTitleEmoji = (category: string) => {
    switch (category) {
      case 'GOD':
        return '👑';
      case 'MID':
        return '🤷';
      case 'TRASH':
        return '😭';
      case 'OMEGA':
        return '💀';
      default:
        return '🌱';
    }
  };

  const handleShare = () => {
    const text = `I earned the "${analysis.title}" title on SpermBattle!\nTotal Score: ${analysis.quality_score}/100\nBeat ${analysis.percentile}% of global users!\nDare to challenge me?`;
    
    if (navigator.share) {
      navigator.share({
        title: 'SpermBattle Results',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  const handleStartBattle = async () => {
    try {
      const battle = await api.createBattle(analysis.id);
      router.push(`/battle/${battle.id}?analysis=${analysis.id}`);
    } catch (err) {
      console.error(err);
      alert('Match failed, please try again');
    }
  };

  // Generate roasts and badges from analysis data
  const roasts = analysis ? generateRoasts(analysis) : null;
  const badges = analysis ? generateBadges(analysis) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 relative overflow-hidden">
      <FloatingSperm />
      
      {/* 3D Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-600 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-blob animation-delay-2000" />
      
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl text-white">🏆 SpermBattle</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 relative z-10">
        {/* Title Card */}
        <motion.div
          className={`
          bg-gradient-to-br ${getTitleColor(analysis.title_category)}
          rounded-3xl p-8 text-white text-center shadow-2xl
        `}
          initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 30px 60px rgba(255, 87, 68, 0.5)',
          }}
          style={{
            transform: 'perspective(1000px)',
          }}
        >
          <motion.div 
            className="text-5xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {getTitleEmoji(analysis.title_category)}
          </motion.div>
          <div className="text-sm opacity-80 mb-2">Your Title</div>
          <h2 className="text-3xl md:text-4xl mb-6">{analysis.title}</h2>
          <div className="flex items-center justify-center gap-8 text-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <div className="text-5xl mb-1">{analysis.quality_score}</div>
              <div className="opacity-80">Total Score</div>
            </motion.div>
            <div className="h-16 w-px bg-white/30" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              <div className="text-5xl mb-1">TOP {analysis.percentile}%</div>
              <div className="opacity-80">Global Rank</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(255, 87, 68, 0.3)',
            borderColor: 'rgba(255, 87, 68, 0.5)',
          }}
          style={{
            transform: 'perspective(1000px) rotateY(2deg)',
          }}
        >
          <h3 className="text-xl mb-4 flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5 text-red-500" />
            4D Score Analysis
          </h3>
          <SpermRadarChart
            quantityScore={analysis.quantity_score}
            morphologyScore={analysis.morphology_score}
            motilityScore={analysis.motility_score}
            qualityScore={analysis.quality_score}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl text-purple-600">{analysis.quantity_score}</div>
              <div className="text-xs text-gray-600">Quantity</div>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg text-center">
              <div className="text-2xl text-pink-600">{analysis.morphology_score}</div>
              <div className="text-xs text-gray-600">Morphology</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl text-blue-600">{analysis.motility_score}</div>
              <div className="text-xs text-gray-600">Motility</div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg text-center">
              <div className="text-2xl text-indigo-600">{analysis.quality_score}</div>
              <div className="text-xs text-gray-600">Overall</div>
            </div>
          </div>
        </motion.div>

        {/* Individual Roast Cards - 2x2 Grid */}
        {roasts && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Speed Roast */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="p-4 rounded-xl bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 hover:border-red-500/60 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0">⚡</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm text-red-400 font-semibold mb-1">Speed</div>
                    <div className="text-sm md:text-base text-white break-words">{roasts.speed_roast}</div>
                  </div>
                </div>
              </motion.div>

              {/* Morphology Roast */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 hover:border-purple-500/60 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0">🎨</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm text-purple-400 font-semibold mb-1">Morphology</div>
                    <div className="text-sm md:text-base text-white break-words">{roasts.morphology_roast}</div>
                  </div>
                </div>
              </motion.div>

              {/* Quantity Roast */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 hover:border-blue-500/60 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0">🔢</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm text-blue-400 font-semibold mb-1">Quantity</div>
                    <div className="text-sm md:text-base text-white break-words">{roasts.quantity_roast}</div>
                  </div>
                </div>
              </motion.div>

              {/* Motility Roast */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="p-4 rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 hover:border-green-500/60 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0">🏊</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm text-green-400 font-semibold mb-1">Motility</div>
                    <div className="text-sm md:text-base text-white break-words">{roasts.motility_roast}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Overall Roast - Prominent Single Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-500/50 backdrop-blur-sm hover:border-red-500/80 transition-all"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl md:text-5xl">💀</div>
                <div className="flex-1">
                  <div className="text-sm md:text-base text-red-400 font-bold mb-1">Bottom Line:</div>
                  <div className="text-lg md:text-2xl text-white font-medium">{roasts.overall_roast}</div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Achievements Unlocked */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl md:text-4xl">🏅</div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Achievements Unlocked
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    delay: 0.6 + index * 0.1,
                    stiffness: 200,
                    damping: 15
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-black/30 border border-yellow-500/30 hover:border-yellow-500/60 hover:bg-black/40 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl md:text-5xl">{badge.emoji}</div>
                  <div className="flex-1">
                    <div className="text-base md:text-lg font-bold text-yellow-400">
                      {badge.title}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400">{badge.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Annotated Image */}
        <motion.div 
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(255, 87, 68, 0.3)',
            borderColor: 'rgba(255, 87, 68, 0.5)',
          }}
          style={{
            transform: 'perspective(1000px) rotateY(-2deg)',
          }}
        >
          <h3 className="text-xl mb-4 text-white">🔬 Microscope Detection Results</h3>
          <AnnotatedImage
            imageUrl={analysis.annotated_image_url}
            normalCount={analysis.normal_count}
            clusterCount={analysis.cluster_count}
            pinheadCount={analysis.pinhead_count}
          />
        </motion.div>


        {/* Action Buttons */}
        <motion.div 
          className="grid md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push('/leaderboard')}
              className="h-16 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full shadow-lg"
            >
              <Trophy className="w-5 h-5 mr-2" />
              View Leaderboard
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleStartBattle}
              className="h-16 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 w-full shadow-lg"
            >
              <Swords className="w-5 h-5 mr-2" />
              PK Battle
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleShare}
              variant="outline"
              className="h-16 text-lg border-2 border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-red-500 w-full shadow-lg"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Results
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Info Button - Bottom Right */}
        <motion.button
          onClick={() => setShowExplanation(true)}
          className="fixed bottom-8 right-8 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-white/30 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Info className="w-6 h-6 text-white" />
          <span className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            How stats work
          </span>
        </motion.button>

        {/* Scientific Explanation Modal */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowExplanation(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto border-2 border-gray-700 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6 sticky top-0 bg-gray-900 pb-4 border-b border-gray-700">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">📊 How We Calculate These Stats</h3>
                  <p className="text-sm text-gray-400">Scientific methodology behind your scores</p>
                </div>
                <button 
                  onClick={() => setShowExplanation(false)} 
                  className="text-gray-400 hover:text-white transition-colors ml-4 p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-gray-700">
                    <div className="font-semibold text-gray-100 mb-2">Quantity Score</div>
                    <p className="text-gray-400 text-sm">
                      Scales with the number of detected tracks and samples per second from the YOLO run.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-gray-700">
                    <div className="font-semibold text-gray-100 mb-2">Morphology Score</div>
                    <p className="text-gray-400 text-sm">
                      Rewards a higher ratio of active tracks (mean speed ≥ 5px/s) versus noisy detections.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-gray-700">
                    <div className="font-semibold text-gray-100 mb-2">Motility Score</div>
                    <p className="text-gray-400 text-sm">
                      Uses the analyzer&apos;s average speed plus burst spikes to represent mobility.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-800/80 border border-gray-700">
                    <div className="font-semibold text-gray-100 mb-2">Overall (Quality) Score</div>
                    <p className="text-gray-400 text-sm">
                      A weighted blend of speed, burst potential, and coverage. The same value drives your title and leaderboard rank.
                    </p>
                  </div>
                </div>

                {/* Detection Details */}
                <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                  <div className="font-semibold text-blue-400 mb-3">💡 Detection Colors</div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><span className="text-red-400">🔴 Red boxes</span> = Normal/healthy sperm detected</p>
                    <p><span className="text-green-400">🟢 Green boxes</span> = Sperm clusters (multiple stuck together)</p>
                    <p><span className="text-blue-400">🔵 Blue boxes</span> = Pinhead or abnormal morphology</p>
                  </div>
                </div>

                {/* Detection Statistics */}
                <div className="p-4 rounded-lg bg-gray-800/80 border border-gray-700">
                  <div className="font-semibold text-gray-100 mb-3">📊 Your Detection Details</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Sperm Detected:</span>
                      <span className="text-white font-medium">{analysis.total_sperm}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Normal Morphology:</span>
                      <span className="text-white font-medium">
                        {analysis.normal_count} ({Math.round((analysis.normal_count / analysis.total_sperm) * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Sperm Clusters:</span>
                      <span className="text-white font-medium">
                        {analysis.cluster_count} ({Math.round((analysis.cluster_count / analysis.total_sperm) * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Pinhead Sperm:</span>
                      <span className="text-white font-medium">
                        {analysis.pinhead_count} ({Math.round((analysis.pinhead_count / analysis.total_sperm) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Assessment */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30">
                  <div className="font-semibold text-purple-400 mb-2">💡 Overall Assessment</div>
                  <p className="text-gray-300 text-sm">
                    {analysis.quality_score >= 80
                      ? 'Your sperm quality is "Excellent"! Keep up the healthy lifestyle.'
                      : analysis.quality_score >= 60
                      ? 'Your sperm quality is "Good"! Regular exercise and balanced diet can improve it further.'
                      : 'Consider consulting a healthcare professional to learn how to improve sperm quality.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
