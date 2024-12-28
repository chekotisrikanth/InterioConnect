import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Toaster } from 'react-hot-toast';
import { routes } from './routes';
import { RootLayout } from './components/RootLayout';

// Create router instance
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: routes[0].children,
  },
]);

export function App() {
  // Initialize auth on mount
  React.useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;