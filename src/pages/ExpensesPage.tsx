import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { Expense, ExpenseCategory } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ExpenseModal } from '../components/modals/ExpenseModal';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Lock,
  Download,
  Receipt,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const ExpensesPage: React.FC = () => {
  const { role } = useAuth();
  const { expenses, deleteExpense } = useCondo();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [viewExpense, setViewExpense] = useState<Expense | null>(null);

  const canManage = role === 'sindico' || role === 'admin';

  const filteredExpenses = expenses.filter((e) => {
    if (search && !e.description.toLowerCase().includes(search.toLowerCase()) && !e.supplier.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
    return true;
  });

  const totalAmount = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  const handleDelete = (e: React.MouseEvent, exp: Expense) => {
    e.stopPropagation();
    if (window.confirm(`Deseja excluir a despesa "${exp.description}"?`)) {
      const res = deleteExpense(exp.id);
      if (res.success) {
        showToast('Despesa excluída', res.message, 'success');
      } else {
        showToast('Não foi possível excluir', res.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Despesas do Condomínio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro contábil, notas fiscais e controle de pagamento aos fornecedores.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsNewExpenseOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Despesa</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Pesquisar por descrição ou fornecedor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Água">Água</option>
              <option value="Energia">Energia</option>
              <option value="Elevadores">Elevadores</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Segurança">Segurança</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Jardinagem">Jardinagem</option>
              <option value="Administração">Administração</option>
              <option value="Obras">Obras</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
              <option value="Agendado">Agendado</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>{filteredExpenses.length} despesas listadas</span>
          <span className="font-semibold text-slate-800">
            Total filtrado: <span className="font-mono tabular-nums text-purple-950 font-bold">{formatCurrency(totalAmount)}</span>
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6">Categoria</th>
                <th className="py-3 px-6">Descrição</th>
                <th className="py-3 px-6">Fornecedor</th>
                <th className="py-3 px-6">Valor</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">NF / Doc</th>
                <th className="py-3 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  onClick={() => setViewExpense(exp)}
                  className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-6 tabular-nums text-slate-600">{formatDate(exp.date)}</td>
                  <td className="py-3.5 px-6">
                    <span className="font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900 max-w-xs truncate">
                    {exp.description}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700">{exp.supplier}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900 tabular-nums">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded border ${
                        exp.status === 'Pago'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : exp.status === 'Pendente'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {exp.status === 'Pago' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{exp.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-500 text-[11px]">
                    {exp.fiscalNumber || '-'}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewExpense(exp);
                        }}
                        className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Ver detalhe e comprovante"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canManage && (
                        <button
                          type="button"
                          disabled={exp.locked}
                          onClick={(e) => handleDelete(e, exp)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            exp.locked
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={exp.locked ? 'Bloqueado por balancete fechado' : 'Excluir despesa'}
                        >
                          {exp.locked ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
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

      {/* Modal to create new expense */}
      <ExpenseModal
        isOpen={isNewExpenseOpen}
        onClose={() => setIsNewExpenseOpen(false)}
      />

      {/* Modal to view expense detail and document */}
      {viewExpense && (
        <ExpenseModal
          isOpen={!!viewExpense}
          onClose={() => setViewExpense(null)}
          expenseToView={viewExpense}
        />
      )}
    </div>
  );
};
