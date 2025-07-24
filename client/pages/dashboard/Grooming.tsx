import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessData } from '@/contexts/BusinessDataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Scissors,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Camera,
  Download,
  Sparkles,
  Heart,
  Star,
  User,
  Phone
} from 'lucide-react';

interface GroomingService {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  category: 'basic' | 'premium' | 'spa' | 'medical';
  isActive: boolean;
}

interface GroomingAppointment {
  id: string;
  petId: string;
  petName: string;
  ownerName: string;
  ownerPhone: string;
  services: string[];
  date: Date;
  startTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  groomerName: string;
  notes: string;
  beforePhotos: string[];
  afterPhotos: string[];
  totalPrice: number;
  createdAt: Date;
}

export default function Grooming() {
  const { hasRole } = useAuth();
  const { isLoading } = useBusinessData();
  const { showSuccess, showError } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewServiceDialogOpen, setIsNewServiceDialogOpen] = useState(false);
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<GroomingAppointment | null>(null);

  // Mock grooming services
  const groomingServices: GroomingService[] = [
    {
      id: '1',
      name: 'Baño Básico',
      description: 'Baño con shampoo, secado y corte de uñas',
      duration: 45,
      price: 50,
      category: 'basic',
      isActive: true
    },
    {
      id: '2',
      name: 'Grooming Completo',
      description: 'Baño, corte, peinado, limpieza de oídos y corte de uñas',
      duration: 90,
      price: 80,
      category: 'premium',
      isActive: true
    },
    {
      id: '3',
      name: 'Spa Relajante',
      description: 'Baño aromático, masaje relajante y tratamiento de pelaje',
      duration: 120,
      price: 120,
      category: 'spa',
      isActive: true
    },
    {
      id: '4',
      name: 'Corte Médico',
      description: 'Corte especializado para problemas dermatológicos',
      duration: 60,
      price: 100,
      category: 'medical',
      isActive: true
    }
  ];

  // Mock grooming appointments
  const groomingAppointments: GroomingAppointment[] = [
    {
      id: '1',
      petId: '1',
      petName: 'Max',
      ownerName: 'Carlos Pérez',
      ownerPhone: '+51 987654321',
      services: ['1', '2'],
      date: new Date(),
      startTime: '09:00',
      status: 'scheduled',
      groomerName: 'Sofia López',
      notes: 'Perro muy activo, usar correa de seguridad',
      beforePhotos: [],
      afterPhotos: [],
      totalPrice: 130,
      createdAt: new Date()
    },
    {
      id: '2',
      petId: '2',
      petName: 'Luna',
      ownerName: 'María García',
      ownerPhone: '+51 912345678',
      services: ['3'],
      date: new Date(),
      startTime: '11:00',
      status: 'in-progress',
      groomerName: 'Sofia López',
      notes: 'Gata nerviosa, manejar con cuidado',
      beforePhotos: ['/photos/luna-before.jpg'],
      afterPhotos: [],
      totalPrice: 120,
      createdAt: new Date()
    },
    {
      id: '3',
      petId: '3',
      petName: 'Rocky',
      ownerName: 'Juan Martínez',
      ownerPhone: '+51 956789123',
      services: ['2'],
      date: new Date(Date.now() - 86400000), // Yesterday
      startTime: '14:00',
      status: 'completed',
      groomerName: 'Sofia López',
      notes: 'Excelente comportamiento',
      beforePhotos: ['/photos/rocky-before.jpg'],
      afterPhotos: ['/photos/rocky-after.jpg'],
      totalPrice: 80,
      createdAt: new Date(Date.now() - 86400000)
    }
  ];

  const filteredAppointments = groomingAppointments.filter(appointment => {
    const matchesSearch = 
      appointment.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: 'Programada',
      'in-progress': 'En Progreso',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-800',
      premium: 'bg-blue-100 text-blue-800',
      spa: 'bg-purple-100 text-purple-800',
      medical: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      basic: 'Básico',
      premium: 'Premium',
      spa: 'Spa',
      medical: 'Médico'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getServiceName = (serviceId: string) => {
    const service = groomingServices.find(s => s.id === serviceId);
    return service?.name || 'Servicio desconocido';
  };

  const handleStartGrooming = (appointmentId: string) => {
    showSuccess('Sesión de grooming iniciada', 'El timer ha comenzado automáticamente');
  };

  const handleCompleteGrooming = (appointmentId: string) => {
    showSuccess('Grooming completado', 'Se ha enviado notificación al propietario');
  };

  const NewServiceForm = () => (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service-name">Nombre del Servicio *</Label>
          <Input id="service-name" placeholder="Ej: Baño Premium" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-category">Categoría *</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Básico</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="spa">Spa</SelectItem>
              <SelectItem value="medical">Médico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service-duration">Duración (minutos) *</Label>
          <Input id="service-duration" type="number" placeholder="60" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-price">Precio (S/) *</Label>
          <Input id="service-price" type="number" placeholder="80" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-description">Descripción *</Label>
        <Textarea
          id="service-description"
          placeholder="Descripción detallada del servicio..."
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsNewServiceDialogOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit">
          Crear Servicio
        </Button>
      </div>
    </form>
  );

  const NewAppointmentForm = () => (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appointment-pet">Mascota *</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar mascota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">
                <div className="flex items-center space-x-2">
                  <Heart className="w-3 h-3 text-green-600" />
                  <span>Max - Golden Retriever</span>
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center space-x-2">
                  <Heart className="w-3 h-3 text-purple-600" />
                  <span>Luna - Gato Persa</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointment-groomer">Groomer Asignado</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Asignar groomer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sofia">Sofia López</SelectItem>
              <SelectItem value="carlos">Carlos Mendoza</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Servicios *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {groomingServices.map((service) => (
            <div key={service.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted cursor-pointer">
              <input type="checkbox" id={`service-${service.id}`} className="rounded" />
              <div className="flex-1">
                <label htmlFor={`service-${service.id}`} className="text-sm font-medium cursor-pointer">
                  {service.name}
                </label>
                <div className="flex items-center justify-between mt-1">
                  <Badge className={getCategoryColor(service.category)}>
                    {getCategoryLabel(service.category)}
                  </Badge>
                  <span className="text-sm font-semibold text-green-600">S/ {service.price}</span>
                </div>
                <p className="text-xs text-muted-foreground">{service.duration} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appointment-date">Fecha *</Label>
          <Input id="appointment-date" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointment-time">Hora *</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar hora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="09:00">09:00</SelectItem>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="11:00">11:00</SelectItem>
              <SelectItem value="14:00">14:00</SelectItem>
              <SelectItem value="15:00">15:00</SelectItem>
              <SelectItem value="16:00">16:00</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="appointment-notes">Notas Especiales</Label>
        <Textarea
          id="appointment-notes"
          placeholder="Instrucciones especiales, alergias, comportamiento..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsNewAppointmentDialogOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit">
          Agendar Grooming
        </Button>
      </div>
    </form>
  );

  const AppointmentDetailsDialog = ({ appointment }: { appointment: GroomingAppointment | null }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Scissors className="w-5 h-5" />
          <span>Sesión de Grooming - {appointment?.petName}</span>
        </DialogTitle>
        <DialogDescription>
          {appointment && `${appointment.ownerName} - ${appointment.date.toLocaleDateString('es-PE')} a las ${appointment.startTime}`}
        </DialogDescription>
      </DialogHeader>
      
      {appointment && (
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
            <TabsTrigger value="timeline">Progreso</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Información de la Mascota</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Mascota</Label>
                    <p className="text-sm">{appointment.petName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Propietario</Label>
                    <p className="text-sm">{appointment.ownerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                    <p className="text-sm flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {appointment.ownerPhone}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Información de la Sesión</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Groomer</Label>
                    <p className="text-sm">{appointment.groomerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Total</Label>
                    <p className="text-sm font-semibold text-green-600">S/ {appointment.totalPrice}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {appointment.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notas Especiales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{appointment.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="space-y-4">
              {appointment.services.map((serviceId) => {
                const service = groomingServices.find(s => s.id === serviceId);
                return service ? (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Scissors className="w-5 h-5 text-primary" />
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">S/ {service.price}</p>
                          <p className="text-xs text-muted-foreground">{service.duration} min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null;
              })}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Fotos Antes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointment.beforePhotos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {appointment.beforePhotos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Sin fotos</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Fotos Después</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointment.afterPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {appointment.afterPhotos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Sin fotos</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Cita Agendada</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.createdAt.toLocaleDateString('es-PE')} - {appointment.createdAt.toLocaleTimeString('es-PE')}
                  </p>
                </div>
              </div>
              
              {appointment.status !== 'scheduled' && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Grooming Iniciado</p>
                    <p className="text-sm text-muted-foreground">En progreso...</p>
                  </div>
                </div>
              )}
              
              {appointment.status === 'completed' && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Grooming Completado</p>
                    <p className="text-sm text-muted-foreground">Mascota lista para entrega</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </DialogContent>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Cargando módulo de grooming..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Grooming</h1>
            <p className="text-muted-foreground">
              Administra servicios de grooming y sesiones programadas
            </p>
          </div>
          <div className="flex space-x-2">
            {hasRole(['admin', 'groomer']) && (
              <>
                <Dialog open={isNewServiceDialogOpen} onOpenChange={setIsNewServiceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Servicio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                      <DialogDescription>
                        Agrega un nuevo servicio de grooming al catálogo
                      </DialogDescription>
                    </DialogHeader>
                    <NewServiceForm />
                  </DialogContent>
                </Dialog>

                <Dialog open={isNewAppointmentDialogOpen} onOpenChange={setIsNewAppointmentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Calendar className="w-4 h-4 mr-2" />
                      Nueva Cita
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Agendar Sesión de Grooming</DialogTitle>
                      <DialogDescription>
                        Programa una nueva sesión de grooming para una mascota
                      </DialogDescription>
                    </DialogHeader>
                    <NewAppointmentForm />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas de Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {groomingAppointments.filter(apt => 
                  apt.date.toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">Sesiones programadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {groomingAppointments.filter(apt => apt.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground">Sesiones activas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {groomingAppointments.filter(apt => apt.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/ 2,400</div>
              <p className="text-xs text-muted-foreground">+15% vs mes anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services List */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios de Grooming</CardTitle>
              <CardDescription>
                Catálogo de servicios disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groomingServices.map((service) => (
                <div key={service.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{service.name}</h3>
                    <Badge className={getCategoryColor(service.category)}>
                      {getCategoryLabel(service.category)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{service.duration} min</span>
                    </div>
                    <span className="font-semibold text-green-600">S/ {service.price}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Citas de Grooming</CardTitle>
                <CardDescription>
                  Gestiona las sesiones programadas y en progreso
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar por mascota o propietario..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="scheduled">Programadas</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="completed">Completadas</SelectItem>
                      <SelectItem value="cancelled">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Appointments Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha y Hora</TableHead>
                        <TableHead>Mascota</TableHead>
                        <TableHead>Servicios</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {appointment.date.toLocaleDateString('es-PE')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.startTime}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{appointment.petName}</p>
                              <p className="text-sm text-muted-foreground">{appointment.ownerName}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {appointment.services.slice(0, 2).map((serviceId) => (
                                <Badge key={serviceId} variant="outline" className="text-xs">
                                  {getServiceName(serviceId)}
                                </Badge>
                              ))}
                              {appointment.services.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{appointment.services.length - 2} más
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusLabel(appointment.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-green-600">
                              S/ {appointment.totalPrice}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedAppointment(appointment)}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                </DialogTrigger>
                                <AppointmentDetailsDialog appointment={selectedAppointment} />
                              </Dialog>
                              
                              {appointment.status === 'scheduled' && hasRole(['admin', 'groomer']) && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleStartGrooming(appointment.id)}
                                >
                                  Iniciar
                                </Button>
                              )}
                              
                              {appointment.status === 'in-progress' && hasRole(['admin', 'groomer']) && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleCompleteGrooming(appointment.id)}
                                >
                                  Completar
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
