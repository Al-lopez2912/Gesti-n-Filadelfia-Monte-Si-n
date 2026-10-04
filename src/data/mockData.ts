import { User, Folder, Song, RequestItem, Permission, AuditLog, SystemConfig } from '../types';

import thumbAdoracion from '../assets/images/thumb_canto_adoracion_1791130178836.jpg';
import thumbAlabanza from '../assets/images/thumb_canto_alabanza_1791130191827.jpg';
import thumbOracion from '../assets/images/thumb_canto_oracion_1791130208197.jpg';
import thumbComunion from '../assets/images/thumb_canto_comunion_1791130218420.jpg';

export const INITIAL_USERS: User[] = [
  {
    uid: 'usr-mateo',
    name: 'Mateo Rivas',
    email: 'mateo.rivas@congregacion.org',
    role: 'USUARIO_BASICO',
    status: 'activo',
    createdAt: '2026-08-15T10:00:00Z',
    avatarInitials: 'MR'
  },
  {
    uid: 'usr-sofia',
    name: 'Sofía Gómez',
    email: 'sofia.gomez@congregacion.org',
    role: 'USUARIO_BASICO',
    status: 'activo',
    createdAt: '2026-08-20T14:30:00Z',
    avatarInitials: 'SG'
  },
  {
    uid: 'usr-andres',
    name: 'Andrés Morales',
    email: 'andres.morales@congregacion.org',
    role: 'USUARIO_BASICO',
    status: 'activo',
    createdAt: '2026-09-01T09:15:00Z',
    avatarInitials: 'AM'
  },
  {
    uid: 'usr-elena',
    name: 'Elena Castillo',
    email: 'elena.castillo@congregacion.org',
    role: 'USUARIO_BASICO',
    status: 'activo',
    createdAt: '2026-09-10T16:00:00Z',
    avatarInitials: 'EC'
  },
  {
    uid: 'usr-samuel',
    name: 'Samuel Vargas',
    email: 'samuel.vargas@congregacion.org',
    role: 'USUARIO_BASICO',
    status: 'desactivado',
    createdAt: '2026-07-05T11:20:00Z',
    avatarInitials: 'SV'
  },
  {
    uid: 'usr-raquel',
    name: 'Raquel Peña',
    email: 'raquel.pena@congregacion.org',
    role: 'ADMIN',
    status: 'activo',
    createdAt: '2026-06-01T08:00:00Z',
    avatarInitials: 'RP'
  },
  {
    uid: 'usr-carlos',
    name: 'Carlos Méndez',
    email: 'carlos.mendez@congregacion.org',
    role: 'ADMIN',
    status: 'activo',
    createdAt: '2026-06-12T11:45:00Z',
    avatarInitials: 'CM'
  },
  {
    uid: 'usr-daniel',
    name: 'Pastor Daniel Santos',
    email: 'daniel.santos@congregacion.org',
    role: 'SUPERADMIN',
    status: 'activo',
    createdAt: '2026-05-10T07:30:00Z',
    avatarInitials: 'DS'
  }
];

export const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'fld-domingo',
    name: 'Culto Dominical',
    description: 'Cantos congregacionales y alabanzas para la reunión de domingo por la mañana.',
    parentId: null,
    createdAt: '2026-08-01T09:00:00Z',
    createdBy: 'usr-daniel'
  },
  {
    id: 'fld-viernes',
    name: 'Servicio de Oración (Viernes)',
    description: 'Cantos devocionales, meditación y cánticos de intercesión para el servicio de viernes.',
    parentId: null,
    createdAt: '2026-08-01T09:10:00Z',
    createdBy: 'usr-daniel'
  },
  {
    id: 'fld-himnos',
    name: 'Himnos Clásicos',
    description: 'Himnario tradicional con instrumentación solemne y letras de edificación histórica.',
    parentId: null,
    createdAt: '2026-08-05T15:00:00Z',
    createdBy: 'usr-raquel'
  },
  {
    id: 'fld-comunion',
    name: 'Santa Cena y Comunión',
    description: 'Cánticos de reverencia y recuerdo del sacrificio de Cristo para la mesa del Señor.',
    parentId: null,
    createdAt: '2026-08-10T12:00:00Z',
    createdBy: 'usr-raquel'
  }
];

