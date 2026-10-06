import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { DecisionPoll } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { VoteModal } from '../components/modals/VoteModal';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import {
  Vote,
  Plus,
  Calendar,
  CheckCircle2,
  Users,
  ShieldCheck,
  DollarSign,
  Download,
  FileText,
} from 'lucide-react';

export const DecisionsPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { decisions, createDecision } = useCondo();
  const { showToast } = useToast();

  const [activePollToVote, setActivePollToVote] = useState<DecisionPoll | null>(null);
  const [isNewPollModalOpen, setIsNewPollModalOpen] = useState(false);

  // New poll form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Obras e Melhorias');
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [budgetEstimate, setBudgetEstimate] = useState('');

  const canManage = role === 'sindico' || role === 'admin';

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = budgetEstimate ? parseFloat(budgetEstimate.replace(',', '.')) : undefined;

    const res = createDecision({
      title,
      description,
      category,
      startDate: new Date().toISOString().split('T')[0],
      endDate,
      status: 'Aberta',
      budgetEstimate: budgetNum,
      options: [
        { id: 'opt-aprov', label: 'Aprovar', votes: 0 },
        { id: 'opt-rejeit', label: 'Rejeitar', votes: 0 },
        { id: 'opt-abst', label: 'Abster-se', votes: 0 },
      ],
      eligibleVoters: 120,
    });

    if (res.success) {
      showToast('Votação Criada!', res.message, 'success');
      setTitle('');
      setDescription('');
      setBudgetEstimate('');
      setIsNewPollModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Central de Decisões & Assembleias Virtuais</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Governança digital participativa com voto criptografado e apuração em tempo real.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsNewPollModalOpen(true)}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Votação</span>
          </button>
        )}
      </div>

      {/* Decisions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {decisions.map((poll) => {
          const hasVoted = currentUser ? poll.votedUserIds.includes(currentUser.id) : false;
          const userOptionId = currentUser ? poll.userVotes[currentUser.id] : undefined;
          const quorumPercentage = ((poll.totalVotes / poll.eligibleVoters) * 100).toFixed(0);

          return (
            <div
              key={poll.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">
                      {poll.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                      {poll.title}
                    </h3>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded font-semibold shrink-0 ${
                      poll.status === 'Aberta'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {poll.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                  {poll.description}
                </p>

                {poll.budgetEstimate && (
                  <div className="mt-3 text-xs text-slate-600 flex items-center gap-1">
                    <span>Orçamento Orçado:</span>
                    <strong className="text-slate-900 font-semibold">
                      {formatCurrency(poll.budgetEstimate)}
                    </strong>
                  </div>
                )}

                {/* Quorum Progress */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Quórum de Participação:</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {poll.totalVotes} de {poll.eligibleVoters} unidades ({quorumPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(parseInt(quorumPercentage), 100)}%` }}
                    />
                  </div>
                </div>

                {/* Results breakdown (Section 26) */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Apuração dos Votos
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {poll.options.map((opt) => {
                      const pct = poll.totalVotes > 0 ? ((opt.votes / poll.totalVotes) * 100).toFixed(0) : '0';
                      const isUserChoice = opt.id === userOptionId;

                      return (
                        <div key={opt.id} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className={`flex items-center gap-1.5 ${isUserChoice ? 'font-bold text-purple-900' : 'text-slate-700'}`}>
                              {opt.label}
                              {isUserChoice && (
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-semibold">
                                  Seu voto
                                </span>
                              )}
                            </span>
                            <span className="tabular-nums font-semibold text-slate-900">
                              {pct}% ({opt.votes} votos)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                opt.label === 'Aprovar'
                                  ? 'bg-emerald-500'
                                  : opt.label === 'Rejeitar'
                                  ? 'bg-rose-500'
                                  : 'bg-slate-400'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Prazo: {formatDate(poll.endDate)}
                </span>

                {poll.status === 'Aberta' && (
                  hasVoted ? (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Voto registrado</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setActivePollToVote(poll)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Vote className="w-3.5 h-3.5" />
                      <span>Votar</span>
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {activePollToVote && (
        <VoteModal
          isOpen={!!activePollToVote}
          onClose={() => setActivePollToVote(null)}
          poll={activePollToVote}
        />
      )}

      {/* New Poll Modal */}
      <Modal
        isOpen={isNewPollModalOpen}
        onClose={() => setIsNewPollModalOpen(false)}
        title="Criar Nova Votação Online"
        subtitle="Abra uma deliberação democrática para todos os condôminos"
        maxWidth="md"
      >
        <form onSubmit={handleCreatePoll} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Título da Decisão *</label>
            <input
              type="text"
              required
              placeholder="Ex: Reforma da Fachada e Pintura Externa"
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
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="Obras e Melhorias">Obras e Melhorias</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Segurança">Segurança</option>
                <option value="Regulamento Interno">Regulamento Interno</option>
                <option value="Orçamento">Orçamento</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Prazo Final *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Orçamento Estimado (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={budgetEstimate}
              onChange={(e) => setBudgetEstimate(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Descrição & Justificativa *</label>
            <textarea
              rows={4}
              required
              placeholder="Explique o objetivo da melhoria, forma de custeio e impacto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewPollModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Publicar Votação
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
