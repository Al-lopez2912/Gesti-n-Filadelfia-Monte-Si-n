import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut } from 'lucide-react';

export const MyAccountView: React.FC = () => {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  const role = currentUser.role;

  const getRoleTitle = () => {
    switch (role) {
      case 'SUPERADMIN': return 'SuperAdmin (Control Total)';
      case 'ADMIN': return 'Administrador de Biblioteca';
      default: return 'Usuario Básico (Colaborador)';
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Mi Cuenta
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Información del usuario y estado de la cuenta
        </p>
      </div>

      {/* User Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-bold">
              {currentUser.avatarInitials}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="font-medium text-blue-700">{getRoleTitle()}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-emerald-700 font-medium">Cuenta Activa</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-md transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

