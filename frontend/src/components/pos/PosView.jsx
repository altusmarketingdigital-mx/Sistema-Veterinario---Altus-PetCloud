import React, { useState, useEffect, useRef } from 'react';
import ThermalTicket from './ThermalTicket';

export default function PosView() {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState([
    { id: '1', barcode: '75010001', name: 'Alimento Pro Plan Adulto 3kg', price: 650.00, qty: 1 },
    { id: '2', barcode: '75010002', name: 'Desparasitación NexGard Spectra', price: 320.00, qty: 1 },
  ]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [lastInvoice, setLastInvoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const barcodeInputRef = useRef(null);

  // Mantener el foco activo para el lector físico de código de barras
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [cart]);

  // Manejador del escáner (los escáneres USB envían la cadena y terminan con la tecla 'Enter')
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const cleanCode = barcodeInput.trim();
    if (!cleanCode) return;

    // Simulación / consulta de producto escaneado
    const mockProducts = {
      '75010001': { id: '1', barcode: '75010001', name: 'Alimento Pro Plan Adulto 3kg', price: 650.00 },
      '75010002': { id: '2', barcode: '75010002', name: 'Desparasitación NexGard Spectra', price: 320.00 },
      '75010003': { id: '3', barcode: '75010003', name: 'Baño y Estética Canina Spa', price: 280.00 },
      '75010004': { id: '4', barcode: '75010004', name: 'Vacuna Séxtuple Canina', price: 450.00 },
    };

    const found = mockProducts[cleanCode] || {
      id: Date.now().toString(),
      barcode: cleanCode,
      name: `Producto Escaneado (${cleanCode})`,
      price: 150.00
    };

    addToCart(found);
    setBarcodeInput('');
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const handleCheckoutAndPrint = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const generatedInvoice = {
      invoice: {
        invoice_number: `ALTUS-${Math.floor(100000 + Math.random() * 900000)}`,
        created_at: new Date().toISOString(),
        cashier_name: 'Dra. Miriam Castro',
        first_name: 'Carlos',
        last_name: 'Gómez',
        payment_method: paymentMethod,
        subtotal,
        tax_amount: tax,
        discount_amount: 0,
        total,
      },
      items: cart.map((item) => ({
        product_name: item.name,
        quantity: item.qty,
        unit_price: item.price,
        total_line: item.price * item.qty,
      })),
    };

    setLastInvoice(generatedInvoice);
    setIsProcessing(false);

    // Lanzar impresión térmica nativa mediante window.print()
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Componente del Ticket Térmico Oculto en pantalla, visible al imprimir */}
      <ThermalTicket invoiceData={lastInvoice} />

      {/* Header del POS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Punto de Venta (POS) & Farmacia</h1>
          <p className="text-sm text-slate-500">Escáner de código de barras activo e impresión térmica en 80mm.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-[#10B981] mr-1.5 animate-pulse"></span>
            Escáner Conectado
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Izquierdo: Captura de Escáner y Catálogo */}
        <div className="lg:col-span-7 space-y-4">
          {/* Barra de entrada del escáner */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </span>
                <input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Escanear código de barras o ingresar SKU..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0EA5E9] text-white font-medium rounded-lg hover:bg-sky-600 transition text-sm"
              >
                Agregar
              </button>
            </form>
          </div>

          {/* Accesos Rápidos de Servicios Frecuentes */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Servicios y Fármacos Frecuentes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: '1', barcode: '75010001', name: 'Alimento Pro Plan 3kg', price: 650 },
                { id: '2', barcode: '75010002', name: 'NexGard Spectra', price: 320 },
                { id: '3', barcode: '75010003', name: 'Baño & Spa Canino', price: 280 },
                { id: '4', barcode: '75010004', name: 'Vacuna Séxtuple', price: 450 },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="p-3 text-left border border-slate-100 bg-[#F8FAFC] hover:bg-slate-100 rounded-lg transition"
                >
                  <p className="text-xs font-semibold text-[#0F172A] truncate">{item.name}</p>
                  <p className="text-xs font-bold text-[#10B981] mt-1">${item.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Carrito y Cobro */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center justify-between">
              <span>Ticket Actual</span>
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {cart.reduce((a, b) => a + b.qty, 0)} articulos
              </span>
            </h2>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto max-h-72 divide-y divide-slate-100 pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  El carrito está vacío. Utilice el escáner para comenzar.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                    <div className="pr-2 flex-1">
                      <p className="font-semibold text-[#0F172A]">{item.name}</p>
                      <p className="text-xs text-slate-400">${item.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="w-16 text-right font-bold text-[#0F172A]">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Resumen de Cuenta */}
            <div className="border-t border-slate-200 pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>IVA (16%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#0F172A] pt-1 border-t border-slate-100">
                <span>Total a Cobrar</span>
                <span className="text-[#10B981]">${total.toFixed(2)} MXN</span>
              </div>
            </div>

            {/* Selector de Método de Pago */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-500 mb-2">Método de Pago</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CASH', label: 'Efectivo' },
                  { id: 'DEBIT_CARD', label: 'Tarjeta' },
                  { id: 'TRANSFER', label: 'Transfer.' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition ${
                      paymentMethod === m.id
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de Cobro & Impresión Térmica */}
            <button
              onClick={handleCheckoutAndPrint}
              disabled={cart.length === 0 || isProcessing}
              className="mt-5 w-full py-3.5 px-4 bg-[#10B981] hover:bg-emerald-600 active:scale-[0.99] disabled:bg-slate-300 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cobrar e Imprimir Ticket (80mm)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
