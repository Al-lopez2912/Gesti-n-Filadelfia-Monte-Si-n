import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Folder,
  Song,
  RequestItem,
  Permission,
  AuditLog,
  SystemConfig,
  SongStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FOLDERS,
  INITIAL_SONGS,
  INITIAL_REQUESTS,
  INITIAL_PERMISSIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_CONFIG
} from '../data/mockData';

export type SongAccessState = 'SIN_PERMISO' | 'SOLICITUD_PENDIENTE' | 'ACCESO_AUTORIZADO' | 'ACCESO_EXPIRADO' | 'SOLICITUD_RECHAZADA';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  folders: Folder[];
  songs: Song[];
  requests: RequestItem[];
  permissions: Permission[];
  auditLogs: AuditLog[];
  systemConfig: SystemConfig;
  
  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Dedicated Minimal Video Player
  playingSong: Song | null;
  startPlayingSong: (song: Song) => void;
  stopPlayingSong: () => void;
  
  // Song detail modal
  selectedSongDetail: Song | null;
  setSelectedSongDetail: (song: Song | null) => void;
  
  // Auth & Roles
  loginAsUser: (userId: string) => void;
  loginWithCredentials: (email: string, pass: string) => boolean;
  logout: () => void;
  
  // Song Permission Check
  getSongAccessStatus: (songId: string, userOverride?: User | null) => {
    state: SongAccessState;
    permission?: Permission;
    request?: RequestItem;
  };
  
  // Actions
  requestSongAccess: (songId: string) => void;
  approveRequestWithCustomExpiration: (requestId: string, expiresAtIso: string) => void;
  rejectRequest: (requestId: string, reason?: string) => void;
  revokePermission: (permissionId: string) => void;
  
  // Song & Library management
  uploadSong: (data: { name: string; fileName: string; duration?: string; description?: string }) => Promise<void>;
  renameSong: (songId: string, newName: string) => void;
  moveSong: (songId: string, targetFolderId: string | null) => void;
  archiveSong: (songId: string) => void;
  createFolder: (name: string, description?: string) => void;
  renameFolder: (folderId: string, newName: string) => void;
  getSongFolderName: (song: Song) => string;
  
  // User Management (SuperAdmin)
  createUser: (userData: { name: string; email: string; role: UserRole; initialPassword?: string }) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
  
  // System Config
  updateSystemConfig: (updates: Partial<SystemConfig>) => void;
  resetAllData: () => void;

  // Alerts
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'videoteca_cantos_';

