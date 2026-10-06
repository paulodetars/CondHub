import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCondo } from '../context/CondoContext';
import { useToast } from '../components/ui/Toast';
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Crown,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const LandingLoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const { condominium } = useCondo();
  const { showToast } = useToast();

  const [email, setEmail] = useState('morador@condohub.demo');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Erro ao realizar login.');
      } else {
        showToast('Login realizado com sucesso!', 'Bem-vindo ao CondoHub.', 'success');
      }
    }, 400);
  };

  const handleQuickLogin = (role: 'morador' | 'sindico' | 'admin') => {
    switchDemoRole(role);
    showToast('Acesso de Demonstração Ativado', `Logado como ${role.toUpperCase()}`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-5 border-b border-slate-800 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            C
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block leading-tight">
              CondoHub
            </span>
            <span className="text-xs text-purple-400 font-medium tracking-wide">
              Gestão inteligente. Transparência de verdade.
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-400" />
          <span>{condominium.name} ({condominium.city}/{condominium.state})</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Story & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Governança Condominial de Próxima Geração</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Transparência total e controle absoluto em um só lugar.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Tenha financeiro auditado, prestação de contas mensal, boletos com PIX instantâneo,
              decisões democráticas online e comunicação integrada para moradores, síndicos e
              administradoras.
            </p>

            {/* Quick Demo Access Roles Box */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-3">
                Acesso Rápido para Apresentação (1 Clique)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Morador */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('morador')}
                  className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/80 rounded-xl p-3.5 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <User className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      Demonstração
                    </span>
                  </div>
                  <strong className="text-sm font-bold text-white block">Morador</strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Carlos E. Silva · Apto 302-B
                  </span>
                  <div className="text-[10px] text-purple-300 mt-2 font-medium flex items-center gap-1">
                    <span>Entrar como Morador</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Síndico */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('sindico')}
                  className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/80 rounded-xl p-3.5 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      Demonstração
                    </span>
                  </div>
                  <strong className="text-sm font-bold text-white block">Síndico</strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Roberto Albuquerque
                  </span>
                  <div className="text-[10px] text-purple-300 mt-2 font-medium flex items-center gap-1">
                    <span>Entrar como Síndico</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Administradora */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/80 rounded-xl p-3.5 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Building className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      Demonstração
                    </span>
                  </div>
                  <strong className="text-sm font-bold text-white block">Administradora</strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Dra. Helena Castro (Aurora)
                  </span>
                  <div className="text-[10px] text-purple-300 mt-2 font-medium flex items-center gap-1">
                    <span>Acesso Completo</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Standard Login Card */}
          <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Entrar na Plataforma</h2>
              <p className="text-xs text-slate-500 mt-1">
                Acesse com seu e-mail e credenciais de acesso seguro.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="morador@condohub.demo"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Senha</label>
                  <button
                    type="button"
                    onClick={() =>
                      showToast('Recuperação de Senha', 'Link de redefinição enviado para seu e-mail.', 'info')
                    }
                    className="text-[11px] text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-9 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 absolute right-3 top-2.5 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                  />
                  <span>Lembrar meu acesso</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no CondoHub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Senha padrão de demonstração para todos os perfis: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">123456</code>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-800 text-center text-xs text-slate-500">
        CondoHub © 2026 · Plataforma Inteligente de Gestão e Transparência Condominial.
      </footer>
    </div>
  );
};
