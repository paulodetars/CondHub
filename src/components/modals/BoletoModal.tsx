import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Invoice } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCondo } from '../../context/CondoContext';
import { useToast } from '../ui/Toast';
import { Copy, Check, Download, Zap, Printer } from 'lucide-react';

interface BoletoModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onOpenPix?: () => void;
}

export const BoletoModal: React.FC<BoletoModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onOpenPix,
}) => {
  const { condominium } = useCondo();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyBarcode = () => {
    navigator.clipboard.writeText(invoice.barcode);
    setCopied(true);
    showToast('Linha digitável copiada!', 'Código de barras copiado para a área de transferência.', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPDF = () => {
    showToast('Download do Boleto', `Baixando boleto_${invoice.monthReference.replace(/\s+/g, '_')}.pdf...`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Boleto Bancário Registrado"
      subtitle={`Referência: ${invoice.monthReference} — Vencimento: ${formatDate(invoice.dueDate)}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyBarcode}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Código Copiado' : 'Copiar Código de Barras'}</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
          </div>

          {onOpenPix && invoice.status !== 'Pago' && (
            <button
              onClick={() => {
                onClose();
                onOpenPix();
              }}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Pagar com PIX</span>
            </button>
          )}
        </div>

        {/* Realistic Bank Slip Box */}
        <div className="border border-slate-300 rounded-lg p-5 bg-white space-y-4 font-sans text-slate-800 shadow-2xs">
          {/* Bank Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white font-black text-sm px-2 py-0.5 rounded tracking-tighter">
                SANTANDER
              </div>
              <span className="font-bold text-lg text-slate-900 border-l border-r border-slate-400 px-3">
                033-7
              </span>
            </div>
            <div className="font-mono text-xs sm:text-sm font-semibold text-slate-800 tracking-tight select-all">
              {invoice.barcode}
            </div>
          </div>

          {/* Grid rows */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs border border-slate-200 rounded p-3 bg-slate-50/50">
            <div className="md:col-span-3">
              <span className="text-[10px] text-slate-500 uppercase block">Local de Pagamento</span>
              <strong className="text-slate-800">
                PAGÁVEL EM QUALQUER BANCO OU CANAL ELETRÔNICO ATÉ O VENCIMENTO
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Data de Vencimento</span>
              <strong className="text-sm text-purple-900 tabular-nums font-bold">
                {formatDate(invoice.dueDate)}
              </strong>
            </div>

            <div className="md:col-span-3">
              <span className="text-[10px] text-slate-500 uppercase block">Beneficiário</span>
              <strong className="text-slate-800">{condominium.name} — CNPJ {condominium.cnpj}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Agência / Código Beneficiário</span>
              <span className="font-mono text-slate-800">
                {condominium.bankAccount.agency} / {condominium.bankAccount.account}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Data do Documento</span>
              <span>01/10/2026</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Espécie Doc.</span>
              <span>RC</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Aceite</span>
              <span>N</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Valor do Documento</span>
              <strong className="text-sm text-slate-900 tabular-nums font-bold">
                {formatCurrency(invoice.amount)}
              </strong>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="border border-slate-200 rounded p-3 bg-white">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Demonstrativo de Composição da Cobrança
            </span>
            <div className="divide-y divide-slate-100 text-xs">
              {invoice.items.map((item, idx) => (
                <div key={idx} className="py-1 flex justify-between">
                  <span className="text-slate-600">{item.description}</span>
                  <span className="font-mono text-slate-800 tabular-nums">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
              <div className="pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Consolidado</span>
                <span className="font-mono">{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>

          {/* Payer Information */}
          <div className="text-xs border border-slate-200 rounded p-3 bg-slate-50/50">
            <span className="text-[10px] text-slate-500 uppercase block">Pagador</span>
            <div className="font-semibold text-slate-900">
              {invoice.residentName} — Unidade {invoice.unit} ({invoice.block})
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              {condominium.address} — {condominium.city}/{condominium.state} — CEP {condominium.zipCode}
            </div>
          </div>

          {/* Simulated barcode stripes */}
          <div className="pt-2 pb-1 flex flex-col items-center">
            <div className="w-full h-14 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 flex items-center justify-around px-2 rounded-xs opacity-90 overflow-hidden">
              {Array.from({ length: 65 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${
                    i % 3 === 0
                      ? 'w-1 bg-white'
                      : i % 2 === 0
                      ? 'w-0.5 bg-white'
                      : 'w-1.5 bg-transparent'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1">
              Autenticação Mecânica / Ficha de Compensação
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
