import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Owner, Pet, Appointment, MedicalRecord } from "@shared/types";

interface BusinessDataContextType {
  // Data
  owners: Owner[];
  pets: Pet[];
  appointments: (Appointment & {
    petName: string;
    ownerName: string;
    ownerPhone: string;
  })[];
  medicalRecords: any[];

  // Loading states
  isLoading: boolean;
  isLoadingOwners: boolean;
  isLoadingAppointments: boolean;
  isLoadingMedical: boolean;

  // Actions
  addOwner: (
    owner: Omit<Owner, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateOwner: (id: string, updates: Partial<Owner>) => Promise<void>;
  deleteOwner: (id: string) => Promise<void>;

  addPet: (
    ownerId: string,
    pet: Omit<Pet, "id" | "ownerId" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updatePet: (petId: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;

  addAppointment: (
    appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updateAppointment: (
    id: string,
    updates: Partial<Appointment>,
  ) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;

  addMedicalRecord: (record: any) => Promise<void>;
  updateMedicalRecord: (id: string, updates: any) => Promise<void>;

  // Utility functions
  getOwnerById: (id: string) => Owner | undefined;
  getPetById: (id: string) => Pet | undefined;
  getAppointmentsByOwner: (ownerId: string) => any[];
  getUpcomingAppointments: () => any[];
  getAppointmentsByDate: (date: Date) => any[];
  getMedicalHistoryByPet: (petId: string) => any[];
  getUpcomingVaccinations: () => any[];

  // Statistics
  getStats: () => {
    totalOwners: number;
    totalPets: number;
    todayAppointments: number;
    pendingAppointments: number;
    completedAppointmentsThisMonth: number;
  };
}

const BusinessDataContext = createContext<BusinessDataContextType | undefined>(
  undefined,
);

export const useBusinessData = () => {
  const context = useContext(BusinessDataContext);
  if (context === undefined) {
    throw new Error(
      "useBusinessData must be used within a BusinessDataProvider",
    );
  }
  return context;
};

interface BusinessDataProviderProps {
  children: ReactNode;
}

export const BusinessDataProvider: React.FC<BusinessDataProviderProps> = ({
  children,
}) => {
  // State
  const [owners, setOwners] = useState<Owner[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);

  // Loading states
  const [isLoadingOwners, setIsLoadingOwners] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [isLoadingMedical, setIsLoadingMedical] = useState(false);

  const isLoading =
    isLoadingOwners || isLoadingAppointments || isLoadingMedical;

  // Mock data initialization
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = async () => {
    setIsLoadingOwners(true);
    setIsLoadingAppointments(true);
    setIsLoadingMedical(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Initialize mock owners
    const mockOwners: Owner[] = [
      {
        id: "1",
        fullName: "Carlos Pérez González",
        dni: "12345678",
        address: "Av. Principal 123, Lima",
        phone: "+51 987654321",
        email: "carlos.perez@email.com",
        pets: [
          {
            id: "1",
            name: "Max",
            species: "dog",
            breed: "Golden Retriever",
            age: 3,
            weight: 25,
            allergies: ["Pollo"],
            ownerId: "1",
            medicalHistory: [],
            createdAt: new Date("2023-01-15"),
            updatedAt: new Date("2024-01-15"),
          },
          {
            id: "2",
            name: "Luna",
            species: "cat",
            breed: "Persa",
            age: 2,
            weight: 4,
            allergies: [],
            ownerId: "1",
            medicalHistory: [],
            createdAt: new Date("2023-06-10"),
            updatedAt: new Date("2024-01-15"),
          },
        ],
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        fullName: "María García Rodríguez",
        dni: "87654321",
        address: "Jr. Los Olivos 456, San Isidro",
        phone: "+51 912345678",
        email: "maria.garcia@email.com",
        pets: [
          {
            id: "3",
            name: "Rocky",
            species: "dog",
            breed: "Bulldog Francés",
            age: 4,
            weight: 12,
            allergies: ["Lácteos", "Trigo"],
            ownerId: "2",
            medicalHistory: [],
            createdAt: new Date("2023-03-20"),
            updatedAt: new Date("2024-01-15"),
          },
        ],
        createdAt: new Date("2023-03-20"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "3",
        fullName: "José Ángel Núñez Sánchez",
        dni: "45612378",
        address: "Calle Martín Olañeta 789, Miraflores",
        phone: "+51 998765432",
        email: "jose.nunez@email.com",
        pets: [
          {
            id: "4",
            name: "Simón",
            species: "cat",
            breed: "Siamés",
            age: 1,
            weight: 3.5,
            allergies: ["Pescado"],
            ownerId: "3",
            medicalHistory: [],
            createdAt: new Date("2023-08-15"),
            updatedAt: new Date("2024-01-15"),
          },
        ],
        createdAt: new Date("2023-08-15"),
        updatedAt: new Date("2024-01-15"),
      },
    ];

    // Initialize mock appointments
    const mockAppointments = [
      {
        id: "1",
        petId: "1",
        ownerId: "1",
        veterinarianId: "2",
        appointmentType: "consultation" as const,
        date: new Date(),
        startTime: "09:00",
        duration: 30,
        status: "confirmed" as const,
        notes: "Chequeo de rutina",
        reminderSent: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        petName: "Max",
        ownerName: "Carlos Pérez",
        ownerPhone: "+51 987654321",
      },
      {
        id: "2",
        petId: "2",
        ownerId: "1",
        veterinarianId: "2",
        appointmentType: "vaccination" as const,
        date: new Date(),
        startTime: "10:30",
        duration: 15,
        status: "scheduled" as const,
        notes: "Vacuna antirrábica",
        reminderSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        petName: "Luna",
        ownerName: "Carlos Pérez",
        ownerPhone: "+51 987654321",
      },
    ];

    // Initialize mock medical records
    const mockMedicalRecords = [
      {
        id: "1",
        petId: "1",
        petName: "Max",
        ownerName: "Carlos Pérez",
        visitDate: new Date("2024-01-15"),
        veterinarianName: "Dr. Carlos Rodríguez",
        appointmentType: "consultation",
        symptoms: "Pérdida de apetito, letargia",
        diagnosis: "Gastritis leve",
        treatment: "Dieta blanda por 3 días, medicación antiácida",
        medications: ["Ranitidina 50mg", "Probióticos"],
        weight: 25.5,
        nextVisitDate: new Date("2024-02-15"),
        vaccines: [],
        xrays: [],
        notes: "Paciente en buen estado general.",
      },
    ];

    setOwners(mockOwners);
    setAppointments(mockAppointments);
    setMedicalRecords(mockMedicalRecords);

    setIsLoadingOwners(false);
    setIsLoadingAppointments(false);
    setIsLoadingMedical(false);
  };

  // Computed values
  const pets = owners.flatMap((owner) => owner.pets);

  // Actions
  const addOwner = async (
    ownerData: Omit<Owner, "id" | "createdAt" | "updatedAt">,
  ) => {
    setIsLoadingOwners(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newOwner: Owner = {
        ...ownerData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setOwners((prev) => [...prev, newOwner]);
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const updateOwner = async (id: string, updates: Partial<Owner>) => {
    setIsLoadingOwners(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setOwners((prev) =>
        prev.map((owner) =>
          owner.id === id
            ? { ...owner, ...updates, updatedAt: new Date() }
            : owner,
        ),
      );
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const deleteOwner = async (id: string) => {
    setIsLoadingOwners(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setOwners((prev) => prev.filter((owner) => owner.id !== id));
      setAppointments((prev) => prev.filter((apt) => apt.ownerId !== id));
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const addPet = async (
    ownerId: string,
    petData: Omit<Pet, "id" | "ownerId" | "createdAt" | "updatedAt">,
  ) => {
    setIsLoadingOwners(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newPet: Pet = {
        ...petData,
        id: Date.now().toString(),
        ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setOwners((prev) =>
        prev.map((owner) =>
          owner.id === ownerId
            ? { ...owner, pets: [...owner.pets, newPet], updatedAt: new Date() }
            : owner,
        ),
      );
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const updatePet = async (petId: string, updates: Partial<Pet>) => {
    setIsLoadingOwners(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setOwners((prev) =>
        prev.map((owner) => ({
          ...owner,
          pets: owner.pets.map((pet) =>
            pet.id === petId
              ? { ...pet, ...updates, updatedAt: new Date() }
              : pet,
          ),
          updatedAt: owner.pets.some((pet) => pet.id === petId)
            ? new Date()
            : owner.updatedAt,
        })),
      );
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const deletePet = async (petId: string) => {
    setIsLoadingOwners(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setOwners((prev) =>
        prev.map((owner) => ({
          ...owner,
          pets: owner.pets.filter((pet) => pet.id !== petId),
          updatedAt: owner.pets.some((pet) => pet.id === petId)
            ? new Date()
            : owner.updatedAt,
        })),
      );

      // Also remove related appointments and medical records
      setAppointments((prev) => prev.filter((apt) => apt.petId !== petId));
      setMedicalRecords((prev) =>
        prev.filter((record) => record.petId !== petId),
      );
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const addAppointment = async (appointmentData: any) => {
    setIsLoadingAppointments(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const owner = getOwnerById(appointmentData.ownerId);
      const pet = getPetById(appointmentData.petId);

      const newAppointment = {
        ...appointmentData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        petName: pet?.name || "",
        ownerName: owner?.fullName || "",
        ownerPhone: owner?.phone || "",
      };

      setAppointments((prev) => [...prev, newAppointment]);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const updateAppointment = async (id: string, updates: any) => {
    setIsLoadingAppointments(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, ...updates, updatedAt: new Date() } : apt,
        ),
      );
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    await updateAppointment(id, { status: "cancelled" });
  };

  const addMedicalRecord = async (recordData: any) => {
    setIsLoadingMedical(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newRecord = {
        ...recordData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      setMedicalRecords((prev) => [...prev, newRecord]);
    } finally {
      setIsLoadingMedical(false);
    }
  };

  const updateMedicalRecord = async (id: string, updates: any) => {
    setIsLoadingMedical(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setMedicalRecords((prev) =>
        prev.map((record) =>
          record.id === id ? { ...record, ...updates } : record,
        ),
      );
    } finally {
      setIsLoadingMedical(false);
    }
  };

  // Utility functions
  const getOwnerById = (id: string) => owners.find((owner) => owner.id === id);
  const getPetById = (id: string) => pets.find((pet) => pet.id === id);

  const getAppointmentsByOwner = (ownerId: string) =>
    appointments.filter((apt) => apt.ownerId === ownerId);

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments
      .filter(
        (apt) =>
          apt.date >= today && ["scheduled", "confirmed"].includes(apt.status),
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getAppointmentsByDate = (date: Date) => {
    const dateStr = date.toDateString();
    return appointments.filter((apt) => apt.date.toDateString() === dateStr);
  };

  const getMedicalHistoryByPet = (petId: string) =>
    medicalRecords.filter((record) => record.petId === petId);

  const getUpcomingVaccinations = () => {
    // This would calculate upcoming vaccinations based on medical records
    return [
      {
        petName: "Max",
        ownerName: "Carlos Pérez",
        vaccine: "Sextuple Canina",
        dueDate: new Date("2024-03-15"),
      },
      {
        petName: "Luna",
        ownerName: "Carlos Pérez",
        vaccine: "Leucemia Felina",
        dueDate: new Date("2024-02-10"),
      },
    ];
  };

  const getStats = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      totalOwners: owners.length,
      totalPets: pets.length,
      todayAppointments: getAppointmentsByDate(today).length,
      pendingAppointments: appointments.filter(
        (apt) => apt.status === "pending",
      ).length,
      completedAppointmentsThisMonth: appointments.filter(
        (apt) =>
          apt.status === "completed" &&
          apt.date >= startOfMonth &&
          apt.date <= today,
      ).length,
    };
  };

  const value: BusinessDataContextType = {
    // Data
    owners,
    pets,
    appointments,
    medicalRecords,

    // Loading states
    isLoading,
    isLoadingOwners,
    isLoadingAppointments,
    isLoadingMedical,

    // Actions
    addOwner,
    updateOwner,
    deleteOwner,
    addPet,
    updatePet,
    deletePet,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    addMedicalRecord,
    updateMedicalRecord,

    // Utility functions
    getOwnerById,
    getPetById,
    getAppointmentsByOwner,
    getUpcomingAppointments,
    getAppointmentsByDate,
    getMedicalHistoryByPet,
    getUpcomingVaccinations,
    getStats,
  };

  return (
    <BusinessDataContext.Provider value={value}>
      {children}
    </BusinessDataContext.Provider>
  );
};
