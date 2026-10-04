import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, requests, logout } = useApp();

  if (!currentUser) return null;

  // Pending requests count for admins
  const pendingRequestsCount = requests.filter(r => r.status === 'PENDING').length;

  const role = currentUser.role;

  // Nav items per role
  const getNavItems = () => {
    if (role === 'USUARIO_BASICO') {
      return [
        { id: 'biblioteca', label: 'Biblioteca' },
        { id: 'solicitudes', label: 'Mis solicitudes' },
        { id: 'cuenta', label: 'Mi cuenta' }
      ];
    }

    if (role === 'ADMIN') {
      return [
        { id: 'inicio', label: 'Inicio' },
        { id: 'biblioteca', label: 'Biblioteca' },
        {
          id: 'solicitudes',
          label: pendingRequestsCount > 0 ? `Solicitudes (${pendingRequestsCount})` : 'Solicitudes'
        },
        { id: 'historial', label: 'Historial' },
        { id: 'cuenta', label: 'Mi cuenta' }
      ];
    }

    // SUPERADMIN
    return [
      { id: 'inicio', label: 'Inicio' },
      { id: 'biblioteca', label: 'Biblioteca' },
      {
        id: 'solicitudes',
        label: pendingRequestsCount > 0 ? `Solicitudes (${pendingRequestsCount})` : 'Solicitudes'
      },
      { id: 'historial', label: 'Historial' },
      { id: 'usuarios', label: 'Usuarios' },
      { id: 'configuracion', label: 'Configuración' },
      { id: 'cuenta', label: 'Mi cuenta' }
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab(role === 'USUARIO_BASICO' ? 'biblioteca' : 'inicio')}
              className="text-left group"
            >
              <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                Videoteca de Cantos
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Text with subtle active highlight) */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                    isActive
                      ? 'text-slate-950 bg-slate-100 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: User Action & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('cuenta')}
              className="flex items-center gap-2 text-left group"
              title="Ver mi cuenta y permisos"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
                {currentUser.avatarInitials}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-medium text-slate-800 group-hover:text-slate-950 transition-colors leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 capitalize">
                  {currentUser.role === 'USUARIO_BASICO'
                    ? 'Usuario Básico'
                    : currentUser.role === 'ADMIN'
                    ? 'Administrador'
                    : 'SuperAdmin'}
                </p>
              </div>
            </button>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
