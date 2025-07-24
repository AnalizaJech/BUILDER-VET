import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { SimplePawLogo } from '@/components/PetPawLogo';
import {
  Heart,
  Users,
  Calendar,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Stethoscope,
  Scissors,
  DollarSign,
  FileText,
  Bell
} from 'lucide-react';
import { UserRole } from '@shared/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Panel Principal',
    icon: Home,
    roles: ['admin', 'veterinarian', 'receptionist', 'cashier', 'groomer']
  },
  {
    href: '/dashboard/owners',
    label: 'Propietarios',
    icon: Users,
    roles: ['admin', 'veterinarian', 'receptionist']
  },
  {
    href: '/dashboard/appointments',
    label: 'Citas',
    icon: Calendar,
    roles: ['admin', 'veterinarian', 'receptionist', 'groomer']
  },
  {
    href: '/dashboard/medical',
    label: 'Historial Clínico',
    icon: Stethoscope,
    roles: ['admin', 'veterinarian']
  },
  {
    href: '/dashboard/inventory',
    label: 'Inventario',
    icon: Package,
    roles: ['admin', 'veterinarian', 'cashier']
  },
  {
    href: '/dashboard/sales',
    label: 'Ventas',
    icon: CreditCard,
    roles: ['admin', 'cashier']
  },
  {
    href: '/dashboard/grooming',
    label: 'Grooming',
    icon: Scissors,
    roles: ['admin', 'groomer', 'receptionist']
  },
  {
    href: '/dashboard/reports',
    label: 'Reportes',
    icon: BarChart3,
    roles: ['admin']
  },
  {
    href: '/dashboard/notifications',
    label: 'Notificaciones',
    icon: Bell,
    roles: ['admin']
  },
  {
    href: '/dashboard/settings',
    label: 'Configuración',
    icon: Settings,
    roles: ['admin']
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleNavItems = navigationItems.filter(item => 
    item.roles.some(role => hasRole(role))
  );

  const getRoleDisplayName = (role: UserRole): string => {
    const roleNames = {
      admin: 'Administrador',
      veterinarian: 'Veterinario',
      receptionist: 'Recepcionista',
      cashier: 'Cajero',
      groomer: 'Groomer'
    };
    return roleNames[role];
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-auto lg:flex-shrink-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <SimplePawLogo className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Matis Pet</h1>
                <p className="text-xs text-muted-foreground">Sistema Veterinario</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <div className="mb-4">
              <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role && getRoleDisplayName(user.role)}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 relative z-30">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <h1 className="text-xl font-semibold text-foreground hidden sm:block">
              {visibleNavItems.find(item => item.href === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                Ver Sitio Web
              </Link>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
