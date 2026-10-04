import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Music,
  CheckCircle2,
  ArrowRight,
  Upload,
  Calendar
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    currentUser,
    requests,
    songs,
    permissions,
    auditLogs,
    setActiveTab
  } = useApp();

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const activeSongsCount = songs.filter(s => s.status === 'activo').length;
  const activePermissionsCount = permissions.filter(p => p.status === 'ACTIVE').length;

  const recentRequests = requests.slice(0, 4);
  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Panel Operativo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Resumen de actividad, solicitudes pendientes y estado de la videoteca
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('biblioteca')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Music className="w-3.5 h-3.5 text-slate-500" />
            <span>Ver biblioteca</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('solicitudes')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Revisar solicitudes ({pendingRequests.length})</span>
          </button>
        </div>
      </div>

      {/* Operational Key Metric Cards (Clean, purposeful, no vanity AI slop) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Solicitudes pendientes */}
        <div
          onClick={() => setActiveTab('solicitudes')}
          className={`p-4 rounded-lg border transition-colors cursor-pointer ${
            pendingRequests.length > 0
              ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Solicitudes pendientes
            </span>
            <Clock className={`w-4 h-4 ${pendingRequests.length > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {pendingRequests.length}
            </span>
            <span className="text-xs text-slate-500">
              {pendingRequests.length === 1 ? 'requiere atención' : 'requieren atención'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-blue-700 font-medium flex items-center gap-1">
            <span>Ir a solicitudes</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 2: Canciones activas */}
        <div
          onClick={() => setActiveTab('biblioteca')}
          className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Canciones activas
            </span>
            <Music className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {activeSongsCount}
            </span>
            <span className="text-xs text-slate-500">archivos MP4 listos</span>
          </div>
          <p className="mt-2 text-[11px] text-blue-700 font-medium flex items-center gap-1">
            <span>Explorar repertorio</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>

        {/* Card 3: Permisos vigentes */}
        <div className="p-4 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Permisos vigentes hoy
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {activePermissionsCount}
            </span>
            <span className="text-xs text-slate-500">autorizaciones activas</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Control de expiración automática habilitado
          </p>
        </div>
      </div>

      {/* Main Grid: Pending Requests Priority + Activity History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority: Pending & Recent Requests (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Solicitudes Recientes
            </h2>
            <button
              onClick={() => setActiveTab('solicitudes')}
              className="text-xs text-blue-700 hover:text-blue-800 font-medium"
            >
              Ver todas ({requests.length})
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Usuario</th>
                    <th className="py-2.5 px-4">Canto</th>
                    <th className="py-2.5 px-4">Fecha</th>
                    <th className="py-2.5 px-4">Estado</th>
                    <th className="py-2.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {recentRequests.map(req => {
                    const reqDate = new Date(req.requestedAt);
                    const formattedDate = `${reqDate.toLocaleDateString('es-ES')} ${reqDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {req.userName}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {req.songName}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                          {formattedDate}
                        </td>
                        <td className="py-3 px-4">
                          {req.status === 'PENDING' ? (
                            <span className="text-amber-700 font-medium">Pendiente</span>
                          ) : req.status === 'APPROVED' ? (
                            <span className="text-emerald-700 font-medium">Aprobada</span>
                          ) : (
                            <span className="text-slate-500">{req.status}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setActiveTab('solicitudes')}
                            className="text-xs text-blue-700 hover:text-blue-900 font-medium"
                          >
                            Gestionar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Traceability: Recent Actions Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Últimas Acciones
            </h2>
            <button
              onClick={() => setActiveTab('historial')}
              className="text-xs text-blue-700 hover:text-blue-800 font-medium"
            >
              Ver historial
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3.5 shadow-xs">
            {recentLogs.map(log => {
              const logDate = new Date(log.timestamp);
              const timeStr = logDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={log.id} className="text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                    <span className="font-medium text-slate-700">{log.actorName}</span>
                    <span className="font-mono tabular-nums">{timeStr}</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    {log.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
