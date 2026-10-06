import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCondo } from '../../context/CondoContext';
import { useToast } from '../ui/Toast';
import {
  Bell,
  Menu,
  RotateCcw,
  Check,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';

interface TopHeaderProps {
  currentPageTitle: string;
  onMobileMenuToggle: () => void;
  onNavigate: (page: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentPageTitle,
  onMobileMenuToggle,
  onNavigate,
}) => {
  const { currentUser, role } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, resetAllDemoData } = useCondo();
  const { showToast } = useToast();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar todos os dados e balancetes da demonstração para o padrão original?')) {
      resetAllDemoData();
      showToast('Dados Restaurados!', 'O banco de dados foi reiniciado com os valores padrão.', 'info');
    }
  };

  const roleBadgeText = {
    morador: 'Morador',
    sindico: 'Síndico',
    admin: 'Administradora',
  }[role || 'morador'];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-900 text-sm tracking-tight sm:text-base">
            {currentPageTitle}
          </span>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="hidden sm:inline text-slate-500 font-medium">CondoHub</span>
        </div>
      </div>

      {/* Zone 3: Actions & Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleResetData}
          title="Reiniciar dados da demonstração"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Demo</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">Notificações</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    Marcar lidas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Nenhuma notificação no momento.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.actionUrl) onNavigate(n.actionUrl);
                        setIsNotificationsOpen(false);
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.read ? 'bg-purple-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-800 tracking-tight">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">{n.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-slate-900 block leading-tight">
              {currentUser?.name}
            </span>
            <span className="text-[10px] text-purple-700 font-medium block">
              {roleBadgeText} {currentUser?.unit ? `· Apto ${currentUser.unit}` : ''}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
