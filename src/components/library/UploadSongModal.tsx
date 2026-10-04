import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, CheckCircle2, Film } from 'lucide-react';

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadSongModal: React.FC<UploadSongModalProps> = ({ isOpen, onClose }) => {
  const { folders, uploadSong, currentUser } = useApp();

  const [name, setName] = useState('');
  const [folderId, setFolderId] = useState(folders[0]?.id || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('3:45');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto-populate name if empty
      if (!name) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingrese el nombre del canto.');
      return;
    }
    if (!folderId) {
      setError('Seleccione una carpeta de destino.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(10);

    // Simulate realistic upload progress bar (0% -> 100%)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);

      await uploadSong({
        name,
        folderId,
        fileName: selectedFile ? selectedFile.name : `${name.toLowerCase().replace(/\s+/g, '_')}.mp4`,
        duration,
        description
      });

      setIsUploading(false);
      setUploadComplete(true);

      setTimeout(() => {
        setUploadComplete(false);
        setName('');
        setSelectedFile(null);
        setDescription('');
        setUploadProgress(0);
        onClose();
      }, 1400);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-xl border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Subir nueva canción</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cargue el video MP4 para el repertorio de culto
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {uploadComplete ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-900">
              Canción subida correctamente
            </h4>
            <p className="text-xs text-slate-500">
              El canto ya está disponible en la carpeta seleccionada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Song Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nombre de la canción <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isUploading}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. Al Dios Santo y Fiel"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Folder Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Carpeta / Categoría <span className="text-rose-500">*</span>
              </label>
              <select
                required
                disabled={isUploading}
                value={folderId}
                onChange={e => setFolderId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                {folders.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File selection / MP4 */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Archivo MP4 <span className="text-rose-500">*</span>
              </label>
              <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="mp4FileInput"
                  accept="video/mp4,video/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                <label
                  htmlFor="mp4FileInput"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                >
                  <Film className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">
                    {selectedFile ? selectedFile.name : 'Haga clic para seleccionar archivo MP4'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                      : 'Formatos admitidos: .mp4 (Resolución recomendada: 1080p)'}
                  </span>
                </label>
              </div>
            </div>

            {/* Estimated Duration & Optional Description */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Duración estimada
                </label>
                <input
                  type="text"
                  disabled={isUploading}
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="3:45"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Subido por
                </label>
                <div className="px-3 py-2 text-xs bg-slate-100 text-slate-600 rounded-md border border-slate-200 truncate">
                  {currentUser?.name}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nota o referencia (Opcional)
              </label>
              <input
                type="text"
                disabled={isUploading}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ej. Arreglo para coro y piano"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Simulated Upload Progress */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subiendo archivo a almacenamiento seguro...</span>
                  <span className="font-mono tabular-nums">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-md transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Subiendo...' : 'Subir canción'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
