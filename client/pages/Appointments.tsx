import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useBusinessData } from "@/contexts/BusinessDataContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Calendar as CalendarIcon,
  Clock,
  Heart,
  User,
  Phone,
  Mail,
  MapPin,
  Scissors,
  Shield,
  Sparkles,
  CheckCircle,
  Stethoscope,
  Star,
  Users,
  ArrowRight,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import {
  format,
  isSameDay,
  isAfter,
  isBefore,
  addMinutes,
  parse,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";

export default function Appointments() {
  const { addAppointment, addOwner, appointments, isLoading } =
    useBusinessData();
  const { showNotification } = useNotifications();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    ownerName: "",
    petName: "",
    phone: "",
    email: "",
    petType: "",
    petSize: "",
    notes: "",
  });

  const services = [
    {
      id: "consulta-veterinaria",
      name: "Consulta Veterinaria",
      description: "Examen médico completo con diagnóstico profesional",
      duration: 30,
      durationLabel: "30-45 min",
      price: "S/ 60",
      originalPrice: "S/ 80",
      icon: Stethoscope,
      popular: true,
      features: [
        "Examen físico completo",
        "Diagnóstico profesional",
        "Plan de tratamiento",
        "Consejos de cuidado",
      ],
    },
    {
      id: "grooming-basico",
      name: "Grooming Básico",
      description: "Baño, corte de uñas, limpieza de oídos y peinado básico",
      duration: 90,
      durationLabel: "1-2 horas",
      price: "S/ 80",
      originalPrice: "S/ 100",
      icon: Scissors,
      popular: false,
      features: [
        "Baño con shampoo premium",
        "Corte de uñas",
        "Limpieza de oídos",
        "Secado profesional",
      ],
    },
    {
      id: "grooming-completo",
      name: "Grooming Premium",
      description:
        "Servicio completo con spa, corte especializado y tratamientos",
      duration: 120,
      durationLabel: "2-3 horas",
      price: "S/ 120",
      originalPrice: "S/ 150",
      icon: Sparkles,
      popular: true,
      features: [
        "Todo del grooming básico",
        "Corte de pelo especializado",
        "Spa relajante",
        "Perfume para mascotas",
      ],
    },
    {
      id: "vacunacion",
      name: "Vacunación",
      description: "Programa completo de vacunación con certificado oficial",
      duration: 15,
      durationLabel: "15-30 min",
      price: "S/ 40",
      originalPrice: "S/ 60",
      icon: Heart,
      popular: false,
      features: [
        "Vacuna importada",
        "Certificado oficial",
        "Recordatorio automático",
        "Seguimiento médico",
      ],
    },
    {
      id: "tratamiento-especializado",
      name: "Tratamiento Especializado",
      description: "Cirugías menores y tratamientos médicos avanzados",
      duration: 180,
      durationLabel: "1-3 horas",
      price: "S/ 350",
      originalPrice: "S/ 450",
      icon: Shield,
      popular: false,
      features: [
        "Evaluación pre-quirúrgica",
        "Anestesia segura",
        "Cuidado post-operatorio",
        "Seguimiento 24/7",
      ],
    },
  ];

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  const testimonials = [
    {
      name: "María G.",
      comment: "Excelente atención, muy profesionales",
      rating: 5,
    },
    {
      name: "Carlos M.",
      comment: "Mi perro siempre sale feliz de aquí",
      rating: 5,
    },
    {
      name: "Ana R.",
      comment: "Precios justos y servicio de calidad",
      rating: 5,
    },
  ];

  // Check if a time slot is available
  const isTimeSlotAvailable = (
    date: Date | undefined,
    time: string,
  ): boolean => {
    if (!date) return true;

    // Check if it's a past time on today
    if (isToday(date)) {
      const now = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hours, minutes, 0, 0);

      if (isBefore(slotTime, now)) {
        return false;
      }
    }

    // Check for existing appointments
    const dayAppointments = appointments.filter(
      (apt) =>
        isSameDay(new Date(apt.date), date) &&
        apt.status !== "cancelled" &&
        apt.status !== "no-show",
    );

    const selectedServiceData = services.find((s) => s.id === selectedService);
    const serviceDuration = selectedServiceData?.duration || 30;

    for (const apt of dayAppointments) {
      const aptStart = parse(apt.startTime, "HH:mm", date);
      const aptEnd = addMinutes(aptStart, apt.duration || 30);

      const slotStart = parse(time, "HH:mm", date);
      const slotEnd = addMinutes(slotStart, serviceDuration);

      // Check if times overlap
      if (
        (isAfter(slotStart, aptStart) && isBefore(slotStart, aptEnd)) ||
        (isAfter(slotEnd, aptStart) && isBefore(slotEnd, aptEnd)) ||
        (isBefore(slotStart, aptStart) && isAfter(slotEnd, aptEnd))
      ) {
        return false;
      }
    }

    return true;
  };

  // Get the reason why a time slot is not available
  const getTimeSlotStatus = (date: Date | undefined, time: string): string => {
    if (!date) return "available";

    // Check if it's a past time on today
    if (isToday(date)) {
      const now = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hours, minutes, 0, 0);

      if (isBefore(slotTime, now)) {
        return "past";
      }
    }

    // Check for existing appointments
    const dayAppointments = appointments.filter(
      (apt) =>
        isSameDay(new Date(apt.date), date) &&
        apt.status !== "cancelled" &&
        apt.status !== "no-show",
    );

    const selectedServiceData = services.find((s) => s.id === selectedService);
    const serviceDuration = selectedServiceData?.duration || 30;

    for (const apt of dayAppointments) {
      const aptStart = parse(apt.startTime, "HH:mm", date);
      const aptEnd = addMinutes(aptStart, apt.duration || 30);

      const slotStart = parse(time, "HH:mm", date);
      const slotEnd = addMinutes(slotStart, serviceDuration);

      // Check if times overlap
      if (
        (isAfter(slotStart, aptStart) && isBefore(slotStart, aptEnd)) ||
        (isAfter(slotEnd, aptStart) && isBefore(slotEnd, aptEnd)) ||
        (isBefore(slotStart, aptStart) && isAfter(slotEnd, aptEnd))
      ) {
        return "occupied";
      }
    }

    return "available";
  };

  const getAppointmentsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return appointments.filter(
      (apt) =>
        isSameDay(new Date(apt.date), date) &&
        apt.status !== "cancelled" &&
        apt.status !== "no-show",
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedDate ||
      !selectedTime ||
      !selectedService ||
      !formData.ownerName ||
      !formData.petName ||
      !formData.phone
    ) {
      showNotification(
        "Por favor completa todos los campos requeridos",
        "error",
      );
      return;
    }

    // Double-check availability before submitting
    if (!isTimeSlotAvailable(selectedDate, selectedTime)) {
      showNotification(
        "El horario seleccionado ya no está disponible. Por favor elige otro.",
        "error",
      );
      return;
    }

    try {
      // Create owner first (or find existing)
      const newOwner = {
        fullName: formData.ownerName,
        dni: "",
        email: formData.email || "",
        phone: formData.phone,
        address: "",
        pets: [
          {
            id: Date.now().toString(),
            name: formData.petName,
            species:
              formData.petType === "dog" ? ("dog" as const) : ("cat" as const),
            breed: formData.petSize || "No especificado",
            age: 0,
            weight: 0,
            allergies: [],
            ownerId: "",
            medicalHistory: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      await addOwner(newOwner);

      // Create appointment
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const selectedServiceData = services.find(
        (s) => s.id === selectedService,
      );

      const newAppointment = {
        petId: "temp-pet-id", // In real app, this would be the actual pet ID
        ownerId: "temp-owner-id", // In real app, this would be the actual owner ID
        appointmentType:
          selectedService === "consulta-veterinaria"
            ? ("consultation" as const)
            : selectedService === "vacunacion"
              ? ("vaccination" as const)
              : selectedService.includes("grooming")
                ? ("grooming" as const)
                : ("consultation" as const),
        date: appointmentDateTime,
        startTime: selectedTime,
        duration: selectedServiceData?.duration || 30,
        status: "scheduled" as const,
        notes: `Mascota: ${formData.petName} (${formData.petType}${formData.petSize ? `, ${formData.petSize}` : ""})${formData.notes ? `\nNotas: ${formData.notes}` : ""}`,
        veterinarianId: "",
        reminderSent: false,
      };

      await addAppointment(newAppointment);

      showNotification(
        "¡Cita agendada exitosamente! Te contactaremos pronto para confirmar.",
        "success",
      );
      setIsSubmitted(true);
    } catch (error) {
      showNotification(
        "Error al agendar la cita. Inténtalo de nuevo.",
        "error",
      );
      console.error("Error creating appointment:", error);
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSelectedService(undefined);
    setFormData({
      ownerName: "",
      petName: "",
      phone: "",
      email: "",
      petType: "",
      petSize: "",
      notes: "",
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-500">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-green-700">
                ¡Cita Registrada Exitosamente!
              </CardTitle>
              <CardDescription className="text-lg">
                Hemos recibido tu solicitud de cita
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                  Resumen de tu cita:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Servicio:
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {services.find((s) => s.id === selectedService)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Precio:</p>
                    <p className="text-lg font-semibold text-green-600">
                      {services.find((s) => s.id === selectedService)?.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fecha:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedDate &&
                        format(selectedDate, "PPP", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hora:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      ¿Qué sigue ahora?
                    </h4>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1">
                      <li>
                        • Te contactaremos en las próximas 2 horas para
                        confirmar
                      </li>
                      <li>
                        • Recibirás un recordatorio 24 horas antes de tu cita
                      </li>
                      <li>
                        • Podrás hacer cambios hasta 4 horas antes de la cita
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1"
                >
                  Agendar Otra Cita
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <a href="/">Volver al Inicio</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="bg-green-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="space-y-6">
            <Badge className="bg-green-100 text-green-700 text-base px-4 py-2">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Agenda tu cita online
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Reserva tu cita en
              <span className="text-green-600"> 3 simples pasos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Selecciona el servicio, fecha y hora que mejor te convenga. Te
              contactaremos para confirmar todos los detalles.
            </p>
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  +1000 familias atendidas
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Selected Date and Time Summary */}
          {(selectedDate || selectedTime || selectedService) && (
            <Card className="mb-8 shadow-lg border-0 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Resumen de tu cita
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-blue-700">
                      Servicio seleccionado:
                    </Label>
                    <p className="text-sm text-blue-800">
                      {selectedService
                        ? services.find((s) => s.id === selectedService)?.name
                        : "No seleccionado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">
                      Fecha:
                    </Label>
                    <p className="text-sm text-blue-800">
                      {selectedDate
                        ? format(selectedDate, "PPP", { locale: es })
                        : "No seleccionada"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">
                      Hora:
                    </Label>
                    <p className="text-sm text-blue-800">
                      {selectedTime || "No seleccionada"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Service Selection */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-green-500">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Selecciona tu Servicio
                    </CardTitle>
                    <CardDescription className="text-base">
                      Elige el cuidado que necesita tu mascota
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selectedService === service.id;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "border-green-500 bg-green-50 shadow-lg scale-105"
                            : "border-gray-200 hover:border-green-300 hover:shadow-md"
                        }`}
                      >
                        {service.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}

                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? "bg-green-600 text-white border-2 border-green-500"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-900">
                                {service.name}
                              </h3>
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-green-600">
                                    {service.price}
                                  </span>
                                  <span className="text-sm text-gray-400 line-through">
                                    {service.originalPrice}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  {service.durationLabel}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4">
                              {service.description}
                            </p>
                            <div className="space-y-2">
                              {service.features.map((feature, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-2"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-gray-600">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Date and Time */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-green-500">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Fecha y Hora</CardTitle>
                    <CardDescription className="text-base">
                      Selecciona cuándo quieres tu cita
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Selecciona una Fecha
                    </Label>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedTime(undefined); // Reset time when date changes
                        }}
                        disabled={(date) =>
                          date < new Date() || date.getDay() === 0
                        }
                        locale={es}
                        className="rounded-xl border-2 shadow-md"
                      />
                    </div>

                    {/* Show appointments for selected date */}
                    {selectedDate && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CalendarIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Citas para{" "}
                            {format(selectedDate, "PPP", { locale: es })}
                          </span>
                        </div>
                        {getAppointmentsForDate(selectedDate).length > 0 ? (
                          <div className="space-y-1">
                            {getAppointmentsForDate(selectedDate).map(
                              (apt, index) => (
                                <p
                                  key={index}
                                  className="text-xs text-gray-600"
                                >
                                  • {apt.startTime} - {apt.petName} (
                                  {apt.ownerName})
                                </p>
                              ),
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-600">
                            No hay citas programadas
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Horarios Disponibles
                    </Label>

                    {!selectedDate && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          Primero selecciona una fecha para ver los horarios
                          disponibles
                        </p>
                      </div>
                    )}

                    {!selectedService && selectedDate && (
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          Selecciona un servicio para ver la disponibilidad de
                          horarios
                        </p>
                      </div>
                    )}

                    {selectedDate && selectedService && (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          {timeSlots.map((time) => {
                            const isAvailable = isTimeSlotAvailable(
                              selectedDate,
                              time,
                            );
                            const status = getTimeSlotStatus(
                              selectedDate,
                              time,
                            );
                            const isSelected = selectedTime === time;

                            return (
                              <Button
                                key={time}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                disabled={!isAvailable}
                                onClick={() => setSelectedTime(time)}
                                className={`h-12 text-sm relative ${
                                  isSelected
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : isAvailable
                                      ? "hover:border-green-400 hover:bg-green-50"
                                      : status === "past"
                                        ? "opacity-50 cursor-not-allowed bg-gray-100"
                                        : "opacity-50 cursor-not-allowed bg-red-50 border-red-200"
                                }`}
                              >
                                {time}
                                {!isAvailable && (
                                  <span className="absolute -top-1 -right-1">
                                    {status === "past" ? (
                                      <Clock className="w-3 h-3 text-gray-400" />
                                    ) : (
                                      <X className="w-3 h-3 text-red-500" />
                                    )}
                                  </span>
                                )}
                              </Button>
                            );
                          })}
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-green-600 rounded"></div>
                              <span>Disponible</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                              <span>Ocupado</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 bg-gray-100 rounded"></div>
                              <span>Pasado</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Horarios de Atención
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        Lunes a Sábado: 8:00 AM - 8:00 PM | Domingo: Emergencias
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Contact Information */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-green-500">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Información de Contacto
                    </CardTitle>
                    <CardDescription className="text-base">
                      Datos para confirmar y contactarte
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="owner-name" className="text-sm font-medium">
                      Nombre del Propietario *
                    </Label>
                    <Input
                      id="owner-name"
                      placeholder="Tu nombre completo"
                      required
                      value={formData.ownerName}
                      onChange={(e) =>
                        setFormData({ ...formData, ownerName: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pet-name" className="text-sm font-medium">
                      Nombre de la Mascota *
                    </Label>
                    <Input
                      id="pet-name"
                      placeholder="Nombre de tu mascota"
                      required
                      value={formData.petName}
                      onChange={(e) =>
                        setFormData({ ...formData, petName: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Teléfono / WhatsApp *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+51 987 654 321"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pet-type" className="text-sm font-medium">
                      Tipo de Mascota *
                    </Label>
                    <Select
                      required
                      value={formData.petType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, petType: value })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-green-600" />
                            <span>Perro</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cat">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-purple-600" />
                            <span>Gato</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pet-size" className="text-sm font-medium">
                      Tamaño/Raza
                    </Label>
                    <Input
                      id="pet-size"
                      placeholder="Ej: Grande, Mediano, Golden Retriever"
                      value={formData.petSize}
                      onChange={(e) =>
                        setFormData({ ...formData, petSize: e.target.value })
                      }
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Observaciones
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Información adicional sobre tu mascota o la cita..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !selectedDate ||
                      !selectedTime ||
                      !selectedService
                    }
                    className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Agendando Cita...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Confirmar y Agendar Cita
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </>
  );
}
