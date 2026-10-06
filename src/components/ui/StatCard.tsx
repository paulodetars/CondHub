import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  icon?: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'purple' | 'neutral';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon: Icon,
  iconColor = 'text-purple-600',
  badge,
  badgeVariant = 'neutral',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 p-5 transition-all ${
        onClick ? 'cursor-pointer hover:border-purple-300 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</div>
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ${
              badgeVariant === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : badgeVariant === 'warning'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                : badgeVariant === 'danger'
                ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                : badgeVariant === 'purple'
                ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                : 'bg-slate-100 text-slate-700 border border-slate-200/60'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      {(subValue || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          {trend && (
            <span
              className={`font-medium tabular-nums ${
                trend.positive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
          {trend && subValue && <span className="text-slate-300">·</span>}
          {subValue && <span>{subValue}</span>}
        </div>
      )}
    </div>
  );
};
