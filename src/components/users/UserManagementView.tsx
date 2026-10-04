import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import {
  UserPlus,
  Shield,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  XCircle,
  X,
  Trash2,
  Power
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const {
    currentUser,
    users,
    createUser,
    toggleUserStatus,
    deleteUser,
    changeUserRole
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('USUARIO_BASICO');
  const [initialPassword, setInitialPassword] = useState('Culto2026!');
  const [roleChangeModalUser, setRoleChangeModalUser] = useState<User | null>(null);

  if (currentUser?.role !== 'SUPERADMIN') {
    return (
      <div className="p-8 text-center text-slate-500">
        Acceso restringido únicamente para SuperAdministradores.
      </div>
    );
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    createUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      initialPassword
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('USUARIO_BASICO');
    setInitialPassword('Culto2026!');
    setIsCreateModalOpen(false);
  };

  const handleRoleChangeConfirm = (newRole: UserRole) => {
    if (roleChangeModalUser) {
      changeUserRole(roleChangeModalUser.uid, newRole);
      setRoleChangeModalUser(null);
    }
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`¿Está seguro de que desea eliminar la cuenta de ${user.name}? Esta acción revocará todos sus accesos.`)) {
      deleteUser(user.uid);
    }
  };

  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPERADMIN':
        return (
          <span className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
            <span>SuperAdmin</span>
          </span>
        );
      case 'ADMIN':
        return (
          <span className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Administrador</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Usuario Básico</span>
          </span>
        );
    }
  };

  const renderStatus = (status: string) => {
    if (status === 'activo') {
      return (
        <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Activo</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs text-rose-700 font-medium">
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Desactivado</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Administración de Usuarios y Roles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de cuentas autorizadas, asignación de roles y estados de acceso para la congregación
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Crear usuario</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Nombre y Correo</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Fecha de alta</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {users.map(u => {
                const isSelf = u.uid === currentUser.uid;
                const createdDate = new Date(u.createdAt).toLocaleDateString('es-ES');

                return (
                  <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{u.name}</span>
                        {isSelf && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                            (Tu cuenta)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {renderRoleBadge(u.role)}
                    </td>
                    <td className="py-3 px-4">
                      {renderStatus(u.status)}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                      {createdDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isSelf && (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setRoleChangeModalUser(u)}
                            className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                            title="Cambiar rol"
                          >
                            Rol
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleUserStatus(u.uid)}
                            className={`p-1 rounded text-xs transition-colors ${
                              u.status === 'activo'
                                ? 'text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'activo' ? 'Desactivar usuario' : 'Reactivar usuario'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Crear Nuevo Usuario</h3>
                <p className="text-xs text-slate-500 mt-0.5">Registre un colaborador de la congregación</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nombre completo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="Ej. David Fernández"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Correo electrónico <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="david.fernandez@congregacion.org"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Rol del usuario <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                >
                  <option value="USUARIO_BASICO">Usuario Básico (Solicitar y reproducir cantos)</option>
                  <option value="ADMIN">Admin (Aprobar solicitudes y gestionar biblioteca)</option>
                  <option value="SUPERADMIN">SuperAdmin (Gestión completa, usuarios y ajustes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contraseña inicial provisional
                </label>
                <input
                  type="text"
                  value={initialPassword}
                  onChange={e => setInitialPassword(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  El usuario podrá cambiar su contraseña al iniciar sesión en el entorno real de Firebase Auth.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs"
                >
                  Crear usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE ROLE MODAL */}
      {roleChangeModalUser && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Cambiar Rol de Usuario
              </h3>
              <button
                type="button"
                onClick={() => setRoleChangeModalUser(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Seleccione el nuevo nivel de acceso para <strong>{roleChangeModalUser.name}</strong>:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleRoleChangeConfirm('USUARIO_BASICO')}
                className={`w-full p-2.5 text-left text-xs rounded border transition-colors ${
                  roleChangeModalUser.role === 'USUARIO_BASICO'
                    ? 'border-blue-600 bg-blue-50/50 font-semibold text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <p className="font-medium">Usuario Básico</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChangeConfirm('ADMIN')}
                className={`w-full p-2.5 text-left text-xs rounded border transition-colors ${
                  roleChangeModalUser.role === 'ADMIN'
                    ? 'border-blue-600 bg-blue-50/50 font-semibold text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <p className="font-medium">Administrador</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChangeConfirm('SUPERADMIN')}
                className={`w-full p-2.5 text-left text-xs rounded border transition-colors ${
                  roleChangeModalUser.role === 'SUPERADMIN'
                    ? 'border-blue-600 bg-blue-50/50 font-semibold text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <p className="font-medium">SuperAdmin</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
