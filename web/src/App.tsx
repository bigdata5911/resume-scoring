import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Home from "./pages/Dashboard/Home";
import JobDescriptions from "./pages/JobManagement/JobDescriptions";
import ResumeSubmissions from "./pages/JobManagement/ResumeSubmissions";
import ScoringResults from "./pages/JobManagement/ScoringResults";
import EmailConfigs from "./pages/EmailManagement/EmailConfigs";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Protected Dashboard Routes */}
        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          
          {/* Job Management Routes */}
          <Route path="/job-descriptions" element={<JobDescriptions />} />
          <Route path="/resume-submissions" element={<ResumeSubmissions />} />
          <Route path="/scoring-results" element={<ScoringResults />} />
          
          {/* Email Management Routes */}
          <Route path="/email-configs" element={<EmailConfigs />} />
        </Route>

        {/* Public Auth Routes */}
        <Route path="/signin" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
