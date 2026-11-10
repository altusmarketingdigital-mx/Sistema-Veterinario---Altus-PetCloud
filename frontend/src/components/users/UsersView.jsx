import React, { useState } from 'react';

export default function UsersView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      full_name: 'Dra. Miriam Castro',
      email: 'miriam.castro@altuspetcloud.com',
      role: 'ADMIN',
      phone: '55 9988 7766',
      professional_license: 'VET-894120',
      branch: 'Sucursal Matriz (Insurgentes)',
      status: 'ACTIVO',
      avatar: '👩‍⚕️'
    },
    {
      id: 'usr-2',
      full_name: 'Dr. Roberto Mendoza',
      email: 'roberto.mendoza@altuspetcloud.com',
      role: 'VETERINARIAN',
      phone: '55 4433 2211',
      professional_license: 'VET-332190',
      branch: 'Hospital 24/7 Del Valle',
      status: 'ACTIVO',
      avatar: '👨‍⚕️'
    },
    {
      id: 'usr-3',
      full_name: 'Sofia Valenzuela',
      email: 'sofia.valenzuela@altuspetcloud.com',
      role: 'RECEPTIONIST',
      phone: '55 1122 3344',
      professional_license: 'N/A',
      branch: 'Sucursal Matriz (Insurgentes)',
      status: 'ACTIVO',
      avatar: '👩‍💼'
    }
  ]);

  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    role: 'VETERINARIAN',
    phone: '',
    professional_license: '',
    branch: 'Sucursal Matriz (Insurgentes)',
    password: ''
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.full_name || !newUser.email) {
      alert('Por favor introduce el nombre y correo del colaborador.');
      return;
    }

    const created = {
      id: `usr-${Date.now()}`,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone || 'No registrado',
      professional_license: newUser.professional_license || 'N/A',
      branch: newUser.branch,
      status: 'ACTIVO',
      avatar: newUser.role === 'ADMIN' ? '👑' : newUser.role === 'VETERINARIAN' ? '🩺' : '💳'
    };

    setUsers([...users, created]);
    setIsModalOpen(false);
    setNewUser({
      full_name: '',
      email: '',
      role: 'VETERINARIAN',
      phone: '',
      professional_license: '',
      branch: 'Sucursal Matriz (Insurgentes)',
      password: ''
    });
  };

  const filteredUsers = users.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-7 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
            <span>👥</span> GESTIÓN DE PERSONAL & ROLES RBAC
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Usuarios del Sistema
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra a los médicos veterinarios, recepcionistas y administradores con acceso a la plataforma.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-[#10B981] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-2xl text-xs font-extrabold transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
        >
          <span>➕</span> Registrar Nuevo Usuario
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar personal por nombre, correo o rol..."
          className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
        />
      </div>

      {/* Grid de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                    {u.avatar}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{u.full_name}</h3>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  {u.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Rol de Acceso:</span>
                  <span className="font-bold text-white px-2 py-0.5 rounded-md bg-white/10">
                    {u.role === 'ADMIN' ? '👑 Administrador' : u.role === 'VETERINARIAN' ? '🩺 Médico Veterinario' : '💳 Recepción / Caja'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Cédula Profesional:</span>
                  <span className="font-mono text-emerald-300 font-bold">{u.professional_license}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Sucursal Asignada:</span>
                  <span className="text-slate-300 font-semibold truncate max-w-[150px]">{u.branch}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => alert(`Permisos y accesos de ${u.full_name} están al día.`)}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition text-center"
              >
                ⚙️ Configurar Permisos
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Registrar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-black text-white">Registrar Colaborador</h2>
                <p className="text-xs text-slate-400">Crea una cuenta con credenciales y permisos RBAC.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="Ej. Dr. Alejandro Gómez"
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico (Login) *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="doctor@altuspetcloud.com"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Inicial</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rol en el Sistema</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="ADMIN">Administrador General</option>
                    <option value="VETERINARIAN">Médico Veterinario</option>
                    <option value="RECEPTIONIST">Recepción & Caja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cédula Profesional</label>
                  <input
                    type="text"
                    value={newUser.professional_license}
                    onChange={(e) => setNewUser({ ...newUser, professional_license: e.target.value })}
                    placeholder="Ej. VET-123456 (si aplica)"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="55 0000 0000"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sucursal Asignada</label>
                  <select
                    value={newUser.branch}
                    onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="Sucursal Matriz (Insurgentes)">Sucursal Matriz (Insurgentes)</option>
                    <option value="Sucursal Coyoacán Spa">Sucursal Coyoacán Spa</option>
                    <option value="Hospital 24/7 Del Valle">Hospital 24/7 Del Valle</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-emerald-500/25"
                >
                  Crear Usuario & Enviar Accesos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
