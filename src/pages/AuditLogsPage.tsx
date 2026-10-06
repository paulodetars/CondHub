import React, { useState } from 'react';
import { useCondo } from '../context/CondoContext';
import { formatDateTime } from '../utils/formatters';
import { History, Search, Filter, ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useCondo();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filtered = auditLogs.filter((log) => {
    if (search && !log.action.toLowerCase().includes(search.toLowerCase()) && !log.userName.toLowerCase().includes(search.toLowerCase()) && !log.details.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (moduleFilter !== 'all' && log.module !== moduleFilter) return false;
    return true;
  });

  const modules = Array.from(new Set(auditLogs.map((l) => l.module)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Trilha de Auditoria e Governança</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro imutável de todas as ações de usuários, alterações financeiras e fechamentos contábeis.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Auditoria em Tempo Real Ativa</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por usuário, ação ou detalhe no log..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600"
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
        >
          <option value="all">Todos os Módulos</option>
          {modules.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Registros de Auditoria ({filtered.length} eventos)</h3>
          <span className="text-[11px] text-slate-400">Ordenado cronologicamente</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-6">Data & Hora</th>
                <th className="py-3 px-6">Usuário</th>
                <th className="py-3 px-6">Perfil</th>
                <th className="py-3 px-6">Módulo</th>
                <th className="py-3 px-6">Ação Realizada</th>
                <th className="py-3 px-6">Detalhes do Evento</th>
                <th className="py-3 px-6 text-right">Alteração</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900 whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-[11px] font-medium uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3.5 px-6 text-right whitespace-nowrap font-mono text-[11px]">
                    {log.previousValue && log.newValue ? (
                      <span className="text-slate-500">
                        {log.previousValue} → <strong className="text-purple-700">{log.newValue}</strong>
                      </span>
                    ) : log.newValue ? (
                      <span className="text-emerald-700 font-semibold">{log.newValue}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
