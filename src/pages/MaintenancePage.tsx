import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { MaintenanceRequest } from '../types';
import { formatDate } from '../utils/formatters';
import { MaintenanceModal } from '../components/modals/MaintenanceModal';
import { useToast } from '../components/ui/Toast';
import { Wrench, Plus, Search, Filter, AlertTriangle, CheckCircle2, Clock, MapPin } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const { role } = useAuth();
  const { maintenanceRequests, updateMaintenanceStatus } = useCondo();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const canManage = role === 'sindico' || role === 'admin';

  const filtered = maintenanceRequests.filter((m) =>
    filterStatus === 'all' ? true : m.status === filterStatus
  );

  const handleStatusChange = (id: string, newStatus: MaintenanceRequest['status']) => {
    updateMaintenanceStatus(id, newStatus);
    showToast('Status Atualizado', `Chamado alterado para "${newStatus}".`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Manutenção Predial e Chamados</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhe reparos hidráulicos, elétricos, de elevadores e áreas de uso comum.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Abrir Chamado</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 pl-2">Filtrar:</span>
        {[
          { id: 'all', label: 'Todos os Chamados' },
          { id: 'Aberto', label: 'Abertos' },
          { id: 'Em andamento', label: 'Em andamento' },
          { id: 'Aguardando fornecedor', label: 'Aguardando Fornecedor' },
          { id: 'Resolvido', label: 'Resolvidos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-purple-50 text-purple-700 border border-purple-200 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60 uppercase">
                    {req.category}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                      req.priority === 'Urgente'
                        ? 'bg-rose-100 text-rose-700'
                        : req.priority === 'Alta'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {req.priority}
                  </span>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    req.status === 'Resolvido'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : req.status === 'Em andamento'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2">{req.title}</h3>

              <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>{req.location}</span>
              </div>

              {req.notes && (
                <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed">
                  {req.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">
                Aberto em {formatDate(req.dateReported)} por {req.reportedBy}
              </span>

              {canManage && (
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span className="text-slate-400 text-[11px]">Status:</span>
                  <select
                    value={req.status}
                    onChange={(e) =>
                      handleStatusChange(req.id, e.target.value as MaintenanceRequest['status'])
                    }
                    className="p-1 text-[11px] rounded border border-slate-300 bg-white font-medium"
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Aguardando fornecedor">Aguardando fornecedor</option>
                    <option value="Resolvido">Resolvido</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
