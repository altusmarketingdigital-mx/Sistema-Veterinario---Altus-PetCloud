import React, { useState } from 'react';

const STATUS_BADGES = {
  SCHEDULED: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', label: 'Programada' },
  IN_PROGRESS: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'En Consulta' },
  COMPLETED: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', label: 'Completada' },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Cancelada' },
};

export default function AppointmentsView() {
  const [filterVet, setFilterVet] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('2026-11-09');

  const [appointments, setAppointments] = useState([
    {
      id: 'apt-1',
      patient_name: 'Max',
      species: 'Canino (Golden Retriever)',
      owner_name: 'Ana Martínez',
      owner_phone: '55 1234 5678',
      vet_name: 'Dr. Roberto Mendoza',
      scheduled_time: '09:00 AM',
      duration: '30 min',
      reason: 'Vacunación Séxtuple anual y control de peso',
      status: 'COMPLETED',
    },
    {
      id: 'apt-2',
      patient_name: 'Luna',
      species: 'Felino (Siamés)',
      owner_name: 'Jorge Saldivar',
      owner_phone: '55 8765 4321',
      vet_name: 'Dra. Miriam Castro',
      scheduled_time: '10:30 AM',
      duration: '45 min',
      reason: 'Revisión otitis y limpieza auricular',
      status: 'IN_PROGRESS',
    },
    {
      id: 'apt-3',
      patient_name: 'Rocky',
      species: 'Canino (Bulldog Francés)',
      owner_name: 'Paola Ortiz',
      owner_phone: '55 4567 8901',
      vet_name: 'Dr. Roberto Mendoza',
      scheduled_time: '12:00 PM',
      duration: '30 min',
      reason: 'Sesión de Spa Canino y corte de uñas',
      status: 'SCHEDULED',
    },
    {
      id: 'apt-4',
      patient_name: 'Simba',
      species: 'Felino (Persa)',
      owner_name: 'Elena Morales',
      owner_phone: '55 2345 6789',
      vet_name: 'Dra. Miriam Castro',
      scheduled_time: '02:00 PM',
      duration: '45 min',
      reason: 'Seguimiento de tratamiento renal',
      status: 'SCHEDULED',
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Agenda de Citas & Consultorio</h1>
          <p className="text-sm text-slate-500">Gestión de turnos médicos y spa canino en tiempo real.</p>
        </div>
        <button className="px-4 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-medium rounded-xl text-sm shadow-sm transition flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Cita
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Veterinario:</label>
          <select
            value={filterVet}
            onChange={(e) => setFilterVet(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          >
            <option value="ALL">Todos los profesionales</option>
            <option value="Dra. Miriam Castro">Dra. Miriam Castro</option>
            <option value="Dr. Roberto Mendoza">Dr. Roberto Mendoza</option>
          </select>
        </div>
      </div>

      {/* Lista / Timeline de Citas */}
      <div className="grid grid-cols-1 gap-4">
        {appointments
          .filter((apt) => filterVet === 'ALL' || apt.vet_name === filterVet)
          .map((apt) => {
            const badge = STATUS_BADGES[apt.status] || STATUS_BADGES.SCHEDULED;
            return (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Horario y Paciente */}
                <div className="flex items-start gap-4">
                  <div className="text-center px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 min-w-[85px]">
                    <span className="block text-sm font-bold text-[#0F172A]">{apt.scheduled_time}</span>
                    <span className="block text-[11px] text-slate-400 font-medium">{apt.duration}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#0F172A]">{apt.patient_name}</h3>
                      <span className="text-xs text-slate-400">({apt.species})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tutor: <span className="font-semibold text-slate-700">{apt.owner_name}</span> &bull; Tel: {apt.owner_phone}
                    </p>
                    <p className="text-xs text-[#0EA5E9] font-medium mt-1">
                      Motivo: <span className="text-slate-600 font-normal">{apt.reason}</span>
                    </p>
                  </div>
                </div>

                {/* Asignación y Estado */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-700">{apt.vet_name}</p>
                    <p className="text-[11px] text-slate-400">Médico asignado</p>
                  </div>

                  {/* Badge de Estado */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>

                  {/* Acciones Rápidas */}
                  <div className="flex items-center gap-1.5">
                    {apt.status === 'SCHEDULED' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'IN_PROGRESS')}
                        className="px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                      >
                        Iniciar
                      </button>
                    )}
                    {apt.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'COMPLETED')}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                      >
                        Finalizar
                      </button>
                    )}
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
