import React from 'react';

export default function PrescriptionPDFModal({ prescription, isOpen, onClose }) {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Acciones Superiores */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-[#0EA5E9] px-2.5 py-0.5 rounded-full">
              Receta Médica Electrónica
            </span>
            <span className="text-xs text-slate-400 font-mono">{prescription.code}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>🖨️</span> Imprimir / Descargar PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 text-sm">
              ✕
            </button>
          </div>
        </div>

        {/* Formato Oficial de la Receta Médica */}
        <div className="mt-6 border border-slate-200 p-6 rounded-xl bg-white space-y-6 text-[#0F172A]">
          {/* Membrete Clínico */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🐾</span>
                <h2 className="text-xl font-black tracking-tight text-[#0F172A]">Altus PetCloud</h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">Hospital Veterinario & Especialidades Clínicas</p>
              <p className="text-[11px] text-slate-400 mt-1">Av. Insurgentes Sur 1450 &bull; Tel: (55) 8421-9900</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#0F172A]">{prescription.vet_name}</p>
              <p className="text-[11px] text-slate-500">Médico Veterinario Zootecnista</p>
              <p className="text-[11px] text-[#0EA5E9] font-semibold">Cédula Prof.: {prescription.license}</p>
              <p className="text-[10px] text-slate-400 mt-1">Fecha: {prescription.date}</p>
            </div>
          </div>

          {/* Ficha del Paciente y Tutor */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
            <div>
              <p><span className="font-semibold text-slate-500">Paciente:</span> <strong className="text-sm">{prescription.patient_name}</strong></p>
              <p className="mt-1"><span className="font-semibold text-slate-500">Especie / Raza:</span> {prescription.species} ({prescription.breed})</p>
              <p className="mt-1"><span className="font-semibold text-slate-500">Peso:</span> {prescription.weight} kg</p>
            </div>
            <div>
              <p><span className="font-semibold text-slate-500">Tutor:</span> {prescription.owner_name}</p>
              <p className="mt-1"><span className="font-semibold text-slate-500">Teléfono:</span> {prescription.owner_phone}</p>
              <p className="mt-1"><span className="font-semibold text-slate-500">Diagnóstico:</span> <span className="font-medium text-slate-800">{prescription.diagnosis}</span></p>
            </div>
          </div>

          {/* Prescripción Farmacológica (Rx) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0EA5E9] flex items-center gap-1.5">
              <span>Rx / Indicaciones de Tratamiento:</span>
            </h3>
            <div className="divide-y divide-slate-100">
              {prescription.medications.map((med, index) => (
                <div key={index} className="py-2.5">
                  <div className="flex justify-between font-bold text-sm">
                    <span>{index + 1}. {med.name}</span>
                    <span className="text-xs text-slate-500 font-normal">Duración: {med.duration}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Dosis: <strong className="text-slate-800">{med.dosage}</strong> &bull; Frecuencia: <strong>{med.frequency}</strong></p>
                  {med.notes && <p className="text-[11px] text-slate-500 italic mt-0.5">{med.notes}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Indicaciones y Cuidados Generales */}
          <div className="border-t border-slate-200 pt-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Recomendaciones Generales:</p>
            <p className="mt-0.5">{prescription.instructions}</p>
          </div>

          {/* Sello y Firma Digital */}
          <div className="pt-6 border-t border-dashed border-slate-300 flex justify-between items-end">
            <div className="text-[9px] text-slate-400 font-mono space-y-0.5">
              <p>ID Transaccional: {prescription.id_hash || 'ALTUS-SEC-8921X'}</p>
              <p>Verificación de autenticidad: altuspetcloud.com/verify-rx</p>
            </div>
            <div className="text-center w-52">
              <div className="border-b border-slate-400 pb-1 mb-1 font-signature text-sm font-bold text-slate-700">
                {prescription.vet_name}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Firma del Médico Responsable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
