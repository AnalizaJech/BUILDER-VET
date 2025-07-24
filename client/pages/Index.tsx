import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import {
  Heart,
  Scissors,
  Shield,
  Clock,
  Star,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  Users,
  CheckCircle,
  Stethoscope,
  Camera,
  MessageCircle,
  ArrowRight,
  PlayCircle,
  Mail
} from "lucide-react";
import { SimplePawLogo } from "@/components/PetPawLogo";
import { Link } from "react-router-dom";

export default function Index() {
  const services = [
    {
      icon: Stethoscope,
      title: "Consultas Veterinarias",
      description: "Exámenes médicos completos con tecnología de última generación",
      price: "Desde S/ 60",
      features: ["Diagnóstico profesional", "Plan de tratamiento", "Seguimiento personalizado"]
    },
    {
      icon: Scissors,
      title: "Grooming Premium",
      description: "Servicios de estética y cuidado para que tu mascota luzca espectacular",
      price: "Desde S/ 80",
      features: ["Corte especializado", "Baño terapéutico", "Spa relajante"]
    },
    {
      icon: Heart,
      title: "Vacunación y Prevención",
      description: "Protege a tu mascota con nuestro programa completo de vacunación",
      price: "Desde S/ 40",
      features: ["Calendario personalizado", "Recordatorios automáticos", "Certificados oficiales"]
    },
    {
      icon: Shield,
      title: "Cirugías Especializadas",
      description: "Procedimientos quirúrgicos con los más altos estándares de seguridad",
      price: "Desde S/ 350",
      features: ["Quirófano moderno", "Anestesia segura", "Cuidado post-operatorio"]
    }
  ];

  const testimonials = [
    {
      name: "María González",
      pet: "Luna (Gata Persa)",
      comment: "Excelente atención, mi gatita Luna siempre sale feliz de sus citas. El Dr. Carlos es muy profesional.",
      rating: 5,
      petType: "cat"
    },
    {
      name: "Carlos Mendoza",
      pet: "Max (Golden Retriever)",
      comment: "El servicio de grooming es increíble. Max queda como nuevo cada vez. Muy recomendado.",
      rating: 5,
      petType: "dog"
    },
    {
      name: "Ana Rodríguez",
      pet: "Rocky (Bulldog Francés)",
      comment: "Salvaron la vida de Rocky con una cirugía de emergencia. Estoy eternamente agradecida.",
      rating: 5,
      petType: "dog"
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "Más de 5 años de experiencia",
      description: "Equipo veterinario certificado con amplia trayectoria"
    },
    {
      icon: Clock,
      title: "Atención 24/7",
      description: "Emergencias atendidas todos los días del año"
    },
    {
      icon: Users,
      title: "+1000 mascotas felices",
      description: "Familias que confían en nosotros para el cuidado de sus mascotas"
    },
    {
      icon: MapPin,
      title: "Servicio a domicilio",
      description: "Llevamos nuestros servicios hasta la comodidad de tu hogar"
    }
  ];

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-green-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <Award className="w-4 h-4 mr-1" />
                  Clínica Veterinaria #1 en Lima
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  El mejor cuidado para 
                  <span className="text-green-600"> tu mascota</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  En Matis Pet Groomer brindamos atención veterinaria de excelencia con tecnología 
                  moderna y un equipo apasionado por el bienestar animal.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Link to="/citas">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Cita Ahora
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="lg" className="text-lg px-8 py-4 rounded-xl hover:bg-gray-50">
                  <Link to="/login">
                    Acceder al Sistema
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">M</div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">R</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">+1000 familias</p>
                    <p className="text-xs text-gray-500">confían en nosotros</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">4.9/5</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Próxima Cita</h3>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-600">Max - Golden Retriever</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-700">Fecha</span>
                      <span className="text-sm text-green-600">Hoy, 15:30</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">Servicio</span>
                      <span className="text-sm text-blue-600">Consulta + Vacuna</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-700">Veterinario</span>
                      <span className="text-sm text-purple-600">Dr. Carlos</span>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Asistencia
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-4">
              <Sparkles className="w-4 h-4 mr-1" />
              Nuestros Servicios
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cuidado integral para tu mascota
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una gama completa de servicios veterinarios con los más altos 
              estándares de calidad y tecnología moderna
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border-2 border-green-200">
                      <Icon className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{service.title}</CardTitle>
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {service.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center mb-6">{service.description}</p>
                    <div className="space-y-3">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white">
                      <Link to="/citas">
                        Agendar Ahora
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 mb-4">
              <Award className="w-4 h-4 mr-1" />
              ¿Por qué elegirnos?
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              La diferencia que nos distingue
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos comprometemos con la excelencia en cada aspecto del cuidado veterinario
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg border-2 border-green-500">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-100 text-yellow-700 mb-4">
              <MessageCircle className="w-4 h-4 mr-1" />
              Testimonios
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La satisfacción de las familias que confían en nosotros es nuestro mayor logro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                      {testimonial.petType === 'cat' ? (
                        <Heart className="w-6 h-6 text-purple-600" />
                      ) : (
                        <Heart className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.pet}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-green-600 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-300/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <SimplePawLogo className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Más de 1000 familias confían en nosotros</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Tu mascota merece el
                  <span className="block text-yellow-300">
                    mejor cuidado
                  </span>
                </h2>

                <p className="text-xl opacity-90 leading-relaxed">
                  Agenda tu cita en menos de 2 minutos y experimenta la diferencia
                  de una atención veterinaria de clase mundial.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-2xl text-lg px-8 py-6 rounded-2xl font-semibold">
                  <Link to="/citas">
                    <Calendar className="w-6 h-6 mr-3" />
                    Agendar Ahora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-lg px-8 py-6 rounded-2xl font-semibold">
                  <a href="https://wa.me/51902799296" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-6 h-6 mr-3" />
                    WhatsApp
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">4.9</div>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    ))}
                  </div>
                  <div className="text-xs opacity-80">Rating promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-xs opacity-80">Emergencias</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">5+</div>
                  <div className="text-xs opacity-80">Años experiencia</div>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Card */}
            <div className="relative">
              <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-green-400">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">¡Agenda en 2 Minutos!</h3>
                    <p className="text-white/80">Sistema online disponible 24/7</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="w-6 h-6 text-green-300 mr-3" />
                      <span>Confirmación inmediata</span>
                    </div>
                    <div className="flex items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="w-6 h-6 text-green-300 mr-3" />
                      <span>Recordatorios automáticos</span>
                    </div>
                    <div className="flex items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="w-6 h-6 text-green-300 mr-3" />
                      <span>Historial médico digital</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Phone className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                      <div className="text-sm font-semibold">+51 902 799 296</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-purple-300" />
                      <div className="text-sm font-semibold">8:00 - 20:00</div>
                    </div>
                  </div>
                </div>
              </div>
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
