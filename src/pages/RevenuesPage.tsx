import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { Revenue, RevenueCategory } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { Plus, Search, Filter, Wallet, CheckCircle2, DollarSign } from 'lucide-react';

const REVENUE_CATEGORIES: RevenueCategory[] = [
  'Condomínio',
  'Multas',
  'Juros',
  'Aluguel',
  'Salão de Festas',
  'Outras Receitas',
];

export const RevenuesPage: React.FC = () => {
  const { role } = useAuth();
  const { revenues, addRevenue } = useCondo();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New revenue form
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RevenueCategory>('Condomínio');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [origin, setOrigin] = useState('Cobrança Santander');
  const [unit, setUnit] = useState('');

  const canManage = role === 'sindico' || role === 'admin';

  const filteredRevenues = revenues.filter((r) => {
    if (search && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    return true;
  });

  const totalAmount = filteredRevenues.reduce((acc, r) => acc + r.amount, 0);

  const handleCreateRevenue = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(',', '.'));
    if (isNaN(num) || num <= 0) {
      showToast('Valor inválido', 'Informe um valor maior que zero.', 'error');
      return;
    }

    const res = addRevenue({
      description,
      category,
      amount: num,
      date,
      origin,
      status: 'Confirmado',
      unit: unit ? unit : undefined,
    });

    if (res.success) {
      showToast('Receita lançada!', res.message, 'success');
      setDescription('');
      setAmount('');
      setUnit('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Receitas do Condomínio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arrecadação de cotas ordinárias, locações de áreas sociais, multas e rendimentos.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Lançar Receita</span>
          </button>
        )}
      </div>

      {/* Filter and Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Pesquisar por descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
          >
            <option value="all">Todas as Categorias</option>
            {REVENUE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>{filteredRevenues.length} receitas encontradas</span>
          <span className="font-semibold text-slate-800">
            Total Arrecadado: <span className="font-mono tabular-nums text-emerald-800 font-bold">{formatCurrency(totalAmount)}</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6">Categoria</th>
                <th className="py-3 px-6">Descrição</th>
                <th className="py-3 px-6">Origem</th>
                <th className="py-3 px-6">Valor</th>
                <th className="py-3 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRevenues.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 tabular-nums text-slate-600">{formatDate(rev.date)}</td>
                  <td className="py-3.5 px-6">
                    <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {rev.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900 max-w-sm truncate">
                    {rev.description}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{rev.origin}</td>
                  <td className="py-3.5 px-6 font-bold text-emerald-700 tabular-nums">
                    {formatCurrency(rev.amount)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{rev.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Revenue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lançar Receita no Caixa"
        subtitle="Registro de arrecadação extraordinária, multas ou aluguéis"
        maxWidth="md"
      >
        <form onSubmit={handleCreateRevenue} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Descrição *</label>
            <input
              type="text"
              required
              placeholder="Ex: Aluguel do Salão de Festas - Aniversário"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RevenueCategory)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              >
                {REVENUE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Origem / Meio</label>
              <input
                type="text"
                placeholder="Ex: Transferência PIX"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Unidade Relacionada (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: 302-B"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Confirmar Receita
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
