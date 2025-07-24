import React, { useCallback, useEffect, useState } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  UserCheck,
  Calendar,
  Award,
  Scissors,
  Sparkles,
  ShieldCheck,
  ClipboardCheck,
  Bell,
  FileText,
  Eye,
  Heart,
  Shield,
  Stethoscope,
  HeartHandshake,
  Activity,
  Syringe,
  X,
} from "lucide-react";

type ServiceCarouselProps = {
  services: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    features: string[];
  }>;
  options?: EmblaOptionsType;
};

export const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  services,
  options = {
    loop: true,
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  },
}) => {
  const autoplayOptions = {
    delay: 3000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    playOnInit: true,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay(autoplayOptions),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className="relative max-w-6xl mx-auto overflow-visible">
      {/* Carousel Container */}
      <div className="overflow-visible py-8" ref={emblaRef}>
        <div className="flex touch-pan-y pinch-zoom overflow-visible">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4 overflow-visible"
              >
                <div className="h-full select-none min-h-[460px] py-6 overflow-visible">
                  <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full cursor-grab active:cursor-grabbing max-w-sm mx-auto min-h-[400px] overflow-visible">
                    {/* Background decoration */}
                    <div className="absolute -top-2 -right-2 w-16 h-16 bg-green-50 rounded-full opacity-60 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-12 h-12 bg-blue-50 rounded-full opacity-40 group-hover:scale-110 transition-transform duration-500"></div>

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-green-200">
                        <Icon className="w-8 h-8 text-green-600 group-hover:text-green-700" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 text-center mb-3 group-hover:text-green-700 transition-colors leading-tight">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-center mb-4 leading-relaxed text-sm">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-3">
                        {service.features.slice(0, 3).map((feature, i) => {
                          // Map features to relevant icons based on content
                          const getFeatureIcon = (
                            feature: string,
                            serviceTitle: string,
                          ) => {
                            const lowerFeature = feature.toLowerCase();
                            const lowerService = serviceTitle.toLowerCase();

                            // Medical/Consultation icons
                            if (lowerFeature.includes("diagnóstico"))
                              return Stethoscope;
                            if (lowerFeature.includes("tratamiento"))
                              return Heart;
                            if (lowerFeature.includes("seguimiento"))
                              return Activity;
                            if (lowerFeature.includes("especializada"))
                              return Award;

                            // Grooming icons
                            if (lowerFeature.includes("corte")) return Scissors;
                            if (lowerFeature.includes("baño")) return Sparkles;
                            if (lowerFeature.includes("spa"))
                              return HeartHandshake;
                            if (
                              lowerFeature.includes("uñas") ||
                              lowerFeature.includes("oídos")
                            )
                              return CheckCircle;

                            // Vaccination icons
                            if (lowerFeature.includes("calendario"))
                              return Calendar;
                            if (lowerFeature.includes("recordatorios"))
                              return Bell;
                            if (lowerFeature.includes("certificados"))
                              return FileText;
                            if (lowerFeature.includes("médico"))
                              return UserCheck;

                            // Surgery icons
                            if (lowerFeature.includes("quirófano"))
                              return Shield;
                            if (lowerFeature.includes("anestesia"))
                              return ShieldCheck;
                            if (lowerFeature.includes("post-operatorio"))
                              return ClipboardCheck;
                            if (lowerFeature.includes("monitoreo"))
                              return Activity;

                            // Special treatments
                            if (lowerFeature.includes("fisioterapia"))
                              return HeartHandshake;
                            if (lowerFeature.includes("holística"))
                              return Sparkles;
                            if (lowerFeature.includes("regenerativos"))
                              return Heart;
                            if (lowerFeature.includes("geriátricos"))
                              return Shield;

                            // Diagnostics
                            if (
                              lowerFeature.includes("rayos") ||
                              lowerFeature.includes("x")
                            )
                              return Eye;
                            if (lowerFeature.includes("ecografías"))
                              return Activity;
                            if (lowerFeature.includes("análisis"))
                              return ClipboardCheck;
                            if (lowerFeature.includes("imágenes")) return Eye;

                            // Default icon
                            return CheckCircle;
                          };

                          const FeatureIcon = getFeatureIcon(
                            feature,
                            service.title,
                          );

                          return (
                            <div
                              key={i}
                              className="flex items-center space-x-3"
                            >
                              <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                                <FeatureIcon className="w-3 h-3 text-green-600" />
                              </div>
                              <span className="text-xs text-gray-700 group-hover:text-gray-800 transition-colors">
                                {feature}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Dots Indicator */}
      <div className="flex justify-center mt-12 space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "relative transition-all duration-300",
              index === selectedIndex ? "w-8 h-3" : "w-3 h-3 hover:w-4",
            )}
            onClick={() => scrollTo(index)}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-300",
                index === selectedIndex
                  ? "bg-green-600 shadow-lg"
                  : "bg-gray-300 hover:bg-gray-400",
              )}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};
