import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolePreset, setRolePreset] = useState('ADMIN');

  const handleSubmit = (e) => {
    e.preventDefault();
    const usersByRole = {
      ADMIN: {
        id: 'u-1',
        full_name: 'Dra. Miriam Castro (Admin)',
        email: email || 'admin@altuspetcloud.com',
        role: 'ADMIN',
        professional_license: 'VET-894120',
        tenant_name: 'Hospital Veterinario Altus',
        tenant_id: 'ten-altus-01'
      },
      VETERINARIAN: {
        id: 'u-2',
        full_name: 'Dr. Roberto Mendoza (Médico)',
        email: email || 'vet@altuspetcloud.com',
        role: 'VETERINARIAN',
        professional_license: 'VET-332190',
        tenant_name: 'Hospital Veterinario Altus',
        tenant_id: 'ten-altus-01'
      },
      RECEPTIONIST: {
        id: 'u-3',
        full_name: 'Sofia Valenzuela (Recepción & Caja)',
        email: email || 'recepcion@altuspetcloud.com',
        role: 'RECEPTIONIST',
        tenant_name: 'Hospital Veterinario Altus',
        tenant_id: 'ten-altus-01'
      }
    };

    login(usersByRole[rolePreset], 'jwt-auth-token-example');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex flex-col items-center justify-center p-4">
      {/* Tarjeta de Inicio de Sesión */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Cabecera con Branding Altus */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-8 text-center text-white relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#0EA5E9] flex items-center justify-center text-3xl shadow-lg">
            🐾
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Altus PetCloud</h1>
          <p className="text-xs text-slate-300 mt-1">Plataforma Veterinaria & Spa Canino</p>
          <span className="inline-block mt-3 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold rounded-full border border-emerald-500/30">
            Powered by Altus MKT Digital
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Seleccionar Perfil / Rol RBAC:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ADMIN', label: '👑 Admin' },
                { id: 'VETERINARIAN', label: '🩺 Médico' },
                { id: 'RECEPTIONIST', label: '💳 Recepción' }
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRolePreset(r.id)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
                    rolePreset === r.id
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@altuspetcloud.com"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#10B981] focus:ring-[#10B981]" />
              <span>Recordar sesión</span>
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-[#0EA5E9] hover:underline font-medium">
              ¿Olvidaste tu clave?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
          >
            <span>Ingresar al Sistema</span>
            <span>➔</span>
          </button>
        </form>

        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Altus PetCloud SaaS v1.0 • Acceso multi-sucursal seguro
        </div>
      </div>
    </div>
  );
}
