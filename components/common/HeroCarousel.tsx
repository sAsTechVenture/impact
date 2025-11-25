"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { colors } from "@/config/theme";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  type: "image" | "video";
  src: string;
  alt?: string;
}

const heroSlides: HeroSlide[] = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80",
    alt: "Business professionals meeting",
  },
  {
    type: "video",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
    alt: "Team collaboration",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80",
    alt: "Modern office workspace",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1556761175-b3da8d37e024?w=1920&q=80",
    alt: "Business strategy meeting",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    const currentSlideData = heroSlides[currentSlide];
    if (currentSlideData.type === "video" && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      
      // Stop auto-slide when video starts playing
      setIsAutoPlaying(false);
      
      // Play video
      video.play().catch(() => {
        // Auto-play might be blocked by browser, resume auto-slide
        setIsAutoPlaying(true);
      });

      // Resume auto-slide when video ends
      const handleVideoEnd = () => {
        setIsAutoPlaying(true);
      };

      video.addEventListener("ended", handleVideoEnd);

      return () => {
        video.removeEventListener("ended", handleVideoEnd);
      };
    } else {
      // Resume auto-slide for image slides
      setIsAutoPlaying(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {slide.type === "video" ? (
            <video
              ref={index === currentSlide ? videoRef : null}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="auto"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={slide.src}
              alt={slide.alt || `Hero slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Overlay Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in">
            Empowering Innovation
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto animate-fade-in-delay">
            Transforming industries through cutting-edge solutions and strategic
            partnerships
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white hover:bg-gray-100"
              style={{ color: colors.textPrimary }}
            >
              Learn more
            </Button>
            <Button
              size="lg"
              style={{ backgroundColor: colors.primary }}
              className="hover:opacity-90"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        onClick={prevSlide}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={nextSlide}
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {heroSlides.map((_, index) => (
          <Button
            key={index}
            onClick={() => goToSlide(index)}
            variant="ghost"
            size="icon"
            className={`h-2 w-2 rounded-full transition-all duration-300 p-0 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

