import React, { useState } from 'react';
import DashboardView from './components/dashboard/DashboardView';
import AppointmentsView from './components/appointments/AppointmentsView';
import PatientsView from './components/patients/PatientsView';
import UsersView from './components/users/UsersView';
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

  // Si no hay usuario autenticado, mostrar LoginPage minimalista
  if (!user) {
    return <LoginPage />;
  }

  const branches = [
    { id: 'br-01', name: 'Sucursal Matriz (Insurgentes)', code: 'SUC-01', phone: '(55) 8421-9900' },
    { id: 'br-02', name: 'Sucursal Coyoacán Spa', code: 'SUC-02', phone: '(55) 5533-1122' },
    { id: 'br-03', name: 'Hospital 24/7 Del Valle', code: 'SUC-03', phone: '(55) 4411-8899' },
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Resumen', icon: '📊', roles: ['ALL'] },
    { id: 'appointments', label: 'Citas & Consultas', icon: '📅', roles: ['ALL'] },
    { id: 'patients', label: 'Pacientes', icon: '🐾', roles: ['ALL'] },
    { id: 'clinical', label: 'Hospital & Recetas', icon: '🏥', roles: ['ADMIN', 'VETERINARIAN'] },
    { id: 'pos', label: 'Punto de Venta (POS)', icon: '💳', roles: ['ADMIN', 'RECEPTIONIST'] },
    { id: 'users', label: 'Personal & Roles', icon: '👥', roles: ['ADMIN'] },
    { id: 'analytics', label: 'Reportes & BI', icon: '📈', roles: ['ADMIN'] },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-white">
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} />

      {/* Sidebar Estilo Apple / Minimalista Blanco */}
      <aside className="w-full md:w-64 bg-white border-r border-black/[0.06] p-6 flex flex-col justify-between print:hidden">
        <div>
          {/* Logo y Nombre de la Aplicación */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981] flex items-center justify-center text-white text-xl shadow-sm">
              🐾
            </div>
            <div>
              <h1 className="font-bold text-sm text-[#1D1D1F] tracking-tight">Altus PetCloud</h1>
              <p className="text-[11px] text-[#86868B]">Veterinary OS</p>
            </div>
          </div>

          {/* Selector de Sucursal */}
          <div className="mb-6 p-3 bg-[#F5F5F7] rounded-2xl">
            <label className="block text-[10px] font-semibold text-[#86868B] uppercase tracking-wider mb-1">
              Sucursal
            </label>
            <select
              value={currentBranch?.id}
              onChange={(e) => {
                const selected = branches.find((b) => b.id === e.target.value);
                if (selected) switchBranch(selected);
              }}
              className="w-full bg-white text-[#1D1D1F] text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Navegación Principal */}
          <nav className="space-y-1">
            {navigationItems
              .filter((item) => item.roles.includes('ALL') || hasRole(...item.roles))
              .map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#1D1D1F] text-white shadow-sm'
                        : 'text-[#515154] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </nav>

          {/* Acceso Rápido WhatsApp */}
          <div className="mt-6 pt-4 border-t border-black/[0.04]">
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition"
            >
              <span>💬</span> WhatsApp Tutor
            </button>
          </div>
        </div>

        {/* Perfil del Usuario Activo */}
        <div className="pt-4 border-t border-black/[0.06] space-y-2">
          {user && (
            <>
              <div className="flex items-center justify-between text-xs">
                <div className="truncate pr-2">
                  <p className="font-semibold text-[#1D1D1F] truncate">{user.full_name}</p>
                  <p className="text-[10px] text-[#86868B] font-medium">{user.role}</p>
                </div>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="shrink-0 text-[11px] font-semibold text-[#0071E3] hover:underline"
                >
                  Cambiar
                </button>
              </div>

              <button
                onClick={logout}
                className="w-full py-2 px-3 bg-[#F5F5F7] hover:bg-rose-50 text-[#86868B] hover:text-rose-600 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Cerrar Sesión</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        {currentView === 'dashboard' && <DashboardView onNavigate={(view) => setCurrentView(view)} />}
        {currentView === 'appointments' && <AppointmentsView />}
        {currentView === 'patients' && <PatientsView />}
        {currentView === 'users' && hasRole('ADMIN') && <UsersView />}
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
