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
  X
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
    <div className="relative max-w-6xl mx-auto">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y pinch-zoom">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
              >
                <div className="h-full select-none min-h-[420px]">
                  <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full cursor-grab active:cursor-grabbing max-w-sm mx-auto min-h-[400px]">
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
                      <div className="space-y-2">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-700">
                              {feature}
                            </span>
                          </div>
                        ))}
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
      <div className="flex justify-center mt-8 space-x-2">
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
