import React from 'react';

export default function DashboardView({ onNavigate }) {
  const metrics = [
    {
      label: 'Citas Hoy',
      value: '18',
      change: '+12%',
      subtext: '4 pendientes de ingreso',
      trend: 'up',
      icon: '📅',
      gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400'
    },
    {
      label: 'Pacientes Atendidos',
      value: '142',
      change: '+8.4%',
      subtext: 'Acumulado del mes',
      trend: 'up',
      icon: '🐾',
      gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400'
    },
    {
      label: 'Ingresos del Día',
      value: '$18,450',
      change: '+15.3%',
      subtext: 'POS & Consultas cerradas',
      trend: 'up',
      icon: '💳',
      gradient: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400'
    },
    {
      label: 'Stock en Alerta',
      value: '3 Items',
      change: 'Crítico',
      subtext: 'Fármacos por agotarse',
      alert: true,
      icon: '⚠️',
      gradient: 'from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-400'
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Banner Principal Hero con Gradiente y Acciones Rápidas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#162238] to-[#0A101D] border border-white/10 p-7 md:p-9 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SISTEMA OPERATIVO CLÍNICO &bull; CLOUD 2.0
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Panel de Control General
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Monitoreo clínico, ventas en caja y hospitalización en tiempo real. Desarrollado con alta tecnología por <span className="text-emerald-400 font-semibold">Altus MKT Digital</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate?.('appointments')}
              className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/90 text-white border border-white/10 rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-2"
            >
              <span>📅</span> Ver Calendario
            </button>
            <button
              onClick={() => onNavigate?.('clinical')}
              className="px-5 py-2.5 bg-[#0EA5E9] hover:bg-sky-500 text-white rounded-2xl text-xs font-bold transition shadow-lg shadow-sky-500/20 flex items-center gap-2"
            >
              <span>🏥</span> Kardex & Hospital
            </button>
            <button
              onClick={() => onNavigate?.('pos')}
              className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-2xl text-xs font-extrabold transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <span>💳</span> Cobrar en POS
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Métricas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((kpi, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-6 bg-slate-900/60 backdrop-blur-xl border ${kpi.gradient} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden`}
          >
            <div className="flex justify-between items-start">
              <span className="text-2xl p-2.5 rounded-2xl bg-white/5 border border-white/10">{kpi.icon}</span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold tracking-wide ${
                  kpi.alert
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {kpi.change}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-3xl font-black text-white mt-1 tracking-tight">{kpi.value}</h3>
              <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                {kpi.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sección Doble: Pacientes Activos & Kardex Farmacológico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pacientes en Espera / En Consulta */}
        <div className="lg:col-span-8 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-7 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🩺</span> Flujo de Pacientes en Consulta
              </h2>
              <p className="text-xs text-slate-400">Atención en piso y sala de espera hoy</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-white/5 rounded-full text-slate-300 border border-white/10">
              3 Pacientes activos
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Max (Golden Retriever)', owner: 'Ana Martínez', time: '09:00 AM', status: 'En Consulta', vet: 'Dr. Roberto Mendoza', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
              { name: 'Luna (Gato Siamés)', owner: 'Jorge Saldívar', time: '10:30 AM', status: 'En Espera', vet: 'Dra. Miriam Castro', badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
              { name: 'Rocky (Bulldog Francés)', owner: 'Paola Ortiz', time: '12:00 PM', status: 'Cita Agendada', vet: 'Spa & Baño Hipoalergénico', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
            ].map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-base text-slate-300 border border-white/10">
                    🐾
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">
                      Tutor: <span className="text-slate-300">{p.owner}</span> &bull; {p.vet}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${p.badgeColor}`}>
                    {p.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoreo Rápido Kardex */}
        <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🏥</span> Próximas Dosis
              </h2>
              <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                Kardex
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Aplicaciones farmacológicas hospitalarias prioritarias.
            </p>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white text-sm">Toby (Canino)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-bold text-xs">14:00 hrs</span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">Cefalexina 250mg &bull; Vía IV</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Jaula 02 &bull; Dr. Roberto Mendoza</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white text-sm">Mimi (Felino)</span>
                  <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-bold text-xs">16:30 hrs</span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">Meloxicam 0.2mg/kg &bull; Vía SC</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Jaula 04 &bull; Dra. Miriam Castro</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              Altus PetCloud &bull; High Reliability Architecture
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
