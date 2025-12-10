import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CustomerList from "./pages/CustomerList";
import BillingPage from "./pages/BillingPage";
import PaymentsPage from "./pages/PaymentsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { CustomerProvider } from "./context/CustomerContext";
import { UtilityProvider } from "./context/UtilityContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}

function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <UtilityProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="customers" element={<CustomerList />} />
                  <Route path="billing" element={<BillingPage />} />
                  <Route path="payments" element={<PaymentsPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </UtilityProvider>
      </CustomerProvider>
    </AuthProvider>
  );
}

export default App;
