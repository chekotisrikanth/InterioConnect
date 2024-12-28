import React from 'react';
import { Header } from './components/Header';
import { BrowseDesigners } from './pages/BrowseDesigners';
import { AdminDashboard } from './pages/admin/Dashboard';
import { useAuthStore } from './stores/authStore';
import { Toaster } from 'react-hot-toast';

function App() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  const pathname = window.location.pathname;

  // Initialize auth on mount
  React.useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      {isAdmin && pathname === '/admin' ? (
        <AdminDashboard />
      ) : (
        <>
          <Header />
          <BrowseDesigners />
        </>
      )}
    </div>
  );
}

export default App;