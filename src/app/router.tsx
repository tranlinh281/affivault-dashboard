import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import CategoriesPage from '../pages/CategoriesPage';
import DashboardPage from '../pages/DashboardPage';
import LinksPage from '../pages/LinksPage';
import LoginPage from '../pages/LoginPage';
import ImportPage from '../pages/ImportPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'links',
            element: <LinksPage />,
          },
          {
            path: 'categories',
            element: <CategoriesPage />,
          },
           {
            path: 'import',
            element: <ImportPage />,
          },
        ],
      },
    ],
  },
]);