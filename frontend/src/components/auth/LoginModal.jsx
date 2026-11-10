import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolePreset, setRolePreset] = useState('ADMIN');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de login con cambio de rol en frontend
    const usersByRole = {
      ADMIN: {
        id: 'u-1',
        full_name: 'Dra. Miriam Castro (Admin)',
        email: email || 'admin@altuspetcloud.com',
        role: 'ADMIN',
        professional_license: 'VET-894120'
      },
      VETERINARIAN: {
        id: 'u-2',
        full_name: 'Dr. Roberto Mendoza',
        email: email || 'vet@altuspetcloud.com',
        role: 'VETERINARIAN',
        professional_license: 'VET-332190'
      },
      RECEPTIONIST: {
        id: 'u-3',
        full_name: 'Sofia Valenzuela (Recepción)',
        email: email || 'recepcion@altuspetcloud.com',
        role: 'RECEPTIONIST'
      }
    };

    login(usersByRole[rolePreset], 'jwt-auth-token-example');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400">Control de acceso seguro Altus PetCloud</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Simular Rol RBAC:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ADMIN', label: 'Admin' },
                { id: 'VETERINARIAN', label: 'Médico' },
                { id: 'RECEPTIONIST', label: 'Recepción' }
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRolePreset(r.id)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    rolePreset === r.id
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@altuspetcloud.com"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-sm transition"
          >
            Acceder a la Plataforma
          </button>
        </form>
      </div>
    </div>
  );
}
