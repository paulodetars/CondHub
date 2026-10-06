import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { MaintenanceRequest } from '../../types';
import { useCondo } from '../../context/CondoContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { Wrench } from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose }) => {
  const { createMaintenance } = useCondo();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<MaintenanceRequest['category']>('Área Comum');
  const [priority, setPriority] = useState<MaintenanceRequest['priority']>('Média');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      showToast('Preencha os campos', 'Informe o título do problema e a localização exata.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = createMaintenance({
      title,
      location,
      category,
      priority,
      reportedBy: currentUser?.name || 'Morador',
      unit: currentUser?.unit ? `${currentUser.unit} (${currentUser.block})` : undefined,
      notes,
    });
    setIsSubmitting(false);

    if (res.success) {
      showToast('Chamado Aberto!', res.message, 'success');
      setTitle('');
      setLocation('');
      setNotes('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Abrir Chamado de Manutenção"
      subtitle="Relate problemas estruturais, elétricos ou hidráulicos para a administração"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Problema / Ocorrência *</label>
          <input
            type="text"
            required
            placeholder="Ex: Lâmpada queimada no hall do 4º andar"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Local Exato *</label>
          <input
            type="text"
            required
            placeholder="Ex: Bloco C, 4º andar próximo ao elevador de serviço"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Categoria *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MaintenanceRequest['category'])}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            >
              <option value="Área Comum">Área Comum</option>
              <option value="Elétrica">Elétrica</option>
              <option value="Hidráulica">Hidráulica</option>
              <option value="Elevador">Elevador</option>
              <option value="Estrutural">Estrutural</option>
              <option value="Pintura">Pintura</option>
              <option value="Segurança">Segurança</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Prioridade</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as MaintenanceRequest['priority'])}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Detalhes Adicionais</label>
          <textarea
            rows={3}
            placeholder="Descreva quando o problema começou, se há risco ou barulho..."
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
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Registrando...' : 'Registrar Chamado'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
