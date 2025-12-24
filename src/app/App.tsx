import DashboardPage from "./pages/dashboard";
import LoginPage from "./pages/login";
import { AuthProvider, useAuth } from "../lib/authContext";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authChanged, setAuthChanged] = useState(false);

  // Trigger re-render saat auth state berubah
  useEffect(() => {
    setAuthChanged(!authChanged);
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Mengecek status login...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            fontSize: "16px",
            padding: "16px 24px",
            borderRadius: "12px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
          },
          classNames: {
            toast: "text-lg",
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}