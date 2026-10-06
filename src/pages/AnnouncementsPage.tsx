import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { formatDate } from '../utils/formatters';
import { AnnouncementModal } from '../components/modals/AnnouncementModal';
import { Megaphone, Plus, Search, Filter, AlertCircle, FileText, Download } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const AnnouncementsPage: React.FC = () => {
  const { role } = useAuth();
  const { announcements } = useCondo();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canManage = role === 'sindico' || role === 'admin';

  const filtered = announcements.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.content.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Mural de Comunicados Oficiais</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Avisos da administração, manutenções programadas e comunicados de segurança.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Comunicado</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por palavras-chave no mural..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
        >
          <option value="all">Todas as Categorias</option>
          <option value="Aviso">Aviso</option>
          <option value="Manutenção">Manutenção</option>
          <option value="Financeiro">Financeiro</option>
          <option value="Assembleia">Assembleia</option>
          <option value="Segurança">Segurança</option>
          <option value="Geral">Geral</option>
        </select>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-xl border p-5 shadow-2xs space-y-3 transition-colors ${
              ann.priority === 'Urgente'
                ? 'border-rose-300 bg-rose-50/20'
                : ann.priority === 'Importante'
                ? 'border-amber-300'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                    ann.priority === 'Urgente'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : ann.priority === 'Importante'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200'
                      : 'bg-purple-100 text-purple-700 border border-purple-200'
                  }`}
                >
                  {ann.priority}
                </span>

                <span className="text-xs text-slate-500 font-medium">
                  {ann.category}
                </span>

                <span className="text-slate-300">·</span>

                <span className="text-xs text-slate-400">
                  {formatDate(ann.date)}
                </span>
              </div>

              <span className="text-xs text-slate-500 font-medium">{ann.author}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
              {ann.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            {ann.attachmentName && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">{ann.attachmentName}</span>
                </div>
                <button
                  onClick={() => showToast('Arquivo Baixado', 'Documento aberto.', 'info')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Anexo</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
