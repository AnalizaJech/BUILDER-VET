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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Heart,
  Stethoscope,
  Syringe,
  Camera,
  Pill,
  Weight,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Upload
} from 'lucide-react';
import { MedicalRecord, Pet, Vaccine, XRay } from '@shared/types';

export default function MedicalHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [isNewRecordDialogOpen, setIsNewRecordDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Mock data - in real app this would come from API
  const pets = [
    { id: '1', name: 'Max', species: 'dog', breed: 'Golden Retriever', ownerName: 'Carlos Pérez' },
    { id: '2', name: 'Luna', species: 'cat', breed: 'Persa', ownerName: 'Carlos Pérez' },
    { id: '3', name: 'Rocky', species: 'dog', breed: 'Bulldog Francés', ownerName: 'María García' },
    { id: '4', name: 'Mia', species: 'cat', breed: 'Siamés', ownerName: 'Juan Martínez' }
  ];

  const medicalRecords = [
    {
      id: '1',
      petId: '1',
      petName: 'Max',
      ownerName: 'Carlos Pérez',
      visitDate: new Date('2024-01-15'),
      veterinarianName: 'Dr. Carlos Rodríguez',
      appointmentType: 'consultation',
      symptoms: 'Pérdida de apetito, letargia',
      diagnosis: 'Gastritis leve',
      treatment: 'Dieta blanda por 3 días, medicación antiácida',
      medications: ['Ranitidina 50mg', 'Probióticos'],
      weight: 25.5,
      nextVisitDate: new Date('2024-02-15'),
      vaccines: [
        {
          id: 'v1',
          name: 'Antirrábica',
          date: new Date('2024-01-15'),
          nextDueDate: new Date('2025-01-15'),
          veterinarianId: '2',
          notes: 'Toleró bien la vacuna'
        }
      ],
      xrays: [],
      notes: 'Paciente en buen estado general. Recomendaciones dietéticas entregadas al propietario.'
    },
    {
      id: '2',
      petId: '2',
      petName: 'Luna',
      ownerName: 'Carlos Pérez',
      visitDate: new Date('2024-01-10'),
      veterinarianName: 'Dr. Carlos Rodríguez',
      appointmentType: 'vaccination',
      symptoms: 'Control rutinario',
      diagnosis: 'Examen preventivo normal',
      treatment: 'Vacunación múltiple',
      medications: [],
      weight: 4.2,
      nextVisitDate: new Date('2024-07-10'),
      vaccines: [
        {
          id: 'v2',
          name: 'Triple Felina',
          date: new Date('2024-01-10'),
          nextDueDate: new Date('2025-01-10'),
          veterinarianId: '2',
          notes: 'Primera dosis del año'
        }
      ],
      xrays: [],
      notes: 'Gata en excelente estado de salud. Continuar con alimentación actual.'
    },
    {
      id: '3',
      petId: '3',
      petName: 'Rocky',
      ownerName: 'María García',
      visitDate: new Date('2024-01-05'),
      veterinarianName: 'Dr. Carlos Rodríguez',
      appointmentType: 'surgery',
      symptoms: 'Programado para esterilización',
      diagnosis: 'Candidato óptimo para cirugía',
      treatment: 'Orquiectomía bilateral',
      medications: ['Antibiótico post-quirúrgico', 'Analgésico'],
      weight: 12.8,
      nextVisitDate: new Date('2024-01-15'),
      vaccines: [],
      xrays: [
        {
          id: 'x1',
          description: 'Radiografía pre-quirúrgica torácica',
          imageUrl: '/api/xrays/x1.jpg',
          date: new Date('2024-01-05'),
          veterinarianId: '2',
          findings: 'Estructuras normales, apto para anestesia'
        }
      ],
      notes: 'Cirugía realizada sin complicaciones. Cuidados post-operatorios explicados al propietario.'
    }
  ];

  const upcomingVaccinations = [
    { petName: 'Max', ownerName: 'Carlos Pérez', vaccine: 'Sextuple Canina', dueDate: new Date('2024-03-15') },
    { petName: 'Luna', ownerName: 'Carlos Pérez', vaccine: 'Leucemia Felina', dueDate: new Date('2024-02-10') },
    { petName: 'Rocky', ownerName: 'María García', vaccine: 'Antirrábica', dueDate: new Date('2024-07-05') }
  ];

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = 
      record.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPet = selectedPet === 'all' || record.petId === selectedPet;
    
    return matchesSearch && matchesPet;
  });

  const getAppointmentTypeLabel = (type: string) => {
    const types = {
      consultation: 'Consulta',
      vaccination: 'Vacunación',
      surgery: 'Cirugía',
      grooming: 'Grooming',
      emergency: 'Emergencia'
    };
    return types[type as keyof typeof types] || type;
  };

  const getSpeciesIcon = (species: string) => {
    return species === 'dog' ? (
      <Heart className="w-4 h-4 text-green-600" />
    ) : (
      <Heart className="w-4 h-4 text-purple-600" />
    );
  };

  const NewMedicalRecordForm = () => (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pet">Mascota *</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar mascota" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  <div className="flex items-center space-x-2">
                    {getSpeciesIcon(pet.species)}
                    <span>{pet.name} - {pet.ownerName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointment-type">Tipo de Cita *</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de atención" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consulta</SelectItem>
              <SelectItem value="vaccination">Vacunación</SelectItem>
              <SelectItem value="surgery">Cirugía</SelectItem>
              <SelectItem value="emergency">Emergencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Peso Actual (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="0.0"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperatura (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            placeholder="38.5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms">Síntomas Presentados *</Label>
        <Textarea
          id="symptoms"
          placeholder="Describe los síntomas observados..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnóstico *</Label>
        <Textarea
          id="diagnosis"
          placeholder="Diagnóstico médico..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">Tratamiento Prescrito *</Label>
        <Textarea
          id="treatment"
          placeholder="Descripción del tratamiento..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">Medicamentos</Label>
        <Textarea
          id="medications"
          placeholder="Lista de medicamentos prescritos (uno por línea)..."
          rows={3}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vacunas Aplicadas (Opcional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vaccine-name">Nombre de la Vacuna</Label>
            <Input
              id="vaccine-name"
              placeholder="Ej: Antirrábica, Sextuple"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next-vaccine-date">Próxima Dosis</Label>
            <Input
              id="next-vaccine-date"
              type="date"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaccine-notes">Notas de Vacunación</Label>
          <Textarea
            id="vaccine-notes"
            placeholder="Observaciones sobre la vacuna..."
            rows={2}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Rayos X / Imágenes (Opcional)</h3>
        <div className="space-y-2">
          <Label htmlFor="xray-description">Descripción del Estudio</Label>
          <Input
            id="xray-description"
            placeholder="Ej: Radiografía torácica, Ecografía abdominal"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="xray-findings">Hallazgos</Label>
          <Textarea
            id="xray-findings"
            placeholder="Descripción de los hallazgos radiológicos..."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="xray-upload">Subir Imagen</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Arrastra archivos aquí o haz clic para subir</p>
            <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, PDF (máx. 10MB)</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="next-visit">Próxima Visita</Label>
        <Input
          id="next-visit"
          type="date"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="general-notes">Notas Generales</Label>
        <Textarea
          id="general-notes"
          placeholder="Observaciones adicionales, recomendaciones para el propietario..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsNewRecordDialogOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Historial Médico
        </Button>
      </div>
    </form>
  );

  const MedicalRecordDetailsDialog = ({ record }: { record: any }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Stethoscope className="w-5 h-5" />
          <span>Historial Médico - {record?.petName}</span>
        </DialogTitle>
        <DialogDescription>
          {record?.visitDate && new Date(record.visitDate).toLocaleDateString('es-PE')} - {record?.veterinarianName}
        </DialogDescription>
      </DialogHeader>
      
      {record && (
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Consulta</TabsTrigger>
            <TabsTrigger value="vaccines">Vacunas</TabsTrigger>
            <TabsTrigger value="xrays">Rayos X</TabsTrigger>
            <TabsTrigger value="timeline">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Información de la Consulta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tipo de Atención</Label>
                    <p className="text-sm">{getAppointmentTypeLabel(record.appointmentType)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Peso</Label>
                    <p className="text-sm flex items-center">
                      <Weight className="w-3 h-3 mr-1" />
                      {record.weight} kg
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Pr��xima Visita</Label>
                    <p className="text-sm flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {record.nextVisitDate ? new Date(record.nextVisitDate).toLocaleDateString('es-PE') : 'No programada'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mascota y Propietario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Mascota</Label>
                    <p className="text-sm">{record.petName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Propietario</Label>
                    <p className="text-sm">{record.ownerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Veterinario</Label>
                    <p className="text-sm">{record.veterinarianName}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Síntomas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{record.symptoms}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Diagnóstico</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{record.diagnosis}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tratamiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{record.treatment}</p>
                </CardContent>
              </Card>

              {record.medications && record.medications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Pill className="w-4 h-4" />
                      <span>Medicamentos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {record.medications.map((med: string, index: number) => (
                        <li key={index} className="text-sm flex items-center">
                          <Pill className="w-3 h-3 mr-2 text-muted-foreground" />
                          {med}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {record.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notas Adicionales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{record.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vaccines" className="space-y-4">
            {record.vaccines && record.vaccines.length > 0 ? (
              <div className="space-y-4">
                {record.vaccines.map((vaccine: any) => (
                  <Card key={vaccine.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Syringe className="w-5 h-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">{vaccine.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Aplicada: {new Date(vaccine.date).toLocaleDateString('es-PE')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Próxima dosis:</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(vaccine.nextDueDate).toLocaleDateString('es-PE')}
                          </p>
                        </div>
                      </div>
                      {vaccine.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{vaccine.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Syringe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay vacunas registradas en esta consulta</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="xrays" className="space-y-4">
            {record.xrays && record.xrays.length > 0 ? (
              <div className="space-y-4">
                {record.xrays.map((xray: any) => (
                  <Card key={xray.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Camera className="w-5 h-5 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{xray.description}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Fecha: {new Date(xray.date).toLocaleDateString('es-PE')}
                          </p>
                          <p className="text-sm">{xray.findings}</p>
                          <Button size="sm" variant="outline" className="mt-2">
                            <Download className="w-3 h-3 mr-1" />
                            Ver Imagen
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay estudios radiológicos en esta consulta</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Historial completo de la mascota próximamente</p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </DialogContent>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historial Clínico</h1>
            <p className="text-muted-foreground">
              Gestiona los registros médicos y seguimiento de las mascotas
            </p>
          </div>
          <Dialog open={isNewRecordDialogOpen} onOpenChange={setIsNewRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nuevo Registro Médico</DialogTitle>
                <DialogDescription>
                  Registra una nueva consulta o procedimiento médico
                </DialogDescription>
              </DialogHeader>
              <NewMedicalRecordForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas del Mes</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vacunas Aplicadas</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cirugías</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Realizadas este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Vacunas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingVaccinations.length}</div>
              <p className="text-xs text-muted-foreground">Por vencer</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Vaccinations Alert */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Vacunas Próximas a Vencer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingVaccinations.map((vaccination, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium text-orange-900">{vaccination.petName} - {vaccination.ownerName}</p>
                    <p className="text-sm text-orange-700">{vaccination.vaccine}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-800">
                      {vaccination.dueDate.toLocaleDateString('es-PE')}
                    </p>
                    <Badge variant="outline" className="text-orange-700 border-orange-300">
                      {Math.ceil((vaccination.dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))} días
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medical Records List */}
        <Card>
          <CardHeader>
            <CardTitle>Registros Médicos</CardTitle>
            <CardDescription>
              Historial completo de consultas y procedimientos médicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por mascota, propietario o diagnóstico..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedPet} onValueChange={setSelectedPet}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por mascota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las mascotas</SelectItem>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      <div className="flex items-center space-x-2">
                        {getSpeciesIcon(pet.species)}
                        <span>{pet.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Records Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Mascota y Propietario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Veterinario</TableHead>
                    <TableHead>Próxima Visita</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {new Date(record.visitDate).toLocaleDateString('es-PE')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.visitDate).toLocaleTimeString('es-PE', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.petName}</p>
                          <p className="text-sm text-muted-foreground">{record.ownerName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getAppointmentTypeLabel(record.appointmentType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">{record.diagnosis}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{record.veterinarianName}</p>
                      </TableCell>
                      <TableCell>
                        {record.nextVisitDate ? (
                          <p className="text-sm">
                            {new Date(record.nextVisitDate).toLocaleDateString('es-PE')}
                          </p>
                        ) : (
                          <span className="text-sm text-muted-foreground">No programada</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedRecord(record)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <MedicalRecordDetailsDialog record={selectedRecord} />
                          </Dialog>
                          
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          
                          <Button size="sm" variant="outline">
                            <FileText className="w-3 h-3" />
                          </Button>
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
    </DashboardLayout>
  );
}