export const INITIAL_SONGS: Song[] = [
  {
    id: 'sng-1',
    name: 'Al Dios Santo y Fiel',
    folderId: 'fld-domingo',
    folderName: 'Culto Dominical',
    storagePath: 'gs://cantos-storage/domingo/al_dios_santo_y_fiel.mp4',
    uploadedAt: '2026-09-12T10:15:00Z',
    uploadedBy: 'usr-raquel',
    uploadedByName: 'Raquel Peña',
    status: 'activo',
    thumbnailUrl: thumbAdoracion,
    duration: '4:18',
    fileSize: '68.4 MB',
    description: 'Canto solemne de apertura con coro a cuatro voces y piano acústico.',
    lyricsSnippet: 'Santo, Santo, digno es el Señor todopoderoso, la tierra llena está de su majestad.'
  },
  {
    id: 'sng-2',
    name: 'Cuán Grande es Su Gracia',
    folderId: 'fld-domingo',
    folderName: 'Culto Dominical',
    storagePath: 'gs://cantos-storage/domingo/cuan_grande_es_su_gracia.mp4',
    uploadedAt: '2026-09-15T16:20:00Z',
    uploadedBy: 'usr-raquel',
    uploadedByName: 'Raquel Peña',
    status: 'activo',
    thumbnailUrl: thumbAlabanza,
    duration: '3:52',
    fileSize: '54.2 MB',
    description: 'Arreglo acústico para momentos de acción de gracias en el culto matutino.',
    lyricsSnippet: 'Inmerecido favor que alcanzó mi corazón, gracia divina que nunca cesará.'
  },
  {
    id: 'sng-3',
    name: 'En Su Presencia Hay Paz',
    folderId: 'fld-viernes',
    folderName: 'Servicio de Oración (Viernes)',
    storagePath: 'gs://cantos-storage/viernes/en_su_presencia_hay_paz.mp4',
    uploadedAt: '2026-09-18T18:00:00Z',
    uploadedBy: 'usr-carlos',
    uploadedByName: 'Carlos Méndez',
    status: 'activo',
    thumbnailUrl: thumbOracion,
    duration: '5:05',
    fileSize: '79.1 MB',
    description: 'Canto instrumental y lírico de reposo para el tiempo de intercesión.',
    lyricsSnippet: 'Cesa el afán y calla la tempestad, ante el trono eterno reposa mi alma.'
  },
  {
    id: 'sng-4',
    name: 'Roca de la Eternidad',
    folderId: 'fld-himnos',
    folderName: 'Himnos Clásicos',
    storagePath: 'gs://cantos-storage/himnos/roca_de_la_eternidad.mp4',
    uploadedAt: '2026-09-20T11:30:00Z',
    uploadedBy: 'usr-raquel',
    uploadedByName: 'Raquel Peña',
    status: 'activo',
    thumbnailUrl: thumbAdoracion,
    duration: '3:30',
    fileSize: '49.8 MB',
    description: 'Himno tradicional número 42 con acompañamiento de órgano suave.',
    lyricsSnippet: 'Roca de la eternidad, fuiste abierta para mí; sé mi escondedero fiel.'
  },
  {
    id: 'sng-5',
    name: 'Pan de Vida, Copa de Salvación',
    folderId: 'fld-comunion',
    folderName: 'Santa Cena y Comunión',
    storagePath: 'gs://cantos-storage/comunion/pan_de_vida_copa_salvacion.mp4',
    uploadedAt: '2026-09-22T09:40:00Z',
    uploadedBy: 'usr-daniel',
    uploadedByName: 'Pastor Daniel Santos',
    status: 'activo',
    thumbnailUrl: thumbComunion,
    duration: '4:45',
    fileSize: '71.5 MB',
    description: 'Canto devocional para la distribución de los elementos de la Santa Cena.',
    lyricsSnippet: 'Tomad y comed, este es mi cuerpo entregado; en memoria de Él celebramos.'
  },
  {
    id: 'sng-6',
    name: 'Tu Fidelidad es Grande',
    folderId: 'fld-domingo',
    folderName: 'Culto Dominical',
    storagePath: 'gs://cantos-storage/domingo/tu_fidelidad_es_grande.mp4',
    uploadedAt: '2026-09-25T14:10:00Z',
    uploadedBy: 'usr-carlos',
    uploadedByName: 'Carlos Méndez',
    status: 'activo',
    thumbnailUrl: thumbAlabanza,
    duration: '3:40',
    fileSize: '51.3 MB',
    description: 'Canto congregacional sobre las misericordias renovadas de cada mañana.',
    lyricsSnippet: 'Oh Dios eterno, tu amor no tiene fin; grande y constante es tu fidelidad.'
  },
  {
    id: 'sng-7',
    name: 'En la Quietud de la Oración',
    folderId: 'fld-viernes',
    folderName: 'Servicio de Oración (Viernes)',
    storagePath: 'gs://cantos-storage/viernes/en_la_quietud_de_la_oracion.mp4',
    uploadedAt: '2026-09-26T19:00:00Z',
    uploadedBy: 'usr-raquel',
    uploadedByName: 'Raquel Peña',
    status: 'activo',
    thumbnailUrl: thumbOracion,
    duration: '4:22',
    fileSize: '62.0 MB',
    description: 'Meditación vespertina con armonías suaves y espacio para plegarias.',
    lyricsSnippet: 'En el silencio escucho tu voz, enséñame a esperar en tu voluntad.'
  },
  {
    id: 'sng-8',
    name: 'Sublime Gracia del Señor',
    folderId: 'fld-himnos',
    folderName: 'Himnos Clásicos',
    storagePath: 'gs://cantos-storage/himnos/sublime_gracia_del_senor.mp4',
    uploadedAt: '2026-09-27T10:00:00Z',
    uploadedBy: 'usr-daniel',
    uploadedByName: 'Pastor Daniel Santos',
    status: 'activo',
    thumbnailUrl: thumbAdoracion,
    duration: '3:55',
    fileSize: '57.4 MB',
    description: 'Himno clásico en compás ternario con orquestación de cuerdas y metales suaves.',
    lyricsSnippet: 'Sublime gracia del Señor que a un infeliz salvó; yo ciego fui mas hoy veo yo.'
  },
  {
    id: 'sng-9',
    name: 'A Tus Pies Señor Jesús',
    folderId: 'fld-viernes',
    folderName: 'Servicio de Oración (Viernes)',
    storagePath: 'gs://cantos-storage/viernes/a_tus_pies_senor_jesus.mp4',
    uploadedAt: '2026-09-28T17:15:00Z',
    uploadedBy: 'usr-carlos',
    uploadedByName: 'Carlos Méndez',
    status: 'activo',
    thumbnailUrl: thumbOracion,
    duration: '4:10',
    fileSize: '60.1 MB',
    description: 'Canto devocional de entrega y consagración para momentos de recogimiento.',
    lyricsSnippet: 'Rindo mi ser ante tu altar, no hay lugar más alto que a tus pies.'
  },
  {
    id: 'sng-10',
    name: 'Recordamos Tu Sacrificio',
    folderId: 'fld-comunion',
    folderName: 'Santa Cena y Comunión',
    storagePath: 'gs://cantos-storage/comunion/recordamos_tu_sacrificio.mp4',
    uploadedAt: '2026-09-29T11:45:00Z',
    uploadedBy: 'usr-raquel',
    uploadedByName: 'Raquel Peña',
    status: 'activo',
    thumbnailUrl: thumbComunion,
    duration: '4:30',
    fileSize: '65.8 MB',
    description: 'Arreglo meditativo para la comunión fraternal del primer domingo de mes.',
    lyricsSnippet: 'Por tus llagas fuimos sanados, por tu cruz tenemos redención eternal.'
  },
  {
    id: 'sng-11',
    name: 'Grande es Jehová en Sión',
    folderId: 'fld-domingo',
    folderName: 'Culto Dominical',
    storagePath: 'gs://cantos-storage/domingo/grande_es_jehova_en_sion.mp4',
    uploadedAt: '2026-09-30T15:30:00Z',
    uploadedBy: 'usr-raquel',
    uploadedByName: 'Raquel Peña',
    status: 'activo',
    thumbnailUrl: thumbAlabanza,
    duration: '3:25',
    fileSize: '47.9 MB',
    description: 'Alabanza congregacional de proclamación basada en el Salmo 99.',
    lyricsSnippet: 'Grande es el Señor sobre todos los pueblos, celebren su nombre santo y temible.'
  },
  {
    id: 'sng-12',
    name: 'Castillo Fuerte es Nuestro Dios',
    folderId: 'fld-himnos',
    folderName: 'Himnos Clásicos',
    storagePath: 'gs://cantos-storage/himnos/castillo_fuerte_es_nuestro_dios.mp4',
    uploadedAt: '2026-10-01T08:20:00Z',
    uploadedBy: 'usr-daniel',
    uploadedByName: 'Pastor Daniel Santos',
    status: 'activo',
    thumbnailUrl: thumbAdoracion,
    duration: '4:02',
    fileSize: '59.3 MB',
    description: 'Himno de la Reforma con coro coral y fondo sinfónico.',
    lyricsSnippet: 'Castillo fuerte es nuestro Dios, defensa y buen escudo; con su poder nos librará.'
  }
];

