import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Invoice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCondo } from '../../context/CondoContext';
import { useToast } from '../ui/Toast';
import { Copy, Check, QrCode, ShieldCheck, Zap } from 'lucide-react';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({ isOpen, onClose, invoice }) => {
  const { payInvoice, condominium } = useCondo();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invoice.pixCopyPaste);
    setCopied(true);
    showToast('Código PIX copiado!', 'Cole no aplicativo do seu banco para pagar.', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = payInvoice(invoice.id, 'PIX');
      setIsProcessing(false);
      if (res.success) {
        setIsSuccess(true);
        showToast('Pagamento confirmado!', res.message, 'success');
      } else {
        showToast('Erro', res.message, 'error');
      }
    }, 700);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSuccess ? handleDone : onClose}
      title={isSuccess ? 'Comprovante de Pagamento PIX' : 'Pagamento via PIX Instantâneo'}
      subtitle={
        isSuccess
          ? 'Operação autenticada e liquidada com sucesso'
          : `Referência: ${invoice.monthReference} — Unidade ${invoice.unit} (${invoice.block})`
      }
      maxWidth="md"
    >
      {!isSuccess ? (
        <div className="space-y-5">
          {/* Amount banner */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-purple-700 font-medium uppercase tracking-wider block">
                Valor Total a Pagar
              </span>
              <span className="text-2xl font-bold text-purple-950 tabular-nums">
                {formatCurrency(invoice.amount)}
              </span>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Vencimento: <span className="font-semibold text-slate-800">{formatDate(invoice.dueDate)}</span></div>
              <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 justify-end mt-0.5">
                <Zap className="w-3 h-3" /> Compensação Imediata
              </div>
            </div>
          </div>

          {/* QR Code Graphic */}
          <div className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-xl">
            <div className="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-xs relative">
              {/* SVG QR Code Simulation */}
              <svg width="170" height="170" viewBox="0 0 100 100" className="w-40 h-40">
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

                {/* Random styled matrix pattern points */}
                <rect x="38" y="8" width="5" height="5" fill="#1e1b4b" />
                <rect x="46" y="8" width="5" height="5" fill="#1e1b4b" />
                <rect x="54" y="8" width="5" height="5" fill="#1e1b4b" />
                <rect x="38" y="18" width="5" height="15" fill="#1e1b4b" />
                <rect x="48" y="24" width="8" height="8" fill="#7e22ce" />
                <rect x="8" y="38" width="12" height="6" fill="#1e1b4b" />
                <rect x="24" y="38" width="6" height="12" fill="#1e1b4b" />
                <rect x="36" y="38" width="26" height="24" fill="#1e1b4b" rx="2" />
                <rect x="42" y="44" width="14" height="12" fill="#ffffff" />
                <circle cx="49" cy="50" r="4" fill="#7e22ce" />
                <rect x="68" y="38" width="8" height="12" fill="#1e1b4b" />
                <rect x="80" y="38" width="14" height="6" fill="#1e1b4b" />
                <rect x="38" y="68" width="8" height="16" fill="#1e1b4b" />
                <rect x="50" y="76" width="14" height="12" fill="#1e1b4b" />
                <rect x="68" y="68" width="24" height="6" fill="#1e1b4b" />
                <rect x="76" y="78" width="16" height="14" fill="#1e1b4b" />
              </svg>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Abra o app do seu banco, escolha <strong>Pagar via PIX</strong> e aponte a câmera.
            </p>
          </div>

          {/* Copia e Cola */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              PIX Copia e Cola
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={invoice.pixCopyPaste}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono p-2.5 rounded-lg select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Beneficiary details */}
          <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3 flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Beneficiário:</span>
              <strong className="text-slate-700">{condominium.name}</strong>
            </div>
            <div className="flex justify-between">
              <span>CNPJ:</span>
              <span className="font-mono text-slate-700">{condominium.cnpj}</span>
            </div>
            <div className="flex justify-between">
              <span>Instituição:</span>
              <span className="text-slate-700">{condominium.bankAccount.bank}</span>
            </div>
          </div>

          {/* Action Button: Simulate Payment */}
          <div className="pt-2">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando Liquidação PIX...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Simular Pagamento Imediato</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Ambiente de demonstração com liquidação em tempo real e atualização cadastral.
            </p>
          </div>
        </div>
      ) : (
        /* Success Receipt View */
        <div className="space-y-5 text-left">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Pagamento Liquidado com Sucesso!</h4>
              <p className="text-xs text-emerald-700">
                A baixa contábil foi processada instantaneamente no fluxo de caixa do condomínio.
              </p>
            </div>
          </div>

          {/* Receipt details */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Valor Pago:</span>
              <span className="font-bold text-slate-900 tabular-nums text-sm">
                {formatCurrency(invoice.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Forma de Pagamento:</span>
              <span className="font-medium text-slate-800">PIX Instantâneo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data e Hora:</span>
              <span className="font-medium text-slate-800">
                {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Unidade Pagadora:</span>
              <span className="font-medium text-slate-800">
                {invoice.unit} ({invoice.block}) — {invoice.residentName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiário:</span>
              <span className="font-medium text-slate-800">{condominium.name}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500">ID da Transação E2E:</span>
              <span className="font-mono text-[10px] text-slate-600">
                E00339924{Date.now()}89A
              </span>
            </div>
          </div>

          <button
            onClick={handleDone}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Concluir e Voltar ao Painel
          </button>
        </div>
      )}
    </Modal>
  );
};
