import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import AdminsPage from './pages/Admins';
import ArtistsPage from './pages/Artists';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyServicesPage from './pages/artist/MyServices';
import MyBookingsPage from './pages/artist/MyBookings';
import MyReviewsPage from './pages/artist/MyReviews';
import BrowseArtistsPage from './pages/customer/BrowseArtists';
import SettingsPage from './pages/Settings';
import { AuthService } from './services/AuthService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';

const queryClient = new QueryClient();

// Auth guard: must be logged in
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = AuthService.getCurrentUser();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Role guard: must have the correct role(s)
const RoleGuard = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const user = AuthService.getCurrentUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    // Refresh user profile on app load to get name for existing sessions
    if (AuthService.getCurrentUser()) {
      AuthService.refreshCurrentUser();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  {AuthService.getCurrentUser()?.role === 'admin' ? <AdminLayout /> : <Layout />}
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />

              {/* Admin-only Pages */}
              <Route path="users" element={<ErrorBoundary><RoleGuard allowedRoles={['admin']}><UsersPage /></RoleGuard></ErrorBoundary>} />
              <Route path="admins" element={<ErrorBoundary><RoleGuard allowedRoles={['admin']}><AdminsPage /></RoleGuard></ErrorBoundary>} />
              <Route path="artists" element={<ErrorBoundary><RoleGuard allowedRoles={['admin']}><ArtistsPage /></RoleGuard></ErrorBoundary>} />

              {/* Artist-only Pages */}
              <Route path="my-services" element={<ErrorBoundary><RoleGuard allowedRoles={['artist']}><MyServicesPage /></RoleGuard></ErrorBoundary>} />
              <Route path="my-bookings" element={<ErrorBoundary><RoleGuard allowedRoles={['artist', 'customer']}><MyBookingsPage /></RoleGuard></ErrorBoundary>} />
              <Route path="my-reviews" element={<ErrorBoundary><RoleGuard allowedRoles={['artist', 'customer']}><MyReviewsPage /></RoleGuard></ErrorBoundary>} />

              {/* Customer-only Pages */}
              <Route path="find-artists" element={<ErrorBoundary><RoleGuard allowedRoles={['customer']}><BrowseArtistsPage /></RoleGuard></ErrorBoundary>} />

              {/* Admin routes for services/bookings/reviews (admin sees all) */}
              <Route path="services" element={<ErrorBoundary><RoleGuard allowedRoles={['admin']}><MyServicesPage /></RoleGuard></ErrorBoundary>} />
              <Route path="bookings" element={<ErrorBoundary><RoleGuard allowedRoles={['admin']}><MyBookingsPage /></RoleGuard></ErrorBoundary>} />
              <Route path="reviews" element={<ErrorBoundary><RoleGuard allowedRoles={['admin']}><MyReviewsPage /></RoleGuard></ErrorBoundary>} />

              {/* Shared Pages */}
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}


export default App;
