import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestItem } from '../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Calendar,
  X
} from 'lucide-react';

export const AdminRequestsView: React.FC = () => {
  const {
    requests,
    approveRequestWithCustomExpiration,
    rejectRequest
  } = useApp();

  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Custom Expiration Date & Time state (NO PRESETS! Exact date picker and time picker)
  // Default to upcoming Sunday evening at 23:59 for convenience, but fully customizable
  const getNextServiceDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [customExpDate, setCustomExpDate] = useState<string>(getNextServiceDate);
  const [customExpTime, setCustomExpTime] = useState<string>('23:59');
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const filteredRequests = requests.filter(req => {
    if (filterStatus === 'ALL') return true;
    return req.status === filterStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  const handleOpenReview = (req: RequestItem) => {
    setSelectedRequest(req);
  };

  const handleStartApproval = (req: RequestItem) => {
    setSelectedRequest(req);
    setShowApprovalModal(true);
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !customExpDate || !customExpTime) return;

    // Build ISO string from custom date and time
    const combinedIso = new Date(`${customExpDate}T${customExpTime}:00`).toISOString();
    approveRequestWithCustomExpiration(selectedRequest.id, combinedIso);

    setShowApprovalModal(false);
    setSelectedRequest(null);
  };

  const handleStartReject = (req: RequestItem) => {
    setSelectedRequest(req);
    setRejectionReason('El repertorio para este culto ya fue asignado previamente.');
    setShowRejectModal(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    rejectRequest(selectedRequest.id, rejectionReason);
    setShowRejectModal(false);
    setSelectedRequest(null);
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Pendiente</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Aprobada</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Rechazada</span>
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Expirada</span>
          </span>
        );
      case 'REVOKED':
        return (
          <span className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
            <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Revocada</span>
          </span>
        );
      default:
        return <span className="text-xs text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Gestión de Solicitudes de Acceso
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Revisión y autorización con fecha y hora personalizada para uso en servicios
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('PENDING')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterStatus === 'PENDING'
                ? 'bg-amber-600 text-white font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('APPROVED')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterStatus === 'APPROVED'
                ? 'bg-emerald-600 text-white font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aprobadas
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('REJECTED')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterStatus === 'REJECTED'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rechazadas
          </button>
        </div>
      </div>

      {/* Requests Table */}
      {filteredRequests.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Canción solicitada</th>
                  <th className="py-3 px-4">Fecha de solicitud</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredRequests.map(req => {
                  const reqDate = new Date(req.requestedAt);
                  const formattedDate = `${reqDate.toLocaleDateString('es-ES')} ${reqDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
                  const isPending = req.status === 'PENDING';

                  return (
                    <tr
                      key={req.id}
                      className={`hover:bg-slate-50/75 transition-colors ${
                        isPending ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{req.userName}</div>
                        <div className="text-[11px] text-slate-400">{req.userEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{req.songName}</div>
                        <div className="text-[11px] text-slate-400">{req.folderName || 'Sin carpeta'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4">
                        {renderStatus(req.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartReject(req)}
                              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                            >
                              Rechazar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartApproval(req)}
                              className="px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
                            >
                              Conceder acceso
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenReview(req)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                          >
                            Ver detalle
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
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto space-y-3">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">
            No hay solicitudes en esta vista
          </h3>
          <p className="text-xs text-slate-500">
            Todas las solicitudes del repertorio se encuentran al día o no coinciden con el filtro seleccionado.
          </p>
        </div>
      )}

      {/* CUSTOM PERMISSION EXPIRATION MODAL (Section 12 requirement: NO PRESETS) */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Conceder Acceso Temporal
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Establezca la fecha y hora exacta de expiración
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Request Summary */}
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-slate-500">Usuario:</span>
                <span className="font-semibold text-slate-800">{selectedRequest.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Canción:</span>
                <span className="font-semibold text-slate-800">{selectedRequest.songName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Carpeta:</span>
                <span className="text-slate-600">{selectedRequest.folderName || 'Sin carpeta'}</span>
              </div>
            </div>

            {/* Custom Expiration Date & Time form */}
            <form onSubmit={handleConfirmApproval} className="space-y-4 pt-1">
              <div className="grid grid-cols-2 gap-3">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Fecha de expiración
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={customExpDate}
                      onChange={e => setCustomExpDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    />
                  </div>
                </div>

                {/* Time Picker */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Hora de expiración
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      required
                      value={customExpTime}
                      onChange={e => setCustomExpTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Al llegar la fecha y hora seleccionada, el permiso se revocará automáticamente y el usuario ya no podrá reproducir el video.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Conceder acceso</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT REQUEST MODAL */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Rechazar Solicitud de Acceso
              </h3>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              ¿Está seguro de que desea denegar la solicitud de <strong>{selectedRequest.userName}</strong> para el canto <strong>"{selectedRequest.songName}"</strong>?
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Motivo de rechazo (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                  placeholder="Explique brevemente la razón al usuario..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors"
                >
                  Confirmar rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL (Read-only review of existing request) */}
      {selectedRequest && !showApprovalModal && !showRejectModal && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Detalle de Solicitud
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Usuario:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.userName} ({selectedRequest.userEmail})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Canción:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.songName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Carpeta:</span>
                <span className="text-slate-700">{selectedRequest.folderName || 'Sin carpeta'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Fecha de solicitud:</span>
                <span className="font-mono tabular-nums text-slate-700">
                  {new Date(selectedRequest.requestedAt).toLocaleString('es-ES')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Estado actual:</span>
                <div>{renderStatus(selectedRequest.status)}</div>
              </div>
              {selectedRequest.reviewedByName && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Revisado por:</span>
                  <span className="text-slate-700">{selectedRequest.reviewedByName}</span>
                </div>
              )}
              {selectedRequest.rejectionReason && (
                <div className="py-1">
                  <span className="text-slate-500 block mb-0.5">Motivo de rechazo:</span>
                  <p className="p-2 bg-slate-50 rounded text-slate-700 border border-slate-200">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
