import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { SimplePawLogo } from "@/components/PetPawLogo";
import {
  Stethoscope,
  Scissors,
  Heart,
  Shield,
  Syringe,
  Camera,
  Home,
  Truck,
  Clock,
  CheckCircle,
  Star,
  Calendar,
  Phone,
  Award,
  Users,
  PawPrint,
  Sparkles,
  Eye,
  Pill,
  Activity,
  Bone,
  Bath,
  Brush,
  Gem,
  Crown
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("medical");

  const serviceCategories = [
    { id: "medical", label: "Servicios Médicos", icon: Stethoscope },
    { id: "grooming", label: "Grooming & Est��tica", icon: Scissors },
    { id: "preventive", label: "Medicina Preventiva", icon: Shield },
    { id: "surgical", label: "Cirugías", icon: Heart },
    { id: "specialty", label: "Especialidades", icon: Award },
    { id: "home", label: "Servicios a Domicilio", icon: Home }
  ];

  const medicalServices = [
    {
      title: "Consulta Veterinaria General",
      description: "Examen médico completo para evaluar la salud integral de tu mascota",
      price: "S/ 60",
      duration: "30-45 min",
      includes: [
        "Examen físico completo",
        "Evaluación del comportamiento",
        "Recomendaciones nutricionales",
        "Plan de tratamiento personalizado",
        "Historial médico digital"
      ],
      icon: Stethoscope,
      popular: true
    },
    {
      title: "Consulta de Especialidad",
      description: "Atención especializada en dermatología, cardiología, neurología y más",
      price: "S/ 120",
      duration: "45-60 min",
      includes: [
        "Consulta con veterinario especialista",
        "Estudios especializados",
        "Diagnóstico avanzado",
        "Tratamiento específico",
        "Seguimiento personalizado"
      ],
      icon: Award,
      badge: "Especialista"
    },
    {
      title: "Medicina Interna",
      description: "Diagnóstico y tratamiento de enfermedades complejas",
      price: "S/ 100",
      duration: "60 min",
      includes: [
        "Análisis de laboratorio",
        "Interpretación de resultados",
        "Plan terapéutico integral",
        "Monitoreo de evolución",
        "Consultas de seguimiento"
      ],
      icon: Activity,
      badge: "Avanzado"
    }
  ];

  const groomingServices = [
    {
      title: "Grooming Completo Premium",
      description: "Servicio integral de estética y cuidado para que tu mascota luzca espectacular",
      price: "S/ 80",
      duration: "2-3 horas",
      includes: [
        "Baño con productos premium",
        "Corte de pelo especializado",
        "Limpieza de oídos",
        "Corte de uñas",
        "Cepillado dental",
        "Perfume hipoalergénico"
      ],
      icon: Crown,
      popular: true
    },
    {
      title: "Baño Terapéutico",
      description: "Baño especializado con productos medicinales para problemas de piel",
      price: "S/ 50",
      duration: "1-1.5 horas",
      includes: [
        "Champú medicinal especializado",
        "Tratamiento para la piel",
        "Secado profesional",
        "Cepillado suave",
        "Hidratación de piel y pelo"
      ],
      icon: Bath,
      badge: "Terapéutico"
    },
    {
      title: "Spa Relajante",
      description: "Experiencia de relajación total para mascotas estresadas",
      price: "S/ 120",
      duration: "3-4 horas",
      includes: [
        "Masaje relajante",
        "Aromaterapia",
        "Baño con sales especiales",
        "Mascarilla facial",
        "Pedicura completa",
        "Sesión de relajación"
      ],
      icon: Sparkles,
      badge: "Luxury"
    }
  ];

  const preventiveServices = [
    {
      title: "Programa de Vacunación",
      description: "Plan completo de vacunación adaptado a la edad y necesidades de tu mascota",
      price: "S/ 45",
      duration: "20 min",
      includes: [
        "Vacunas de calidad internacional",
        "Calendario personalizado",
        "Recordatorios automáticos",
        "Certificado oficial",
        "Registro en carnet de vacunación"
      ],
      icon: Syringe,
      popular: true
    },
    {
      title: "Control de Parásitos",
      description: "Prevención y tratamiento de parásitos internos y externos",
      price: "S/ 35",
      duration: "15 min",
      includes: [
        "Desparasitación interna",
        "Tratamiento antipulgas",
        "Productos de calidad premium",
        "Plan de prevención",
        "Seguimiento trimestral"
      ],
      icon: Shield,
      badge: "Preventivo"
    },
    {
      title: "Chequeo Geriátrico",
      description: "Evaluación especializada para mascotas senior (7+ años)",
      price: "S/ 90",
      duration: "45 min",
      includes: [
        "Análisis de sangre completo",
        "Evaluación cardiovascular",
        "Examen neurológico",
        "Radiografías básicas",
        "Plan de cuidados senior"
      ],
      icon: Heart,
      badge: "Senior"
    }
  ];

  const surgicalServices = [
    {
      title: "Cirugías de Rutina",
      description: "Esterilización, castración y procedimientos menores ambulatorios",
      price: "S/ 350",
      duration: "1-2 horas",
      includes: [
        "Cirugía con anestesia segura",
        "Monitoreo constante",
        "Medicación post-operatoria",
        "Revisiones de control",
        "Atención 24h post-cirugía"
      ],
      icon: Heart,
      popular: true
    },
    {
      title: "Cirugías Especializadas",
      description: "Procedimientos complejos con equipamiento de última tecnología",
      price: "S/ 800",
      duration: "2-4 horas",
      includes: [
        "Evaluación pre-quirúrgica completa",
        "Cirugía con especialista",
        "Tecnología de vanguardia",
        "Cuidados intensivos",
        "Seguimiento especializado"
      ],
      icon: Award,
      badge: "Especializada"
    },
    {
      title: "Cirugías de Emergencia",
      description: "Atención quirúrgica inmediata para casos críticos",
      price: "S/ 600",
      duration: "Variable",
      includes: [
        "Atención inmediata 24/7",
        "Estabilización de emergencia",
        "Cirugía de urgencia",
        "Cuidados críticos",
        "Monitoreo intensivo"
      ],
      icon: Clock,
      badge: "Emergencia"
    }
  ];

  const specialtyServices = [
    {
      title: "Dermatología Veterinaria",
      description: "Diagnóstico y tratamiento de problemas de piel y alergias",
      price: "S/ 120",
      duration: "45 min",
      includes: [
        "Examen dermatológico especializado",
        "Pruebas de alergia",
        "Tratamientos específicos",
        "Productos dermatológicos",
        "Seguimiento personalizado"
      ],
      icon: Eye,
      badge: "Especialidad"
    },
    {
      title: "Cardiología",
      description: "Evaluación y tratamiento de problemas cardiovasculares",
      price: "S/ 150",
      duration: "60 min",
      includes: [
        "Electrocardiograma",
        "Ecocardiografía",
        "Evaluación cardiovascular",
        "Plan de tratamiento cardíaco",
        "Monitoreo especializado"
      ],
      icon: Activity,
      badge: "Cardiología"
    },
    {
      title: "Odontología Veterinaria",
      description: "Cuidado dental profesional y tratamientos especializados",
      price: "S/ 200",
      duration: "90 min",
      includes: [
        "Limpieza dental profunda",
        "Radiografías dentales",
        "Extracciones si necesario",
        "Tratamiento periodontal",
        "Plan de higiene dental"
      ],
      icon: Gem,
      badge: "Dental"
    }
  ];

  const homeServices = [
    {
      title: "Consulta a Domicilio",
      description: "Atención veterinaria en la comodidad de tu hogar",
      price: "S/ 120",
      duration: "45-60 min",
      includes: [
        "Consulta en tu domicilio",
        "Examen médico completo",
        "Medicamentos si es necesario",
        "Recomendaciones personalizadas",
        "Seguimiento telefónico"
      ],
      icon: Home,
      popular: true
    },
    {
      title: "Vacunación a Domicilio",
      description: "Aplicación de vacunas en la comodidad de tu hogar",
      price: "S/ 80",
      duration: "20-30 min",
      includes: [
        "Transporte de vacunas refrigeradas",
        "Aplicación profesional",
        "Certificado de vacunación",
        "Observación post-vacunal",
        "Programación de siguiente dosis"
      ],
      icon: Syringe,
      badge: "Domicilio"
    },
    {
      title: "Eutanasia Asistida",
      description: "Acompañamiento profesional y compasivo en momentos difíciles",
      price: "S/ 250",
      duration: "60-90 min",
      includes: [
        "Proceso humanitario y digno",
        "Acompañamiento familiar",
        "Sedación previa",
        "Certificado de defunción",
        "Opciones de cremación"
      ],
      icon: Heart,
      badge: "Compasivo"
    }
  ];

  const getCurrentServices = () => {
    switch (selectedCategory) {
      case "medical": return medicalServices;
      case "grooming": return groomingServices;
      case "preventive": return preventiveServices;
      case "surgical": return surgicalServices;
      case "specialty": return specialtyServices;
      case "home": return homeServices;
      default: return medicalServices;
    }
  };

  const features = [
    {
      icon: Award,
      title: "Veterinarios Certificados",
      description: "Equipo de profesionales con certificaciones internacionales"
    },
    {
      icon: Clock,
      title: "Atención 24/7",
      description: "Emergencias atendidas todos los días del año"
    },
    {
      icon: Shield,
      title: "Tecnología Moderna",
      description: "Equipamiento de última generación para diagnósticos precisos"
    },
    {
      icon: Heart,
      title: "Trato Humanizado",
      description: "Atención cálida y personalizada para cada mascota"
    }
  ];

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 mb-4">
              <PawPrint className="w-4 h-4 mr-1" />
              Servicios Veterinarios Premium
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cuidado Integral para
              <span className="text-green-600"> tu Mascota</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Ofrecemos una amplia gama de servicios veterinarios con los más altos estándares 
              de calidad, tecnología moderna y un equipo apasionado por el bienestar animal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link to="/citas">
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Cita
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contacto">
                  <Phone className="w-5 h-5 mr-2" />
                  Consultar Ahora
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra completa gama de servicios diseñados para mantener a tu mascota sana y feliz
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {serviceCategories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCurrentServices().map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-green-200">
                        <Icon className="w-8 h-8 text-green-600" />
                      </div>
                      {service.badge && (
                        <Badge className="bg-blue-100 text-blue-700">{service.badge}</Badge>
                      )}
                      {service.popular && (
                        <Badge className="bg-yellow-100 text-yellow-700">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-gray-900 mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600">{service.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-green-600">{service.price}</div>
                      <div className="text-sm text-gray-500">{service.duration}</div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <p className="text-sm font-medium text-gray-900">Incluye:</p>
                      {service.includes.map((item, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <Link to="/citas">
                          <Calendar className="w-4 h-4 mr-2" />
                          Agendar
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/contacto">
                          <Phone className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Emergencias Veterinarias 24/7
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Los accidentes no esperan. Nuestro equipo de emergencias está disponible 
            las 24 horas para atender a tu mascota cuando más nos necesite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
              <a href="tel:+51902799296">
                <Phone className="w-5 h-5 mr-2" />
                Emergencias: +51 902 799 296
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
              <a href="https://wa.me/51902799296?text=EMERGENCIA" target="_blank" rel="noopener noreferrer">
                WhatsApp Emergencia
              </a>
            </Button>
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
                  <h3 className="text-xl font-bold text-white">Matis Pet Groomer</h3>
                  <p className="text-sm text-gray-400">Cuidado veterinario de excelencia</p>
                </div>
              </Link>
              <p className="text-gray-400">
                Comprometidos con la salud y felicidad de tu mascota desde 2019.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Servicios</h4>
              <ul className="space-y-2">
                <li><Link to="/servicios" className="hover:text-white transition-colors">Consultas Veterinarias</Link></li>
                <li><Link to="/servicios" className="hover:text-white transition-colors">Grooming Premium</Link></li>
                <li><Link to="/servicios" className="hover:text-white transition-colors">Vacunación</Link></li>
                <li><Link to="/servicios" className="hover:text-white transition-colors">Cirugías</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li><Link to="/citas" className="hover:text-white transition-colors">Agendar Cita</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Portal Clientes</Link></li>
                <li><Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sistema Veterinario</Link></li>
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
                  <span>Lima, Perú</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Matis Pet Groomer. Todos los derechos reservados. | Desarrollado con ❤️ para el cuidado animal</p>
          </div>
        </div>
      </footer>
    </>
  );
}
