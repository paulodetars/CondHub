import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { Invoice, PaymentStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PixPaymentModal } from '../components/modals/PixPaymentModal';
import { BoletoModal } from '../components/modals/BoletoModal';
import {
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Zap,
  Filter,
  Download,
} from 'lucide-react';

export const ResidentFinancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { invoices } = useCondo();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoiceForPix, setSelectedInvoiceForPix] = useState<Invoice | null>(null);
  const [selectedInvoiceForBoleto, setSelectedInvoiceForBoleto] = useState<Invoice | null>(null);

  // Filter invoices for current user or demo resident
  const userInvoices = invoices.filter(
    (inv) => inv.unit === currentUser?.unit || inv.residentEmail === currentUser?.email
  );

  const filteredInvoices = userInvoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    return true;
  });

  const totalPaid = userInvoices
    .filter((i) => i.status === 'Pago')
    .reduce((acc, i) => acc + (i.paidAmount || i.amount), 0);

  const pendingCount = userInvoices.filter((i) => i.status === 'Em aberto').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Situação Cadastral
          </span>
          <div className="mt-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-lg font-bold text-slate-900">
              {pendingCount === 0 ? 'Adimplente / Em dia' : `${pendingCount} Cota em Aberto`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Unidade {currentUser?.unit} ({currentUser?.block})</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Pago em 2026
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatCurrency(totalPaid)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Cotas e fundos liquidados</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Cota Média Mensal
          </span>
          <div className="text-2xl font-bold text-purple-900 mt-1 tabular-nums">
            R$ 684,32
          </div>
          <p className="text-xs text-slate-500 mt-1">Fração ideal ordinária + reservas</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filtrar por Status:</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'Pago', label: 'Pagos' },
            { id: 'Em aberto', label: 'Em aberto' },
            { id: 'Atrasado', label: 'Atrasados' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Histórico de Cotas e Cobranças</h3>
          <span className="text-xs text-slate-400">{filteredInvoices.length} faturas encontradas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-6">Referência</th>
                <th className="py-3 px-6">Vencimento</th>
                <th className="py-3 px-6">Valor</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Pagamento</th>
                <th className="py-3 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{inv.monthReference}</td>
                  <td className="py-3.5 px-6 text-slate-600 tabular-nums">{formatDate(inv.dueDate)}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900 tabular-nums">
                    {formatCurrency(inv.amount)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        inv.status === 'Pago'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inv.status === 'Em aberto'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {inv.status === 'Pago' && <CheckCircle2 className="w-3 h-3" />}
                      {inv.status === 'Em aberto' && <Clock className="w-3 h-3" />}
                      {inv.status === 'Atrasado' && <AlertCircle className="w-3 h-3" />}
                      <span>{inv.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">
                    {inv.status === 'Pago' ? (
                      <span className="text-slate-700 font-medium">
                        {inv.paymentMethod} ({formatDate(inv.paidDate)})
                      </span>
                    ) : (
                      <span className="text-slate-400">Aguardando</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status !== 'Pago' ? (
                        <>
                          <button
                            onClick={() => setSelectedInvoiceForPix(inv)}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Zap className="w-3 h-3" />
                            <span>PIX</span>
                          </button>
                          <button
                            onClick={() => setSelectedInvoiceForBoleto(inv)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Boleto</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedInvoiceForBoleto(inv)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Comprovante</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedInvoiceForPix && (
        <PixPaymentModal
          isOpen={!!selectedInvoiceForPix}
          onClose={() => setSelectedInvoiceForPix(null)}
          invoice={selectedInvoiceForPix}
        />
      )}

      {selectedInvoiceForBoleto && (
        <BoletoModal
          isOpen={!!selectedInvoiceForBoleto}
          onClose={() => setSelectedInvoiceForBoleto(null)}
          invoice={selectedInvoiceForBoleto}
          onOpenPix={() => {
            setSelectedInvoiceForPix(selectedInvoiceForBoleto);
            setSelectedInvoiceForBoleto(null);
          }}
        />
      )}
    </div>
  );
};
