import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { Supplier, ExpenseCategory } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { Briefcase, Plus, Search, Building2, Phone, Mail, CheckCircle2 } from 'lucide-react';

const CATEGORIES: ExpenseCategory[] = [
  'Elevadores',
  'Energia',
  'Água',
  'Segurança',
  'Limpeza',
  'Jardinagem',
  'Manutenção',
  'Administração',
  'Obras',
  'Outros',
];

export const SuppliersPage: React.FC = () => {
  const { role } = useAuth();
  const { suppliers, addSupplier } = useCondo();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Manutenção');

  const canManage = role === 'sindico' || role === 'admin';

  const filtered = suppliers.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.cnpj.includes(search)) {
      return false;
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addSupplier({
      name,
      cnpj,
      contactPerson,
      phone,
      email,
      category,
      status: 'Ativo',
    });

    if (res.success) {
      showToast('Fornecedor Cadastrado!', res.message, 'success');
      setName('');
      setCnpj('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Fornecedores & Prestadores Homologados</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro de contratos corporativos, notas fiscais e histórico financeiro de pagamentos.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Homologar Fornecedor</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar fornecedor por razão social ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sup) => (
          <div
            key={sup.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:border-purple-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">
                  {sup.category}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {sup.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">{sup.name}</h3>
              <span className="text-xs font-mono text-slate-400 block mt-0.5">CNPJ: {sup.cnpj}</span>

              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Contato:</span>
                  <strong className="text-slate-800">{sup.contactPerson}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-[11px]">{sup.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{sup.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Total Liquidado:</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                  {formatCurrency(sup.totalPaid)}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {sup.contractUntil ? `Vigência: ${formatDate(sup.contractUntil)}` : 'Recorrente'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Homologar Novo Fornecedor"
        subtitle="Cadastro de pessoa jurídica para prestação de serviços no condomínio"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Razão Social / Nome Fantasia *</label>
            <input
              type="text"
              required
              placeholder="Ex: Elevadores Paraná Ltda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">CNPJ *</label>
              <input
                type="text"
                required
                placeholder="00.000.000/0001-00"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Categoria *</label>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Pessoa de Contato *</label>
              <input
                type="text"
                required
                placeholder="Nome do gerente ou técnico"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Telefone *</label>
              <input
                type="text"
                required
                placeholder="(41) 3000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">E-mail Comercial *</label>
            <input
              type="email"
              required
              placeholder="comercial@fornecedor.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Homologar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
