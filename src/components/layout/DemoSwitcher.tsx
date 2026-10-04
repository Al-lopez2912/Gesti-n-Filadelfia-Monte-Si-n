/**
 * COMPONENTE TEMPORAL DE DESARROLLO (DEMO SWITCHER)
 * Diseñado exclusivamente para evaluar y validar los flujos de los tres roles
 * en la fase de prototipo antes de la conexión con Firebase Auth.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, ShieldAlert, RotateCcw } from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const { currentUser, loginAsUser, resetAllData } = useApp();

  return (
    <aside aria-label="Selector de demostración" className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
          Modo Demostración
        </span>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <span className="text-slate-400 hidden md:inline">
          Cambiar rol activo para evaluar flujos y permisos:
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => loginAsUser('usr-mateo')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            currentUser?.role === 'USUARIO_BASICO' && currentUser.uid === 'usr-mateo'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Ver aplicación como Mateo Rivas (Usuario Básico: solicita cantos y reproduce)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Usuario Básico (Mateo)</span>
        </button>

        <button
          type="button"
          onClick={() => loginAsUser('usr-raquel')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            currentUser?.role === 'ADMIN' && currentUser.uid === 'usr-raquel'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Ver aplicación como Raquel Peña (Admin: aprueba solicitudes, sube cantos y gestiona biblioteca)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin (Raquel)</span>
        </button>

        <button
          type="button"
          onClick={() => loginAsUser('usr-daniel')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            currentUser?.role === 'SUPERADMIN'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Ver aplicación como Pastor Daniel (SuperAdmin: administra usuarios, roles y configuración global)"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SuperAdmin (Pastor Daniel)</span>
        </button>

        <button
          type="button"
          onClick={resetAllData}
          className="ml-2 text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          title="Restablecer datos originales del prototipo"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden lg:inline">Restablecer datos</span>
        </button>
      </div>
    </aside>
  );
};