function getStoredOr<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => getStoredOr('users', INITIAL_USERS));
  const [folders, setFolders] = useState<Folder[]>(() => getStoredOr('folders', INITIAL_FOLDERS));
  const [songs, setSongs] = useState<Song[]>(() => getStoredOr('songs', INITIAL_SONGS));
  const [requests, setRequests] = useState<RequestItem[]>(() => getStoredOr('requests', INITIAL_REQUESTS));
  const [permissions, setPermissions] = useState<Permission[]>(() => getStoredOr('permissions', INITIAL_PERMISSIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getStoredOr('audit_logs', INITIAL_AUDIT_LOGS));
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => getStoredOr('config', INITIAL_SYSTEM_CONFIG));
  
  // Current user defaults to Mateo Rivas (Usuario Básico) to demonstrate basic user first, or read from storage
  const [currentUserId, setCurrentUserId] = useState<string>(() => getStoredOr('current_user_id', 'usr-mateo'));
  const currentUser = users.find(u => u.uid === currentUserId) || users[0] || null;

  // Navigation tab based on role
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (currentUser?.role === 'USUARIO_BASICO') return 'biblioteca';
    return 'inicio';
  });

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const [selectedSongDetail, setSelectedSongDetail] = useState<Song | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Sync to storage
  useEffect(() => { saveToStorage('users', users); }, [users]);
  useEffect(() => { saveToStorage('folders', folders); }, [folders]);
  useEffect(() => { saveToStorage('songs', songs); }, [songs]);
  useEffect(() => { saveToStorage('requests', requests); }, [requests]);
  useEffect(() => { saveToStorage('permissions', permissions); }, [permissions]);
  useEffect(() => { saveToStorage('audit_logs', auditLogs); }, [auditLogs]);
  useEffect(() => { saveToStorage('config', systemConfig); }, [systemConfig]);
  useEffect(() => { saveToStorage('current_user_id', currentUserId); }, [currentUserId]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const clearToast = () => setToast(null);

  // Log audit helper
  const addAuditLog = (action: string, targetId: string, targetType: AuditLog['targetType'], details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      actorId: currentUser.uid,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      targetId,
      targetType,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth actions
  const loginAsUser = (userId: string) => {
    const user = users.find(u => u.uid === userId);
    if (!user) return;
    setCurrentUserId(userId);
    setPlayingSong(null);
    setSelectedSongDetail(null);
    if (user.role === 'USUARIO_BASICO') {
      setActiveTab('biblioteca');
    } else {
      setActiveTab('inicio');
    }
    showToast(`Sesión iniciada como ${user.name} (${user.role === 'USUARIO_BASICO' ? 'Usuario Básico' : user.role})`, 'info');
  };

  const loginWithCredentials = (email: string, _pass: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      if (user.status === 'desactivado') {
        showToast('Esta cuenta se encuentra desactivada por un administrador.', 'error');
        return false;
      }
      loginAsUser(user.uid);
      return true;
    }
    showToast('Credenciales incorrectas. Verifique correo y contraseña.', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUserId('');
    setPlayingSong(null);
    setSelectedSongDetail(null);
    showToast('Sesión cerrada correctamente.', 'info');
  };

  // Determine permission state for a song for current user (or specified user)
  const getSongAccessStatus = (songId: string, userOverride?: User | null) => {
    const user = userOverride !== undefined ? userOverride : currentUser;
    if (!user) return { state: 'SIN_PERMISO' as SongAccessState };

    // Admin & SuperAdmin always have authorized access to verify and play songs
    if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
      return { state: 'ACCESO_AUTORIZADO' as SongAccessState };
    }

    // Check active permission for this user and song
    const activePerm = permissions.find(
      p => p.userId === user.uid && p.songId === songId && p.status === 'ACTIVE'
    );

    if (activePerm) {
      const now = new Date();
      const expiresAt = new Date(activePerm.expiresAt);
      if (now > expiresAt) {
        return { state: 'ACCESO_EXPIRADO' as SongAccessState, permission: activePerm };
      }
      return { state: 'ACCESO_AUTORIZADO' as SongAccessState, permission: activePerm };
    }

    // Check expired permissions
    const expiredPerm = permissions.find(
      p => p.userId === user.uid && p.songId === songId && p.status === 'EXPIRED'
    );
    if (expiredPerm) {
      return { state: 'ACCESO_EXPIRADO' as SongAccessState, permission: expiredPerm };
    }

    // Check requests
    const userRequests = requests
      .filter(r => r.userId === user.uid && r.songId === songId)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    const latestReq = userRequests[0];
    if (latestReq) {
      if (latestReq.status === 'PENDING') {
        return { state: 'SOLICITUD_PENDIENTE' as SongAccessState, request: latestReq };
      }
      if (latestReq.status === 'REJECTED') {
        return { state: 'SOLICITUD_RECHAZADA' as SongAccessState, request: latestReq };
      }
      if (latestReq.status === 'EXPIRED') {
        return { state: 'ACCESO_EXPIRADO' as SongAccessState, request: latestReq };
      }
    }

    return { state: 'SIN_PERMISO' as SongAccessState };
  };

  // Basic User requests access
  const requestSongAccess = (songId: string) => {
    if (!currentUser) return;
    const song = songs.find(s => s.id === songId);
    if (!song) return;

    const songFolder = song.folderId ? folders.find(f => f.id === song.folderId) : null;

    const newRequest: RequestItem = {
      id: 'req-' + Date.now(),
      userId: currentUser.uid,
      userName: currentUser.name,
      userEmail: currentUser.email,
      songId: song.id,
      songName: song.name,
      folderName: songFolder ? songFolder.name : 'Sin carpeta',
      status: 'PENDING',
      requestedAt: new Date().toISOString()
    };

    setRequests(prev => [newRequest, ...prev]);
    addAuditLog(
      'solicitud_creada',
      song.id,
      'request',
      `${currentUser.name} solicitó acceso a "${song.name}"`
    );
    showToast(`Solicitud de acceso enviada para "${song.name}".`, 'success');
  };

  // Admin approves request with Custom Expiration Date and Time
  const approveRequestWithCustomExpiration = (requestId: string, expiresAtIso: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) {
      showToast('No tiene privilegios administrativos para aprobar solicitudes.', 'error');
      return;
    }

    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const newPermId = 'perm-' + Date.now();
    const newPermission: Permission = {
      id: newPermId,
      userId: request.userId,
      songId: request.songId,
      requestId: request.id,
      grantedBy: currentUser.uid,
      grantedByName: currentUser.name,
      grantedAt: new Date().toISOString(),
      expiresAt: expiresAtIso,
      status: 'ACTIVE'
    };

    setPermissions(prev => [newPermission, ...prev]);

    setRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? {
              ...r,
              status: 'APPROVED',
              reviewedBy: currentUser.uid,
              reviewedByName: currentUser.name,
              reviewedAt: new Date().toISOString(),
              permissionId: newPermId
            }
          : r
      )
    );

    const expDate = new Date(expiresAtIso);
    const formattedExp = `${expDate.toLocaleDateString('es-ES')} a las ${expDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

    addAuditLog(
      'acceso_concedido',
      newPermId,
      'permission',
      `${currentUser.name} concedió acceso a "${request.songName}" para ${request.userName} hasta el ${formattedExp}`
    );

    showToast(`Acceso concedido a ${request.userName} hasta ${formattedExp}.`, 'success');
  };

  // Admin rejects request
  const rejectRequest = (requestId: string, reason?: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) {
      showToast('No tiene privilegios para rechazar solicitudes.', 'error');
      return;
    }

    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    setRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? {
              ...r,
              status: 'REJECTED',
              reviewedBy: currentUser.uid,
              reviewedByName: currentUser.name,
              reviewedAt: new Date().toISOString(),
              rejectionReason: reason || 'Solicitud denegada por administración de culto.'
            }
          : r
      )
    );

    addAuditLog(
      'acceso_rechazado',
      request.id,
      'request',
      `${currentUser.name} rechazó solicitud de acceso a "${request.songName}" para ${request.userName}`
    );

    showToast(`Solicitud de ${request.userName} rechazada.`, 'info');
  };

  // Revoke active permission
  const revokePermission = (permissionId: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) return;
    const perm = permissions.find(p => p.id === permissionId);
    if (!perm) return;

    setPermissions(prev =>
      prev.map(p => (p.id === permissionId ? { ...p, status: 'REVOKED' } : p))
    );

    const song = songs.find(s => s.id === perm.songId);
    const user = users.find(u => u.uid === perm.userId);

    addAuditLog(
      'acceso_revocado',
      permissionId,
      'permission',
      `${currentUser.name} revocó anticipadamente el acceso a "${song?.name || 'Canto'}" para ${user?.name || 'Usuario'}`
    );

    showToast('Permiso de acceso revocado.', 'warning');
  };

  // Upload Song (Admin)
  const uploadSong = async (data: { name: string; fileName: string; duration?: string; description?: string }) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) {
      throw new Error('No autorizado');
    }

    const newSong: Song = {
      id: 'sng-' + Date.now(),
      name: data.name.trim(),
      folderId: null,
      storagePath: `gs://cantos-storage/uploads/${data.fileName.toLowerCase().replace(/\s+/g, '_')}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.uid,
      uploadedByName: currentUser.name,
      status: 'activo',
      thumbnailUrl: INITIAL_SONGS[0].thumbnailUrl,
      duration: data.duration || '3:50',
      fileSize: '58.0 MB',
      description: data.description || 'Canto espiritual subido para soporte de congregación.',
      lyricsSnippet: 'Alabanza congregacional preparada para el servicio.'
    };

    setSongs(prev => [newSong, ...prev]);

    addAuditLog(
      'cancion_subida',
      newSong.id,
      'song',
      `${currentUser.name} subió la canción "${newSong.name}" a la biblioteca`
    );

    showToast(`Canción subida correctamente: "${newSong.name}".`, 'success');
  };

  const renameSong = (songId: string, newName: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) return;
    setSongs(prev => prev.map(s => (s.id === songId ? { ...s, name: newName.trim() } : s)));
    addAuditLog('cancion_renombrada', songId, 'song', `${currentUser.name} cambió el nombre del canto a "${newName.trim()}"`);
    showToast('Nombre de la canción actualizado.', 'success');
  };

  const moveSong = (songId: string, targetFolderId: string | null) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) return;
    const targetFolder = targetFolderId ? folders.find(f => f.id === targetFolderId) : null;
    setSongs(prev =>
      prev.map(s => (s.id === songId ? { ...s, folderId: targetFolder ? targetFolder.id : null } : s))
    );
    if (targetFolder) {
      addAuditLog('cancion_movida', songId, 'song', `${currentUser.name} asignó el canto a la carpeta "${targetFolder.name}"`);
      showToast(`Canción asignada a "${targetFolder.name}".`, 'success');
    } else {
      addAuditLog('cancion_movida', songId, 'song', `${currentUser.name} desasignó el canto de carpeta`);
      showToast('Canción desasignada de carpeta.', 'info');
    }
  };

  const getSongFolderName = (song: Song): string => {
    if (!song.folderId) return 'Sin carpeta';
    const folder = folders.find(f => f.id === song.folderId);
    return folder ? folder.name : 'Sin carpeta';
  };

  const archiveSong = (songId: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) return;
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    setSongs(prev => prev.map(s => (s.id === songId ? { ...s, status: 'archivado' } : s)));
    addAuditLog('cancion_archivada', songId, 'song', `${currentUser.name} archivó la canción "${song.name}"`);
    showToast(`Canción archivada correctamente.`, 'info');
  };

  const createFolder = (name: string, description?: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) return;
    const newFolder: Folder = {
      id: 'fld-' + Date.now(),
      name: name.trim(),
      description: description?.trim() || '',
      parentId: null,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.uid
    };
    setFolders(prev => [...prev, newFolder]);
    addAuditLog('carpeta_creada', newFolder.id, 'folder', `${currentUser.name} creó la carpeta "${newFolder.name}"`);
    showToast(`Carpeta "${newFolder.name}" creada.`, 'success');
  };

  const renameFolder = (folderId: string, newName: string) => {
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPERADMIN')) return;
    setFolders(prev => prev.map(f => (f.id === folderId ? { ...f, name: newName.trim() } : f)));
    showToast('Carpeta renombrada.', 'success');
  };

  // User Management (SuperAdmin only)
  const createUser = (userData: { name: string; email: string; role: UserRole; initialPassword?: string }) => {
    if (!currentUser || currentUser.role !== 'SUPERADMIN') {
      showToast('Solo el SuperAdmin puede registrar usuarios.', 'error');
      return;
    }
    const initials = userData.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser: User = {
      uid: 'usr-' + Date.now(),
      name: userData.name.trim(),
      email: userData.email.trim(),
      role: userData.role,
      status: 'activo',
      createdAt: new Date().toISOString(),
      avatarInitials: initials
    };

    setUsers(prev => [...prev, newUser]);
    addAuditLog('usuario_creado', newUser.uid, 'user', `${currentUser.name} dio de alta al usuario ${newUser.name} con rol ${newUser.role}`);
    showToast(`Usuario ${newUser.name} creado correctamente.`, 'success');
  };

  const toggleUserStatus = (userId: string) => {
    if (!currentUser || currentUser.role !== 'SUPERADMIN') return;
    if (userId === currentUser.uid) {
      showToast('No puede desactivar su propia cuenta de SuperAdmin.', 'warning');
      return;
    }
    setUsers(prev =>
      prev.map(u => {
        if (u.uid === userId) {
          const newStatus = u.status === 'activo' ? 'desactivado' : 'activo';
          addAuditLog('usuario_estado_cambiado', u.uid, 'user', `${currentUser.name} cambió el estado de ${u.name} a ${newStatus}`);
          showToast(`Usuario ${u.name} ahora está ${newStatus}.`, 'info');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const deleteUser = (userId: string) => {
    if (!currentUser || currentUser.role !== 'SUPERADMIN') return;
    if (userId === currentUser.uid) {
      showToast('No puede eliminar su propia cuenta de SuperAdmin.', 'warning');
      return;
    }
    const target = users.find(u => u.uid === userId);
    setUsers(prev => prev.filter(u => u.uid !== userId));
    if (target) {
      addAuditLog('usuario_eliminado', userId, 'user', `${currentUser.name} eliminó al usuario ${target.name}`);
      showToast(`Usuario ${target.name} eliminado.`, 'info');
    }
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    if (!currentUser || currentUser.role !== 'SUPERADMIN') return;
    if (userId === currentUser.uid) {
      showToast('No puede degradar su propio rol de SuperAdmin.', 'warning');
      return;
    }
    setUsers(prev =>
      prev.map(u => {
        if (u.uid === userId) {
          addAuditLog('usuario_rol_cambiado', u.uid, 'user', `${currentUser.name} cambió el rol de ${u.name} a ${newRole}`);
          showToast(`Rol de ${u.name} modificado a ${newRole}.`, 'success');
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const updateSystemConfig = (updates: Partial<SystemConfig>) => {
    if (!currentUser || currentUser.role !== 'SUPERADMIN') return;
    setSystemConfig(prev => ({ ...prev, ...updates }));
    addAuditLog('sistema_configurado', 'system', 'system', `${currentUser.name} actualizó los parámetros de configuración de la congregación`);
    showToast('Configuración del sistema actualizada.', 'success');
  };

  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setFolders(INITIAL_FOLDERS);
    setSongs(INITIAL_SONGS);
    setRequests(INITIAL_REQUESTS);
    setPermissions(INITIAL_PERMISSIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSystemConfig(INITIAL_SYSTEM_CONFIG);
    setCurrentUserId('usr-mateo');
    setActiveTab('biblioteca');
    setPlayingSong(null);
    setSelectedSongDetail(null);
    showToast('Datos reiniciados al estado inicial.', 'info');
  };

  const startPlayingSong = (song: Song) => {
    const access = getSongAccessStatus(song.id);
    if (access.state === 'ACCESO_AUTORIZADO') {
      setPlayingSong(song);
      setSelectedSongDetail(null);
    } else if (access.state === 'ACCESO_EXPIRADO') {
      showToast('Tu acceso a esta canción ha expirado.', 'warning');
      setSelectedSongDetail(song);
    } else {
      showToast('Requiere autorización activa para reproducir este video.', 'warning');
      setSelectedSongDetail(song);
    }
  };

  const stopPlayingSong = () => {
    setPlayingSong(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        folders,
        songs,
        requests,
        permissions,
        auditLogs,
        systemConfig,
        activeTab,
        setActiveTab,
        selectedFolderId,
        setSelectedFolderId,
        searchQuery,
        setSearchQuery,
        playingSong,
        startPlayingSong,
        stopPlayingSong,
        selectedSongDetail,
        setSelectedSongDetail,
        loginAsUser,
        loginWithCredentials,
        logout,
        getSongAccessStatus,
        requestSongAccess,
        approveRequestWithCustomExpiration,
        rejectRequest,
        revokePermission,
        uploadSong,
        renameSong,
        moveSong,
        archiveSong,
        createFolder,
        renameFolder,
        getSongFolderName,
        createUser,
        toggleUserStatus,
        deleteUser,
        changeUserRole,
        updateSystemConfig,
        resetAllData,
        toast,
        showToast,
        clearToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
