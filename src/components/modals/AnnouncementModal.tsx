import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Announcement, AnnouncementPriority } from '../../types';
import { useCondo } from '../../context/CondoContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { Megaphone } from 'lucide-react';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose }) => {
  const { createAnnouncement } = useCondo();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Aviso');
  const [priority, setPriority] = useState<AnnouncementPriority>('Normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Campos obrigatórios', 'Informe o título e o conteúdo do comunicado.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = createAnnouncement({
      title,
      content,
      category,
      priority,
      author: `${currentUser?.name} (${currentUser?.role === 'admin' ? 'Administradora' : 'Síndico'})`,
    });
    setIsSubmitting(false);

    if (res.success) {
      showToast('Comunicado Publicado!', res.message, 'success');
      setTitle('');
      setContent('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publicar Novo Comunicado"
      subtitle="Envie avisos oficiais para o mural de todos os moradores"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Título do Comunicado *</label>
          <input
            type="text"
            required
            placeholder="Ex: Manutenção preventiva no portão de entrada"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Categoria *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Announcement['category'])}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            >
              <option value="Aviso">Aviso</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Assembleia">Assembleia</option>
              <option value="Segurança">Segurança</option>
              <option value="Geral">Geral</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Prioridade</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            >
              <option value="Normal">Normal</option>
              <option value="Importante">Importante</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Conteúdo Completo *</label>
          <textarea
            rows={4}
            required
            placeholder="Escreva as informações detalhadas para os condôminos..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            <Megaphone className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Publicando...' : 'Publicar Comunicado'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
