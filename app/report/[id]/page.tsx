'use client';

import React, { use } from 'react';
import { Trophy, Share2, Swords, TrendingUp, Zap, Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { SpermRadarChart } from '@/components/SpermRadarChart';
import { AnnotatedImage } from '@/components/AnnotatedImage';
import { Button } from '@/components/ui/button';
import { FloatingSperm } from '@/components/FloatingSperm';
import { useAppStore } from '@/lib/store';
import { getAnalysisById } from '@/lib/mockData';

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const currentAnalysis = useAppStore(state => state.currentAnalysis);
  
  // Get analysis from store or fetch by ID
  const analysis = currentAnalysis || getAnalysisById(parseInt(resolvedParams.id));

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Analysis not found</h1>
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

        {/* Scientific Explanation */}
        <motion.div 
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(255, 87, 68, 0.3)',
            borderColor: 'rgba(255, 87, 68, 0.5)',
          }}
        >
          <h3 className="text-xl mb-4 text-white">📊 Detection Details</h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <div className="text-sm opacity-70">Total Sperm Detected</div>
                <div className="text-lg">{analysis.total_sperm}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔴</div>
              <div>
                <div className="text-sm opacity-70">Normal Morphology Sperm</div>
                <div className="text-lg">
                  {analysis.normal_count} (
                  {Math.round((analysis.normal_count / analysis.total_sperm) * 100)}%)
                  <span className="text-sm text-gray-500 ml-2">
                    ← WHO standard: &gt;4% is normal
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🟢</div>
              <div>
                <div className="text-sm opacity-70">Sperm Clusters</div>
                <div className="text-lg">
                  {analysis.cluster_count} (
                  {Math.round((analysis.cluster_count / analysis.total_sperm) * 100)}%)
                  <span className="text-sm text-gray-500 ml-2">
                    ← May indicate incomplete liquefaction
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔵</div>
              <div>
                <div className="text-sm opacity-70">Pinhead Sperm</div>
                <div className="text-lg">
                  {analysis.pinhead_count} (
                  {Math.round((analysis.pinhead_count / analysis.total_sperm) * 100)}%)
                  <span className="text-sm text-gray-500 ml-2">
                    ← Abnormal morphology, low fertility potential
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <div className="text-sm opacity-70 mb-1 text-gray-800">Overall Assessment</div>
                <div className="text-gray-700">
                  {analysis.quality_score >= 80
                    ? 'Your sperm quality is "Excellent"! Keep up the healthy lifestyle.'
                    : analysis.quality_score >= 60
                    ? 'Your sperm quality is "Good"! Regular exercise and balanced diet can improve it further.'
                    : 'Consider consulting a healthcare professional to learn how to improve sperm quality.'}
                </div>
              </div>
            </div>
          </div>
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
              onClick={() => router.push(`/battle/${analysis.id}`)}
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
      </div>
    </div>
  );
}
