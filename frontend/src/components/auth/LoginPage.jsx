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
      title: 'Administrador General',
      badge: '👑 Admin',
      desc: 'Control total de la clínica, finanzas, sucursales y personal.',
      gradient: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300'
    },
    {
      id: 'VETERINARIAN',
      title: 'Médico Veterinario',
      badge: '🩺 Clínico',
      desc: 'Expedientes, Kardex, recetas digitales y consultas activas.',
      gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300'
    },
    {
      id: 'RECEPTIONIST',
      title: 'Recepción & Caja',
      badge: '💳 Operativo',
      desc: 'Punto de venta, control de caja, citas y WhatsApp a tutores.',
      gradient: 'from-sky-500/20 to-blue-500/20 border-sky-500/40 text-sky-300'
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
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-white flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Luces Ambientales de Fondo (Background Glow) */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-sky-500/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-slate-900/40 rounded-full blur-[160px] pointer-events-none" />

      {/* Tarjeta Principal Glassmorphic */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Lado Izquierdo: Branding & Propuesta de Valor */}
        <div className="lg:col-span-5 p-8 sm:p-12 bg-gradient-to-br from-slate-900/90 via-[#0B1528] to-[#08101E] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
          <div>
            {/* Logo Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#10B981] via-[#0EA5E9] to-[#6366F1] flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 ring-2 ring-white/20">
                🐾
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block">Altus PetCloud</span>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
                  Veterinary OS &bull; 2.0
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              La plataforma de gestión clínica más rápida y elegante.
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Diseñada bajo los estándares de alta tecnología de <strong className="text-white">Altus MKT Digital</strong>. Hardware web nativo, expedientes en la nube y sincronización multi-sucursal.
            </p>

            {/* Features Highlights */}
            <div className="mt-8 space-y-3">
              {[
                { icon: '⚡', title: 'Hardware Web Plug & Play', desc: 'Lector de barras USB e impresión térmica 80mm' },
                { icon: '🩺', title: 'Kardex Clínico Inteligente', desc: 'Semaforización de criticidad y recetas digitales' },
                { icon: '💬', title: 'WhatsApp CRM Integrado', desc: 'Notificaciones automáticas y portal para tutores' },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-lg">{feat.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{feat.title}</p>
                    <p className="text-[11px] text-slate-400">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Izquierdo */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>© 2026 Altus MKT Digital</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
              SaaS Multi-Tenant
            </span>
          </div>
        </div>

        {/* Lado Derecho: Formulario Interactivo y Selector de Roles */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/40">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#0EA5E9] tracking-wider uppercase">Acceso Seguro</span>
              <h3 className="text-2xl font-bold text-white mt-1">Iniciar Sesión</h3>
              <p className="text-xs text-slate-300 mt-1">
                Elige tu perfil de trabajo para cargar permisos RBAC al instante.
              </p>
            </div>

            {/* Selector de Perfiles Visuales */}
            <div className="space-y-2.5 mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Selecciona tu perfil de acceso:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {roles.map((r) => {
                  const isSelected = rolePreset === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRolePreset(r.id)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 relative ${
                        isSelected
                          ? `bg-gradient-to-b ${r.gradient} ring-2 ring-emerald-400/50 shadow-lg scale-[1.02]`
                          : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">{r.badge}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-200">{r.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">✉️</span>
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
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Contraseña</label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#0EA5E9] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Mantener sesión iniciada</span>
                </label>
                <span className="text-[11px] text-slate-400">256-bit SSL</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 mt-2 rounded-2xl bg-gradient-to-r from-[#10B981] via-emerald-500 to-[#0EA5E9] text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar a Altus PetCloud</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
