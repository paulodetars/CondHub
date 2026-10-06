import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatCard } from '../components/ui/StatCard';
import { BarChartMonthly, CategoryDonut } from '../components/ui/MiniCharts';
import { ExpenseModal } from '../components/modals/ExpenseModal';
import { CloseBalanceteModal } from '../components/modals/CloseBalanceteModal';
import {
  Wallet,
  Receipt,
  AlertOctagon,
  Wrench,
  Vote,
  CalendarDays,
  FileSpreadsheet,
  Plus,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Building2,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { role, currentUser } = useAuth();
  const {
    condominium,
    currentBalance,
    totalExpensesCurrentMonth,
    totalRevenuesCurrentMonth,
    delinquentTotalAmount,
    delinquencyRate,
    delinquentUnitsCount,
    expenses,
    revenues,
    balancetes,
    maintenanceRequests,
    decisions,
    reservations,
  } = useCondo();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [closeBalanceteTarget, setCloseBalanceteTarget] = useState<(typeof balancetes)[0] | null>(null);

  const openBalancete = balancetes.find((b) => b.status === 'Em aberto');
  const pendingMaintenance = maintenanceRequests.filter((m) => m.status !== 'Resolvido' && m.status !== 'Cancelado');
  const activePoll = decisions.find((d) => d.status === 'Aberta');

  // Chart data
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

  const categoryTotals: Record<string, number> = {};
  expenses
    .filter((e) => e.monthPeriod === '2026-10')
    .forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

  const categoryColors: Record<string, string> = {
    Elevadores: '#9333ea',
    Energia: '#eab308',
    Água: '#0284c7',
    Segurança: '#6366f1',
    Limpeza: '#10b981',
    Manutenção: '#f97316',
    Administração: '#64748b',
  };

  const donutItems = Object.entries(categoryTotals).map(([cat, amt]) => ({
    category: cat,
    amount: amt,
    color: categoryColors[cat] || '#a855f7',
  }));

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Actions */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>
              {condominium.name} · Painel Executivo ({role === 'admin' ? 'Administradora' : 'Síndico'})
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestão & Governança Integrada
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Controle financeiro automatizado, prestação de contas mensal e indicadores em tempo real.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Despesa</span>
          </button>

          {openBalancete && (
            <button
              onClick={() => setCloseBalanceteTarget(openBalancete)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-500/30 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Fechar Balancete</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('relatorios')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors border border-slate-700"
          >
            <span>Relatórios</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Saldo em Caixa & CDI"
          value={formatCurrency(currentBalance)}
          subValue="Fundo de Reserva + Ordinário"
          icon={Wallet}
          iconColor="text-emerald-600"
          badge="Auditado"
          badgeVariant="success"
          onClick={() => onNavigate('transparencia')}
        />

        <StatCard
          label="Receitas (Outubro)"
          value={formatCurrency(totalRevenuesCurrentMonth)}
          subValue="112 cotas + reservas pagas"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          badge="93.3% arrecadado"
          badgeVariant="purple"
          onClick={() => onNavigate('receitas')}
        />

        <StatCard
          label="Despesas (Outubro)"
          value={formatCurrency(totalExpensesCurrentMonth)}
          subValue="10 lançamentos contábeis"
          icon={Receipt}
          iconColor="text-purple-600"
          onClick={() => onNavigate('despesas')}
        />

        <StatCard
          label="Inadimplência Geral"
          value={`${delinquencyRate.toFixed(1)}%`}
          subValue={`${delinquentUnitsCount} unidades (${formatCurrency(delinquentTotalAmount)})`}
          icon={AlertOctagon}
          iconColor="text-rose-600"
          badge={delinquencyRate <= 5 ? 'Controlada' : 'Atenção'}
          badgeVariant={delinquencyRate <= 5 ? 'success' : 'danger'}
          onClick={() => onNavigate('inadimplencia')}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <BarChartMonthly data={monthlyData} />
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4">
            Composição das Despesas (Outubro/2026)
          </h3>
          <CategoryDonut items={donutItems} />
        </div>
      </div>

      {/* Operational & Governance Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Balancetes Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Contabilidade & Balancete
              </span>
              <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Mês em Aberto:</span>
                <strong className="text-slate-900">Outubro / 2026</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Último Mês Fechado:</span>
                <span className="font-semibold text-emerald-700">Setembro / 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status do Conselho:</span>
                <span className="text-slate-700 font-medium">Parecer favorável</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('balancetes')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1"
          >
            <span>Ver Balancetes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Manutenção Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Manutenção Predial
              </span>
              <Wrench className="w-4 h-4 text-purple-600" />
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Chamados Abertos:</span>
                <strong className="text-slate-900">{pendingMaintenance.length} ocorrências</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Elevadores:</span>
                <span className="text-emerald-700 font-medium">Revisão em dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Extintores e AVCB:</span>
                <span className="text-emerald-700 font-medium">Válido até 2027</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('manutencao')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1"
          >
            <span>Gerenciar Chamados</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Votações Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Governança & Decisões
              </span>
              <Vote className="w-4 h-4 text-purple-600" />
            </div>

            {activePoll ? (
              <div className="mt-3 text-xs space-y-1.5">
                <span className="font-semibold text-slate-900 block truncate">{activePoll.title}</span>
                <span className="text-slate-500 block">
                  Prazo: {formatDate(activePoll.endDate)}
                </span>
                <span className="text-purple-700 font-semibold block">
                  {activePoll.totalVotes} votos registrados ({((activePoll.totalVotes / activePoll.eligibleVoters) * 100).toFixed(0)}%)
                </span>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">Nenhuma deliberação ativa.</p>
            )}
          </div>

          <button
            onClick={() => onNavigate('decisoes')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1"
          >
            <span>Ver Central de Votos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />

      {closeBalanceteTarget && (
        <CloseBalanceteModal
          isOpen={!!closeBalanceteTarget}
          onClose={() => setCloseBalanceteTarget(null)}
          balancete={closeBalanceteTarget}
        />
      )}
    </div>
  );
};
