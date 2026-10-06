import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BarChartMonthly, CategoryDonut } from '../components/ui/MiniCharts';
import { ExpenseModal } from '../components/modals/ExpenseModal';
import { Expense, ExpenseCategory } from '../types';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Building2,
  FileText,
  Filter,
  Eye,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

export const TransparencyPage: React.FC = () => {
  const { expenses, revenues, currentBalance, suppliers } = useCondo();

  const [periodFilter, setPeriodFilter] = useState<string>('2026-10');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Filter expenses and revenues for the selected period
  const filteredExpenses = expenses.filter((e) =>
    periodFilter === 'all' ? true : e.monthPeriod === periodFilter
  );

  const filteredRevenues = revenues.filter((r) =>
    periodFilter === 'all' ? true : r.monthPeriod === periodFilter
  );

  const totalPeriodExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalPeriodRevenues = filteredRevenues.reduce((acc, r) => acc + r.amount, 0);
  const periodBalance = totalPeriodRevenues - totalPeriodExpenses;

  // Monthly data for BarChart
  const monthlyData = [
    {
      month: 'Agosto',
      receitas: revenues.filter((r) => r.monthPeriod === '2026-08').reduce((a, b) => a + b.amount, 0),
      despesas: expenses.filter((e) => e.monthPeriod === '2026-08').reduce((a, b) => a + b.amount, 0),
    },
    {
      month: 'Setembro',
      receitas: revenues.filter((r) => r.monthPeriod === '2026-09').reduce((a, b) => a + b.amount, 0),
      despesas: expenses.filter((e) => e.monthPeriod === '2026-09').reduce((a, b) => a + b.amount, 0),
    },
    {
      month: 'Outubro',
      receitas: revenues.filter((r) => r.monthPeriod === '2026-10').reduce((a, b) => a + b.amount, 0),
      despesas: expenses.filter((e) => e.monthPeriod === '2026-10').reduce((a, b) => a + b.amount, 0),
    },
  ];

  // Category breakdown for Donut
  const categoryColors: Record<ExpenseCategory, string> = {
    Água: '#0284c7',
    Energia: '#eab308',
    Manutenção: '#f97316',
    Limpeza: '#10b981',
    Segurança: '#6366f1',
    Elevadores: '#9333ea',
    Jardinagem: '#14b8a6',
    Funcionários: '#ec4899',
    Administração: '#64748b',
    Obras: '#8b5cf6',
    Outros: '#94a3b8',
  };

  const categoryTotals: Record<string, number> = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const donutItems = Object.entries(categoryTotals).map(([cat, amt]) => ({
    category: cat,
    amount: amt,
    color: categoryColors[cat as ExpenseCategory] || '#a855f7',
  }));

  return (
    <div className="space-y-6">
      {/* Page Title & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Transparência Financeira</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento em tempo real de cada centavo arrecadado e investido no Residencial Jardim Aurora.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[
            { id: '2026-10', label: 'Outubro / 2026' },
            { id: '2026-09', label: 'Setembro / 2026' },
            { id: '2026-08', label: 'Agosto / 2026' },
            { id: 'all', label: 'Todo o Período' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriodFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                periodFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Saldo em Caixa & Reservas
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatCurrency(currentBalance)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Fundo de Reserva CDI 100%
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Receitas do Período
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {formatCurrency(totalPeriodRevenues)}
          </div>
          <span className="text-xs text-slate-500 mt-1">Cotas e locações de áreas</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Despesas do Período
          </span>
          <div className="text-2xl font-bold text-purple-900 mt-1 tabular-nums">
            {formatCurrency(totalPeriodExpenses)}
          </div>
          <span className="text-xs text-slate-500 mt-1">Contratos e manutenções</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Superávit do Período
          </span>
          <div
            className={`text-2xl font-bold mt-1 tabular-nums ${
              periodBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatCurrency(periodBalance)}
          </div>
          <span className="text-xs text-slate-500 mt-1">
            {periodBalance >= 0 ? 'Saldo positivo no mês' : 'Déficit orçamentário'}
          </span>
        </div>
      </div>

      {/* Visual Charts: BarChart & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <BarChartMonthly data={monthlyData} />
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
            Despesas por Categoria ({periodFilter === 'all' ? 'Geral' : periodFilter})
          </h3>
          {donutItems.length > 0 ? (
            <CategoryDonut items={donutItems} />
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhuma despesa para exibir neste período.
            </div>
          )}
        </div>
      </div>

      {/* Top Suppliers Table (Section 16 requirement) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Principais Fornecedores Homologados</h3>
          </div>
          <span className="text-xs text-slate-400">Total auditado em contratos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-6">Empresa / Fornecedor</th>
                <th className="py-3 px-6">Categoria</th>
                <th className="py-3 px-6">CNPJ</th>
                <th className="py-3 px-6">Vigência de Contrato</th>
                <th className="py-3 px-6 text-right">Total Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.slice(0, 5).map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{sup.name}</td>
                  <td className="py-3.5 px-6 text-slate-600">{sup.category}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500">{sup.cnpj}</td>
                  <td className="py-3.5 px-6 text-slate-600">
                    {sup.contractUntil ? formatDate(sup.contractUntil) : 'Contrato Contínuo'}
                  </td>
                  <td className="py-3.5 px-6 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(sup.totalPaid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Expenses of Period with View Receipt Button */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Demonstrativo de Despesas do Período ({filteredExpenses.length} lançamentos)
          </h3>
          <span className="text-xs text-slate-400">Clique na linha para ver nota fiscal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6">Categoria</th>
                <th className="py-3 px-6">Descrição</th>
                <th className="py-3 px-6">Fornecedor</th>
                <th className="py-3 px-6">Valor</th>
                <th className="py-3 px-6">Documento</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  onClick={() => setSelectedExpense(exp)}
                  className="hover:bg-purple-50/30 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-6 tabular-nums text-slate-600">{formatDate(exp.date)}</td>
                  <td className="py-3 px-6">
                    <span className="font-medium text-purple-700">{exp.category}</span>
                  </td>
                  <td className="py-3 px-6 font-medium text-slate-900 max-w-xs truncate">
                    {exp.description}
                  </td>
                  <td className="py-3 px-6 text-slate-600">{exp.supplier}</td>
                  <td className="py-3 px-6 font-bold text-slate-900 tabular-nums">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3 px-6 font-mono text-[11px] text-slate-500">
                    {exp.fiscalNumber || 'NF-e Registrada'}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExpense(exp);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Detalhes</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedExpense && (
        <ExpenseModal
          isOpen={!!selectedExpense}
          onClose={() => setSelectedExpense(null)}
          expenseToView={selectedExpense}
        />
      )}
    </div>
  );
};
