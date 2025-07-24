import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Appointments() {
  const { addAppointment, addOwner, isLoading } = useBusinessData();
  const { showNotification } = useNotifications();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    ownerName: '',
    petName: '',
    phone: '',
    email: '',
    petType: '',
    petSize: '',
    notes: ''
  });

  const services = [
    {
      id: "consulta-veterinaria",
      name: "Consulta Veterinaria",
      description: "Examen médico completo con diagnóstico profesional",
      duration: "30-45 min",
      price: "S/ 60",
      originalPrice: "S/ 80",
      icon: Stethoscope,
      popular: true,
      features: ["Examen físico completo", "Diagnóstico profesional", "Plan de tratamiento", "Consejos de cuidado"]
    },
    {
      id: "grooming-basico",
      name: "Grooming Básico",
      description: "Baño, corte de uñas, limpieza de oídos y peinado básico",
      duration: "1-2 horas",
      price: "S/ 80",
      originalPrice: "S/ 100",
      icon: Scissors,
      popular: false,
      features: ["Baño con shampoo premium", "Corte de uñas", "Limpieza de oídos", "Secado profesional"]
    },
    {
      id: "grooming-completo",
      name: "Grooming Premium",
      description: "Servicio completo con spa, corte especializado y tratamientos",
      duration: "2-3 horas",
      price: "S/ 120",
      originalPrice: "S/ 150",
      icon: Sparkles,
      popular: true,
      features: ["Todo del grooming básico", "Corte de pelo especializado", "Spa relajante", "Perfume para mascotas"]
    },
    {
      id: "vacunacion",
      name: "Vacunación",
      description: "Programa completo de vacunación con certificado oficial",
      duration: "15-30 min",
      price: "S/ 40",
      originalPrice: "S/ 60",
      icon: Heart,
      popular: false,
      features: ["Vacuna importada", "Certificado oficial", "Recordatorio automático", "Seguimiento médico"]
    },
    {
      id: "tratamiento-especializado",
      name: "Tratamiento Especializado",
      description: "Cirugías menores y tratamientos médicos avanzados",
      duration: "1-3 horas",
      price: "S/ 350",
      originalPrice: "S/ 450",
      icon: Shield,
      popular: false,
      features: ["Evaluación pre-quirúrgica", "Anestesia segura", "Cuidado post-operatorio", "Seguimiento 24/7"]
    }
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const testimonials = [
    { name: "María G.", comment: "Excelente atención, muy profesionales", rating: 5 },
    { name: "Carlos M.", comment: "Mi perro siempre sale feliz de aquí", rating: 5 },
    { name: "Ana R.", comment: "Precios justos y servicio de calidad", rating: 5 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedService || !formData.ownerName || !formData.petName || !formData.phone) {
      showNotification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    try {
      // Create owner first (or find existing)
      const newOwner = {
        name: formData.ownerName,
        email: formData.email || '',
        phone: formData.phone,
        address: '',
        pets: []
      };

      await addOwner(newOwner);

      // Create appointment
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      const newAppointment = {
        petId: 'temp-pet-id', // In real app, this would be the actual pet ID
        ownerId: 'temp-owner-id', // In real app, this would be the actual owner ID
        serviceType: selectedService,
        dateTime: appointmentDateTime,
        status: 'scheduled' as const,
        notes: `Mascota: ${formData.petName} (${formData.petType}${formData.petSize ? `, ${formData.petSize}` : ''})${formData.notes ? `\nNotas: ${formData.notes}` : ''}`,
        veterinarianId: '',
        estimatedDuration: 60
      };

      await addAppointment(newAppointment);

      showNotification('¡Cita agendada exitosamente! Te contactaremos pronto para confirmar.', 'success');
      setIsSubmitted(true);
    } catch (error) {
      showNotification('Error al agendar la cita. Inténtalo de nuevo.', 'error');
      console.error('Error creating appointment:', error);
    }
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
              <CardTitle className="text-3xl text-green-700">¡Cita Registrada Exitosamente!</CardTitle>
              <CardDescription className="text-lg">
                Hemos recibido tu solicitud de cita
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Resumen de tu cita:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Servicio:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {services.find(s => s.id === selectedService)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Precio:</p>
                    <p className="text-lg font-semibold text-green-600">
                      {services.find(s => s.id === selectedService)?.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fecha:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedDate && format(selectedDate, "PPP", { locale: es })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hora:</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedTime}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">¿Qué sigue ahora?</h4>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1">
                      <li>• Te contactaremos en las próximas 2 horas para confirmar</li>
                      <li>• Recibirás un recordatorio 24 horas antes de tu cita</li>
                      <li>• Podrás hacer cambios hasta 4 horas antes de la cita</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="flex-1">
                  Agendar Otra Cita
                </Button>
                <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white">
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
              Selecciona el servicio, fecha y hora que mejor te convenga. 
              Te contactaremos para confirmar todos los detalles.
            </p>
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">+1000 familias atendidas</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Service Selection */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-green-500">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Selecciona tu Servicio</CardTitle>
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
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-green-600 text-white border-2 border-green-500"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-green-600">{service.price}</span>
                                  <span className="text-sm text-gray-400 line-through">{service.originalPrice}</span>
                                </div>
                                <Badge variant="outline" className="text-xs mt-1">{service.duration}</Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <div className="space-y-2">
                              {service.features.map((feature, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-gray-600">{feature}</span>
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
                    <Label className="text-lg font-semibold">Selecciona una Fecha</Label>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        locale={es}
                        className="rounded-xl border-2 shadow-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Horarios Disponibles</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className={`h-12 text-sm ${
                            selectedTime === time
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "hover:border-green-400"
                          }`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Horarios de Atención</span>
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
                    <CardTitle className="text-2xl">Información de Contacto</CardTitle>
                    <CardDescription className="text-base">
                      Datos para confirmar y contactarte
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="owner-name" className="text-sm font-medium">Nombre del Propietario *</Label>
                    <Input
                      id="owner-name"
                      placeholder="Tu nombre completo"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pet-name" className="text-sm font-medium">Nombre de la Mascota *</Label>
                    <Input
                      id="pet-name"
                      placeholder="Nombre de tu mascota"
                      required
                      value={formData.petName}
                      onChange={(e) => setFormData({...formData, petName: e.target.value})}
                      className="h-12"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Teléfono / WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+51 987 654 321"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pet-type" className="text-sm font-medium">Tipo de Mascota *</Label>
                    <Select required value={formData.petType} onValueChange={(value) => setFormData({...formData, petType: value})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perro">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-green-600" />
                            <span>Perro</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gato">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-purple-600" />
                            <span>Gato</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="otro">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-4 h-4 text-blue-600" />
                            <span>Otro</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pet-size" className="text-sm font-medium">Tamaño (para grooming)</Label>
                    <Select value={formData.petSize} onValueChange={(value) => setFormData({...formData, petSize: value})}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Tamaño de la mascota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeño">Pequeño (hasta 10kg)</SelectItem>
                        <SelectItem value="mediano">Mediano (10-25kg)</SelectItem>
                        <SelectItem value="grande">Grande (más de 25kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Información Adicional</Label>
                  <Textarea
                    id="notes"
                    placeholder="Cuéntanos sobre tu mascota: edad, raza, alergias, medicamentos, motivo de la consulta, etc."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ¿Todo listo para agendar tu cita?
                    </h3>
                    <p className="text-gray-600">
                      Revisa que toda la información sea correcta antes de confirmar
                    </p>
                  </div>
                  
                  {selectedService && selectedDate && selectedTime && (
                    <div className="bg-white rounded-xl p-6 border border-green-200">
                      <h4 className="font-semibold text-lg mb-4">Resumen de tu cita:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Servicio</p>
                          <p className="font-bold text-green-600">
                            {services.find(s => s.id === selectedService)?.name}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {services.find(s => s.id === selectedService)?.price}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fecha</p>
                          <p className="font-bold text-gray-900">
                            {format(selectedDate, "PPP", { locale: es })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hora</p>
                          <p className="font-bold text-gray-900">{selectedTime}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!selectedService || !selectedDate || !selectedTime || !formData.ownerName || !formData.petName || !formData.phone || isLoading}
                    className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Procesando...' : 'Confirmar Cita'}
                    {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>

                  <p className="text-sm text-gray-500">
                    Al confirmar tu cita aceptas nuestros términos y condiciones. 
                    Te contactaremos para confirmar disponibilidad.
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Testimonials */}
          <Card className="mt-8 shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Lo que dicen nuestros clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 italic mb-2">"{testimonial.comment}"</p>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
