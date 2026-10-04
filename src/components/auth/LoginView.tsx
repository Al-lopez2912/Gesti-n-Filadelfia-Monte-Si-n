import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogIn, UserCheck, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginWithCredentials, loginAsUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      loginWithCredentials(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Videoteca de Cantos Espirituales
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Plataforma privada de video congregacional para transmisión en Google Meet
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Real-style Login Card */}
        <div className="bg-white py-7 px-6 shadow-sm border border-slate-200 rounded-xl space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ingrese con sus credenciales de colaborador
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nombre@congregacion.org"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar sesión</span>
            </button>
          </form>

          {/* Quick Demo Selector for Reviewers (Clearly separated as required) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Acceso Rápido de Evaluación (Demo)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Seleccione un perfil para explorar el comportamiento de cada rol:
            </p>

            <div className="space-y-2">
              {/* Mateo: Basic User */}
              <button
                type="button"
                onClick={() => loginAsUser('usr-mateo')}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                    MR
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-900">Mateo Rivas</div>
                    <div className="text-[11px] text-slate-500">Usuario Básico · Solicita y reproduce cantos</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>

              {/* Raquel: Admin */}
              <button
                type="button"
                onClick={() => loginAsUser('usr-raquel')}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                    RP
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-900">Raquel Peña</div>
                    <div className="text-[11px] text-slate-500">Admin · Aprueba solicitudes y sube videos</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>

              {/* Daniel: SuperAdmin */}
              <button
                type="button"
                onClick={() => loginAsUser('usr-daniel')}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold">
                    DS
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-900">Pastor Daniel Santos</div>
                    <div className="text-[11px] text-slate-500">SuperAdmin · Control de usuarios y sistema</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Uso exclusivo para servicios de culto de la congregación · Prototipo interactivo
        </p>
      </div>
    </div>
  );
};
