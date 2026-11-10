import React, { useState } from 'react';

const STATUS_BADGES = {
  SCHEDULED: { bg: 'bg-sky-500/20', text: 'text-sky-300', border: 'border-sky-500/30', label: 'Programada' },
  IN_PROGRESS: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30', label: 'En Consulta' },
  COMPLETED: { bg: 'bg-slate-700/50', text: 'text-slate-300', border: 'border-slate-600', label: 'Completada' },
  CANCELLED: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30', label: 'Cancelada' },
};

export default function AppointmentsView() {
  const [filterVet, setFilterVet] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('2026-11-09');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeConsultationModal, setActiveConsultationModal] = useState(null);

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
      clinical_notes: 'Paciente con peso 28.5 kg, signos vitales normales. Se administró vacuna séxtuple.',
    },
    {
      id: 'apt-2',
      patient_name: 'Luna',
      species: 'Felino (Siamés)',
      owner_name: 'Jorge Saldívar',
      owner_phone: '55 8765 4321',
      vet_name: 'Dra. Miriam Castro',
      scheduled_time: '10:30 AM',
      duration: '45 min',
      reason: 'Revisión otitis y limpieza auricular',
      status: 'IN_PROGRESS',
      clinical_notes: 'Secreción ceruminosa en oído izquierdo. Se realiza limpieza y se recetan gotas.',
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
      clinical_notes: '',
    },
  ]);

  // Formulario nueva cita
  const [newApt, setNewApt] = useState({
    patient_name: '',
    species: 'Canino',
    owner_name: '',
    owner_phone: '',
    vet_name: 'Dr. Roberto Mendoza',
    scheduled_time: '14:00',
    reason: '',
    duration: '30 min'
  });

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    if (!newApt.patient_name || !newApt.owner_name) {
      alert('Por favor indica nombre de la mascota y del tutor');
      return;
    }

    const created = {
      id: `apt-${Date.now()}`,
      patient_name: newApt.patient_name,
      species: newApt.species,
      owner_name: newApt.owner_name,
      owner_phone: newApt.owner_phone || '55 0000 0000',
      vet_name: newApt.vet_name,
      scheduled_time: newApt.scheduled_time,
      duration: newApt.duration,
      reason: newApt.reason || 'Consulta médica general',
      status: 'SCHEDULED',
      clinical_notes: ''
    };

    setAppointments([...appointments, created]);
    setIsModalOpen(false);
    setNewApt({
      patient_name: '',
      species: 'Canino',
      owner_name: '',
      owner_phone: '',
      vet_name: 'Dr. Roberto Mendoza',
      scheduled_time: '14:00',
      reason: '',
      duration: '30 min'
    });
  };

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleSaveConsultationNotes = (e) => {
    e.preventDefault();
    if (!activeConsultationModal) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === activeConsultationModal.id ? activeConsultationModal : a))
    );
    alert('Consulta y expediente guardados exitosamente.');
    setActiveConsultationModal(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header con botón para agendar consulta */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-7 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold mb-2">
            <span>📅</span> AGENDA CLÍNICA & CONSULTAS MÉDICAS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Consultas Médicas & Citas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Programa consultas, recibe a los pacientes y genera notas clínicas inmediatas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-[#0EA5E9] to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white rounded-2xl text-xs font-extrabold transition shadow-lg shadow-sky-500/25 flex items-center gap-2"
        >
          <span>➕</span> Agendar / Iniciar Consulta
        </button>
      </div>

      {/* Controles de filtro */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fecha:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Médico:</label>
          <select
            value={filterVet}
            onChange={(e) => setFilterVet(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          >
            <option value="ALL">Todos los Médicos</option>
            <option value="Dr. Roberto Mendoza">Dr. Roberto Mendoza</option>
            <option value="Dra. Miriam Castro">Dra. Miriam Castro</option>
          </select>
        </div>
      </div>

      {/* Lista de Citas & Consultas */}
      <div className="space-y-3.5">
        {appointments
          .filter((apt) => filterVet === 'ALL' || apt.vet_name === filterVet)
          .map((apt) => {
            const badge = STATUS_BADGES[apt.status] || STATUS_BADGES.SCHEDULED;
            return (
              <div
                key={apt.id}
                className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 hover:border-sky-500/30 transition shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center shrink-0">
                    <span className="text-xs font-black text-white">{apt.scheduled_time.split(' ')[0]}</span>
                    <span className="text-[10px] text-sky-400 font-bold">{apt.scheduled_time.split(' ')[1] || 'HRS'}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{apt.patient_name}</h3>
                      <span className="text-xs text-slate-400">&bull; {apt.species}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Tutor: <span className="font-semibold text-white">{apt.owner_name}</span> &bull; Tel: <span className="font-mono text-emerald-400">{apt.owner_phone}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1 bg-white/[0.02] p-2 rounded-xl border border-white/5">
                      <strong className="text-slate-300">Motivo de Consulta:</strong> {apt.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white">{apt.vet_name}</p>
                    <p className="text-[10px] text-slate-400">Médico Responsable</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveConsultationModal(apt)}
                      className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>📝</span> Expediente
                    </button>

                    {apt.status === 'SCHEDULED' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'IN_PROGRESS')}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition"
                      >
                        Pasar a Consulta
                      </button>
                    )}

                    {apt.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'COMPLETED')}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
                      >
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Modal Agendar Nueva Consulta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-black text-white">Agendar Nueva Consulta</h2>
                <p className="text-xs text-slate-400">Programa la cita médica y asigna al especialista.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Mascota *</label>
                  <input
                    type="text"
                    required
                    value={newApt.patient_name}
                    onChange={(e) => setNewApt({ ...newApt, patient_name: e.target.value })}
                    placeholder="Ej. Bruno"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Especie</label>
                  <input
                    type="text"
                    value={newApt.species}
                    onChange={(e) => setNewApt({ ...newApt, species: e.target.value })}
                    placeholder="Ej. Canino (Labrador)"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Tutor *</label>
                  <input
                    type="text"
                    required
                    value={newApt.owner_name}
                    onChange={(e) => setNewApt({ ...newApt, owner_name: e.target.value })}
                    placeholder="Ej. Patricia Morales"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={newApt.owner_phone}
                    onChange={(e) => setNewApt({ ...newApt, owner_phone: e.target.value })}
                    placeholder="55 1234 5678"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Médico Veterinario</label>
                  <select
                    value={newApt.vet_name}
                    onChange={(e) => setNewApt({ ...newApt, vet_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                  >
                    <option value="Dr. Roberto Mendoza">Dr. Roberto Mendoza</option>
                    <option value="Dra. Miriam Castro">Dra. Miriam Castro</option>
                    <option value="Dra. Elena Ruiz (Cirugía)">Dra. Elena Ruiz (Cirugía)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora Programada</label>
                  <input
                    type="text"
                    value={newApt.scheduled_time}
                    onChange={(e) => setNewApt({ ...newApt, scheduled_time: e.target.value })}
                    placeholder="Ej. 14:30 PM"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Motivo de la Cita / Síntomas</label>
                <textarea
                  rows="3"
                  value={newApt.reason}
                  onChange={(e) => setNewApt({ ...newApt, reason: e.target.value })}
                  placeholder="Ej. Vómito recurrente desde ayer por la tarde, decaído..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0EA5E9] hover:bg-sky-600 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-sky-500/25"
                >
                  Confirmar y Agendar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Notas Clínicas & Expediente de la Consulta */}
      {activeConsultationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  EXPEDIENTE CLÍNICO DE CONSULTA
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  Consulta de {activeConsultationModal.patient_name}
                </h2>
                <p className="text-xs text-slate-400">
                  Tutor: {activeConsultationModal.owner_name} &bull; Atiende: {activeConsultationModal.vet_name}
                </p>
              </div>
              <button onClick={() => setActiveConsultationModal(null)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConsultationNotes} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Motivo Original de Consulta</label>
                <input
                  type="text"
                  value={activeConsultationModal.reason}
                  onChange={(e) => setActiveConsultationModal({ ...activeConsultationModal, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notas de Diagnóstico, Anamnesis y Tratamiento Médico
                </label>
                <textarea
                  rows="5"
                  value={activeConsultationModal.clinical_notes || ''}
                  onChange={(e) => setActiveConsultationModal({ ...activeConsultationModal, clinical_notes: e.target.value })}
                  placeholder="Detallar temperatura, constantes fisiológicas, diagnóstico presuntivo y fármacos administrados..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                />
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    const msg = `Hola ${activeConsultationModal.owner_name}, la consulta de ${activeConsultationModal.patient_name} ha sido registrada con éxito en Altus PetCloud. Indicaciones: ${activeConsultationModal.clinical_notes || 'Revisión periódica recomendada.'}`;
                    window.open(`https://wa.me/52${activeConsultationModal.owner_phone.replace(/\s+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1.5"
                >
                  <span>💬</span> Enviar Resumen por WhatsApp
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveConsultationModal(null)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-emerald-500/25"
                  >
                    Guardar Expediente
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
