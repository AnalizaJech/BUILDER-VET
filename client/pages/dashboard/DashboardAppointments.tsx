import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  User,
  Heart,
  Stethoscope,
  Scissors,
  AlertCircle,
  CheckCircle,
  Eye,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Appointment, AppointmentType, AppointmentStatus } from '@shared/types';

// Helper function to safely format dates
const safeFormatDate = (date: any, formatStr: string, options?: any): string => {
  if (!date) return 'Fecha no disponible';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }

  try {
    return format(dateObj, formatStr, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error en fecha';
  }
};

export default function DashboardAppointments() {
  const { hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);

  // Mock data - in real app this would come from API
  const appointments: (Appointment & { petName: string; ownerName: string; ownerPhone: string })[] = [
    {
      id: '1',
      petId: '1',
      ownerId: '1',
      veterinarianId: '2',
      appointmentType: 'consultation',
      date: new Date('2024-01-20'),
      startTime: '09:00',
      duration: 30,
      status: 'confirmed',
      notes: 'Chequeo de rutina. El dueño menciona que ha estado un poco decaído.',
      reminderSent: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-18'),
      petName: 'Max',
      ownerName: 'Carlos Pérez',
      ownerPhone: '+51 987654321'
    },
    {
      id: '2',
      petId: '2',
      ownerId: '1',
      veterinarianId: '2',
      appointmentType: 'vaccination',
      date: new Date('2024-01-20'),
      startTime: '10:30',
      duration: 15,
      status: 'confirmed',
      notes: 'Vacuna antirrábica anual',
      reminderSent: true,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-18'),
      petName: 'Luna',
      ownerName: 'Carlos Pérez',
      ownerPhone: '+51 987654321'
    },
    {
      id: '3',
      petId: '3',
      ownerId: '2',
      veterinarianId: undefined,
      appointmentType: 'grooming',
      date: new Date('2024-01-20'),
      startTime: '11:00',
      duration: 120,
      status: 'pending',
      notes: 'Corte completo y baño. Dueña solicita corte especial para concurso.',
      reminderSent: false,
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17'),
      petName: 'Rocky',
      ownerName: 'María García',
      ownerPhone: '+51 912345678'
    },
    {
      id: '4',
      petId: '4',
      ownerId: '3',
      veterinarianId: '2',
      appointmentType: 'surgery',
      date: new Date('2024-01-21'),
      startTime: '08:00',
      duration: 180,
      status: 'scheduled',
      notes: 'Esterilización programada. Ayuno de 12 horas requerido.',
      reminderSent: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      petName: 'Mia',
      ownerName: 'Juan Martínez',
      ownerPhone: '+51 956789123'
    }
  ];

  const appointmentTypes = [
    { value: 'consultation', label: 'Consulta', duration: 30, price: 'S/ 60', icon: Stethoscope },
    { value: 'vaccination', label: 'Vacunación', duration: 15, price: 'S/ 40', icon: Heart },
    { value: 'surgery', label: 'Cirugía', duration: 120, price: 'S/ 350', icon: Stethoscope },
    { value: 'grooming', label: 'Grooming', duration: 90, price: 'S/ 100', icon: Scissors },
    { value: 'emergency', label: 'Emergencia', duration: 60, price: 'S/ 120', icon: AlertCircle }
  ];

  const statusConfig = {
    scheduled: { label: 'Programada', color: 'bg-blue-100 text-blue-800' },
    pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-800' },
    'in-progress': { label: 'En Progreso', color: 'bg-orange-100 text-orange-800' },
    completed: { label: 'Completada', color: 'bg-gray-100 text-gray-800' },
    cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
    'no-show': { label: 'No Asistió', color: 'bg-red-100 text-red-800' }
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.ownerPhone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.appointmentType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeConfig = (type: AppointmentType) => {
    return appointmentTypes.find(t => t.value === type) || appointmentTypes[0];
  };

  const handleSendReminder = (appointment: any) => {
    // Simulate sending reminder
    alert(`Recordatorio enviado a ${appointment.ownerName} para la cita de ${appointment.petName}`);
  };

  const handleEditAppointment = (appointment: any) => {
    setAppointmentToEdit(appointment);
    setIsEditDialogOpen(true);
  };

  const handleCancelAppointment = (appointment: any) => {
    if (confirm(`¿Estás seguro de que deseas cancelar la cita de ${appointment.petName}?`)) {
      alert(`Cita de ${appointment.petName} cancelada exitosamente`);
    }
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cita creada exitosamente');
    setIsCreateDialogOpen(false);
  };

  const CreateAppointmentForm = () => {
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedPet, setSelectedPet] = useState<string>('');

    return (
      <form className="space-y-4" onSubmit={handleCreateAppointment}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="owner">Propietario *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar propietario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Carlos Pérez</SelectItem>
                <SelectItem value="2">María García</SelectItem>
                <SelectItem value="3">Juan Martínez</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet">Mascota *</Label>
            <Select value={selectedPet} onValueChange={setSelectedPet} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar mascota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-3 h-3 text-green-600" />
                    <span>Max (Perro - Golden Retriever)</span>
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-3 h-3 text-purple-600" />
                    <span>Luna (Gato - Persa)</span>
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-3 h-3 text-green-600" />
                    <span>Rocky (Perro - Bulldog Francés)</span>
                  </div>
                </SelectItem>
                <SelectItem value="4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-3 h-3 text-purple-600" />
                    <span>Mia (Gato - Siamés)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Cita *</Label>
          <Select value={selectedType} onValueChange={setSelectedType} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de cita" />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground">({type.duration} min)</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Fecha *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Hora *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime} required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar hora" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasRole(['admin', 'veterinarian']) && (
          <div className="space-y-2">
            <Label htmlFor="veterinarian">Veterinario</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Asignar veterinario (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Dr. Carlos Rodríguez</SelectItem>
                <SelectItem value="3">Dra. Ana Martínez</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            placeholder="Información adicional sobre la cita..."
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" variant="success">
            <Plus className="w-4 h-4 mr-2" />
            Agendar Cita
          </Button>
        </div>
      </form>
    );
  };

  const AppointmentDetailsDialog = ({ appointment }: { appointment: any }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5" />
          <span>Detalles de la Cita</span>
        </DialogTitle>
        <DialogDescription>
          {appointment?.petName} - {safeFormatDate(appointment?.date, "PPP", { locale: es })} a las {appointment?.startTime}
        </DialogDescription>
      </DialogHeader>
      
      {appointment && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Información de la Cita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                  <div className="text-sm flex items-center space-x-2">
                    <Badge variant="outline">
                      {getTypeConfig(appointment.appointmentType).label}
                    </Badge>
                    <span className="text-muted-foreground">({appointment.duration} min)</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                  <Badge className={statusConfig[appointment.status].color}>
                    {statusConfig[appointment.status].label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Recordatorio</Label>
                  <p className="text-sm flex items-center space-x-1">
                    {appointment.reminderSent ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>Enviado</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-yellow-600" />
                        <span>Pendiente</span>
                      </>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Propietario y Mascota</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Mascota</Label>
                  <p className="text-sm flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    {appointment.petName}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {appointment.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{appointment.notes}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <div className="space-x-2">
              {!appointment.reminderSent && hasRole(['admin', 'receptionist']) && (
                <Button size="sm" variant="info" onClick={() => handleSendReminder(appointment)}>
                  <Send className="w-3 h-3 mr-1" />
                  Enviar Recordatorio
                </Button>
              )}
            </div>
            <div className="space-x-2">
              <Button size="sm" variant="outline" onClick={() => handleEditAppointment(appointment)}>
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Button>
              {hasRole(['admin', 'veterinarian']) && (
                <Button size="sm" variant="destructive" onClick={() => handleCancelAppointment(appointment)}>
                  <Trash2 className="w-3 h-3 mr-1" />
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
            <p className="text-muted-foreground">
              Administra las citas veterinarias y de grooming
            </p>
          </div>
          {hasRole(['admin', 'veterinarian', 'receptionist', 'groomer']) && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Cita
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agendar Nueva Cita</DialogTitle>
                  <DialogDescription>
                    Completa la información para programar una nueva cita
                  </DialogDescription>
                </DialogHeader>
                <CreateAppointmentForm />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas de Hoy</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+8 vs semana anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">Tasa de confirmación</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Shows</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Citas</CardTitle>
            <CardDescription>
              Busca y gestiona todas las citas programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por mascota, propietario o teléfono..."
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
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Mascota y Propietario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Recordatorio</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => {
                    const typeConfig = getTypeConfig(appointment.appointmentType);
                    const Icon = typeConfig.icon;
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {safeFormatDate(appointment.date, "dd/MM/yyyy", { locale: es })}
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
                            <p className="text-xs text-muted-foreground">{appointment.ownerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center space-x-1 w-fit">
                            <Icon className="w-3 h-3" />
                            <span>{typeConfig.label}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{appointment.duration} min</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[appointment.status].color}>
                            {statusConfig[appointment.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {appointment.reminderSent ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
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
                            
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
