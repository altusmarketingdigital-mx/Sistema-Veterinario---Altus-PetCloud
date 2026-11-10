import React, { useState } from 'react';
import DashboardView from './components/dashboard/DashboardView';
import AppointmentsView from './components/appointments/AppointmentsView';
import PosView from './components/pos/PosView';
import ClinicalKardexView from './components/clinical/ClinicalKardexView';
import AnalyticsView from './components/analytics/AnalyticsView';
import WhatsAppModal from './components/crm/WhatsAppModal';
import LoginModal from './components/auth/LoginModal';
import LoginPage from './components/auth/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainAppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const { user, hasRole, currentBranch, switchBranch, logout } = useAuth();

  // Si no hay usuario autenticado (después de Cerrar Sesión), mostrar la Pantalla de Login completa
  if (!user) {
    return <LoginPage />;
  }

  const branches = [
    { id: 'br-01', name: 'Sucursal Matriz (Insurgentes)', code: 'SUC-01', phone: '(55) 8421-9900' },
    { id: 'br-02', name: 'Sucursal Coyoacán Spa', code: 'SUC-02', phone: '(55) 5533-1122' },
    { id: 'br-03', name: 'Hospital 24/7 Del Valle', code: 'SUC-03', phone: '(55) 4411-8899' },
  ];

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-white">
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} />

      {/* Sidebar de Navegación Lateral (Oculto en impresión) */}
      <aside className="w-full md:w-72 bg-[#0F172A]/90 backdrop-blur-2xl text-white p-6 flex flex-col justify-between border-r border-white/10 print:hidden relative z-20">
        <div>
          {/* Logotipo y Branding Corporativo Altus PetCloud */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#10B981] via-[#0EA5E9] to-[#6366F1] flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20 ring-2 ring-white/10 text-xl">
              🐾
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight text-white leading-tight">Altus PetCloud</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">By Altus MKT Digital</p>
            </div>
          </div>

          {/* Selector Rápido de Sucursal Multi-Tenant */}
          <div className="mb-7 p-3 bg-white/[0.04] rounded-2xl border border-white/10 backdrop-blur-md">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
              Sucursal Activa:
            </label>
            <select
              value={currentBranch?.id}
              onChange={(e) => {
                const selected = branches.find((b) => b.id === e.target.value);
                if (selected) switchBranch(selected);
              }}
              className="w-full bg-[#0B132B] text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#10B981] cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {currentBranch?.code} &bull; En Línea
              </span>
              <span className="text-slate-400">{currentBranch?.phone}</span>
            </div>
          </div>

          {/* Menú de Módulos con RBAC Condicional */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-white border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="text-base">📊</span> Dashboard General
            </button>

            {/* Accesible por Admin, Veterinario y Recepcionista */}
            <button
              onClick={() => setCurrentView('appointments')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                currentView === 'appointments'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-white border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="text-base">📅</span> Citas & Consultorio
            </button>

            {/* Accesible por Admin y Veterinario */}
            {hasRole('ADMIN', 'VETERINARIAN') && (
              <button
                onClick={() => setCurrentView('clinical')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  currentView === 'clinical'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-white border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className="text-base">🏥</span> Hospital & Recetas
              </button>
            )}

            {/* Restringido a Admin y Recepcionista */}
            {hasRole('ADMIN', 'RECEPTIONIST') && (
              <button
                onClick={() => setCurrentView('pos')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  currentView === 'pos'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-white border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className="text-base">💳</span> Punto de Venta (POS)
              </button>
            )}

            {/* Módulo de BI y Analíticas Exclusivo para Admin */}
            {hasRole('ADMIN') && (
              <button
                onClick={() => setCurrentView('analytics')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  currentView === 'analytics'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-sky-500/10 text-white border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className="text-base">📈</span> BI & Finanzas
              </button>
            )}
          </nav>

          {/* Botón Rápido de WhatsApp */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold transition shadow-sm"
            >
              <span>💬</span> Recordatorio WhatsApp
            </button>
          </div>
        </div>

        {/* Perfil del Usuario Activo, Switch de Rol y Cerrar Sesión */}
        <div className="pt-5 border-t border-white/10 space-y-3">
          {user ? (
            <>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                <div className="truncate pr-2">
                  <p className="font-bold text-white truncate">{user.full_name}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="shrink-0 text-[10px] font-bold px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
                  title="Cambiar rol rápido"
                >
                  Cambiar
                </button>
              </div>

              {/* Botón Cerrar Sesión */}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-200 rounded-2xl text-xs font-bold transition"
                title="Cerrar sesión actual"
              >
                <span>🚪</span> Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-slate-400 mb-2">Sin sesión activa</p>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full py-2.5 px-4 bg-[#10B981] hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold transition shadow-lg shadow-emerald-500/20"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Contenido Principal con Fondo Profundo y Efectos de Iluminación */}
      <main className="flex-1 overflow-x-hidden relative min-h-screen">
        <div className="fixed -top-40 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10">
          {currentView === 'dashboard' && <DashboardView onNavigate={(view) => setCurrentView(view)} />}
          {currentView === 'appointments' && <AppointmentsView />}
          {currentView === 'clinical' && hasRole('ADMIN', 'VETERINARIAN') && <ClinicalKardexView />}
          {currentView === 'pos' && hasRole('ADMIN', 'RECEPTIONIST') && <PosView />}
          {currentView === 'analytics' && hasRole('ADMIN') && <AnalyticsView />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

