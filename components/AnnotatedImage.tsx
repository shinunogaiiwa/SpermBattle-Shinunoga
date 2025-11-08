'use client';

import React from 'react';

interface AnnotatedImageProps {
  imageUrl: string;
  normalCount: number;
  clusterCount: number;
  pinheadCount: number;
}

export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({
  imageUrl,
  normalCount,
  clusterCount,
  pinheadCount,
}) => {
  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-video border border-gray-700">
        <img
          src={imageUrl}
          alt="Sperm analysis"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a placeholder
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80';
          }}
        />
        
        {/* Simulated bounding boxes */}
        <div className="absolute top-4 left-4">
          <div className="bg-red-500/20 border-2 border-red-500 rounded w-16 h-16" />
        </div>
        <div className="absolute top-12 right-8">
          <div className="bg-red-500/20 border-2 border-red-500 rounded w-12 h-12" />
        </div>
        <div className="absolute bottom-8 left-12">
          <div className="bg-green-500/20 border-2 border-green-500 rounded w-20 h-16" />
        </div>
        <div className="absolute bottom-12 right-12">
          <div className="bg-blue-500/20 border-2 border-blue-500 rounded w-10 h-10" />
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="flex items-center gap-2 bg-red-950/30 p-3 rounded-lg border border-red-900/50">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <div>
            <div className="text-red-400">Normal</div>
            <div className="text-red-200">{normalCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-950/30 p-3 rounded-lg border border-green-900/50">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <div>
            <div className="text-green-400">Cluster</div>
            <div className="text-green-200">{clusterCount}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-950/30 p-3 rounded-lg border border-blue-900/50">
          <div className="w-4 h-4 bg-blue-500 rounded" />
          <div>
            <div className="text-blue-400">Pinhead</div>
            <div className="text-blue-200">{pinheadCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

