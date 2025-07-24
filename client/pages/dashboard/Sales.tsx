import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessData } from "@/contexts/BusinessDataContext";
import { useNotifications } from "@/contexts/NotificationContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  Download,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  User,
  Package,
} from "lucide-react";

interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer";
  paymentStatus: "pending" | "completed" | "refunded";
  cashierId: string;
  cashierName: string;
  date: Date;
  notes?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CashRegister {
  id: string;
  date: Date;
  openingAmount: number;
  closingAmount?: number;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  totalTransfer: number;
  isOpen: boolean;
  openedBy: string;
  closedBy?: string;
}

export default function Sales() {
  const { user, hasRole } = useAuth();
  const { isLoading } = useBusinessData();
  const { showSuccess, showError } = useNotifications();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentSale, setCurrentSale] = useState<SaleItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [isNewSaleDialogOpen, setIsNewSaleDialogOpen] = useState(false);
  const [isCashRegisterDialogOpen, setIsCashRegisterDialogOpen] =
    useState(false);

  // Mock data
  const products: Product[] = [
    {
      id: "1",
      name: "Vacuna Antirrábica Nobivac",
      price: 45,
      stock: 5,
      category: "Medicina",
    },
    {
      id: "2",
      name: "Antibiótico Amoxicilina 500mg",
      price: 25,
      stock: 8,
      category: "Medicina",
    },
    {
      id: "3",
      name: "Alimento Premium Royal Canin 15kg",
      price: 180,
      stock: 12,
      category: "Alimento",
    },
    {
      id: "4",
      name: "Collar Antipulgas Seresto",
      price: 85,
      stock: 15,
      category: "Accesorio",
    },
    {
      id: "5",
      name: "Shampoo Medicado",
      price: 35,
      stock: 20,
      category: "Higiene",
    },
  ];

  const sales: Sale[] = [
    {
      id: "1",
      invoiceNumber: "FAC-001-2024",
      customerId: "1",
      customerName: "Carlos Pérez",
      items: [
        {
          id: "1",
          productId: "1",
          productName: "Vacuna Antirrábica Nobivac",
          price: 45,
          quantity: 1,
          subtotal: 45,
        },
        {
          id: "2",
          productId: "4",
          productName: "Collar Antipulgas Seresto",
          price: 85,
          quantity: 1,
          subtotal: 85,
        },
      ],
      subtotal: 130,
      tax: 23.4,
      discount: 0,
      total: 153.4,
      paymentMethod: "card",
      paymentStatus: "completed",
      cashierId: "4",
      cashierName: "Luis Fernández",
      date: new Date(),
      notes: "Cliente frecuente",
    },
    {
      id: "2",
      invoiceNumber: "BOL-002-2024",
      items: [
        {
          id: "1",
          productId: "3",
          productName: "Alimento Premium Royal Canin 15kg",
          price: 180,
          quantity: 2,
          subtotal: 360,
        },
      ],
      subtotal: 360,
      tax: 64.8,
      discount: 20,
      total: 404.8,
      paymentMethod: "cash",
      paymentStatus: "completed",
      cashierId: "4",
      cashierName: "Luis Fernández",
      date: new Date(Date.now() - 86400000),
    },
  ];

  const cashRegister: CashRegister = {
    id: "1",
    date: new Date(),
    openingAmount: 200,
    totalSales: 558.2,
    totalCash: 404.8,
    totalCard: 153.4,
    totalTransfer: 0,
    isOpen: true,
    openedBy: "Luis Fernández",
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addToSale = (product: Product) => {
    const existingItem = currentSale.find(
      (item) => item.productId === product.id,
    );

    if (existingItem) {
      setCurrentSale(
        currentSale.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item,
        ),
      );
    } else {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price,
      };
      setCurrentSale([...currentSale, newItem]);
    }
    showSuccess("Producto agregado", `${product.name} agregado a la venta`);
  };

  const removeFromSale = (itemId: string) => {
    setCurrentSale(currentSale.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromSale(itemId);
      return;
    }

    setCurrentSale(
      currentSale.map((item) =>
        item.id === itemId
          ? { ...item, quantity, subtotal: quantity * item.price }
          : item,
      ),
    );
  };

  const calculateTotals = () => {
    const subtotal = currentSale.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.18; // 18% IGV
    const total = subtotal + tax;

    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();
  const change = receivedAmount - total;

  const completeSale = () => {
    if (currentSale.length === 0) {
      showError("Error", "No hay productos en la venta");
      return;
    }

    if (!paymentMethod) {
      showError("Error", "Selecciona un método de pago");
      return;
    }

    if (paymentMethod === "cash" && receivedAmount < total) {
      showError("Error", "El monto recibido es insuficiente");
      return;
    }

    showSuccess(
      "Venta completada",
      `Factura generada correctamente - Total: S/ ${total.toFixed(2)}`,
    );
    setCurrentSale([]);
    setSelectedCustomer("");
    setPaymentMethod("");
    setReceivedAmount(0);
  };

  const openCashRegister = () => {
    showSuccess("Caja abierta", "Sesión de caja iniciada correctamente");
  };

  const closeCashRegister = () => {
    showSuccess("Caja cerrada", "Sesión de caja cerrada y arqueo completado");
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="w-4 h-4" />;
      case "card":
        return <CreditCard className="w-4 h-4" />;
      case "transfer":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
    };
    return labels[method as keyof typeof labels] || method;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      refunded: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Cargando sistema de ventas..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Sistema de Ventas
            </h1>
            <p className="text-muted-foreground">
              Punto de venta, facturación y gestión de caja
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Caja</p>
              <Badge
                className={
                  cashRegister.isOpen
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {cashRegister.isOpen ? "Abierta" : "Cerrada"}
              </Badge>
            </div>

            <Dialog
              open={isCashRegisterDialogOpen}
              onOpenChange={setIsCashRegisterDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Gestionar Caja
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Gestión de Caja</DialogTitle>
                  <DialogDescription>
                    Abrir o cerrar sesión de caja registradora
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">
                      S/{" "}
                      {(
                        cashRegister.openingAmount + cashRegister.totalSales
                      ).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total en caja
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Apertura:</p>
                      <p className="font-medium">
                        S/ {cashRegister.openingAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ventas:</p>
                      <p className="font-medium">
                        S/ {cashRegister.totalSales}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {cashRegister.isOpen ? (
                      <Button
                        onClick={closeCashRegister}
                        className="flex-1"
                        variant="destructive"
                      >
                        Cerrar Caja
                      </Button>
                    ) : (
                      <Button onClick={openCashRegister} className="flex-1">
                        Abrir Caja
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas de Hoy
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                S/ {cashRegister.totalSales.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {sales.length} transacciones
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efectivo</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                S/ {cashRegister.totalCash.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">En caja física</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarjetas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                S/ {cashRegister.totalCard.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pagos electrónicos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                S/ {(cashRegister.totalSales / sales.length).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Por transacción</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Point of Sale */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Punto de Venta</CardTitle>
                <CardDescription>
                  Sistema de facturación y cobro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Search */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => addToSale(product)}
                        className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              S/ {product.price}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Sale */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Venta Actual</h3>
                    {currentSale.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSale([])}
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>

                  {currentSale.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No hay productos en la venta actual</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentSale.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              S/ {item.price} c/u
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="w-20 text-right">
                            <p className="font-semibold">
                              S/ {item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Venta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Selection */}
                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente (Opcional)</Label>
                  <Select
                    value={selectedCustomer}
                    onValueChange={setSelectedCustomer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Carlos Pérez</SelectItem>
                      <SelectItem value="2">María García</SelectItem>
                      <SelectItem value="3">Juan Martínez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span>S/ {tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label>Método de Pago *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["cash", "card", "transfer"].map((method) => (
                      <Button
                        key={method}
                        variant={
                          paymentMethod === method ? "default" : "outline"
                        }
                        onClick={() => setPaymentMethod(method)}
                        className="flex flex-col items-center h-16"
                        size="sm"
                      >
                        {getPaymentMethodIcon(method)}
                        <span className="text-xs mt-1">
                          {getPaymentMethodLabel(method)}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Cash Payment */}
                {paymentMethod === "cash" && (
                  <div className="space-y-2">
                    <Label htmlFor="received-amount">Monto Recibido</Label>
                    <Input
                      id="received-amount"
                      type="number"
                      placeholder="0.00"
                      value={receivedAmount || ""}
                      onChange={(e) =>
                        setReceivedAmount(Number(e.target.value))
                      }
                    />
                    {receivedAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Vuelto:</span>
                        <span
                          className={
                            change >= 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          S/ {change.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Complete Sale */}
                <Button
                  onClick={completeSale}
                  disabled={
                    currentSale.length === 0 ||
                    !paymentMethod ||
                    !cashRegister.isOpen
                  }
                  className="w-full"
                  size="lg"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Completar Venta
                </Button>

                {!cashRegister.isOpen && (
                  <p className="text-sm text-red-600 text-center">
                    La caja debe estar abierta para procesar ventas
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sales History */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Ventas</CardTitle>
            <CardDescription>
              Registro de todas las transacciones realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {sale.date.toLocaleDateString("es-PE")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {sale.date.toLocaleTimeString("es-PE")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{sale.invoiceNumber}</p>
                      </TableCell>
                      <TableCell>
                        {sale.customerName ? (
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3" />
                            <span>{sale.customerName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Cliente general
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {sale.items.slice(0, 2).map((item) => (
                            <p key={item.id} className="text-sm">
                              {item.quantity}x {item.productName}
                            </p>
                          ))}
                          {sale.items.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{sale.items.length - 2} más
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(sale.paymentMethod)}
                          <span className="text-sm">
                            {getPaymentMethodLabel(sale.paymentMethod)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          S/ {sale.total.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sale.paymentStatus)}>
                          {sale.paymentStatus === "completed"
                            ? "Completada"
                            : sale.paymentStatus === "pending"
                              ? "Pendiente"
                              : "Reembolsada"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3" />
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
