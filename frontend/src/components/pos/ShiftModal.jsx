import React, { useState } from 'react';

export default function ShiftModal({ isOpen, onClose, currentShift, onOpenShift, onCloseShift }) {
  const [openingBalance, setOpeningBalance] = useState('500.00');
  const [countedCash, setCountedCash] = useState('1850.00');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Control de Turno & Arqueo de Caja</h2>
            <p className="text-xs text-slate-400">Punto de Venta Altus PetCloud</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
        </div>

        {/* Si NO hay turno abierto: Pantalla de APERTURA */}
        {!currentShift ? (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-800">
              <p className="font-bold">Apertura de Turno de Caja</p>
              <p className="mt-0.5">Ingresa el fondo inicial en efectivo para comenzar a registrar cobros.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Fondo Inicial en Efectivo ($ MXN):</label>
              <input
                type="number"
                step="0.01"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-base font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Notas de Turno (Opcional):</label>
              <input
                type="text"
                placeholder="ej. Turno Matutino - Caja 1"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
            </div>

            <button
              onClick={() => {
                onOpenShift({ opening_balance: parseFloat(openingBalance) || 0, notes });
                onClose();
              }}
              className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-sm transition"
            >
              Iniciar Turno y Habilitar Cobros
            </button>
          </div>
        ) : (
          /* Si SÍ hay turno abierto: Pantalla de ARQUEO Y CORTE Z */
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800">
              <div className="flex justify-between items-center font-bold">
                <span>Turno Activo: #{currentShift.id.slice(0, 8)}</span>
                <span className="px-2 py-0.5 bg-amber-200/60 rounded text-[10px]">EN CURSO</span>
              </div>
              <p className="mt-1">Iniciado a las: {currentShift.opened_at || '09:00 AM'} &bull; Fondo: ${currentShift.opening_balance}</p>
            </div>

            {/* Resumen de Métricas del Turno */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Efectivo</span>
                <span className="text-sm font-bold text-[#0F172A]">${currentShift.cash_sales || '1,350.00'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Tarjetas</span>
                <span className="text-sm font-bold text-[#0F172A]">${currentShift.card_sales || '2,450.00'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block">Total Ventas</span>
                <span className="text-sm font-bold text-[#10B981]">${currentShift.total_sales || '3,800.00'}</span>
              </div>
            </div>

            {/* Arqueo de Efectivo Físico */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Efectivo Contado en Caja ($ MXN):
              </label>
              <input
                type="number"
                step="0.01"
                value={countedCash}
                onChange={(e) => setCountedCash(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-base font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Efectivo teórico esperado en cajón: <strong className="text-slate-700">${parseFloat(currentShift.opening_balance || 500) + 1350} MXN</strong>
              </p>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Imprimir Corte X
              </button>
              <button
                onClick={() => {
                  onCloseShift({ actual_cash: parseFloat(countedCash) || 0 });
                  onClose();
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition"
              >
                Cerrar Turno (Corte Z)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
