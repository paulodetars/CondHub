import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Reservation } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCondo } from '../../context/CondoContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';
import { Calendar, Clock, DollarSign } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultArea?: Reservation['areaName'];
}

const AREAS: { name: Reservation['areaName']; fee: number; capacity: string }[] = [
  { name: 'Salão de Festas', fee: 250, capacity: 'Até 80 convidados' },
  { name: 'Espaço Gourmet', fee: 180, capacity: 'Até 35 convidados' },
  { name: 'Churrasqueira', fee: 120, capacity: 'Até 25 convidados' },
  { name: 'Academia', fee: 0, capacity: 'Uso individual/familiar' },
  { name: 'Quadra Poliesportiva', fee: 0, capacity: 'Uso livre por agendamento' },
];

const PERIODS: Reservation['period'][] = [
  'Manhã (08h - 12h)',
  'Tarde (13h - 17h)',
  'Noite (18h - 23h)',
  'Dia Todo (10h - 22h)',
];

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  defaultArea = 'Salão de Festas',
}) => {
  const { createReservation } = useCondo();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [areaName, setAreaName] = useState<Reservation['areaName']>(defaultArea);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [period, setPeriod] = useState<Reservation['period']>('Noite (18h - 23h)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAreaObj = AREAS.find((a) => a.name === areaName) || AREAS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = createReservation({
      areaName,
      date,
      period,
      residentName: currentUser?.name || 'Morador Solicitante',
      unit: currentUser?.unit ? `${currentUser.unit} (${currentUser.block})` : 'Unidade Demo',
      fee: selectedAreaObj.fee,
    });

    setIsSubmitting(false);

    if (res.success) {
      showToast('Reserva Solicitada!', res.message, 'success');
      onClose();
    } else {
      showToast('Data indisponível', res.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reservar Área Comum"
      subtitle="Agendamento com verificação automática de disponibilidade"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Espaço Desejado *</label>
          <select
            value={areaName}
            onChange={(e) => setAreaName(e.target.value as Reservation['areaName'])}
            className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
          >
            {AREAS.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name} ({a.capacity}) — {a.fee === 0 ? 'Gratuito' : `Taxa: ${formatCurrency(a.fee)}`}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Data do Evento *</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Período / Turno *</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Reservation['period'])}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 bg-white"
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3.5 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-purple-800">Taxa de Manutenção e Limpeza:</span>
            <strong className="text-purple-950 font-bold tabular-nums">
              {formatCurrency(selectedAreaObj.fee)}
            </strong>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Cobrança:</span>
            <span>Lançamento automático no próximo boleto condominial</span>
          </div>
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
            <span>{isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
