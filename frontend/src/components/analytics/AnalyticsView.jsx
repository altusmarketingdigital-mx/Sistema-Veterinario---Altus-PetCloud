import React, { useState } from 'react';

export default function AnalyticsView() {
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Business Intelligence & Analíticas</h1>
          <p className="text-sm text-slate-500">Métricas de rentabilidad clínica, ventas del POS y productividad médica.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {['today', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                dateRange === range ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {range === 'today' ? 'Hoy' : range === 'week' ? 'Semana' : range === 'month' ? 'Este Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas KPI de Rendimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Facturación Mensual', val: '$148,920.00', sub: '+18.4% vs mes anterior', icon: '💰', alert: false },
          { label: 'Ticket Promedio', val: '$840.50', sub: '+6.2% eficiencia en mostrador', icon: '🧾', alert: false },
          { label: 'Consultas & Citas', val: '214', sub: '92% asistencia efectiva', icon: '🩺', alert: false },
          { label: 'Margen de Utilidad', val: '38.2%', sub: 'Farmacia & Servicios', icon: '📈', alert: false },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
              <span>{card.label}</span>
              <span className="text-lg">{card.icon}</span>
            </div>
            <p className="text-2xl font-black text-[#0F172A] mt-2">{card.val}</p>
            <p className="text-xs text-[#10B981] font-semibold mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Grid Principal: Métodos de Pago & Top Servicios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribución por Métodos de Pago */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#0F172A]">Distribución por Método de Pago</h2>
          <div className="space-y-3">
            {[
              { name: 'Tarjetas de Débito / Crédito', percent: '54%', amount: '$80,416.80', color: 'bg-[#0EA5E9]' },
              { name: 'Efectivo en Mostrador', percent: '32%', amount: '$47,654.40', color: 'bg-[#10B981]' },
              { name: 'Transferencias SPEI', percent: '14%', amount: '$20,848.80', color: 'bg-indigo-500' },
            ].map((method, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{method.name} ({method.percent})</span>
                  <span>{method.amount}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${method.color}`} style={{ width: method.percent }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
            <span>Corte actualizado</span>
            <span>Total: $148,920.00 MXN</span>
          </div>
        </div>

        {/* Top 5 Servicios y Medicamentos Más Rentables */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A] mb-3">Top Servicios & Fármacos de Mayor Demanda</h2>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { rank: '01', name: 'Consulta Médica General & Vacuna Séxtuple', units: 82, revenue: '$36,900.00', cat: 'Servicio Clínico' },
              { rank: '02', name: 'Baño y Estética Spa Canino (Talla Med/Gde)', units: 68, revenue: '$23,800.00', cat: 'Grooming & Spa' },
              { rank: '03', name: 'Alimento Pro Plan Adulto Raza Mediana 3kg', units: 28, revenue: '$18,200.00', cat: 'Nutrición' },
              { rank: '04', name: 'NexGard Spectra Antiparasitario 10-20kg', units: 45, revenue: '$14,400.00', cat: 'Farmacia' },
              { rank: '05', name: 'Limpieza Dental por Ultrasonido con Sedación', units: 6, revenue: '$10,800.00', cat: 'Cirugía / Especialidad' },
            ].map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-400 text-sm">{item.rank}</span>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.cat} &bull; {item.units} aplicaciones/ventas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#0F172A]">{item.revenue}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Rentable</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
