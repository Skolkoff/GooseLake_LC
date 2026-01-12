import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Public Layouts & Pages
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Order from './pages/Order';

// Admin Layouts & Pages
import { AdminLayout } from './components/AdminLayout';
import { Login as AdminLogin } from './pages/admin/Login';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { Catalog as AdminCatalog } from './pages/admin/Catalog';
import { Settings as AdminSettings } from './pages/admin/Settings';
import { QRGenerator as AdminQR } from './pages/admin/QRGenerator';
import { Users as AdminUsers } from './pages/admin/Users';

// Auth
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import { RequireRole } from './components/RequireRole';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="order" element={<Order />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={<RequireAuth />}>
              <Route element={<AdminLayout />}>
                {/* Dashboard available to all authenticated admins */}
                <Route index element={<AdminDashboard />} />

                {/* Catalog: ADMIN & CHEF */}
                <Route element={<RequireRole allowedRoles={['ADMIN', 'CHEF']} />}>
                  <Route path="catalog" element={<AdminCatalog />} />
                </Route>

                {/* Management: ADMIN & MANAGER */}
                <Route element={<RequireRole allowedRoles={['ADMIN', 'MANAGER']} />}>
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="qr" element={<AdminQR />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
