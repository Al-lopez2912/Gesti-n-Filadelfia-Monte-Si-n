import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, Church, Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { systemConfig, updateSystemConfig, currentUser, auditLogs, songs, users } = useApp();

  const [congregationName, setCongregationName] = useState(systemConfig.congregationName);
  const [contactPerson, setContactPerson] = useState(systemConfig.contactPerson);
  const [contactEmail, setContactEmail] = useState(systemConfig.contactEmail);
  const [timezone, setTimezone] = useState(systemConfig.timezone);
  const [retentionDays, setRetentionDays] = useState(systemConfig.maxVideoRetentionDays);

  if (currentUser?.role !== 'SUPERADMIN') {
    return (
      <div className="p-8 text-center text-slate-500">
        Acceso restringido para SuperAdministradores.
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      congregationName,
      contactPerson,
      contactEmail,
      timezone,
      maxVideoRetentionDays: Number(retentionDays)
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      congregation: systemConfig.congregationName,
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser.name,
      usersCount: users.length,
      songsCount: songs.length,
      auditLogs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `auditoria_videoteca_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Configuración del Sistema
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Parámetros institucionales de la congregación y directrices de seguridad
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Congregation Info */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Church className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-900">
              Datos de la Congregación
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nombre de la congregación
              </label>
              <input
                type="text"
                value={congregationName}
                onChange={e => setCongregationName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Zona horaria de referencia
              </label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="America/Santo_Domingo (GMT-4)">America/Santo_Domingo (GMT-4)</option>
                <option value="America/Bogota (GMT-5)">America/Bogota (GMT-5)</option>
                <option value="America/Mexico_City (GMT-6)">America/Mexico_City (GMT-6)</option>
                <option value="America/Argentina/Buenos_Aires (GMT-3)">America/Argentina/Buenos_Aires (GMT-3)</option>
                <option value="Europe/Madrid (GMT+1)">Europe/Madrid (GMT+1)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Pastor o Responsable de Medios
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Correo electrónico institucional
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Storage & Policies */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
            Políticas de Almacenamiento y Seguridad
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Retención de permisos inactivos (días)
              </label>
              <input
                type="number"
                value={retentionDays}
                onChange={e => setRetentionDays(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Plazo para archivar solicitudes expiradas de la vista activa.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <span className="font-semibold text-slate-700 block mb-1">
                Almacenamiento Firebase Storage
              </span>
              <p className="text-slate-600">
                12 archivos MP4 activos (~680 MB en uso de 5 GB asignados).
              </p>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                Capacidad óptima para el volumen congregacional.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar cambios</span>
            </button>
          </div>
        </div>

        {/* Section 3: Data Export */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Exportar Registro de Auditoría
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Descargue una copia de seguridad en JSON con la trazabilidad completa de eventos y solicitudes
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar archivo JSON</span>
          </button>
        </div>
      </form>
    </div>
  );
};
