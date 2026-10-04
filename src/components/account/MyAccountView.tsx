import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, CheckCircle2, XCircle } from 'lucide-react';

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

  const permissionsList = [
    {
      title: 'Consultar biblioteca de cantos',
      allowed: true,
      description: 'Acceso al catálogo de videos y búsqueda temática.'
    },
    {
      title: 'Solicitar permisos de reproducción',
      allowed: true,
      description: 'Generar peticiones para participar en cultos de viernes o domingo.'
    },
    {
      title: 'Reproducir videos autorizados para Google Meet',
      allowed: true,
      description: 'Pantalla completa limpia sin distracciones durante la transmisión.'
    },
    {
      title: 'Subir archivos MP4 y organizar carpetas',
      allowed: role === 'ADMIN' || role === 'SUPERADMIN',
      description: 'Carga de nuevos videos desde memorias USB o archivos locales.'
    },
    {
      title: 'Aprobar o rechazar solicitudes con fecha personalizada',
      allowed: role === 'ADMIN' || role === 'SUPERADMIN',
      description: 'Definir fecha y hora exacta de expiración para cada usuario.'
    },
    {
      title: 'Consultar historial y trazabilidad',
      allowed: role === 'ADMIN' || role === 'SUPERADMIN',
      description: 'Registro de auditoría de todas las acciones del sistema.'
    },
    {
      title: 'Administrar cuentas y asignar roles',
      allowed: role === 'SUPERADMIN',
      description: 'Crear usuarios, cambiar privilegios y suspender cuentas.'
    },
    {
      title: 'Modificar configuración global de la congregación',
      allowed: role === 'SUPERADMIN',
      description: 'Ajuste de zona horaria, horarios de culto y almacenamiento.'
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Mi Cuenta
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Información del usuario y resumen de atribuciones según su rol
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

      {/* Role Permissions Breakdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Privilegios del Rol Actual
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Los permisos son validados en el cliente para el prototipo y serán reforzados por Firebase Security Rules en producción.
          </p>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {permissionsList.map((perm, idx) => (
            <div key={idx} className="py-2.5 flex items-start gap-3">
              {perm.allowed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${perm.allowed ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                  {perm.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {perm.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
