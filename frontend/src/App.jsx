import React, { useState } from 'react';
import DashboardView from './components/dashboard/DashboardView';
import AppointmentsView from './components/appointments/AppointmentsView';
import PosView from './components/pos/PosView';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
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

          {/* Menú de Módulos */}
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
          </nav>
        </div>

        {/* Perfil del Usuario Activo */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-white">Dra. Miriam Castro</p>
            <p className="text-[10px] text-slate-400">Veterinario Administrador</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-x-hidden">
        {currentView === 'dashboard' && <DashboardView onNavigate={(view) => setCurrentView(view)} />}
        {currentView === 'appointments' && <AppointmentsView />}
        {currentView === 'pos' && <PosView />}
      </main>
    </div>
  );
}
