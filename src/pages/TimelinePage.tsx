import React from 'react';
import { useCondo } from '../context/CondoContext';
import {
  Clock,
  DollarSign,
  Megaphone,
  Vote,
  Users,
  Wrench,
  FileCheck,
  FileText,
} from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { timeline } = useCondo();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'finance':
        return DollarSign;
      case 'announcement':
        return Megaphone;
      case 'vote':
        return Vote;
      case 'assembly':
        return Users;
      case 'maintenance':
        return Wrench;
      case 'balancete':
        return FileCheck;
      default:
        return FileText;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Timeline de Governança</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Linha do tempo ao vivo registrando acontecimentos financeiros, operacionais e decisões no condomínio.
        </p>
      </div>

      <div className="relative border-l-2 border-purple-200 ml-4 sm:ml-6 space-y-6 py-2">
        {timeline.map((item) => {
          const Icon = getCategoryIcon(item.category);

          return (
            <div key={item.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline marker node */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-purple-600 flex items-center justify-center text-purple-700 shadow-xs group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4" />
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-purple-300 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60 uppercase">
                      {item.badgeText}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  </div>

                  <span className="text-xs text-slate-400 tabular-nums">
                    {item.date} às {item.time}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  Registrado por: <strong className="text-slate-600">{item.author}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
