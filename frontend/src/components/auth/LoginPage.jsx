import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolePreset, setRolePreset] = useState('ADMIN');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'ADMIN',
      title: 'Administrador',
      desc: 'Control total de la clínica',
      icon: '👑',
      badge: 'Admin'
    },
    {
      id: 'VETERINARIAN',
      title: 'Médico Veterinario',
      desc: 'Expedientes, recetas y citas',
      icon: '🩺',
      badge: 'Clínico'
    },
    {
      id: 'RECEPTIONIST',
      title: 'Recepción & Caja',
      desc: 'Punto de venta y agenda',
      icon: '💳',
      badge: 'Caja'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const usersByRole = {
        ADMIN: {
          id: 'u-1',
          full_name: 'Dra. Miriam Castro',
          email: email || 'admin@altuspetcloud.com',
          role: 'ADMIN',
          professional_license: 'VET-894120',
          tenant_name: 'Hospital Veterinario Altus',
          tenant_id: 'ten-altus-01'
        },
        VETERINARIAN: {
          id: 'u-2',
          full_name: 'Dr. Roberto Mendoza',
          email: email || 'vet@altuspetcloud.com',
          role: 'VETERINARIAN',
          professional_license: 'VET-332190',
          tenant_name: 'Hospital Veterinario Altus',
          tenant_id: 'ten-altus-01'
        },
        RECEPTIONIST: {
          id: 'u-3',
          full_name: 'Sofia Valenzuela',
          email: email || 'recepcion@altuspetcloud.com',
          role: 'RECEPTIONIST',
          tenant_name: 'Hospital Veterinario Altus',
          tenant_id: 'ten-altus-01'
        }
      };

      login(usersByRole[rolePreset], 'jwt-auth-token-example');
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col justify-center items-center p-6 selection:bg-emerald-500 selection:text-white">
      {/* Contenedor Central Estilo Apple */}
      <div className="w-full max-w-md">
        
        {/* Cabecera / Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-3xl shadow-sm border border-black/[0.04] flex items-center justify-center text-3xl">
            🐾
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
            Altus PetCloud
          </h1>
          <p className="text-sm text-[#86868B] mt-1 font-medium">
            Sistema Operativo Veterinario & Spa Canino
          </p>
        </div>

        {/* Tarjeta de Inicio de Sesión */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-black/[0.04]">
          <h2 className="text-base font-semibold text-[#1D1D1F] mb-1">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-[#86868B] mb-5">
            Selecciona tu perfil para ingresar a la sucursal activa.
          </p>

          {/* Selector de Perfil Segmentado Estilo iOS */}
          <div className="mb-6">
            <label className="block text-[11px] font-semibold text-[#86868B] uppercase tracking-wider mb-2">
              Perfil de Acceso
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5F5F7] rounded-2xl">
              {roles.map((r) => {
                const isSelected = rolePreset === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRolePreset(r.id)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-white text-[#1D1D1F] shadow-sm font-bold'
                        : 'text-[#86868B] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <span className="block text-sm mb-0.5">{r.icon}</span>
                    <span className="text-[11px] truncate block">{r.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1D1D1F] mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  rolePreset === 'ADMIN'
                    ? 'admin@altuspetcloud.com'
                    : rolePreset === 'VETERINARIAN'
                    ? 'vet@altuspetcloud.com'
                    : 'recepcion@altuspetcloud.com'
                }
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 border border-transparent transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-[#1D1D1F]">
                  Contraseña
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#0071E3] hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-xs text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 border border-transparent transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#10B981] hover:bg-[#059669] active:scale-[0.99] text-white font-semibold rounded-2xl text-xs transition duration-200 shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Iniciando sesión...</span>
                ) : (
                  <span>Continuar</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Minimalista */}
        <p className="text-center text-[11px] text-[#86868B] mt-8">
          Altus PetCloud &bull; Desarrollado por Altus MKT Digital
        </p>
      </div>
    </div>
  );
}
