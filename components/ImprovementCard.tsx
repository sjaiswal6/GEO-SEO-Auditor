
import React from 'react';
import { Improvement } from '../types';

interface ImprovementCardProps {
  item: Improvement;
}

const ImprovementCard: React.FC<ImprovementCardProps> = ({ item }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-tight text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          {item.category}
        </span>
        <div className="flex gap-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${getImpactColor(item.impact)}`}>
            {item.impact} Impact
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-600">
            {item.effort} Effort
          </span>
        </div>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">{item.suggestion}</p>
    </div>
  );
};

export default ImprovementCard;
