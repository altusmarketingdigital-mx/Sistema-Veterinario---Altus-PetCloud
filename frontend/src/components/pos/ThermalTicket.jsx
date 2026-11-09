import React from 'react';

export default function ThermalTicket({ invoiceData, isVisible = false }) {
  if (!invoiceData) return null;

  const { invoice, items = [] } = invoiceData;

  return (
    <div
      id="thermal-pos-ticket"
      className={`${isVisible ? 'block' : 'hidden'} print:block text-black bg-white`}
    >
      {/* Encabezado */}
      <div className="text-center pb-2 border-b border-dashed border-gray-400">
        <h2 className="font-bold text-sm tracking-wide uppercase">ALTUS PETCLOUD</h2>
        <p className="text-[10px] text-gray-700">Clínica Veterinaria & Spa Canino</p>
        <p className="text-[9px] text-gray-600">RFC: APC-260101-VET</p>
        <p className="text-[9px] text-gray-600">Tel: (55) 8421-9900</p>
        <p className="text-[9px] text-gray-600">Av. Insurgentes Sur 1450, CDMX</p>
      </div>

      {/* Metadatos de la Venta */}
      <div className="my-2 text-[10px] space-y-0.5 border-b border-dashed border-gray-400 pb-2">
        <div className="flex justify-between">
          <span>Folio:</span>
          <span className="font-bold">{invoice?.invoice_number || 'TICK-0000'}</span>
        </div>
        <div className="flex justify-between">
          <span>Fecha:</span>
          <span>{new Date(invoice?.created_at || Date.now()).toLocaleString('es-MX')}</span>
        </div>
        <div className="flex justify-between">
          <span>Atendió:</span>
          <span>{invoice?.cashier_name || 'Caja Principal'}</span>
        </div>
        <div className="flex justify-between">
          <span>Cliente:</span>
          <span>{invoice?.first_name ? `${invoice.first_name} ${invoice.last_name || ''}` : 'Público General'}</span>
        </div>
        <div className="flex justify-between">
          <span>Pago:</span>
          <span className="font-semibold">{invoice?.payment_method || 'EFECTIVO'}</span>
        </div>
      </div>

      {/* Detalle de Artículos */}
      <div className="text-[10px] my-2">
        <div className="flex justify-between font-bold border-b border-gray-400 pb-1 mb-1">
          <span className="w-1/2">Cant. / Descripción</span>
          <span className="w-1/4 text-right">P.U.</span>
          <span className="w-1/4 text-right">Total</span>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex justify-between py-0.5 text-[9.5px]">
            <span className="w-1/2 truncate font-medium">
              {item.quantity}x {item.product_name}
            </span>
            <span className="w-1/4 text-right">${Number(item.unit_price).toFixed(2)}</span>
            <span className="w-1/4 text-right font-bold">${Number(item.total_line).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="border-t border-dashed border-gray-400 pt-1.5 text-[10px] space-y-0.5">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${Number(invoice?.subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA (16%):</span>
          <span>${Number(invoice?.tax_amount || 0).toFixed(2)}</span>
        </div>
        {Number(invoice?.discount_amount) > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>Descuento:</span>
            <span>-${Number(invoice?.discount_amount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-black border-t border-black pt-1 mt-1">
          <span>TOTAL:</span>
          <span>${Number(invoice?.total || 0).toFixed(2)} MXN</span>
        </div>
      </div>

      {/* Mensaje de Despedida & Código */}
      <div className="mt-3 text-center border-t border-dashed border-gray-400 pt-2 space-y-1">
        <p className="text-[9px] font-semibold">¡Gracias por confiar en Altus PetCloud!</p>
        <p className="text-[8px] text-gray-600">Salud y bienestar garantizados para tu compañero.</p>
        <p className="text-[7.5px] text-gray-500 mt-1 font-mono tracking-widest">* * * POWERED BY ALTUS MKT DIGITAL * * *</p>
      </div>
    </div>
  );
}
