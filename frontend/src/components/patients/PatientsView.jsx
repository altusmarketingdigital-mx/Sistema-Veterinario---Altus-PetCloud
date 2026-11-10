import React, { useState } from 'react';

export default function PatientsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientForExpediente, setSelectedPatientForExpediente] = useState(null);

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
      },
      allergies: 'Ninguna conocida',
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
      },
      allergies: 'Sensibilidad a penicilinas',
      consultations_count: 3,
      records: [
        { date: '2026-11-09', reason: 'Revisión otitis y limpieza auricular', vet: 'Dra. Miriam Castro', dx: 'Otitis externa bilateral tratada con gotas' }
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
      },
      allergies: 'Proteína avícola',
      consultations_count: 4,
      records: [
        { date: '2026-11-02', reason: 'Spa canino hipoalergénico', vet: 'Spa Grooming Altus', dx: 'Manto y piel hidratados' }
      ]
    }
  ]);

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
      },
      allergies: formData.allergies || 'Ninguna registrada',
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Padrón de Pacientes
          </h1>
          <p className="text-sm text-[#86868B] mt-1">
            Expedientes clínicos y registro de tutores de la clínica
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl text-xs font-semibold shadow-sm transition flex items-center gap-2"
        >
          <span>➕</span> Registrar Nuevo Paciente
        </button>
      </div>

      {/* Barra de Filtro y Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B] text-sm">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por mascota, tutor o teléfono..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-black/[0.06] rounded-2xl text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="md:col-span-4 flex gap-2">
          {['ALL', 'Canino', 'Felino'].map((sp) => (
            <button
              key={sp}
              onClick={() => setSpeciesFilter(sp)}
              className={`flex-1 py-3 text-xs font-semibold rounded-2xl border transition ${
                speciesFilter === sp
                  ? 'bg-white text-[#1D1D1F] border-black/[0.15] shadow-xs'
                  : 'bg-[#F5F5F7] text-[#86868B] border-transparent hover:text-[#1D1D1F]'
              }`}
            >
              {sp === 'ALL' ? 'Todos' : sp === 'Canino' ? 'Caninos' : 'Felinos'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="apple-card p-6 apple-card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-2xl">
                    {patient.photo}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1D1D1F]">{patient.name}</h3>
                    <p className="text-xs text-[#86868B]">
                      {patient.species} &bull; {patient.breed}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#F5F5F7] text-[#86868B] text-[11px] font-semibold">
                  {patient.gender}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-[#F5F5F7]">
                  <span className="text-[#86868B] block text-[10px] font-medium uppercase">Edad & Peso</span>
                  <span className="font-semibold text-[#1D1D1F]">{patient.age} &bull; {patient.weight}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F5F5F7]">
                  <span className="text-[#86868B] block text-[10px] font-medium uppercase">Historial</span>
                  <span className="font-semibold text-emerald-700">{patient.consultations_count} citas</span>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-[#F5F5F7] space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#86868B]">Tutor:</span>
                  <span className="font-semibold text-[#1D1D1F]">{patient.owner.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#86868B]">Teléfono:</span>
                  <span className="font-semibold text-[#1D1D1F]">{patient.owner.phone}</span>
                </div>
              </div>

              {patient.allergies !== 'Ninguna registrada' && patient.allergies !== 'Ninguna conocida' && (
                <div className="mt-3 px-3 py-2 rounded-xl bg-amber-50 text-amber-800 text-xs flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span className="truncate"><strong>Alergia:</strong> {patient.allergies}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-black/[0.04] flex gap-2">
              <button
                onClick={() => setSelectedPatientForExpediente(patient)}
                className="flex-1 py-2.5 px-3 bg-[#F5F5F7] hover:bg-[#EBEBEF] text-[#1D1D1F] rounded-xl text-xs font-semibold transition text-center"
              >
                Ver Historial
              </button>
              <button
                onClick={() => {
                  const msg = `Hola ${patient.owner.name}, te contactamos de Altus PetCloud respecto a tu mascota ${patient.name}.`;
                  window.open(`https://wa.me/52${patient.owner.phone.replace(/\s+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="py-2.5 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                title="WhatsApp"
              >
                <span>💬</span> WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Registrar Paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-black/[0.06]">
              <h2 className="text-lg font-bold text-[#1D1D1F]">Registrar Nuevo Paciente</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#86868B] hover:text-[#1D1D1F] text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Nombre Mascota *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Bruno"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Especie</label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Canino">Canino (Perro)</option>
                    <option value="Felino">Felino (Gato)</option>
                    <option value="Ave">Ave</option>
                    <option value="Exótico">Exótico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Raza</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="Ej. Labrador"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Sexo</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Edad Estimada</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Ej. 2 años"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Ej. 14.5"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-[#86868B] uppercase tracking-wider mb-2">Datos del Tutor</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                      placeholder="Nombre del Tutor *"
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      value={formData.owner_phone}
                      onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                      placeholder="Teléfono Móvil (WhatsApp) *"
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] rounded-xl text-xs text-[#1D1D1F] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F5F5F7] hover:bg-[#EBEBEF] text-[#1D1D1F] rounded-xl text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-semibold transition shadow-sm"
                >
                  Guardar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Historial */}
      {selectedPatientForExpediente && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedPatientForExpediente.photo}</span>
                <div>
                  <h2 className="text-lg font-bold text-[#1D1D1F]">{selectedPatientForExpediente.name}</h2>
                  <p className="text-xs text-[#86868B]">Tutor: {selectedPatientForExpediente.owner.name} ({selectedPatientForExpediente.owner.phone})</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatientForExpediente(null)} className="text-[#86868B] hover:text-[#1D1D1F]">
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {selectedPatientForExpediente.records.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#F5F5F7] space-y-1 text-xs">
                  <div className="flex justify-between items-center font-semibold text-[#1D1D1F]">
                    <span>{rec.date}</span>
                    <span className="text-[#86868B]">Médico: {rec.vet}</span>
                  </div>
                  <p className="text-slate-600"><strong>Motivo:</strong> {rec.reason}</p>
                  <p className="text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl mt-1">
                    <strong>Plan / Diagnóstico:</strong> {rec.dx}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.06] flex justify-end">
              <button
                onClick={() => setSelectedPatientForExpediente(null)}
                className="px-4 py-2 bg-[#F5F5F7] hover:bg-[#EBEBEF] text-[#1D1D1F] rounded-xl text-xs font-semibold transition"
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
