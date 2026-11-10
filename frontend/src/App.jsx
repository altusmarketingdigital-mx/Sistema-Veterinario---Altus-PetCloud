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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} />

      {/* Sidebar de Navegación Lateral (Oculto en impresión) */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-white p-5 flex flex-col justify-between print:hidden">
        <div>
          {/* Logotipo y Branding Corporativo Altus PetCloud */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#0EA5E9] flex items-center justify-center font-bold text-white shadow-md text-lg">
              🐾
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">Altus PetCloud</h1>
              <p className="text-[10px] text-slate-400 font-medium">By Altus MKT Digital</p>
            </div>
          </div>

          {/* Selector Rápido de Sucursal Multi-Tenant */}
          <div className="mb-6 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Sucursal Activa:
            </label>
            <select
              value={currentBranch?.id}
              onChange={(e) => {
                const selected = branches.find((b) => b.id === e.target.value);
                if (selected) switchBranch(selected);
              }}
              className="w-full bg-[#0F172A] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {currentBranch?.code} &bull; En Línea
            </p>
          </div>

          {/* Menú de Módulos con RBAC Condicional */}
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                currentView === 'dashboard'
                  ? 'bg-slate-800 text-white border-l-4 border-[#10B981]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>📊</span> Dashboard General
            </button>

            {/* Accesible por Admin, Veterinario y Recepcionista */}
            <button
              onClick={() => setCurrentView('appointments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                currentView === 'appointments'
                  ? 'bg-slate-800 text-white border-l-4 border-[#10B981]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>📅</span> Citas & Consultorio
            </button>

            {/* Accesible por Admin y Veterinario */}
            {hasRole('ADMIN', 'VETERINARIAN') && (
              <button
                onClick={() => setCurrentView('clinical')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentView === 'clinical'
                    ? 'bg-slate-800 text-white border-l-4 border-[#10B981]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>🏥</span> Hospital & Recetas
              </button>
            )}

            {/* Restringido a Admin y Recepcionista */}
            {hasRole('ADMIN', 'RECEPTIONIST') && (
              <button
                onClick={() => setCurrentView('pos')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentView === 'pos'
                    ? 'bg-slate-800 text-white border-l-4 border-[#10B981]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>💳</span> Punto de Venta (POS)
              </button>
            )}

            {/* Módulo de BI y Analíticas Exclusivo para Admin */}
            {hasRole('ADMIN') && (
              <button
                onClick={() => setCurrentView('analytics')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentView === 'analytics'
                    ? 'bg-slate-800 text-white border-l-4 border-[#10B981]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>📈</span> BI & Finanzas
              </button>
            )}
          </nav>

          {/* Botón Rápido de WhatsApp */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 text-emerald-400 rounded-xl text-xs font-bold transition"
            >
              <span>💬</span> Recordatorio WhatsApp
            </button>
          </div>
        </div>

        {/* Perfil del Usuario Activo, Switch de Rol y Cerrar Sesión */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          {user ? (
            <>
              <div className="flex items-center justify-between text-xs">
                <div className="truncate pr-2">
                  <p className="font-semibold text-white truncate">{user.full_name}</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{user.role}</p>
                </div>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="shrink-0 text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition"
                  title="Cambiar usuario o rol"
                >
                  Cambiar
                </button>
              </div>

              {/* Botón Cerrar Sesión */}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 hover:text-red-200 rounded-xl text-xs font-semibold transition"
                title="Cerrar sesión actual"
              >
                <span>🚪</span> Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-slate-400 mb-2">No has iniciado sesión</p>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full py-2 px-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-x-hidden">
        {currentView === 'dashboard' && <DashboardView onNavigate={(view) => setCurrentView(view)} />}
        {currentView === 'appointments' && <AppointmentsView />}
        {currentView === 'clinical' && hasRole('ADMIN', 'VETERINARIAN') && <ClinicalKardexView />}
        {currentView === 'pos' && hasRole('ADMIN', 'RECEPTIONIST') && <PosView />}
        {currentView === 'analytics' && hasRole('ADMIN') && <AnalyticsView />}
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

