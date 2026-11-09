import React from 'react';

export default function DashboardView({ onNavigate }) {
  const metrics = [
    { label: 'Citas Hoy', value: '18', change: '+12%', subtext: '4 pendientes' },
    { label: 'Pacientes Atendidos', value: '142', change: '+8%', subtext: 'Este mes' },
    { label: 'Ingresos del Día', value: '$18,450', change: '+15.3%', subtext: 'POS & Consultas' },
    { label: 'Alertas de Inventario', value: '3', change: '-1', subtext: 'Fármacos por agotar', alert: true },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Banner de Bienvenida */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0EA5E9] bg-sky-950/60 px-2.5 py-1 rounded-md">
            Altus PetCloud v1.0 &bull; Cloud SaaS
          </span>
          <h1 className="text-2xl font-bold mt-2">Panel de Control General</h1>
          <p className="text-sm text-slate-300">Resumen clínico y operativo en tiempo real de tu clínica veterinaria.</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => onNavigate?.('appointments')}
            className="px-4 py-2 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition"
          >
            Ver Citas
          </button>
          <button 
            onClick={() => onNavigate?.('pos')}
            className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition"
          >
            Abrir POS
          </button>
        </div>
      </div>

      {/* Tarjetas Métricas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>{kpi.label}</span>
              <span className={`px-2 py-0.5 rounded-full font-semibold ${kpi.alert ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#0F172A] mt-2">{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.subtext}</p>
          </div>
        ))}
      </div>

      {/* Sección Doble: Actividad Reciente & Kardex Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-4">Pacientes en Espera / En Consulta</h2>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'Max (Golden)', owner: 'Ana Martínez', time: '09:00 AM', status: 'En Consulta', vet: 'Dr. Roberto Mendoza' },
              { name: 'Luna (Siamés)', owner: 'Jorge Saldivar', time: '10:30 AM', status: 'En Espera', vet: 'Dra. Miriam Castro' },
              { name: 'Rocky (Bulldog)', owner: 'Paola Ortiz', time: '12:00 PM', status: 'Programada', vet: 'Spa Grooming' },
            ].map((p, i) => (
              <div key={i} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-[#0F172A]">{p.name}</p>
                  <p className="text-xs text-slate-400">Tutor: {p.owner} &bull; Asignado a: {p.vet}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-medium">
                    {p.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] mb-2">Hospitalización & Kardex</h2>
            <p className="text-xs text-slate-400 mb-4">Próximas aplicaciones farmacológicas programadas.</p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#0F172A]">Toby (Canino)</span>
                  <span className="text-[#0EA5E9] font-semibold">14:00 hrs</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Cefalexina 250mg / IV</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#0F172A]">Mimi (Felino)</span>
                  <span className="text-[#0EA5E9] font-semibold">16:30 hrs</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">Meloxicam 0.2mg/kg / SC</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-mono">Altus MKT Digital &bull; Cloud Infrastructure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
