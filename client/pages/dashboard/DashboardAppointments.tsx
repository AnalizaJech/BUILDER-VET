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
import { useBusinessData } from '@/contexts/BusinessDataContext';
import { useNotifications } from '@/contexts/NotificationContext';
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
  AlertTriangle,
  CheckCircle,
  Eye,
  Send,
  Save,
  X
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
  const { 
    appointments, 
    owners, 
    pets, 
    addAppointment, 
    updateAppointment, 
    cancelAppointment,
    isLoadingAppointments 
  } = useBusinessData();
  const { showNotification } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState<any>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<any>(null);
  const [appointmentForReminder, setAppointmentForReminder] = useState<any>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    ownerId: '',
    petId: '',
    appointmentType: '' as AppointmentType,
    date: '',
    startTime: '',
    notes: '',
    veterinarianId: ''
  });

  const [editForm, setEditForm] = useState({
    appointmentType: '' as AppointmentType,
    date: '',
    startTime: '',
    notes: '',
    veterinarianId: '',
    status: '' as AppointmentStatus
  });

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

  const resetCreateForm = () => {
    setCreateForm({
      ownerId: '',
      petId: '',
      appointmentType: '' as AppointmentType,
      date: '',
      startTime: '',
      notes: '',
      veterinarianId: ''
    });
    setSelectedDate(undefined);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedDate) {
        showNotification('Por favor selecciona una fecha', 'error');
        return;
      }

      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = createForm.startTime.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      const typeConfig = getTypeConfig(createForm.appointmentType);
      
      const newAppointment = {
        petId: createForm.petId,
        ownerId: createForm.ownerId,
        appointmentType: createForm.appointmentType,
        date: appointmentDate,
        startTime: createForm.startTime,
        duration: typeConfig.duration,
        status: 'scheduled' as AppointmentStatus,
        notes: createForm.notes,
        reminderSent: false,
        veterinarianId: createForm.veterinarianId
      };

      await addAppointment(newAppointment);
      showNotification('Cita agendada exitosamente', 'success');
      setIsCreateDialogOpen(false);
      resetCreateForm();
    } catch (error) {
      showNotification('Error al agendar la cita', 'error');
    }
  };

  const handleEditAppointment = (appointment: any) => {
    setAppointmentToEdit(appointment);
    setEditForm({
      appointmentType: appointment.appointmentType,
      date: safeFormatDate(appointment.date, 'yyyy-MM-dd'),
      startTime: appointment.startTime,
      notes: appointment.notes || '',
      veterinarianId: appointment.veterinarianId || '',
      status: appointment.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentToEdit) return;

    try {
      const appointmentDate = new Date(editForm.date);
      const [hours, minutes] = editForm.startTime.split(':');
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      const updates = {
        appointmentType: editForm.appointmentType,
        date: appointmentDate,
        startTime: editForm.startTime,
        notes: editForm.notes,
        veterinarianId: editForm.veterinarianId,
        status: editForm.status
      };

      await updateAppointment(appointmentToEdit.id, updates);
      showNotification('Cita actualizada exitosamente', 'success');
      setIsEditDialogOpen(false);
      setAppointmentToEdit(null);
    } catch (error) {
      showNotification('Error al actualizar la cita', 'error');
    }
  };

  const handleDeleteAppointment = (appointment: any) => {
    setAppointmentToDelete(appointment);
    setIsDeleteDialogOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentToDelete) return;

    try {
      await cancelAppointment(appointmentToDelete.id);
      showNotification('Cita cancelada exitosamente', 'success');
      setIsDeleteDialogOpen(false);
      setAppointmentToDelete(null);
    } catch (error) {
      showNotification('Error al cancelar la cita', 'error');
    }
  };

  const handleSendReminder = (appointment: any) => {
    setAppointmentForReminder(appointment);
    setIsReminderDialogOpen(true);
  };

  const confirmSendReminder = async () => {
    if (!appointmentForReminder) return;

    try {
      await updateAppointment(appointmentForReminder.id, { reminderSent: true });
      showNotification(`Recordatorio enviado a ${appointmentForReminder.ownerName}`, 'success');
      setIsReminderDialogOpen(false);
      setAppointmentForReminder(null);
    } catch (error) {
      showNotification('Error al enviar recordatorio', 'error');
    }
  };

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  const getAvailablePets = () => {
    const selectedOwner = owners.find(o => o.id === createForm.ownerId);
    return selectedOwner ? selectedOwner.pets : [];
  };

  const CreateAppointmentForm = () => (
    <form className="space-y-4" onSubmit={handleCreateAppointment}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner">Propietario *</Label>
          <Select 
            value={createForm.ownerId} 
            onValueChange={(value) => setCreateForm(prev => ({ ...prev, ownerId: value, petId: '' }))} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar propietario" />
            </SelectTrigger>
            <SelectContent>
              {owners.map(owner => (
                <SelectItem key={owner.id} value={owner.id}>{owner.fullName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pet">Mascota *</Label>
          <Select 
            value={createForm.petId} 
            onValueChange={(value) => setCreateForm(prev => ({ ...prev, petId: value }))} 
            required
            disabled={!createForm.ownerId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar mascota" />
            </SelectTrigger>
            <SelectContent>
              {getAvailablePets().map(pet => (
                <SelectItem key={pet.id} value={pet.id}>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-3 h-3 text-green-600" />
                    <span>{pet.name} ({pet.species === 'dog' ? 'Perro' : 'Gato'} - {pet.breed})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Cita *</Label>
        <Select 
          value={createForm.appointmentType} 
          onValueChange={(value: AppointmentType) => setCreateForm(prev => ({ ...prev, appointmentType: value }))} 
          required
        >
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
          <Select 
            value={createForm.startTime} 
            onValueChange={(value) => setCreateForm(prev => ({ ...prev, startTime: value }))} 
            required
          >
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
          <Select 
            value={createForm.veterinarianId} 
            onValueChange={(value) => setCreateForm(prev => ({ ...prev, veterinarianId: value }))}
          >
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
          value={createForm.notes}
          onChange={(e) => setCreateForm(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {
          setIsCreateDialogOpen(false);
          resetCreateForm();
        }}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" disabled={isLoadingAppointments}>
          <Plus className="w-4 h-4 mr-2" />
          {isLoadingAppointments ? 'Agendando...' : 'Agendar Cita'}
        </Button>
      </div>
    </form>
  );

  const EditAppointmentForm = () => (
    <form className="space-y-4" onSubmit={handleUpdateAppointment}>
      <div className="space-y-2">
        <Label htmlFor="edit-type">Tipo de Cita *</Label>
        <Select 
          value={editForm.appointmentType} 
          onValueChange={(value: AppointmentType) => setEditForm(prev => ({ ...prev, appointmentType: value }))} 
          required
        >
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
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-date">Fecha *</Label>
          <Input
            id="edit-date"
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-time">Hora *</Label>
          <Select 
            value={editForm.startTime} 
            onValueChange={(value) => setEditForm(prev => ({ ...prev, startTime: value }))} 
            required
          >
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

      <div className="space-y-2">
        <Label htmlFor="edit-status">Estado</Label>
        <Select 
          value={editForm.status} 
          onValueChange={(value: AppointmentStatus) => setEditForm(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-notes">Notas</Label>
        <Textarea
          id="edit-notes"
          placeholder="Información adicional sobre la cita..."
          value={editForm.notes}
          onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {
          setIsEditDialogOpen(false);
          setAppointmentToEdit(null);
        }}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" disabled={isLoadingAppointments}>
          <Save className="w-4 h-4 mr-2" />
          {isLoadingAppointments ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );

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
              <Button size="sm" variant="outline" onClick={() => {
                setIsDetailsDialogOpen(false);
                handleEditAppointment(appointment);
              }}>
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Button>
              {hasRole(['admin', 'veterinarian']) && (
                <Button size="sm" variant="destructive" onClick={() => {
                  setIsDetailsDialogOpen(false);
                  handleDeleteAppointment(appointment);
                }}>
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
              <div className="text-2xl font-bold">
                {appointments.filter(apt => 
                  new Date(apt.date).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {appointments.filter(apt => 
                  apt.status === 'pending' && 
                  new Date(apt.date).toDateString() === new Date().toDateString()
                ).length} pendientes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">Total programadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((appointments.filter(apt => apt.status === 'confirmed').length / appointments.length) * 100) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">Tasa de confirmación</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(apt => apt.status === 'cancelled').length}
              </div>
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            
                            <Button size="sm" variant="outline" onClick={() => handleEditAppointment(appointment)}>
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

        {/* Dialogs */}
        
        {/* Edit Appointment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Cita</DialogTitle>
              <DialogDescription>
                Actualiza la información de la cita
              </DialogDescription>
            </DialogHeader>
            <EditAppointmentForm />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Cancelar Cita</span>
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas cancelar esta cita?
              </DialogDescription>
            </DialogHeader>
            
            {appointmentToDelete && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>Mascota:</strong> {appointmentToDelete.petName}
                  </p>
                  <p className="text-sm text-red-800">
                    <strong>Propietario:</strong> {appointmentToDelete.ownerName}
                  </p>
                  <p className="text-sm text-red-800">
                    <strong>Fecha:</strong> {safeFormatDate(appointmentToDelete.date, "PPP", { locale: es })} a las {appointmentToDelete.startTime}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Mantener Cita
                  </Button>
                  <Button variant="destructive" onClick={confirmCancelAppointment} disabled={isLoadingAppointments}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isLoadingAppointments ? 'Cancelando...' : 'Cancelar Cita'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reminder Confirmation Dialog */}
        <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-blue-600" />
                <span>Enviar Recordatorio</span>
              </DialogTitle>
              <DialogDescription>
                Se enviará un recordatorio al propietario sobre la cita programada.
              </DialogDescription>
            </DialogHeader>
            
            {appointmentForReminder && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Para:</strong> {appointmentForReminder.ownerName}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Teléfono:</strong> {appointmentForReminder.ownerPhone}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Mascota:</strong> {appointmentForReminder.petName}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Cita:</strong> {safeFormatDate(appointmentForReminder.date, "PPP", { locale: es })} a las {appointmentForReminder.startTime}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="info" onClick={confirmSendReminder} disabled={isLoadingAppointments}>
                    <Send className="w-4 h-4 mr-2" />
                    {isLoadingAppointments ? 'Enviando...' : 'Enviar Recordatorio'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Appointment Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <AppointmentDetailsDialog appointment={selectedAppointment} />
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
