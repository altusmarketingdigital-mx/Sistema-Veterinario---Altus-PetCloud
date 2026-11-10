import React from 'react';

export default function DashboardView({ onNavigate }) {
  const metrics = [
    {
      label: 'Citas para Hoy',
      value: '18',
      change: '+12%',
      subtext: '4 pendientes de atención',
      icon: '📅',
    },
    {
      label: 'Pacientes en el Mes',
      value: '142',
      change: '+8.4%',
      subtext: 'Expedientes activos',
      icon: '🐾',
    },
    {
      label: 'Ventas del Día',
      value: '$18,450',
      change: '+15.3%',
      subtext: 'POS y consultas cobradas',
      icon: '💳',
    },
    {
      label: 'Medicamentos Críticos',
      value: '3 Items',
      change: 'Revisar',
      subtext: 'Stock bajo en farmacia',
      alert: true,
      icon: '⚠️',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Resumen General
          </h1>
          <p className="text-sm text-[#86868B] mt-1">
            Hospital Veterinario Altus &bull; Panel de control en vivo
          </p>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('appointments')}
            className="px-4 py-2.5 bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-black/[0.08] rounded-2xl text-xs font-semibold shadow-sm transition"
          >
            Agenda de Citas
          </button>
          <button
            onClick={() => onNavigate?.('pos')}
            className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl text-xs font-semibold shadow-sm transition"
          >
            Nueva Venta (POS)
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Estilo Apple */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((kpi, idx) => (
          <div
            key={idx}
            className="apple-card p-6 apple-card-hover flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="w-10 h-10 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-lg">
                {kpi.icon}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  kpi.alert
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {kpi.change}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-xs font-medium text-[#86868B]">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mt-1 tracking-tight">
                {kpi.value}
              </h3>
              <p className="text-[11px] text-[#86868B] mt-1">{kpi.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Dos Columnas: Pacientes de Hoy y Kardex */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pacientes del Día */}
        <div className="lg:col-span-8 apple-card p-7">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-[#1D1D1F]">
                Flujo de Citas de Hoy
              </h2>
              <p className="text-xs text-[#86868B]">Pacientes agendados y en atención</p>
            </div>
            <button
              onClick={() => onNavigate?.('appointments')}
              className="text-xs font-semibold text-[#0071E3] hover:underline"
            >
              Ver todas &rarr;
            </button>
          </div>

          <div className="divide-y divide-black/[0.04]">
            {[
              { name: 'Max', breed: 'Golden Retriever', owner: 'Ana Martínez', time: '09:00 AM', status: 'En Consulta', vet: 'Dr. Roberto Mendoza' },
              { name: 'Luna', breed: 'Gato Siamés', owner: 'Jorge Saldívar', time: '10:30 AM', status: 'En Espera', vet: 'Dra. Miriam Castro' },
              { name: 'Rocky', breed: 'Bulldog Francés', owner: 'Paola Ortiz', time: '12:00 PM', status: 'Programada', vet: 'Spa Grooming' },
            ].map((p, i) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-lg">
                    🐾
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1D1D1F]">{p.name}</h4>
                    <p className="text-xs text-[#86868B]">
                      {p.breed} &bull; Tutor: {p.owner}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      p.status === 'En Consulta'
                        ? 'bg-emerald-50 text-emerald-700'
                        : p.status === 'En Espera'
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-[#F5F5F7] text-[#86868B]'
                    }`}
                  >
                    {p.status}
                  </span>
                  <p className="text-[11px] text-[#86868B] mt-1">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoreo de Hospitalización */}
        <div className="lg:col-span-4 apple-card p-7 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1D1D1F] mb-1">
              Hospital & Kardex
            </h2>
            <p className="text-xs text-[#86868B] mb-5">
              Próximas aplicaciones farmacológicas
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.02]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#1D1D1F]">Toby</span>
                  <span className="text-xs font-semibold text-[#0071E3] bg-white px-2 py-0.5 rounded-lg shadow-2xs">
                    14:00 hrs
                  </span>
                </div>
                <p className="text-xs text-emerald-700 font-medium mt-1">Cefalexina 250mg &bull; IV</p>
                <p className="text-[11px] text-[#86868B] mt-0.5">Jaula 02 &bull; Dr. Roberto Mendoza</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.02]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#1D1D1F]">Mimi</span>
                  <span className="text-xs font-semibold text-[#0071E3] bg-white px-2 py-0.5 rounded-lg shadow-2xs">
                    16:30 hrs
                  </span>
                </div>
                <p className="text-xs text-emerald-700 font-medium mt-1">Meloxicam 0.2mg/kg &bull; SC</p>
                <p className="text-[11px] text-[#86868B] mt-0.5">Jaula 04 &bull; Dra. Miriam Castro</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-black/[0.04] text-center">
            <span className="text-[11px] text-[#86868B]">
              Altus PetCloud &bull; Altus MKT Digital
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
