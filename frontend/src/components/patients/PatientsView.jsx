import React, { useState } from 'react';

export default function PatientsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientForExpediente, setSelectedPatientForExpediente] = useState(null);

  // Lista de pacientes con datos relacionales del tutor y clínico
  const [patients, setPatients] = useState([
    {
      id: 'pat-1',
      name: 'Max',
      species: 'Canino',
      breed: 'Golden Retriever',
      gender: 'Macho',
      age: '3 años',
      weight: '28.5 kg',
      photo: '🐕',
      owner: {
        name: 'Ana Martínez',
        phone: '55 1234 5678',
        email: 'ana.martinez@gmail.com',
        address: 'Insurgentes Sur 1420, CDMX'
      },
      allergies: 'Ninguna conocida',
      chronic_diseases: 'Ninguna',
      last_visit: '2026-11-09',
      consultations_count: 5,
      records: [
        { date: '2026-11-09', reason: 'Vacunación Séxtuple y Desparasitación', vet: 'Dr. Roberto Mendoza', dx: 'Paciente sano y en peso óptimo' },
        { date: '2026-08-14', reason: 'Dermatitis leve por pulgas', vet: 'Dra. Miriam Castro', dx: 'Se prescribe Simparica y shampoo antiséptico' }
      ]
    },
    {
      id: 'pat-2',
      name: 'Luna',
      species: 'Felino',
      breed: 'Siamés',
      gender: 'Hembra',
      age: '2 años',
      weight: '3.8 kg',
      photo: '🐈',
      owner: {
        name: 'Jorge Saldívar',
        phone: '55 8765 4321',
        email: 'jorge.saldivar@outlook.com',
        address: 'Av. Coyoacán 880, CDMX'
      },
      allergies: 'Sensibilidad a penicilinas',
      chronic_diseases: 'Otitis recurrente',
      last_visit: '2026-11-09',
      consultations_count: 3,
      records: [
        { date: '2026-11-09', reason: 'Revisión otitis y limpieza auricular', vet: 'Dra. Miriam Castro', dx: 'Otitis externa bilateral tratada con gotas óticas' }
      ]
    },
    {
      id: 'pat-3',
      name: 'Rocky',
      species: 'Canino',
      breed: 'Bulldog Francés',
      gender: 'Macho',
      age: '1 año 4 meses',
      weight: '12.2 kg',
      photo: '🐶',
      owner: {
        name: 'Paola Ortiz',
        phone: '55 4567 8901',
        email: 'paola.ortiz@gmail.com',
        address: 'Del Valle Norte 312, CDMX'
      },
      allergies: 'Pollo / Proteína avícola',
      chronic_diseases: 'Síndrome braquicefálico leve',
      last_visit: '2026-11-02',
      consultations_count: 4,
      records: [
        { date: '2026-11-02', reason: 'Spa canino hipoalergénico y desparasitación', vet: 'Spa Grooming Altus', dx: 'Manto y piel hidratados' }
      ]
    }
  ]);

  // Formulario nuevo paciente
  const [formData, setFormData] = useState({
    name: '',
    species: 'Canino',
    breed: '',
    gender: 'Macho',
    age: '',
    weight: '',
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    allergies: '',
    chronic_diseases: ''
  });

  const handleRegisterPatient = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.owner_name || !formData.owner_phone) {
      alert('Por favor completa el nombre del paciente y los datos del tutor.');
      return;
    }

    const newPatient = {
      id: `pat-${Date.now()}`,
      name: formData.name,
      species: formData.species,
      breed: formData.breed || 'Mestizo',
      gender: formData.gender,
      age: formData.age || 'No especificada',
      weight: formData.weight ? `${formData.weight} kg` : 'N/A',
      photo: formData.species === 'Canino' ? '🐕' : formData.species === 'Felino' ? '🐈' : '🐾',
      owner: {
        name: formData.owner_name,
        phone: formData.owner_phone,
        email: formData.owner_email || 'Sin correo',
        address: 'Registrado en mostrador'
      },
      allergies: formData.allergies || 'Ninguna registrada',
      chronic_diseases: formData.chronic_diseases || 'Ninguna',
      last_visit: 'Hoy (Registro)',
      consultations_count: 0,
      records: []
    };

    setPatients([newPatient, ...patients]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      species: 'Canino',
      breed: '',
      gender: 'Macho',
      age: '',
      weight: '',
      owner_name: '',
      owner_phone: '',
      owner_email: '',
      allergies: '',
      chronic_diseases: ''
    });
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.phone.includes(searchTerm) ||
      p.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === 'ALL' || p.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header con botón para registrar paciente */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-7 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
            <span>🐾</span> PADRÓN CLÍNICO DE PACIENTES & TUTORES
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Expedientes de Pacientes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra los expedientes clínicos, datos de los tutores y antecedentes médicos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-2xl text-xs font-extrabold transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
        >
          <span>➕</span> Registrar Nuevo Paciente
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre de mascota, tutor o teléfono..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          />
        </div>

        <div className="md:col-span-4 flex gap-2">
          {['ALL', 'Canino', 'Felino'].map((sp) => (
            <button
              key={sp}
              onClick={() => setSpeciesFilter(sp)}
              className={`flex-1 py-3 text-xs font-bold rounded-2xl border transition ${
                speciesFilter === sp
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/40 text-slate-400 border-white/10 hover:bg-white/5'
              }`}
            >
              {sp === 'ALL' ? '🐾 Todos' : sp === 'Canino' ? '🐕 Caninos' : '🐈 Felinos'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                    {patient.photo}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{patient.name}</h3>
                    <p className="text-xs text-slate-400">
                      {patient.species} &bull; {patient.breed}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 text-[10px] font-bold">
                  {patient.gender}
                </span>
              </div>

              {/* Ficha Básica */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Edad / Peso</span>
                  <span className="font-semibold text-white">{patient.age} &bull; {patient.weight}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultas</span>
                  <span className="font-semibold text-emerald-400">{patient.consultations_count} registradas</span>
                </div>
              </div>

              {/* Datos del Tutor */}
              <div className="mt-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Tutor:</span>
                  <span className="font-bold text-white">{patient.owner.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Teléfono:</span>
                  <span className="font-mono text-emerald-300">{patient.owner.phone}</span>
                </div>
              </div>

              {/* Alergias / Alertas Clínicas */}
              {patient.allergies !== 'Ninguna registrada' && patient.allergies !== 'Ninguna conocida' && (
                <div className="mt-3 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span className="truncate"><strong>Alergia:</strong> {patient.allergies}</span>
                </div>
              )}
            </div>

            {/* Acciones del Paciente */}
            <div className="mt-5 pt-4 border-t border-white/10 flex gap-2">
              <button
                onClick={() => setSelectedPatientForExpediente(patient)}
                className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition text-center"
              >
                📋 Ver Historial
              </button>
              <button
                onClick={() => {
                  const msg = `Hola ${patient.owner.name}, te contactamos de Altus PetCloud respecto a tu mascota ${patient.name}.`;
                  window.open(`https://wa.me/52${patient.owner.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition flex items-center gap-1"
                title="Contactar al tutor por WhatsApp"
              >
                <span>💬</span> WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Registrar Paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-black text-white">Registrar Nuevo Paciente</h2>
                <p className="text-xs text-slate-400">Vincula a la mascota con los datos del tutor.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="mt-5 space-y-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                1. Datos de la Mascota
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Mascota *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Bruno"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Especie</label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="Canino">Canino (Perro)</option>
                    <option value="Felino">Felino (Gato)</option>
                    <option value="Ave">Ave</option>
                    <option value="Roedor">Roedor</option>
                    <option value="Exótico">Exótico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Raza</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="Ej. Labrador, Mestizo, etc."
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sexo</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Edad Estimada</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Ej. 2 años, 6 meses"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Ej. 14.5"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
              </div>

              <div className="pt-3 text-xs font-bold text-sky-400 uppercase tracking-wider">
                2. Datos del Tutor / Responsable
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    placeholder="Ej. Carlos Domínguez"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.owner_phone}
                    onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                    placeholder="55 1234 5678"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.owner_email}
                    onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                    placeholder="carlos@correo.com"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
              </div>

              <div className="pt-3 text-xs font-bold text-amber-400 uppercase tracking-wider">
                3. Alertas Médicas Iniciales
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Alergias Conocidas</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="Ej. Cefalexina, Pollo, Ninguna"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enfermedades Previas</label>
                  <input
                    type="text"
                    value={formData.chronic_diseases}
                    onChange={(e) => setFormData({ ...formData, chronic_diseases: e.target.value })}
                    placeholder="Ej. Soplo cardiaco, Displasia"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
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
                  className="px-6 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-emerald-500/25"
                >
                  Guardar Paciente & Crear Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Historial del Paciente */}
      {selectedPatientForExpediente && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">
                  {selectedPatientForExpediente.photo}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedPatientForExpediente.name}</h2>
                  <p className="text-xs text-slate-400">
                    {selectedPatientForExpediente.species} &bull; {selectedPatientForExpediente.breed} &bull; Tutor: {selectedPatientForExpediente.owner.name} ({selectedPatientForExpediente.owner.phone})
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPatientForExpediente(null)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📋</span> Consultas Previas y Diagnósticos
              </h3>

              {selectedPatientForExpediente.records.length > 0 ? (
                <div className="space-y-3">
                  {selectedPatientForExpediente.records.map((rec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-emerald-400">{rec.date}</span>
                        <span className="text-slate-400">Atendió: {rec.vet}</span>
                      </div>
                      <p className="text-xs font-semibold text-white">Motivo: {rec.reason}</p>
                      <p className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <strong>Diagnóstico / Plan:</strong> {rec.dx}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 bg-white/[0.02] rounded-2xl border border-white/5">
                  No hay consultas registradas para este paciente todavía.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedPatientForExpediente(null)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
