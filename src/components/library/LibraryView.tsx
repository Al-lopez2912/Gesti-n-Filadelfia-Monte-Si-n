import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SongCard } from './SongCard';
import { SongDetailModal } from './SongDetailModal';
import { UploadSongModal } from './UploadSongModal';
import { Song } from '../../types';
import {
  Search,
  Upload,
  FolderPlus,
  Music,
  Folder as FolderIcon
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    currentUser,
    folders,
    songs,
    selectedFolderId,
    setSelectedFolderId,
    searchQuery,
    setSearchQuery,
    selectedSongDetail,
    setSelectedSongDetail,
    createFolder
  } = useApp();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  const isAdminOrSuper = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN';

  // Filter active songs
  const activeSongs = songs.filter(s => s.status === 'activo');

  const filteredSongs = activeSongs.filter(song => {
    // Folder filter
    if (selectedFolderId && song.folderId !== selectedFolderId) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = song.name.toLowerCase().includes(q);
      const folder = song.folderId ? folders.find(f => f.id === song.folderId) : null;
      const matchFolder = folder ? folder.name.toLowerCase().includes(q) : false;
      const matchDesc = song.description?.toLowerCase().includes(q);
      return matchName || matchFolder || matchDesc;
    }
    return true;
  });

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName, newFolderDesc);
      setNewFolderName('');
      setNewFolderDesc('');
      setIsNewFolderOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Operational Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Biblioteca de Cantos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Repertorio de videos de cánticos espirituales para el servicio congregacional
          </p>
        </div>

        {/* Admin actions */}
        {isAdminOrSuper && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNewFolderOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>Nueva carpeta</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir canción</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Bar & Folders Navigation */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, carpeta o letra..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Folder filter buttons (interactive segmented control) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedFolderId(null)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedFolderId === null
                ? 'bg-slate-900 text-white font-medium shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Todos ({activeSongs.length})</span>
          </button>

          {folders.map(folder => {
            const count = activeSongs.filter(s => s.folderId === folder.id).length;
            const isSelected = selectedFolderId === folder.id;
            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => setSelectedFolderId(folder.id)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white font-medium shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FolderIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>{folder.name}</span>
                <span className="font-mono text-[11px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Songs Grid */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSongs.map(song => (
            <SongCard
              key={song.id}
              song={song}
              onOpenDetails={(s: Song) => setSelectedSongDetail(s)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Music className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            Todavía no hay canciones en esta carpeta
          </h3>
          <p className="text-xs text-slate-500">
            {searchQuery
              ? `No se encontraron resultados para "${searchQuery}". Pruebe con otro término.`
              : 'Seleccione otra categoría o espere a que el administrador suba nuevos videos.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-blue-600 hover:underline pt-2 font-medium"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {/* Song Details Modal */}
      {selectedSongDetail && (
        <SongDetailModal
          song={selectedSongDetail}
          onClose={() => setSelectedSongDetail(null)}
        />
      )}

      {/* Upload Song Modal */}
      <UploadSongModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      {/* New Folder Modal */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Crear nueva carpeta</h3>
              <p className="text-xs text-slate-500 mt-0.5">Organice los cantos por servicio o temática</p>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre de la carpeta
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder="Ej. Cantos de Gratitud"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Descripción (Opcional)
                </label>
                <input
                  type="text"
                  value={newFolderDesc}
                  onChange={e => setNewFolderDesc(e.target.value)}
                  placeholder="Ej. Para reuniones especiales de alabanza"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded"
                >
                  Crear carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