export const INITIAL_REQUESTS: RequestItem[] = [
  // Mateo Rivas requests
  {
    id: 'req-1',
    userId: 'usr-mateo',
    userName: 'Mateo Rivas',
    userEmail: 'mateo.rivas@congregacion.org',
    songId: 'sng-1',
    songName: 'Al Dios Santo y Fiel',
    folderName: 'Culto Dominical',
    status: 'APPROVED',
    requestedAt: '2026-10-03T18:30:00Z',
    reviewedBy: 'usr-raquel',
    reviewedByName: 'Raquel Peña',
    reviewedAt: '2026-10-03T19:15:00Z',
    permissionId: 'perm-mateo-sng1'
  },
  {
    id: 'req-2',
    userId: 'usr-mateo',
    userName: 'Mateo Rivas',
    userEmail: 'mateo.rivas@congregacion.org',
    songId: 'sng-3',
    songName: 'En Su Presencia Hay Paz',
    folderName: 'Servicio de Oración (Viernes)',
    status: 'PENDING',
    requestedAt: '2026-10-04T08:15:00Z'
  },
  {
    id: 'req-3',
    userId: 'usr-mateo',
    userName: 'Mateo Rivas',
    userEmail: 'mateo.rivas@congregacion.org',
    songId: 'sng-8',
    songName: 'Sublime Gracia del Señor',
    folderName: 'Himnos Clásicos',
    status: 'EXPIRED',
    requestedAt: '2026-09-28T14:00:00Z',
    reviewedBy: 'usr-carlos',
    reviewedByName: 'Carlos Méndez',
    reviewedAt: '2026-09-28T15:00:00Z',
    permissionId: 'perm-mateo-sng8-expired'
  },

  // Other basic users requests (to populate Admin queue)
  {
    id: 'req-4',
    userId: 'usr-sofia',
    userName: 'Sofía Gómez',
    userEmail: 'sofia.gomez@congregacion.org',
    songId: 'sng-2',
    songName: 'Cuán Grande es Su Gracia',
    folderName: 'Culto Dominical',
    status: 'PENDING',
    requestedAt: '2026-10-04T07:45:00Z'
  },
  {
    id: 'req-5',
    userId: 'usr-andres',
    userName: 'Andrés Morales',
    userEmail: 'andres.morales@congregacion.org',
    songId: 'sng-5',
    songName: 'Pan de Vida, Copa de Salvación',
    folderName: 'Santa Cena y Comunión',
    status: 'PENDING',
    requestedAt: '2026-10-04T08:40:00Z'
  },
  {
    id: 'req-6',
    userId: 'usr-elena',
    userName: 'Elena Castillo',
    userEmail: 'elena.castillo@congregacion.org',
    songId: 'sng-6',
    songName: 'Tu Fidelidad es Grande',
    folderName: 'Culto Dominical',
    status: 'REJECTED',
    requestedAt: '2026-10-02T16:20:00Z',
    reviewedBy: 'usr-raquel',
    reviewedByName: 'Raquel Peña',
    reviewedAt: '2026-10-02T17:05:00Z',
    rejectionReason: 'La lista de cantos para este servicio ya se encuentra asignada al grupo de jóvenes.'
  },
  {
    id: 'req-7',
    userId: 'usr-sofia',
    userName: 'Sofía Gómez',
    userEmail: 'sofia.gomez@congregacion.org',
    songId: 'sng-7',
    songName: 'En la Quietud de la Oración',
    folderName: 'Servicio de Oración (Viernes)',
    status: 'APPROVED',
    requestedAt: '2026-10-03T11:00:00Z',
    reviewedBy: 'usr-carlos',
    reviewedByName: 'Carlos Méndez',
    reviewedAt: '2026-10-03T11:45:00Z',
    permissionId: 'perm-sofia-sng7'
  }
];

