import React, { useCallback, useEffect, useState } from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

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
    align: 'center',
    dragFree: true,
    containScroll: 'trimSnaps'
  }
}) => {
  const autoplayOptions = {
    delay: 4000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
    playOnInit: true
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay(autoplayOptions)
  ]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
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
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y pinch-zoom">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_90%] md:flex-[0_0_60%] lg:flex-[0_0_40%] xl:flex-[0_0_33.333%] pl-4">
                <div className="mr-4 h-full select-none">
                  <div className="group relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 hover:scale-105 h-full cursor-grab active:cursor-grabbing">
                    {/* Animated Background Elements */}
                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-60 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700"></div>
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-50 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-green-50/20 to-blue-50/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      {/* Floating Icon with Pulse Effect */}
                      <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300 rounded-2xl group-hover:scale-110 transition-transform duration-500 animate-pulse"></div>
                        <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 border-2 border-green-300 group-hover:bg-gradient-to-br group-hover:from-green-200 group-hover:to-green-300 shadow-lg group-hover:shadow-xl">
                          <Icon className="w-12 h-12 text-green-700 group-hover:text-green-800 transition-colors duration-300" />
                        </div>
                      </div>
                      
                      {/* Enhanced Title */}
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-6 group-hover:text-green-700 transition-colors duration-300 leading-tight">
                        {service.title}
                      </h3>
                      
                      {/* Stylized Description */}
                      <p className="text-gray-600 text-center mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {service.description}
                      </p>
                      
                      {/* Enhanced Features List */}
                      <div className="space-y-4">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center space-x-4 group/item">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-green-300 group/item:shadow-md">
                              <div className="w-3 h-3 bg-gradient-to-br from-green-600 to-green-700 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-gray-800 transition-colors duration-300 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Dots Indicator */}
      <div className="flex justify-center mt-12 space-x-3">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "relative transition-all duration-500 group",
              index === selectedIndex
                ? "w-12 h-4"
                : "w-4 h-4 hover:w-6"
            )}
            onClick={() => scrollTo(index)}
          >
            <div className={cn(
              "absolute inset-0 rounded-full transition-all duration-500",
              index === selectedIndex
                ? "bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30"
                : "bg-gray-300 group-hover:bg-gray-400 group-hover:shadow-md"
            )}>
              {index === selectedIndex && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
            
            {/* Progress Ring for Active Dot */}
            {index === selectedIndex && (
              <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-spin-slow opacity-50"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Autoplay Status Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Reproducción automática activada</span>
        </div>
      </div>
    </div>
  );
};
