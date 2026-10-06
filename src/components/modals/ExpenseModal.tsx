import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCondo } from '../../context/CondoContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { FileText, Download, Building, Calendar, DollarSign, Tag, UserCheck, Lock } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToView?: Expense | null;
}

const CATEGORIES: ExpenseCategory[] = [
  'Água',
  'Energia',
  'Manutenção',
  'Limpeza',
  'Segurança',
  'Elevadores',
  'Jardinagem',
  'Funcionários',
  'Administração',
  'Obras',
  'Outros',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Boleto',
  'PIX',
  'Transferência Bancária',
  'Débito Automático',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseToView,
}) => {
  const { addExpense, suppliers } = useCondo();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const isViewMode = !!expenseToView;

  // Form states
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Manutenção');
  const [supplier, setSupplier] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Boleto');
  const [status, setStatus] = useState<'Pago' | 'Pendente' | 'Agendado'>('Pago');
  const [fiscalNumber, setFiscalNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !supplier.trim() || !amount) {
      showToast('Campos obrigatórios', 'Preencha a descrição, fornecedor e valor.', 'error');
      return;
    }

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Valor inválido', 'Informe um valor numérico válido maior que zero.', 'error');
      return;
    }

    setIsSubmitting(true);

    const supObj = suppliers.find((s) => s.name.toLowerCase() === supplier.toLowerCase());

    const result = addExpense({
      description,
      category,
      supplier,
      supplierCnpj: supObj?.cnpj,
      amount: numericAmount,
      date,
      dueDate,
      paymentMethod,
      status,
      responsible: currentUser?.name || 'Administração',
      notes,
      fiscalNumber: fiscalNumber.trim() || `NF-e ${Math.floor(10000 + Math.random() * 90000)}`,
      documentName: `Comprovante_${category}_${date.substring(0, 7)}.pdf`,
    });

    setIsSubmitting(false);

    if (result.success) {
      showToast('Despesa Cadastrada!', result.message, 'success');
      // Reset
      setDescription('');
      setAmount('');
      setFiscalNumber('');
      setNotes('');
      onClose();
    } else {
      showToast('Não foi possível cadastrar', result.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewMode ? 'Detalhamento da Despesa' : 'Cadastrar Nova Despesa'}
      subtitle={
        isViewMode
          ? `Lançamento contábil e documentos comprobatórios`
          : 'Registro financeiro e alocação no orçamento do condomínio'
      }
      maxWidth={isViewMode ? 'lg' : 'xl'}
    >
      {isViewMode && expenseToView ? (
        /* View Detail Mode */
        <div className="space-y-5">
          {expenseToView.locked && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Esta despesa está bloqueada porque pertence a um balancete contábil já fechado.
              </span>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">
                  {expenseToView.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {expenseToView.description}
                </h4>
              </div>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {formatCurrency(expenseToView.amount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block">Fornecedor:</span>
                <strong className="text-slate-800">{expenseToView.supplier}</strong>
                {expenseToView.supplierCnpj && (
                  <span className="text-slate-500 font-mono block text-[11px]">
                    CNPJ: {expenseToView.supplierCnpj}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-400 block">Forma de Pagamento:</span>
                <strong className="text-slate-800">{expenseToView.paymentMethod}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Data do Pagamento:</span>
                <span className="text-slate-700 font-medium">{formatDate(expenseToView.date)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Vencimento:</span>
                <span className="text-slate-700 font-medium">{formatDate(expenseToView.dueDate)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Responsável pelo Lançamento:</span>
                <span className="text-slate-700">{expenseToView.responsible}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <span
                  className={`inline-block font-semibold ${
                    expenseToView.status === 'Pago'
                      ? 'text-emerald-700'
                      : expenseToView.status === 'Pendente'
                      ? 'text-amber-700'
                      : 'text-blue-700'
                  }`}
                >
                  {expenseToView.status}
                </span>
              </div>
            </div>

            {expenseToView.notes && (
              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-400 block">Observações do Síndico:</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                  {expenseToView.notes}
                </p>
              </div>
            )}
          </div>

          {/* Related Documents Section */}
          <div>
            <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Documentos & Comprovantes Fiscais
            </h5>
            <div className="border border-slate-200 rounded-xl p-3 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    {expenseToView.documentName || `Nota_Fiscal_${expenseToView.fiscalNumber || 'Doc'}.pdf`}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {expenseToView.fiscalNumber || 'Documento autenticado'} · PDF 1.4 MB
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  showToast('Comprovante baixado', 'Arquivo fiscal pronto para auditoria.', 'success')
                }
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Visualizar</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      ) : (
        /* Create Mode Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Descrição da Despesa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Manutenção mensal dos 8 elevadores"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Valor (R$) *
              </label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Fornecedor *
              </label>
              <input
                type="text"
                required
                list="suppliers-list"
                placeholder="Nome da empresa ou prestador"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
              <datalist id="suppliers-list">
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Número da NF / Recibo
              </label>
              <input
                type="text"
                placeholder="Ex: NF-e 88.420"
                value={fiscalNumber}
                onChange={(e) => setFiscalNumber(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Data do Lançamento
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Observações / Justificativa
            </label>
            <textarea
              rows={2}
              placeholder="Detalhes sobre a aprovação, contrato ou destinação da verba..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Despesa'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
