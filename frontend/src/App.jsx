import React, { useState } from 'react';
import DashboardView from './components/dashboard/DashboardView';
import AppointmentsView from './components/appointments/AppointmentsView';
import PosView from './components/pos/PosView';
import LoginModal from './components/auth/LoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainAppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, hasRole, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Sidebar de Navegación Lateral (Oculto en impresión) */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-white p-5 flex flex-col justify-between print:hidden">
        <div>
          {/* Logotipo y Branding Corporativo Altus PetCloud */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#0EA5E9] flex items-center justify-center font-bold text-white shadow-md text-lg">
              🐾
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">Altus PetCloud</h1>
              <p className="text-[10px] text-slate-400 font-medium">By Altus MKT Digital</p>
            </div>
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
          </nav>
        </div>

        {/* Perfil del Usuario Activo & Switch de Rol */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-white">{user?.full_name || 'Invitado'}</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{user?.role || 'SIN SESIÓN'}</p>
            </div>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition"
              title="Cambiar usuario o rol"
            >
              Cambiar
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-x-hidden">
        {currentView === 'dashboard' && <DashboardView onNavigate={(view) => setCurrentView(view)} />}
        {currentView === 'appointments' && <AppointmentsView />}
        {currentView === 'pos' && hasRole('ADMIN', 'RECEPTIONIST') && <PosView />}
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

