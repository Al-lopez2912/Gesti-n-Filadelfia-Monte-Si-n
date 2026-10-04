export type UserRole = 'USUARIO_BASICO' | 'ADMIN' | 'SUPERADMIN';
export type UserStatus = 'activo' | 'desactivado';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatarInitials: string;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId: string | null;
  createdAt: string;
  createdBy: string;
  songCount?: number;
}

export type SongStatus = 'activo' | 'archivado';

export interface Song {
  id: string;
  name: string;
  folderId: string | null;
  storagePath: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
  status: SongStatus;
  thumbnailUrl: string;
  duration: string;
  fileSize: string;
  description?: string;
  lyricsSnippet?: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';

export interface RequestItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  songId: string;
  songName: string;
  folderName?: string | null;
  status: RequestStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  permissionId?: string;
}

export type PermissionStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface Permission {
  id: string;
  userId: string;
  songId: string;
  requestId: string;
  grantedBy: string;
  grantedByName: string;
  grantedAt: string;
  expiresAt: string; // ISO string with custom date & time
  status: PermissionStatus;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetId: string;
  targetType: 'song' | 'request' | 'permission' | 'user' | 'folder' | 'system';
  timestamp: string;
  details: string;
}

export interface SystemConfig {
  congregationName: string;
  contactPerson: string;
  contactEmail: string;
  timezone: string;
  serviceDays: string[];
  maxVideoRetentionDays: number;
  allowGuestRequests: boolean;
  version: string;
}
