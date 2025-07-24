import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BusinessDataProvider } from "./contexts/BusinessDataContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";

// Dashboard pages
import Dashboard from "./pages/Dashboard";
import Owners from "./pages/dashboard/Owners";
import DashboardAppointments from "./pages/dashboard/DashboardAppointments";
import MedicalHistory from "./pages/dashboard/MedicalHistory";
import Grooming from "./pages/dashboard/Grooming";
import Inventory from "./pages/dashboard/Inventory";
import Sales from "./pages/dashboard/Sales";
import Reports from "./pages/dashboard/Reports";
import Notifications from "./pages/dashboard/Notifications";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BusinessDataProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/servicios" element={<Services />} />
                <Route path="/citas" element={<Appointments />} />
                <Route path="/contacto" element={<Contact />} />

                <Route path="/login" element={<Login />} />

                {/* Protected dashboard routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/owners"
                  element={
                    <ProtectedRoute
                      requiredRoles={["admin", "veterinarian", "receptionist"]}
                    >
                      <Owners />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/appointments"
                  element={
                    <ProtectedRoute
                      requiredRoles={[
                        "admin",
                        "veterinarian",
                        "receptionist",
                        "groomer",
                      ]}
                    >
                      <DashboardAppointments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/medical"
                  element={
                    <ProtectedRoute requiredRoles={["admin", "veterinarian"]}>
                      <MedicalHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/grooming"
                  element={
                    <ProtectedRoute
                      requiredRoles={["admin", "groomer", "receptionist"]}
                    >
                      <Grooming />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/inventory"
                  element={
                    <ProtectedRoute
                      requiredRoles={["admin", "veterinarian", "cashier"]}
                    >
                      <Inventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/sales"
                  element={
                    <ProtectedRoute requiredRoles={["admin", "cashier"]}>
                      <Sales />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/reports"
                  element={
                    <ProtectedRoute requiredRoles={["admin"]}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/notifications"
                  element={
                    <ProtectedRoute requiredRoles={["admin"]}>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <ProtectedRoute requiredRoles={["admin"]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </BusinessDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
