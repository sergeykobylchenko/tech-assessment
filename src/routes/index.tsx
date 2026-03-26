import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { LoginPage } from './pages/LoginPage';
import { CanvasPage } from './pages/CanvasPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: '/canvas',
            element: <CanvasPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
          {
            index: true,
            element: <Navigate to="/canvas" replace />,
          },
        ],
      },
    ],
  },
]);
