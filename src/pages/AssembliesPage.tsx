import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { Assembly } from '../types';
import { formatDate } from '../utils/formatters';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import {
  Users,
  Plus,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Download,
  Video,
  CheckCircle2,
} from 'lucide-react';

export const AssembliesPage: React.FC = () => {
  const { role } = useAuth();
  const { assemblies, createAssembly } = useCondo();
  const { showToast } = useToast();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Assembly['type']>('Extraordinária');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [location, setLocation] = useState('Salão de Festas Principal e Online Google Meet');
  const [agendaItems, setAgendaItems] = useState('1. Apresentação do balancete\n2. Votação de reformas\n3. Assuntos gerais');

  const canManage = role === 'sindico' || role === 'admin';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const agenda = agendaItems
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const res = createAssembly({
      title,
      type,
      date,
      time,
      location,
      status: 'Agendada',
      agenda,
      minutesDocumentName: `Edital_Convocacao_${date}.pdf`,
    });

    if (res.success) {
      showToast('Assembleia Agendada!', res.message, 'success');
      setTitle('');
      setIsNewModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Assembleias Gerais</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Editais de convocação, atas registradas em cartório e pautas deliberativas.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Convocar Assembleia</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {assemblies.map((asm) => (
          <div
            key={asm.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">
                  Assembleia Geral {asm.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{asm.title}</h3>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded font-semibold self-start sm:self-auto ${
                  asm.status === 'Agendada'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {asm.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Data: <strong>{formatDate(asm.date)}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Horário: <strong>{asm.time}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">Local: <strong>{asm.location}</strong></span>
              </div>
            </div>

            {/* Agenda */}
            <div>
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Pauta da Ordem do Dia
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {asm.agenda.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Attachments */}
            {asm.minutesDocumentName && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">{asm.minutesDocumentName}</span>
                </div>
                <button
                  onClick={() => showToast('Download da Ata', 'Baixando documento oficial assinado...', 'info')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Documento</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Convocar Nova Assembleia"
        subtitle="Publicação de edital com pauta deliberativa e lista de presença"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Título da Assembleia *</label>
            <input
              type="text"
              required
              placeholder="Ex: Assembleia Geral Extraordinária - Outubro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tipo *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Assembly['type'])}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="Extraordinária">Extraordinária</option>
                <option value="Ordinária">Ordinária</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Data *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Horário *</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Local / Link</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Pauta da Assembleia (uma por linha) *</label>
            <textarea
              rows={4}
              required
              value={agendaItems}
              onChange={(e) => setAgendaItems(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Publicar Convocação
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
