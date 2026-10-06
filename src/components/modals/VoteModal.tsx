import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { DecisionPoll } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCondo } from '../../context/CondoContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { CheckCircle2, Vote, FileText, Download } from 'lucide-react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  poll: DecisionPoll;
}

export const VoteModal: React.FC<VoteModalProps> = ({ isOpen, onClose, poll }) => {
  const { castVote } = useCondo();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = currentUser?.id || '';
  const hasVoted = poll.votedUserIds.includes(userId);
  const userChosenOptionId = poll.userVotes[userId];

  const handleVote = () => {
    if (!selectedOption) {
      showToast('Selecione uma opção', 'Escolha sua manifestação antes de confirmar.', 'warning');
      return;
    }
    setIsSubmitting(true);
    const res = castVote(poll.id, selectedOption);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Voto Registrado!', res.message, 'success');
      onClose();
    } else {
      showToast('Não foi possível votar', res.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={poll.title}
      subtitle={`Encerramento em: ${formatDate(poll.endDate)} · Votação Oficial`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Description box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {poll.description}
          </p>

          <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
            {poll.budgetEstimate && (
              <div>
                <span className="text-slate-400 block text-[11px]">Orçamento Estimado:</span>
                <strong className="text-purple-900 tabular-nums">
                  {formatCurrency(poll.budgetEstimate)}
                </strong>
              </div>
            )}
            <div>
              <span className="text-slate-400 block text-[11px]">Participação Atual:</span>
              <span className="text-slate-800 font-medium tabular-nums">
                {poll.totalVotes} de {poll.eligibleVoters} unidades (
                {((poll.totalVotes / poll.eligibleVoters) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Attachment if present */}
        {poll.attachmentName && (
          <div className="border border-slate-200 rounded-lg p-3 bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 truncate">
              <FileText className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="truncate text-slate-700 font-medium">{poll.attachmentName}</span>
            </div>
            <button
              type="button"
              onClick={() => showToast('Arquivo Baixado', 'Documento técnico disponível.', 'info')}
              className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 shrink-0 ml-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ver</span>
            </button>
          </div>
        )}

        {/* Voting Options */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
            {hasVoted ? 'Seu Voto Registrado' : 'Escolha sua Opção de Voto'}
          </h4>

          {hasVoted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Seu voto foi registrado com sucesso nesta assembleia virtual.
                </span>
                <span className="text-xs text-emerald-700">
                  Opção escolhida:{' '}
                  <strong>
                    {poll.options.find((o) => o.id === userChosenOptionId)?.label || 'Voto computado'}
                  </strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {poll.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="poll-option"
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => setSelectedOption(option.id)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-semibold text-slate-800">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {!hasVoted && (
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleVote}
              disabled={isSubmitting || !selectedOption}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Registrando...' : 'Confirmar Voto'}</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
