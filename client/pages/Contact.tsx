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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { SimplePawLogo } from "@/components/PetPawLogo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Calendar,
  Stethoscope,
  Heart,
  Star,
  Navigation as NavIcon,
  Globe,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    petName: "",
    petType: "",
    service: "",
    message: "",
    urgency: "normal",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono Principal",
      details: ["+51 902 799 296", "Lun - Dom: 8:00 AM - 8:00 PM"],
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp",
      details: ["+51 902 799 296", "Respuesta inmediata 24/7"],
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@matispetgroomer.com", "Respuesta en menos de 2 horas"],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: MapPin,
      title: "Ubicación",
      details: ["San Vicente de Cañete 15700", "Peluquería Canina MATIS"],
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const serviceOptions = [
    "Consulta Veterinaria",
    "Grooming Premium",
    "Vacunación",
    "Cirugía",
    "Emergencia",
    "Control Rutinario",
    "Servicios a Domicilio",
    "Otro",
  ];

  const workingHours = [
    { day: "Lunes - Viernes", time: "8:00 AM - 8:00 PM" },
    { day: "Sábados", time: "9:00 AM - 6:00 PM" },
    { day: "Domingos", time: "10:00 AM - 4:00 PM" },
    { day: "Emergencias", time: "24/7 disponible" },
  ];

  if (isSubmitted) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="text-center p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Mensaje Enviado!
              </h2>
              <p className="text-gray-600 mb-6">
                Gracias por contactarnos. Nos comunicaremos contigo dentro de
                las próximas 2 horas.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/citas">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Cita Directamente
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSubmitted(false)}
                >
                  Enviar Otro Mensaje
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
      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 mb-4">
              <MessageCircle className="w-4 h-4 mr-1" />
              Estamos aquí para ayudarte
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Contáctanos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ¿Tienes alguna pregunta sobre el cuidado de tu mascota? Nuestro
              equipo de expertos está listo para ayudarte en cualquier momento.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <a
                href="https://wa.me/51902799296"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                WhatsApp Directo
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:+51902799296">
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/citas">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Cita Online
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card
                  key={index}
                  className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 ${info.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-8 h-8 ${info.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    {info.details.map((detail, i) => (
                      <p
                        key={i}
                        className={`text-sm ${i === 0 ? "font-medium text-gray-900" : "text-gray-600"}`}
                      >
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    Envíanos un Mensaje
                  </CardTitle>
                  <CardDescription>
                    Completa el formulario y nos pondremos en contacto contigo
                    lo antes posible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="+51 987 654 321"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgencia</Label>
                        <Select
                          value={formData.urgency}
                          onValueChange={(value) =>
                            handleInputChange("urgency", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              Consulta General
                            </SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">Urgente</SelectItem>
                            <SelectItem value="emergency">
                              Emergencia
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="petName">Nombre de la Mascota</Label>
                        <Input
                          id="petName"
                          value={formData.petName}
                          onChange={(e) =>
                            handleInputChange("petName", e.target.value)
                          }
                          placeholder="Nombre de tu mascota"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="petType">Tipo de Mascota</Label>
                        <Select
                          value={formData.petType}
                          onValueChange={(value) =>
                            handleInputChange("petType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dog">Perro</SelectItem>
                            <SelectItem value="cat">Gato</SelectItem>
                            <SelectItem value="bird">Ave</SelectItem>
                            <SelectItem value="rabbit">Conejo</SelectItem>
                            <SelectItem value="hamster">Hámster</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service">Servicio de Interés</Label>
                      <Select
                        value={formData.service}
                        onValueChange={(value) =>
                          handleInputChange("service", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un servicio..." />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceOptions.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Cuéntanos sobre tu consulta o la situación de tu mascota..."
                        rows={5}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-8">
              {/* Working Hours */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Horarios de Atención
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workingHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {schedule.day}
                      </span>
                      <span className="text-sm text-gray-600">
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-0 shadow-lg bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Heart className="w-5 h-5" />
                    Emergencias 24/7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600 mb-4">
                    Para emergencias veterinarias fuera del horario regular,
                    contáctanos inmediatamente:
                  </p>
                  <div className="space-y-2">
                    <Button
                      asChild
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      <a href="tel:+51902799296">
                        <Phone className="w-4 h-4 mr-2" />
                        Emergencias: +51 902 799 296
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <a
                        href="https://wa.me/51902799296?text=EMERGENCIA"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon className="w-4 h-4 mr-2" />
                        WhatsApp Emergencia
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Síguenos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Instagram className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    @MatispetGroomerLima
                  </p>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="border-0 shadow-lg bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Stethoscope className="w-5 h-5" />
                    Consejo del Día
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600">
                    Recuerda mantener actualizadas las vacunas de tu mascota. Un
                    calendario de vacunación al día es la mejor prevención.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestra Ubicación
            </h2>
            <p className="text-gray-600">
              Visítanos en nuestras modernas instalaciones
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Peluquería Canina MATIS
                    </h3>
                    <p className="text-gray-600">
                      San Vicente de Cañete 15700
                    </p>
                    <p className="text-sm text-gray-500">
                      Provincia de Cañete, Lima - Perú
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <NavIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Cómo llegar
                    </h3>
                    <p className="text-gray-600">
                      Desde Lima: Panamericana Sur hasta Cañete
                    </p>
                    <p className="text-sm text-gray-500">
                      Aproximadamente 2 horas desde Lima Centro
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Estacionamiento
                    </h3>
                    <p className="text-gray-600">
                      Estacionamiento gratuito disponible
                    </p>
                    <p className="text-sm text-gray-500">
                      Espacios para 20 vehículos + área para motos
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full md:w-auto">
                <a
                  href="https://www.google.com/maps/place/Peluqueria+Canina+MATIS/@-13.0735007,-76.3879834,15z"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Ver en Google Maps
                </a>
              </Button>
            </div>

            <div className="bg-white rounded-2xl h-96 overflow-hidden shadow-lg border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.4049757085!2d-76.38798342528561!3d-13.073500961865891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x910ff95e6017d359%3A0xe9ed145a60c1ed97!2sPeluqueria%20Canina%20MATIS!5e0!3m2!1ses!2spe!4v1753338945241!5m2!1ses!2spe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Peluquería Canina MATIS en San Vicente de Cañete"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center border-2 border-green-500">
                  <SimplePawLogo className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Matis Pet Groomer
                  </h3>
                  <p className="text-sm text-gray-400">
                    Cuidado veterinario de excelencia
                  </p>
                </div>
              </Link>
              <p className="text-gray-400">
                Comprometidos con la salud y felicidad de tu mascota desde 2019.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/servicios"
                    className="hover:text-white transition-colors"
                  >
                    Consultas Veterinarias
                  </Link>
                </li>
                <li>
                  <Link
                    to="/servicios"
                    className="hover:text-white transition-colors"
                  >
                    Grooming Premium
                  </Link>
                </li>
                <li>
                  <Link
                    to="/servicios"
                    className="hover:text-white transition-colors"
                  >
                    Vacunación
                  </Link>
                </li>
                <li>
                  <Link
                    to="/servicios"
                    className="hover:text-white transition-colors"
                  >
                    Cirugías
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/citas"
                    className="hover:text-white transition-colors"
                  >
                    Agendar Cita
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Portal Clientes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contacto"
                    className="hover:text-white transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Sistema Veterinario
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+51 902 799 296</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>+51 902 799 296</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@matispetgroomer.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>San Vicente de Cañete 15700, Lima</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; 2024 Matis Pet Groomer. Todos los derechos reservados. |
              Desarrollado con ❤️ para el cuidado animal
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
