import React from 'react';
import { Song } from '../../types';
import { useApp } from '../../context/AppContext';
import { Play, Lock, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SongCardProps {
  song: Song;
  onOpenDetails: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onOpenDetails }) => {
  const { currentUser, getSongAccessStatus, startPlayingSong, getSongFolderName } = useApp();
  const access = getSongAccessStatus(song.id);

  const isBasic = currentUser?.role === 'USUARIO_BASICO';
  const isAuthorized = access.state === 'ACCESO_AUTORIZADO';
  const isPending = access.state === 'SOLICITUD_PENDIENTE';
  const isExpired = access.state === 'ACCESO_EXPIRADO';

  const renderStatus = () => {
    if (isAuthorized) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Acceso autorizado</span>
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Solicitud pendiente</span>
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="flex items-center gap-1.5 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Acceso expirado</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        <span>Sin permiso</span>
      </span>
    );
  };

  return (
    <article
      onClick={() => onOpenDetails(song)}
      className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col hover:border-slate-300 transition-colors cursor-pointer"
    >
      {/* Thumbnail Aspect 16:9 */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        <img
          src={song.thumbnailUrl}
          alt={song.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Small Play overlay trigger */}
        {isAuthorized && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              startPlayingSong(song);
            }}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-md bg-black/75 hover:bg-blue-600 text-white backdrop-blur-sm transition-colors"
            title="Reproducir video"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        )}

        {/* Duration bottom left */}
        <span className="absolute bottom-2.5 left-2.5 text-[11px] font-mono tabular-nums text-white bg-black/70 px-1.5 py-0.5 rounded">
          {song.duration}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
            {song.name}
          </h3>

          {/* Zero-pill metadata */}
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="truncate">{getSongFolderName(song)}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums shrink-0">{song.fileSize}</span>
          </div>
        </div>

        {/* Access Status & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>{renderStatus()}</div>

          <div className="shrink-0">
            {isAuthorized ? (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  startPlayingSong(song);
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-900 hover:text-blue-700 hover:bg-slate-50 rounded transition-colors"
              >
                Reproducir
              </button>
            ) : (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onOpenDetails(song);
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors"
              >
                {isBasic ? 'Solicitar' : 'Detalles'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
