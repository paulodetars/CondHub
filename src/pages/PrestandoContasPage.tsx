import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../components/ui/Toast';
import {
  FileCheck,
  Printer,
  Download,
  Building2,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const PrestandoContasPage: React.FC = () => {
  const { condominium, balancetes, expenses, revenues, documents, delinquentTotalAmount, delinquencyRate } = useCondo();
  const { showToast } = useToast();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-09');

  const activeBalancete =
    balancetes.find((b) => b.period === selectedPeriod) || balancetes[0];

  const periodExpenses = expenses.filter((e) => e.monthPeriod === selectedPeriod);
  const periodRevenues = revenues.filter((r) => r.monthPeriod === selectedPeriod);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    showToast(
      'Exportando Relatório',
      `Gerando arquivo Prestacao_Contas_${activeBalancete.periodLabel.replace(/\s+/g, '_')}.pdf...`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Prestação de Contas Oficial</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Relatório gerencial consolidado para apresentação em assembleias ordinárias e conselho fiscal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white font-medium"
          >
            {balancetes.map((b) => (
              <option key={b.period} value={b.period}>
                {b.periodLabel} ({b.status})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportPDF}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:flex px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Formal Paper Report Simulation */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-10 shadow-sm space-y-8 font-sans text-slate-800">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              JA
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                {condominium.name}
              </h1>
              <p className="text-xs text-slate-500">
                CNPJ: {condominium.cnpj} · {condominium.address} — {condominium.city}/{condominium.state}
              </p>
              <p className="text-[11px] text-purple-700 font-medium mt-0.5">
                Administradora: {condominium.adminCompany} · Síndico: {condominium.sindicoName}
              </p>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <span className="text-xs font-bold uppercase text-slate-400 block tracking-wider">
              Demonstrativo Financeiro
            </span>
            <span className="text-base font-extrabold text-purple-950 block">
              {activeBalancete.periodLabel}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Parecer Fiscal Favorável
            </span>
          </div>
        </div>

        {/* 1. Resumo Contábil */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
            1. Resumo das Movimentações Financeiras
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block uppercase">Saldo Inicial</span>
              <strong className="text-sm text-slate-900 font-mono block mt-1 tabular-nums">
                {formatCurrency(activeBalancete.previousBalance)}
              </strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block uppercase">(+) Total Receitas</span>
              <strong className="text-sm text-emerald-700 font-mono block mt-1 tabular-nums">
                {formatCurrency(activeBalancete.totalRevenues)}
              </strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block uppercase">(-) Total Despesas</span>
              <strong className="text-sm text-rose-700 font-mono block mt-1 tabular-nums">
                {formatCurrency(activeBalancete.totalExpenses)}
              </strong>
            </div>

            <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200">
              <span className="text-[11px] text-purple-700 block uppercase font-semibold">(=) Saldo Final</span>
              <strong className="text-sm text-purple-950 font-mono block mt-1 tabular-nums">
                {formatCurrency(activeBalancete.finalBalance)}
              </strong>
            </div>
          </div>
        </div>

        {/* 2. Inadimplência e Índices */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
            2. Indicadores de Arrecadação e Inadimplência
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Total de Unidades:</span>
              <strong className="text-slate-900 text-sm">{condominium.totalUnits} apartamentos</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Taxa de Inadimplência Geral:</span>
              <strong className="text-slate-900 text-sm tabular-nums font-mono">
                {delinquencyRate.toFixed(1)}% ({delinquencyRate <= 5 ? 'Dentro da meta orçamentária' : 'Atenção'})
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Montante em Cobrança Ativa:</span>
              <strong className="text-rose-700 text-sm tabular-nums font-mono">
                {formatCurrency(delinquentTotalAmount)}
              </strong>
            </div>
          </div>
        </div>

        {/* 3. Maiores Despesas do Período */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
            3. Principais Lançamentos Contábeis do Mês
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-[11px] uppercase font-semibold border-b border-slate-200">
                  <th className="p-3">Data</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Descrição da Despesa</th>
                  <th className="p-3">Fornecedor</th>
                  <th className="p-3 text-right">Valor Liquidado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periodExpenses.slice(0, 6).map((exp) => (
                  <tr key={exp.id}>
                    <td className="p-3 tabular-nums text-slate-600">{formatDate(exp.date)}</td>
                    <td className="p-3 font-semibold text-purple-700">{exp.category}</td>
                    <td className="p-3 text-slate-900">{exp.description}</td>
                    <td className="p-3 text-slate-600">{exp.supplier}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Parecer do Conselho Fiscal */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Parecer Oficial do Conselho Consultivo e Fiscal</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            "Examinamos os livros contábeis, extratos bancários Santander, certidões negativas de débito
            trabalhistas dos prestadores e notas fiscais correspondentes à competência de{' '}
            <strong>{activeBalancete.periodLabel}</strong>. Verificou-se que todas as receitas foram
            regularmente creditadas e as despesas efetuadas com a devida documentação comprobatória,
            estando as contas em conformidade com a Convenção Condominial e recomendadas para aprovação."
          </p>

          <div className="pt-4 grid grid-cols-3 gap-6 text-center text-[11px] text-slate-500 border-t border-slate-200">
            <div>
              <div className="border-b border-slate-300 pb-1 font-semibold text-slate-800">
                Roberto Albuquerque
              </div>
              <span className="mt-1 block">Síndico Geral</span>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-1 font-semibold text-slate-800">
                Dra. Helena Castro
              </div>
              <span className="mt-1 block">Aurora Gestão Patrimonial</span>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-1 font-semibold text-slate-800">
                Membros do Conselho
              </div>
              <span className="mt-1 block">Conselho Fiscal Eleito</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
