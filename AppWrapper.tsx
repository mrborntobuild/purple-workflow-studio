import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { CreditProvider } from './contexts/CreditContext';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import App from './App';
import ProfilePage from './components/ProfilePage';

// Public / Marketing Pages
import LandingPage from './components/pages/LandingPage';
import ExplorePage from './components/pages/ExplorePage';
import CreatorProfilePage from './components/pages/CreatorProfilePage';
import WorkflowStorePage from './components/pages/WorkflowStorePage';
import PricingPage from './components/pages/PricingPage';
import BlogPage from './components/pages/BlogPage';
import BuyCreditsPage from './components/pages/BuyCreditsPage';
import CreditSuccessPage from './components/pages/CreditSuccessPage';

// Client Dashboard Pages
import ClientDashboardPage from './components/pages/ClientDashboardPage';
import PostBriefPage from './components/pages/PostBriefPage';
import BrowseSearchPage from './components/pages/BrowseSearchPage';
import ProjectWorkspacePage from './components/pages/ProjectWorkspacePage';
import PaymentsPage from './components/pages/PaymentsPage';
import ReviewsPage from './components/pages/ReviewsPage';


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050506]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main App Wrapper
const AppWrapper = () => {
  return (
    <AuthProvider>
      <CreditProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Public / Marketing Pages (no auth required) */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/creator/:id" element={<CreatorProfilePage />} />
          <Route path="/workflows" element={<WorkflowStorePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route
            path="/buy-credits"
            element={
              <ProtectedRoute>
                <BuyCreditsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credits/success"
            element={
              <ProtectedRoute>
                <CreditSuccessPage />
              </ProtectedRoute>
            }
          />

          {/* Client Dashboard Pages (auth required) */}
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute>
                <ClientDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-brief"
            element={
              <ProtectedRoute>
                <PostBriefPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <BrowseSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectWorkspacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Default: Workflow Editor (auth required) */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      </CreditProvider>
    </AuthProvider>
  );
};

export default AppWrapper;
