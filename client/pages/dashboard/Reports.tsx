import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessData } from '@/contexts/BusinessDataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  FileText,
  DollarSign,
  Users,
  Package,
  Stethoscope,
  ShoppingCart,
  Heart,
  Scissors,
  Filter,
  RefreshCw
} from 'lucide-react';

interface ReportData {
  appointments: {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    revenue: number;
    monthlyGrowth: number;
  };
  sales: {
    total: number;
    revenue: number;
    byCategory: Record<string, { quantity: number; revenue: number }>;
    topProducts: { name: string; quantity: number; revenue: number }[];
    monthlyGrowth: number;
  };
  inventory: {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    expiringItems: number;
    topMovingProducts: { name: string; sold: number }[];
  };
  customers: {
    total: number;
    newThisMonth: number;
    topCustomers: { name: string; spent: number; visits: number }[];
    retentionRate: number;
  };
}

export default function Reports() {
  const { hasRole } = useAuth();
  const { isLoading } = useBusinessData();
  const { showSuccess } = useNotifications();
  
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock report data
  const reportData: ReportData = {
    appointments: {
      total: 156,
      byType: {
        consultation: 89,
        vaccination: 34,
        surgery: 12,
        grooming: 21
      },
      byStatus: {
        completed: 142,
        cancelled: 8,
        'no-show': 6
      },
      revenue: 8450,
      monthlyGrowth: 15.2
    },
    sales: {
      total: 89,
      revenue: 12340,
      byCategory: {
        medicine: { quantity: 45, revenue: 5600 },
        food: { quantity: 23, revenue: 4200 },
        accessory: { quantity: 21, revenue: 2540 }
      },
      topProducts: [
        { name: 'Alimento Premium Royal Canin', quantity: 15, revenue: 2700 },
        { name: 'Vacuna Antirrábica', quantity: 12, revenue: 540 },
        { name: 'Collar Antipulgas', quantity: 8, revenue: 680 }
      ],
      monthlyGrowth: 22.8
    },
    inventory: {
      totalProducts: 45,
      totalValue: 34500,
      lowStockItems: 5,
      expiringItems: 3,
      topMovingProducts: [
        { name: 'Alimento Premium', sold: 15 },
        { name: 'Shampoo Medicado', sold: 12 },
        { name: 'Vitaminas', sold: 8 }
      ]
    },
    customers: {
      total: 245,
      newThisMonth: 18,
      topCustomers: [
        { name: 'Carlos Pérez', spent: 850, visits: 8 },
        { name: 'María García', spent: 720, visits: 6 },
        { name: 'Juan Martínez', spent: 540, visits: 4 }
      ],
      retentionRate: 87.5
    }
  };

  const handleExportReport = async (format: 'pdf' | 'excel') => {
    setIsGenerating(true);
    
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showSuccess(
      'Reporte generado',
      `Reporte exportado en formato ${format.toUpperCase()} correctamente`
    );
    
    setIsGenerating(false);
  };

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    format = 'number' 
  }: { 
    title: string; 
    value: number; 
    growth?: number; 
    icon: React.ComponentType<{ className?: string }>; 
    format?: 'number' | 'currency' | 'percentage';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency': return `S/ ${val.toLocaleString()}`;
        case 'percentage': return `${val}%`;
        default: return val.toLocaleString();
      }
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(value)}</div>
          {growth !== undefined && (
            <p className={`text-xs flex items-center ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(growth)}% vs mes anterior
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Cargando reportes..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reportes y Analíticas</h1>
            <p className="text-muted-foreground">
              Estadísticas detalladas y reportes del negocio
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="date-range">Período:</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => handleExportReport('excel')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Excel
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleExportReport('pdf')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Ingresos Totales"
            value={reportData.appointments.revenue + reportData.sales.revenue}
            growth={18.5}
            icon={DollarSign}
            format="currency"
          />
          <StatCard
            title="Citas Atendidas"
            value={reportData.appointments.total}
            growth={reportData.appointments.monthlyGrowth}
            icon={Calendar}
          />
          <StatCard
            title="Ventas Realizadas"
            value={reportData.sales.total}
            growth={reportData.sales.monthlyGrowth}
            icon={ShoppingCart}
          />
          <StatCard
            title="Clientes Activos"
            value={reportData.customers.total}
            growth={7.3}
            icon={Users}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos por Servicios</CardTitle>
                  <CardDescription>Distribución de ingresos por tipo de servicio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        <span>Consultas Veterinarias</span>
                      </div>
                      <span className="font-semibold">S/ {(reportData.appointments.revenue * 0.6).toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Scissors className="w-4 h-4 text-purple-600" />
                        <span>Servicios de Grooming</span>
                      </div>
                      <span className="font-semibold">S/ {(reportData.appointments.revenue * 0.25).toFixed(0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                        <span>Venta de Productos</span>
                      </div>
                      <span className="font-semibold">S/ {reportData.sales.revenue}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '70%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores Clave</CardTitle>
                  <CardDescription>Métricas importantes del negocio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{reportData.customers.retentionRate}%</p>
                      <p className="text-sm text-blue-800">Retención de Clientes</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        S/ {((reportData.appointments.revenue + reportData.sales.revenue) / reportData.appointments.total).toFixed(0)}
                      </p>
                      <p className="text-sm text-green-800">Ticket Promedio</p>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {((reportData.appointments.byStatus.completed / reportData.appointments.total) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-purple-800">Tasa de Completación de Citas</p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{reportData.inventory.lowStockItems}</p>
                    <p className="text-sm text-orange-800">Productos con Stock Bajo</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Mejores Clientes del Mes</CardTitle>
                <CardDescription>Clientes con mayor actividad y gasto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.customers.topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.visits} visitas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">S/ {customer.spent}</p>
                        <p className="text-sm text-muted-foreground">gastado</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Citas por Tipo</CardTitle>
                  <CardDescription>Distribución de tipos de citas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.appointments.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="capitalize">{type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{width: `${(count / reportData.appointments.total) * 100}%`}}
                            ></div>
                          </div>
                          <span className="font-semibold w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de Citas</CardTitle>
                  <CardDescription>Distribución por estado de citas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.appointments.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="capitalize">{status}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{width: `${(count / reportData.appointments.total) * 100}%`}}
                            ></div>
                          </div>
                          <span className="font-semibold w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas por Categoría</CardTitle>
                  <CardDescription>Ingresos y cantidad por categoría de producto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.sales.byCategory).map(([category, data]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-medium">{category}</span>
                          <span className="font-semibold">S/ {data.revenue}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{data.quantity} productos vendidos</span>
                          <span>{((data.revenue / reportData.sales.revenue) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                  <CardDescription>Top productos por cantidad y ingresos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.sales.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.quantity} unidades</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600">S/ {product.revenue}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Productos"
                value={reportData.inventory.totalProducts}
                icon={Package}
              />
              <StatCard
                title="Valor Total"
                value={reportData.inventory.totalValue}
                icon={DollarSign}
                format="currency"
              />
              <StatCard
                title="Stock Bajo"
                value={reportData.inventory.lowStockItems}
                icon={TrendingDown}
              />
              <StatCard
                title="Por Vencer"
                value={reportData.inventory.expiringItems}
                icon={Calendar}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Productos Más Movidos</CardTitle>
                <CardDescription>Productos con mayor rotación</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Posición</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Unidades Vendidas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.inventory.topMovingProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sold}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Clientes"
                value={reportData.customers.total}
                icon={Users}
              />
              <StatCard
                title="Nuevos este Mes"
                value={reportData.customers.newThisMonth}
                icon={TrendingUp}
              />
              <StatCard
                title="Tasa de Retención"
                value={reportData.customers.retentionRate}
                icon={Heart}
                format="percentage"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Clientes</CardTitle>
                <CardDescription>Información detallada de la base de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Total Gastado</TableHead>
                      <TableHead>Visitas</TableHead>
                      <TableHead>Promedio por Visita</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.customers.topCustomers.map((customer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>S/ {customer.spent}</TableCell>
                        <TableCell>{customer.visits}</TableCell>
                        <TableCell>S/ {(customer.spent / customer.visits).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
