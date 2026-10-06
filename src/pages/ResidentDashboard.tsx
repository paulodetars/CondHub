import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PixPaymentModal } from '../components/modals/PixPaymentModal';
import { BoletoModal } from '../components/modals/BoletoModal';
import { VoteModal } from '../components/modals/VoteModal';
import {
  Wallet,
  Calendar,
  Vote,
  Megaphone,
  FileText,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  Building2,
  CalendarDays,
  ShieldCheck,
} from 'lucide-react';

export const ResidentDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { condominium, invoices, decisions, announcements, documents, timeline } = useCondo();

  // Modals state
  const [isPixOpen, setIsPixOpen] = useState(false);
  const [isBoletoOpen, setIsBoletoOpen] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);

  // Carlos current invoice
  const currentInvoice =
    invoices.find((i) => i.unit === currentUser?.unit && i.status === 'Em aberto') ||
    invoices.find((i) => i.unit === currentUser?.unit) ||
    invoices[0];

  const isCurrentPaid = currentInvoice?.status === 'Pago';

  // Highlighted decision
  const activePoll = decisions.find((p) => p.status === 'Aberta') || decisions[0];
  const hasVotedActivePoll = activePoll ? activePoll.votedUserIds.includes(currentUser?.id || '') : false;

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>{condominium.name} · Unidade {currentUser?.unit || '302'} ({currentUser?.block || 'Bloco B'})</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, {currentUser?.name?.split(' ')[0] || 'Morador'}!
          </h2>

          <p className="text-purple-200/90 text-xs sm:text-sm mt-1 leading-relaxed">
            Bem-vindo ao seu portal de governança e transparência. Consulte sua cota, participe das
            votações ativas e acompanhe a prestação de contas do seu condomínio.
          </p>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Two Columns: Financial Situation & Next Decision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Minha Situação Financeira (Section 12) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Minha Situação Financeira</h3>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded font-semibold ${
                  isCurrentPaid
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isCurrentPaid ? 'Em dia / Pago' : 'Cota em aberto'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">
                  Próximo Vencimento
                </span>
                <span className="text-2xl font-bold text-slate-900 tabular-nums block mt-1">
                  {formatCurrency(currentInvoice.amount)}
                </span>
                <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-500" />
                  Vencimento: <strong>{formatDate(currentInvoice.dueDate)}</strong>
                </span>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider block">
                    Referência Atual
                  </span>
                  <span className="text-sm font-semibold text-slate-800 block mt-1">
                    {currentInvoice.monthReference}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Inclui fundo de reserva (10%), água/gás e cota ordinária.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
            {!isCurrentPaid ? (
              <>
                <button
                  onClick={() => setIsPixOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Pagar com PIX</span>
                </button>
                <button
                  onClick={() => setIsBoletoOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Ver Boleto</span>
                </button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Parabéns! Sua cota condominial está 100% quitada.</span>
                </div>
                <button
                  onClick={() => setIsBoletoOpen(true)}
                  className="text-xs text-emerald-900 font-semibold underline hover:no-underline"
                >
                  Ver Comprovante
                </button>
              </div>
            )}

            <button
              onClick={() => onNavigate('financeiro')}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold ml-auto flex items-center gap-1 py-1"
            >
              <span>Histórico Financeiro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Próxima Decisão / Votação (Section 12 & 24) */}
        {activePoll && (
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Vote className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-base">Próxima Decisão</h3>
                </div>
                <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-medium">
                  Até {formatDate(activePoll.endDate)}
                </span>
              </div>

              <div className="my-4">
                <span className="text-xs text-purple-700 font-semibold block uppercase tracking-wider mb-1">
                  {activePoll.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {activePoll.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {activePoll.description}
                </p>

                {activePoll.budgetEstimate && (
                  <div className="mt-3 text-xs text-slate-500">
                    Orçamento Previsto:{' '}
                    <strong className="text-slate-800 font-semibold">
                      {formatCurrency(activePoll.budgetEstimate)}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {hasVotedActivePoll ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Voto registrado</span>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedPollId(activePoll.id)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Vote className="w-4 h-4" />
                  <span>Votar Agora</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('decisoes')}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Recent Announcements & Condominium Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Announcements */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-base">Comunicados Recentes</h3>
            </div>
            <button
              onClick={() => onNavigate('comunicados')}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
            >
              <span>Ver mural completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                onClick={() => onNavigate('comunicados')}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-purple-200 bg-slate-50/50 hover:bg-purple-50/20 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                        ann.priority === 'Urgente'
                          ? 'bg-rose-100 text-rose-700'
                          : ann.priority === 'Importante'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{ann.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{formatDate(ann.date)}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline do Condomínio (Section 29) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-base">Timeline de Acontecimentos</h3>
            </div>
            <button
              onClick={() => onNavigate('transparencia')}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold"
            >
              Transparência
            </button>
          </div>

          <div className="space-y-4">
            {timeline.slice(0, 4).map((item, idx) => (
              <div key={item.id} className="flex items-start gap-3 text-xs relative">
                {/* Visual bullet */}
                <div className="w-2.5 h-2.5 rounded-full bg-purple-600 mt-1 shrink-0 ring-4 ring-purple-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-800 truncate">{item.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">{item.date}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals for Quick Actions */}
      {currentInvoice && (
        <>
          <PixPaymentModal
            isOpen={isPixOpen}
            onClose={() => setIsPixOpen(false)}
            invoice={currentInvoice}
          />
          <BoletoModal
            isOpen={isBoletoOpen}
            onClose={() => setIsBoletoOpen(false)}
            invoice={currentInvoice}
            onOpenPix={() => setIsPixOpen(true)}
          />
        </>
      )}

      {activePoll && selectedPollId && (
        <VoteModal
          isOpen={!!selectedPollId}
          onClose={() => setSelectedPollId(null)}
          poll={activePoll}
        />
      )}
    </div>
  );
};
