import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';
import {
  AlertOctagon,
  TrendingDown,
  DollarSign,
  Users,
  Search,
  Mail,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const DelinquencyPage: React.FC = () => {
  const { condominium, invoices, delinquentTotalAmount, delinquencyRate, delinquentUnitsCount } = useCondo();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');

  // Overdue or negotiation invoices
  const delinquentInvoices = invoices.filter(
    (inv) => inv.status === 'Atrasado' || inv.status === 'Em negociação'
  );

  const filtered = delinquentInvoices.filter((i) =>
    search ? i.residentName.toLowerCase().includes(search.toLowerCase()) || i.unit.includes(search) : true
  );

  const handleSendReminder = (inv: (typeof delinquentInvoices)[0]) => {
    showToast(
      'Notificação Enviada',
      `Lembrete de cobrança e segunda via enviados para ${inv.residentEmail}.`,
      'info'
    );
  };

  const handleProposeAgreement = (inv: (typeof delinquentInvoices)[0]) => {
    showToast(
      'Proposta Gerada',
      `Minuta de parcelamento em 3x sem juros aberta para a unidade ${inv.unit}.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Gestão de Inadimplência</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitoramento de cotas em atraso, acordos extrajudiciais e recuperação de crédito.
        </p>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total em Atraso
          </span>
          <div className="text-2xl font-bold text-rose-600 mt-1 tabular-nums">
            {formatCurrency(delinquentTotalAmount)}
          </div>
          <span className="text-xs text-slate-500 mt-1">Soma de principal, multa e juros</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Taxa de Inadimplência
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums font-mono">
            {delinquencyRate.toFixed(1)}%
          </div>
          <span className="text-xs text-slate-500 mt-1">Média do mercado em Curitiba: 5.8%</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Unidades Inadimplentes
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {delinquentUnitsCount} de {condominium.totalUnits}
          </div>
          <span className="text-xs text-slate-500 mt-1">
            {((delinquentUnitsCount / condominium.totalUnits) * 100).toFixed(1)}% do condomínio
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Valor Recuperado no Ano
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            R$ 14.820,00
          </div>
          <span className="text-xs text-slate-500 mt-1 flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" /> 6 acordos quitados
          </span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por morador ou unidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600"
            />
          </div>
          <span className="text-xs text-slate-500">{filtered.length} pendências encontradas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-6">Unidade</th>
                <th className="py-3 px-6">Morador / Responsável</th>
                <th className="py-3 px-6">Referência</th>
                <th className="py-3 px-6">Dias em Atraso</th>
                <th className="py-3 px-6">Valor Total</th>
                <th className="py-3 px-6">Situação</th>
                <th className="py-3 px-6 text-right">Ações de Cobrança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    Apto {item.unit} ({item.block})
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-slate-800 block">{item.residentName}</span>
                    <span className="text-[11px] text-slate-400">{item.residentEmail}</span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{item.monthReference}</td>
                  <td className="py-3.5 px-6 font-mono text-rose-700 font-medium">
                    {item.status === 'Atrasado' ? '26 dias' : 'Em parcelamento'}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-rose-700 tabular-nums">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        item.status === 'Atrasado'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSendReminder(item)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors text-[11px]"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Notificar</span>
                      </button>
                      <button
                        onClick={() => handleProposeAgreement(item)}
                        className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors text-[11px]"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Acordo</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
