import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessData } from "@/contexts/BusinessDataContext";
import {
  Users,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Heart,
  Stethoscope,
  Scissors,
  Plus,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const {
    getStats,
    getUpcomingAppointments,
    getUpcomingVaccinations,
    isLoading,
  } = useBusinessData();

  const stats = getStats();
  const upcomingAppointments = getUpcomingAppointments().slice(0, 3);
  const upcomingVaccinations = getUpcomingVaccinations().slice(0, 3);

  // Mock low stock items - will be replaced with inventory module
  const lowStockItems = [
    { name: "Vacuna Antirrábica", stock: 2, minStock: 10 },
    { name: "Antibiótico X", stock: 1, minStock: 5 },
    { name: "Alimento Premium", stock: 3, minStock: 15 },
  ];

  const getAppointmentTypeLabel = (type: string) => {
    const types = {
      consultation: "Consulta",
      vaccination: "Vacunación",
      surgery: "Cirugía",
      grooming: "Grooming",
      emergency: "Emergencia",
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              ¡Bienvenido, {user?.fullName}!
            </h1>
            <p className="text-muted-foreground">
              Aquí tienes un resumen de las actividades de hoy
            </p>
          </div>
          <div className="flex space-x-2">
            {hasRole(["admin", "veterinarian", "receptionist"]) && (
              <Button asChild>
                <Link to="/dashboard/appointments">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Cita
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hasRole(["admin", "veterinarian", "receptionist", "groomer"]) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Citas de Hoy
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.todayAppointments}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingAppointments} pendientes de confirmar
                </p>
              </CardContent>
            </Card>
          )}

          {hasRole(["admin", "veterinarian", "receptionist"]) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Propietarios
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOwners}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalPets} mascotas registradas
                </p>
              </CardContent>
            </Card>
          )}

          {hasRole(["admin", "veterinarian", "cashier"]) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inventario
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.lowStockItems}
                </div>
                <p className="text-xs text-muted-foreground">
                  productos con stock bajo
                </p>
              </CardContent>
            </Card>
          )}

          {hasRole(["admin", "cashier"]) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas de Hoy
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.todaySales}</div>
                <p className="text-xs text-muted-foreground">
                  ${stats.monthSales} este mes
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          {hasRole(["admin", "veterinarian", "receptionist", "groomer"]) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Próximas Citas</span>
                </CardTitle>
                <CardDescription>Citas programadas para hoy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium">
                            {appointment.startTime} - {appointment.petName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.ownerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {getAppointmentTypeLabel(appointment.appointmentType)}
                        </Badge>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status === "confirmed"
                            ? "Confirmada"
                            : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No hay citas próximas programadas
                  </div>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/appointments">Ver Todas las Citas</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Low Stock Alert */}
          {hasRole(["admin", "veterinarian", "cashier"]) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Alertas de Inventario</span>
                </CardTitle>
                <CardDescription>
                  Productos que requieren atención
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-red-800">{item.name}</p>
                      <p className="text-sm text-red-600">
                        Stock: {item.stock} / Mínimo: {item.minStock}
                      </p>
                    </div>
                    <Badge variant="destructive">Bajo Stock</Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/inventory">Gestionar Inventario</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accesos directos a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hasRole(["admin", "veterinarian", "receptionist"]) && (
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/dashboard/owners">
                    <Users className="w-6 h-6 mb-2" />
                    Nuevo Propietario
                  </Link>
                </Button>
              )}

              {hasRole([
                "admin",
                "veterinarian",
                "receptionist",
                "groomer",
              ]) && (
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/dashboard/appointments">
                    <Calendar className="w-6 h-6 mb-2" />
                    Agendar Cita
                  </Link>
                </Button>
              )}

              {hasRole(["admin", "veterinarian"]) && (
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/dashboard/medical">
                    <Stethoscope className="w-6 h-6 mb-2" />
                    Historial Clínico
                  </Link>
                </Button>
              )}

              {hasRole(["admin", "cashier"]) && (
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/dashboard/sales">
                    <DollarSign className="w-6 h-6 mb-2" />
                    Nueva Venta
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
