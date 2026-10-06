import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { BalancetePeriod } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCondo } from '../../context/CondoContext';
import { useToast } from '../ui/Toast';
import { AlertTriangle, Lock, ShieldCheck } from 'lucide-react';

interface CloseBalanceteModalProps {
  isOpen: boolean;
  onClose: () => void;
  balancete: BalancetePeriod;
}

export const CloseBalanceteModal: React.FC<CloseBalanceteModalProps> = ({
  isOpen,
  onClose,
  balancete,
}) => {
  const { closeBalancete } = useCondo();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmClose = () => {
    setIsSubmitting(true);
    const res = closeBalancete(balancete.id);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Balancete Fechado!', res.message, 'success');
      onClose();
    } else {
      showToast('Erro ao fechar balancete', res.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Fechar Balancete — ${balancete.periodLabel}`}
      subtitle="Bloqueio contábil e auditoria oficial do período"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Warning card */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block font-semibold mb-1">Atenção ao fechamento:</strong>
            Tem certeza que deseja fechar este balancete? Após o fechamento, todas as despesas e
            receitas do período ficarão <strong>bloqueadas contra alterações ou exclusões</strong>.
            Apenas a Administradora poderá reabri-lo.
          </div>
        </div>

        {/* Financial period numbers preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Saldo Anterior:</span>
            <span className="font-mono text-slate-800 tabular-nums">
              {formatCurrency(balancete.previousBalance)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">(+) Receitas do Período:</span>
            <span className="font-mono text-emerald-700 font-semibold tabular-nums">
              {formatCurrency(balancete.totalRevenues)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">(-) Despesas do Período:</span>
            <span className="font-mono text-rose-700 font-semibold tabular-nums">
              {formatCurrency(balancete.totalExpenses)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
            <span className="text-slate-900">(=) Saldo Final do Balancete:</span>
            <span className="font-mono text-purple-950 tabular-nums">
              {formatCurrency(balancete.finalBalance)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmClose}
            disabled={isSubmitting}
            className="px-5 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Fechando e Auditando...' : 'Confirmar Fechamento'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
