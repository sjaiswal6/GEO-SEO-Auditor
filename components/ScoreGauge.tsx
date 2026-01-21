
import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  colorClass: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, colorClass }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            className={colorClass}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-800">{score}</span>
        </div>
      </div>
      <span className="mt-4 text-sm font-semibold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
};

export default ScoreGauge;
