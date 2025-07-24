import React, { useState, useEffect } from 'react';
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
import { useBusinessData } from '@/contexts/BusinessDataContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Send, 
  Trash2, 
  Edit, 
  Plus, 
  Clock, 
  AlertCircle,
  CheckCircle,
  PauseCircle,
  Eye,
  Filter
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'sms' | 'email';
  trigger: 'appointment_reminder' | 'vaccine_due' | 'payment_due' | 'birthday' | 'custom';
  subject?: string;
  message: string;
  isActive: boolean;
  timing: number; // hours before trigger
  createdAt: Date;
}

interface NotificationHistory {
  id: string;
  templateId: string;
  recipientName: string;
  recipientContact: string;
  type: 'sms' | 'email';
  status: 'sent' | 'failed' | 'pending';
  sentAt: Date;
  error?: string;
}

export default function Notifications() {
  const { owners, pets, appointments } = useBusinessData();
  const { showNotification } = useNotifications();
  
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Recordatorio de Cita',
      type: 'sms',
      trigger: 'appointment_reminder',
      message: 'Hola {ownerName}, recordamos que {petName} tiene una cita mañana a las {time} en Matis Pet Groomer.',
      isActive: true,
      timing: 24,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Vacuna Próxima a Vencer',
      type: 'email',
      trigger: 'vaccine_due',
      subject: 'Recordatorio de Vacunación - {petName}',
      message: 'Estimado/a {ownerName},\n\nEste es un recordatorio de que {petName} necesita renovar su vacuna {vaccineName} pronto.\n\nPor favor, contacte nuestra clínica para programar una cita.\n\nSaludos,\nEquipo Matis Pet Groomer',
      isActive: true,
      timing: 168, // 7 days
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      name: 'Cumpleaños de Mascota',
      type: 'email',
      trigger: 'birthday',
      subject: '¡Feliz Cumpleaños {petName}! 🎉',
      message: 'Querido/a {ownerName},\n\n¡Hoy {petName} está de cumpleaños! 🎂\n\nDesde Matis Pet Groomer queremos enviarle nuestros mejores deseos en este día especial.\n\n¡Feliz cumpleaños, {petName}!\n\nCon cariño,\nEquipo Matis Pet Groomer',
      isActive: true,
      timing: 0,
      createdAt: new Date('2024-01-05')
    }
  ]);

  const [history, setHistory] = useState<NotificationHistory[]>([
    {
      id: '1',
      templateId: '1',
      recipientName: 'María García',
      recipientContact: '+51 987 654 321',
      type: 'sms',
      status: 'sent',
      sentAt: new Date('2024-01-20T10:30:00')
    },
    {
      id: '2',
      templateId: '2',
      recipientName: 'Carlos López',
      recipientContact: 'carlos.lopez@email.com',
      type: 'email',
      status: 'sent',
      sentAt: new Date('2024-01-19T14:15:00')
    },
    {
      id: '3',
      templateId: '1',
      recipientName: 'Ana Rojas',
      recipientContact: '+51 999 888 777',
      type: 'sms',
      status: 'failed',
      sentAt: new Date('2024-01-18T16:45:00'),
      error: 'Número inválido'
    }
  ]);

  const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>({
    name: '',
    type: 'sms',
    trigger: 'custom',
    message: '',
    subject: '',
    isActive: true,
    timing: 24
  });

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sms' | 'email'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');

  // Settings
  const [notificationSettings, setNotificationSettings] = useState({
    smsEnabled: true,
    emailEnabled: true,
    autoReminders: true,
    maxDailyNotifications: 50,
    smsProvider: 'twilio',
    emailProvider: 'gmail',
    workingHours: {
      start: '08:00',
      end: '18:00'
    }
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.message) {
      showNotification('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    const template: NotificationTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name!,
      type: newTemplate.type!,
      trigger: newTemplate.trigger!,
      message: newTemplate.message!,
      subject: newTemplate.subject,
      isActive: newTemplate.isActive!,
      timing: newTemplate.timing!,
      createdAt: new Date()
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: '',
      type: 'sms',
      trigger: 'custom',
      message: '',
      subject: '',
      isActive: true,
      timing: 24
    });
    setIsTemplateDialogOpen(false);
    showNotification('Template de notificación creado exitosamente', 'success');
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setNewTemplate(template);
    setIsTemplateDialogOpen(true);
  };

  const handleUpdateTemplate = () => {
    if (!selectedTemplate || !newTemplate.name || !newTemplate.message) {
      showNotification('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    setTemplates(templates.map(t => 
      t.id === selectedTemplate.id 
        ? { ...selectedTemplate, ...newTemplate }
        : t
    ));

    setSelectedTemplate(null);
    setNewTemplate({
      name: '',
      type: 'sms',
      trigger: 'custom',
      message: '',
      subject: '',
      isActive: true,
      timing: 24
    });
    setIsTemplateDialogOpen(false);
    showNotification('Template actualizado exitosamente', 'success');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    showNotification('Template eliminado exitosamente', 'success');
  };

  const handleToggleTemplate = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId 
        ? { ...t, isActive: !t.isActive }
        : t
    ));
  };

  const handleSendTestNotification = (template: NotificationTemplate) => {
    const testHistory: NotificationHistory = {
      id: Date.now().toString(),
      templateId: template.id,
      recipientName: 'Usuario de Prueba',
      recipientContact: template.type === 'sms' ? '+51 999 999 999' : 'test@email.com',
      type: template.type,
      status: 'sent',
      sentAt: new Date()
    };

    setHistory([testHistory, ...history]);
    showNotification(`Notificación de prueba ${template.type.toUpperCase()} enviada`, 'success');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Enviado</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Fallido</Badge>;
      case 'pending':
        return <Badge variant="secondary"><PauseCircle className="w-3 h-3 mr-1" />Pendiente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTriggerLabel = (trigger: string) => {
    const labels = {
      appointment_reminder: 'Recordatorio de Cita',
      vaccine_due: 'Vacuna por Vencer',
      payment_due: 'Pago Pendiente',
      birthday: 'Cumpleaños',
      custom: 'Personalizado'
    };
    return labels[trigger as keyof typeof labels] || trigger;
  };

  const filteredTemplates = templates.filter(template => {
    if (filter === 'all') return true;
    return template.type === filter;
  });

  const filteredHistory = history.filter(item => {
    const typeMatch = filter === 'all' || item.type === filter;
    const statusMatch = statusFilter === 'all' || item.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const previewMessage = (template: NotificationTemplate) => {
    const sampleData = {
      ownerName: 'María García',
      petName: 'Luna',
      time: '14:30',
      vaccineName: 'Antirrábica'
    };

    let message = template.message;
    Object.entries(sampleData).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    return message;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Notificaciones</h1>
            <p className="text-gray-600">Gestiona notificaciones automáticas por SMS y email</p>
          </div>
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedTemplate(null);
                setNewTemplate({
                  name: '',
                  type: 'sms',
                  trigger: 'custom',
                  message: '',
                  subject: '',
                  isActive: true,
                  timing: 24
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedTemplate ? 'Editar Template' : 'Crear Nuevo Template'}
                </DialogTitle>
                <DialogDescription>
                  Configure un template de notificación para envíos automáticos
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Template</Label>
                    <Input
                      id="name"
                      value={newTemplate.name || ''}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      placeholder="Ej: Recordatorio de Cita"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select 
                      value={newTemplate.type} 
                      onValueChange={(value: 'sms' | 'email') => setNewTemplate({ ...newTemplate, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trigger">Trigger</Label>
                    <Select 
                      value={newTemplate.trigger} 
                      onValueChange={(value: any) => setNewTemplate({ ...newTemplate, trigger: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appointment_reminder">Recordatorio de Cita</SelectItem>
                        <SelectItem value="vaccine_due">Vacuna por Vencer</SelectItem>
                        <SelectItem value="payment_due">Pago Pendiente</SelectItem>
                        <SelectItem value="birthday">Cumpleaños</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timing">Tiempo antes (horas)</Label>
                    <Input
                      id="timing"
                      type="number"
                      value={newTemplate.timing || 24}
                      onChange={(e) => setNewTemplate({ ...newTemplate, timing: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                {newTemplate.type === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      value={newTemplate.subject || ''}
                      onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                      placeholder="Asunto del email"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    value={newTemplate.message || ''}
                    onChange={(e) => setNewTemplate({ ...newTemplate, message: e.target.value })}
                    placeholder="Contenido del mensaje. Use {ownerName}, {petName}, {time}, etc. para variables"
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    Variables disponibles: {'{ownerName}'}, {'{petName}'}, {'{time}'}, {'{vaccineName}'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newTemplate.isActive}
                    onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Template activo</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsTemplateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={selectedTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                  {selectedTemplate ? 'Actualizar' : 'Crear'} Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Templates de Notificación</CardTitle>
                    <CardDescription>
                      Gestiona los templates para notificaciones automáticas
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            <Badge variant={template.type === 'sms' ? 'default' : 'secondary'}>
                              {template.type === 'sms' ? <MessageSquare className="w-3 h-3 mr-1" /> : <Mail className="w-3 h-3 mr-1" />}
                              {template.type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{getTriggerLabel(template.trigger)}</Badge>
                            {template.isActive ? 
                              <Badge variant="default" className="bg-green-100 text-green-800">Activo</Badge> : 
                              <Badge variant="secondary">Inactivo</Badge>
                            }
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{template.message}</p>
                          <p className="text-xs text-gray-500">
                            Enviar {template.timing}h antes • Creado el {template.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setIsPreviewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSendTestNotification(template)}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          <Switch
                            checked={template.isActive}
                            onCheckedChange={() => handleToggleTemplate(template.id)}
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar template?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El template será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTemplate(template.id)}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Historial de Notificaciones</CardTitle>
                    <CardDescription>
                      Registro de todas las notificaciones enviadas
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="sent">Enviados</SelectItem>
                        <SelectItem value="failed">Fallidos</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destinatario</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Enviado</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.recipientName}</TableCell>
                        <TableCell>{item.recipientContact}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'sms' ? 'default' : 'secondary'}>
                            {item.type === 'sms' ? <MessageSquare className="w-3 h-3 mr-1" /> : <Mail className="w-3 h-3 mr-1" />}
                            {item.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{item.sentAt.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">{item.error || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                  <CardDescription>
                    Configuraciones básicas del sistema de notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaciones SMS</Label>
                      <p className="text-xs text-gray-500">Habilitar envío de SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsEnabled}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, smsEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaciones Email</Label>
                      <p className="text-xs text-gray-500">Habilitar envío de emails</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailEnabled}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, emailEnabled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Recordatorios Automáticos</Label>
                      <p className="text-xs text-gray-500">Enviar recordatorios automáticamente</p>
                    </div>
                    <Switch
                      checked={notificationSettings.autoReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, autoReminders: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxDaily">Máximo notificaciones diarias</Label>
                    <Input
                      id="maxDaily"
                      type="number"
                      value={notificationSettings.maxDailyNotifications}
                      onChange={(e) => 
                        setNotificationSettings({ 
                          ...notificationSettings, 
                          maxDailyNotifications: parseInt(e.target.value) 
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horarios de Trabajo</CardTitle>
                  <CardDescription>
                    Configure los horarios para envío de notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Hora de inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={notificationSettings.workingHours.start}
                      onChange={(e) => 
                        setNotificationSettings({ 
                          ...notificationSettings, 
                          workingHours: { 
                            ...notificationSettings.workingHours, 
                            start: e.target.value 
                          }
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Hora de fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={notificationSettings.workingHours.end}
                      onChange={(e) => 
                        setNotificationSettings({ 
                          ...notificationSettings, 
                          workingHours: { 
                            ...notificationSettings.workingHours, 
                            end: e.target.value 
                          }
                        })
                      }
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={() => showNotification('Configuración guardada exitosamente', 'success')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Guardar Configuración
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vista Previa - {selectedTemplate?.name}</DialogTitle>
              <DialogDescription>
                Vista previa del mensaje con datos de ejemplo
              </DialogDescription>
            </DialogHeader>
            
            {selectedTemplate && (
              <div className="space-y-4">
                {selectedTemplate.type === 'email' && selectedTemplate.subject && (
                  <div>
                    <Label>Asunto:</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border">
                      {selectedTemplate.subject.replace(/{petName}/g, 'Luna')}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label>Mensaje:</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded border whitespace-pre-wrap">
                    {previewMessage(selectedTemplate)}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
