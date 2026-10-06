import React from 'react';
import { Home, Wallet, Vote, Megaphone, User, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onQuickAction?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  onQuickAction,
}) => {
  const { role } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: role === 'morador' ? 'financeiro' : 'despesas', label: 'Financeiro', icon: Wallet },
    { id: 'decisoes', label: 'Decisões', icon: Vote },
    { id: 'comunicados', label: 'Avisos', icon: Megaphone },
    { id: 'configuracoes', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors flex-1 min-w-0 ${
              isActive ? 'text-purple-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-purple-700 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate w-full text-center">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
