import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoSwitcher } from './components/layout/DemoSwitcher';
import { Header } from './components/layout/Header';
import { LoginView } from './components/auth/LoginView';
import { LibraryView } from './components/library/LibraryView';
import { UserRequestsView } from './components/requests/UserRequestsView';
import { AdminRequestsView } from './components/requests/AdminRequestsView';
import { AdminDashboardView } from './components/dashboard/AdminDashboardView';
import { AdminHistoryView } from './components/history/AdminHistoryView';
import { UserManagementView } from './components/users/UserManagementView';
import { SettingsView } from './components/settings/SettingsView';
import { MyAccountView } from './components/account/MyAccountView';
import { VideoPlayerView } from './components/player/VideoPlayerView';
import { Toast } from './components/common/Toast';

const MainAppContent: React.FC = () => {
  const { currentUser, activeTab, playingSong, stopPlayingSong } = useApp();

  // If user is not logged in, render the login view
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <DemoSwitcher />
        <LoginView />
        <Toast />
      </div>
    );
  }

  // If playing a song, render dedicated minimal presentation player (Google Meet optimized)
  if (playingSong) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <VideoPlayerView song={playingSong} onClose={stopPlayingSong} />
      </div>
    );
  }

  // Active view routing based on tab and role
  const renderActiveView = () => {
    switch (activeTab) {
      case 'inicio':
        return <AdminDashboardView />;

      case 'biblioteca':
        return <LibraryView />;

      case 'solicitudes':
        if (currentUser.role === 'USUARIO_BASICO') {
          return <UserRequestsView />;
        }
        return <AdminRequestsView />;

      case 'historial':
        return <AdminHistoryView />;

      case 'usuarios':
        return <UserManagementView />;

      case 'configuracion':
        return <SettingsView />;

      case 'cuenta':
        return <MyAccountView />;

      default:
        return <LibraryView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Discreet Demo Switcher bar for testing all 3 user roles */}
      <DemoSwitcher />

      {/* Main Header with Top Bar Contract */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderActiveView()}
      </main>

      {/* Quiet, clean institutional footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Videoteca de Cantos Espirituales · Uso privado para servicios congregacionales y Google Meet.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Iglesia Bíblica Gracia y Comunión</span>
            <span aria-hidden="true">·</span>
            <span>Versión 1.0 (Prototipo)</span>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
