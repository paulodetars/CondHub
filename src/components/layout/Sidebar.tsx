import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCondo } from '../../context/CondoContext';
import { UserRole } from '../../types';
import {
  Home,
  Wallet,
  Receipt,
  PieChart,
  Vote,
  Megaphone,
  FileText,
  CalendarDays,
  Wrench,
  Users,
  Building2,
  Briefcase,
  AlertOctagon,
  FileSpreadsheet,
  FileCheck,
  History,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  FolderOpen,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { currentUser, role, switchDemoRole, logout } = useAuth();
  const { condominium } = useCondo();

  const handleNav = (page: string) => {
    onNavigate(page);
    if (onMobileClose) onMobileClose();
  };

  // Nav menus strictly configured by Role as requested in section 43
  const getNavItems = () => {
    if (role === 'morador') {
      return [
        { id: 'dashboard', label: 'Meu Condomínio', icon: Home },
        { id: 'financeiro', label: 'Meu Financeiro', icon: Wallet },
        { id: 'boletos', label: 'Meus Boletos', icon: Receipt },
        { id: 'transparencia', label: 'Transparência', icon: PieChart },
        { id: 'decisoes', label: 'Decisões & Votação', icon: Vote },
        { id: 'comunicados', label: 'Comunicados', icon: Megaphone },
        { id: 'documentos', label: 'Documentos', icon: FileText },
        { id: 'reservas', label: 'Reservas', icon: CalendarDays },
        { id: 'manutencao', label: 'Manutenção', icon: Wrench },
        { id: 'configuracoes', label: 'Meu Perfil', icon: Settings },
      ];
    }

    if (role === 'sindico') {
      return [
        { id: 'dashboard', label: 'Dashboard Síndico', icon: Home },
        { id: 'transparencia', label: 'Fluxo de Caixa', icon: PieChart },
        { id: 'despesas', label: 'Despesas', icon: Receipt },
        { id: 'receitas', label: 'Receitas', icon: Wallet },
        { id: 'inadimplencia', label: 'Inadimplência', icon: AlertOctagon },
        { id: 'decisoes', label: 'Votações', icon: Vote },
        { id: 'assembleias', label: 'Assembleias', icon: Users },
        { id: 'comunicados', label: 'Comunicados', icon: Megaphone },
        { id: 'documentos', label: 'Documentos', icon: FileText },
        { id: 'manutencao', label: 'Manutenção', icon: Wrench },
        { id: 'reservas', label: 'Reservas', icon: CalendarDays },
        { id: 'moradores', label: 'Moradores', icon: Users },
        { id: 'relatorios', label: 'Relatórios', icon: FileSpreadsheet },
      ];
    }

    // Administradora
    return [
      { id: 'dashboard', label: 'Dashboard Geral', icon: Home },
      { id: 'moradores', label: 'Moradores & Unidades', icon: Users },
      { id: 'despesas', label: 'Despesas', icon: Receipt },
      { id: 'receitas', label: 'Receitas', icon: Wallet },
      { id: 'inadimplencia', label: 'Inadimplência', icon: AlertOctagon },
      { id: 'balancetes', label: 'Balancetes', icon: FileSpreadsheet },
      { id: 'prestacao-contas', label: 'Prestação de Contas', icon: FileCheck },
      { id: 'fornecedores', label: 'Fornecedores', icon: Briefcase },
      { id: 'documentos', label: 'Documentos', icon: FolderOpen },
      { id: 'relatorios', label: 'Relatórios', icon: PieChart },
      { id: 'auditoria', label: 'Log de Auditoria', icon: History },
      { id: 'configuracoes', label: 'Configurações', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white shadow-md font-bold text-base">
              C
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-tight">
                CondoHub
              </span>
              <span className="text-[10px] text-purple-400 font-medium tracking-wide uppercase">
                Governança & Gestão
              </span>
            </div>
          </div>
        </div>

        {/* Condominium Chip */}
        <div className="p-3 mx-3 my-2 bg-slate-800/60 border border-slate-700/60 rounded-xl">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                {condominium.name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {condominium.city}/{condominium.state} · 120 Unidades
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Role Switcher Drawer / Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
          {/* Quick Demo Role Switcher */}
          <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5 px-1">
              Trocar Perfil (Demonstração)
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => switchDemoRole('morador')}
                className={`px-1.5 py-1 text-[11px] rounded font-medium transition-colors ${
                  role === 'morador'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Morador
              </button>
              <button
                onClick={() => switchDemoRole('sindico')}
                className={`px-1.5 py-1 text-[11px] rounded font-medium transition-colors ${
                  role === 'sindico'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Síndico
              </button>
              <button
                onClick={() => switchDemoRole('admin')}
                className={`px-1.5 py-1 text-[11px] rounded font-medium transition-colors ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* User profile row & logout */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-slate-400 block truncate capitalize">
                  {currentUser?.role} {currentUser?.unit ? `· Apto ${currentUser.unit}` : ''}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sair do sistema"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
