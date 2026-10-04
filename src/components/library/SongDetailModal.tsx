import React, { useState } from 'react';
import { Song } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Play,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  Edit2,
  FolderInput,
  Archive,
  Calendar
} from 'lucide-react';

interface SongDetailModalProps {
  song: Song | null;
  onClose: () => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({ song, onClose }) => {
  const {
    currentUser,
    folders,
    getSongAccessStatus,
    requestSongAccess,
    startPlayingSong,
    renameSong,
    moveSong,
    archiveSong,
    getSongFolderName
  } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isMovingFolder, setIsMovingFolder] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [justRequested, setJustRequested] = useState(false);

  if (!song) return null;

  const isBasic = currentUser?.role === 'USUARIO_BASICO';
  const isAdminOrSuper = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN';
  const access = getSongAccessStatus(song.id);

  const handleRequestAccess = () => {
    requestSongAccess(song.id);
    setJustRequested(true);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      renameSong(song.id, editedName);
      setIsEditingName(false);
    }
  };

  const handleSaveMove = () => {
    moveSong(song.id, selectedFolderId || null);
    setIsMovingFolder(false);
  };

  const handleArchive = () => {
    if (window.confirm(`¿Desea archivar el canto "${song.name}"? Ya no aparecerá en la biblioteca principal.`)) {
      archiveSong(song.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl border border-slate-200">
        {/* Header with thumbnail preview */}
        <div className="relative aspect-video w-full bg-slate-950">
          <img
            src={song.thumbnailUrl}
            alt={song.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title on bottom of media banner */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <p className="text-xs text-slate-300 font-medium">{getSongFolderName(song)}</p>
            <h2 className="text-lg font-semibold tracking-tight text-white line-clamp-1">
              {song.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Metadata clean row */}
          <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
            <span>Duración: <strong className="font-mono text-slate-700">{song.duration}</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Tamaño: <strong className="font-mono text-slate-700">{song.fileSize}</strong></span>
            {isAdminOrSuper && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Subido por: <strong className="text-slate-700">{song.uploadedByName}</strong></span>
              </>
            )}
          </div>

          {/* Description / Stanza snippet */}
          {song.description && (
            <p className="text-xs text-slate-600 leading-relaxed">
              {song.description}
            </p>
          )}

          {/* Access Status Panel */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Estado de permiso
                </p>
                <div className="mt-1">
                  {access.state === 'ACCESO_AUTORIZADO' ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Acceso autorizado para reproducción</span>
                    </div>
                  ) : access.state === 'SOLICITUD_PENDIENTE' || justRequested ? (
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Solicitud pendiente de revisión</span>
                    </div>
                  ) : access.state === 'ACCESO_EXPIRADO' ? (
                    <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Tu acceso a esta canción ha expirado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Sin permiso de reproducción activo</span>
                    </div>
                  )}
                </div>

                {/* Helpful instructions for basic users */}
                {isBasic && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    {access.state === 'ACCESO_AUTORIZADO'
                      ? 'Puede reproducir este video y compartir pantalla en Google Meet durante el culto.'
                      : access.state === 'SOLICITUD_PENDIENTE' || justRequested
                      ? 'Un administrador del equipo de medios revisará su solicitud en breve.'
                      : access.state === 'ACCESO_EXPIRADO'
                      ? 'El período autorizado finalizó. Puede solicitar acceso nuevamente si requiere usarlo.'
                      : 'Presione "Solicitar acceso" para que el administrador habilite el video.'}
                  </p>
                )}
              </div>

              {/* Expiration detail if active */}
              {access.permission && access.state === 'ACCESO_AUTORIZADO' && (
                <div className="text-right text-[11px] text-slate-500 shrink-0">
                  <span className="flex items-center gap-1 justify-end text-slate-400">
                    <Calendar className="w-3 h-3" /> Vence:
                  </span>
                  <span className="font-medium text-slate-700 font-mono tabular-nums">
                    {new Date(access.permission.expiresAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Management Actions */}
          {isAdminOrSuper && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Administración del canto
              </p>

              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-blue-600"
                    placeholder="Nuevo nombre del canto"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded hover:bg-slate-800"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-2.5 py-1.5 text-xs border border-slate-200 text-slate-600 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              ) : isMovingFolder ? (
                <div className="flex gap-2">
                  <select
                    value={selectedFolderId}
                    onChange={e => setSelectedFolderId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-blue-600 bg-white"
                  >
                    <option value="">Sin carpeta (Desasignar)</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveMove}
                    className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded hover:bg-slate-800"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMovingFolder(false)}
                    className="px-2.5 py-1.5 text-xs border border-slate-200 text-slate-600 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(song.name);
                      setIsEditingName(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Editar nombre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFolderId(song.folderId || '');
                      setIsMovingFolder(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    <FolderInput className="w-3.5 h-3.5 text-slate-500" />
                    <span>Mover de carpeta</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleArchive}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded transition-colors ml-auto"
                  >
                    <Archive className="w-3.5 h-3.5 text-rose-500" />
                    <span>Archivar</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors"
            >
              Cerrar
            </button>

            {access.state === 'ACCESO_AUTORIZADO' ? (
              <button
                type="button"
                onClick={() => startPlayingSong(song)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Reproducir para presentación</span>
              </button>
            ) : access.state === 'SOLICITUD_PENDIENTE' || justRequested ? (
              <button
                type="button"
                disabled
                className="px-4 py-2 text-xs font-medium text-slate-400 bg-slate-100 rounded-md cursor-not-allowed"
              >
                Solicitud pendiente
              </button>
            ) : access.state === 'ACCESO_EXPIRADO' ? (
              <button
                type="button"
                onClick={handleRequestAccess}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
              >
                Solicitar acceso nuevamente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRequestAccess}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
              >
                Solicitar acceso
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
