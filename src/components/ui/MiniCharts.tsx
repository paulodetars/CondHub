import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
}

export const BarChartMonthly: React.FC<{ data: MonthlyData[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = Math.max(...data.flatMap((d) => [d.receitas, d.despesas]), 1);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Comparativo Mensal (Receitas x Despesas)
        </span>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
            <span>Receitas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-purple-600 inline-block" />
            <span>Despesas</span>
          </div>
        </div>
      </div>

      <div className="h-52 w-full flex items-end gap-6 sm:gap-10 pt-6 pb-2 border-b border-slate-200">
        {data.map((item, idx) => {
          const revHeight = (item.receitas / maxValue) * 100;
          const expHeight = (item.despesas / maxValue) * 100;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] p-2 rounded shadow-lg whitespace-nowrap pointer-events-none tabular-nums border border-slate-800">
                  <div className="font-semibold">{item.month}</div>
                  <div className="text-emerald-400">Receitas: {formatCurrency(item.receitas)}</div>
                  <div className="text-purple-300">Despesas: {formatCurrency(item.despesas)}</div>
                </div>
              )}

              {/* Bars container */}
              <div className="w-full flex items-end justify-center gap-2 h-full">
                {/* Receitas */}
                <div
                  className="w-5 sm:w-8 bg-emerald-500 rounded-t-sm transition-all duration-300 hover:brightness-110"
                  style={{ height: `${Math.max(revHeight, 4)}%` }}
                />
                {/* Despesas */}
                <div
                  className="w-5 sm:w-8 bg-purple-600 rounded-t-sm transition-all duration-300 hover:brightness-110"
                  style={{ height: `${Math.max(expHeight, 4)}%` }}
                />
              </div>

              {/* Label */}
              <span className="text-xs font-medium text-slate-600 mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface CategoryBreakdown {
  category: string;
  amount: number;
  color: string;
}

export const CategoryDonut: React.FC<{ items: CategoryBreakdown[] }> = ({ items }) => {
  const total = items.reduce((acc, i) => acc + i.amount, 0);
  const [activeCategory, setActiveCategory] = useState<CategoryBreakdown | null>(null);

  // SVG Donut calculation
  let cumulativeAngle = 0;
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const strokeWidth = 26;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
          {items.map((item) => {
            const percentage = total > 0 ? item.amount / total : 0;
            const strokeDasharray = `${percentage * 377} 377`;
            const strokeDashoffset = -cumulativeAngle * 377;
            cumulativeAngle += percentage;

            return (
              <circle
                key={item.category}
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all hover:opacity-85 cursor-pointer"
                onMouseEnter={() => setActiveCategory(item)}
                onMouseLeave={() => setActiveCategory(null)}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Total</span>
          <span className="text-xs font-bold text-slate-900 tabular-nums font-mono">
            {formatCurrency(total).replace('R$', '').trim()}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-2">
        {items.slice(0, 5).map((item) => {
          const pct = total > 0 ? ((item.amount / total) * 100).toFixed(1) : '0';
          const isActive = activeCategory?.category === item.category;

          return (
            <div
              key={item.category}
              className={`flex items-center justify-between text-xs py-1 px-1.5 rounded transition-colors ${
                isActive ? 'bg-slate-100 font-semibold' : 'text-slate-600'
              }`}
              onMouseEnter={() => setActiveCategory(item)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.category}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 tabular-nums">
                <span className="text-slate-900 font-medium">{formatCurrency(item.amount)}</span>
                <span className="text-slate-400 w-10 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
