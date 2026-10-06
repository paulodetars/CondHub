import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';
import {
  Zap,
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const ResidentPixPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { condominium, invoices, payInvoice } = useCondo();
  const { showToast } = useToast();

  const currentInvoice =
    invoices.find((i) => i.unit === currentUser?.unit && i.status === 'Em aberto') ||
    invoices.find((i) => i.unit === currentUser?.unit) ||
    invoices[0];

  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isPaid = currentInvoice?.status === 'Pago';

  const handleCopy = () => {
    if (!currentInvoice) return;
    navigator.clipboard.writeText(currentInvoice.pixCopyPaste);
    setCopied(true);
    showToast('Chave PIX copiada!', 'Cole no aplicativo do seu banco.', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePayment = () => {
    if (!currentInvoice) return;
    setIsProcessing(true);
    setTimeout(() => {
      const res = payInvoice(currentInvoice.id, 'PIX');
      setIsProcessing(false);
      if (res.success) {
        showToast('Pagamento confirmado via PIX!', res.message, 'success');
      } else {
        showToast('Erro', res.message, 'error');
      }
    }, 600);
  };

  if (!currentInvoice) {
    return <div className="p-6 text-slate-500">Nenhuma fatura encontrada.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Pagamento via PIX Instantâneo</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Liquidação automática 24 horas por dia sem taxas de emissão.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Status indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs text-purple-700 font-semibold uppercase tracking-wider block">
              {currentInvoice.monthReference}
            </span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatCurrency(currentInvoice.amount)}
            </span>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded font-semibold ${
              isPaid
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isPaid ? 'Pago com Sucesso' : 'Aguardando Pagamento'}
          </span>
        </div>

        {/* QR Code Graphic Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
          <div className="p-4 bg-white rounded-xl shadow-xs border-2 border-slate-900 relative">
            <svg width="180" height="180" viewBox="0 0 100 100" className="w-44 h-44">
              <rect width="100" height="100" fill="#ffffff" />
              {/* Corner markers */}
              <rect x="5" y="5" width="28" height="28" fill="#1e1b4b" rx="4" />
              <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
              <rect x="13" y="13" width="12" height="12" fill="#1e1b4b" rx="2" />

              <rect x="67" y="5" width="28" height="28" fill="#1e1b4b" rx="4" />
              <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
              <rect x="75" y="13" width="12" height="12" fill="#1e1b4b" rx="2" />

              <rect x="5" y="67" width="28" height="28" fill="#1e1b4b" rx="4" />
              <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
              <rect x="13" y="75" width="12" height="12" fill="#1e1b4b" rx="2" />

              {/* Data points */}
              <rect x="38" y="10" width="8" height="8" fill="#7e22ce" />
              <rect x="52" y="12" width="6" height="16" fill="#1e1b4b" />
              <rect x="38" y="38" width="24" height="24" fill="#1e1b4b" rx="2" />
              <rect x="42" y="42" width="16" height="16" fill="#ffffff" />
              <circle cx="50" cy="50" r="5" fill="#7e22ce" />
              <rect x="68" y="38" width="12" height="6" fill="#1e1b4b" />
              <rect x="68" y="52" width="16" height="14" fill="#1e1b4b" />
              <rect x="10" y="38" width="18" height="6" fill="#1e1b4b" />
              <rect x="14" y="50" width="12" height="12" fill="#1e1b4b" />
              <rect x="38" y="70" width="12" height="18" fill="#1e1b4b" />
              <rect x="56" y="72" width="18" height="16" fill="#1e1b4b" />
              <rect x="78" y="76" width="12" height="12" fill="#1e1b4b" />
            </svg>
          </div>
          <span className="text-xs text-slate-500 mt-3 text-center">
            Abra o app do seu banco, escolha <strong>Pagar com PIX QR Code</strong> e aponte para a tela.
          </span>
        </div>

        {/* PIX Copia e Cola */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Código PIX Copia e Cola
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentInvoice.pixCopyPaste}
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono p-2.5 rounded-lg select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Beneficiary summary */}
        <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 space-y-1">
          <div className="flex justify-between">
            <span>Beneficiário:</span>
            <strong className="text-slate-800">{condominium.name}</strong>
          </div>
          <div className="flex justify-between">
            <span>Chave PIX:</span>
            <span className="font-mono text-slate-800">{condominium.bankAccount.pixKey}</span>
          </div>
          <div className="flex justify-between">
            <span>Instituição:</span>
            <span className="text-slate-800">{condominium.bankAccount.bank}</span>
          </div>
        </div>

        {/* Simulate Payment Button (Section 15 requirement) */}
        {!isPaid ? (
          <div className="pt-2">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando Baixa no Sistema...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Simular Pagamento</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Clique para demonstrar a baixa bancária automática em tempo real.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <span className="text-sm font-bold text-emerald-950 block">Pagamento Confirmado!</span>
              <p className="text-xs text-emerald-800">
                Esta cota foi liquidada e registrada na prestação de contas do condomínio.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
