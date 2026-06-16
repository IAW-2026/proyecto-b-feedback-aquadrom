import React from 'react';

interface ReviewCardProps {
  idLabel: string;
  idValue: string;
  stars: number;
  comment: string;
  date: string;
  action?: React.ReactNode;
  subtitle?: string;
}

export default function ReviewCard({ 
  idLabel, 
  idValue, 
  stars, 
  comment, 
  date, 
  action,
  subtitle 
}: ReviewCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{idLabel}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-30">{idValue}</p>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <span className="text-amber-500 font-bold">{stars} ★</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{comment || 'Sin comentario'}"</p>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
        <span className="text-xs text-slate-400">{date}</span>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
