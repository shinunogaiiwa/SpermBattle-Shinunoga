'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { FloatingSperm } from '@/components/FloatingSperm';
import { SpermSettings } from '@/components/SpermSettings';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [spermVisible, setSpermVisible] = useState(true);
  const [spermDensity, setSpermDensity] = useState(15);
  const [spermSpeed, setSpermSpeed] = useState(1);
  const router = useRouter();
  const setCurrentAnalysis = useAppStore(state => state.setCurrentAnalysis);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFile = useCallback(async (file: File) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'video/mp4',
      'video/avi',
    ];

    if (!validTypes.includes(file.type)) {
      alert('Please upload an image (JPG/PNG) or video (MP4/AVI) file');
      return;
    }

    setIsUploading(true);

    try {
      const analysis = await api.uploadFile(file);
      setCurrentAnalysis(analysis);
      router.push(`/report/${analysis.id}`);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed, please try again');
    } finally {
      setIsUploading(false);
    }
  }, [router, setCurrentAnalysis]);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await handleFile(files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingSperm
        visible={spermVisible}
        density={spermDensity}
        speed={spermSpeed}
      />
      
      {/* Neon Gaming Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-600 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-700 rounded-full mix-blend-screen filter blur-xl opacity-15 animate-blob animation-delay-4000" />
      
      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent"
            style={{ 
              textShadow: '0 0 40px rgba(176, 38, 255, 0.5)',
              transform: 'translateZ(50px)',
            }}
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            ⚔️ SpermWars
          </motion.h1>
          <motion.p 
            className="text-gray-300 text-xl mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Global Sperm Thunderdome
          </motion.p>
          <motion.p 
            className="text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Upload, get <span className="text-toxic">roasted</span>, race, battle, and dominate!
          </motion.p>
          <motion.p 
            className="text-xs text-gray-600 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            ⚠️ Your sperm might be garbage, but at least it can game!
          </motion.p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          className={`
            relative border-4 border-dashed rounded-3xl p-12 transition-all duration-300 overflow-hidden
            ${
              isDragging
                ? 'border-red-500 bg-red-950/30 scale-105'
                : 'border-gray-700 bg-gray-900/80 backdrop-blur-lg hover:border-red-500 hover:bg-gray-800/80'
            }
            ${isUploading ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 60px rgba(255, 87, 68, 0.4)',
          }}
          style={{
            boxShadow: '0 10px 40px rgba(255, 87, 68, 0.2)',
            transform: 'perspective(1000px) rotateX(2deg)',
          }}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*,video/mp4,video/avi"
            className="hidden"
            onChange={handleFileInput}
            disabled={isUploading}
          />

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-orange-600/10 to-red-700/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
          
          <motion.div className="text-center relative z-10">
            {isUploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                </motion.div>
                <motion.p 
                  className="text-xl text-red-500 mb-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  AI is analyzing...
                </motion.p>
                <p className="text-gray-400 text-sm">
                  Detecting count, morphology, motility...
                </p>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                </motion.div>
                <p className="text-xl text-gray-200 mb-2">
                  Drag & drop files here, or click to upload
                </p>
                <p className="text-gray-400 text-sm">
                  Supports JPG, PNG images or MP4, AVI videos
                </p>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Info Cards */}
        {!isUploading && (
          <motion.div 
            className="grid md:grid-cols-3 gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {[
              { emoji: '🎭', title: 'Fun Titles', desc: 'AI-generated badges', delay: 0 },
              { emoji: '🏆', title: 'Global Rankings', desc: 'Compete worldwide', delay: 0.1 },
              { emoji: '📊', title: 'Scientific Analysis', desc: 'Professional reports', delay: 0.2 },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + card.delay, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: '0 20px 40px rgba(255, 87, 68, 0.3)',
                  borderColor: 'rgba(255, 87, 68, 0.5)',
                }}
                style={{
                  transform: 'perspective(1000px) rotateX(5deg)',
                }}
              >
                <motion.div 
                  className="text-2xl mb-2"
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {card.emoji}
                </motion.div>
                <div className="text-sm text-gray-200">{card.title}</div>
                <div className="text-xs text-gray-400 mt-1">{card.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <SpermSettings
        visible={spermVisible}
        density={spermDensity}
        speed={spermSpeed}
        onVisibilityChange={(value) => setSpermVisible(Boolean(value))}
        onDensityChange={(value) => setSpermDensity(value)}
        onSpeedChange={(value) => setSpermSpeed(value)}
      />
    </div>
  );
}
