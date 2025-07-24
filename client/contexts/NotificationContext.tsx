import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface NotificationContextType {
  showSuccess: (message: string, description?: string) => void;
  showError: (message: string, description?: string) => void;
  showWarning: (message: string, description?: string) => void;
  showInfo: (message: string, description?: string) => void;
  showAppointmentConfirmation: (petName: string, date: string, time: string) => void;
  showMedicalRecordSaved: (petName: string) => void;
  showOwnerRegistered: (ownerName: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: <CheckCircle className="w-4 h-4" />,
      duration: 4000,
    });
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <AlertCircle className="w-4 h-4" />,
      duration: 6000,
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="w-4 h-4" />,
      duration: 5000,
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="w-4 h-4" />,
      duration: 4000,
    });
  };

  const showAppointmentConfirmation = (petName: string, date: string, time: string) => {
    toast.success('¡Cita agendada exitosamente!', {
      description: `${petName} - ${date} a las ${time}`,
      icon: <CheckCircle className="w-4 h-4" />,
      duration: 6000,
      action: {
        label: 'Ver citas',
        onClick: () => window.location.href = '/dashboard/appointments'
      }
    });
  };

  const showMedicalRecordSaved = (petName: string) => {
    toast.success('Registro médico guardado', {
      description: `Historial de ${petName} actualizado correctamente`,
      icon: <CheckCircle className="w-4 h-4" />,
      duration: 4000,
    });
  };

  const showOwnerRegistered = (ownerName: string) => {
    toast.success('Propietario registrado', {
      description: `${ownerName} ha sido agregado al sistema`,
      icon: <CheckCircle className="w-4 h-4" />,
      duration: 4000,
    });
  };

  const value: NotificationContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAppointmentConfirmation,
    showMedicalRecordSaved,
    showOwnerRegistered,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
