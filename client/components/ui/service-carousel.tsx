import React, { useCallback, useEffect, useState } from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
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
  options = { loop: true, align: 'center' }
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4">
                <div className="mr-4 h-full">
                  <div className="group relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                    {/* Background decoration */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-blue-50 rounded-full opacity-40 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-green-200 group-hover:bg-green-200">
                        <Icon className="w-10 h-10 text-green-600 group-hover:text-green-700" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-4 group-hover:text-green-700 transition-colors">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-center mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-3">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            </div>
                            <span className="text-sm text-gray-700">{feature}</span>
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

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 shadow-lg"
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 shadow-lg"
        onClick={scrollNext}
        disabled={nextBtnDisabled}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === selectedIndex
                ? "bg-green-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};
