import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { Reservation } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ReservationModal } from '../components/modals/ReservationModal';
import { useToast } from '../components/ui/Toast';
import { CalendarDays, Plus, Clock, User, CheckCircle2, XCircle } from 'lucide-react';

export const ReservationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reservations, cancelReservation } = useCondo();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Reservation['areaName']>('Salão de Festas');

  const handleOpenReserve = (area: Reservation['areaName']) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Deseja cancelar esta reserva?')) {
      cancelReservation(id);
      showToast('Reserva cancelada', 'O horário foi liberado para outros moradores.', 'info');
    }
  };

  const areasList: { name: Reservation['areaName']; capacity: string; fee: number; desc: string }[] = [
    {
      name: 'Salão de Festas',
      capacity: 'Até 80 pessoas',
      fee: 250,
      desc: 'Climatizado, com cozinha equipada, fogão industrial, freezer e mesas com cadeiras estofadas.',
    },
    {
      name: 'Espaço Gourmet',
      capacity: 'Até 35 pessoas',
      fee: 180,
      desc: 'Bancada em granito, cooktop por indução, churrasqueira embutida e adega climatizada.',
    },
    {
      name: 'Churrasqueira',
      capacity: 'Até 25 pessoas',
      fee: 120,
      desc: 'Área coberta integrada à alameda das árvores, grelhas em inox e chopeira com geladeira.',
    },
    {
      name: 'Academia',
      capacity: 'Uso livre',
      fee: 0,
      desc: 'Equipamentos Movement profissionais, esteiras ergométricas e ar-condicionado.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Reservas de Áreas Comuns</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Agendamento transparente e sem conflito de horários para confraternizações e eventos familiares.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Reserva</span>
        </button>
      </div>

      {/* Areas Showcase Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {areasList.map((area) => (
          <div
            key={area.name}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{area.name}</h3>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {area.fee === 0 ? 'Sem taxa' : formatCurrency(area.fee)}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">{area.capacity}</span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{area.desc}</p>
            </div>

            <button
              onClick={() => handleOpenReserve(area.name)}
              className="w-full mt-2 py-2 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-semibold text-xs rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              Agendar Horário
            </button>
          </div>
        ))}
      </div>

      {/* Active and Past Reservations */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Próximos Agendamentos Confirmados</h3>
          <span className="text-xs text-slate-400">{reservations.length} agendamentos registrados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-6">Espaço</th>
                <th className="py-3 px-6">Data</th>
                <th className="py-3 px-6">Período / Turno</th>
                <th className="py-3 px-6">Morador / Unidade</th>
                <th className="py-3 px-6">Taxa</th>
                <th className="py-3 px-6">Situação</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservations.map((resv) => (
                <tr key={resv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">{resv.areaName}</td>
                  <td className="py-3.5 px-6 font-medium text-slate-800 tabular-nums">
                    {formatDate(resv.date)}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{resv.period}</td>
                  <td className="py-3.5 px-6">
                    <span className="font-semibold text-slate-800">{resv.residentName}</span>
                    <span className="text-slate-400 text-[11px] block">{resv.unit}</span>
                  </td>
                  <td className="py-3.5 px-6 font-mono text-slate-700">
                    {resv.fee === 0 ? 'Gratuito' : formatCurrency(resv.fee)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded border ${
                        resv.status === 'Confirmada'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : resv.status === 'Cancelada'
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {resv.status === 'Confirmada' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{resv.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {resv.status !== 'Cancelada' && (
                      <button
                        onClick={() => handleCancel(resv.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultArea={selectedArea}
      />
    </div>
  );
};
