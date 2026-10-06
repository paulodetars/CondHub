import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { BalancetePeriod } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { CloseBalanceteModal } from '../components/modals/CloseBalanceteModal';
import { useToast } from '../components/ui/Toast';
import {
  FileSpreadsheet,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Download,
} from 'lucide-react';

export const BalancetesPage: React.FC = () => {
  const { role } = useAuth();
  const { balancetes, reopenBalancete } = useCondo();
  const { showToast } = useToast();

  const [balanceteToClose, setBalanceteToClose] = useState<BalancetePeriod | null>(null);

  const canManage = role === 'sindico' || role === 'admin';
  const isAdmin = role === 'admin';

  const handleReopen = (b: BalancetePeriod) => {
    if (!isAdmin) {
      showToast('Ação restrita', 'Apenas a Administradora pode reabrir um balancete fechado.', 'error');
      return;
    }
    if (window.confirm(`Deseja reabrir o balancete de ${b.periodLabel}? As edições serão desbloqueadas temporariamente.`)) {
      const res = reopenBalancete(b.id);
      if (res.success) {
        showToast('Balancete reaberto', res.message, 'success');
      } else {
        showToast('Erro', res.message, 'error');
      }
    }
  };

  const handleExportPDF = (b: BalancetePeriod) => {
    showToast('Balancete Consolidado', `Exportando demonstrativo contábil de ${b.periodLabel}...`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Balancetes Mensais</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Fechamento de competências contábeis, bloqueio de edições e parecer de auditoria condominial.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {balancetes.map((b) => (
          <div
            key={b.id}
            className={`bg-white rounded-xl border p-5 shadow-2xs space-y-4 flex flex-col justify-between ${
              b.status === 'Fechado' ? 'border-slate-200' : 'border-purple-300 ring-1 ring-purple-100'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">
                    Competência
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{b.periodLabel}</h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded font-semibold border ${
                    b.status === 'Fechado'
                      ? 'bg-slate-100 text-slate-700 border-slate-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {b.status === 'Fechado' ? <Lock className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span>{b.status}</span>
                </span>
              </div>

              {/* Numbers */}
              <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Saldo Anterior:</span>
                  <span className="font-mono text-slate-800 tabular-nums">
                    {formatCurrency(b.previousBalance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">(+) Receitas:</span>
                  <span className="font-mono text-emerald-700 font-semibold tabular-nums">
                    {formatCurrency(b.totalRevenues)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">(-) Despesas:</span>
                  <span className="font-mono text-rose-700 font-semibold tabular-nums">
                    {formatCurrency(b.totalExpenses)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm">
                  <span className="text-slate-900">(=) Saldo Final:</span>
                  <span className="font-mono text-purple-950 tabular-nums">
                    {formatCurrency(b.finalBalance)}
                  </span>
                </div>
              </div>

              {b.closedAt && (
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Fechado e Auditado</span>
                  </div>
                  <div className="mt-0.5 truncate">{b.closedBy}</div>
                  <div className="text-[10px] text-slate-400">{formatDateTime(b.closedAt)}</div>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleExportPDF(b)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar</span>
              </button>

              {b.status === 'Em aberto' && canManage && (
                <button
                  onClick={() => setBalanceteToClose(b)}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Fechar Balancete</span>
                </button>
              )}

              {b.status === 'Fechado' && isAdmin && (
                <button
                  onClick={() => handleReopen(b)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reabrir balancete (Exclusivo Administradora)"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Reabrir</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rules Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
        <strong className="text-slate-800 block">Regras de Governança Contábil:</strong>
        <p>1. O fechamento de balancete consolida a arrecadação e bloqueia qualquer edição retrospectiva nas despesas daquele mês.</p>
        <p>2. Apenas a Administradora possui credencial de nível de segurança para reabertura de competência encerrada.</p>
        <p>3. Todas as movimentações geram registro imutável no Log de Auditoria.</p>
      </div>

      {balanceteToClose && (
        <CloseBalanceteModal
          isOpen={!!balanceteToClose}
          onClose={() => setBalanceteToClose(null)}
          balancete={balanceteToClose}
        />
      )}
    </div>
  );
};
