import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, History, Shield, Filter } from 'lucide-react';

export const AdminHistoryView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    // Action filter
    if (filterAction !== 'ALL' && log.action !== filterAction) {
      return false;
    }
    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'acceso_concedido':
        return <span className="text-emerald-700 font-medium">Acceso Concedido</span>;
      case 'acceso_rechazado':
        return <span className="text-rose-700 font-medium">Acceso Rechazado</span>;
      case 'solicitud_creada':
        return <span className="text-amber-700 font-medium">Solicitud Creada</span>;
      case 'acceso_expirado':
        return <span className="text-slate-600 font-medium">Acceso Expirado</span>;
      case 'acceso_revocado':
        return <span className="text-rose-800 font-medium">Acceso Revocado</span>;
      case 'cancion_subida':
        return <span className="text-blue-700 font-medium">Canto Subido</span>;
      case 'usuario_creado':
        return <span className="text-purple-700 font-medium">Usuario Creado</span>;
      default:
        return <span className="text-slate-600 font-medium capitalize">{action.replace(/_/g, ' ')}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Historial y Auditoría
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registro de trazabilidad cronológico de solicitudes, permisos otorgados y actividad administrativa
          </p>
        </div>

        {/* Informative quiet indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">
          <Shield className="w-3.5 h-3.5 text-slate-600" />
          <span>Solo lectura · Trazabilidad oficial</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuario, canto o detalle..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">Todas las acciones ({auditLogs.length})</option>
            <option value="acceso_concedido">Accesos concedidos</option>
            <option value="solicitud_creada">Solicitudes creadas</option>
            <option value="acceso_rechazado">Solicitudes rechazadas</option>
            <option value="acceso_expirado">Accesos expirados</option>
            <option value="cancion_subida">Cantos subidos</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Fecha y hora</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Tipo de acción</th>
                  <th className="py-3 px-4">Descripción detallada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredLogs.map(log => {
                  const logDate = new Date(log.timestamp);
                  const formattedDate = `${logDate.toLocaleDateString('es-ES')} ${logDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-900">{log.actorName}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto space-y-3">
          <History className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">
            Todavía no hay actividad registrada
          </h3>
          <p className="text-xs text-slate-500">
            Los eventos del sistema se registrarán automáticamente a medida que se gestionen permisos y cantos.
          </p>
        </div>
      )}
    </div>
  );
};
