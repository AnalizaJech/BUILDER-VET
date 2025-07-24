import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Palette, 
  Globe, 
  DollarSign, 
  Clock, 
  Save, 
  RefreshCw, 
  Trash2, 
  Edit, 
  Plus, 
  Eye, 
  EyeOff,
  Building2,
  MapPin,
  Phone,
  FileText,
  Calendar
} from 'lucide-react';
import { UserRole } from '@shared/types';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  ruc: string;
  website: string;
  description: string;
  workingHours: {
    monday: { start: string; end: string; isOpen: boolean };
    tuesday: { start: string; end: string; isOpen: boolean };
    wednesday: { start: string; end: string; isOpen: boolean };
    thursday: { start: string; end: string; isOpen: boolean };
    friday: { start: string; end: string; isOpen: boolean };
    saturday: { start: string; end: string; isOpen: boolean };
    sunday: { start: string; end: string; isOpen: boolean };
  };
}

export default function Settings() {
  const { user } = useAuth();
  const { showNotification } = useNotifications();

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@matispet.com',
      fullName: 'Administrador Principal',
      role: 'admin',
      isActive: true,
      lastLogin: new Date('2024-01-20T10:30:00'),
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      email: 'veterinario@matispet.com',
      fullName: 'Dr. Carlos Mendoza',
      role: 'veterinarian',
      isActive: true,
      lastLogin: new Date('2024-01-19T14:15:00'),
      createdAt: new Date('2024-01-05')
    },
    {
      id: '3',
      email: 'recepcion@matispet.com',
      fullName: 'María González',
      role: 'receptionist',
      isActive: true,
      lastLogin: new Date('2024-01-18T09:45:00'),
      createdAt: new Date('2024-01-10')
    }
  ]);

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: 'Matis Pet Groomer',
    address: 'Av. Universitaria 123, San Martín de Porres, Lima',
    phone: '+51 987 654 321',
    email: 'info@matispet.com',
    ruc: '20123456789',
    website: 'www.matispet.com',
    description: 'Clínica veterinaria especializada en cuidado integral de mascotas con más de 10 años de experiencia.',
    workingHours: {
      monday: { start: '08:00', end: '18:00', isOpen: true },
      tuesday: { start: '08:00', end: '18:00', isOpen: true },
      wednesday: { start: '08:00', end: '18:00', isOpen: true },
      thursday: { start: '08:00', end: '18:00', isOpen: true },
      friday: { start: '08:00', end: '18:00', isOpen: true },
      saturday: { start: '09:00', end: '15:00', isOpen: true },
      sunday: { start: '10:00', end: '14:00', isOpen: false }
    }
  });

  const [systemSettings, setSystemSettings] = useState({
    currency: 'PEN',
    timezone: 'America/Lima',
    dateFormat: 'DD/MM/YYYY',
    language: 'es',
    autoBackup: true,
    backupFrequency: 'daily',
    maintenanceMode: false,
    allowRegistration: false,
    passwordComplexity: 'medium',
    sessionTimeout: 480, // minutes
    maxLoginAttempts: 5
  });

  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    role: 'receptionist' as UserRole,
    password: '',
    confirmPassword: ''
  });

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const roleLabels = {
    admin: 'Administrador',
    veterinarian: 'Veterinario',
    receptionist: 'Recepcionista',
    cashier: 'Cajero',
    groomer: 'Groomer'
  };

  const dayLabels = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.fullName || !newUser.password) {
      showNotification('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      return;
    }

    if (users.some(u => u.email === newUser.email)) {
      showNotification('Ya existe un usuario con este email', 'error');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      isActive: true,
      createdAt: new Date()
    };

    setUsers([...users, user]);
    setNewUser({
      email: '',
      fullName: '',
      role: 'receptionist',
      password: '',
      confirmPassword: ''
    });
    setIsUserDialogOpen(false);
    showNotification('Usuario creado exitosamente', 'success');
  };

  const handleToggleUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, isActive: !u.isActive }
        : u
    ));
    showNotification('Estado del usuario actualizado', 'success');
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === user?.id) {
      showNotification('No puedes eliminar tu propio usuario', 'error');
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    showNotification('Usuario eliminado exitosamente', 'success');
  };

  const handleSaveBusinessInfo = () => {
    showNotification('Información del negocio guardada exitosamente', 'success');
  };

  const handleSaveSystemSettings = () => {
    showNotification('Configuración del sistema guardada exitosamente', 'success');
  };

  const handleBackup = () => {
    showNotification('Respaldo iniciado. Recibirás una notificación cuando esté listo.', 'info');
  };

  const handleRestore = () => {
    showNotification('Función de restauración disponible próximamente', 'info');
  };

  const updateWorkingHours = (day: keyof BusinessInfo['workingHours'], field: string, value: any) => {
    setBusinessInfo({
      ...businessInfo,
      workingHours: {
        ...businessInfo.workingHours,
        [day]: {
          ...businessInfo.workingHours[day],
          [field]: value
        }
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración y Administración</h1>
            <p className="text-gray-600">Gestiona usuarios, configuraciones del sistema e información del negocio</p>
          </div>
        </div>

        <Tabs defaultValue="business" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="business">Negocio</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
            <TabsTrigger value="backup">Respaldos</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Información del Negocio
                  </CardTitle>
                  <CardDescription>
                    Configura la información básica de tu veterinaria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nombre del Negocio</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Textarea
                      id="address"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ruc">RUC</Label>
                      <Input
                        id="ruc"
                        value={businessInfo.ruc}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, ruc: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={businessInfo.description}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleSaveBusinessInfo}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Información
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horarios de Atención
                  </CardTitle>
                  <CardDescription>
                    Configura los horarios de atención por día
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(businessInfo.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={hours.isOpen}
                          onCheckedChange={(checked) => updateWorkingHours(day as any, 'isOpen', checked)}
                        />
                        <Label className="w-20">{dayLabels[day as keyof typeof dayLabels]}</Label>
                      </div>
                      
                      {hours.isOpen && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) => updateWorkingHours(day as any, 'start', e.target.value)}
                            className="w-24"
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) => updateWorkingHours(day as any, 'end', e.target.value)}
                            className="w-24"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Gestión de Usuarios
                    </CardTitle>
                    <CardDescription>
                      Administra los usuarios del sistema y sus permisos
                    </CardDescription>
                  </div>
                  <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Usuario
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                        <DialogDescription>
                          Agrega un nuevo usuario al sistema
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Nombre Completo</Label>
                            <Input
                              id="fullName"
                              value={newUser.fullName}
                              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Rol</Label>
                          <Select 
                            value={newUser.role} 
                            onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="veterinarian">Veterinario</SelectItem>
                              <SelectItem value="receptionist">Recepcionista</SelectItem>
                              <SelectItem value="cashier">Cajero</SelectItem>
                              <SelectItem value="groomer">Groomer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <Input
                              id="confirmPassword"
                              type={showPassword ? "text" : "password"}
                              value={newUser.confirmPassword}
                              onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateUser}>
                          Crear Usuario
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {roleLabels[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.lastLogin ? user.lastLogin.toLocaleString() : 'Nunca'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={() => handleToggleUser(user.id)}
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Configuración Regional
                  </CardTitle>
                  <CardDescription>
                    Configura idioma, moneda y formato de fecha
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <Select value={systemSettings.currency} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, currency: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PEN">Soles Peruanos (S/)</SelectItem>
                        <SelectItem value="USD">Dólares Americanos ($)</SelectItem>
                        <SelectItem value="EUR">Euros (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, timezone: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Lima">Lima, Perú</SelectItem>
                        <SelectItem value="America/Bogota">Bogotá, Colombia</SelectItem>
                        <SelectItem value="America/Mexico_City">Ciudad de México</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Formato de Fecha</Label>
                    <Select value={systemSettings.dateFormat} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, dateFormat: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, language: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuración General
                  </CardTitle>
                  <CardDescription>
                    Configuraciones generales del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Respaldo Automático</Label>
                      <p className="text-xs text-gray-500">Realizar respaldos automáticos</p>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => 
                        setSystemSettings({ ...systemSettings, autoBackup: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Frecuencia de Respaldo</Label>
                    <Select value={systemSettings.backupFrequency} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, backupFrequency: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => 
                        setSystemSettings({ 
                          ...systemSettings, 
                          sessionTimeout: parseInt(e.target.value) 
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Modo Mantenimiento</Label>
                      <p className="text-xs text-gray-500">Deshabilitar acceso temporal</p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => 
                        setSystemSettings({ ...systemSettings, maintenanceMode: checked })
                      }
                    />
                  </div>

                  <Button onClick={handleSaveSystemSettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Configuración
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Gestión de Respaldos
                  </CardTitle>
                  <CardDescription>
                    Crear y gestionar respaldos de datos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Último Respaldo</h3>
                      <p className="text-sm text-gray-600">20 de Enero, 2024 - 14:30</p>
                      <p className="text-xs text-gray-500">Tamaño: 2.4 MB</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={handleBackup}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Crear Respaldo
                      </Button>
                      <Button variant="outline" onClick={handleRestore}>
                        <Database className="w-4 h-4 mr-2" />
                        Restaurar
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500">
                      Los respaldos incluyen: usuarios, propietarios, mascotas, citas, historial médico e inventario.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historial de Respaldos</CardTitle>
                  <CardDescription>
                    Respaldos realizados recientemente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-20', time: '14:30', size: '2.4 MB' },
                      { date: '2024-01-19', time: '14:30', size: '2.3 MB' },
                      { date: '2024-01-18', time: '14:30', size: '2.2 MB' },
                      { date: '2024-01-17', time: '14:30', size: '2.1 MB' },
                    ].map((backup, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="text-sm font-medium">{backup.date}</p>
                          <p className="text-xs text-gray-500">{backup.time} - {backup.size}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Database className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Gestiona la seguridad y políticas de acceso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="passwordComplexity">Complejidad de Contraseña</Label>
                    <Select value={systemSettings.passwordComplexity} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, passwordComplexity: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja (6+ caracteres)</SelectItem>
                        <SelectItem value="medium">Media (8+ caracteres + números)</SelectItem>
                        <SelectItem value="high">Alta (12+ caracteres + símbolos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Máximo Intentos de Login</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={systemSettings.maxLoginAttempts}
                      onChange={(e) => 
                        setSystemSettings({ 
                          ...systemSettings, 
                          maxLoginAttempts: parseInt(e.target.value) 
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Registro</Label>
                    <p className="text-xs text-gray-500">Permitir que nuevos usuarios se registren</p>
                  </div>
                  <Switch
                    checked={systemSettings.allowRegistration}
                    onCheckedChange={(checked) => 
                      setSystemSettings({ ...systemSettings, allowRegistration: checked })
                    }
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Logs de Seguridad</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Último login fallido: 2024-01-18 10:30 - IP: 192.168.1.100</p>
                    <p>• Usuario bloqueado: usuario@test.com - 2024-01-17 15:45</p>
                    <p>• Cambio de contraseña: admin@matispet.com - 2024-01-15 09:20</p>
                  </div>
                </div>

                <Button onClick={handleSaveSystemSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Configuración de Seguridad
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
