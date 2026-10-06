import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Condominium,
  Expense,
  Revenue,
  Invoice,
  BalancetePeriod,
  DecisionPoll,
  Assembly,
  Announcement,
  CondoDocument,
  Resident,
  Unit,
  Supplier,
  MaintenanceRequest,
  Reservation,
  AuditLog,
  NotificationItem,
  TimelineEvent,
  PaymentMethod,
} from '../types';
import {
  INITIAL_CONDOMINIUM,
  INITIAL_EXPENSES,
  INITIAL_REVENUES,
  INITIAL_INVOICES,
  INITIAL_BALANCETES,
  INITIAL_DECISIONS,
  INITIAL_ASSEMBLIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_RESIDENTS,
  INITIAL_UNITS,
  INITIAL_SUPPLIERS,
  INITIAL_MAINTENANCE,
  INITIAL_RESERVATIONS,
  INITIAL_TIMELINE,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { useAuth } from './AuthContext';

interface CondoContextType {
  condominium: Condominium;
  expenses: Expense[];
  revenues: Revenue[];
  invoices: Invoice[];
  balancetes: BalancetePeriod[];
  decisions: DecisionPoll[];
  assemblies: Assembly[];
  announcements: Announcement[];
  documents: CondoDocument[];
  residents: Resident[];
  units: Unit[];
  suppliers: Supplier[];
  maintenanceRequests: MaintenanceRequest[];
  reservations: Reservation[];
  timeline: TimelineEvent[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];

  // Actions
  payInvoice: (invoiceId: string, method?: PaymentMethod) => { success: boolean; message: string };
  addExpense: (expense: Omit<Expense, 'id' | 'monthPeriod' | 'locked'>) => { success: boolean; message: string };
  updateExpense: (id: string, updates: Partial<Expense>) => { success: boolean; message: string };
  deleteExpense: (id: string) => { success: boolean; message: string };
  addRevenue: (revenue: Omit<Revenue, 'id' | 'monthPeriod'>) => { success: boolean; message: string };
  castVote: (pollId: string, optionId: string) => { success: boolean; message: string };
  createDecision: (poll: Omit<DecisionPoll, 'id' | 'totalVotes' | 'votedUserIds' | 'userVotes'>) => { success: boolean; message: string };
  closeBalancete: (balanceteId: string) => { success: boolean; message: string };
  reopenBalancete: (balanceteId: string) => { success: boolean; message: string };
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'readByUserIds' | 'date'>) => { success: boolean; message: string };
  createAssembly: (assembly: Omit<Assembly, 'id'>) => { success: boolean; message: string };
  uploadDocument: (doc: Omit<CondoDocument, 'id' | 'uploadDate'>) => { success: boolean; message: string };
  createMaintenance: (req: Omit<MaintenanceRequest, 'id' | 'dateReported' | 'status'>) => { success: boolean; message: string };
  updateMaintenanceStatus: (id: string, status: MaintenanceRequest['status']) => void;
  createReservation: (resv: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => { success: boolean; message: string };
  cancelReservation: (id: string) => void;
  addResident: (resident: Omit<Resident, 'id'>) => { success: boolean; message: string };
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalPaid'>) => { success: boolean; message: string };
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetAllDemoData: () => void;

  // Computed
  currentBalance: number;
  totalExpensesCurrentMonth: number;
  totalRevenuesCurrentMonth: number;
  delinquentUnitsCount: number;
  delinquentTotalAmount: number;
  delinquencyRate: number;
}

const CondoContext = createContext<CondoContextType | undefined>(undefined);

const STORAGE_PREFIX = 'condohub_v1_';

export const CondoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  };

  const [condominium] = useState<Condominium>(() => getStored('condo', INITIAL_CONDOMINIUM));
  const [expenses, setExpenses] = useState<Expense[]>(() => getStored('expenses', INITIAL_EXPENSES));
  const [revenues, setRevenues] = useState<Revenue[]>(() => getStored('revenues', INITIAL_REVENUES));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getStored('invoices', INITIAL_INVOICES));
  const [balancetes, setBalancetes] = useState<BalancetePeriod[]>(() => getStored('balancetes', INITIAL_BALANCETES));
  const [decisions, setDecisions] = useState<DecisionPoll[]>(() => getStored('decisions', INITIAL_DECISIONS));
  const [assemblies, setAssemblies] = useState<Assembly[]>(() => getStored('assemblies', INITIAL_ASSEMBLIES));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getStored('announcements', INITIAL_ANNOUNCEMENTS));
  const [documents, setDocuments] = useState<CondoDocument[]>(() => getStored('documents', INITIAL_DOCUMENTS));
  const [residents, setResidents] = useState<Resident[]>(() => getStored('residents', INITIAL_RESIDENTS));
  const [units] = useState<Unit[]>(() => getStored('units', INITIAL_UNITS));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getStored('suppliers', INITIAL_SUPPLIERS));
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() =>
    getStored('maintenance', INITIAL_MAINTENANCE)
  );
  const [reservations, setReservations] = useState<Reservation[]>(() => getStored('reservations', INITIAL_RESERVATIONS));
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => getStored('timeline', INITIAL_TIMELINE));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStored('audit', INITIAL_AUDIT_LOGS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStored('notifications', INITIAL_NOTIFICATIONS)
  );

  // Persistence effects
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'expenses', JSON.stringify(expenses)), [expenses]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'revenues', JSON.stringify(revenues)), [revenues]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'invoices', JSON.stringify(invoices)), [invoices]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'balancetes', JSON.stringify(balancetes)), [balancetes]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'decisions', JSON.stringify(decisions)), [decisions]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'assemblies', JSON.stringify(assemblies)), [assemblies]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'announcements', JSON.stringify(announcements)), [announcements]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'documents', JSON.stringify(documents)), [documents]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'residents', JSON.stringify(residents)), [residents]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'suppliers', JSON.stringify(suppliers)), [suppliers]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'maintenance', JSON.stringify(maintenanceRequests)), [maintenanceRequests]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'reservations', JSON.stringify(reservations)), [reservations]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'timeline', JSON.stringify(timeline)), [timeline]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'audit', JSON.stringify(auditLogs)), [auditLogs]);
  useEffect(() => localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications)), [notifications]);

  // Helper to record audit
  const logAudit = (module: AuditLog['module'], action: string, details: string, prev?: string, next?: string) => {
    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Sistema',
      userRole: currentUser?.role || 'admin',
      module,
      action,
      details,
      previousValue: prev,
      newValue: next,
    };
    setAuditLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  // Helper to add timeline event
  const addTimelineEvent = (title: string, description: string, category: TimelineEvent['category'], badgeText: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const item: TimelineEvent = {
      id: 'time-' + Date.now(),
      title,
      description,
      category,
      date: dateStr,
      time: timeStr,
      author: currentUser?.name || 'Administração',
      badgeText,
    };
    setTimeline((prev) => [item, ...prev]);
  };

  // Helper to dispatch in-app notification
  const pushNotification = (title: string, description: string, type: NotificationItem['type'], actionUrl?: string) => {
    const item: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      description,
      type,
      timestamp: 'Agora mesmo',
      read: false,
      actionUrl,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  // 1. Pay Invoice
  const payInvoice = (invoiceId: string, method: PaymentMethod = 'PIX') => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) {
      return { success: false, message: 'Boleto/fatura não encontrado.' };
    }
    if (inv.status === 'Pago') {
      return { success: false, message: 'Esta fatura já está quitada.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const prevStatus = inv.status;

    setInvoices((prev) =>
      prev.map((item) =>
        item.id === invoiceId
          ? {
              ...item,
              status: 'Pago',
              paidDate: todayStr,
              paidAmount: item.amount,
              paymentMethod: method,
            }
          : item
      )
    );

    // Record corresponding revenue in current ledger
    const newRev: Revenue = {
      id: 'rev-pay-' + Date.now(),
      description: `Pagamento cota ${inv.monthReference} - Unidade ${inv.unit} (${inv.block})`,
      category: 'Condomínio',
      amount: inv.amount,
      date: todayStr,
      origin: method === 'PIX' ? 'Pagamento via PIX instantâneo' : 'Boleto bancário Santander',
      status: 'Confirmado',
      unit: `${inv.unit}-${inv.block}`,
      monthPeriod: inv.monthPeriod || '2026-10',
    };
    setRevenues((prev) => [newRev, ...prev]);

    // Update resident financial situation if resident matches
    setResidents((prev) =>
      prev.map((r) => {
        if (r.unit === inv.unit) {
          return { ...r, financialSituation: 'Em dia' };
        }
        return r;
      })
    );

    logAudit(
      'Cobranças',
      `Pagamento de cota condominial via ${method}`,
      `Quitação da cota ${inv.monthReference} referente à unidade ${inv.unit} (${inv.block}) no valor de R$ ${inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      `Status: ${prevStatus}`,
      'Status: Pago'
    );

    addTimelineEvent(
      `Pagamento de condomínio confirmado (${inv.unit} ${inv.block})`,
      `Valor de R$ ${inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} liquidado via ${method}.`,
      'finance',
      'Pagamento'
    );

    pushNotification(
      'Pagamento confirmado com sucesso!',
      `Sua cota de ${inv.monthReference} no valor de R$ ${inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi confirmada.`,
      'finance',
      'financeiro'
    );

    return {
      success: true,
      message: `Pagamento de R$ ${inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} via ${method} confirmado com sucesso!`,
    };
  };

  // 2. Add Expense
  const addExpense = (data: Omit<Expense, 'id' | 'monthPeriod' | 'locked'>) => {
    const month = data.date.substring(0, 7); // YYYY-MM
    // Check if period is closed
    const balancete = balancetes.find((b) => b.period === month);
    if (balancete && balancete.status === 'Fechado') {
      return {
        success: false,
        message: `Não é possível lançar despesas no período ${balancete.periodLabel}, pois o balancete já foi fechado pela administração.`,
      };
    }

    const newExpense: Expense = {
      ...data,
      id: 'exp-' + Date.now(),
      monthPeriod: month,
      locked: false,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    // Update supplier total paid if supplier matches
    setSuppliers((prev) =>
      prev.map((s) => (s.name === data.supplier ? { ...s, totalPaid: s.totalPaid + data.amount } : s))
    );

    logAudit(
      'Despesas',
      'Cadastro de despesa',
      `Lançamento de despesa "${data.description}" (${data.category}) no valor de R$ ${data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para o fornecedor ${data.supplier}.`,
      undefined,
      `R$ ${data.amount.toFixed(2)}`
    );

    addTimelineEvent(
      `Nova despesa registrada: ${data.category}`,
      `"${data.description}" - R$ ${data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${data.supplier}).`,
      'finance',
      'Despesa'
    );

    pushNotification(
      'Nova despesa registrada',
      `${data.category}: R$ ${data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} - ${data.supplier}`,
      'finance',
      'despesas'
    );

    return {
      success: true,
      message: 'Despesa cadastrada e integrada ao fluxo de caixa com sucesso!',
    };
  };

  // 3. Update Expense
  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return { success: false, message: 'Despesa não encontrada.' };

    if (target.locked) {
      return {
        success: false,
        message: 'Esta despesa pertence a um balancete já fechado e não pode ser editada.',
      };
    }

    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));

    logAudit('Despesas', 'Atualização de despesa', `Edição dos dados da despesa "${target.description}".`);

    return { success: true, message: 'Despesa atualizada com sucesso!' };
  };

  // 4. Delete Expense
  const deleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return { success: false, message: 'Despesa não encontrada.' };

    if (target.locked) {
      return {
        success: false,
        message: 'Esta despesa pertence a um período contábil fechado e não pode ser excluída.',
      };
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id));
    logAudit(
      'Despesas',
      'Exclusão de despesa',
      `Exclusão da despesa "${target.description}" no valor de R$ ${target.amount.toFixed(2)}.`
    );
    return { success: true, message: 'Despesa removida do sistema com sucesso.' };
  };

  // 5. Add Revenue
  const addRevenue = (data: Omit<Revenue, 'id' | 'monthPeriod'>) => {
    const month = data.date.substring(0, 7);
    const newRev: Revenue = {
      ...data,
      id: 'rev-' + Date.now(),
      monthPeriod: month,
    };
    setRevenues((prev) => [newRev, ...prev]);

    logAudit(
      'Receitas',
      'Lançamento de receita',
      `Nova receita "${data.description}" no valor de R$ ${data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      undefined,
      `R$ ${data.amount.toFixed(2)}`
    );

    return { success: true, message: 'Receita lançada no fluxo de caixa com sucesso!' };
  };

  // 6. Cast Vote
  const castVote = (pollId: string, optionId: string) => {
    const poll = decisions.find((p) => p.id === pollId);
    if (!poll) return { success: false, message: 'Votação não encontrada.' };

    const userId = currentUser?.id || 'anon';
    if (poll.votedUserIds.includes(userId)) {
      return { success: false, message: 'Você já registrou seu voto nesta decisão.' };
    }

    if (poll.status !== 'Aberta') {
      return { success: false, message: 'Esta votação já está encerrada.' };
    }

    setDecisions((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p;
        const updatedOptions = p.options.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt));
        return {
          ...p,
          options: updatedOptions,
          totalVotes: p.totalVotes + 1,
          votedUserIds: [...p.votedUserIds, userId],
          userVotes: { ...p.userVotes, [userId]: optionId },
        };
      })
    );

    const chosen = poll.options.find((o) => o.id === optionId)?.label || optionId;
    logAudit(
      'Votações',
      'Voto registrado em decisão',
      `Morador ${currentUser?.name} votou na opção "${chosen}" na decisão "${poll.title}".`
    );

    return { success: true, message: 'Seu voto foi registrado com sucesso!' };
  };

  // 7. Create Decision
  const createDecision = (poll: Omit<DecisionPoll, 'id' | 'totalVotes' | 'votedUserIds' | 'userVotes'>) => {
    const newPoll: DecisionPoll = {
      ...poll,
      id: 'poll-' + Date.now(),
      totalVotes: 0,
      votedUserIds: [],
      userVotes: {},
    };
    setDecisions((prev) => [newPoll, ...prev]);

    logAudit('Votações', 'Abertura de nova votação', `Criou a decisão/votação "${poll.title}".`);
    addTimelineEvent(`Nova votação aberta: ${poll.title}`, poll.description.slice(0, 100) + '...', 'vote', 'Votação');
    pushNotification('Nova votação disponível', `Participe: ${poll.title}`, 'vote', 'decisoes');

    return { success: true, message: 'Votação publicada com sucesso para todos os condôminos!' };
  };

  // 8. Close Balancete
  const closeBalancete = (balanceteId: string) => {
    const bal = balancetes.find((b) => b.id === balanceteId);
    if (!bal) return { success: false, message: 'Balancete não encontrado.' };

    const closedBy = `${currentUser?.name} (${currentUser?.role === 'admin' ? 'Administradora' : 'Síndico'})`;
    const nowIso = new Date().toISOString();

    setBalancetes((prev) =>
      prev.map((b) =>
        b.id === balanceteId
          ? {
              ...b,
              status: 'Fechado',
              closedAt: nowIso,
              closedBy,
            }
          : b
      )
    );

    // Lock all expenses of that month
    setExpenses((prev) => prev.map((e) => (e.monthPeriod === bal.period ? { ...e, locked: true } : e)));

    logAudit(
      'Balancetes',
      'Fechamento de balancete contábil',
      `Balancete do período ${bal.periodLabel} fechado por ${closedBy}. Todas as despesas e receitas do mês foram bloqueadas contra alterações.`,
      'Status: Em aberto',
      'Status: Fechado'
    );

    addTimelineEvent(
      `Balancete de ${bal.periodLabel} fechado`,
      `Prestação de contas consolidada e auditada pela administração.`,
      'balancete',
      'Balancete'
    );

    pushNotification(
      `Balancete de ${bal.periodLabel} fechado`,
      'A prestação de contas mensal está disponível para consulta com parecer contábil.',
      'document',
      'balancetes'
    );

    return {
      success: true,
      message: `Balancete de ${bal.periodLabel} fechado com sucesso! Alterações no período estão bloqueadas.`,
    };
  };

  // 9. Reopen Balancete (Admin only)
  const reopenBalancete = (balanceteId: string) => {
    if (currentUser?.role !== 'admin') {
      return { success: false, message: 'Apenas a Administradora possui permissão para reabrir um balancete fechado.' };
    }
    const bal = balancetes.find((b) => b.id === balanceteId);
    if (!bal) return { success: false, message: 'Balancete não encontrado.' };

    setBalancetes((prev) =>
      prev.map((b) =>
        b.id === balanceteId
          ? {
              ...b,
              status: 'Em aberto',
              closedAt: undefined,
              closedBy: undefined,
            }
          : b
      )
    );

    // Unlock expenses of that month
    setExpenses((prev) => prev.map((e) => (e.monthPeriod === bal.period ? { ...e, locked: false } : e)));

    logAudit(
      'Balancetes',
      'Reabertura de balancete contábil',
      `Balancete ${bal.periodLabel} reaberto pela Administradora ${currentUser.name}. Edições desbloqueadas temporariamente.`,
      'Status: Fechado',
      'Status: Em aberto'
    );

    return { success: true, message: `Balancete de ${bal.periodLabel} reaberto com sucesso!` };
  };

  // 10. Announcements
  const createAnnouncement = (ann: Omit<Announcement, 'id' | 'readByUserIds' | 'date'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newAnn: Announcement = {
      ...ann,
      id: 'ann-' + Date.now(),
      date: todayStr,
      readByUserIds: currentUser ? [currentUser.id] : [],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    logAudit(
      'Comunicados',
      'Publicação de comunicado',
      `Novo comunicado: "${ann.title}" com prioridade ${ann.priority}.`
    );

    addTimelineEvent(`Novo comunicado: ${ann.title}`, ann.content.slice(0, 100) + '...', 'announcement', 'Comunicado');
    pushNotification(`Comunicado: ${ann.title}`, ann.content.slice(0, 90), 'announcement', 'comunicados');

    return { success: true, message: 'Comunicado publicado com sucesso para todos os moradores!' };
  };

  // 11. Assemblies
  const createAssembly = (asm: Omit<Assembly, 'id'>) => {
    const newAsm: Assembly = {
      ...asm,
      id: 'asm-' + Date.now(),
    };
    setAssemblies((prev) => [newAsm, ...prev]);

    logAudit('Assembleias', 'Convocação de assembleia', `Convocou a assembleia "${asm.title}" para ${asm.date} às ${asm.time}.`);
    addTimelineEvent(`Assembleia Convocada: ${asm.title}`, `Data: ${asm.date} às ${asm.time} - ${asm.location}`, 'assembly', 'Assembleia');

    return { success: true, message: 'Assembleia convocada e edital publicado!' };
  };

  // 12. Documents
  const uploadDocument = (doc: Omit<CondoDocument, 'id' | 'uploadDate'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newDoc: CondoDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      uploadDate: todayStr,
    };
    setDocuments((prev) => [newDoc, ...prev]);

    logAudit('Documentos', 'Upload de documento', `Publicou o documento "${doc.title}" (${doc.category}).`);
    pushNotification('Novo documento publicado', `${doc.title} (${doc.category})`, 'document', 'documentos');

    return { success: true, message: 'Documento arquivado e disponibilizado com sucesso!' };
  };

  // 13. Maintenance
  const createMaintenance = (req: Omit<MaintenanceRequest, 'id' | 'dateReported' | 'status'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newReq: MaintenanceRequest = {
      ...req,
      id: 'mnt-' + Date.now(),
      dateReported: todayStr,
      status: 'Aberto',
    };
    setMaintenanceRequests((prev) => [newReq, ...prev]);

    logAudit(
      'Manutenção',
      'Abertura de chamado de manutenção',
      `Chamado "${req.title}" no local "${req.location}" reportado por ${req.reportedBy}.`
    );

    addTimelineEvent(`Chamado de manutenção aberto`, `${req.title} (${req.location})`, 'maintenance', 'Manutenção');

    return { success: true, message: 'Chamado de manutenção registrado com sucesso!' };
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceRequest['status']) => {
    setMaintenanceRequests((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    logAudit('Manutenção', 'Alteração de status de manutenção', `Chamado atualizado para status: ${status}`);
  };

  // 14. Reservations
  const createReservation = (resv: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    // Check conflicts
    const conflict = reservations.find(
      (r) => r.areaName === resv.areaName && r.date === resv.date && r.period === resv.period && r.status !== 'Cancelada'
    );
    if (conflict) {
      return {
        success: false,
        message: `A área "${resv.areaName}" já está reservada para ${resv.date} no período ${resv.period}.`,
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newResv: Reservation = {
      ...resv,
      id: 'resv-' + Date.now(),
      createdAt: todayStr,
      status: 'Confirmada',
    };
    setReservations((prev) => [newResv, ...prev]);

    logAudit(
      'Reservas',
      'Reserva de espaço comum confirmada',
      `${resv.residentName} (${resv.unit}) reservou ${resv.areaName} para o dia ${resv.date} (${resv.period}). Taxa: R$ ${resv.fee.toFixed(2)}.`
    );

    return { success: true, message: `Reserva do ${resv.areaName} para o dia ${resv.date} confirmada com sucesso!` };
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Cancelada' } : r)));
    logAudit('Reservas', 'Cancelamento de reserva', `Reserva ${id} foi cancelada.`);
  };

  // 15. Residents & Suppliers
  const addResident = (resData: Omit<Resident, 'id'>) => {
    const newRes: Resident = { ...resData, id: 'res-' + Date.now() };
    setResidents((prev) => [newRes, ...prev]);
    logAudit('Moradores', 'Cadastro de morador', `Novo morador cadastrado: ${resData.name} (${resData.unit} ${resData.block}).`);
    return { success: true, message: 'Morador cadastrado com sucesso!' };
  };

  const addSupplier = (supData: Omit<Supplier, 'id' | 'totalPaid'>) => {
    const newSup: Supplier = { ...supData, id: 'sup-' + Date.now(), totalPaid: 0 };
    setSuppliers((prev) => [newSup, ...prev]);
    logAudit('Sistema', 'Cadastro de fornecedor', `Fornecedor cadastrado: ${supData.name} (CNPJ: ${supData.cnpj}).`);
    return { success: true, message: 'Fornecedor homologado com sucesso!' };
  };

  // 16. Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 17. Reset All
  const resetAllDemoData = () => {
    localStorage.clear();
    setExpenses(INITIAL_EXPENSES);
    setRevenues(INITIAL_REVENUES);
    setInvoices(INITIAL_INVOICES);
    setBalancetes(INITIAL_BALANCETES);
    setDecisions(INITIAL_DECISIONS);
    setAssemblies(INITIAL_ASSEMBLIES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setDocuments(INITIAL_DOCUMENTS);
    setResidents(INITIAL_RESIDENTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setMaintenanceRequests(INITIAL_MAINTENANCE);
    setReservations(INITIAL_RESERVATIONS);
    setTimeline(INITIAL_TIMELINE);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  // Computeds
  const totalRevenuesAll = revenues.reduce((acc, r) => acc + r.amount, 0);
  const totalExpensesPaid = expenses.filter((e) => e.status === 'Pago').reduce((acc, e) => acc + e.amount, 0);
  const currentBalance = totalRevenuesAll - totalExpensesPaid + 100000; // Starting reserve baseline

  const currentMonthPeriod = '2026-10';
  const totalExpensesCurrentMonth = expenses
    .filter((e) => e.monthPeriod === currentMonthPeriod)
    .reduce((acc, e) => acc + e.amount, 0);

  const totalRevenuesCurrentMonth = revenues
    .filter((r) => r.monthPeriod === currentMonthPeriod)
    .reduce((acc, r) => acc + r.amount, 0);

  const delinquentInvoices = invoices.filter((i) => i.status === 'Atrasado');
  const delinquentUnitsCount = delinquentInvoices.length;
  const delinquentTotalAmount = delinquentInvoices.reduce((acc, i) => acc + i.amount, 0);
  const delinquencyRate = (delinquentUnitsCount / condominium.totalUnits) * 100;

  return (
    <CondoContext.Provider
      value={{
        condominium,
        expenses,
        revenues,
        invoices,
        balancetes,
        decisions,
        assemblies,
        announcements,
        documents,
        residents,
        units,
        suppliers,
        maintenanceRequests,
        reservations,
        timeline,
        auditLogs,
        notifications,
        payInvoice,
        addExpense,
        updateExpense,
        deleteExpense,
        addRevenue,
        castVote,
        createDecision,
        closeBalancete,
        reopenBalancete,
        createAnnouncement,
        createAssembly,
        uploadDocument,
        createMaintenance,
        updateMaintenanceStatus,
        createReservation,
        cancelReservation,
        addResident,
        addSupplier,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllDemoData,
        currentBalance,
        totalExpensesCurrentMonth,
        totalRevenuesCurrentMonth,
        delinquentUnitsCount,
        delinquentTotalAmount,
        delinquencyRate,
      }}
    >
      {children}
    </CondoContext.Provider>
  );
};

export const useCondo = () => {
  const context = useContext(CondoContext);
  if (!context) {
    throw new Error('useCondo must be used within a CondoProvider');
  }
  return context;
};
