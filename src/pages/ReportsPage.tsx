import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';
import {
  FileSpreadsheet,
  Download,
  Filter,
  BarChart3,
  Building2,
  Users,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { expenses, revenues, suppliers, maintenanceRequests, delinquentTotalAmount } = useCondo();
  const { showToast } = useToast();

  const [reportType, setReportType] = useState('financeiro');
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  const handleExport = () => {
    showToast('Relatório Gerado', `Exportando demonstrativo de ${reportType} (${selectedMonth})...`, 'success');
  };

  const currentExpenses = expenses.filter((e) =>
    selectedMonth === 'all' ? true : e.monthPeriod === selectedMonth
  );

  const currentRevenues = revenues.filter((r) =>
    selectedMonth === 'all' ? true : r.monthPeriod === selectedMonth
  );

  const totalExp = currentExpenses.reduce((a, b) => a + b.amount, 0);
  const totalRev = currentRevenues.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Relatórios Gerenciais</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Exportação de dados contábeis, planilhas orçamentárias e indicadores operacionais.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório (CSV / Excel)</span>
        </button>
      </div>

      {/* Filter and Type Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {[
              { id: 'financeiro', label: 'Fluxo Financeiro' },
              { id: 'despesas', label: 'Despesas por Centro de Custo' },
              { id: 'fornecedores', label: 'Contratos de Fornecedores' },
              { id: 'manutencao', label: 'Histórico de Manutenções' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setReportType(t.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 ${
                  reportType === t.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Competência:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-1.5 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:border-purple-600"
            >
              <option value="2026-10">Outubro / 2026</option>
              <option value="2026-09">Setembro / 2026</option>
              <option value="2026-08">Agosto / 2026</option>
              <option value="all">Todo o Exercício</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Render depending on type */}
      {reportType === 'financeiro' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Demonstrativo de Receitas e Despesas</h3>
              <p className="text-xs text-slate-500 mt-0.5">Competência: {selectedMonth}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Resultado do Período</span>
              <span className="text-base font-bold text-emerald-700 tabular-nums">
                {formatCurrency(totalRev - totalExp)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
              <span className="text-emerald-800 font-semibold block uppercase">Total de Entradas</span>
              <span className="text-xl font-bold text-emerald-950 tabular-nums">{formatCurrency(totalRev)}</span>
              <span className="text-slate-500 text-[11px] block">{currentRevenues.length} registros</span>
            </div>

            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
              <span className="text-purple-800 font-semibold block uppercase">Total de Saídas</span>
              <span className="text-xl font-bold text-purple-950 tabular-nums">{formatCurrency(totalExp)}</span>
              <span className="text-slate-500 text-[11px] block">{currentExpenses.length} lançamentos</span>
            </div>
          </div>
        </div>
      )}

      {reportType === 'despesas' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Detalhamento Analítico de Despesas</h3>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-semibold">
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6">Categoria</th>
                <th className="py-3 px-6">Descrição</th>
                <th className="py-3 px-6">Fornecedor</th>
                <th className="py-3 px-6 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td className="py-3 px-6 tabular-nums">{formatDate(exp.date)}</td>
                  <td className="py-3 px-6 font-semibold text-purple-700">{exp.category}</td>
                  <td className="py-3 px-6 text-slate-900">{exp.description}</td>
                  <td className="py-3 px-6 text-slate-600">{exp.supplier}</td>
                  <td className="py-3 px-6 text-right font-bold tabular-nums text-slate-900">
                    {formatCurrency(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportType === 'fornecedores' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Contratos Corporativos e Volume Pago</h3>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-semibold">
                <th className="py-3 px-6">Razão Social</th>
                <th className="py-3 px-6">CNPJ</th>
                <th className="py-3 px-6">Categoria</th>
                <th className="py-3 px-6">Contato</th>
                <th className="py-3 px-6 text-right">Total Acumulado Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 px-6 font-semibold text-slate-900">{s.name}</td>
                  <td className="py-3 px-6 font-mono text-slate-500">{s.cnpj}</td>
                  <td className="py-3 px-6">{s.category}</td>
                  <td className="py-3 px-6 text-slate-600">{s.contactPerson} ({s.phone})</td>
                  <td className="py-3 px-6 text-right font-bold tabular-nums text-slate-900">
                    {formatCurrency(s.totalPaid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportType === 'manutencao' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Histórico de Ordens de Serviço e Manutenções</h3>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-semibold">
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6">Ocorrência</th>
                <th className="py-3 px-6">Local</th>
                <th className="py-3 px-6">Prioridade</th>
                <th className="py-3 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {maintenanceRequests.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 px-6 tabular-nums">{formatDate(m.dateReported)}</td>
                  <td className="py-3 px-6 font-semibold text-slate-900">{m.title}</td>
                  <td className="py-3 px-6 text-slate-600">{m.location}</td>
                  <td className="py-3 px-6 font-medium">{m.priority}</td>
                  <td className="py-3 px-6 text-right font-semibold text-purple-700">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
