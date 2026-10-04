import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Clock, CheckCircle2, AlertCircle, XCircle, FileQuestion } from 'lucide-react';

export const UserRequestsView: React.FC = () => {
  const { currentUser, requests, songs, startPlayingSong, setSelectedSongDetail } = useApp();

  if (!currentUser) return null;

  // Filter requests for the current user
  const userRequests = requests.filter(r => r.userId === currentUser.uid);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acceso disponible</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pendiente de revisión</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Acceso expirado</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Rechazada</span>
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  const handlePlaySong = (songId: string) => {
    const song = songs.find(s => s.id === songId);
    if (song) {
      startPlayingSong(song);
    }
  };

  const handleOpenSong = (songId: string) => {
    const song = songs.find(s => s.id === songId);
    if (song) {
      setSelectedSongDetail(song);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Mis Solicitudes de Acceso
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Historial de cantos solicitados para participación en los servicios congregacionales
        </p>
      </div>

      {userRequests.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Canción</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Fecha de solicitud</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {userRequests.map(req => {
                  const reqDate = new Date(req.requestedAt);
                  const formattedDate = `${reqDate.toLocaleDateString('es-ES')} ${reqDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {req.songName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {req.folderName || 'Sin carpeta'}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500">
                        {formattedDate}
                      </td>
                      <td className="py-3.5 px-4">
                        {renderStatus(req.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {req.status === 'APPROVED' ? (
                          <button
                            type="button"
                            onClick={() => handlePlaySong(req.songId)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Reproducir</span>
                          </button>
                        ) : req.status === 'EXPIRED' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenSong(req.songId)}
                            className="px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          >
                            Solicitar de nuevo
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenSong(req.songId)}
                            className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-900 rounded"
                          >
                            Ver canto
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <FileQuestion className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            No tienes solicitudes pendientes
          </h3>
          <p className="text-xs text-slate-500">
            Explora la biblioteca de cantos para solicitar acceso a los videos que necesites presentar.
          </p>
        </div>
      )}
    </div>
  );
};