export const INITIAL_PERMISSIONS: Permission[] = [
  {
    id: 'perm-mateo-sng1',
    userId: 'usr-mateo',
    songId: 'sng-1',
    requestId: 'req-1',
    grantedBy: 'usr-raquel',
    grantedByName: 'Raquel Peña',
    grantedAt: '2026-10-03T19:15:00Z',
    // Expires tomorrow evening at 23:59
    expiresAt: '2026-10-05T23:59:00Z',
    status: 'ACTIVE'
  },
  {
    id: 'perm-mateo-sng8-expired',
    userId: 'usr-mateo',
    songId: 'sng-8',
    requestId: 'req-3',
    grantedBy: 'usr-carlos',
    grantedByName: 'Carlos Méndez',
    grantedAt: '2026-09-28T15:00:00Z',
    // Expired yesterday
    expiresAt: '2026-10-03T21:00:00Z',
    status: 'EXPIRED'
  },
  {
    id: 'perm-sofia-sng7',
    userId: 'usr-sofia',
    songId: 'sng-7',
    requestId: 'req-7',
    grantedBy: 'usr-carlos',
    grantedByName: 'Carlos Méndez',
    grantedAt: '2026-10-03T11:45:00Z',
    expiresAt: '2026-10-06T12:00:00Z',
    status: 'ACTIVE'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorId: 'usr-mateo',
    actorName: 'Mateo Rivas',
    actorRole: 'USUARIO_BASICO',
    action: 'solicitud_creada',
    targetId: 'sng-3',
    targetType: 'request',
    timestamp: '2026-10-04T08:15:00Z',
    details: 'Mateo Rivas solicitó acceso a En Su Presencia Hay Paz'
  },
  {
    id: 'log-2',
    actorId: 'usr-andres',
    actorName: 'Andrés Morales',
    actorRole: 'USUARIO_BASICO',
    action: 'solicitud_creada',
    targetId: 'sng-5',
    targetType: 'request',
    timestamp: '2026-10-04T08:40:00Z',
    details: 'Andrés Morales solicitó acceso a Pan de Vida, Copa de Salvación'
  },
  {
    id: 'log-3',
    actorId: 'usr-raquel',
    actorName: 'Raquel Peña',
    actorRole: 'ADMIN',
    action: 'acceso_concedido',
    targetId: 'sng-1',
    targetType: 'permission',
    timestamp: '2026-10-03T19:15:00Z',
    details: 'Raquel Peña concedió acceso a Al Dios Santo y Fiel para Mateo Rivas hasta el 05/10/2026 a las 23:59'
  },
  {
    id: 'log-4',
    actorId: 'usr-carlos',
    actorName: 'Carlos Méndez',
    actorRole: 'ADMIN',
    action: 'acceso_concedido',
    targetId: 'sng-7',
    targetType: 'permission',
    timestamp: '2026-10-03T11:45:00Z',
    details: 'Carlos Méndez concedió acceso a En la Quietud de la Oración para Sofía Gómez hasta el 06/10/2026 a las 12:00'
  },
  {
    id: 'log-5',
    actorId: 'usr-raquel',
    actorName: 'Raquel Peña',
    actorRole: 'ADMIN',
    action: 'acceso_rechazado',
    targetId: 'sng-6',
    targetType: 'request',
    timestamp: '2026-10-02T17:05:00Z',
    details: 'Raquel Peña rechazó solicitud de acceso a Tu Fidelidad es Grande para Elena Castillo'
  },
  {
    id: 'log-6',
    actorId: 'system',
    actorName: 'Sistema de Permisos',
    actorRole: 'ADMIN',
    action: 'acceso_expirado',
    targetId: 'sng-8',
    targetType: 'permission',
    timestamp: '2026-10-03T21:00:00Z',
    details: 'Acceso a Sublime Gracia del Señor para Mateo Rivas expiró según la fecha límite configurada'
  },
  {
    id: 'log-7',
    actorId: 'usr-daniel',
    actorName: 'Pastor Daniel Santos',
    actorRole: 'SUPERADMIN',
    action: 'cancion_subida',
    targetId: 'sng-12',
    targetType: 'song',
    timestamp: '2026-10-01T08:20:00Z',
    details: 'Pastor Daniel Santos subió el archivo MP4 Castillo Fuerte es Nuestro Dios a la carpeta Himnos Clásicos'
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  congregationName: 'Iglesia Bíblica Gracia y Comunión',
  contactPerson: 'Pastor Daniel Santos',
  contactEmail: 'pastor.daniel@congregacion.org',
  timezone: 'America/Santo_Domingo (GMT-4)',
  serviceDays: ['Viernes 7:30 PM (Oración e Intercesión)', 'Domingo 10:00 AM (Culto Principal)'],
  maxVideoRetentionDays: 90,
  allowGuestRequests: false,
  version: '1.0.0-prototipo.produccion'
};
