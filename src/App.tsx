import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LeadsManager } from './pages/crm/LeadsManager';
import { ProjectManager } from './pages/projects/ProjectManager';
import { SubscriptionManager } from './pages/subscriptions/SubscriptionManager';
import { FinanceManager } from './pages/finance/FinanceManager';
import { SocialManager } from './pages/social/SocialManager';
import { UsersManager } from './pages/users/UsersManager';
import { PhotoVault } from './pages/photos/PhotoVault';
import { VideoVault } from './pages/videos/VideoVault';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />

              <Route path="/leads" element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <LeadsManager />
                </ProtectedRoute>
              } />

              <Route path="/users" element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                  <UsersManager />
                </ProtectedRoute>
              } />

              <Route path="/photos" element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Photographer', 'Editor', 'Client']}>
                  <PhotoVault />
                </ProtectedRoute>
              } />

              <Route path="/videos" element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Videographer', 'Editor', 'Client']}>
                  <VideoVault />
                </ProtectedRoute>
              } />

              <Route path="/social" element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Editor']}>
                  <SocialManager />
                </ProtectedRoute>
              } />

              <Route path="/projects" element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Editor', 'Photographer', 'Videographer']}>
                  <ProjectManager />
                </ProtectedRoute>
              } />

              <Route path="/finance" element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Accountant']}>
                  <FinanceManager />
                </ProtectedRoute>
              } />

              <Route path="/subscriptions" element={
                <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Accountant']}>
                  <SubscriptionManager />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
