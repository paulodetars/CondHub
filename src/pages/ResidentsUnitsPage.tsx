import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { Resident } from '../types';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import {
  Users,
  Plus,
  Search,
  Filter,
  Building,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

export const ResidentsUnitsPage: React.FC = () => {
  const { role } = useAuth();
  const { residents, units, addResident } = useCondo();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'moradores' | 'unidades'>('moradores');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New resident form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [unit, setUnit] = useState('101');
  const [block, setBlock] = useState('Bloco A');
  const [isOwner, setIsOwner] = useState(true);

  const canManage = role === 'sindico' || role === 'admin';

  const filteredResidents = residents.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedBlock !== 'all' && r.block !== selectedBlock) return false;
    return true;
  });

  const filteredUnits = units.filter((u) => {
    if (search && !u.number.includes(search) && !u.ownerName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedBlock !== 'all' && u.block !== selectedBlock) return false;
    return true;
  });

  const handleCreateResident = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addResident({
      name,
      email,
      phone,
      unit,
      block,
      isOwner,
      status: 'Ativo',
      financialSituation: 'Em dia',
    });

    if (res.success) {
      showToast('Morador Cadastrado!', res.message, 'success');
      setName('');
      setEmail('');
      setPhone('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Moradores e Unidades</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastro de condôminos, mapa dos 4 blocos e situação patrimonial do Residencial Jardim Aurora.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Morador</span>
          </button>
        )}
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('moradores')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'moradores'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Moradores ({residents.length})
            </button>
            <button
              onClick={() => setActiveTab('unidades')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'unidades'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unidades (120 Apts)
            </button>
          </div>

          {/* Block Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Bloco A', 'Bloco B', 'Bloco C', 'Bloco D'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBlock(b)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedBlock === b
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {b === 'all' ? 'Todos os Blocos' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={activeTab === 'moradores' ? 'Buscar morador por nome ou e-mail...' : 'Buscar apartamento...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'moradores' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-6">Morador</th>
                  <th className="py-3 px-6">Unidade</th>
                  <th className="py-3 px-6">Tipo</th>
                  <th className="py-3 px-6">Contato</th>
                  <th className="py-3 px-6">Situação Financeira</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResidents.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {res.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">{res.name}</span>
                          <span className="text-[11px] text-slate-400">{res.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      Apto {res.unit} ({res.block})
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {res.isOwner ? 'Proprietário' : 'Inquilino'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-mono text-[11px]">{res.phone}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded border ${
                          res.financialSituation === 'Em dia'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {res.financialSituation === 'Em dia' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                        )}
                        <span>{res.financialSituation}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Units Tab */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUnits.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900">
                  Apto {u.number}
                </span>
                <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded">
                  {u.block}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                <div className="truncate">
                  <span className="text-slate-400">Titular: </span>
                  <strong className="text-slate-800">{u.ownerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Andar: </span>
                  <span>{u.floor}º Andar</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      u.financialSituation === 'Em dia'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {u.financialSituation}
                  </span>
                  <span className="text-[11px] text-slate-500">{u.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Resident Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Novo Morador"
        subtitle="Vincule um residente a uma unidade e envie credenciais de acesso"
        maxWidth="md"
      >
        <form onSubmit={handleCreateResident} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              placeholder="Ex: Ana Clara Barbosa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">E-mail *</label>
              <input
                type="email"
                required
                placeholder="anaclara@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                placeholder="(41) 99999-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Bloco *</label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="Bloco A">Bloco A</option>
                <option value="Bloco B">Bloco B</option>
                <option value="Bloco C">Bloco C</option>
                <option value="Bloco D">Bloco D</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Apartamento *</label>
              <input
                type="text"
                required
                placeholder="Ex: 302"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tipo</label>
              <select
                value={isOwner ? 'true' : 'false'}
                onChange={(e) => setIsOwner(e.target.value === 'true')}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="true">Proprietário</option>
                <option value="false">Inquilino</option>
              </select>
            </div>
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
              Salvar Cadastro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
