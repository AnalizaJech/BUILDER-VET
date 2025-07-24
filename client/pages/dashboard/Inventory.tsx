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
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  Download,
  Upload,
  ShoppingCart,
  Building2
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: 'medicine' | 'food' | 'accessory';
  description: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  expirationDate?: Date;
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  reference?: string;
  userId: string;
  userName: string;
  date: Date;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  productsCount: number;
  isActive: boolean;
}

export default function Inventory() {
  const { hasRole } = useAuth();
  const { isLoading } = useBusinessData();
  const { showSuccess, showError, showWarning } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  const [isStockMovementDialogOpen, setIsStockMovementDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Handler functions for buttons
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Producto creado exitosamente');
    setIsNewProductDialogOpen(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Proveedor registrado exitosamente');
    setIsNewSupplierDialogOpen(false);
  };

  const handleStockMovement = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Movimiento de stock registrado');
    setIsStockMovementDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    showSuccess(`Editando producto: ${product.name}`);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`¿Estás seguro de eliminar ${product.name}?`)) {
      showSuccess(`Producto ${product.name} eliminado`);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDownloadReport = () => {
    showSuccess('Generando reporte de inventario...');
  };

  const handleImportProducts = () => {
    showSuccess('Función de importación disponible próximamente');
  };

  const handleExportProducts = () => {
    showSuccess('Exportando productos...');
  };

  // Mock data
  const products: Product[] = [
    {
      id: '1',
      name: 'Vacuna Antirrábica Nobivac',
      category: 'medicine',
      description: 'Vacuna antirrábica para perros y gatos',
      sku: 'VAC-001',
      price: 45,
      stock: 5,
      minStock: 10,
      maxStock: 50,
      supplier: 'MSD Animal Health',
      expirationDate: new Date('2024-12-31'),
      location: 'Refrigerador A1',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Antibiótico Amoxicilina 500mg',
      category: 'medicine',
      description: 'Antibiótico de amplio espectro',
      sku: 'MED-002',
      price: 25,
      stock: 3,
      minStock: 15,
      maxStock: 100,
      supplier: 'Laboratorios Virbac',
      expirationDate: new Date('2025-06-30'),
      location: 'Estante B2',
      isActive: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '3',
      name: 'Alimento Premium Royal Canin',
      category: 'food',
      description: 'Alimento premium para perros adultos 15kg',
      sku: 'ALI-003',
      price: 180,
      stock: 8,
      minStock: 5,
      maxStock: 30,
      supplier: 'Royal Canin Perú',
      location: 'Almacén C1',
      isActive: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '4',
      name: 'Collar Antipulgas Seresto',
      category: 'accessory',
      description: 'Collar antipulgas y garrapatas 8 meses',
      sku: 'ACC-004',
      price: 85,
      stock: 12,
      minStock: 8,
      maxStock: 50,
      supplier: 'Bayer Animal Health',
      location: 'Vitrina D1',
      isActive: true,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  const stockMovements: StockMovement[] = [
    {
      id: '1',
      productId: '1',
      productName: 'Vacuna Antirrábica Nobivac',
      type: 'out',
      quantity: 2,
      reason: 'Venta',
      reference: 'VTA-001',
      userId: '1',
      userName: 'Dr. Carlos',
      date: new Date()
    },
    {
      id: '2',
      productId: '2',
      productName: 'Antibiótico Amoxicilina 500mg',
      type: 'in',
      quantity: 20,
      reason: 'Compra',
      reference: 'COM-001',
      userId: '1',
      userName: 'Admin',
      date: new Date(Date.now() - 86400000)
    }
  ];

  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'MSD Animal Health',
      contactPerson: 'Juan Pérez',
      phone: '+51 1 234 5678',
      email: 'contacto@msd.com.pe',
      address: 'Av. Principal 123, Lima',
      productsCount: 15,
      isActive: true
    },
    {
      id: '2',
      name: 'Laboratorios Virbac',
      contactPerson: 'María González',
      phone: '+51 1 234 5679',
      email: 'ventas@virbac.com.pe',
      address: 'Jr. Comercio 456, Lima',
      productsCount: 8,
      isActive: true
    },
    {
      id: '3',
      name: 'Royal Canin Perú',
      contactPerson: 'Carlos Mendoza',
      phone: '+51 1 234 5680',
      email: 'info@royalcanin.pe',
      address: 'Av. Industrial 789, Lima',
      productsCount: 12,
      isActive: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'low-stock') {
      matchesStatus = product.stock <= product.minStock;
    } else if (statusFilter === 'expired') {
      matchesStatus = product.expirationDate ? product.expirationDate < new Date() : false;
    } else if (statusFilter === 'expiring') {
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      matchesStatus = product.expirationDate ? product.expirationDate <= oneMonthFromNow : false;
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryLabel = (category: string) => {
    const labels = {
      medicine: 'Medicina',
      food: 'Alimento',
      accessory: 'Accesorio'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      medicine: 'bg-red-100 text-red-800',
      food: 'bg-green-100 text-green-800',
      accessory: 'bg-blue-100 text-blue-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minStock) {
      return { label: 'Stock Bajo', color: 'bg-red-100 text-red-800' };
    } else if (product.stock <= product.minStock * 1.5) {
      return { label: 'Stock Moderado', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'Stock Normal', color: 'bg-green-100 text-green-800' };
    }
  };

  const isExpired = (date?: Date) => date && date < new Date();
  const isExpiringSoon = (date?: Date) => {
    if (!date) return false;
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return date <= oneMonthFromNow && date >= new Date();
  };

  const handleStockMovementAction = (productId: string, type: 'in' | 'out', quantity: number, reason: string) => {
    showSuccess(`Stock ${type === 'in' ? 'agregado' : 'retirado'}: ${quantity} unidades ${type === 'in' ? 'agregadas al' : 'retiradas del'} inventario`);
  };

  const NewProductForm = () => (
    <form className="space-y-4" onSubmit={handleCreateProduct}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-name">Nombre del Producto *</Label>
          <Input id="product-name" placeholder="Ej: Vacuna Antirrábica" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-sku">SKU *</Label>
          <Input id="product-sku" placeholder="Ej: VAC-001" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-category">Categoría *</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medicine">Medicina</SelectItem>
              <SelectItem value="food">Alimento</SelectItem>
              <SelectItem value="accessory">Accesorio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-supplier">Proveedor *</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar proveedor" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-description">Descripción</Label>
        <Textarea
          id="product-description"
          placeholder="Descripción del producto..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-price">Precio (S/) *</Label>
          <Input id="product-price" type="number" placeholder="0.00" step="0.01" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-stock">Stock Inicial *</Label>
          <Input id="product-stock" type="number" placeholder="0" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-location">Ubicación</Label>
          <Input id="product-location" placeholder="Ej: Estante A1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-min-stock">Stock Mínimo *</Label>
          <Input id="product-min-stock" type="number" placeholder="0" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-max-stock">Stock Máximo</Label>
          <Input id="product-max-stock" type="number" placeholder="0" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-expiration">Fecha de Vencimiento (opcional)</Label>
        <Input id="product-expiration" type="date" />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsNewProductDialogOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit">
          Crear Producto
        </Button>
      </div>
    </form>
  );

  const StockMovementForm = () => (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="movement-product">Producto *</Label>
        <Select required>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar producto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - Stock: {product.stock}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="movement-type">Tipo de Movimiento *</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in">Entrada</SelectItem>
              <SelectItem value="out">Salida</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="movement-quantity">Cantidad *</Label>
          <Input id="movement-quantity" type="number" placeholder="0" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="movement-reason">Motivo *</Label>
        <Select required>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar motivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="purchase">Compra</SelectItem>
            <SelectItem value="sale">Venta</SelectItem>
            <SelectItem value="adjustment">Ajuste de Inventario</SelectItem>
            <SelectItem value="expired">Producto Vencido</SelectItem>
            <SelectItem value="damaged">Producto Dañado</SelectItem>
            <SelectItem value="transfer">Transferencia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="movement-reference">Referencia</Label>
        <Input id="movement-reference" placeholder="Número de factura, orden, etc." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="movement-notes">Notas</Label>
        <Textarea
          id="movement-notes"
          placeholder="Notas adicionales..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsStockMovementDialogOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit">
          Registrar Movimiento
        </Button>
      </div>
    </form>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Cargando inventario..." />
      </DashboardLayout>
    );
  }

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const expiredCount = products.filter(p => isExpired(p.expirationDate)).length;
  const expiringSoonCount = products.filter(p => isExpiringSoon(p.expirationDate)).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Inventario</h1>
            <p className="text-muted-foreground">
              Administra productos, stock y movimientos de inventario
            </p>
          </div>
          <div className="flex space-x-2">
            {hasRole(['admin', 'veterinarian', 'cashier']) && (
              <>
                <Dialog open={isStockMovementDialogOpen} onOpenChange={setIsStockMovementDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Movimiento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
                      <DialogDescription>
                        Registra entrada o salida de productos del inventario
                      </DialogDescription>
                    </DialogHeader>
                    <StockMovementForm />
                  </DialogContent>
                </Dialog>

                <Dialog open={isNewProductDialogOpen} onOpenChange={setIsNewProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                      <DialogDescription>
                        Registra un nuevo producto en el inventario
                      </DialogDescription>
                    </DialogHeader>
                    <NewProductForm />
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
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">En catálogo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Productos con stock bajo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{expiringSoonCount}</div>
              <p className="text-xs text-muted-foreground">Próximos 30 días</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/ {totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Inventario actual</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(lowStockCount > 0 || expiredCount > 0 || expiringSoonCount > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lowStockCount > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-red-800">Stock Bajo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700">
                    {lowStockCount} productos necesitan reposición urgente
                  </p>
                </CardContent>
              </Card>
            )}

            {expiredCount > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-red-800">Productos Vencidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700">
                    {expiredCount} productos han vencido y deben ser retirados
                  </p>
                </CardContent>
              </Card>
            )}

            {expiringSoonCount > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-orange-800">Por Vencer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-700">
                    {expiringSoonCount} productos vencen en los próximos 30 días
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="movements">Movimientos</TabsTrigger>
            <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Productos</CardTitle>
                <CardDescription>
                  Gestiona el catálogo de productos y niveles de stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="medicine">Medicina</SelectItem>
                      <SelectItem value="food">Alimento</SelectItem>
                      <SelectItem value="accessory">Accesorio</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="low-stock">Stock Bajo</SelectItem>
                      <SelectItem value="expiring">Por Vencer</SelectItem>
                      <SelectItem value="expired">Vencidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Products Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product);
                        const expired = isExpired(product.expirationDate);
                        const expiringSoon = isExpiringSoon(product.expirationDate);
                        
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.sku}</p>
                                {product.location && (
                                  <p className="text-xs text-muted-foreground">📍 {product.location}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getCategoryColor(product.category)}>
                                {getCategoryLabel(product.category)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{product.stock}</span>
                                  <span className="text-sm text-muted-foreground">/ {product.minStock} min</span>
                                </div>
                                <Badge className={stockStatus.color} variant="outline">
                                  {stockStatus.label}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">S/ {product.price}</span>
                            </TableCell>
                            <TableCell>
                              {product.expirationDate ? (
                                <div className="space-y-1">
                                  <p className={`text-sm ${expired ? 'text-red-600 font-medium' : expiringSoon ? 'text-orange-600' : ''}`}>
                                    {product.expirationDate.toLocaleDateString('es-PE')}
                                  </p>
                                  {expired && (
                                    <Badge variant="destructive" className="text-xs">
                                      Vencido
                                    </Badge>
                                  )}
                                  {expiringSoon && !expired && (
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                                      Por vencer
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Sin vencimiento</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{product.supplier}</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                
                                <Dialog open={isStockMovementDialogOpen} onOpenChange={setIsStockMovementDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <TrendingUp className="w-3 h-3" />
                                    </Button>
                                  </DialogTrigger>
                                </Dialog>
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
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Movimientos de Stock</CardTitle>
                <CardDescription>
                  Historial de entradas y salidas de inventario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Usuario</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {movement.date.toLocaleDateString('es-PE')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {movement.date.toLocaleTimeString('es-PE')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{movement.productName}</p>
                            {movement.reference && (
                              <p className="text-sm text-muted-foreground">Ref: {movement.reference}</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={movement.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {movement.type === 'in' ? (
                                <><TrendingUp className="w-3 h-3 mr-1" /> Entrada</>
                              ) : (
                                <><TrendingDown className="w-3 h-3 mr-1" /> Salida</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                              {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                            </span>
                          </TableCell>
                          <TableCell>{movement.reason}</TableCell>
                          <TableCell>{movement.userName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Proveedores</CardTitle>
                    <CardDescription>
                      Gestiona la información de proveedores
                    </CardDescription>
                  </div>
                  <Dialog open={isNewSupplierDialogOpen} onOpenChange={setIsNewSupplierDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Proveedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
                        <DialogDescription>
                          Registra un nuevo proveedor en el sistema
                        </DialogDescription>
                      </DialogHeader>
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Formulario de proveedor aquí</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suppliers.map((supplier) => (
                    <Card key={supplier.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">{supplier.contactPerson}</p>
                          <p className="text-sm text-muted-foreground">{supplier.phone}</p>
                          <p className="text-sm text-muted-foreground">{supplier.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{supplier.address}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="outline">
                            {supplier.productsCount} productos
                          </Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
