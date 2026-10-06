export type UserRole = 'morador' | 'sindico' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone: string;
  unit?: string;
  block?: string;
  condominiumId: string;
}

export interface Condominium {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalUnits: number;
  totalBlocks: number;
  cnpj: string;
  adminCompany: string;
  sindicoName: string;
  bankAccount: {
    bank: string;
    agency: string;
    account: string;
    pixKey: string;
  };
}

export type ExpenseCategory =
  | 'Água'
  | 'Energia'
  | 'Manutenção'
  | 'Limpeza'
  | 'Segurança'
  | 'Elevadores'
  | 'Jardinagem'
  | 'Funcionários'
  | 'Administração'
  | 'Obras'
  | 'Outros';

export type RevenueCategory =
  | 'Condomínio'
  | 'Multas'
  | 'Juros'
  | 'Aluguel'
  | 'Salão de Festas'
  | 'Outras Receitas';

export type PaymentMethod = 'Boleto' | 'PIX' | 'Transferência Bancária' | 'Débito Automático';

export type PaymentStatus = 'Pago' | 'Em aberto' | 'Atrasado' | 'Em negociação';

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  supplier: string;
  supplierCnpj?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  dueDate: string;
  paymentMethod: PaymentMethod;
  status: 'Pago' | 'Pendente' | 'Agendado';
  responsible: string;
  notes?: string;
  fiscalNumber?: string;
  documentUrl?: string;
  documentName?: string;
  monthPeriod: string; // YYYY-MM
  locked?: boolean;
}

export interface Revenue {
  id: string;
  description: string;
  category: RevenueCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  origin: string;
  status: 'Confirmado' | 'Pendente';
  unit?: string;
  monthPeriod: string; // YYYY-MM
}

export interface Invoice {
  id: string;
  unit: string;
  block: string;
  residentName: string;
  residentEmail: string;
  monthReference: string; // e.g. "Outubro/2026"
  monthPeriod: string; // "2026-10"
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: PaymentStatus;
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  barcode: string;
  pixCopyPaste: string;
  fineAmount?: number;
  interestAmount?: number;
  items: {
    description: string;
    amount: number;
  }[];
}

export interface BalancetePeriod {
  id: string;
  period: string; // "2026-09"
  periodLabel: string; // "Setembro / 2026"
  totalRevenues: number;
  totalExpenses: number;
  previousBalance: number;
  finalBalance: number;
  status: 'Em aberto' | 'Fechado';
  closedAt?: string;
  closedBy?: string;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface DecisionPoll {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  status: 'Aberta' | 'Encerrada' | 'Aprovada' | 'Rejeitada';
  budgetEstimate?: number;
  options: PollOption[];
  totalVotes: number;
  eligibleVoters: number;
  votedUserIds: string[]; // user IDs who voted
  userVotes: Record<string, string>; // userId -> optionId
  attachmentName?: string;
}

export interface Assembly {
  id: string;
  title: string;
  type: 'Ordinária' | 'Extraordinária';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  status: 'Agendada' | 'Em andamento' | 'Concluída' | 'Cancelada';
  agenda: string[];
  minutesDocumentName?: string;
  minutesUrl?: string;
}

export type AnnouncementPriority = 'Normal' | 'Importante' | 'Urgente';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Aviso' | 'Manutenção' | 'Financeiro' | 'Assembleia' | 'Segurança' | 'Geral';
  priority: AnnouncementPriority;
  date: string;
  author: string;
  attachmentName?: string;
  readByUserIds: string[];
}

export interface CondoDocument {
  id: string;
  title: string;
  category:
    | 'Prestação de contas'
    | 'Notas fiscais'
    | 'Contratos'
    | 'Atas'
    | 'Regulamento'
    | 'Convenção'
    | 'Orçamentos'
    | 'Comprovantes'
    | 'Outros';
  uploadDate: string;
  fileSize: string;
  uploadedBy: string;
  fileName: string;
  monthReference?: string;
}

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  block: string;
  isOwner: boolean;
  status: 'Ativo' | 'Inativo';
  financialSituation: 'Em dia' | 'Inadimplente';
  avatar?: string;
}

export interface Unit {
  id: string;
  number: string;
  block: string;
  floor: number;
  ownerName: string;
  residentsCount: number;
  financialSituation: 'Em dia' | 'Inadimplente';
  status: 'Ocupado' | 'Vago' | 'Alugado';
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: ExpenseCategory;
  status: 'Ativo' | 'Em avaliação' | 'Inativo';
  totalPaid: number;
  contractUntil?: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  location: string;
  category: 'Hidráulica' | 'Elétrica' | 'Elevador' | 'Estrutural' | 'Pintura' | 'Área Comum' | 'Segurança';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  status: 'Aberto' | 'Em andamento' | 'Aguardando fornecedor' | 'Resolvido' | 'Cancelado';
  reportedBy: string;
  unit?: string;
  dateReported: string;
  deadline?: string;
  responsibleSupplier?: string;
  costEstimated?: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  areaName: 'Salão de Festas' | 'Espaço Gourmet' | 'Churrasqueira' | 'Academia' | 'Quadra Poliesportiva';
  date: string; // YYYY-MM-DD
  period: 'Manhã (08h - 12h)' | 'Tarde (13h - 17h)' | 'Noite (18h - 23h)' | 'Dia Todo (10h - 22h)';
  residentName: string;
  unit: string;
  status: 'Confirmada' | 'Pendente' | 'Cancelada';
  fee: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  module:
    | 'Financeiro'
    | 'Despesas'
    | 'Receitas'
    | 'Balancetes'
    | 'Cobranças'
    | 'Votações'
    | 'Comunicados'
    | 'Assembleias'
    | 'Documentos'
    | 'Manutenção'
    | 'Reservas'
    | 'Moradores'
    | 'Sistema';
  action: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'finance' | 'vote' | 'announcement' | 'maintenance' | 'document';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  category: 'finance' | 'announcement' | 'vote' | 'assembly' | 'maintenance' | 'balancete' | 'document';
  date: string;
  time: string;
  author: string;
  badgeText: string;
}
