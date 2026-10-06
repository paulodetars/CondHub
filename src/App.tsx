/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CondoProvider } from './context/CondoContext';
import { ToastProvider } from './components/ui/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

// Pages
import { LandingLoginPage } from './pages/LandingLoginPage';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ResidentFinancePage } from './pages/ResidentFinancePage';
import { ResidentBoletosPage } from './pages/ResidentBoletosPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { RevenuesPage } from './pages/RevenuesPage';
import { BalancetesPage } from './pages/BalancetesPage';
import { PrestandoContasPage } from './pages/PrestandoContasPage';
import { DelinquencyPage } from './pages/DelinquencyPage';
import { DecisionsPage } from './pages/DecisionsPage';
import { AssembliesPage } from './pages/AssembliesPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { TimelinePage } from './pages/TimelinePage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ResidentsUnitsPage } from './pages/ResidentsUnitsPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Painel Principal',
  financeiro: 'Meu Financeiro',
  boletos: 'Meus Boletos',
  transparencia: 'Transparência Financeira',
  despesas: 'Despesas & Pagamentos',
  receitas: 'Receitas & Arrecadação',
  balancetes: 'Balancetes Contábeis',
  'prestacao-contas': 'Prestação de Contas Oficial',
  inadimplencia: 'Inadimplência & Cobrança',
  decisoes: 'Central de Decisões & Votação',
  assembleias: 'Assembleias Gerais',
  comunicados: 'Mural de Comunicados',
  timeline: 'Timeline de Governança',
  documentos: 'Central de Documentos',
  moradores: 'Moradores & Unidades',
  fornecedores: 'Fornecedores Homologados',
  manutencao: 'Manutenção Predial',
  reservas: 'Reservas de Espaços Comuns',
  relatorios: 'Relatórios Gerenciais',
  auditoria: 'Trilha de Auditoria',
  configuracoes: 'Configurações',
};

const MainAppContent: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // If user is not logged in, render the login & demo landing page
  if (!currentUser) {
    return <LandingLoginPage />;
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return role === 'morador' ? (
          <ResidentDashboard onNavigate={handleNavigate} />
        ) : (
          <AdminDashboard onNavigate={handleNavigate} />
        );
      case 'financeiro':
        return <ResidentFinancePage />;
      case 'boletos':
        return <ResidentBoletosPage />;
      case 'transparencia':
        return <TransparencyPage />;
      case 'despesas':
        return <ExpensesPage />;
      case 'receitas':
        return <RevenuesPage />;
      case 'balancetes':
        return <BalancetesPage />;
      case 'prestacao-contas':
        return <PrestandoContasPage />;
      case 'inadimplencia':
        return <DelinquencyPage />;
      case 'decisoes':
        return <DecisionsPage />;
      case 'assembleias':
        return <AssembliesPage />;
      case 'comunicados':
        return <AnnouncementsPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'documentos':
        return <DocumentsPage />;
      case 'moradores':
        return <ResidentsUnitsPage />;
      case 'fornecedores':
        return <SuppliersPage />;
      case 'manutencao':
        return <MaintenancePage />;
      case 'reservas':
        return <ReservationsPage />;
      case 'relatorios':
        return <ReportsPage />;
      case 'auditoria':
        return <AuditLogsPage />;
      case 'configuracoes':
        return <SettingsPage />;
      default:
        return role === 'morador' ? (
          <ResidentDashboard onNavigate={handleNavigate} />
        ) : (
          <AdminDashboard onNavigate={handleNavigate} />
        );
    }
  };

  const currentTitle = PAGE_TITLES[currentPage] || 'CondoHub';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-purple-600 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="lg:pl-64 flex flex-col flex-1 pb-16 lg:pb-0">
        <TopHeader
          currentPageTitle={currentTitle}
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CondoProvider>
        <ToastProvider>
          <MainAppContent />
        </ToastProvider>
      </CondoProvider>
    </AuthProvider>
  );
}
