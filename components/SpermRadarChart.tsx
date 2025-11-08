'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface SpermRadarChartProps {
  quantityScore: number;
  morphologyScore: number;
  motilityScore: number;
  qualityScore: number;
}

export const SpermRadarChart: React.FC<SpermRadarChartProps> = ({
  quantityScore,
  morphologyScore,
  motilityScore,
  qualityScore,
}) => {
  const data = [
    {
      subject: '数量',
      score: quantityScore,
      fullMark: 100,
    },
    {
      subject: '形态',
      score: morphologyScore,
      fullMark: 100,
    },
    {
      subject: '速度',
      score: motilityScore,
      fullMark: 100,
    },
    {
      subject: '综合',
      score: qualityScore,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#9ca3af', fontSize: 14 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
          <Radar
            name="评分"
            dataKey="score"
            stroke="#FF5744"
            fill="#FF5744"
            fillOpacity={0.6}
          />
          <Legend wrapperStyle={{ color: '#d1d5db' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

