import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-12 h-12 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<PrivateRoute><Home initialPage="browse" /></PrivateRoute>} />
          <Route path="/auth" element={<AuthPage mode="login" onSuccess={() => window.location.href = "/dashboard"} onNavigate={() => {}} />} />
          <Route path="/signup" element={<AuthPage mode="signup" onSuccess={() => window.location.href = "/dashboard"} onNavigate={() => {}} />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/skill-center" element={<Home initialPage="how" />} />
          
          {/* Protected Freelancer Routes */}
          <Route path="/reputation-vault" element={<PrivateRoute><Home initialPage="reputation-vault" /></PrivateRoute>} />
          <Route path="/portfolio-studio" element={<PrivateRoute><Home initialPage="portfolio-studio" /></PrivateRoute>} />
          <Route path="/academy" element={<PrivateRoute><Home initialPage="academy" /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><Home initialPage="payments" /></PrivateRoute>} />
          
          <Route path="/community" element={<PrivateRoute><Home initialPage="community" /></PrivateRoute>} />
          {/* Protected Client Routes */}
          <Route path="/radar" element={<PrivateRoute><Home initialPage="radar" /></PrivateRoute>} />
          <Route path="/command" element={<PrivateRoute><Home initialPage="command" /></PrivateRoute>} />
          <Route path="/finances" element={<PrivateRoute><Home initialPage="finances" /></PrivateRoute>} />
          <Route path="/poc-library" element={<PrivateRoute><Home initialPage="poc-library" /></PrivateRoute>} />
          <Route path="/bench" element={<PrivateRoute><Home initialPage="bench" /></PrivateRoute>} />
          <Route path="/insights" element={<PrivateRoute><Home initialPage="insights" /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" expand={true} richColors />
      </>
    </Suspense>
  );
}

// Auth Guard for private pages
function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

// Simple wrapper to handle auth check for dashboard
function DashboardWrapper() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/auth" replace />;
  return <Home initialPage="dashboard" />;
}

export default App;
