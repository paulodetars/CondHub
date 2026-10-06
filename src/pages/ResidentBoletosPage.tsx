import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { Invoice } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BoletoModal } from '../components/modals/BoletoModal';
import { PixPaymentModal } from '../components/modals/PixPaymentModal';
import { useToast } from '../components/ui/Toast';
import { Receipt, Copy, Download, Zap, Eye, Check } from 'lucide-react';

export const ResidentBoletosPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { invoices } = useCondo();
  const { showToast } = useToast();

  const [activeBoleto, setActiveBoleto] = useState<Invoice | null>(null);
  const [activePix, setActivePix] = useState<Invoice | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const userInvoices = invoices.filter(
    (inv) => inv.unit === currentUser?.unit || inv.residentEmail === currentUser?.email
  );

  const handleCopyBarcode = (barcode: string, id: string) => {
    navigator.clipboard.writeText(barcode);
    setCopiedId(id);
    showToast('Código de barras copiado!', 'Pronto para colar no aplicativo bancário.', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Meus Boletos</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Consulte as faturas emitidas pelo Banco Santander para sua unidade condominial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userInvoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">
                  {inv.monthReference}
                </span>
                <span className="text-xl font-bold text-slate-900 tabular-nums block mt-1">
                  {formatCurrency(inv.amount)}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  Vencimento: <strong>{formatDate(inv.dueDate)}</strong>
                </span>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded font-semibold ${
                  inv.status === 'Pago'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {inv.status}
              </span>
            </div>

            {/* Barcode box */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Linha Digitável</span>
              <div className="font-mono text-slate-700 truncate mt-0.5 text-[11px] select-all">
                {inv.barcode}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <button
                onClick={() => handleCopyBarcode(inv.barcode, inv.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId === inv.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === inv.id ? 'Copiado' : 'Copiar Código'}</span>
              </button>

              <button
                onClick={() => setActiveBoleto(inv)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visualizar</span>
              </button>

              {inv.status !== 'Pago' && (
                <button
                  onClick={() => setActivePix(inv)}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 ml-auto transition-colors shadow-2xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>PIX</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeBoleto && (
        <BoletoModal
          isOpen={!!activeBoleto}
          onClose={() => setActiveBoleto(null)}
          invoice={activeBoleto}
          onOpenPix={() => {
            setActivePix(activeBoleto);
            setActiveBoleto(null);
          }}
        />
      )}

      {activePix && (
        <PixPaymentModal
          isOpen={!!activePix}
          onClose={() => setActivePix(null)}
          invoice={activePix}
        />
      )}
    </div>
  );
};
