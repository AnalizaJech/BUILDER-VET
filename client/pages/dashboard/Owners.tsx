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
import { useBusinessData } from '@/contexts/BusinessDataContext';
import { useNotifications } from '@/contexts/NotificationContext';
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
  Eye,
  AlertTriangle,
  CheckCircle,
  X,
  Save
} from 'lucide-react';
import { Owner, Pet } from '@shared/types';

export default function Owners() {
  const { owners, addOwner, updateOwner, deleteOwner, isLoadingOwners } = useBusinessData();
  const { showNotification } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [ownerToEdit, setOwnerToEdit] = useState<Owner | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState<Owner | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Form states
  const [createForm, setCreateForm] = useState({
    fullName: '',
    dni: '',
    address: '',
    phone: '',
    email: '',
    petName: '',
    petSpecies: 'dog' as 'dog' | 'cat',
    petBreed: '',
    petAge: '',
    petWeight: '',
    petAllergies: ''
  });
  
  const [editForm, setEditForm] = useState({
    fullName: '',
    dni: '',
    address: '',
    phone: '',
    email: ''
  });

  const filteredOwners = owners.filter(owner =>
    owner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.dni.includes(searchQuery) ||
    owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.pets.some(pet => pet.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const resetCreateForm = () => {
    setCreateForm({
      fullName: '',
      dni: '',
      address: '',
      phone: '',
      email: '',
      petName: '',
      petSpecies: 'dog',
      petBreed: '',
      petAge: '',
      petWeight: '',
      petAllergies: ''
    });
  };

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOwner = {
        fullName: createForm.fullName,
        dni: createForm.dni,
        address: createForm.address,
        phone: createForm.phone,
        email: createForm.email,
        pets: createForm.petName ? [{
          id: Date.now().toString(),
          name: createForm.petName,
          species: createForm.petSpecies,
          breed: createForm.petBreed,
          age: parseInt(createForm.petAge) || 0,
          weight: parseFloat(createForm.petWeight) || 0,
          allergies: createForm.petAllergies.split(',').map(a => a.trim()).filter(a => a),
          ownerId: '',
          medicalHistory: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }] : []
      };
      
      await addOwner(newOwner);
      showNotification('Propietario registrado exitosamente', 'success');
      setIsCreateDialogOpen(false);
      resetCreateForm();
    } catch (error) {
      showNotification('Error al registrar propietario', 'error');
    }
  };

  const handleEditOwner = (owner: Owner) => {
    setOwnerToEdit(owner);
    setEditForm({
      fullName: owner.fullName,
      dni: owner.dni,
      address: owner.address,
      phone: owner.phone,
      email: owner.email
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerToEdit) return;
    
    try {
      await updateOwner(ownerToEdit.id, editForm);
      showNotification('Propietario actualizado exitosamente', 'success');
      setIsEditDialogOpen(false);
      setOwnerToEdit(null);
    } catch (error) {
      showNotification('Error al actualizar propietario', 'error');
    }
  };

  const handleDeleteOwner = (owner: Owner) => {
    setOwnerToDelete(owner);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteOwner = async () => {
    if (!ownerToDelete) return;
    
    try {
      await deleteOwner(ownerToDelete.id);
      showNotification('Propietario eliminado exitosamente', 'success');
      setIsDeleteDialogOpen(false);
      setOwnerToDelete(null);
    } catch (error) {
      showNotification('Error al eliminar propietario', 'error');
    }
  };

  const handleViewDetails = (owner: Owner) => {
    setSelectedOwner(owner);
    setIsDetailsDialogOpen(true);
  };
  
  const handleViewPetHistory = (pet: Pet) => {
    showNotification(`Viendo historial médico de ${pet.name}`, 'info');
  };

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
          <Input 
            id="fullName" 
            placeholder="Nombre y apellidos" 
            value={createForm.fullName}
            onChange={(e) => setCreateForm(prev => ({ ...prev, fullName: e.target.value }))}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dni">DNI *</Label>
          <Input 
            id="dni" 
            placeholder="12345678" 
            value={createForm.dni}
            onChange={(e) => setCreateForm(prev => ({ ...prev, dni: e.target.value }))}
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección *</Label>
        <Input 
          id="address" 
          placeholder="Dirección completa" 
          value={createForm.address}
          onChange={(e) => setCreateForm(prev => ({ ...prev, address: e.target.value }))}
          required 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="+51 987654321" 
            value={createForm.phone}
            onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="correo@email.com" 
            value={createForm.email}
            onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
            required 
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Información de la Mascota</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="petName">Nombre de la Mascota *</Label>
            <Input 
              id="petName" 
              placeholder="Nombre de la mascota" 
              value={createForm.petName}
              onChange={(e) => setCreateForm(prev => ({ ...prev, petName: e.target.value }))}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="species">Especie *</Label>
            <Select value={createForm.petSpecies} onValueChange={(value: 'dog' | 'cat') => setCreateForm(prev => ({ ...prev, petSpecies: value }))} required>
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
            <Input 
              id="breed" 
              placeholder="Raza de la mascota" 
              value={createForm.petBreed}
              onChange={(e) => setCreateForm(prev => ({ ...prev, petBreed: e.target.value }))}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Edad (años)</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="0" 
              min="0" 
              max="30" 
              value={createForm.petAge}
              onChange={(e) => setCreateForm(prev => ({ ...prev, petAge: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input 
              id="weight" 
              type="number" 
              placeholder="0" 
              min="0" 
              step="0.1" 
              value={createForm.petWeight}
              onChange={(e) => setCreateForm(prev => ({ ...prev, petWeight: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="allergies">Alergias (separar con comas)</Label>
          <Input 
            id="allergies" 
            placeholder="Ej: Pollo, Lácteos, Trigo" 
            value={createForm.petAllergies}
            onChange={(e) => setCreateForm(prev => ({ ...prev, petAllergies: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {
          setIsCreateDialogOpen(false);
          resetCreateForm();
        }}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" disabled={isLoadingOwners}>
          <Plus className="w-4 h-4 mr-2" />
          {isLoadingOwners ? 'Registrando...' : 'Registrar Propietario'}
        </Button>
      </div>
    </form>
  );

  const EditOwnerForm = () => (
    <form className="space-y-4" onSubmit={handleUpdateOwner}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-fullName">Nombre Completo *</Label>
          <Input 
            id="edit-fullName" 
            placeholder="Nombre y apellidos" 
            value={editForm.fullName}
            onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-dni">DNI *</Label>
          <Input 
            id="edit-dni" 
            placeholder="12345678" 
            value={editForm.dni}
            onChange={(e) => setEditForm(prev => ({ ...prev, dni: e.target.value }))}
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-address">Dirección *</Label>
        <Input 
          id="edit-address" 
          placeholder="Dirección completa" 
          value={editForm.address}
          onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
          required 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-phone">Teléfono *</Label>
          <Input 
            id="edit-phone" 
            type="tel" 
            placeholder="+51 987654321" 
            value={editForm.phone}
            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-email">Email *</Label>
          <Input 
            id="edit-email" 
            type="email" 
            placeholder="correo@email.com" 
            value={editForm.email}
            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
            required 
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {
          setIsEditDialogOpen(false);
          setOwnerToEdit(null);
        }}>
          Cancelar
        </Button>
        <Button type="submit" variant="success" disabled={isLoadingOwners}>
          <Save className="w-4 h-4 mr-2" />
          {isLoadingOwners ? 'Guardando...' : 'Guardar Cambios'}
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {owner.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fecha de Registro</Label>
                  <p className="text-sm">{new Date(owner.createdAt).toLocaleDateString('es-PE')}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Dirección</Label>
                <p className="text-sm flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {owner.address}
                </p>
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
                    <Button size="sm" variant="info" onClick={() => handleViewPetHistory(pet)}>
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
                Registrados en el sistema
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
                {owners.length > 0 ? (owners.reduce((total, owner) => total + owner.pets.length, 0) / owners.length).toFixed(1) : '0'}
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(owner)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          
                          <Button size="sm" variant="outline" onClick={() => handleEditOwner(owner)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteOwner(owner)}>
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

        {/* Edit Owner Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Propietario</DialogTitle>
              <DialogDescription>
                Actualiza la información del propietario
              </DialogDescription>
            </DialogHeader>
            <EditOwnerForm />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Confirmar Eliminación</span>
              </DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente al propietario y todas sus mascotas del sistema.
              </DialogDescription>
            </DialogHeader>
            
            {ownerToDelete && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>Propietario:</strong> {ownerToDelete.fullName}
                  </p>
                  <p className="text-sm text-red-800">
                    <strong>Mascotas:</strong> {ownerToDelete.pets.length} mascota(s)
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteOwner} disabled={isLoadingOwners}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isLoadingOwners ? 'Eliminando...' : 'Eliminar Propietario'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Owner Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <OwnerDetailsDialog owner={selectedOwner} />
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
