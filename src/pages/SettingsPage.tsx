import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { useToast } from '../components/ui/Toast';
import {
  Settings,
  User,
  Building2,
  DollarSign,
  Bell,
  Shield,
  Save,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { condominium, resetAllDemoData } = useCondo();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'perfil' | 'condominio' | 'financeiro' | 'notificacoes'>('perfil');

  // Profile form state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Condo settings
  const [condoName, setCondoName] = useState(condominium.name);
  const [condoAddress, setCondoAddress] = useState(condominium.address);

  // Financial settings
  const [dueDay, setDueDay] = useState('10');
  const [fineRate, setFineRate] = useState('2.0');
  const [interestRate, setInterestRate] = useState('1.0');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name, email, phone });
    showToast('Perfil Atualizado!', 'Suas alterações cadastrais foram salvas.', 'success');
  };

  const handleSaveCondo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Dados do Condomínio Salvos!', 'Informações cadastrais sincronizadas.', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Deseja realmente restaurar os dados da demonstração para o estado original?')) {
      resetAllDemoData();
      showToast('Dados Restaurados!', 'O sistema foi reiniciado com os valores padrão.', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Configurações & Parâmetros</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Gerenciamento de perfil, regras condominiais, políticas de juros e segurança.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {[
          { id: 'perfil', label: 'Minha Conta', icon: User },
          { id: 'condominio', label: 'Condomínio', icon: Building2 },
          { id: 'financeiro', label: 'Parâmetros Financeiros', icon: DollarSign },
          { id: 'notificacoes', label: 'Notificações', icon: Bell },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === t.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Perfil */}
      {activeTab === 'perfil' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Dados do Usuário Autenticado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Telefone Celular</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Perfil no Sistema</label>
              <input
                type="text"
                readOnly
                value={`${currentUser?.role?.toUpperCase()} ${currentUser?.unit ? `· Apto ${currentUser.unit} (${currentUser.block})` : ''}`}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Condomínio */}
      {activeTab === 'condominio' && (
        <form onSubmit={handleSaveCondo} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Identificação do Empreendimento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Nome do Condomínio</label>
              <input
                type="text"
                value={condoName}
                onChange={(e) => setCondoName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">CNPJ Registrado</label>
              <input
                type="text"
                readOnly
                value={condominium.cnpj}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Endereço Completo</label>
            <input
              type="text"
              value={condoAddress}
              onChange={(e) => setCondoAddress(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Total de Unidades</label>
              <input
                type="text"
                readOnly
                value={`${condominium.totalUnits} Apartamentos (4 Blocos)`}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Conta Bancária Oficial</label>
              <input
                type="text"
                readOnly
                value={`${condominium.bankAccount.bank} · Ag: ${condominium.bankAccount.agency}`}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Financeiro */}
      {activeTab === 'financeiro' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Regras de Cobrança e Inadimplência
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Dia de Vencimento Padrão</label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Multa por Atraso (%)</label>
              <input
                type="number"
                step="0.1"
                value={fineRate}
                onChange={(e) => setFineRate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Juros de Mora (% ao mês)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            Os parâmetros obedecem aos limites do Código Civil Brasileiro (Art. 1.336, § 1º) e convenção
            do Residencial Jardim Aurora.
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={() => showToast('Parâmetros Atualizados', 'Taxas salvas com sucesso.', 'success')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Salvar Parâmetros
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Notificações */}
      {activeTab === 'notificacoes' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Canais de Alertas e Notificações
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Notificação de Novo Boleto Disponível</span>
                <span className="text-slate-500">Aviso 5 dias antes da data de vencimento</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Confirmação de Pagamento PIX em Tempo Real</span>
                <span className="text-slate-500">Recibo enviado instantaneamente por e-mail e push</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Abertura de Novas Votações e Assembleias</span>
                <span className="text-slate-500">Alerta de quórum e convocações oficiais</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Dados Padrão da Demonstração</span>
            </button>

            <button
              onClick={() => showToast('Preferências Salvas!', 'Configuração de alertas atualizada.', 'success')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Salvar Preferências
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
