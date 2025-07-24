import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  Heart,
  Calendar,
  Eye
} from 'lucide-react';
import { Owner } from '@shared/types';

export default function Owners() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [ownerToEdit, setOwnerToEdit] = useState<Owner | null>(null);

  const handleCreateOwner = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Propietario registrado exitosamente');
    setIsCreateDialogOpen(false);
  };

  const handleEditOwner = (owner: Owner) => {
    setOwnerToEdit(owner);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOwner = (owner: Owner) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el propietario ${owner.fullName}?`)) {
      alert(`Propietario ${owner.fullName} eliminado exitosamente`);
    }
  };

  const handleViewDetails = (owner: Owner) => {
    setSelectedOwner(owner);
  };

  // Mock data - in real app this would come from API
  const owners: Owner[] = [
    {
      id: '1',
      fullName: 'Carlos Pérez González',
      dni: '12345678',
      address: 'Av. Principal 123, Lima',
      phone: '+51 987654321',
      email: 'carlos.perez@email.com',
      pets: [
        {
          id: '1',
          name: 'Max',
          species: 'dog',
          breed: 'Golden Retriever',
          age: 3,
          weight: 25,
          allergies: ['Pollo'],
          ownerId: '1',
          medicalHistory: [],
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          name: 'Luna',
          species: 'cat',
          breed: 'Persa',
          age: 2,
          weight: 4,
          allergies: [],
          ownerId: '1',
          medicalHistory: [],
          createdAt: new Date('2023-06-10'),
          updatedAt: new Date('2024-01-15')
        }
      ],
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      fullName: 'María García Rodríguez',
      dni: '87654321',
      address: 'Jr. Los Olivos 456, San Isidro',
      phone: '+51 912345678',
      email: 'maria.garcia@email.com',
      pets: [
        {
          id: '3',
          name: 'Rocky',
          species: 'dog',
          breed: 'Bulldog Francés',
          age: 4,
          weight: 12,
          allergies: ['Lácteos', 'Trigo'],
          ownerId: '2',
          medicalHistory: [],
          createdAt: new Date('2023-03-20'),
          updatedAt: new Date('2024-01-15')
        }
      ],
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '3',
      fullName: 'Juan Martínez López',
      dni: '11223344',
      address: 'Calle Las Flores 789, Miraflores',
      phone: '+51 956789123',
      email: 'juan.martinez@email.com',
      pets: [
        {
          id: '4',
          name: 'Mia',
          species: 'cat',
          breed: 'Siamés',
          age: 1,
          weight: 3,
          allergies: [],
          ownerId: '3',
          medicalHistory: [],
          createdAt: new Date('2023-09-05'),
          updatedAt: new Date('2024-01-15')
        }
      ],
      createdAt: new Date('2023-09-05'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  const filteredOwners = owners.filter(owner =>
    owner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.dni.includes(searchQuery) ||
    owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.pets.some(pet => pet.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSpeciesLabel = (species: string) => {
    return species === 'dog' ? 'Perro' : 'Gato';
  };

  const getSpeciesIcon = (species: string) => {
    return species === 'dog' ? (
      <Heart className="w-4 h-4 text-green-600" />
    ) : (
      <Heart className="w-4 h-4 text-purple-600" />
    );
  };

  const CreateOwnerForm = () => (
    <form className="space-y-4" onSubmit={handleCreateOwner}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre Completo *</Label>
          <Input id="fullName" placeholder="Nombre y apellidos" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dni">DNI *</Label>
          <Input id="dni" placeholder="12345678" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección *</Label>
        <Input id="address" placeholder="Dirección completa" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input id="phone" type="tel" placeholder="+51 987654321" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="correo@email.com" required />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Información de la Mascota</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="petName">Nombre de la Mascota *</Label>
            <Input id="petName" placeholder="Nombre de la mascota" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="species">Especie *</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar especie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Perro</SelectItem>
                <SelectItem value="cat">Gato</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="breed">Raza *</Label>
            <Input id="breed" placeholder="Raza de la mascota" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Edad (años)</Label>
            <Input id="age" type="number" placeholder="0" min="0" max="30" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" type="number" placeholder="0" min="0" step="0.1" />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="allergies">Alergias (separar con comas)</Label>
          <Input id="allergies" placeholder="Ej: Pollo, Lácteos, Trigo" />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit" variant="success">
          <Plus className="w-4 h-4 mr-2" />
          Registrar Propietario
        </Button>
      </div>
    </form>
  );

  const OwnerDetailsDialog = ({ owner }: { owner: Owner | null }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>{owner?.fullName}</span>
        </DialogTitle>
        <DialogDescription>
          Información completa del propietario y sus mascotas
        </DialogDescription>
      </DialogHeader>
      
      {owner && (
        <div className="space-y-6">
          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Propietario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">DNI</Label>
                  <p className="text-sm">{owner.dni}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                  <p className="text-sm flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {owner.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {owner.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Dirección</Label>
                  <p className="text-sm flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {owner.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pets Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Mascotas ({owner.pets.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {owner.pets.map((pet) => (
                <div key={pet.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        {getSpeciesIcon(pet.species)}
                      </div>
                      <h3 className="font-semibold">{pet.name}</h3>
                      <Badge variant="outline">{getSpeciesLabel(pet.species)}</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      Ver Historial
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Raza</Label>
                      <p>{pet.breed}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Edad</Label>
                      <p>{pet.age} años</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Peso</Label>
                      <p>{pet.weight} kg</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Alergias</Label>
                      <p>{pet.allergies.length > 0 ? pet.allergies.join(', ') : 'Ninguna'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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
            <h1 className="text-3xl font-bold text-foreground">Gestión de Propietarios</h1>
            <p className="text-muted-foreground">
              Administra la información de propietarios y sus mascotas
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Propietario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Propietario</DialogTitle>
                <DialogDescription>
                  Completa la información del propietario y su primera mascota
                </DialogDescription>
              </DialogHeader>
              <CreateOwnerForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Propietarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{owners.length}</div>
              <p className="text-xs text-muted-foreground">
                +3 este mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mascotas</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {owners.reduce((total, owner) => total + owner.pets.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Registradas en el sistema
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Mascotas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(owners.reduce((total, owner) => total + owner.pets.length, 0) / owners.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Por propietario
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Propietarios</CardTitle>
            <CardDescription>
              Busca y gestiona la información de los propietarios registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, DNI, email o mascota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Propietario</TableHead>
                    <TableHead>DNI</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Mascotas</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{owner.fullName}</p>
                          <p className="text-sm text-muted-foreground">{owner.address}</p>
                        </div>
                      </TableCell>
                      <TableCell>{owner.dni}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {owner.phone}
                          </p>
                          <p className="text-sm flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {owner.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {owner.pets.map((pet) => (
                            <Badge key={pet.id} variant="outline" className="text-xs flex items-center space-x-1">
                              {getSpeciesIcon(pet.species)}
                              <span>{pet.name}</span>
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(owner.createdAt).toLocaleDateString('es-PE')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedOwner(owner)}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <OwnerDetailsDialog owner={selectedOwner} />
                          </Dialog>
                          
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
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
