import React, { useState } from 'react';
import PrescriptionPDFModal from './PrescriptionPDFModal';

const CRITICALITY_STYLES = {
  STABLE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Estable' },
  OBSERVATION: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'En Observación' },
  CRITICAL: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Crítico' },
};

export default function ClinicalKardexView() {
  const [activeTab, setActiveTab] = useState('kardex'); // 'kardex' | 'prescriptions'
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Datos mock interactivos de Hospitalización y Kardex
  const [kardexList, setKardexList] = useState([
    {
      id: 'k-1',
      patient_name: 'Toby',
      species: 'Canino (Mestizo)',
      weight: 14.2,
      cage: 'Box 02 - UCI',
      criticality: 'CRITICAL',
      medication: 'Cefalexina 250mg / IV',
      scheduled_time: '14:00 hrs',
      frequency: 'Cada 8 hrs',
      status: 'PENDING',
      vet_name: 'Dra. Miriam Castro',
    },
    {
      id: 'k-2',
      patient_name: 'Mimi',
      species: 'Felino (Europeo Común)',
      weight: 3.8,
      cage: 'Box 05 - Felinos',
      criticality: 'OBSERVATION',
      medication: 'Meloxicam 0.2mg/kg / SC',
      scheduled_time: '16:30 hrs',
      frequency: 'Cada 24 hrs',
      status: 'PENDING',
      vet_name: 'Dr. Roberto Mendoza',
    },
    {
      id: 'k-3',
      patient_name: 'Bruno',
      species: 'Canino (Labrador)',
      weight: 28.5,
      cage: 'Box 01 - Postquirúrgico',
      criticality: 'STABLE',
      medication: 'Tramadol 50mg / IM',
      scheduled_time: '18:00 hrs',
      frequency: 'Cada 12 hrs',
      status: 'PENDING',
      vet_name: 'Dra. Miriam Castro',
    },
  ]);

  const markAsAdministered = (id) => {
    setKardexList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'ADMINISTERED' } : item))
    );
  };

  const samplePrescription = {
    code: 'REC-2026-0089',
    date: '09/11/2026',
    patient_name: 'Max',
    species: 'Canino',
    breed: 'Golden Retriever',
    weight: '31.5',
    owner_name: 'Ana Martínez',
    owner_phone: '55 1234 5678',
    diagnosis: 'Gastroenteritis bacteriana aguda y deshidratación leve.',
    vet_name: 'Dra. Miriam Castro',
    license: 'VET-894120',
    instructions: 'Dieta blanda (pollo hervido con arroz) durante 5 días. Asegurar abundante agua fresca. Regresar a control si persisten los vómitos.',
    medications: [
      {
        name: 'Metronidazol 250mg tabletas',
        dosage: '1 tableta',
        frequency: 'Cada 12 horas después de comer',
        duration: '7 días',
        notes: 'Administrar con el alimento para evitar irritación gástrica.'
      },
      {
        name: 'Omeprazol 20mg cápsulas',
        dosage: '1 cápsula en ayunas',
        frequency: 'Cada 24 horas por la mañana',
        duration: '10 días',
        notes: '30 minutos antes del desayuno.'
      },
      {
        name: 'Probiótico Canino FortiFlora',
        dosage: '1 sobre al día',
        frequency: 'Cada 24 horas mezclado en alimento húmedo',
        duration: '6 días'
      }
    ]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PrescriptionPDFModal
        prescription={selectedPrescription}
        isOpen={!!selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />

      {/* Encabezado y Selector de Submódulos */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Expediente Clínico & Kardex</h1>
          <p className="text-sm text-slate-500">Monitoreo de hospitalización en tiempo real y emisión de recetas oficiales.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('kardex')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'kardex' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏥 Kardex de Hospitalización
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'prescriptions' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Recetas Médicas (PDF)
          </button>
        </div>
      </div>

      {/* TAB 1: KARDEX Y HOSPITALIZACIÓN */}
      {activeTab === 'kardex' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Pacientes Internados</p>
                <p className="text-2xl font-bold text-[#0F172A] mt-1">3</p>
              </div>
              <span className="w-10 h-10 rounded-xl bg-sky-50 text-[#0EA5E9] flex items-center justify-center font-bold text-lg">🏥</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Dosis Pendientes Hoy</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {kardexList.filter((k) => k.status === 'PENDING').length}
                </p>
              </div>
              <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">⏰</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Dosis Administradas</p>
                <p className="text-2xl font-bold text-[#10B981] mt-1">
                  {kardexList.filter((k) => k.status === 'ADMINISTERED').length}
                </p>
              </div>
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold text-lg">✓</span>
            </div>
          </div>

          {/* Lista de Kardex con Semáforo */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#0F172A]">Monitor de Dosis y Medicación Activa</h2>
              <span className="text-xs text-slate-400">Actualizado hace un momento</span>
            </div>
            <div className="divide-y divide-slate-100">
              {kardexList.map((item) => {
                const crit = CRITICALITY_STYLES[item.criticality] || CRITICALITY_STYLES.STABLE;
                const isAdministered = item.status === 'ADMINISTERED';
                return (
                  <div key={item.id} className="p-4.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition">
                    <div className="flex items-start gap-4">
                      {/* Semáforo de Criticidad */}
                      <div className="text-center min-w-[90px]">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${crit.bg} ${crit.text} ${crit.border}`}>
                          {crit.label}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">{item.cage}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[#0F172A]">{item.patient_name}</h3>
                          <span className="text-xs text-slate-400">({item.species} &bull; {item.weight} kg)</span>
                        </div>
                        <p className="text-sm font-semibold text-[#0EA5E9] mt-0.5">{item.medication}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Frecuencia: <span className="font-medium text-slate-600">{item.frequency}</span> &bull; Médico: {item.vet_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0">
                      <div className="text-right">
                        <p className="text-sm font-black text-[#0F172A]">{item.scheduled_time}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Horario Programado</p>
                      </div>

                      {isAdministered ? (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1">
                          <span>✓</span> Administrada
                        </span>
                      ) : (
                        <button
                          onClick={() => markAsAdministered(item.id)}
                          className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                        >
                          Aplicar Dosis
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECETAS MÉDICAS DIGITALES */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Historial de Recetas Médicas Emitidas</h2>
              <p className="text-xs text-slate-400">Genera y descarga en formato PDF profesional para el tutor.</p>
            </div>
            <button
              onClick={() => setSelectedPrescription(samplePrescription)}
              className="px-4 py-2.5 bg-[#0EA5E9] hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> Nueva Receta
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {[
              {
                code: 'REC-2026-0089',
                patient: 'Max (Golden Retriever)',
                owner: 'Ana Martínez',
                date: '09/11/2026',
                diagnosis: 'Gastroenteritis bacteriana aguda y deshidratación leve.',
                vet: 'Dra. Miriam Castro',
              },
              {
                code: 'REC-2026-0088',
                patient: 'Luna (Siamés)',
                owner: 'Jorge Saldivar',
                date: '08/11/2026',
                diagnosis: 'Otitis externa bacteriana unilateral.',
                vet: 'Dr. Roberto Mendoza',
              },
            ].map((rx, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0EA5E9] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {rx.code}
                    </span>
                    <h3 className="font-bold text-sm text-[#0F172A]">{rx.patient}</h3>
                    <span className="text-xs text-slate-400">&bull; Tutor: {rx.owner}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Diagnóstico: {rx.diagnosis}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{rx.date}</span>
                  <button
                    onClick={() => setSelectedPrescription(samplePrescription)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition flex items-center gap-1"
                  >
                    <span>👁️</span> Ver / PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
