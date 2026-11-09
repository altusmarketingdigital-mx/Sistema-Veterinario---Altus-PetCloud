import React, { useState } from 'react';

export default function WhatsAppModal({ isOpen, onClose, defaultClient }) {
  const [phone, setPhone] = useState(defaultClient?.phone || '5512345678');
  const [template, setTemplate] = useState('APPOINTMENT_REMINDER');
  const [customText, setCustomText] = useState(
    `🐾 *Altus PetCloud:* Hola ${defaultClient?.name || 'Tutor'}, te recordamos la cita médica de tu mascota para el día de mañana a las 10:00 AM en nuestra sucursal. ¡Te esperamos!`
  );

  if (!isOpen) return null;

  const handleTemplateChange = (type) => {
    setTemplate(type);
    if (type === 'APPOINTMENT_REMINDER') {
      setCustomText(`🐾 *Altus PetCloud:* Hola ${defaultClient?.name || 'Tutor'}, te recordamos la cita médica de tu mascota programada para mañana. ¡Te esperamos!`);
    } else if (type === 'VACCINE_DUE') {
      setCustomText(`💉 *Refuerzo de Vacunación:* Hola ${defaultClient?.name || 'Tutor'}, es momento de aplicar el refuerzo anual de vacuna para tu mascota. Escríbenos para agendar.`);
    } else if (type === 'SPA_PROMO') {
      setCustomText(`✨ *Spa Canino Altus PetCloud:* Hola ${defaultClient?.name || 'Tutor'}, aprovecha 15% de descuento en estética y spa durante toda esta semana.`);
    }
  };

  const sendWhatsApp = () => {
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(customText)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center font-bold text-base">
              💬
            </span>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Enviar Mensaje por WhatsApp</h2>
              <p className="text-xs text-slate-400">Automatización de CRM & Recordatorios</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Plantilla Rápida:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'APPOINTMENT_REMINDER', label: 'Cita Médica' },
                { id: 'VACCINE_DUE', label: 'Vacunación' },
                { id: 'SPA_PROMO', label: 'Spa & Grooming' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTemplateChange(t.id)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    template === t.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Teléfono Móvil (con lada):</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Mensaje de WhatsApp:</label>
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>

          <button
            onClick={sendWhatsApp}
            className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>🚀 Abrir y Enviar en WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
